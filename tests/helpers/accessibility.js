import AxeBuilder from '@axe-core/playwright'
import { KNOWN_ACCESSIBILITY_ISSUES } from './accessibility-known-issues.js'

// Axe tags are not cumulative, so AA means listing every level up to it.
// best-practice adds axe's non-WCAG rules, such as landmarks.
export const AXE_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
  'best-practice'
]

// Allure uses the attachment name as a file name, so keep ":" and "/" out of it
export function reportName(prefix, pageUrl) {
  const path = new URL(pageUrl).pathname.replace(/[:/\\]+/g, ' ').trim()
  return `${prefix} ${path || 'home'}`
}

// Pages are server rendered, but wait for load (images, stylesheets, third
// party scripts) and the main landmark so a scan never runs on a half-built page
export async function waitForPageReady(page) {
  await page.waitForLoadState('load')
  await page.locator('main').first().waitFor({ state: 'visible' })
}

export function findKnownIssue(violation, pagePath) {
  return KNOWN_ACCESSIBILITY_ISSUES.find(
    (issue) =>
      issue.ruleId === violation.id &&
      (!issue.pathPattern || issue.pathPattern.test(pagePath))
  )
}

function toReportable({ id, impact, help, helpUrl, nodes }) {
  return {
    id,
    impact,
    help,
    helpUrl,
    targets: nodes.map((node) => node.target.join(' '))
  }
}

function summarise(violations, pageUrl) {
  const lines = violations.map(
    (v) =>
      `- [${v.impact}] ${v.id}: ${v.help} (${v.targets.length} element(s))\n` +
      `  ${v.helpUrl}\n` +
      v.targets.map((target) => `    ${target}`).join('\n')
  )
  return `${violations.length} accessibility violation(s) on ${pageUrl}\n${lines.join('\n')}`
}

/**
 * Scans the current page with axe-core, attaches the results to the Allure
 * report and throws if any violation is not a documented known issue.
 *
 * @param {import('@cucumber/cucumber').World} world Cucumber world, needs `page` and `attach`
 * @param {string} [label] Added to the report name, for example " at narrow portrait 320x568"
 */
export async function checkAccessibility(world, label = '') {
  const { page } = world
  await waitForPageReady(page)
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()

  // A scan that evaluated nothing must not pass silently
  if (results.passes.length === 0 && results.violations.length === 0) {
    throw new Error(`Accessibility scan evaluated no rules on ${page.url()}`)
  }

  const pageUrl = page.url()
  const pagePath = new URL(pageUrl).pathname
  const known = []
  const failing = []

  for (const violation of results.violations) {
    const issue = findKnownIssue(violation, pagePath)
    if (issue) {
      known.push({
        ...toReportable(violation),
        justification: issue.justification,
        ticket: issue.ticket
      })
    } else {
      failing.push(toReportable(violation))
    }
  }

  const report = (name, data) =>
    world.attach(JSON.stringify(data, null, 2), {
      mediaType: 'application/json',
      fileName: name
    })

  await report(reportName(`Accessibility scan${label}`, pageUrl), {
    url: pageUrl,
    tags: AXE_TAGS,
    violations: failing,
    knownIssues: known,
    passes: results.passes.length,
    incomplete: results.incomplete.map(({ id, help }) => ({ id, help }))
  })

  if (failing.length > 0) {
    throw new Error(summarise(failing, pageUrl))
  }
}

const NARROW_VIEWPORTS = [
  { name: 'narrow portrait', width: 320, height: 568, runAxe: true },
  // Axe rules mostly don't change with width, so landscape only checks overflow
  { name: 'narrow landscape', width: 568, height: 320, runAxe: false }
]

/**
 * WCAG 1.4.10 Reflow and 1.3.4 Orientation: fails if the page needs
 * horizontal scrolling at the two narrow sizes GOV.UK services are tested at,
 * and runs axe once at 320x568. Overflow problems are listed first. The
 * original viewport is restored afterwards.
 *
 * @param {import('@cucumber/cucumber').World} world Cucumber world, needs `page` and `attach`
 */
export async function checkReflow(world) {
  const { page } = world
  await waitForPageReady(page)
  const original = page.viewportSize()
  const overflowFailures = []
  const axeFailures = []

  try {
    for (const { name, width, height, runAxe } of NARROW_VIEWPORTS) {
      await page.setViewportSize({ width, height })

      // WCAG 1.4.10 exempts content that needs two dimensions, such as data
      // tables and maps, so only page-level horizontal scrolling counts here.
      // The 1px allows for rounding.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      }))
      if (overflow.scrollWidth > overflow.innerWidth + 1) {
        overflowFailures.push(
          `${name} (${width}x${height}): page scrolls horizontally (content ${overflow.scrollWidth}px wide in a ${overflow.innerWidth}px viewport)`
        )
      }

      if (runAxe) {
        try {
          await checkAccessibility(world, ` at ${name} ${width}x${height}`)
        } catch (error) {
          axeFailures.push(`${name} (${width}x${height}): ${error.message}`)
        }
      }
    }
  } finally {
    if (original) await page.setViewportSize(original)
  }

  const failures = [...overflowFailures, ...axeFailures]
  if (failures.length > 0) {
    throw new Error(failures.join('\n\n'))
  }
}
