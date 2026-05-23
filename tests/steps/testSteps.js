/* eslint-disable prettier/prettier */
import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import {
  loginAsStandardUser,
  loginAsAmendPermissionUser,
  loginAsViewPermissionUser,
  goToLandingPage,
  TEST_SUITE_BASE_URL
} from '../helpers/helpers.js'

Given(
  'I am on SignIn page and enter the credentials for {string}',
  async function (detailsType) {
    switch (detailsType.toLowerCase()) {
      case 'businessdetails':
        await loginAsStandardUser(this.page)
        await this.page
          .locator(
            "//a[normalize-space()='View and update your business details']"
          )
          .waitFor({ state: 'visible' })
        await this.page
          .locator(
            "//a[normalize-space()='View and update your business details']"
          )
          .click()
        await this.page.waitForURL('**/business-details')
        break
      case 'personaldetails':
        await loginAsStandardUser(this.page)
        await this.page
          .locator(
            "//a[normalize-space()='View and update your personal details']"
          )
          .waitFor({ state: 'visible' })
        await this.page
          .locator(
            "//a[normalize-space()='View and update your personal details']"
          )
          .click()
        break
      default:
        throw new Error(`Unknown details type: ${detailsType}`)
    }
  }
)

Given(
  'I am on SignIn page and enter the credentials for {string} with {string}',
  async function (businessdetails, permission) {
    businessdetails = businessdetails?.toLowerCase()
    permission = permission?.toLowerCase()

    switch (true) {
      case businessdetails === 'businessdetails' &&
        permission === 'amendpermission':
        await loginAsAmendPermissionUser(this.page)
        await this.page
          .locator(
            "//a[normalize-space()='View and update your business details']"
          )
          .click()
        await this.page.waitForTimeout(3000)
        break

      case businessdetails === 'businessdetails' &&
        permission === 'viewpermission':
        await loginAsViewPermissionUser(this.page)
        await this.page
          .locator("//a[normalize-space()='View your Business details']")
          .click()
        await this.page.waitForTimeout(3000)
        break

      default:
        throw new Error(
          `Unknown credentials combination: ${businessdetails} / ${permission}`
        )
    }
  }
)

When(
  'I click the {string} link on the BusinessDetails page',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'businessphonenumbers':
        await this.page
          .locator("//a[@href='/business-phone-numbers-change']")
          .click()
        break
      case 'businesstype':
        await this.page.getByRole('link', { name: 'Business type' }).click()
        break
      case 'businessemailaddress':
        await this.page
          .getByRole('link', { name: 'Business email address' })
          .click()
        break
      case 'businessaddress':
        await this.page.getByRole('link', { name: 'Business address' }).click()
        break
      case 'businessname':
        await this.page.locator("//a[@href='/business-name-change']").click()
        break
      case 'businesslegalstatus':
        await this.page
          .getByRole('link', { name: 'Business Legal Status' })
          .click()
        break
      default:
        throw new Error(`Unknown link type: ${linkType}`)
    }
  }
)

Then(
  'Verfiy all relevant details on the {string} page are been displayed correctly',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'changeyourbusinesstype':
        await expect(
          this.page.getByText(
            'If your business type is incorrect, contact the Rural Payments Agency to update it.'
          )
        ).toBeVisible()
        await expect(this.page.locator('.govuk-heading-m')).toContainText(
          'Contact the Rural Payments Agency'
        )
        await expect(this.page.getByText('Phone: 03000 200 301')).toBeVisible()
        await expect(
          this.page.getByText(
            'Monday to Friday, 8.30am to 5pm (except bank holidays)'
          )
        ).toBeVisible()
        break

      case 'changeyourlegalstatus':
        await expect(
          this.page.getByText(
            'If your legal status is incorrect, contact the Rural Payments Agency to update it.'
          )
        ).toBeVisible()
        await expect(this.page.locator('.govuk-heading-m')).toContainText(
          'Contact the Rural Payments Agency'
        )
        await expect(this.page.getByText('Phone: 03000 200 301')).toBeVisible()
        await expect(
          this.page.getByText(
            'Monday to Friday, 8.30am to 5pm (except bank holidays)'
          )
        ).toBeVisible()
        break

      default:
        throw new Error(`Unknown link type: ${linkType}`)
    }
  }
)

Then(
  'Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly',
  async function () {
    const actPhNum = await this.page
      .locator(
        '//dt[normalize-space()="Business phone numbers"]/following-sibling::dd[1]/div[1]/span'
      )
      .textContent()
    expect(actPhNum).toBe(this.phonenumber)
  }
)

Then(
  'Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly',
  async function () {
    const actEmail = await this.page
      .locator(
        "//dt[normalize-space()='Business email address']/following-sibling::dd[1]"
      )
      .innerText()
    expect(actEmail).toBe(this.email)
  }
)

Then(
  'Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly',
  async function () {
    const actBusinessName = await this.page
      .locator(
        "//dt[normalize-space()='Business name']/following-sibling::dd[1]"
      )
      .innerText()
    expect(actBusinessName).toBe(this.businessName)
  }
)

Then(
  'Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly',
  async function () {
    const actAddrLine1 = await this.page
      .locator(
        "//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[1]"
      )
      .innerText()
    const actAddrLine2 = await this.page
      .locator(
        "//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[2]"
      )
      .innerText()
    const actCity = await this.page
      .locator(
        "//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[3]"
      )
      .innerText()
    const actPostcode = await this.page
      .locator(
        "//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[4]"
      )
      .innerText()
    expect(actAddrLine1).toBe(this.addressline1)
    expect(actAddrLine2).toContain(this.addressline2)
    expect(actCity).toBe(this.city)
    expect(actPostcode).toContain(this.postcode)
  }
)

