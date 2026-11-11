// Runs the @accessibility scenarios in two passes.
// Normal scenarios run in parallel, one worker-based user each. The fix journey
// scenarios (@fix-user) share a single user, so they run on one worker.
import { spawnSync } from 'node:child_process'

const NODE_ARGS = ['node_modules/@cucumber/cucumber/bin/cucumber.js']

function run(tags, extraArgs = []) {
  const result = spawnSync(
    'node',
    [...NODE_ARGS, '--tags', tags, ...extraArgs, ...process.argv.slice(2)],
    { stdio: 'inherit' }
  )
  return result.status ?? 1
}

const pagesStatus = run('@accessibility and not @fix-user')
const fixStatus = run('@accessibility and @fix-user', ['--parallel', '1'])

process.exit(pagesStatus || fixStatus)
