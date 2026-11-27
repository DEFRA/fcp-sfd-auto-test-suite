// Runs the Playwright Test BrowserStack suite (tests/playwright) through browserstack-node-sdk.
// The SDK reads the browser matrix and credentials from browserstack.yml and runs
// every test once per platform.
//
// On CDP (CDP_PROXY=true) BrowserStack is only reachable through the platform proxy.
//
// Extra arguments are passed to playwright test, e.g. --grep "Business type".
// --mobile runs only the real devices in browserstack.mobile.yml instead of the desktop browsers.
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SDK = fileURLToPath(
  new URL(
    '../node_modules/browserstack-node-sdk/src/bin/runner.js',
    import.meta.url
  )
)
const GLOBAL_REQUIRE = pathToFileURL(
  fileURLToPath(new URL('./browserstack-global-require.mjs', import.meta.url))
).href
const CDP_PROXY_URL = 'http://localhost:3128'

const env = {
  ...process.env,
  // The SDK's generated Playwright config calls require(), which this ES module project lacks.
  NODE_OPTIONS:
    `${process.env.NODE_OPTIONS ?? ''} --import ${GLOBAL_REQUIRE}`.trim()
}

if (env.CDP_PROXY === 'true') {
  env.HTTP_PROXY = env.HTTP_PROXY || CDP_PROXY_URL
  env.HTTPS_PROXY = env.HTTPS_PROXY || CDP_PROXY_URL
}

const args = process.argv.slice(2)
const mobile = args.includes('--mobile')

if (mobile) {
  env.BROWSERSTACK_CONFIG_FILE = 'browserstack.mobile.yml'
}

const result = spawnSync(
  'node',
  [
    SDK,
    'playwright',
    'test',
    '--config=playwright.browserstack.config.js',
    ...args.filter((arg) => arg !== '--mobile')
  ],
  { stdio: 'inherit', cwd: ROOT, env }
)

process.exit(result.status ?? 1)