Then(
  'Verify Success Updated message is displayed for {string} on the page ViewAndUpdateYourBusinessType',
  async function (updatedMsgType) {
    switch (updatedMsgType.toLowerCase()) {
      case 'businessphonenumbers': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your business phone numbers')
        break
      }
      case 'businessemailaddress': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your business email address')
        break
      }
      case 'businessaddress': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your business address')
        break
      }
      case 'businessname': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your business name')
        break
      }
      case 'vatnumber': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your VAT registration number')
        break
      }
      case 'yes': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have removed your VAT registration number')
        break
      }
      case 'no': {
        const banner = this.page.locator(
          "//div[@class='govuk-notification-banner__content']"
        )
        await expect(banner).not.toBeVisible()
        break
      }
      default:
        throw new Error(`Unknown updatedMsgType: ${updatedMsgType}`)
    }
  }
)

When('I update phone number', async function () {
  await this.page.locator('[id="businessTelephone"]').clear()
  this.phonenumber = generateRandomPhoneNumber()
  await this.page.fill('#businessTelephone', this.phonenumber)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When('I update Email', async function () {
  await this.page.locator('//input[@id="business-email"]').clear()
  this.email = generateRandomEmail()
  await this.page.fill('//input[@id="business-email"]', this.email)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When('I update Business Name', async function () {
  await this.page.locator('//input[@id="business-name"]').clear()
  this.businessName = faker.company.name()
  await this.page.fill('//input[@id="business-name"]', this.businessName)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When('I update Business Address', async function () {
  await this.page
    .locator("//a[normalize-space()='Enter address manually']")
    .click()

  this.addressline1 = faker.location.streetAddress()
  await this.page.locator('//input[@id="address-1"]').clear()
  await this.page.fill('//input[@id="address-1"]', this.addressline1)

  this.addressline2 = faker.location.secondaryAddress()
  await this.page.locator('//input[@id="address-2"]').clear()
  await this.page.fill('//input[@id="address-2"]', this.addressline2)

  await this.page.locator('//input[@id="address-3"]').clear()

  this.city = faker.location.city()
  await this.page.locator("//input[@id='city']").clear()
  await this.page.fill("//input[@id='city']", this.city)

  await this.page.locator("//input[@id='county']").clear()

  this.postcode = generateRandomUKPostcode()
  await this.page.locator("//input[@id='postcode']").clear()
  await this.page.fill("//input[@id='postcode']", this.postcode)

  await this.page.locator("//input[@id='country']").clear()
  await this.page.fill("//input[@id='country']", 'United Kingdom')

  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When('I click signOut link on the {string} page', async function (signOutPage) {
  switch (signOutPage.toLowerCase()) {
    case 'viewandupdateyourbusinesstype':
      await this.page.locator("//a[normalize-space()='Sign out']").click()
      break
    case 'whatisyourbusinessname':
      await this.page.locator("//a[@href='/business-name-change']").click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()
      break
    case 'enteryourbusinessaddress':
    case 'whatisyourbusinessemailaddress':
      await this.page
        .getByRole('link', { name: 'Business email address' })
        .click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()
      break
    case 'whatareyourbusinessphonemembers':
      await this.page
        .getByRole('link', { name: 'Change Business telephone numbers' })
        .click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()
      break
    case 'changeyourbusinesstype':
      await this.page.getByRole('link', { name: 'Business type' }).click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()
      break
    default:
      throw new Error(`Unknown signOutPage: ${signOutPage}`)
  }
})

Then('Application should Navigate to mp06 Signed Out page.', async function () {
  await expect(this.page.locator('a[href="/auth/sign-in"]')).toBeVisible()
})

Given('I sign In on the first tab', async function () {
  this.page1 = await this.context.newPage()
  await loginAsStandardUser(this.page1)
  await this.page1
    .locator("//a[normalize-space()='View and update your business details']")
    .click()
})

When('I open another tab with the same session', async function () {
  this.page2 = await this.context.newPage()
  await goToLandingPage(this.page2)
  await this.page2
    .locator("//a[normalize-space()='View and update your business details']")
    .click()
})

When('I signOut on the first tab', async function () {
  await this.page1.bringToFront()
  await this.page1.locator("//a[normalize-space()='Sign out']").click()
  await this.page1.waitForURL(`${TEST_SUITE_BASE_URL}/signed-out**`)
})

When('I switch to the second tab', async function () {
  await this.page2.bringToFront()
  await this.page2.waitForLoadState('domcontentloaded')
})

When('I click on the link on the second tab', async function () {
  await this.page2.getByRole('link', { name: 'Business name' }).click()
})

Then(
  'I should be redirected to the signIn page from the second tab',
  async function () {
    const actSignOutPage = await this.page2
      .locator("//h1[@id='header']")
      .innerText()
    expect(actSignOutPage).toBe('Sign in to farm and land service')
  }
)

Given(
  'I update Business Name and click the Change link in CheckYourBusinessNameIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('//input[@id="business-name"]').clear()
    this.businessName = faker.company.name()
    await this.page.fill('//input[@id="business-name"]', this.businessName)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Business name' }).click()
  }
)

Given(
  'Change the Business Name again in WhatIsYourBusinessName? Page',
  async function () {
    await this.page.locator('//input[@id="business-name"]').clear()
    this.businessName = faker.company.name()
    await this.page.fill('//input[@id="business-name"]', this.businessName)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)

Given(
  'I update Business Address and click the Change link in CheckYourBusinessAddressIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page
      .locator("//a[normalize-space()='Enter address manually']")
      .click()

    this.addressline1 = faker.location.streetAddress()
    await this.page.locator('//input[@id="address-1"]').clear()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.locator('//input[@id="address-2"]').clear()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    this.city = faker.location.city()
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()

    this.postcode = generateRandomUKPostcode()
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')

    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Business address' }).click()
  }
)

Given(
  'Change the Business Address again in EnterYourBusinessAddress Page',
  async function () {
    this.addressline1 = faker.location.streetAddress()
    await this.page.locator('//input[@id="address-1"]').clear()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.locator('//input[@id="address-2"]').clear()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    this.city = faker.location.city()
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()

    this.postcode = generateRandomUKPostcode()
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')

    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)

Given(
  'I update Business PhoneNumber and click the Change link in CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('[id="businessTelephone"]').clear()
    this.phonenumber = generateRandomPhoneNumber()
    await this.page.fill('#businessTelephone', this.phonenumber)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page
      .getByRole('link', { name: 'Business phone numbers' })
      .click()
  }
)

Given(
  'Change the Business PhoneNumber again in WhatAreYourBusinessPhoneNumbers? Page',
  async function () {
    await this.page.locator('[id="businessTelephone"]').clear()
    this.phonenumber = generateRandomPhoneNumber()
    await this.page.fill('#businessTelephone', this.phonenumber)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)

Then(
  'Verfiy Updated Business PhoneNumber details on the ViewAndUpdateYourBusinessType page are been displayed correctly',
  async function () {
    const actPhNum = await this.page
      .locator(
        '//dt[normalize-space()="Business phone numbers"]/following-sibling::dd[1]/div[1]/span'
      )
      .textContent()
    expect(actPhNum).toBe(this.phonenumber)
  }
)

Given(
  'I update Business EmailAddress and click the Change link in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('//input[@id="business-email"]').clear()
    this.email = generateRandomEmail()
    await this.page.fill('//input[@id="business-email"]', this.email)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Business email' }).click()
  }
)

Given(
  'Change the Business EmailAddress again in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('//input[@id="business-email"]').clear()
    this.email = generateRandomEmail()
    await this.page.fill('//input[@id="business-email"]', this.email)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)

Then(
  'Verfiy Updated Business EmailAddress details on the ViewAndUpdateYourBusinessType page are been displayed correctly',
  async function () {
    const actEmail = await this.page
      .locator(
        "//dt[normalize-space()='Business email address']/following-sibling::dd[1]"
      )
      .innerText()
    expect(actEmail).toBe(this.email)
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the BusinessAddress page',
  async function (field, length) {
    await this.page
      .locator("//a[normalize-space()='Enter address manually']")
      .click()

    this.addressline1 = faker.location.streetAddress()
    await this.page.locator('//input[@id="address-1"]').clear()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.locator('//input[@id="address-2"]').clear()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    this.city = faker.location.city()
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()

    this.postcode = generateRandomUKPostcode()
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')

    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'addressline1':
        await this.page.locator('//input[@id="address-1"]').clear()
        await this.page.fill('//input[@id="address-1"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'addressline2':
        await this.page.locator('//input[@id="address-2"]').clear()
        await this.page.fill('//input[@id="address-2"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'businesstown':
        await this.page.locator("//input[@id='city']").clear()
        await this.page.fill("//input[@id='city']", this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'businesscountry':
        await this.page.locator("//input[@id='country']").clear()
        await this.page.fill("//input[@id='country']", this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'businesscounty':
        await this.page.locator("//input[@id='county']").clear()
        await this.page.fill("//input[@id='county']", this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
    }
  }
)

Then(
  'Verfiy relevant ErrorMessage {string} is displayed',
  async function (errMsg) {
    const errorLocator = this.page.locator(
      "//ul[@class='govuk-list govuk-error-summary__list']//li"
    )
    try {
      await errorLocator.waitFor({ state: 'visible', timeout: 5000 })
    } catch {
      const pageTitle = await this.page.title()
      const pageUrl = this.page.url()
      throw new Error(
        `Error summary not found. Expected: "${errMsg}". Page: "${pageTitle}" (${pageUrl})`
      )
    }
    const actErrMsg = await errorLocator.innerText()
    expect(actErrMsg).toBe(errMsg)
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the {string} page',
  async function (field, length, _page) {
    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'businessname':
        await this.page.locator('//input[@id="business-name"]').clear()
        await this.page.fill('//input[@id="business-name"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      case 'businessphone':
        await this.page.locator('[id="businessTelephone"]').clear()
        await this.page.fill('#businessTelephone', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      case 'businessmobilephone':
        await this.page.locator('#businessMobile').clear()
        await this.page.fill('#businessMobile', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      case 'businessandmobilephone':
        await this.page.locator('[id="businessTelephone"]').clear()
        await this.page.fill('#businessTelephone', this.generateValue)
        await this.page.locator("//input[@id='businessMobile']").clear()
        await this.page.fill(
          "//input[@id='businessMobile']",
          this.generateValue
        )
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      case 'businessemailaddress':
        await this.page.locator('//input[@id="business-email"]').clear()
        this.email = generateDiffLengthRandomEmail(length)
        await this.page.fill('//input[@id="business-email"]', this.email)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      case 'personalphone':
        await this.page.locator('//input[@id="personalTelephone"]').clear()
        await this.page.fill(
          '//input[@id="personalTelephone"]',
          this.generateValue
        )
        await this.page
          .locator('//button[normalize-space()="Continue"]')
          .click()
        break

      case 'personalandmobilephone':
        await this.page.locator('//input[@id="personalTelephone"]').clear()
        await this.page.fill(
          '//input[@id="personalTelephone"]',
          this.generateValue
        )
        await this.page.locator('//input[@id="personalMobile"]').clear()
        await this.page.fill(
          '//input[@id="personalMobile"]',
          this.generateValue
        )
        await this.page
          .locator('//button[normalize-space()="Continue"]')
          .click()
        break

      case 'personalmobilephone':
        await this.page.locator('//input[@id="personalMobile"]').clear()
        await this.page.fill(
          '//input[@id="personalMobile"]',
          this.generateValue
        )
        await this.page
          .locator('//button[normalize-space()="Continue"]')
          .click()
        break

      case 'vatnumber':
        await this.page.locator('//input[@id="business-vat"]').clear()
        await this.page.fill('//input[@id="business-vat"]', this.generateValue)
        await this.page
          .locator('//button[normalize-space()="Continue"]')
          .click()
        break

      case 'personalemailaddress':
        await this.page.locator('//input[@id="personal-email"]').clear()
        this.email = generateDiffLengthRandomEmail(length)
        await this.page.fill('//input[@id="personal-email"]', this.email)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
    }
  }
)

Given(
  'I click a link signIn link in LandAndFarmService page',
  async function () {
    await this.page.locator('a[href="/auth/sign-in"]').click()
  }
)

Then(
  'Application should Navigate to SignInToFarmingFrontDoor page.',
  async function () {
    const expTxt = await this.page.locator("//h1[@id='header']").innerText()
    expect(expTxt).toBe('Sign in to farm and land service')
  }
)

When('I add the VAT Number', async function () {
  await this.page
    .locator('//a[@href="/business-vat-registration-number-change"]')
    .click()
  await this.page.locator('//input[@id="business-vat"]').clear()
  await this.page.fill('//input[@id="business-vat"]', '123456789')
  await this.page.locator('//button[normalize-space()="Continue"]').click()
  await this.page.locator('//button[normalize-space()="Submit"]').click()
})

When('I click {string} link', async function (link) {
  switch (link.toLowerCase()) {
    case 'remove':
      await this.page
        .locator('//a[@href="/business-vat-registration-remove"]')
        .click()
      break
    case 'change':
      await this.page
        .locator('//a[@href="/business-vat-registration-number-change"]')
        .click()
      break
  }
})

When(
  'I click {string} button in the AreYouSureYouWantToRemoveYourVATRegistrationNumber page',
  async function (btnType) {
    switch (btnType.toLowerCase()) {
      case 'yes':
        await this.page.locator('//input[@id="confirmRemove"]').click()
        await this.page.locator('//button[normalize-space()="Submit"]').click()
        break
      case 'no':
        await this.page.locator('//input[@id="confirmRemove-2"]').click()
        await this.page.locator('//button[normalize-space()="Submit"]').click()
        break
    }
  }
)

Given(
  'I Update the VAT number in WhatIsYourVATRegistrationNumber page and submit',
  async function () {
    await this.page.locator('//input[@id="business-vat"]').clear()
    await this.page.fill('//input[@id="business-vat"]', '987654321')
    await this.page.locator('//button[normalize-space()="Continue"]').click()
    await this.page.locator('//button[normalize-space()="Submit"]').click()
  }
)

Then(
  'ViewAndUpdateYourBusinessType page should display updated VAT number',
  async function () {
    const actUpdatedVATnumber = await this.page
      .locator(
        "//dt[normalize-space()='VAT registration number']/following-sibling::dd[1]"
      )
      .innerText()
    expect(actUpdatedVATnumber).toBe('987654321')
  }
)

When(
  'I click the {string} link on the "ViewAndUpdateYourPersonalDetails"Page',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'personalphonenumbers':
        await this.page
          .getByRole('link', { name: 'Personal phone numbers' })
          .click()
        break
      case 'fullname':
        await this.page.getByRole('link', { name: 'Full name' }).click()
        break
      case 'personaladdress':
        await this.page.getByRole('link', { name: 'Personal address' }).click()
        break
      case 'personaldob':
        await this.page.getByRole('link', { name: 'Date of birth' }).click()
        break
      case 'personalemailaddress':
        await this.page
          .getByRole('link', { name: 'Personal email address' })
          .click()
        break
      default:
        throw new Error(`Unknown link type: ${linkType}`)
    }
  }
)

When('I update Personal phone number', async function () {
  await this.page.locator('[id="personalTelephone"]').clear()
  this.personalPhonenumber = generateRandomPhoneNumber()
  await this.page.fill('#personalTelephone', this.personalPhonenumber)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Then(
  'Verfiy updated phone details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly',
  async function () {
    const actPhNum = await this.page.getByText('Telephone').textContent()
    const actual = actPhNum.split(':')[1].trim()
    expect(actual).toBe(this.personalPhonenumber)
  }
)

Then(
  'Verify Success Updated message is displayed for {string} on the page ViewAndUpdateYourPersonalDetails page',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'personalphonenumbers': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your personal phone numbers')
        break
      }
      case 'fullname': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your full name')
        break
      }
      case 'personaladdress': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your personal address')
        break
      }
      case 'dob': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your date of birth')
        break
      }
      case 'personalemailaddress': {
        const msg = await this.page
          .locator("//div[@class='govuk-notification-banner__content']")
          .innerText()
        expect(msg).toBe('You have updated your personal email address')
        break
      }
      default:
        throw new Error(`Unknown linkType: ${linkType}`)
    }
  }
)

Given('I update Personal Name', async function () {
  await this.page.locator('//input[@id="first"]').clear()
  await this.page.locator('//input[@id="middle"]').clear()
  await this.page.locator('//input[@id="last"]').clear()

  this.firstName = faker.person.firstName()
  this.middleName = faker.person.middleName()
  this.lastName = faker.person.lastName()

  await this.page.fill('//input[@id="first"]', this.firstName)
  await this.page.fill('//input[@id="middle"]', this.middleName)
  await this.page.fill('//input[@id="last"]', this.lastName)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Then(
  'Verfiy Updated Personal Full Name details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly',
  async function () {
    const actName = await this.page
      .locator("//dt[normalize-space()='Full name']/following-sibling::dd[1]")
      .innerText()
    expect(actName).toBe(
      `${this.firstName} ${this.middleName} ${this.lastName}`
    )
  }
)

Given(
  'I update Personal Name and click the Change link in CheckYourNameIsCorrectBeforeSubmitting page',
  async function () {
    await this.page.locator('//input[@id="first"]').clear()
    await this.page.locator('//input[@id="middle"]').clear()
    await this.page.locator('//input[@id="last"]').clear()

    this.firstName = faker.person.firstName()
    this.middleName = faker.person.middleName()
    this.lastName = faker.person.lastName()

    await this.page.fill('//input[@id="first"]', this.firstName)
    await this.page.fill('//input[@id="middle"]', this.middleName)
    await this.page.fill('//input[@id="last"]', this.lastName)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Full name' }).click()
  }
)

Given(
  'Change the Personal Name again in WhatIsYourFullName? Page',
  async function () {
    await this.page.locator('//input[@id="first"]').clear()
    await this.page.locator('//input[@id="middle"]').clear()
    await this.page.locator('//input[@id="last"]').clear()

    this.firstName = faker.person.firstName()
    this.middleName = faker.person.middleName()
    this.lastName = faker.person.lastName()

    await this.page.fill('//input[@id="first"]', this.firstName)
    await this.page.fill('//input[@id="middle"]', this.middleName)
    await this.page.fill('//input[@id="last"]', this.lastName)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)

Given(
  'I update Personal phone number and click the {string} in the CheckYourPersonalPhoneNumbersAreCorrectBeforeSubmitting page',
  async function (linkType) {
    await this.page.locator('[id="personalTelephone"]').clear()
    this.personalPhonenumber = generateRandomPhoneNumber()
    await this.page.fill('#personalTelephone', this.personalPhonenumber)
    await this.page.locator("//button[normalize-space()='Continue']").click()

    switch (linkType.toLowerCase()) {
      case 'change':
        await this.page
          .getByRole('link', { name: 'Personal phone numbers' })
          .click()
        break
      case 'back':
        await this.page.locator('//a[normalize-space()="Back"]').click()
        break
    }
  }
)

Then(
  'Verify the previously entered details are still displayed in WhatAreYourPersonalPhoneNumbers? page',
  async function () {
    const acttelephoneNumber = await this.page
      .locator("//input[@id='personalTelephone']")
      .inputValue()
    expect(acttelephoneNumber).toBe(this.personalPhonenumber)
  }
)

When('I Update the Personal address {string}', async function (addressType) {
  switch (addressType.toLowerCase()) {
    case 'manually':
      await this.page
        .locator("//a[normalize-space()='Enter address manually']")
        .click()

      this.addressline1 = faker.location.streetAddress()
      await this.page.locator('//input[@id="address1"]').clear()
      await this.page.fill('//input[@id="address1"]', this.addressline1)

      this.addressline2 = faker.location.secondaryAddress()
      await this.page.locator('//input[@id="address2"]').clear()
      await this.page.fill('//input[@id="address2"]', this.addressline2)

      await this.page.locator('//input[@id="address3"]').clear()

      this.city = faker.location.city()
      await this.page.locator("//input[@id='city']").clear()
      await this.page.fill("//input[@id='city']", this.city)

      await this.page.locator("//input[@id='county']").clear()

      this.postcode = generateRandomUKPostcode()
      await this.page.locator("//input[@id='postcode']").clear()
      await this.page.fill("//input[@id='postcode']", this.postcode)

      await this.page.locator("//input[@id='country']").clear()
      await this.page.fill("//input[@id='country']", 'United Kingdom')
      await this.page.locator("//button[normalize-space()='Continue']").click()
      await this.page.locator("//button[normalize-space()='Submit']").click()
      break

    case 'postcodelookup': {
      this.postcode = getRandomUKPostcode()
      await this.page.locator("//input[@id='postcode']").clear()
      await this.page.fill("//input[@id='postcode']", this.postcode)
      await this.page.locator("//button[normalize-space()='Continue']").click()

      const se = '#addresses'
      await this.page.locator(se).waitFor({ state: 'visible' })
      const opt = await this.page.$$(se + '> option')
      const randomIndex = Math.floor(Math.random() * (opt.length - 1)) + 1
      await this.page.selectOption(se, { index: randomIndex })

      await this.page.locator("//button[normalize-space()='Continue']").click()
      await this.page.locator("//button[normalize-space()='Submit']").click()
      break
    }
  }
})

Given(
  'I update Personal Address Manually and click the Change link in CheckYourPersonalAddressIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page
      .locator("//a[normalize-space()='Enter address manually']")
      .click()

    this.addressline1 = faker.location.streetAddress()
    await this.page.locator('//input[@id="address1"]').clear()
    await this.page.fill('//input[@id="address1"]', this.addressline1)

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.locator('//input[@id="address2"]').clear()
    await this.page.fill('//input[@id="address2"]', this.addressline2)

    await this.page.locator('//input[@id="address3"]').clear()

    this.city = faker.location.city()
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()

    this.postcode = generateRandomUKPostcode()
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Personal address' }).click()
  }
)

Given(
  'Change the Personal Address Manually again in EnterYourPersonalAddress Page',
  async function () {
    this.addressline1 = faker.location.streetAddress()
    await this.page.locator('//input[@id="address1"]').clear()
    await this.page.fill('//input[@id="address1"]', this.addressline1)

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.locator('//input[@id="address2"]').clear()
    await this.page.fill('//input[@id="address2"]', this.addressline2)

    await this.page.locator('//input[@id="address3"]').clear()

    this.city = faker.location.city()
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()

    this.postcode = generateRandomUKPostcode()
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)

Then(
  'Verfiy updated Personal Address Manually changed details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly',
  async function () {
    const actAddrLine1 = await this.page
      .locator(
        "//dt[normalize-space()='Personal address']/following-sibling::dd[1]/div[1]"
      )
      .innerText()
    const actAddrLine2 = await this.page
      .locator(
        "//dt[normalize-space()='Personal address']/following-sibling::dd[1]/div[2]"
      )
      .innerText()
    const actCity = await this.page
      .locator(
        "//dt[normalize-space()='Personal address']/following-sibling::dd[1]/div[3]"
      )
      .innerText()
    const actPostcode = await this.page
      .locator(
        "//dt[normalize-space()='Personal address']/following-sibling::dd[1]/div[4]"
      )
      .innerText()
    expect(actAddrLine1).toBe(this.addressline1)
    expect(actAddrLine2).toContain(this.addressline2)
    expect(actCity).toBe(this.city)
    expect(actPostcode).toContain(this.postcode)
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the EnterYourPersonalAddress page',
  async function (field, length) {
    await this.page
      .locator("//a[normalize-space()='Enter address manually']")
      .click()

    this.addressline1 = faker.location.streetAddress()
    await this.page.locator('//input[@id="address1"]').clear()
    await this.page.fill('//input[@id="address1"]', this.addressline1)

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.locator('//input[@id="address2"]').clear()
    await this.page.fill('//input[@id="address2"]', this.addressline2)

    await this.page.locator('//input[@id="address3"]').clear()

    this.city = faker.location.city()
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()

    this.postcode = generateRandomUKPostcode()
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')

    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'addressline1':
        await this.page.locator('//input[@id="address1"]').clear()
        await this.page.fill('//input[@id="address1"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'addressline2':
        await this.page.locator('//input[@id="address2"]').clear()
        await this.page.fill('//input[@id="address2"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'town':
        await this.page.locator("//input[@id='city']").clear()
        await this.page.fill("//input[@id='city']", this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'country':
        await this.page.locator("//input[@id='country']").clear()
        await this.page.fill("//input[@id='country']", this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'county':
        await this.page.locator("//input[@id='county']").clear()
        await this.page.fill("//input[@id='county']", this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
    }
  }
)

Given(
  'I enter the test data on with value as {string} on the WhatIsYourPersonalAddress page',
  async function (testData) {
    await this.page.locator("//input[@id='postcode']").clear()
    await this.page.fill("//input[@id='postcode']", testData)
    await this.page.locator("//button[normalize-space()='Continue']").click()
  }
)

Given('I update the dob', async function () {
  const dob = faker.date.birthdate({ min: 18, max: 90, mode: 'age' })
  const day = (dob.getDate() + 1).toString().padStart(2, '0')
  const month = (dob.getMonth() + 1).toString().padStart(2, '0')
  const year = (dob.getFullYear() + 1).toString()

  await this.page.locator("//input[@id='day']").clear()
  await this.page.fill("//input[@id='day']", day)
  await this.page.locator("//input[@id='month']").clear()
  await this.page.fill("//input[@id='month']", month)
  await this.page.locator("//input[@id='year']").clear()
  await this.page.fill("//input[@id='year']", year)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Given(
  'I update Personal DateOfBirth and click the {string} in the CheckYourDateOfBirthIsCorrectBeforeSubmitting page',
  async function (linkType) {
    const dob = faker.date.birthdate({ min: 18, max: 90, mode: 'age' })
    this.day = (dob.getDate() + 1).toString().padStart(2, '0')
    this.month = (dob.getMonth() + 1).toString().padStart(2, '0')
    this.year = (dob.getFullYear() + 1).toString()

    await this.page.locator("//input[@id='day']").clear()
    await this.page.fill("//input[@id='day']", this.day)
    await this.page.locator("//input[@id='month']").clear()
    await this.page.fill("//input[@id='month']", this.month)
    await this.page.locator("//input[@id='year']").clear()
    await this.page.fill("//input[@id='year']", this.year)
    await this.page.locator("//button[normalize-space()='Continue']").click()

    switch (linkType.toLowerCase()) {
      case 'change':
        await this.page.getByRole('link', { name: 'Date of birth' }).click()
        break
      case 'back':
        await this.page.locator('//a[normalize-space()="Back"]').click()
        break
    }
  }
)

Then(
  'Verify the previously entered details are still displayed in WhatIsYourDateOfBirth? page',
  async function () {
    const actDayValue = await this.page
      .locator("//input[@id='day']")
      .inputValue()
    const actMonthValue = await this.page
      .locator("//input[@id='month']")
      .inputValue()
    const actYearValue = await this.page
      .locator("//input[@id='year']")
      .inputValue()
    expect(actDayValue).toBe(this.day)
    expect(actMonthValue).toContain(this.month)
    expect(actYearValue).toBe(this.year)
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the WhatIsYourFullName? page',
  async function (field, length) {
    this.firstName = faker.person.firstName()
    await this.page.locator('//input[@id="first"]').clear()
    await this.page.fill('//input[@id="first"]', this.firstName)

    this.middleName = faker.person.middleName()
    await this.page.locator('//input[@id="middle"]').clear()
    await this.page.fill('//input[@id="middle"]', this.middleName)

    this.lastName = faker.person.lastName()
    await this.page.locator('//input[@id="last"]').clear()
    await this.page.fill('//input[@id="last"]', this.lastName)

    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'personalfirstname':
        await this.page.locator('//input[@id="first"]').clear()
        await this.page.fill('//input[@id="first"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'personalmiddlename':
        await this.page.locator('//input[@id="middle"]').clear()
        await this.page.fill('//input[@id="middle"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
      case 'personallastname':
        await this.page.locator('//input[@id="last"]').clear()
        await this.page.fill('//input[@id="last"]', this.generateValue)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break
    }
  }
)

When('I update Personal Email', async function () {
  await this.page.locator('//input[@id="personal-email"]').clear()
  this.personalEmail = generateRandomEmail()
  await this.page.fill('//input[@id="personal-email"]', this.personalEmail)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Then(
  'Verfiy Updated Personal Email Address details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly',
  async function () {
    const actEmail = await this.page
      .locator(
        "//dt[normalize-space()='Personal email address']/following-sibling::dd[1]"
      )
      .innerText()
    expect(actEmail).toBe(this.personalEmail)
  }
)

Given(
  'I update Personal email address and click the {string} in the CheckYourPersonalEmailAddressIsCorrectBeforeSubmitting page',
  async function (linkType) {
    await this.page.locator('//input[@id="personal-email"]').clear()
    this.personalEmail = generateRandomEmail()
    await this.page.fill('//input[@id="personal-email"]', this.personalEmail)
    await this.page.locator("//button[normalize-space()='Continue']").click()

    switch (linkType.toLowerCase()) {
      case 'change':
        await this.page.getByRole('link', { name: 'Personal email' }).click()
        break
      case 'back':
        await this.page.locator('//a[normalize-space()="Back"]').click()
        break
    }
  }
)

Then(
  'Verify the previously entered details are still displayed in WhatIsYourPersonalEmailAddress? page',
  async function () {
    const actPersonalEmail = await this.page
      .locator("//input[@id='personal-email']")
      .inputValue()
    expect(actPersonalEmail).toBe(this.personalEmail)
  }
)

Given(
  'I enter the test data with value on the field Day {string} Month {string} and Year {string} On the WhatIsYourDateOfBirth page',
  async function (day, month, year) {
    await this.page.locator("//input[@id='day']").clear()
    await this.page.fill("//input[@id='day']", day)
    await this.page.locator("//input[@id='month']").clear()
    await this.page.fill("//input[@id='month']", month)
    await this.page.locator("//input[@id='year']").clear()
    await this.page.fill("//input[@id='year']", year)
    await this.page.locator("//button[normalize-space()='Continue']").click()
  }
)

Then(
  'The {string} change link should be {string}',
  async function (linkType, visible) {
    const shouldBeVisible = visible.toLowerCase() === 'yes'

    switch (linkType.toLowerCase()) {
      case 'businessaddress': {
        const count = await this.page
          .getByRole('link', { name: 'Change Business address' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      case 'businessphonenumbers': {
        const count = await this.page
          .getByRole('link', { name: 'Change Business telephone numbers' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      case 'businessemailaddress': {
        const count = await this.page
          .getByRole('link', { name: 'Change Business email address' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      case 'businessname': {
        const count = await this.page
          .getByRole('link', { name: 'Change business name' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      case 'businesslegalstatus': {
        const count = await this.page
          .getByRole('link', { name: 'Change business legal status' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      case 'businesstype': {
        const count = await this.page
          .getByRole('link', { name: 'Change business type' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      case 'vatnumber': {
        const count = await this.page
          .getByRole('link', { name: 'Change VAT registration number' })
          .count()
        shouldBeVisible
          ? expect(count).toBeGreaterThan(0)
          : expect(count).toBe(0)
        break
      }
      default:
        throw new Error(`Unknown link type: ${linkType}`)
    }
  }
)

Then(
  'Verify relevant Permission message type for {string} is displayed on the page ViewAndUpdateYourBusinessType',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'amendpermission': {
        const actMsg = await this.page
          .locator("//p[@class='govuk-body']")
          .innerText()
        expect(actMsg).toBe(
          'You only have permission to update contact details for this business. You can ask the business to raise your permission level.'
        )
        break
      }
      case 'viewpermission': {
        const actMsg = await this.page
          .locator("//p[@class='govuk-body']")
          .innerText()
        expect(actMsg).toBe(
          'You do not have permission to update details for this business. You can ask the business to raise your permission level.'
        )
        break
      }
      default:
        throw new Error(`Unknown permission type: ${linkType}`)
    }
  }
)

Given(
  'I enter the test data on the Emailformat as {string} on the {string} page',
  async function (emailFormat, _page) {
    await this.page.locator('//input[@id="personal-email"]').clear()
    await this.page.fill('//input[@id="personal-email"]', emailFormat)
    await this.page.locator('//button[normalize-space()="Continue"]').click()
  }
)

Given(
  'Verify relevant Header for {string} is displayed on the ViewAndUpdateYourBusinessType Page',
  async function (linkType) {
    if (linkType.toLowerCase() === 'viewpermission') {
      const actMsg = await this.page
        .locator("//*[@id='main-content']//h1")
        .innerText()
      expect(actMsg).toBe('View business details')
    }
  }
)

Then('Navigate to {string}', async function (baseurl) {
  await this.page.goto(`${TEST_SUITE_BASE_URL}${baseurl}`)
})

Then(
  'Application should display with Message as {string}',
  async function (expMsg) {
    const actMsg = await this.page
      .locator('//*[@id="main-content"]//h1')
      .innerText()
    expect(actMsg).toBe(expMsg)
  }
)

When('I click VAT submit button', async function () {
  await this.page
    .locator('#main-content > div.govuk-grid-row > div > form > button')
    .click()
  await this.page.waitForLoadState('domcontentloaded')
})

Then(
  'error message {string} on the page AreYouSureYouWantToRemoveYourVATRegistrationNumber page',
  async function (errorMessage) {
    await this.page
      .locator('.govuk-error-summary')
      .waitFor({ state: 'visible' })
    const errorText = await this.page
      .locator('.govuk-error-summary')
      .textContent()
    expect(errorText).toContain(errorMessage)
  }
)

When(
  'I enter invalid characters {string} on the {string} field on the {string} page',
  async function (invalidChars, field, _page) {
    switch (field.toLowerCase()) {
      case 'personalphone':
        await this.page.locator('//input[@id="personalTelephone"]').clear()
        await this.page.fill('//input[@id="personalTelephone"]', invalidChars)
        await this.page
          .locator('//button[normalize-space()="Continue"]')
          .click()
        break

      case 'personalmobilephone':
        await this.page.locator('//input[@id="personalMobile"]').clear()
        await this.page.fill('//input[@id="personalMobile"]', invalidChars)
        await this.page
          .locator('//button[normalize-space()="Continue"]')
          .click()
        break

      case 'businessphone':
        await this.page.locator('#businessTelephone').clear()
        await this.page.fill('#businessTelephone', invalidChars)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      case 'businessmobilephone':
        await this.page.locator('#businessMobile').clear()
        await this.page.fill('#businessMobile', invalidChars)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        break

      default:
        throw new Error(`Unknown field: ${field}`)
    }
  }
)

When(
  'I enter a valid postcode and continue to the address selection page',
  async function () {
    await this.page.locator("//input[@id='postcode']").fill('SW1A 1AA')
    await this.page.locator("//button[normalize-space()='Continue']").click()
  }
)

When(
  'I continue without selecting an address on the ChooseYourPersonalAddress page',
  async function () {
    await this.page.locator("//button[normalize-space()='Continue']").click()
  }
)

When(
  'I navigate to the CheckYourBusinessNameIsCorrectBeforeSubmitting page',
  async function () {
    await this.page.locator('//input[@id="business-name"]').clear()
    this.businessName = faker.company.name()
    await this.page.fill('//input[@id="business-name"]', this.businessName)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.waitForURL('**/business-name-check**')
  }
)

Then(
  'the following links should have the correct hrefs on the page:',
  async function (dataTable) {
    const rows = dataTable.hashes()
    for (const { Text, ExpectedHref } of rows) {
      const link = this.page.locator(`a[href="${ExpectedHref}"]`).filter({
        hasText: new RegExp(`^\\s*${Text}`, 'i')
      })
      await expect(link.first()).toHaveAttribute('href', ExpectedHref)
    }
  }
)

Then('following texts should be visible:', async function (dataTable) {
  const texts = dataTable.rawTable.slice(1).map((row) => row[0])
  for (const text of texts) {
    await expect(
      this.page.getByText(text, { exact: false }).first()
    ).toBeVisible()
  }
})

When(
  'I enter a valid postcode and continue to ChooseYourBusinessAddress page',
  async function () {
    this.postcode = getRandomUKPostcode()
    await this.page.locator('//input[@id="postcode"]').fill(this.postcode)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.waitForURL('**/business-address-select**')
  }
)

When('I select an address and submit', async function () {
  const select = '#addresses'
  await this.page.locator(select).waitFor({ state: 'visible' })
  const options = await this.page.$$(select + '> option')
  const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1
  await this.page.selectOption(select, { index: randomIndex })
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When(
  'I navigate to the CheckYourBusinessAddressIsCorrectBeforeSubmitting page',
  async function () {
    await this.page
      .locator("//a[normalize-space()='Enter address manually']")
      .click()
    await this.page.locator('//input[@id="address-1"]').clear()
    await this.page.fill(
      '//input[@id="address-1"]',
      faker.location.streetAddress()
    )
    await this.page.locator("//input[@id='city']").clear()
    await this.page.fill("//input[@id='city']", faker.location.city())
    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.waitForURL('**/business-address-check**')
  }
)

When(
  'I navigate to the CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting page',
  async function () {
    await this.page.locator('[id="businessTelephone"]').clear()
    await this.page.fill('#businessTelephone', generateRandomPhoneNumber())
    await this.page.locator("//button[normalize-space()='Continue']").click()
    // ✅ does not click Submit
    await this.page.waitForURL('**/business-phone-numbers-check**')
  }
)

When(
  'I navigate to the CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting page',
  async function () {
    await this.page.locator('//input[@id="business-email"]').clear()
    await this.page.fill('//input[@id="business-email"]', generateRandomEmail())
    await this.page.locator("//button[normalize-space()='Continue']").click()
    // ✅ does not click Submit
    await this.page.waitForURL('**/business-email-check**')
  }
)

When(
  'I navigate to the WhatIsYourVATRegistrationNumber page',
  async function () {
    await this.page
      .locator('//a[@href="/business-vat-registration-number-change"]')
      .click()
    // ✅ stops here — does not fill or continue
    await this.page.waitForURL('**/business-vat-registration-number-change**')
  }
)

When(
  'I navigate to the CheckYourVATRegistrationNumberIsCorrectBeforeSubmitting page',
  async function () {
    await this.page
      .locator('//a[@href="/business-vat-registration-number-change"]')
      .click()
    await this.page.locator('//input[@id="business-vat"]').clear()
    await this.page.fill('//input[@id="business-vat"]', '123456789')
    await this.page.locator('//button[normalize-space()="Continue"]').click()
    // ✅ does not click Submit
    await this.page.waitForURL('**/business-vat-registration-number-check**')
  }
)

function generateRandomPhoneNumber() {
  let phone = '0'
  for (let i = 0; i < 10; i++) phone += Math.floor(Math.random() * 10)
  return phone
}

function generateVatNumber(length) {
  let vatNumber = '0'
  for (let i = 0; i <= length; i++) vatNumber += Math.floor(Math.random() * 10)
  return vatNumber
}

function getRandomUKPostcode() {
  const ukPostcodes = [
    'BT1 5GS',
    'G1 2FF',
    'CF10 1EP',
    'LS1 4AP',
    'M1 1AE',
    'B1 1TB',
    'NE1 4LP',
    'NG1 5FS'
  ]
  return ukPostcodes[Math.floor(Math.random() * ukPostcodes.length)]
}

function generateRandomEmail() {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `test_${randomString}_${timestamp}@test.com`
}

function generateDiffLengthRandomEmail(length) {
  const domain = '@example.com'
  if (!length || length <= domain.length) return ''
  const localPartLength = length - domain.length
  return faker.string.alphanumeric(localPartLength).toLowerCase() + domain
}

function generateRandomUKPostcode() {
  const allowedFirstLetters = 'ABCDEFGHJKLMNOPRSTUWYZ'
  const allowedSecondLetters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'
  const inwardLetters = 'ABCDEFGHJLNPQRSTUVWXYZ'

  const randomChar = (chars) =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  const randomDigit = () => Math.floor(Math.random() * 10)

  const patterns = [
    () => randomChar(allowedFirstLetters) + randomDigit(),
    () => randomChar(allowedFirstLetters) + randomDigit() + randomDigit(),
    () =>
      randomChar(allowedFirstLetters) +
      randomChar(allowedSecondLetters) +
      randomDigit(),
    () =>
      randomChar(allowedFirstLetters) +
      randomChar(allowedSecondLetters) +
      randomDigit() +
      randomDigit(),
    () =>
      randomChar(allowedFirstLetters) +
      randomDigit() +
      randomChar(allowedSecondLetters),
    () =>
      randomChar(allowedFirstLetters) +
      randomChar(allowedSecondLetters) +
      randomDigit() +
      randomChar(allowedSecondLetters)
  ]

  const outward = patterns[Math.floor(Math.random() * patterns.length)]()
  const inward =
    randomDigit() + randomChar(inwardLetters) + randomChar(inwardLetters)
  return outward + ' ' + inward
}

function generateValidationTestData(field, length) {
  let value = ''
  while (value.length < length) {
    switch (field.toLowerCase()) {
      case 'addressline1':
      case 'addressline2':
        value += faker.location.streetAddress()
        break
      case 'businesstown':
      case 'town':
        value += faker.location.city()
        break
      case 'businesscountry':
      case 'country':
        value += faker.location.country()
        break
      case 'businesscounty':
      case 'county':
        value += faker.location.county()
        break
      case 'businessname':
        value += faker.company.name()
        break
      case 'personalfirstname':
        value += faker.person.firstName()
        break
      case 'personalmiddlename':
        value += faker.person.middleName()
        break
      case 'personallastname':
        value += faker.person.lastName()
        break
      case 'businessphone':
      case 'businessmobilephone':
      case 'personalphone':
      case 'personalmobilephone':
        value += generateRandomPhoneNumber()
        break
      case 'businessemailaddress':
        value += generateRandomEmail()
        break
      case 'vatnumber':
        value += generateVatNumber(length)
        break
    }
  }
  return value.substring(0, length)
}
