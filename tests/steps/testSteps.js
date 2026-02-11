// features/steps/testSteps.js
// const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber')
// const { expect } = require('@playwright/test')
// const { fakerEN_GB: faker } = require('@faker-js/faker')
// const {Faker,en_GB,en} = require('@faker-js/faker');

import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
//  import { fakerEN_GB, faker } from '@faker-js/faker'
import { faker } from '@faker-js/faker'
//  const {Faker,en_GB,en} = require('@faker-js/faker');

setDefaultTimeout(120 * 1000) // 2 minutes

Given('I am in Given test', async function () {
  await this.page.goto(
    'https://fcp-sfd-frontend.test.cdp-int.defra.cloud/business-details'
  )
  await this.page.waitForTimeout(3000)
  await this.page.locator("//input[@id='crn']").fill('1100014934')
  await this.page.locator("//input[@id='password']").fill('Password456')
  await this.page.locator("//button[@id='next']").click()
})

When('I update phone', async function () {
  await this.page.waitForTimeout(3000)
  await this.page.getByRole('link', { name: 'Business type' }).click()
  await this.page.waitForTimeout(3000)
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
})

When('I update phone2', async function () {
  await this.page.waitForTimeout(5000)
  await this.page.getByRole('link', { name: 'Business type' }).click()
  await this.page.waitForTimeout(5000)
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
      'Monday to Friday, 8.30am to 5pm (except bank holidays1)'
    )
  ).toBeVisible()
})

