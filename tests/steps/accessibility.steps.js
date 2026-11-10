import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { checkAccessibility, checkReflow } from '../helpers/accessibility.js'
import { checkKeyboardOperability } from '../helpers/keyboard.js'
import {
  loginAsStandardUserNumber,
  TEST_SUITE_BASE_URL
} from '../helpers/helpers.js'

Then('the page should have no accessibility violations', async function () {
  await this.page.waitForLoadState('domcontentloaded')
  await checkAccessibility(this)
})

Then(
  'the page should have no accessibility violations on narrow screens',
  async function () {
    await this.page.waitForLoadState('domcontentloaded')
    await checkReflow(this)
  }
)

Then('the page should be fully operable with the keyboard', async function () {
  await this.page.waitForLoadState('domcontentloaded')
  await checkKeyboardOperability(this)
})

Then('the page should declare a language and a skip link', async function () {
  await expect(this.page.locator('html')).toHaveAttribute('lang', /^en/)
  await expect(this.page.locator('a.govuk-skip-link')).toHaveCount(1)
})

Given(
  'I sign in as standard user {int} and open the {string} page',
  async function (number, pageName) {
    const paths = {
      PersonalDetails: '/personal-details',
      BusinessDetails: '/business-details'
    }
    const path = paths[pageName]
    if (!path) throw new Error(`Unknown page: ${pageName}`)
    await loginAsStandardUserNumber(this.page, number)
    await this.page.waitForURL('**/home')
    await this.page.goto(`${TEST_SUITE_BASE_URL}${path}`)
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page).toHaveURL(new RegExp(`${path}$`))
  }
)

When('I open the personal fix journey for {string}', async function (source) {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/personal-fix?source=${source}`)
  await expect(this.page).toHaveURL(/\/personal-fix\?source=/)
})

When('I continue to the personal fix list page', async function () {
  await this.page.getByRole('button', { name: 'Continue' }).click()
  await expect(this.page).toHaveURL(/\/personal-fix-list$/)
})
