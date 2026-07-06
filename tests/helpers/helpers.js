// tests/helpers/helpers.js

const ENVIRONMENT = process.env.ENVIRONMENT || 'test'
export const TEST_SUITE_BASE_URL = `https://fcp-sfd-frontend.${ENVIRONMENT}.cdp-int.defra.cloud`

export async function goToLandingPage(page) {
  await page.goto(`${TEST_SUITE_BASE_URL}/`)
  await page
    .locator('#main-content > div > div > a')
    .waitFor({ state: 'visible' })
  await page.locator('#main-content > div > div > a').click()
}

export async function loginAsStandardUser(page) {
  await goToLandingPage(page)
  await page.locator("//input[@id='crn']").fill(process.env.USER_STANDARD_CRN)
  await page
    .locator("//input[@id='password']")
    .fill(process.env.USER_STANDARD_PASSWORD)
  await page.locator("//button[@id='next']").click()
}

export async function loginAsAmendPermissionUser(page) {
  await goToLandingPage(page)
  await page.locator("//input[@id='crn']").fill(process.env.USER_AMEND_CRN)
  await page
    .locator("//input[@id='password']")
    .fill(process.env.USER_AMEND_PASSWORD)
  await page.locator("//button[@id='next']").click()
  await page
    .locator(
      `//label[contains(normalize-space(), "SBI ${process.env.USER_AMEND_SBI}")]`
    )
    .click()
  await page.locator("//button[@id='continueReplacement']").click()
}

export async function loginAsViewPermissionUser(page) {
  await goToLandingPage(page)
  await page.locator("//input[@id='crn']").fill(process.env.USER_VIEW_CRN)
  await page
    .locator("//input[@id='password']")
    .fill(process.env.USER_VIEW_PASSWORD)
  await page.locator("//button[@id='next']").click()
  await page
    .locator(
      `//label[contains(normalize-space(), "SBI ${process.env.USER_VIEW_SBI}")]`
    )
    .click()
  await page.locator('#continueReplacement').click()
}
