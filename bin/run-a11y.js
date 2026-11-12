// Runs the @accessibility scenarios in two passes.
// Normal scenarios run in parallel, one worker-based user each. The fix journey
// scenarios (@fix-user) share a single user, so they run on one worker.
//
// Extra arguments are passed to both passes. Cucumber joins repeated --tags
// with "and", so a tag you add narrows each pass rather than replacing it.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const CUCUMBER = fileURLToPath(
  new URL('../node_modules/@cucumber/cucumber/bin/cucumber.js', import.meta.url)
)

function run(tags, trailingArgs = []) {
  const result = spawnSync(
    'node',
    [CUCUMBER, '--tags', tags, ...process.argv.slice(2), ...trailingArgs],
    { stdio: 'inherit', cwd: ROOT }
  )
  return result.status ?? 1
}

const pagesStatus = run('@accessibility and not @fix-user')
// Last, so a --parallel on the command line can't override it
const fixStatus = run('@accessibility and @fix-user', ['--parallel', '1'])

process.exit(pagesStatus || fixStatus)
