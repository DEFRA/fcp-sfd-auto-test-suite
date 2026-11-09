import { Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { checkAccessibility, checkReflow } from '../helpers/accessibility.js'
import { checkKeyboardOperability } from '../helpers/keyboard.js'

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
