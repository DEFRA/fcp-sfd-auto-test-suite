// features/steps/testSteps.js
const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { fakerEN_GB: faker } = require('@faker-js/faker');
//const {Faker,en_GB,en} = require('@faker-js/faker');

setDefaultTimeout(120 * 1000); // 2 minutes

Given('I am in Given test', async function () {
  await this.page.goto("https://fcp-sfd-frontend.test.cdp-int.defra.cloud/business-details");
  await this.page.waitForTimeout(3000);
  await this.page.locator("//input[@id='crn']").fill("1100014934");
  await this.page.locator("//input[@id='password']").fill("Password456");
  await this.page.locator("//button[@id='next']").click();
});

When('I update phone', async function () {
  await this.page.waitForTimeout(3000);
  await this.page.getByRole('link', { name: 'Business type' }).click();
  await this.page.waitForTimeout(3000);
  await expect(this.page.getByText('If your business type is incorrect, contact the Rural Payments Agency to update it.')).toBeVisible();
  await expect(this.page.locator('.govuk-heading-m')).toContainText('Contact the Rural Payments Agency');
  await expect(this.page.getByText('Phone: 03000 200 301')).toBeVisible();
  await expect(this.page.getByText('Monday to Friday, 8.30am to 5pm (except bank holidays)')).toBeVisible();
});

When('I update phone2', async function () {
  await this.page.waitForTimeout(5000);
  await this.page.getByRole('link', { name: 'Business type' }).click();
  await this.page.waitForTimeout(5000);
  await expect(this.page.getByText('If your business type is incorrect, contact the Rural Payments Agency to update it.')).toBeVisible();
  await expect(this.page.locator('.govuk-heading-m')).toContainText('Contact the Rural Payments Agency');
  await expect(this.page.getByText('Phone: 03000 200 301')).toBeVisible();
  await expect(this.page.getByText('Monday to Friday, 8.30am to 5pm (except bank holidays1)')).toBeVisible();
});

When('I update phone number', async function () {
  // await this.page.getByRole('link', { name: 'Change business phone' }).click();
  await this.page.locator('[id="businessTelephone"]').clear();
  // Generate random phone number
  this.phonenumber = generateRandomPhoneNumber();
  await this.page.fill('#businessTelephone', this.phonenumber);
  await this.page.waitForTimeout(3000);
  await this.page.locator("//button[normalize-space()='Continue']").click();
  await this.page.locator("//button[normalize-space()='Submit']").click();
});

When('I update Email', async function () {
  await this.page.locator('//input[@id="business-email"]').clear();
  // Generate random email
  this.email = generateRandomEmail();
  await this.page.fill('//input[@id="business-email"]', this.email);
  await this.page.waitForTimeout(3000);
  await this.page.locator("//button[normalize-space()='Continue']").click();
  await this.page.locator("//button[normalize-space()='Submit']").click();
});
When('I update Business Name', async function () {
  await this.page.locator('//input[@id="business-name"]').clear();
  // Generate random email
  this.businessName = faker.company.name();
  await this.page.fill('//input[@id="business-name"]', this.businessName);
  await this.page.waitForTimeout(3000);
  await this.page.locator("//button[normalize-space()='Continue']").click();
  await this.page.locator("//button[normalize-space()='Submit']").click();
});

