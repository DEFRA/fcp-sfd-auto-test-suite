import { stripVTControlCharacters as stripAnsi } from 'node:util'
import { classify, shortError } from './triage.js'

// One JSON object per line on stdout. CDP ships these to OpenSearch, where the fields below can be filtered.
function log(level, message, fields = {}) {
  process.stdout.write(
    JSON.stringify({
      '@timestamp': new Date().toISOString(),
      log: { level },
      message,
      service: {
        name: 'fcp-sfd-auto-test-suite',
        version: process.env.SERVICE_VERSION,
        environment: process.env.ENVIRONMENT || 'test'
      },
      ...fields
    }) + '\n'
  )
}

function readDiagnostics(result) {
  const attachment = result.attachments.find((a) => a.name === 'diagnostics')
  try {
    return JSON.parse(attachment?.body?.toString() ?? '{}')
  } catch {
    return {}
  }
}

// Logs who probably owns each failure, and a summary by platform at the end of the run.
export default class TriageReporter {
  constructor() {
    this.finals = []
    this.skippedByToggle = []
  }

  onTestEnd(test, result) {
    const platform = test.parent.project()?.name ?? 'unknown platform'
    const message = result.error?.message ?? ''

    const toggle = [...(result.annotations ?? []), ...test.annotations].find(
      (a) => a.type === 'toggle-off'
    )
    if (result.status === 'skipped' && toggle) {
      this.skippedByToggle.push({ platform, field: toggle.description })
      log(
        'warn',
        `toggle-skipped: ${test.title} (${platform}). The "${toggle.description}" update is switched off, which is why the frontend shows its "You cannot update your ${toggle.description} right now" banner. Switch it back on in cdp-app-config unless a DAL incident is open.`,
        {
          event: {
            category: 'test',
            action: 'toggle-skipped',
            outcome: 'unknown'
          },
          labels: {
            test: test.title,
            platform,
            toggle_field: toggle.description,
            action_needed:
              'Re-enable the feature toggle unless a DAL incident is open'
          }
        }
      )
      return
    }

    if (result.status !== 'passed' && result.status !== 'skipped') {
      const { category, owner } = classify(message, test.title)
      const diagnostics = readDiagnostics(result)
      log('error', `${category}: ${test.title} (${platform})`, {
        event: { category: 'test', action: 'test-failed', outcome: 'failure' },
        error: {
          type: stripAnsi(message).match(/^(\w*Error)\b/)?.[1] ?? 'Error',
          message: shortError(message),
          stack_trace: stripAnsi(result.error?.stack ?? message)
        },
        labels: {
          triage: category,
          likely_owner: owner,
          test: test.title,
          file: test.location.file.split(/[\\/]/).pop(),
          platform,
          attempt: result.retry + 1,
          max_attempts: test.retries + 1,
          duration_ms: result.duration,
          status: result.status,
          url: diagnostics.url,
          page_title: diagnostics.title,
          browserstack_session: diagnostics.session
        }
      })
    }

    if (result.retry === test.retries || result.status === 'passed') {
      this.finals.push({
        platform,
        outcome: test.outcome(),
        category:
          result.status === 'passed'
            ? 'passed'
            : classify(message, test.title).category
      })
    }
  }

  onEnd(result) {
    const byPlatform = {}
    for (const { platform, outcome, category } of this.finals) {
      const row = (byPlatform[platform] ??= {})
      const key = outcome === 'flaky' ? 'flaky' : category
      row[key] = (row[key] ?? 0) + 1
    }

    const lines = Object.entries(byPlatform).map(
      ([platform, row]) =>
        `${platform}: ${Object.entries(row)
          .map(([k, n]) => `${k} ${n}`)
          .join(', ')}`
    )
    const fields = [...new Set(this.skippedByToggle.map((s) => s.field))]
    const toggleLine = fields.length
      ? `\nSkipped because a feature toggle is off: ${this.skippedByToggle.length} test runs (${fields.join(', ')}). Switch these back on unless a DAL incident is open.`
      : ''
    log(
      result.status === 'passed' && !fields.length ? 'info' : 'warn',
      `Run ${result.status}\n${lines.join('\n')}${toggleLine}`,
      {
        event: { category: 'test', action: 'run-summary' },
        labels: {
          run_status: result.status,
          summary: byPlatform,
          toggle_skipped_count: this.skippedByToggle.length,
          toggle_skipped_fields: fields
        }
      }
    )
  }
}
