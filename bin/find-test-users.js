#!/usr/bin/env node
/* eslint-disable no-console */
// Read-only. Finds test users by the state of their data.
//
// For each CRN it signs in once, then looks at where the change links on
// /personal-details and /business-details point:
//   - /personal-fix or /business-fix  -> the data fails validation and the
//     frontend sends the user to the fix journey (interrupter)
//   - /business-name-change           -> the user can make legal changes
//
// It never submits a form and never retries a failed sign-in, so it will not
// lock accounts. It stops after 3 failed sign-ins in a row.
//
// Usage:
//   node bin/find-test-users.js crns.txt                 one CRN per line
//   node bin/find-test-users.js crns.txt --limit 50 --start 100 --concurrency 2
//
// The password comes from USER_FIX_PASSWORD, or USER_STANDARD_PASSWORD.
// Results are printed as a table without passwords. Add --json to print JSON.

import fs from 'node:fs'
import { chromium } from 'playwright'
import { TEST_SUITE_BASE_URL } from '../tests/helpers/helpers.js'

const args = process.argv.slice(2)
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? fallback : args[index + 1]
}
const file = args.find(
  (arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--')
)
const start = Number(option('start', 0))
const limit = Number(option('limit', 50))
const concurrency = Number(option('concurrency', 2))
const asJson = args.includes('--json')
const password =
  process.env.USER_FIX_PASSWORD || process.env.USER_STANDARD_PASSWORD

if (!file || !password) {
  console.error(
    'Usage: node bin/find-test-users.js <crn-file> [--start n] [--limit n] [--concurrency n] [--json]\n' +
      'Set USER_FIX_PASSWORD or USER_STANDARD_PASSWORD.'
  )
  process.exit(2)
}

const crns = fs
  .readFileSync(file, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .slice(start, start + limit)

async function changeLinks(page, path) {
  await page.goto(`${TEST_SUITE_BASE_URL}${path}`, {
    waitUntil: 'domcontentloaded'
  })
  const links = await page
    .locator('main a')
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href') || ''))
  return links.filter((href) => /change|fix/.test(href))
}

function fixSources(links, journey) {
  const pattern = new RegExp(`/${journey}\\?source=(\\w+)`)
  return links.map((href) => href.match(pattern)?.[1]).filter(Boolean)
}

async function classify(browser, crn) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()
  const result = { crn }
  try {
    await page.goto(`${TEST_SUITE_BASE_URL}/`, {
      waitUntil: 'domcontentloaded'
    })
    await page.locator('#main-content > div > div > a').click()
    await page.locator('#crn').fill(crn)
    await page.locator('#password').fill(password)
    await page.locator('#next').click()
    await page.waitForURL(/\/home$/, { timeout: 30000 })

    const personal = await changeLinks(page, '/personal-details')
    const business = await changeLinks(page, '/business-details')
    result.status = 'ok'
    result.personalFix = personal.some((href) => href.includes('/personal-fix'))
    result.businessFix = business.some((href) => href.includes('/business-fix'))
    result.personalFixSources = fixSources(personal, 'personal-fix')
    result.businessFixSources = fixSources(business, 'business-fix')
    result.legalChanges = business.some((href) =>
      href.includes('/business-name-change')
    )
    result.businessLinks = business.length
  } catch {
    // locked, no business, business picker, or wrong password
    result.status = 'no-sign-in'
  } finally {
    await context.close()
  }
  return result
}

const browser = await chromium.launch({ headless: true })
const results = []
let failedInARow = 0
let next = 0

await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (failedInARow < 3 && next < crns.length) {
      const result = await classify(browser, crns[next++])
      failedInARow = result.status === 'ok' ? 0 : failedInARow + 1
      results.push(result)
    }
  })
)
await browser.close()

if (asJson) {
  console.log(JSON.stringify(results, null, 2))
} else {
  const ok = results.filter((r) => r.status === 'ok')
  const label = (r) =>
    [
      r.personalFix
        ? `personal-fix(${r.personalFixSources.join(',') || '-'})`
        : 'personal-valid',
      r.businessFix
        ? `business-fix(${r.businessFixSources.join(',') || '-'})`
        : 'business-valid',
      r.legalChanges ? 'legal-changes' : 'no-legal-changes'
    ].join(' ')
  for (const r of results) {
    console.log(r.crn, r.status === 'ok' ? label(r) : r.status)
  }
  console.log(
    `\nChecked ${results.length}: ${ok.length} signed in, ` +
      `${ok.filter((r) => r.personalFix).length} personal-fix, ` +
      `${ok.filter((r) => r.businessFix).length} business-fix, ` +
      `${ok.filter((r) => !r.personalFix && !r.businessFix).length} valid`
  )
  if (failedInARow >= 3)
    console.log('Stopped early after 3 failed sign-ins in a row.')
}