When('I update phone number', async function () {
  // await this.page.getByRole('link', { name: 'Change business phone' }).click();
  await this.page.locator('[id="businessTelephone"]').clear()
  // Generate random phone number
  this.phonenumber = generateRandomPhoneNumber()
  await this.page.fill('#businessTelephone', this.phonenumber)
  await this.page.waitForTimeout(3000)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When('I update Email', async function () {
  await this.page.locator('//input[@id="business-email"]').clear()
  // Generate random email
  this.email = generateRandomEmail()
  await this.page.fill('//input[@id="business-email"]', this.email)
  await this.page.waitForTimeout(3000)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})
When('I update Business Name', async function () {
  await this.page.locator('//input[@id="business-name"]').clear()
  // Generate random email
  this.businessName = faker.company.name()
  await this.page.fill('//input[@id="business-name"]', this.businessName)
  await this.page.waitForTimeout(3000)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

When('I update Business Address', async function () {
  /*   this.addressLine1 = generateRandomAddressLine1a();
    this.addressLine2 = generateRandomAddressLine2();
    this.town = generateRandomTown();
    this.postcode = generateRandomPostcode(); */

  // this.postcode = generateRandomUKPostcode();
  await this.page
    .locator("//a[normalize-space()='Enter address manually']")
    .click()
  await this.page.locator('//input[@id="address-1"]').clear()
  // await this.page.fill('//input[@id="address-1"]', this.addressLine1);
  this.addressline1 = faker.location.streetAddress()
  await this.page.fill('//input[@id="address-1"]', this.addressline1)

  await this.page.locator('//input[@id="address-2"]').clear()
  // await this.page.fill('//input[@id="address-2"]', this.addressLine2);
  this.addressline2 = faker.location.secondaryAddress()
  await this.page.fill('//input[@id="address-2"]', this.addressline2)

  //  await this.page.waitForTimeout(3000);
  await this.page.locator('//input[@id="address-3"]').clear()

  await this.page.locator("//input[@id='city']").clear()
  // await this.page.fill("//input[@id='city']", this.town);
  this.city = faker.location.city()
  await this.page.fill("//input[@id='city']", this.city)

  await this.page.locator("//input[@id='county']").clear()
  await this.page.locator("//input[@id='postcode']").clear()
  this.postcode = generateRandomUKPostcode()
  await this.page.fill("//input[@id='postcode']", this.postcode)

  // const cf=new Faker({locale:[en_GB,en]})
  // const f= faker.location.
  // const f= faker.location.postcode();
  // await this.page.fill("//input[@id='postcode']", faker.location.postcode());

  await this.page.locator("//input[@id='country']").clear()
  await this.page.fill("//input[@id='country']", 'United Kingdom')

  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Then('I need to check phone number', async function () {
  const actPhNum = await this.page.getByText('Telephone').textContent()
  const actual = actPhNum.split(':')[1].trim()
  expect(actual).toBe(this.phonenumber)
  expect(actual).toContain(this.phonenumber)
})

Given(
   'I am on SignIn page and enter the credentials for {string}',
  async function (detailsType) {
    switch (detailsType.toLowerCase()) {
      case 'businessdetails':
      /*   await this.page.goto(
          'https://fcp-mpdp-frontend.test.cdp-int.defra.cloud/'
        ) */ 
 /*               await this.page.goto(
          'https://fcp-sfd-frontend.test.cdp-int.defra.cloud/'
        ) */
              await this.page.goto(
          'https://fcp-sfd-frontend.dev.cdp-int.defra.cloud/'
         ) 
        await this.page.waitForTimeout(3000)
        await this.page.locator("//a[normalize-space()='Sign in']").click()
        // await this.page.locator("//a[normalize-space()='View and update your business details']").click();
      //  await this.page.locator("//input[@id='crn']").fill('1100381252')
         await this.page.locator("//input[@id='crn']").fill('3010000031')
        await this.page.locator("//input[@id='password']").fill('Password456')
      //  await this.page.locator("//button[@id='next']").click()
         await this.page.locator("//button[@id='submit']").click()
        await this.page
          .locator(
            "//a[normalize-space()='View and update your business details']"
          )
          .click()
        break
      case 'personaldetails':
       /*  await this.page.goto(
          'https://fcp-sfd-frontend.test.cdp-int.defra.cloud/'
        ) */

                   await this.page.goto(
          'https://fcp-sfd-frontend.dev.cdp-int.defra.cloud/'
         )
        await this.page.waitForTimeout(13000)
        await this.page.locator("//a[normalize-space()='Sign in']").click()
        // await this.page.locator("//a[normalize-space()='View and update your business details']").click();
      //  await this.page.locator("//input[@id='crn']").fill('1100381252')
           await this.page.locator("//input[@id='crn']").fill('3010000031')
        await this.page.locator("//input[@id='password']").fill('Password456')
       // await this.page.locator("//button[@id='next']").click()
         await this.page.locator("//button[@id='submit']").click()
        await this.page.waitForTimeout(13000)
        await this.page
          .locator(
            "//a[normalize-space()='View and update your personal details']"
          )
          .click()
        await this.page.waitForTimeout(16000)
        break

      default:
        throw new Error('unknow link type:$(detailsType)')
    }
  }
)

When(
  'I click the BusinessType link on the BusinessDetails page',
  async function () {
    await this.page.waitForTimeout(2000)
    await this.page.getByRole('link', { name: 'Business type' }).click()
  }
)

When(
  'I click the {string} link on the BusinessDetails page',
  async function (linkType) {
    await this.page.waitForTimeout(2000)
    switch (linkType.toLowerCase()) {
      case 'businessphonenumbers':
        await this.page
          .getByRole('link', { name: 'Business phone numbers' })
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
        await this.page.getByRole('link', { name: 'Business name' }).click()
        break
      case 'businesslegalstatus':
        await this.page
          .getByRole('link', { name: 'Business Legal Status' })
          .click()
        break

      default:
        throw new Error('unknow link type:$(linkType)')
    }
  }
)

// Then('Verfiy all relevant details on the ChangeYourBusinessType page are been displayed correctly', async function (linkType) {
Then(
  'Verfiy all relevant details on the {string} page are been displayed correctly',
  async function (linkType) {
    await this.page.waitForTimeout(2000)
    switch (linkType.toLowerCase()) {
      case 'changeyourbusinesstype':
        await this.page.waitForTimeout(3000)
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
        await this.page.waitForTimeout(3000)
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
        throw new Error('unknow link type:$(linkType)')
    }
  }
)

Then(
  'Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly',
  async function () {
    const actPhNum = await this.page.getByText('Telephone').textContent()
    const actual = actPhNum.split(':')[1].trim()
    await this.page.waitForTimeout(5000)
    expect(actual).toBe(this.phonenumber)
    expect(actual).toContain(this.phonenumber)
  }
)

Then(
  'Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly',
  async function () {
    // const txt =  await this.page.locator("//dt[normalize-space()='Business email address']/following-sibling::dd[1]").textContent();
    const actEmail = await this.page
      .locator(
        "//dt[normalize-space()='Business email address']/following-sibling::dd[1]"
      )
      .innerText()
    //  const actTxt =  await this.page.locator("#//p[@class='govuk-notification-banner__heading']").textContent();
    //  const email = actEmail.split(':')[1].trim();
    await this.page.waitForTimeout(5000)
    expect(actEmail).toBe(this.email)
    expect(actEmail).toContain(this.email)
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
    await this.page.waitForTimeout(5000)
    expect(actBusinessName).toBe(this.businessName)
    expect(actBusinessName).toContain(this.businessName)
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
    await this.page.waitForTimeout(5000)
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
        const actPhoneUpdatedMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()

        expect(actPhoneUpdatedMsg).toBe(
          'You have updated your business phone numbers'
        )
        expect(actPhoneUpdatedMsg).toContain(
          'You have updated your business phone numbers'
        )
        break
      }
      case 'businessemailaddress': {
        const actEmailUpdatedMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(actEmailUpdatedMsg).toBe(
          'You have updated your business email address'
        )
        expect(actEmailUpdatedMsg).toContain(
          'You have updated your business email address'
        )
        break
      }
      case 'businessaddress': {
        // const actTxt = await this.page.locator("//p[@class='govuk-notification-banner__heading']").textContent();
        const actAddressUpdatedMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()

        expect(actAddressUpdatedMsg).toBe(
          'You have updated your business address'
        )
        expect(actAddressUpdatedMsg).toContain(
          'You have updated your business address'
        )
        break
      }
      case 'businessname': {
        const actBusinessNameMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(actBusinessNameMsg).toBe('You have updated your business name')
        expect(actBusinessNameMsg).toContain(
          'You have updated your business name'
        )
        break
      }
      case 'vatnumber': {
        const actVatNumberMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(actVatNumberMsg).toBe(
          'You have updated your VAT registration number'
        )
        expect(actVatNumberMsg).toContain(
          'You have updated your VAT registration number'
        )
        break
      }
      case 'yes': {
        const actvatnumberRemovedMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(actvatnumberRemovedMsg).toBe(
          'You have removed your VAT registration number'
        )
        expect(actvatnumberRemovedMsg).toContain(
          'You have removed your VAT registration number'
        )
        break
      }
      case 'no': {
        const actNoUpdatedMsgForvatnumber = await this.page.locator(
          "//p[@class='govuk-notification-banner__heading']"
        )
        expect(actNoUpdatedMsgForvatnumber).not.toBeVisible()
        expect(await actNoUpdatedMsgForvatnumber.isVisible()).toBe(false)
        break
      }
      default:
        throw new Error('unknow link type:$(linkType)')
    }
  }
)

When('I click signOut link on the {string} page', async function (signOutPage) {
  switch (signOutPage.toLowerCase()) {
    case 'viewandupdateyourbusinesstype':
      await this.page.locator("//a[normalize-space()='Sign out']").click()

      break
    case 'whatisyourbusinessname':
      await this.page.getByRole('link', { name: 'Business name' }).click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()
      break
    case 'enteryourbusinessaddress':
      await this.page
        .getByRole('link', { name: 'Business email address' })
        .click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()

      break
    case 'whatareyourbusinessphonemembers':
      await this.page
        .getByRole('link', { name: 'Business phone numbers' })
        .click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()

      break
    case 'whatisyourbusinessemailaddress':
      await this.page
        .getByRole('link', { name: 'Business email address' })
        .click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()

      break
    case 'changeyourbusinesstype':
      await this.page.getByRole('link', { name: 'Business type' }).click()
      await this.page.locator("//a[normalize-space()='Sign out']").click()

      break

    default:
      throw new Error('unknow link type:$(linkType)')
  }
})

Then('Application should Navigate to mp06 Signed Out page.', async function () {
  // await this.page.waitForTimeout(5000);
  const link = await this.page.locator('a[href="/auth/sign-in"]')
  // const textt = await link.innerText()
  // console.log(textt)
  await expect(link).toBeVisible()
})

Given('I sign In on the first tab', async function () {
  this.page1 = await this.context.newPage()
  await this.page1.goto('https://fcp-sfd-frontend.test.cdp-int.defra.cloud/')
  await this.page1.waitForTimeout(3000)
  await this.page1.locator("//a[normalize-space()='Sign in']").click()
  await this.page1.locator("//input[@id='crn']").fill('1100381252')
  await this.page1.locator("//input[@id='password']").fill('Password456')
  await this.page1.locator("//button[@id='next']").click()
  await this.page1
    .locator("//a[normalize-space()='View and update your business details']")
    .click()
})

When('I open another tab with the same session', async function () {
  this.page2 = await this.context.newPage()

  await this.page2.goto('https://fcp-sfd-frontend.test.cdp-int.defra.cloud/')
  await this.page2.waitForTimeout(3000)
  await this.page2.locator("//a[normalize-space()='Sign in']").click()
  // await this.page2.locator("//input[@id='crn']").fill("1100014934");
  //  await this.page2.locator("//input[@id='password']").fill("Password456");
  //  await this.page2.locator("//button[@id='next']").click();
  await this.page2
    .locator("//a[normalize-space()='View and update your business details']")
    .click()
})

When('I signOut on the first tab', async function () {
  await this.page1.bringToFront()
  await this.page1.locator("//a[normalize-space()='Sign out']").click()
  await this.page1.waitForTimeout(7000)
})

When('I switch to the second tab', async function () {
  await this.page2.bringToFront()
  await this.page2.waitForTimeout(2000)
})

When('I click on the link on the second tab', async function () {
  await this.page2.getByRole('link', { name: 'Business name' }).click()
  await this.page2.waitForTimeout(2000)
})

Then(
  'I should be redirected to the signIn page from the second tab',
  async function () {
    const actSignOutPage = await this.page2
      .locator("//h1[@id='header']")
      .innerText()

    expect(actSignOutPage).toBe('Sign in to farm and land service')
    await this.page1.waitForTimeout(3000)
  }
)

Given(
  'I update Business Name and click the Change link in CheckYourBusinessNameIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('//input[@id="business-name"]').clear()
    // Generate random email
    this.businessName = faker.company.name()
    await this.page.fill('//input[@id="business-name"]', this.businessName)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Business name' }).click()
  }
)

Given(
  'Change the Business Name again in WhatIsYourBusinessName? Page',
  async function () {
    await this.page.locator('//input[@id="business-name"]').clear()
    // Generate random email
    this.businessName = faker.company.name()
    await this.page.fill('//input[@id="business-name"]', this.businessName)
    await this.page.waitForTimeout(3000)
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
    await this.page.locator('//input[@id="address-1"]').clear()
    // await this.page.fill('//input[@id="address-1"]', this.addressLine1);
    this.addressline1 = faker.location.streetAddress()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    await this.page.locator('//input[@id="address-2"]').clear()
    // await this.page.fill('//input[@id="address-2"]', this.addressLine2);
    this.addressline2 = faker.location.secondaryAddress()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    //  await this.page.waitForTimeout(3000);
    await this.page.locator('//input[@id="address-3"]').clear()

    await this.page.locator("//input[@id='city']").clear()
    // await this.page.fill("//input[@id='city']", this.town);
    this.city = faker.location.city()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()
    await this.page.locator("//input[@id='postcode']").clear()
    this.postcode = generateRandomUKPostcode()
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
    await this.page.locator('//input[@id="address-1"]').clear()
    // await this.page.fill('//input[@id="address-1"]', this.addressLine1);
    this.addressline1 = faker.location.streetAddress()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    await this.page.locator('//input[@id="address-2"]').clear()
    // await this.page.fill('//input[@id="address-2"]', this.addressLine2);
    this.addressline2 = faker.location.secondaryAddress()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    //  await this.page.waitForTimeout(3000);
    await this.page.locator('//input[@id="address-3"]').clear()

    await this.page.locator("//input[@id='city']").clear()
    // await this.page.fill("//input[@id='city']", this.town);
    this.city = faker.location.city()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()
    await this.page.locator("//input[@id='postcode']").clear()
    this.postcode = generateRandomUKPostcode()
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
    // Generate random phone number
    this.phonenumber = generateRandomPhoneNumber()
    await this.page.fill('#businessTelephone', this.phonenumber)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    //  await this.page.locator("//button[normalize-space()='Submit']").click();
    await this.page
      .getByRole('link', { name: 'Business phone numbers' })
      .click()
  }
)

Given(
  'Change the Business PhoneNumber again in WhatAreYourBusinessPhoneNumbers? Page',
  async function () {
    await this.page.locator('[id="businessTelephone"]').clear()
    // Generate random phone number
    this.phonenumber = generateRandomPhoneNumber()
    await this.page.fill('#businessTelephone', this.phonenumber)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
    // await this.page.getByRole('link', { name: 'Business phone numbers' }).click();
  }
)

Then(
  'Verfiy Updated Business PhoneNumber details on the ViewAndUpdateYourBusinessType page are been displayed correctly',
  async function () {
    const actPhNum = await this.page.getByText('Telephone').textContent()
    const actual = actPhNum.split(':')[1].trim()
    await this.page.waitForTimeout(5000)
    expect(actual).toBe(this.phonenumber)
    expect(actual).toContain(this.phonenumber)
  }
)

Given(
  'I update Business EmailAddress and click the Change link in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('//input[@id="business-email"]').clear()
    // Generate random email
    this.email = generateRandomEmail()
    await this.page.fill('//input[@id="business-email"]', this.email)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    // await this.page.locator("//button[normalize-space()='Submit']").click();
    // await this.page.getByRole('link', { name: 'Business email address' }).click();
    await this.page.getByRole('link', { name: 'Business email' }).click()
  }
)

Given(
  'Change the Business EmailAddress again in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page',
  async function () {
    await this.page.locator('//input[@id="business-email"]').clear()
    // Generate random email
    this.email = generateRandomEmail()
    await this.page.fill('//input[@id="business-email"]', this.email)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
    // await this.page.getByRole('link', { name: '  Business email address' }).click();
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
    expect(actEmail).toContain(this.email)
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the BusinessAddress page',
  async function (field, length) {
    await this.page
      .locator("//a[normalize-space()='Enter address manually']")
      .click()
    await this.page.locator('//input[@id="address-1"]').clear()

    this.addressline1 = faker.location.streetAddress()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    await this.page.locator('//input[@id="address-2"]').clear()

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    await this.page.locator("//input[@id='city']").clear()
    this.city = faker.location.city()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()
    await this.page.locator("//input[@id='postcode']").clear()
    this.postcode = generateRandomUKPostcode()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')

    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'addressline1':
        // console.log(this.generateValue);
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
    const actErrMsg = await this.page
      .locator("//ul[@class='govuk-list govuk-error-summary__list']//li")
      .innerText()
    await this.page.waitForTimeout(3000)
    expect(actErrMsg).toBe(errMsg)
    //  expect(actEmail).toContain(this.email);
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the {string} page',
  async function (field, length, page) {
    this.generateValue = generateValidationTestData(field, length)
    /*  console.log(this.generateValue)
    console.log(this.generateValue) */

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
        // Generate random email
        this.email = generateDiffLengthRandomEmail(length)
        await this.page.fill('//input[@id="business-email"]', this.email)
        await this.page.waitForTimeout(3000)
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
        // await this.page.locator(' //button[normalize-space()="Submit"]').click();
        break
    }
  }
)

Given(
  'I click a link signIn link in LandAndFarmService page',
  async function () {
    //  await this.page.locator("//button[normalize-space()='Continue']").click();
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
  await this.page.locator(' //button[normalize-space()="Submit"]').click()
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
    //  await this.page.locator('//a[@href="/business-vat-registration-number-change"]').click();
    await this.page.locator('//input[@id="business-vat"]').clear()

    await this.page.fill('//input[@id="business-vat"]', '987654321')
    await this.page.locator('//button[normalize-space()="Continue"]').click()
    await this.page.locator(' //button[normalize-space()="Submit"]').click()
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
    await this.page.waitForTimeout(5000)
    expect(actUpdatedVATnumber).toBe('987654321')
    expect(actUpdatedVATnumber).toContain('987654321')
  }
)

When(
  'I click the {string} link on the "ViewAndUpdateYourPersonalDetails"Page',
  async function (linkType) {
    await this.page.waitForTimeout(2000)
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
        throw new Error('unknow link type:$(linkType)')
    }
  }
)

When('I update Personal phone number', async function () {
  await this.page.locator('[id="personalTelephone"]').clear()
  // Generate random phone number
  this.personalPhonenumber = generateRandomPhoneNumber()
  await this.page.fill('#personalTelephone', this.personalPhonenumber)
  await this.page.waitForTimeout(3000)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Then(
  'Verfiy updated phone details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly',
  async function () {
    const actPhNum = await this.page.getByText('Telephone').textContent()
    const actual = actPhNum.split(':')[1].trim()
    await this.page.waitForTimeout(5000)
    expect(actual).toBe(this.personalPhonenumber)
    expect(actual).toContain(this.personalPhonenumber)
  }
)

// Then('Verify Success Updated message is displayed for {string} on the page ViewAndUpdateYourPersonalDetails page', async function (updatedMsgType) {

Then(
  'Verify Success Updated message is displayed for {string} on the page ViewAndUpdateYourPersonalDetails page',
  async function (linkType) {
    /* 
  switch (linkType.toLowerCase()) {
    case 'personalPhonenumbers':
      const actPhoneUpdatedMsg = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();

      expect(actPhoneUpdatedMsg).toBe("You have updated your personal phone numbers");
      expect(actPhoneUpdatedMsg).toContain("You have updated your personal phone numbers");
      break;
 case 'fullname':
      const actFullName = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();

      expect(actFullName).toBe("You have updated your full name");
      expect(actFullName).toContain("You have updated your full name");
      break;

       case 'personalAddress':
      const personalAddress = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();

      expect(personalAddress).toBe("You have updated your personal address");
      expect(personalAddress).toContain("You have updated your personal address");
      break;
  } */

    await this.page.waitForTimeout(2000)
    switch (linkType.toLowerCase()) {
      case 'personalphonenumbers': {
        const actPhoneUpdatedMsg = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(actPhoneUpdatedMsg).toBe(
          'You have updated your personal phone numbers'
        )
        expect(actPhoneUpdatedMsg).toContain(
          'You have updated your personal phone numbers'
        )
        break
      }
      case 'fullname': {
        const actFullName = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(actFullName).toBe('You have updated your full name')
        expect(actFullName).toContain('You have updated your full name')
        break
      }
      case 'personaladdress': {
        const personalAddress = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(personalAddress).toBe('You have updated your personal address')
        expect(personalAddress).toContain(
          'You have updated your personal address'
        )
        break
      }
      case 'dob': {
        const dob = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(dob).toBe('You have updated your date of birth')
        expect(dob).toContain('You have updated your date of birth')
        break
      }

      case 'personalemailaddress': {
        const dob = await this.page
          .locator("//p[@class='govuk-notification-banner__heading']")
          .innerText()
        expect(dob).toBe('You have updated your personal email address')
        expect(dob).toContain('You have updated your personal email address')
        break
      }
      default:
        throw new Error('unknow link type:$(linkType)')
    }
  }
)

Given('I update Personal Name', async function () {
  await this.page.locator('//input[@id="first"]', this.firstName).clear()
  await this.page.locator('//input[@id="middle"]', this.middleName).clear()
  await this.page.locator('//input[@id="last"]', this.lastName).clear()

  this.firstName = faker.person.firstName()
  this.middleName = faker.person.middleName()
  this.lastName = faker.person.lastName()

  await this.page.fill('//input[@id="first"]', this.firstName)
  await this.page.fill('//input[@id="middle"]', this.middleName)
  await this.page.fill('//input[@id="last"]', this.lastName)
  await this.page.waitForTimeout(3000)
  await this.page.locator("//button[normalize-space()='Continue']").click()
  await this.page.locator("//button[normalize-space()='Submit']").click()
})

Then(
  'Verfiy Updated Personal Full Name details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly',
  async function () {
    const actBusinessName = await this.page
      .locator("//dt[normalize-space()='Full name']/following-sibling::dd[1]")
      .innerText()
    await this.page.waitForTimeout(5000)
    /* const aa =
      this.firstNameChanged +
      '' +
      this.middleNameChanged +
      '' +
      this.lastNameChanged
    const bb =
      this.firstNameChanged +
      ' ' +
      this.middleNameChanged +
      ' ' +
      this.lastNameChanged */
    expect(actBusinessName).toBe(
      this.firstName + ' ' + this.middleName + ' ' + this.lastName
    )
    expect(actBusinessName).toContain(
      this.firstName + ' ' + this.middleName + ' ' + this.lastName
    )
  }
)

Given(
  'I update Personal Name and click the Change link in CheckYourNameIsCorrectBeforeSubmitting page',
  async function () {
    await this.page.locator('//input[@id="first"]', this.firstName).clear()
    await this.page.locator('//input[@id="middle"]', this.middleName).clear()
    await this.page.locator('//input[@id="last"]', this.lastName).clear()

    this.firstName = faker.person.firstName()
    this.middleName = faker.person.middleName()
    this.lastName = faker.person.lastName()

    await this.page.fill('//input[@id="first"]', this.firstName)
    await this.page.fill('//input[@id="middle"]', this.middleName)
    await this.page.fill('//input[@id="last"]', this.lastName)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.getByRole('link', { name: 'Full name' }).click()
  }
)

Given(
  'Change the Personal Name again in WhatIsYourFullName? Page',
  async function () {
    await this.page.locator('//input[@id="first"]', this.firstName).clear()
    await this.page.locator('//input[@id="middle"]', this.middleName).clear()
    await this.page.locator('//input[@id="last"]', this.lastName).clear()

    this.firstName = faker.person.firstName()
    this.middleName = faker.person.middleName()
    this.lastName = faker.person.lastName()

    await this.page.fill('//input[@id="first"]', this.firstName)
    await this.page.fill('//input[@id="middle"]', this.middleName)
    await this.page.fill('//input[@id="last"]', this.lastName)
    await this.page.waitForTimeout(3000)
    await this.page.locator("//button[normalize-space()='Continue']").click()
    await this.page.locator("//button[normalize-space()='Submit']").click()
  }
)
Given(
  'I update Personal phone number and click the {string} in the CheckYourPersonalPhoneNumbersAreCorrectBeforeSubmitting page',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'change':
        await this.page.locator('[id="personalTelephone"]').clear()

        this.personalPhonenumber = generateRandomPhoneNumber()
        await this.page.fill('#personalTelephone', this.personalPhonenumber)
        await this.page.waitForTimeout(3000)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        await this.page
          .getByRole('link', { name: 'Personal phone numbers' })
          .click()

        break
      case 'back':
        await this.page.locator('[id="personalTelephone"]').clear()

        this.personalPhonenumber = generateRandomPhoneNumber()
        await this.page.fill('#personalTelephone', this.personalPhonenumber)
        await this.page.waitForTimeout(3000)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()

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
    await this.page.waitForTimeout(5000)
    expect(acttelephoneNumber).toBe(this.personalPhonenumber)
    expect(acttelephoneNumber).toContain(this.personalPhonenumber)
  }
)
When('I Update the Personal address {string}', async function (addressType) {
  switch (addressType.toLowerCase()) {
    case 'manually':
      await this.page
        .locator("//a[normalize-space()='Enter address manually']")
        .click()
      await this.page.locator('//input[@id="address-1"]').clear()

      this.addressline1 = faker.location.streetAddress()
      await this.page.fill('//input[@id="address-1"]', this.addressline1)

      await this.page.locator('//input[@id="address-2"]').clear()

      this.addressline2 = faker.location.secondaryAddress()
      await this.page.fill('//input[@id="address-2"]', this.addressline2)

      await this.page.locator('//input[@id="address-3"]').clear()

      await this.page.locator("//input[@id='city']").clear()
      this.city = faker.location.city()
      await this.page.fill("//input[@id='city']", this.city)

      await this.page.locator("//input[@id='county']").clear()
      await this.page.locator("//input[@id='postcode']").clear()
      this.postcode = generateRandomUKPostcode()
      await this.page.fill("//input[@id='postcode']", this.postcode)

      await this.page.locator("//input[@id='country']").clear()
      await this.page.fill("//input[@id='country']", 'United Kingdom')
      await this.page.locator("//button[normalize-space()='Continue']").click()
      await this.page.locator("//button[normalize-space()='Submit']").click()

      break
    case 'postcodelookup': {
      await this.page.locator("//input[@id='postcode']").clear()
      this.postcode = getRandomUKPostcode()
      //   await this.page.fill("//input[@id='postcode']", "cf645we");
      await this.page.fill("//input[@id='postcode']", this.postcode)

      // await this.page.waitForTimeout(3000);
      await this.page.locator("//button[normalize-space()='Continue']").click()
      const se = '#addresses'
      // await this.page.locator("#addresses").click();
      // await this.page.locator("//*[@id='addresses']/option[4]").click();

      // await this.page.selectOption(se,{index:10});
      await this.page.waitForTimeout(5000)
      const opt = await this.page.$$(se + '> option')
      const ee = opt.length

      // const e = await this.page.locator("#addresses");

      // await this.page.selectOption("//select[@id='addresses']",{index:2});
      //  const options=await this.page.locator("//select[@id='addresses']").click();

      // const count = await options.count();
      const randomIndex = Math.floor(Math.random() * (ee - 1)) + 1

      await this.page.selectOption(se, { index: randomIndex })

      // const te=$("#addresses :selected").text();
      // const te= e.options[e.selectedIndex].text;

      //  const mm =await this.page.selectOption(se,{index:randomIndex}).textContent();

      // const selecteText1= await page.$eval('#addresses',el=>el.querySelector('option:checked').text);
      // console.log(selecteText1);
      // const selecteText= await page.$eval(se,el=>el.options[el.selectedIndex].text);
      // console.log(selecteText);
      // const selectedText = await.page.$eval('se',el => el.options[el.selected])
      // const  randomValue = await this.page.locator("#addresses").textContent();
      // console.log(randomValue);

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
    await this.page.locator('//input[@id="address-1"]').clear()

    this.addressline1 = faker.location.streetAddress()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    await this.page.locator('//input[@id="address-2"]').clear()

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    await this.page.locator("//input[@id='city']").clear()
    this.city = faker.location.city()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()
    await this.page.locator("//input[@id='postcode']").clear()
    this.postcode = generateRandomUKPostcode()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')
    await this.page.locator("//button[normalize-space()='Continue']").click()
    // await this.page.locator("//button[normalize-space()='Submit']").click();
    await this.page.getByRole('link', { name: 'Personal address' }).click()
  }
)

Given(
  'Change the Personal Address Manually again in EnterYourPersonalAddress Page',
  async function () {
    await this.page.locator('//input[@id="address-1"]').clear()

    this.addressline1 = faker.location.streetAddress()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    await this.page.locator('//input[@id="address-2"]').clear()

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    await this.page.locator("//input[@id='city']").clear()
    this.city = faker.location.city()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()
    await this.page.locator("//input[@id='postcode']").clear()
    this.postcode = generateRandomUKPostcode()
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
    await this.page.waitForTimeout(5000)
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
    await this.page.locator('//input[@id="address-1"]').clear()

    this.addressline1 = faker.location.streetAddress()
    await this.page.fill('//input[@id="address-1"]', this.addressline1)

    await this.page.locator('//input[@id="address-2"]').clear()

    this.addressline2 = faker.location.secondaryAddress()
    await this.page.fill('//input[@id="address-2"]', this.addressline2)

    await this.page.locator('//input[@id="address-3"]').clear()

    await this.page.locator("//input[@id='city']").clear()
    this.city = faker.location.city()
    await this.page.fill("//input[@id='city']", this.city)

    await this.page.locator("//input[@id='county']").clear()
    await this.page.locator("//input[@id='postcode']").clear()
    this.postcode = generateRandomUKPostcode()
    await this.page.fill("//input[@id='postcode']", this.postcode)

    await this.page.locator("//input[@id='country']").clear()
    await this.page.fill("//input[@id='country']", 'United Kingdom')

    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'addressline1':
        // console.log(this.generateValue);
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
    //  this.postcode = getRandomUKPostcode()
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

    switch (linkType.toLowerCase()) {
      case 'change':
        await this.page.locator("//input[@id='day']").clear()
        await this.page.fill("//input[@id='day']", this.day)

        await this.page.locator("//input[@id='month']").clear()
        await this.page.fill("//input[@id='month']", this.month)

        await this.page.locator("//input[@id='year']").clear()
        await this.page.fill("//input[@id='year']", this.year)
        await this.page.waitForTimeout(3000)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()
        await this.page.getByRole('link', { name: 'Date of birth' }).click()

        break
      case 'back':
        await this.page.locator("//input[@id='day']").clear()
        await this.page.fill("//input[@id='day']", this.day)

        await this.page.locator("//input[@id='month']").clear()
        await this.page.fill("//input[@id='month']", this.month)

        await this.page.locator("//input[@id='year']").clear()
        await this.page.fill("//input[@id='year']", this.year)
        await this.page.waitForTimeout(3000)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()

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
    await this.page.waitForTimeout(5000)
    expect(actDayValue).toBe(this.day)
    expect(actMonthValue).toContain(this.month)
    expect(actYearValue).toBe(this.year)
  }
)

Given(
  'I enter the test data on the field {string} with value as {string} on the WhatIsYourFullName? page',
  async function (field, length) {
    await this.page.locator('//input[@id="first"]').clear()
    this.firstName = faker.person.firstName()
    await this.page.fill('//input[@id="first"]', this.firstName)

    await this.page.locator('//input[@id="middle"]').clear()
    this.middleName = faker.person.middleName()
    await this.page.fill('//input[@id="middle"]', this.middleName)

    await this.page.locator('//input[@id="last"]').clear()
    this.lastName = faker.person.lastName()
    await this.page.fill('//input[@id="last"]', this.lastName)

    this.generateValue = generateValidationTestData(field, length)

    switch (field.toLowerCase()) {
      case 'personalfirstname':
        // console.log(this.generateValue);
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
  // Generate random email
  this.personalEmail = generateRandomEmail()
  await this.page.fill('//input[@id="personal-email"]', this.personalEmail)
  await this.page.waitForTimeout(3000)
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
    //  const actTxt =  await this.page.locator("#//p[@class='govuk-notification-banner__heading']").textContent();
    //  const email = actEmail.split(':')[1].trim();
    await this.page.waitForTimeout(5000)
    expect(actEmail).toBe(this.personalEmail)
    expect(actEmail).toContain(this.personalEmail)
  }
)
Given(
  'I update Personal email address and click the {string} in the CheckYourPersonalEmailAddressIsCorrectBeforeSubmitting page',
  async function (linkType) {
    switch (linkType.toLowerCase()) {
      case 'change':
        await this.page.locator('//input[@id="personal-email"]').clear()
        // Generate random email
        this.personalEmail = generateRandomEmail()
        await this.page.fill(
          '//input[@id="personal-email"]',
          this.personalEmail
        )
        await this.page.waitForTimeout(3000)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()

        await this.page.getByRole('link', { name: 'Personal email' }).click()

        break
      case 'back':
        await this.page.locator('//input[@id="personal-email"]').clear()
        // Generate random email
        this.personalEmail = generateRandomEmail()
        await this.page.fill(
          '//input[@id="personal-email"]',
          this.personalEmail
        )
        await this.page.waitForTimeout(3000)
        await this.page
          .locator("//button[normalize-space()='Continue']")
          .click()

        await this.page.locator('//a[normalize-space()="Back"]').click()

        break
    }
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
  'Verify the previously entered details are still displayed in WhatIsYourPersonalEmailAddress? page',
  async function () {
    const actPersonalEmail = await this.page
      .locator("//input[@id='personal-email']")
      .inputValue()
    await this.page.waitForTimeout(5000)
    expect(actPersonalEmail).toBe(this.personalEmail)
    expect(actPersonalEmail).toContain(this.personalEmail)
  }
)
// Helper function
function generateRandomPhoneNumber() {
  let phone = '0'
  for (let i = 0; i < 10; i++) {
    phone += Math.floor(Math.random() * 10)
  }
  return phone
}

function generateVatNumber(length) {
  let vatNumber = '0'
  for (let i = 0; i <= length; i++) {
    vatNumber += Math.floor(Math.random() * 10)
  }
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
  const randomIndex = Math.floor(Math.random() * ukPostcodes.length)
  return ukPostcodes[randomIndex]
}

function generateRandomEmail() {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  return `test_${randomString}_${timestamp}@test.com`
}
function generateDiffLengthRandomEmail(lenght) {
  const domain = '@example.com'
  if (!lenght || lenght <= domain.length) {
    return ''
  }
  const localPartLength = lenght - domain.length
  // if (localPartLength <=0) throw new Error ("length too short")
  return faker.string.alphanumeric(localPartLength).toLowerCase() + domain
}

/* function generateRandomAddressLine1() {
  const number = Math.floor(Math.random() * 999 + 1)
  const streetNames = [
    'High Street',
    'Main Road',
    'Park Avenue',
    'Church Lane',
    'Station Road'
  ]
  const prefixes = ['oak', 'Hill', 'green', 'park']
  // const street = streetNames[Math.floor (Math.random() * streetNames.lenght)];
  // const ss=number + '' + street;
  const ss1 = `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
  return `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
  return number + '' + street
} */
/* 
function generateRandomAddressLine1b() {
  faker.location.streetAddress()
} */

/* function generateRandomAddressLine1a() {
  const number = Math.floor(Math.random() * 999 + 1)
  const streetNames = [
    'High Street',
    'Main Road',
    'Park Avenue',
    'Church Lane',
    'Station Road'
  ]
  const prefixes = ['oak', 'Hill', 'green', 'park']

  const street = streetNames[Math.floor(Math.random() * streetNames.lenght)]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.lenght)]
 // const aa = `${number}${prefix}${street}`
  return `${number}${prefix}${street}`

 // const ss1 = `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
  return `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
} */

/* function generateRandomTown() {
  const towns = [
    'London',
    'Manchester',
    'Birmingham',
    'Leeds',
    'Bristol',
    'Liverpool',
    'Glasgow'
  ]
  const ss1 = towns[Math.floor(Math.random() * towns.lenght)]
  return towns[Math.floor(Math.random() * towns.lenght)]
} */

/* function generateRandomAddressLine2() {
  const areas = [
    'North',
    'South',
    'East',
    'West',
    'Central',
    'Heights',
    'Gardens'
  ]
  const ss2 =
    areas[Math.floor(Math.random() * areas.lenght)] +
    '' +
    (Math.floor(Math.random() * 50) + 1)
  return (
    areas[Math.floor(Math.random() * areas.lenght)] +
    '' +
    (Math.floor(Math.random() * 50) + 1)
  )
} */

/* 
function generateRandomPostcode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length))
  const randomDigit = () => Math.floor(Math.random() * 10);
  const ff = randomLetter() +
    (Math.random() > 0.5 ? randomLetter() : '') +
    randomDigit() +
    (Math.random() > 0.5 ? randomDigit() : '') +
    '' +
    randomDigit() +
    randomLetter() +
    randomLetter();
  return (
    randomLetter() +
    (Math.random() > 0.5 ? randomLetter() : '') +
    randomDigit() +
    (Math.random() > 0.5 ? randomDigit() : '') +
    '' +
    randomDigit() +
    randomLetter() +
    randomLetter());

} */

function generateRandomUKPostcode() {
  const allowedFirstLetters = 'ABCDEFGHJKLMNOPRSTUWYZ' // no Q, V, X
  const allowedSecondLetters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ' // some restrictions removed for simplicity
  const inwardLetters = 'ABCDEFGHJLNPQRSTUVWXYZ' // inward code restrictions

  const randomChar = (chars) =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  const randomDigit = () => Math.floor(Math.random() * 10)

  // Outward code patterns
  const patterns = [
    () => randomChar(allowedFirstLetters) + randomDigit(), // A9
    () => randomChar(allowedFirstLetters) + randomDigit() + randomDigit(), // A99
    () =>
      randomChar(allowedFirstLetters) +
      randomChar(allowedSecondLetters) +
      randomDigit(), // AA9
    () =>
      randomChar(allowedFirstLetters) +
      randomChar(allowedSecondLetters) +
      randomDigit() +
      randomDigit(), // AA99
    () =>
      randomChar(allowedFirstLetters) +
      randomDigit() +
      randomChar(allowedSecondLetters), // A9A
    () =>
      randomChar(allowedFirstLetters) +
      randomChar(allowedSecondLetters) +
      randomDigit() +
      randomChar(allowedSecondLetters) // AA9A
  ]

  const outward = patterns[Math.floor(Math.random() * patterns.length)]()
  const inward =
    randomDigit() + randomChar(inwardLetters) + randomChar(inwardLetters)
  // const tt = outward + ' ' + inward
  return outward + ' ' + inward
}

/* function randomItem(arr, name = 'array') {
  if (!Array.isArray(arr)) {
    throw new Error(`${name}is not an array`)
  }

  if (arr.length === 0) {
    throw new Error(`${name}is empty`)
  }
  return arr[Math.floor(Math.random() * arr.length)]
} */

function generateValidationTestData(field, length) {
  let value = ''
  while (value.length < length) {
    switch (field.toLowerCase()) {
      case 'addressline1':
      case 'addressline2':
        value += faker.location.streetAddress() + ''
        break

      case 'businesstown':
      case 'town':
        value += faker.location.city() + ''
        break

      case 'businesscountry':
      case 'country':
        value += faker.location.country() + ''
        break

      case 'businesscounty':
      case 'county':
        value += faker.location.county() + ''
        break
      case 'businessname':
        value += faker.company.name() + ''
        break

      case 'personalfirstname':
        value += faker.person.firstName() + ''
        break

      case 'personalmiddlename':
        value += faker.person.middleName() + ''
        break

      case 'personallastname':
        value += faker.person.lastName() + ''
        break
      case 'businessphone':
        // value += faker.company.generateRandomPhoneNumber() + '';
        value += generateRandomPhoneNumber() + ''

        break
      case 'personalphone':
        // value += faker.company.generateRandomPhoneNumber() + '';
        value += generateRandomPhoneNumber() + ''

        break
      case 'personalmobilephone':
        // value += faker.company.generateRandomPhoneNumber() + '';
        value += generateRandomPhoneNumber() + ''

        break

      case 'businessemailaddress':
        value += generateRandomEmail() + ''
        break

      case 'vatnumber':
        value += generateVatNumber(length) + ''
        break
    }
  }
  return value.substring(0, length)
}
