#!/usr/bin/env node
/* eslint-disable no-console */
// Repairs test users whose personal details fail validation in the frontend.
//
// When the personal details interrupter is enabled, a user with invalid
// personal details is sent to the /personal-fix journey instead of the
// individual change pages, which breaks the journey tests for that worker.
// This script logs in as each configured test user, completes the fix
// journey with valid values where required, and checks the result.
//
// Usage:
//   node bin/fix-test-users.js              fix every configured user
//   node bin/fix-test-users.js --dry-run    report status only
//   node bin/fix-test-users.js STANDARD_2   limit to named users

import { chromium } from 'playwright'
import { TEST_SUITE_BASE_URL } from '../tests/helpers/helpers.js'

const VALID_DETAILS = {
  first: 'Test',
  middle: '',
  last: 'User',
  address1: '1 Test Street',
  address2: '',
  address3: '',
  city: 'Bristol',
  county: '',
  postcode: 'BS1 5AH',
  country: 'United Kingdom',
  personalTelephone: '01234567890',
  personalMobile: '07123456789',
  personalEmail: 'sfd.test.user@test.com',
  day: '1',
  month: '1',
  year: '1980'
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const only = args.filter((arg) => !arg.startsWith('--'))

function configuredUsers() {
  const users = []
  for (let i = 1; i <= 4; i++) {
    users.push({
      label: `STANDARD_${i}`,
      crn: process.env[`USER_STANDARD_${i}_CRN`],
      password: process.env.USER_STANDARD_PASSWORD
    })
    users.push({
      label: `AMEND_${i}`,
      crn: process.env[`USER_AMEND_${i}_CRN`],
      password: process.env.USER_AMEND_PASSWORD,
      sbi: process.env[`USER_AMEND_${i}_SBI`]
    })
    users.push({
      label: `VIEW_${i}`,
      crn: process.env[`USER_VIEW_${i}_CRN`],
      password: process.env.USER_VIEW_PASSWORD,
      sbi: process.env[`USER_VIEW_${i}_SBI`]
    })
  }

  const seen = new Set()
  return users.filter((user) => {
    if (only.length && !only.includes(user.label)) return false
    if (!user.crn || !user.password) {
      console.log(`${user.label}: skipped, credentials not set`)
      return false
    }
    // personal details belong to the CRN, so each CRN only needs one pass
    if (seen.has(user.crn)) return false
    seen.add(user.crn)
    return true
  })
}

async function login(page, { crn, password, sbi }) {
  await page.goto(`${TEST_SUITE_BASE_URL}/`)
  await page.locator('#main-content > div > div > a').click()
  await page.locator('#crn').fill(crn)
  await page.locator('#password').fill(password)
  await page.locator('#next').click()

  if (sbi) {
    await page
      .locator(`//label[contains(normalize-space(), "SBI ${sbi}")]`)
      .click()
    await page.locator('#continueReplacement').click()
  }

  await page.waitForURL('**/home')
}

async function fullNameLinkTarget(page) {
  await page.goto(`${TEST_SUITE_BASE_URL}/personal-details`)
  const href = await page
    .getByRole('link', { name: 'Full name' })
    .getAttribute('href')
  return href
}

async function completeFixJourney(page) {
  await page.goto(`${TEST_SUITE_BASE_URL}/personal-fix?source=name`)
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('**/personal-fix-list')

  const filled = []
  for (const [name, value] of Object.entries(VALID_DETAILS)) {
    const input = page.locator(`form input[name="${name}"]`)
    if ((await input.count()) === 0) continue
    await input.fill(value)
    filled.push(name)
  }

  await page.getByRole('button', { name: 'Continue' }).click()

  const errorSummary = page.locator('.govuk-error-summary')
  if (await errorSummary.isVisible()) {
    throw new Error(
      `fix form rejected values: ${(await errorSummary.innerText()).replace(/\s+/g, ' ')}`
    )
  }

  await page.waitForURL('**/personal-fix-check')
  await page.getByRole('button', { name: 'Submit' }).click()
  await page.waitForLoadState('domcontentloaded')

  return filled
}

async function processUser(browser, user) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  try {
    await login(page, user)

    const before = await fullNameLinkTarget(page)
    if (!before.startsWith('/personal-fix')) {
      console.log(`${user.label}: OK, personal details are valid`)
      return true
    }

    if (dryRun) {
      console.log(`${user.label}: NEEDS FIX, routed to ${before}`)
      return false
    }

    const filled = await completeFixJourney(page)
    const after = await fullNameLinkTarget(page)
    if (after.startsWith('/personal-fix')) {
      console.log(
        `${user.label}: FAILED, still routed to ${after} after updating ${filled.join(', ')}`
      )
      return false
    }

    console.log(`${user.label}: FIXED, updated ${filled.join(', ')}`)
    return true
  } catch (error) {
    console.log(`${user.label}: ERROR, ${error.message.split('\n')[0]}`)
    return false
  } finally {
    await context.close()
  }
}

const browser = await chromium.launch({ headless: true })
let allOk = true
for (const user of configuredUsers()) {
  allOk = (await processUser(browser, user)) && allOk
}
await browser.close()

process.exit(allOk ? 0 : 1)
