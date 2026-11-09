/**
 * Accepted accessibility violations that must not fail the build.
 *
 * Every entry needs a justification and a ticket so it can be revisited.
 * Known issues are still scanned and attached to the Allure report; they just
 * do not fail the scenario.
 *
 * Entry shape:
 *   ruleId         axe rule id, e.g. 'color-contrast'
 *   justification  why the violation is accepted
 *   ticket         Jira key tracking the fix
 *   pathPattern    optional RegExp matched against the page path, to limit
 *                  the exemption to specific pages
 */
export const KNOWN_ACCESSIBILITY_ISSUES = []
