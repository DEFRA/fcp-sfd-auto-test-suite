//   features/support/hooks.js
//   const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');
//   const { chromium } = require('playwright');
//   const { allure } = require('allure-cucumberjs');

import { Before, After, setWorldConstructor } from '@cucumber/cucumber'
import { chromium } from 'playwright'
//  import { allure } from 'allure-cucumberjs';

class CustomWorld {
  constructor() {
    this.browser = null
    this.context = null
    this.page = null
    this.phonenumber = null // optional for your scenario
  }
}

setWorldConstructor(CustomWorld)

Before(async function () {
  // Launch browser before each scenario
  // console.log('i am inside hooks')
  this.browser = await chromium.launch({
    headless: true,
    proxy: {
      server: 'http://localhost:3128'
    }
  })

  this.context = await this.browser.newContext()
  this.page = await this.context.newPage()
})

After({ order: 1 }, async function (scenario) {
  // Capture screenshot for failed scenario
  if (scenario.result.status === 'FAILED' && this.page) {
    //  const screenshot = await this.page.screenshot()
    // allure.attachment('Screenshot', screenshot, 'image/png')
  }
})

After({ order: 2 }, async function () {
  // Close page, context, browser
  if (this.page) await this.page.close()
  if (this.context) await this.context.close()
  if (this.browser) await this.browser.close()
})