When('I update Business Address', async function () {

  /*   this.addressLine1 = generateRandomAddressLine1a();
    this.addressLine2 = generateRandomAddressLine2();
    this.town = generateRandomTown();
    this.postcode = generateRandomPostcode(); */

  // this.postcode = generateRandomUKPostcode();

  await this.page.locator('//input[@id="address-1"]').clear();
  //await this.page.fill('//input[@id="address-1"]', this.addressLine1);
  this.addressline1 = faker.location.streetAddress();
  await this.page.fill('//input[@id="address-1"]', this.addressline1);


  await this.page.locator('//input[@id="address-2"]').clear();
  // await this.page.fill('//input[@id="address-2"]', this.addressLine2);
  this.addressline2 = faker.location.secondaryAddress();
  await this.page.fill('//input[@id="address-2"]', this.addressline2);

  //  await this.page.waitForTimeout(3000);
  await this.page.locator('//input[@id="address-3"]').clear();


  await this.page.locator("//input[@id='city']").clear();
  //await this.page.fill("//input[@id='city']", this.town);
  this.city = faker.location.city();
  await this.page.fill("//input[@id='city']", this.city);


  await this.page.locator("//input[@id='county']").clear();
  await this.page.locator("//input[@id='postcode']").clear();
  this.postcode = generateRandomUKPostcode()
  await this.page.fill("//input[@id='postcode']", this.postcode);

  //const cf=new Faker({locale:[en_GB,en]})
  //const f= faker.location.
  //const f= faker.location.postcode();
  //await this.page.fill("//input[@id='postcode']", faker.location.postcode());


  await this.page.locator("//input[@id='country']").clear();
  await this.page.fill("//input[@id='country']", "United Kingdom");

  await this.page.locator("//button[normalize-space()='Continue']").click();
  await this.page.locator("//button[normalize-space()='Submit']").click();
});

Then('I need to check phone number', async function () {
  const actPhNum = await this.page.getByText('Telephone').textContent();
  const actual = actPhNum.split(':')[1].trim();
  expect(actual).toBe(this.phonenumber);
  expect(actual).toContain(this.phonenumber);
});

Given('I am on SignIn page and enter the credentials', async function () {
  //await this.page.goto("https://fcp-sfd-frontend.test.cdp-int.defra.cloud/business-details");
  await this.page.goto("https://fcp-sfd-frontend.test.cdp-int.defra.cloud/");
  await this.page.waitForTimeout(3000);
  await this.page.locator("//a[normalize-space()='Sign in']").click();
  // await this.page.locator("//a[normalize-space()='View and update your business details']").click();
  await this.page.locator("//input[@id='crn']").fill("1100014934");
  await this.page.locator("//input[@id='password']").fill("Password456");
  await this.page.locator("//button[@id='next']").click();
  await this.page.locator("//a[normalize-space()='View and update your business details']").click();

});

When('I click the BusinessType link on the BusinessDetails page', async function () {
  await this.page.waitForTimeout(2000);
  await this.page.getByRole('link', { name: 'Business type' }).click();
});

When('I click the {string} link on the BusinessDetails page', async function (linkType) {
  await this.page.waitForTimeout(2000);
  switch (linkType.toLowerCase()) {
    case 'businessphonenumbers':
      await this.page.getByRole('link', { name: 'Business phone numbers' }).click();
      break;
    case 'businesstype':
      await this.page.getByRole('link', { name: 'Business type' }).click();
      break;
    case 'businessemailaddress':
      await this.page.getByRole('link', { name: 'Business email address' }).click();
      break;
    case 'businessaddress':
      await this.page.getByRole('link', { name: 'Business address' }).click();
      break;
    case 'businessname':
      await this.page.getByRole('link', { name: 'Business name' }).click();
      break;
    case 'businesslegalstatus':
      await this.page.getByRole('link', { name: 'Business Legal Status' }).click();
      break;

    default:
      throw new Error('unknow link type:$(linkType)')
  }

});

