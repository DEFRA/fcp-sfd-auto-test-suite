import { test, expect, summaryValue } from './fixtures.js'
import {
  expectSuccessBanner,
  expectNoSuccessBanner
} from '../helpers/banners.js'
import { randomEmail } from './data.js'
import { faker } from '@faker-js/faker'

async function continueThenSubmit(page, checkUrl) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page).toHaveURL(checkUrl)
  await page.getByRole('button', { name: 'Submit', exact: true }).click()
}

test.describe('View business details @browserstack', () => {
  const pages = [
    {
      link: 'Business type',
      text: 'If your business type is incorrect, contact the Rural Payments Agency to update it.'
    },
    {
      link: 'Business Legal Status',
      text: 'If your legal status is incorrect, contact the Rural Payments Agency to update it.'
    }
  ]

  for (const { link, text } of pages) {
    test(`${link} page tells the user to contact the RPA`, async ({
      businessDetailsPage: page
    }) => {
      await page.getByRole('link', { name: link }).click()
      await expect(page.getByText(text)).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'Contact the Rural Payments Agency' })
      ).toBeVisible()
      await expect(page.getByText('Phone: 03000 200 301')).toBeVisible()
      await expect(
        page.getByText('Monday to Friday, 8.30am to 5pm (except bank holidays)')
      ).toBeVisible()
    })
  }
})

test.describe('Update business details @browserstack', () => {
  test('business email address gets updated', async ({
    businessDetailsPage: page
  }) => {
    const email = randomEmail()
    await page.getByRole('link', { name: 'Business email address' }).click()
    await page.locator('#business-email').fill(email)
    await continueThenSubmit(page, /business-email-check/)

    await expect(summaryValue(page, 'Business email address')).toHaveText(email)
    await expectSuccessBanner(
      page,
      'You have updated your business email address'
    )
  })

  // Fails while UPDATE_BUSINESS_DETAILS_NAME is off in the Test environment (FLS2-486).
  test('business name gets updated', async ({ businessDetailsPage: page }) => {
    const name = faker.company.name()
    await page.locator('a[href="/business-name-change"]').click()
    await page.locator('#business-name').fill(name)
    await continueThenSubmit(page, /business-name-check/)

    await expect(summaryValue(page, 'Business name')).toHaveText(name)
    await expectSuccessBanner(page, 'You have updated your business name')
  })

  test.describe('removing the VAT registration number', () => {
    test.beforeEach(async ({ businessDetailsPage: page }) => {
      await page
        .locator('a[href="/business-vat-registration-number-change"]')
        .click()
      await page.locator('#business-vat').fill('123456789')
      await continueThenSubmit(page, /business-vat-registration-number-check/)
      await page.locator('a[href="/business-vat-registration-remove"]').click()
    })

    test('choosing Yes removes it', async ({ page }) => {
      await page.locator('#confirmRemove').check()
      await page.getByRole('button', { name: 'Submit', exact: true }).click()
      await expectSuccessBanner(
        page,
        'You have removed your VAT registration number'
      )
    })

    test('choosing No keeps it', async ({ page }) => {
      await page.locator('#confirmRemove-2').check()
      await page.getByRole('button', { name: 'Submit', exact: true }).click()
      await expectNoSuccessBanner(page)
    })
  })
})
