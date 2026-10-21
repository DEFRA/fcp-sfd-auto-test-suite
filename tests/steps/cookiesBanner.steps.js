import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { TEST_SUITE_BASE_URL } from '../helpers/helpers.js'

Given('I navigate to the SFD application home page', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/`)
  await this.page.waitForLoadState('domcontentloaded')
})

Given('the cookies banner is displayed', async function () {
  await expect(this.page.locator('.govuk-cookie-banner')).toBeVisible()
})

Then('the cookies banner should be displayed', async function () {
  await expect(this.page.locator('.govuk-cookie-banner')).toBeVisible()
})

Then('the cookies banner should not be displayed', async function () {
  await expect(this.page.locator('.govuk-cookie-banner')).not.toBeVisible()
})

Then(
  'the cookies banner should contain a {string} button',
  async function (buttonName) {
    await expect(
      this.page.getByRole('button', { name: buttonName })
    ).toBeVisible()
  }
)

Then(
  'the cookies banner should contain a {string} link',
  async function (linkName) {
    await expect(this.page.getByRole('link', { name: linkName })).toBeVisible()
  }
)

When('I click the {string} button', async function (buttonName) {
  await this.page.getByRole('button', { name: buttonName }).click()
})

When('I click the {string} link', async function (linkName) {
  await this.page.getByRole('link', { name: linkName }).click()
})

Then('I should see the message {string}', async function (expectedMessage) {
  await expect(
    this.page.getByText(expectedMessage, {
      exact: false
    })
  ).toBeVisible()
})

Then('analytics cookies should be enabled', async function () {
  await expect(
    this.page.getByText('You’ve accepted analytics cookies', { exact: false })
  ).toBeVisible()
})

Then('analytics cookies should be disabled', async function () {
  await expect(this.page.getByRole('radio', { name: 'No' })).toBeChecked()
})

Then('I should be taken to the cookie preferences page', async function () {
  await expect(this.page).toHaveURL(/cookies/)
})

Given('I am on the cookie preferences page', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/cookies`)

  await expect(
    this.page.getByRole('heading', {
      name: /^Cookies$/,
      level: 1
    })
  ).toBeVisible()
})

When('I select {string} for analytics cookies', async function (option) {
  await this.page.getByRole('radio', { name: option }).check()
})

Then('my cookie preferences should be saved', async function () {
  await expect(
    this.page.getByText('You’ve set your cookie preferences.', {
      exact: false
    })
  ).toBeVisible()
})

Given('I have saved my cookie preferences', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/cookies`)

  await this.page.getByRole('radio', { name: 'Yes' }).check()

  await this.page
    .getByRole('button', {
      name: 'Save cookie settings'
    })
    .click()

  await expect(
    this.page.getByText('You’ve set your cookie preferences.', {
      exact: false
    })
  ).toBeVisible()
})

When('I revisit the SFD application', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/`)
})

Given('I have previously accepted analytics cookies', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/cookies`)

  await this.page.getByRole('radio', { name: 'Yes' }).check()

  await this.page
    .getByRole('button', {
      name: 'Save cookie settings'
    })
    .click()

  await expect(
    this.page.getByText('You’ve set your cookie preferences.', {
      exact: false
    })
  ).toBeVisible()
})

Given('I have previously rejected analytics cookies', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/cookies`)

  await this.page.getByRole('radio', { name: 'No' }).check()

  await this.page
    .getByRole('button', {
      name: 'Save cookie settings'
    })
    .click()

  await expect(
    this.page.getByText('You’ve set your cookie preferences.', {
      exact: false
    })
  ).toBeVisible()
})

When('I navigate to the cookie preferences page', async function () {
  await this.page.goto(`${TEST_SUITE_BASE_URL}/cookies`)
})
