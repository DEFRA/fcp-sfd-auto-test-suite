// Runs the @browserstack scenarios on BrowserStack through browserstack-node-sdk.
// The SDK reads the browser matrix and credentials from browserstack.yml and runs
// every scenario once per platform.
//
// BROWSERSTACK=true tells features/support/hooks.js it is a BrowserStack run.
// On CDP (CDP_PROXY=true) BrowserStack is only reachable through the platform proxy.
//
// Extra arguments are passed to cucumber-js, e.g. --tags '@smoke'.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SDK = fileURLToPath(
  new URL(
    '../node_modules/browserstack-node-sdk/src/bin/runner.js',
    import.meta.url
  )
)
const CDP_PROXY_URL = 'http://localhost:3128'

const env = { ...process.env, BROWSERSTACK: 'true' }

if (env.CDP_PROXY === 'true') {
  env.HTTP_PROXY = env.HTTP_PROXY || CDP_PROXY_URL
  env.HTTPS_PROXY = env.HTTPS_PROXY || CDP_PROXY_URL
}

const result = spawnSync(
  'node',
  [SDK, 'cucumber-js', '--profile', 'browserstack', ...process.argv.slice(2)],
  { stdio: 'inherit', cwd: ROOT, env }
)

process.exit(result.status ?? 1)
