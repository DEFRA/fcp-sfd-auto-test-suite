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
  setDefaultTimeout,
  World
} from '@cucumber/cucumber'
import { chromium } from 'playwright'
//  import { allure } from 'allure-cucumberjs';

let browser

class CustomWorld extends World {
  constructor(options) {
    super(options)
    this.context = null
    this.page = null
    this.page1 = null
    this.page2 = null
    this.phonenumber = null // optional for your scenario
  }
}

setDefaultTimeout(60 * 1000) // 60 seconds per step

setWorldConstructor(CustomWorld)

const isBrowserStack = process.env.BROWSERSTACK === 'true'
const useCdpProxy = process.env.CDP_PROXY === 'true'
const CDP_PROXY_URL = 'http://localhost:3128'

// On CDP, the BrowserStack SDK and Node HTTP calls reach BrowserStack through the platform proxy.
// The imports are lazy so normal runs don't load them.
async function routeNodeTrafficThroughCdpProxy() {
  const { ProxyAgent, setGlobalDispatcher } = await import('undici')
  const { bootstrap } = await import('global-agent')

  setGlobalDispatcher(new ProxyAgent({ uri: CDP_PROXY_URL }))
  bootstrap()
  globalThis.GLOBAL_AGENT.HTTP_PROXY = CDP_PROXY_URL
}

async function launchBrowser() {
  const launchOptions = {
    headless: true
  }

  // BrowserStack browsers are remote and reach the app through the BrowserStackLocal tunnel,
  // so the local CDP proxy settings only apply to the local Chromium.
  if (useCdpProxy && !isBrowserStack) {
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
  if (isBrowserStack && useCdpProxy) {
    await routeNodeTrafficThroughCdpProxy()
  }

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
