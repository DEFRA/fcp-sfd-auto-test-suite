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
    this.context = null
    this.page = null
    this.page1 = null
    this.page2 = null
    this.phonenumber = null // optional for your scenario
  }
}

setDefaultTimeout(60 * 1000) // 60 seconds per step

setWorldConstructor(CustomWorld)

async function launchBrowser() {
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

  return chromium.launch(launchOptions)
}

// Reuse one browser per worker to avoid launching Chromium for every scenario.
BeforeAll(async function () {
  browser = await launchBrowser()
})

// Keep cookies and session state isolated between scenarios.
Before(async function () {
  if (!browser?.isConnected()) {
    browser = await launchBrowser()
  }

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
  if (browser?.isConnected()) await browser.close()
  browser = null
})
