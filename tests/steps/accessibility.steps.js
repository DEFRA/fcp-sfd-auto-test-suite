import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { checkAccessibility, checkReflow } from '../helpers/accessibility.js'
import { checkKeyboardOperability } from '../helpers/keyboard.js'
import {
  loginAsStandardUser,
  loginAsNamedUser,
  TEST_SUITE_BASE_URL
} from '../helpers/helpers.js'

const PAGE_PATHS = {
  PersonalDetails: '/personal-details',
  BusinessDetails: '/business-details'
}

async function openDetailsPage(world, pageName) {
  const path = PAGE_PATHS[pageName]
  if (!path) throw new Error(`Unknown page: ${pageName}`)
  await world.page.waitForURL('**/home')
  const response = await world.page.goto(`${TEST_SUITE_BASE_URL}${path}`)
  // Error pages keep the URL they were requested at, so check the status too
  if (!response?.ok()) {
    throw new Error(
      `${path} returned ${response?.status() ?? 'no response'}, not a normal page`
    )
  }
  await expect(world.page).toHaveURL(new RegExp(`${path}$`))
}

// A repaired user still loads /personal-fix, so check the fix links are really there
async function expectPersonalFixLinks(page) {
  await expect(
    page.locator('main a[href^="/personal-fix?source="]').first()
  ).toBeVisible()
}

Then('the page should have no accessibility violations', async function () {
  await checkAccessibility(this)
})

Then(
  'the page should have no accessibility violations on narrow screens',
  async function () {
    await checkReflow(this)
  }
)

Then('the page should be fully operable with the keyboard', async function () {
  await checkKeyboardOperability(this)
})

Then('the page should declare a language and a skip link', async function () {
  await expect(this.page.locator('html')).toHaveAttribute('lang', /^en/)
  await expect(this.page.locator('a.govuk-skip-link')).toHaveCount(1)
})

Given(
  'I sign in as a standard user and open the {string} page',
  async function (pageName) {
    await loginAsStandardUser(this.page)
    await openDetailsPage(this, pageName)
  }
)

Then('the page should link to the personal fix journey', async function () {
  await expectPersonalFixLinks(this.page)
})

When('I open the personal fix journey for {string}', async function (source) {
  await expectPersonalFixLinks(this.page)
  await this.page.goto(`${TEST_SUITE_BASE_URL}/personal-fix?source=${source}`)
  await expect(this.page).toHaveURL(/\/personal-fix\?source=/)
})

When('I open the business fix journey for {string}', async function (source) {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/business-fix?source=${source}`)
  // The page sends users with valid business data back to /business-details
  if (!/\/business-fix\?source=/.test(this.page.url())) {
    throw new Error(
      'This user no longer has invalid business data, so /business-fix redirected. Run "npm run find:test-users" to pick another user.'
    )
  }
})

When('I continue to the business fix list page', async function () {
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await expect(this.page).toHaveURL(/\/business-fix-list$/)
})

Given(
  'I sign in as test user {string} and open the {string} page',
  async function (key, pageName) {
    await loginAsNamedUser(this.page, key)
    await openDetailsPage(this, pageName)
  }
)
When('I continue to the personal fix list page', async function () {
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await expect(this.page).toHaveURL(/\/personal-fix-list$/)
})
