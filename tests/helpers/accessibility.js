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

function findKnownIssue(violation, pagePath) {
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
 */
export async function checkAccessibility(world, label = '') {
  const { page } = world
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

  await report(`Accessibility scan${label}: ${pagePath}`, {
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
  { name: 'narrow portrait', width: 320, height: 568 },
  { name: 'narrow landscape', width: 568, height: 320 }
]

/**
 * WCAG 1.4.10 Reflow and 1.3.4 Orientation: scans the page at the two narrow
 * sizes GOV.UK services are tested at, and fails if the page needs horizontal
 * scrolling. The original viewport is restored afterwards.
 *
 * @param {import('@cucumber/cucumber').World} world Cucumber world, needs `page` and `attach`
 */
export async function checkReflow(world) {
  const { page } = world
  const original = page.viewportSize()
  const failures = []

  try {
    for (const { name, width, height } of NARROW_VIEWPORTS) {
      await page.setViewportSize({ width, height })

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      }))
      if (overflow.scrollWidth > overflow.innerWidth + 1) {
        failures.push(
          `${name} (${width}x${height}): page scrolls horizontally (content ${overflow.scrollWidth}px wide in a ${overflow.innerWidth}px viewport)`
        )
      }

      try {
        await checkAccessibility(world, ` at ${name} ${width}x${height}`)
      } catch (error) {
        failures.push(`${name} (${width}x${height}): ${error.message}`)
      }
    }
  } finally {
    if (original) await page.setViewportSize(original)
  }

  if (failures.length > 0) {
    throw new Error(failures.join('\n\n'))
  }
}
