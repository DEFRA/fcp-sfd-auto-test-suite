/**
 * Accepted accessibility violations that must not fail the build.
 *
 * Every entry needs a justification and a ticket so it can be revisited.
 * Known issues are still scanned and attached to the Allure report; they just
 * do not fail the scenario. Entries are checked when this file loads.
 *
 * Entry shape:
 *   ruleId         axe rule id, e.g. 'color-contrast'
 *   justification  why the violation is accepted
 *   ticket         Jira key tracking the fix, e.g. 'FLS2-123'
 *   pathPattern    optional RegExp matched against the page path, to limit
 *                  the exemption to specific pages
 */
const KNOWN_ISSUES = []

const TICKET_KEY = /^[A-Z][A-Z0-9]+-\d+$/

export function validateKnownIssues(issues) {
  issues.forEach((issue, index) => {
    const name = `Known accessibility issue ${index + 1} (${issue?.ruleId ?? 'no ruleId'})`
    for (const field of ['ruleId', 'justification']) {
      if (typeof issue?.[field] !== 'string' || issue[field].trim() === '') {
        throw new Error(`${name} needs a ${field}`)
      }
    }
    if (!TICKET_KEY.test(issue.ticket ?? '')) {
      throw new Error(`${name} needs a Jira ticket key such as FLS2-123`)
    }
    if (
      issue.pathPattern !== undefined &&
      !(issue.pathPattern instanceof RegExp)
    ) {
      throw new Error(`${name} has a pathPattern that is not a RegExp`)
    }
  })
  return Object.freeze([...issues])
}

export const KNOWN_ACCESSIBILITY_ISSUES = validateKnownIssues(KNOWN_ISSUES)
