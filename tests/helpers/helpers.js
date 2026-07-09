// tests/helpers/helpers.js

const ENVIRONMENT = process.env.ENVIRONMENT || 'test'
export const TEST_SUITE_BASE_URL = `https://fcp-sfd-frontend.${ENVIRONMENT}.cdp-int.defra.cloud`

// NEW: worker-specific standard user (0-3 maps to dedicated user)
function getStandardUserCredentials() {
  const workerId = parseInt(process.env.CUCUMBER_WORKER_ID || '0')
  const users = [
    {
      crn: process.env.USER_STANDARD_1_CRN,
      password: process.env.USER_STANDARD_PASSWORD
    },
    {
      crn: process.env.USER_STANDARD_2_CRN,
      password: process.env.USER_STANDARD_PASSWORD
    },
    {
      crn: process.env.USER_STANDARD_3_CRN,
      password: process.env.USER_STANDARD_PASSWORD
    },
    {
      crn: process.env.USER_STANDARD_4_CRN,
      password: process.env.USER_STANDARD_PASSWORD
    }
  ]
  return users[workerId] || users[0]
}

// NEW: worker-specific amend user
function getAmendUserCredentials() {
  const workerId = parseInt(process.env.CUCUMBER_WORKER_ID || '0')
  const users = [
    {
      crn: process.env.USER_AMEND_1_CRN,
      password: process.env.USER_AMEND_PASSWORD,
      sbi: process.env.USER_AMEND_1_SBI
    },
    {
      crn: process.env.USER_AMEND_2_CRN,
      password: process.env.USER_AMEND_PASSWORD,
      sbi: process.env.USER_AMEND_2_SBI
    },
    {
      crn: process.env.USER_AMEND_3_CRN,
      password: process.env.USER_AMEND_PASSWORD,
      sbi: process.env.USER_AMEND_3_SBI
    },
    {
      crn: process.env.USER_AMEND_4_CRN,
      password: process.env.USER_AMEND_PASSWORD,
      sbi: process.env.USER_AMEND_4_SBI
    }
  ]
  return users[workerId] || users[0]
}

// NEW: worker-specific view user
function getViewUserCredentials() {
  const workerId = parseInt(process.env.CUCUMBER_WORKER_ID || '0')
  const users = [
    {
      crn: process.env.USER_VIEW_1_CRN,
      password: process.env.USER_VIEW_PASSWORD,
      sbi: process.env.USER_VIEW_1_SBI
    },
    {
      crn: process.env.USER_VIEW_2_CRN,
      password: process.env.USER_VIEW_PASSWORD,
      sbi: process.env.USER_VIEW_2_SBI
    },
    {
      crn: process.env.USER_VIEW_3_CRN,
      password: process.env.USER_VIEW_PASSWORD,
      sbi: process.env.USER_VIEW_3_SBI
    },
    {
      crn: process.env.USER_VIEW_4_CRN,
      password: process.env.USER_VIEW_PASSWORD,
      sbi: process.env.USER_VIEW_4_SBI
    }
  ]
  return users[workerId] || users[0]
}

export async function goToLandingPage(page) {
  await page.goto(`${TEST_SUITE_BASE_URL}/`)
  await page
    .locator('#main-content > div > div > a')
    .waitFor({ state: 'visible' })
  await page.locator('#main-content > div > div > a').click()
}

export async function loginAsStandardUser(page) {
  // worker-specific user
  const { crn, password } = getStandardUserCredentials()
  await goToLandingPage(page)
  await page.locator("//input[@id='crn']").fill(crn)
  await page.locator("//input[@id='password']").fill(password)
  await page.locator("//button[@id='next']").click()
}

export async function loginAsAmendPermissionUser(page) {
  // worker-specific user + SBI-based selection
  const { crn, password, sbi } = getAmendUserCredentials()
  await goToLandingPage(page)
  await page.locator("//input[@id='crn']").fill(crn)
  await page.locator("//input[@id='password']").fill(password)
  await page.locator("//button[@id='next']").click()
  await page
    .locator(`//label[contains(normalize-space(), "SBI ${sbi}")]`)
    .click()
  await page.locator("//button[@id='continueReplacement']").click()
}

export async function loginAsViewPermissionUser(page) {
  // worker-specific user + SBI-based selection
  const { crn, password, sbi } = getViewUserCredentials()
  await goToLandingPage(page)
  await page.locator("//input[@id='crn']").fill(crn)
  await page.locator("//input[@id='password']").fill(password)
  await page.locator("//button[@id='next']").click()
  await page
    .locator(`//label[contains(normalize-space(), "SBI ${sbi}")]`)
    .click()
  await page.locator('#continueReplacement').click()
}
