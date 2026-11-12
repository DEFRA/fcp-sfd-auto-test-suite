import { test, before, after, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { findKnownIssue, checkAccessibility } from '../helpers/accessibility.js'
import { validateKnownIssues } from '../helpers/accessibility-known-issues.js'
import { checkKeyboardOperability } from '../helpers/keyboard.js'

let browser
let page

const world = () => ({ page, attach: async () => {} })

const html = (body, head = '') =>
  `<!doctype html><html lang="en"><head><title>Test page</title>${head}</head>` +
  `<body><main>${body}</main></body></html>`

const FOCUS_STYLE =
  '<style>a:focus,button:focus{outline:3px solid #fd0}</style>'

before(async () => {
  browser = await chromium.launch({ headless: true })
})

after(async () => {
  await browser.close()
})

beforeEach(async () => {
  page = await (await browser.newContext()).newPage()
})

afterEach(async () => {
  await page.context().close()
})

async function keyboardProblems() {
  try {
    await checkKeyboardOperability(world())
  } catch (error) {
    return error.message
  }
  return ''
}

test('validateKnownIssues rejects an entry with no ticket', () => {
  assert.throws(
    () => validateKnownIssues([{ ruleId: 'region', justification: 'x' }]),
    /needs a Jira ticket key/
  )
})

test('validateKnownIssues rejects a pathPattern that is not a RegExp', () => {
  assert.throws(
    () =>
      validateKnownIssues([
        {
          ruleId: 'region',
          justification: 'x',
          ticket: 'FLS2-1',
          pathPattern: '/home'
        }
      ]),
    /not a RegExp/
  )
})

test('findKnownIssue returns undefined when nothing is registered', () => {
  assert.equal(findKnownIssue({ id: 'region' }, '/home'), undefined)
})

test('checkAccessibility passes a clean page', async () => {
  await page.setContent(html('<h1>Hello</h1><p>Some text</p>'))
  await checkAccessibility(world())
})

test('checkAccessibility fails an image with no alt text and names the rule', async () => {
  await page.setContent(
    html('<h1>Hello</h1><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">')
  )
  await assert.rejects(() => checkAccessibility(world()), /image-alt/)
})

test('checkKeyboardOperability accepts controls with a focus style', async () => {
  await page.setContent(html('<a href="/x">Link</a>', FOCUS_STYLE))
  assert.doesNotMatch(await keyboardProblems(), /No visible focus indicator/)
})

test('checkKeyboardOperability flags a control with no focus style', async () => {
  await page.setContent(
    html('<a href="/x">Plain link</a>', '<style>a:focus{outline:none}</style>')
  )
  assert.match(await keyboardProblems(), /No visible focus indicator/)
})

test('checkKeyboardOperability flags a control that cannot be reached', async () => {
  await page.setContent(
    html(
      '<a href="/x">Link</a><button tabindex="-1">Skipped</button>',
      FOCUS_STYLE
    )
  )
  assert.match(await keyboardProblems(), /Not reachable with the keyboard/)
})
