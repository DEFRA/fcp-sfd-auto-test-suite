//   features/support/hooks.js
//   const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');
//   const { chromium } = require('playwright');
//   const { allure } = require('allure-cucumberjs');

import {
  Before,
  After,
  setWorldConstructor,
  setDefaultTimeout
} from '@cucumber/cucumber'
import { chromium } from 'playwright'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import 'dotenv/config'
//  import { allure } from 'allure-cucumberjs';

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

Before(async function () {
  // Launch browser before each scenario
  // console.log('i am inside hooks')
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

  this.browser = await chromium.launch(launchOptions)

  this.context = await this.browser.newContext({ ignoreHTTPSErrors: true })
  this.page = await this.context.newPage()
})

if (process.env.BROWSERSTACK === 'true' && process.env.CDP_PROXY === 'true') {
  const dispatcher = new ProxyAgent({ uri: 'http://localhost:3128' })
  setGlobalDispatcher(dispatcher)
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = 'http://localhost:3128'
}

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
  if (this.page1) await this.page1.close()
  if (this.page2) await this.page2.close()
  if (this.context) await this.context.close()
  if (this.browser) await this.browser.close()
})
