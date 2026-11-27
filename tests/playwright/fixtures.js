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

const DEVICE_AGENT = /iPhone|iPad|Android/i
const IOS_AGENT = /iPhone|iPad/i

// Set once a worker finds it is on a real device. Each worker is its own process, so it stays
// true for every test that worker runs.
let singleContextDevice = false

// On real iPhones BrowserStack answers "No elements found" to any selector with Playwright's
// exact (case-sensitive) name match, while the default match works. Specs ask for exact matches
// so desktop browsers stay strict, so on iOS only, the exact flag is dropped.
async function relaxExactMatchOnIos(page) {
  if (page.exactMatchRelaxed) return
  const agent = await page.evaluate(() => navigator.userAgent).catch(() => '')
  if (!IOS_AGENT.test(agent)) return

  page.exactMatchRelaxed = true
  for (const method of ['getByRole', 'getByLabel']) {
    const original = page[method].bind(page)
    page[method] = (target, options) =>
      original(target, options?.exact ? { ...options, exact: false } : options)
  }
}

// Value shown next to a label in a GOV.UK summary list.
export function summaryValue(page, label) {
  return page.locator(`dt:text-is("${label}") + dd`)
}

// A field can be switched off on purpose (for example during a DAL incident). The frontend then
// hides its link and shows a banner naming the first switched-off field. If the link is there, the
// update runs. If it is missing, the test is skipped only when the banner names this exact field.
// Any other case (link missing and banner names another field, or no banner) fails, so a real bug
// is never hidden. fieldName must match the frontend display name, for example "business name".
export async function openChangePage(page, name, fieldName) {
  const link = page.getByRole('link', { name })
  const banner = page.getByText(`You cannot update your ${fieldName} right now`)
  await expect(
    link.or(banner).first(),
    `Neither a "${fieldName}" change link nor its switched-off banner is on the page`
  ).toBeVisible()
  if ((await link.count()) === 0) {
    base.info().annotations.push({ type: 'toggle-off', description: fieldName })
    base.skip(true, `Updating ${fieldName} is switched off by feature toggle`)
  }
  await link.click()
}

export async function expectErrorSummary(page, message) {
  await expect(page.locator('.govuk-error-summary__list li')).toHaveText(
    message
  )
}

export const test = base.extend({
  // Desktop browsers get a fresh context per test and close it afterwards. A real BrowserStack
  // device allows one context and one tab. Closing it leaves Safari with no tab, so the next test
  // in that worker cannot create another. A device keeps its single context and clears cookies
  // between tests, so tests stay isolated.
  context: async ({ browser, contextOptions, baseURL }, use) => {
    let shared
    if (!singleContextDevice) {
      let created
      try {
        created = await browser.newContext({ ...contextOptions, baseURL })
      } catch (error) {
        if (!/Only one browser context/i.test(error.message)) throw error
        singleContextDevice = true
      }

      if (created) {
        const agent = await created
          .newPage()
          .then((page) => page.evaluate(() => navigator.userAgent))
          .catch(() => '')
        if (!DEVICE_AGENT.test(agent)) {
          await use(created)
          await created.close()
          return
        }
        singleContextDevice = true
        shared = created
      }
    }

    shared ??= browser.contexts()[0]
    if (!shared)
      throw new Error('The device has no open browser context to reuse')
    await shared.clearCookies()
    await use(shared)
    await shared.clearCookies()
  },

  page: async ({ context }, use) => {
    const existing = context.pages()[0]
    const page = existing ?? (await context.newPage())
    if (singleContextDevice) await relaxExactMatchOnIos(page)
    await use(page)
    if (existing) await existing.goto('about:blank').catch(() => {})
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
        // The OIDC callback URL carries a code and state, so keep only origin and path.
        const { origin, pathname } = new URL(page.url())
        details.url = origin + pathname
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