//Then('Verfiy all relevant details on the ChangeYourBusinessType page are been displayed correctly', async function (linkType) {
Then('Verfiy all relevant details on the {string} page are been displayed correctly', async function (linkType) {
  await this.page.waitForTimeout(2000);
  switch (linkType.toLowerCase()) {
    case 'changeyourbusinesstype':
      await this.page.waitForTimeout(3000);
      await expect(this.page.getByText('If your business type is incorrect, contact the Rural Payments Agency to update it.')).toBeVisible();
      await expect(this.page.locator('.govuk-heading-m')).toContainText('Contact the Rural Payments Agency');
      await expect(this.page.getByText('Phone: 03000 200 301')).toBeVisible();
      await expect(this.page.getByText('Monday to Friday, 8.30am to 5pm (except bank holidays)')).toBeVisible();

      break;
    case 'changeyourlegalstatus':
      await this.page.waitForTimeout(3000);
      await expect(this.page.getByText('If your legal status is incorrect, contact the Rural Payments Agency to update it.')).toBeVisible();
      await expect(this.page.locator('.govuk-heading-m')).toContainText('Contact the Rural Payments Agency');
      await expect(this.page.getByText('Phone: 03000 200 301')).toBeVisible();
      await expect(this.page.getByText('Monday to Friday, 8.30am to 5pm (except bank holidays)')).toBeVisible();

      break;


    default:
      throw new Error('unknow link type:$(linkType)')
  }





});

Then('Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly', async function () {
  const actPhNum = await this.page.getByText('Telephone').textContent();
  const actual = actPhNum.split(':')[1].trim();
  await this.page.waitForTimeout(5000);
  expect(actual).toBe(this.phonenumber);
  expect(actual).toContain(this.phonenumber);
});

Then('Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly', async function () {

  // const txt =  await this.page.locator("//dt[normalize-space()='Business email address']/following-sibling::dd[1]").textContent();
  const actEmail = await this.page.locator("//dt[normalize-space()='Business email address']/following-sibling::dd[1]").innerText();
  //  const actTxt =  await this.page.locator("#//p[@class='govuk-notification-banner__heading']").textContent();
  //  const email = actEmail.split(':')[1].trim();
  await this.page.waitForTimeout(5000);
  expect(actEmail).toBe(this.email);
  expect(actEmail).toContain(this.email);
});


Then('Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly', async function () {

  const actBusinessName = await this.page.locator("//dt[normalize-space()='Business name']/following-sibling::dd[1]").innerText();
  await this.page.waitForTimeout(5000);
  expect(actBusinessName).toBe(this.businessName);
  expect(actBusinessName).toContain(this.businessName);
});

Then('Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly', async function () {

  // const txt =  await this.page.locator("//dt[normalize-space()='Business email address']/following-sibling::dd[1]").textContent();
  const actAddrLine1 = await this.page.locator("//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[1]").innerText();
  const actAddrLine2 = await this.page.locator("//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[2]").innerText();
  const actCity = await this.page.locator("//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[3]").innerText();
  const actPostcode = await this.page.locator("//dt[normalize-space()='Business address']/following-sibling::dd[1]/div[4]").innerText();
  //  const actTxt =  await this.page.locator("#//p[@class='govuk-notification-banner__heading']").textContent();
  //  const email = actEmail.split(':')[1].trim();
  await this.page.waitForTimeout(5000);
  expect(actAddrLine1).toBe(this.addressline1);
  expect(actAddrLine2).toContain(this.addressline2);
  expect(actCity).toBe(this.city);
  expect(actPostcode).toContain(this.postcode);
});

Then('Verify Success Updated message is displayed for {string} on the page ViewAndUpdateYourBusinessType', async function (updatedMsgType) {



  switch (updatedMsgType.toLowerCase()) {
    case 'businessphonenumbers':
      const actPhoneUpdatedMsg = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();

      expect(actPhoneUpdatedMsg).toBe("You have updated your business phone numbers");
      expect(actPhoneUpdatedMsg).toContain("You have updated your business phone numbers");
      break;
    case 'businessemailaddress':
      const actEmailUpdatedMsg = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();
      expect(actEmailUpdatedMsg).toBe("You have updated your business email address");
      expect(actEmailUpdatedMsg).toContain("You have updated your business email address1");
      break;

    case 'businessaddress':
      //const actTxt = await this.page.locator("//p[@class='govuk-notification-banner__heading']").textContent();
      const actAddressUpdatedMsg = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();

      expect(actAddressUpdatedMsg).toBe("You have updated your business address");
      expect(actAddressUpdatedMsg).toContain("You have updated your business address");
      break;

    case 'businessname':
      const actBusinessNameMsg = await this.page.locator("//p[@class='govuk-notification-banner__heading']").innerText();
      expect(actBusinessNameMsg).toBe("You have updated your business name");
      expect(actBusinessNameMsg).toContain("You have updated your business name");
      break;
    default:
      throw new Error('unknow link type:$(linkType)')
  }

});



