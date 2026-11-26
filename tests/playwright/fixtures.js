import { test as base, expect } from '@playwright/test'

// One CDP standard user per Playwright worker, so tests running at the same time
// don't overwrite each other's data.
function standardUser(parallelIndex) {
  const crns = [1, 2, 3, 4].map((n) => process.env[`USER_STANDARD_${n}_CRN`])
  return {
    crn: crns[parallelIndex % crns.length],
    password: process.env.USER_STANDARD_PASSWORD
  }
}

// Value shown next to a label in a GOV.UK summary list.
export function summaryValue(page, label) {
  return page.locator(`dt:text-is("${label}") + dd`)
}

export async function expectErrorSummary(page, message) {
  await expect(page.locator('.govuk-error-summary__list li')).toHaveText(
    message
  )
}

export const test = base.extend({
  // A page that is already signed in. Each test gets a fresh context, so tests stay isolated.
  signedInPage: async ({ page }, use, testInfo) => {
    const { crn, password } = standardUser(testInfo.parallelIndex)
    await page.goto('/')
    await page.getByRole('button', { name: 'Start now' }).click()
    // The DEFRA ID form is not ours, so its element ids are the only stable hooks.
    // iOS fill() does not wait for the page, so assert the field is visible first.
    const crnField = page.locator('#crn')
    await expect(crnField).toBeVisible()
    await crnField.fill(crn)
    await page.locator('#password').fill(password)
    await page.locator('#next').click()
    await expect(page).toHaveURL(/\/home/)
    await use(page)
  },

  businessDetailsPage: async ({ signedInPage }, use) => {
    await signedInPage
      .getByRole('link', {
        name: 'View and update your business details',
        exact: true
      })
      .click()
    await expect(signedInPage).toHaveURL(/\/business-details/)
    await use(signedInPage)
  },

  personalDetailsPage: async ({ signedInPage }, use) => {
    await signedInPage
      .getByRole('link', {
        name: 'View and update your personal details',
        exact: true
      })
      .click()
    await expect(signedInPage).toHaveURL(/\/personal-details/)
    await use(signedInPage)
  }
})

export { expect }
