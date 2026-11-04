//   features/support/hooks.js
//   const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');
//   const { chromium } = require('playwright');
//   const { allure } = require('allure-cucumberjs');

import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  setWorldConstructor,
  setDefaultTimeout
} from '@cucumber/cucumber'
import { chromium } from 'playwright'
//  import { allure } from 'allure-cucumberjs';

let browser

class CustomWorld {
  constructor() {
    this.browser = null
    this.context = null
    this.page = null
    this.page1 = null
    this.page2 = null
    this.phonenumber = null // optional for your scenario
  }
}

setDefaultTimeout(60 * 1000) // 60 seconds per step

setWorldConstructor(CustomWorld)

BeforeAll(async function () {
  const launchOptions = {
    headless: true
  }

  if (process.env.CDP_PROXY === 'true') {
    launchOptions.proxy = {
      server: 'http://localhost:3128'
    }
    launchOptions.args = [
      '--ignore-certificate-errors',
      '--disable-background-networking',
      '--dns-prefetch-disable'
    ]
  }

  browser = await chromium.launch(launchOptions)
})

Before(async function () {
  this.browser = browser
  this.context = await browser.newContext({ ignoreHTTPSErrors: true })
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
  if (this.context) await this.context.close()
})

AfterAll(async function () {
  if (browser) await browser.close()
  browser = null
})