When('I click signOut link on the {string} page', async function (signOutPage) {

  switch (signOutPage.toLowerCase()) {
    case 'viewandupdateyourbusinesstype':
      await this.page.locator("//a[normalize-space()='Sign out']").click();

      break;
    case 'whatisyourbusinessname':
      await this.page.getByRole('link', { name: 'Business name' }).click();
      await this.page.locator("//a[normalize-space()='Sign out']").click();
      break;
    case 'enteryourbusinessaddress':
      await this.page.getByRole('link', { name: 'Business email address' }).click();
      await this.page.locator("//a[normalize-space()='Sign out']").click();

      break;
    case 'whatareyourbusinessphonemembers':

      await this.page.getByRole('link', { name: 'Business phone numbers' }).click();
      await this.page.locator("//a[normalize-space()='Sign out']").click();

      break;
    case 'whatisyourbusinessemailaddress':
      await this.page.getByRole('link', { name: 'Business email address' }).click();
      await this.page.locator("//a[normalize-space()='Sign out']").click();

      break;
    case 'changeyourbusinesstype':
      await this.page.getByRole('link', { name: 'Business type' }).click();
      await this.page.locator("//a[normalize-space()='Sign out']").click();

      break;



    default:
      throw new Error('unknow link type:$(linkType)')
  }
});


Then('Application should Navigate to mp06 Signed Out page.', async function () {
  // await this.page.waitForTimeout(5000);
  const link = await this.page.locator('a[href="/auth/sign-in"]')
  const textt = await link.innerText();
  console.log(textt)
  await expect(link).toBeVisible();
});


Given('I sign In on the first tab', async function () {
  this.page1 = await this.context.newPage();
  await this.page1.goto("https://fcp-sfd-frontend.test.cdp-int.defra.cloud/");
  await this.page1.waitForTimeout(3000);
  await this.page1.locator("//a[normalize-space()='Sign in']").click();
  await this.page1.locator("//input[@id='crn']").fill("1100014934");
  await this.page1.locator("//input[@id='password']").fill("Password456");
  await this.page1.locator("//button[@id='next']").click();
  await this.page1.locator("//a[normalize-space()='View and update your business details']").click();
});


When('I open another tab with the same session', async function () {
  this.page2 = await this.context.newPage();

  await this.page2.goto("https://fcp-sfd-frontend.test.cdp-int.defra.cloud/");
  await this.page2.waitForTimeout(3000);
  await this.page2.locator("//a[normalize-space()='Sign in']").click();
  // await this.page2.locator("//input[@id='crn']").fill("1100014934");
  //  await this.page2.locator("//input[@id='password']").fill("Password456");
  //  await this.page2.locator("//button[@id='next']").click();
  await this.page2.locator("//a[normalize-space()='View and update your business details']").click();
});


When('I signOut on the first tab', async function () {
  await this.page1.bringToFront();
  await this.page1.locator("//a[normalize-space()='Sign out']").click();
  await this.page1.waitForTimeout(7000);

});


When('I switch to the second tab', async function () {
  await this.page2.bringToFront();
   await this.page2.waitForTimeout(2000);
});

When('I click on the link on the second tab', async function () {
  await this.page2.getByRole('link', { name: 'Business name' }).click();
   await this.page2.waitForTimeout(2000);
});


Then('I should be redirected to the signIn page from the second tab', async function () {
  const actSignOutPage = await this.page2.locator("//h1[@id='header']").innerText();

  expect(actSignOutPage).toBe("Sign in to farming front door");
  await this.page1.waitForTimeout(3000);

});

