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
  // Real BrowserStack devices allow one browser context and one tab. Desktop browsers get a fresh
  // context per test as normal. A device that refuses one has its single context reused and its
  // cookies cleared, so tests stay isolated.
  context: async ({ browser, contextOptions, baseURL }, use) => {
    let context
    try {
      context = await browser.newContext({ ...contextOptions, baseURL })
    } catch (error) {
      if (!/Only one browser context/i.test(error.message)) throw error
    }

    if (context) {
      await use(context)
      await context.close()
      return
    }

    const shared = browser.contexts()[0]
    await shared.clearCookies()
    await use(shared)
    await shared.clearCookies()
  },

  page: async ({ context }, use) => {
    const existing = context.pages()[0]
    if (!existing) {
      await use(await context.newPage())
      return
    }
    await use(existing)
    await existing.goto('about:blank').catch(() => {})
  },

  // Runs for every test. On failure it records where the browser was and which BrowserStack
  // session to open. The triage reporter adds this to the failure log.
  diagnostics: [
    async ({ page }, use, testInfo) => {
      await use()
      if (testInfo.status === testInfo.expectedStatus) return

      const details = {}
      // A hung device must not hold up the rest of the run.
      const within = (promise) =>
        Promise.race([
          promise,
          new Promise((_resolve, reject) =>
            setTimeout(() => reject(new Error('timed out')), 5000)
          )
        ])
      try {
        details.url = page.url()
        details.title = await within(page.title())
        const raw = await within(
          page.evaluate(
            () => {},
            'browserstack_executor: {"action": "getSessionDetails"}'
          )
        )
        const session = JSON.parse(raw)
        details.session = session.browser_url ?? session.hashed_id
      } catch {
        // The session may already be closed. The failure is still logged without these fields.
      }
      await testInfo.attach('diagnostics', {
        body: JSON.stringify(details),
        contentType: 'application/json'
      })
    },
    { auto: true }
  ],

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
