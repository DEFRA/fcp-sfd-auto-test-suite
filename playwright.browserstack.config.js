// Playwright Test config for BrowserStack runs.
// browserstack-node-sdk runs every test once per platform in browserstack.yml.
import { defineConfig } from '@playwright/test'

const ENVIRONMENT = process.env.ENVIRONMENT || 'test'

export default defineConfig({
  testDir: './tests/playwright',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  forbidOnly: true,
  retries: 1,
  // One worker per CDP standard user, so concurrent tests never share an account.
  workers: 4,
  reporter: [
    ['list'],
    ['./tests/playwright/triage-reporter.js'],
    ['allure-playwright']
  ],
  use: {
    baseURL: `https://fcp-sfd-frontend.${ENVIRONMENT}.cdp-int.defra.cloud`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  // Empty on purpose: the SDK builds one project per platform in browserstack.yml.
  projects: []
})
