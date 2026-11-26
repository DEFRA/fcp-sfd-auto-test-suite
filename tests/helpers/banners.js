import { expect } from '@playwright/test'

const BANNER_CONTENT = '.govuk-notification-banner__content'
const SUCCESS_BANNER = `.govuk-notification-banner--success ${BANNER_CONTENT}`
const ERROR_BANNER = `.govuk-notification-banner:not(.govuk-notification-banner--success) ${BANNER_CONTENT}`

// Shown on the details pages when a field is switched off by a feature toggle (FLS2-486)
const DISABLED_FIELD_MESSAGE =
  /^Sorry, there is a problem with the service\. You cannot update your .+ right now\. Please try again later\.$/

async function expectNoUnexpectedErrorBanner(page) {
  const messages = await page.locator(ERROR_BANNER).allInnerTexts()
  for (const message of messages) {
    expect(message.trim(), 'Unexpected error banner on the page').toMatch(
      DISABLED_FIELD_MESSAGE
    )
  }
}

async function expectSuccessBanner(page, expectedMessage) {
  await expect(page.locator(SUCCESS_BANNER)).toHaveText(expectedMessage)
  await expectNoUnexpectedErrorBanner(page)
}

async function expectNoSuccessBanner(page) {
  await expect(page.locator(SUCCESS_BANNER)).toHaveCount(0)
  await expectNoUnexpectedErrorBanner(page)
}

export { expectSuccessBanner, expectNoSuccessBanner }
