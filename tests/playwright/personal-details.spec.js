import { test, expect, summaryValue, expectErrorSummary } from './fixtures.js'
import { expectSuccessBanner } from '../helpers/banners.js'
import { randomEmail, randomPhoneNumber, phoneOfLength } from './data.js'

async function continueThenSubmit(page, checkUrl) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page).toHaveURL(checkUrl)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
}

test.describe('Update personal details @browserstack', () => {
  test('personal phone number gets updated', async ({
    personalDetailsPage: page
  }) => {
    const phone = randomPhoneNumber()
    await page.getByRole('link', { name: 'Personal phone numbers' }).click()
    await page
      .getByLabel('Personal telephone number', { exact: true })
      .fill(phone)
    await continueThenSubmit(page, /account-phone-numbers-check/)

    await expect(page.getByText('Telephone')).toContainText(phone)
    await expectSuccessBanner(
      page,
      'You have updated your personal phone numbers'
    )
  })

  test('personal email address gets updated', async ({
    personalDetailsPage: page
  }) => {
    const email = randomEmail()
    await page.getByRole('link', { name: 'Personal email address' }).click()
    await page
      .getByRole('textbox', {
        name: 'What is your personal email address?',
        exact: true
      })
      .fill(email)
    await continueThenSubmit(page, /account-email-check/)

    await expect(summaryValue(page, 'Personal email address')).toHaveText(email)
    await expectSuccessBanner(
      page,
      'You have updated your personal email address'
    )
  })
})

const TELEPHONE = 'Personal telephone number'
const MOBILE = 'Personal mobile phone number'

test.describe('Personal phone number validation @browserstack', () => {
  const cases = [
    {
      fields: [TELEPHONE],
      length: 101,
      error: 'Personal telephone number must be 50 characters or less'
    },
    {
      fields: [TELEPHONE],
      length: 1,
      error: 'Personal telephone number must be 10 characters or more'
    },
    {
      fields: [TELEPHONE, MOBILE],
      length: 0,
      error: 'Enter at least one phone number'
    },
    {
      fields: [MOBILE],
      length: 101,
      error: 'Personal mobile phone number must be 50 characters or less'
    },
    {
      fields: [MOBILE],
      length: 1,
      error: 'Personal mobile phone number must be 10 characters or more'
    }
  ]

  for (const { fields, length, error } of cases) {
    test(`${fields.join(' + ')} with ${length} characters shows "${error}"`, async ({
      personalDetailsPage: page
    }) => {
      await page.getByRole('link', { name: 'Personal phone numbers' }).click()
      const value = phoneOfLength(length)
      for (const label of fields) {
        await page.getByLabel(label, { exact: true }).fill(value)
      }
      await page.getByRole('button', { name: 'Continue', exact: true }).click()
      await expectErrorSummary(page, error)
    })
  }
})

test.describe('Personal email validation @browserstack', () => {
  test('an empty email address is rejected', async ({
    personalDetailsPage: page
  }) => {
    await page.getByRole('link', { name: 'Personal email address' }).click()
    await page
      .getByRole('textbox', {
        name: 'What is your personal email address?',
        exact: true
      })
      .fill('')
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await expectErrorSummary(page, 'Enter a personal email address')
  })
})
