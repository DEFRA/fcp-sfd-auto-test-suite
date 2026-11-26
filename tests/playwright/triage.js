import { stripVTControlCharacters } from 'node:util'

// Puts a failure in a bucket so a red run says who probably owns it.
// Order matters: the first matching rule wins.
const RULES = [
  {
    category: 'known-issue',
    owner: 'frontend toggle (FLS2-486)',
    test: (_message, title) => /business name gets updated/i.test(title)
  },
  {
    category: 'network',
    owner: 'DNS / proxy / environment down, check the app is up on this env',
    test: (message) =>
      /net::ERR_|ERR_NAME_NOT_RESOLVED|ENOTFOUND|getaddrinfo/i.test(message)
  },
  {
    category: 'browserstack-session',
    owner: 'BrowserStack / network, usually a re-run fixes it',
    test: (message) =>
      /Socket idle|browserType\.connect|has been closed|ABRUPT_CLOSE|ECONNRESET|WebSocket error|failed to start|Target closed/i.test(
        message
      )
  },
  {
    category: 'device-limit',
    owner: 'real-device bridge, not our app or locators',
    test: (message) =>
      /browserstack_error|Only one browser context|Cannot read properties of undefined \(reading 'received'\)/i.test(
        message
      )
  },
  {
    category: 'assertion',
    owner: 'app behaved differently, or the test expected the wrong thing',
    test: (message) =>
      /expect\(.*\)\.\w+|Expected (pattern|string)/i.test(message)
  },
  {
    category: 'locator',
    owner: 'our locator, or something blocking the element',
    test: (message) =>
      /locator\.\w+: (Timeout|Error)|strict mode violation|waiting for (locator|getBy)/i.test(
        message
      )
  }
]

export function classify(message = '', title = '') {
  const rule = RULES.find((r) => r.test(message, title))
  return rule
    ? { category: rule.category, owner: rule.owner }
    : { category: 'unknown', owner: 'needs a human to look' }
}

// First line of the error without ANSI colours, short enough for a log line.
export function shortError(message = '') {
  const clean = stripVTControlCharacters(message)
  return clean.split('\n').find((l) => l.trim()) ?? ''
}