// Helper function
function generateRandomPhoneNumber() {
  let phone = '0';
  for (let i = 0; i < 10; i++) {
    phone += Math.floor(Math.random() * 10);
  }
  return phone;
}
function generateRandomEmail() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `test_${randomString}_${timestamp}@test.com`;

}

function generateRandomAddressLine1() {
  const number = Math.floor(Math.random() * 999 + 1);
  const streetNames = ['High Street', 'Main Road', 'Park Avenue', 'Church Lane', 'Station Road'];
  const prefixes = ['oak', 'Hill', 'green', 'park']
  //const street = streetNames[Math.floor (Math.random() * streetNames.lenght)];
  //const ss=number + '' + street;
  const ss1 = `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
  return `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
  return number + '' + street;


}

function generateRandomAddressLine1b() {
  faker.location.streetAddress();


}

function generateRandomAddressLine1a() {
  const number = Math.floor(Math.random() * 999 + 1);
  const streetNames = ['High Street', 'Main Road', 'Park Avenue', 'Church Lane', 'Station Road'];
  const prefixes = ['oak', 'Hill', 'green', 'park'];

  const street = streetNames[Math.floor(Math.random() * streetNames.lenght)];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.lenght)];
  const aa = `${number}${prefix}${street}`
  return `${number}${prefix}${street}`

  const ss1 = `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`
  return `${number}${randomItem(prefixes, 'prefixes')}${randomItem(streetNames, 'streetWords')}`


}

function generateRandomTown() {

  const towns = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Liverpool', 'Glasgow'];
  const ss1 = towns[Math.floor(Math.random() * towns.lenght)];
  return towns[Math.floor(Math.random() * towns.lenght)];


}

function generateRandomAddressLine2() {
  const areas = ['North', 'South', 'East', 'West', 'Central', 'Heights', 'Gardens'];
  const ss2 = areas[Math.floor(Math.random() * areas.lenght)] + '' + (Math.floor(Math.random() * 50) + 1);
  return areas[Math.floor(Math.random() * areas.lenght)] + '' + (Math.floor(Math.random() * 50) + 1);

}

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

}

function generateRandomUKPostcode() {
  const allowedFirstLetters = 'ABCDEFGHJKLMNOPRSTUWYZ'; // no Q, V, X
  const allowedSecondLetters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // some restrictions removed for simplicity
  const inwardLetters = 'ABCDEFGHJLNPQRSTUVWXYZ'; // inward code restrictions

  const randomChar = (chars) => chars.charAt(Math.floor(Math.random() * chars.length));
  const randomDigit = () => Math.floor(Math.random() * 10);

  // Outward code patterns
  const patterns = [
    () => randomChar(allowedFirstLetters) + randomDigit(),                // A9
    () => randomChar(allowedFirstLetters) + randomDigit() + randomDigit(),// A99
    () => randomChar(allowedFirstLetters) + randomChar(allowedSecondLetters) + randomDigit(), // AA9
    () => randomChar(allowedFirstLetters) + randomChar(allowedSecondLetters) + randomDigit() + randomDigit(), // AA99
    () => randomChar(allowedFirstLetters) + randomDigit() + randomChar(allowedSecondLetters), // A9A
    () => randomChar(allowedFirstLetters) + randomChar(allowedSecondLetters) + randomDigit() + randomChar(allowedSecondLetters), // AA9A
  ];

  const outward = patterns[Math.floor(Math.random() * patterns.length)]();
  const inward = randomDigit() + randomChar(inwardLetters) + randomChar(inwardLetters);
  const tt = outward + ' ' + inward;
  return outward + ' ' + inward;
}


function randomItem(arr, name = 'array') {
  if (!Array.isArray(arr)) {
    throw new Error(`${name}is not an array`)
  }

  if (arr.length === 0) {
    throw new Error(`${name}is empty`);
  }
  return arr[Math.floor(Math.random() * arr.length)];
}