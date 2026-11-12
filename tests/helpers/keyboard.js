import { reportName, waitForPageReady } from './accessibility.js'

const MAX_TAB_STOPS = 200
const MAX_COOKIE_BANNER_STOPS = 6
const TRAP_REPEATS = 3

// Puts sequential focus navigation back at the top of the page.
async function resetFocus(page) {
  await page.evaluate(() => {
    document.activeElement?.blur()
    document.body.setAttribute('tabindex', '-1')
    document.body.focus()
    document.body.removeAttribute('tabindex')
    window.scrollTo(0, 0)
  })
}

// Bookkeeping lives in a handle held by the test, so nothing is written into
// the page under test (no attributes, no globals).
function createFocusState(page) {
  return page.evaluateHandle(() => ({
    ids: new WeakMap(),
    visited: new WeakSet(),
    count: 0
  }))
}

async function describeFocus(page, state) {
  return page.evaluate((state) => {
    const el = document.activeElement
    if (!el || el === document.body || el === document.documentElement) {
      return null
    }
    state.visited.add(el)
    if (!state.ids.has(el)) state.ids.set(el, String(++state.count))

    const look = (node, pseudo) => {
      const s = window.getComputedStyle(node, pseudo)
      return [
        s.outlineStyle,
        s.outlineWidth,
        s.outlineColor,
        s.boxShadow,
        s.borderTopWidth,
        s.borderTopColor,
        s.backgroundColor,
        s.color,
        s.textDecorationLine
      ].join('|')
    }

    // GOV.UK radios and checkboxes hide the input (opacity 0) and draw the
    // focus ring on the label's ::before, so that is what has to change.
    const isHiddenChoice =
      el.tagName === 'INPUT' &&
      ['radio', 'checkbox'].includes(el.type) &&
      window.getComputedStyle(el).opacity === '0'
    const target = isHiddenChoice ? el.labels?.[0] : el
    const pseudo = isHiddenChoice ? '::before' : null

    // An indicator is whatever changes when the element loses focus
    let hasFocusIndicator = false
    if (target) {
      const focused = look(target, pseudo)
      el.blur()
      const unfocused = look(target, pseudo)
      el.focus({ preventScroll: true })
      hasFocusIndicator = focused !== unfocused
    }

    return {
      id: state.ids.get(el),
      description: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} "${(el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 40)}"`,
      hasFocusIndicator,
      isSkipLink: el.classList.contains('govuk-skip-link'),
      inCookieBanner: !!el.closest('.govuk-cookie-banner')
    }
  }, state)
}

async function findUnreachable(page, state) {
  return page.evaluate((state) => {
    const selector =
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'
    return [...document.querySelectorAll(selector)]
      .filter((el) => {
        const style = window.getComputedStyle(el)
        return (
          !el.disabled &&
          style.visibility !== 'hidden' &&
          el.getClientRects().length > 0 &&
          !state.visited.has(el)
        )
      })
      .map(
        (el) =>
          `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} "${(el.innerText || el.value || '').trim().slice(0, 40)}"`
      )
  }, state)
}

async function checkSkipLink(page, state) {
  await resetFocus(page)
  // The GOV.UK cookie banner sits before the skip link, so Tab past it
  let first = null
  for (let i = 0; i < MAX_COOKIE_BANNER_STOPS; i++) {
    await page.keyboard.press('Tab')
    first = await describeFocus(page, state)
    if (!first?.inCookieBanner) break
  }
  if (!first?.isSkipLink) return 'Skip link could not be reached with Tab'

  await page.keyboard.press('Enter')
  const target = await page.evaluate(() => ({
    hash: window.location.hash,
    focusedId: document.activeElement?.id,
    focusedInMain: !!document.activeElement?.closest('main')
  }))

  const reachedMain =
    target.focusedInMain ||
    (target.hash && target.focusedId === target.hash.slice(1))
  if (!reachedMain) {
    return `Skip link did not move focus to the main content (hash "${target.hash}", focused "${target.focusedId}")`
  }
  return null
}

/**
 * Tabs through the page from the top and checks that the skip link is the
 * first stop and works, focus is never trapped, every visible control is
 * reachable and every focused control shows a focus indicator.
 *
 * @param {import('@cucumber/cucumber').World} world Cucumber world, needs `page` and `attach`
 */
export async function checkKeyboardOperability(world) {
  const { page } = world
  await waitForPageReady(page)
  const problems = []
  const stops = []

  await resetFocus(page)

  const state = await createFocusState(page)
  const seen = new Set()
  let previousId = null
  let repeats = 0
  let firstStopChecked = false
  let firstId = null
  // Why the walk ended: left-document and wrapped are normal, the rest mean
  // the unreachable check below can't be trusted
  let endReason = 'limit'

  for (let i = 0; i < MAX_TAB_STOPS; i++) {
    await page.keyboard.press('Tab')
    const focus = await describeFocus(page, state)

    if (!focus) {
      endReason = 'left-document'
      break
    }

    if (focus.id === previousId) {
      repeats++
      if (repeats >= TRAP_REPEATS) {
        problems.push(`Keyboard trap: focus stuck on ${focus.description}`)
        endReason = 'trap'
        break
      }
      continue
    }
    repeats = 1
    previousId = focus.id

    if (seen.has(focus.id)) {
      if (focus.id === firstId) {
        endReason = 'wrapped'
      } else {
        problems.push(
          `Focus went back to ${focus.description} before the end of the page`
        )
        endReason = 'revisit'
      }
      break
    }
    seen.add(focus.id)
    if (firstId === null) firstId = focus.id
    stops.push(focus.description)

    if (!focus.inCookieBanner && !firstStopChecked) {
      firstStopChecked = true
      if (!focus.isSkipLink) {
        problems.push(
          `The first Tab stop is ${focus.description}, not the skip link`
        )
      }
    }
    if (!focus.hasFocusIndicator) {
      problems.push(`No visible focus indicator on ${focus.description}`)
    }
  }

  if (stops.length === 0) {
    problems.push('Tab did not move focus to any element')
  }

  if (endReason === 'limit') {
    problems.push(
      `Stopped after ${MAX_TAB_STOPS} Tab stops, so the result may be incomplete`
    )
  } else if (endReason === 'left-document' || endReason === 'wrapped') {
    for (const description of await findUnreachable(page, state)) {
      problems.push(`Not reachable with the keyboard: ${description}`)
    }
  }

  const skipLinkProblem = await checkSkipLink(page, state)
  if (skipLinkProblem) problems.push(skipLinkProblem)

  await world.attach(
    JSON.stringify({ url: page.url(), tabStops: stops, problems }, null, 2),
    {
      mediaType: 'application/json',
      fileName: reportName('Keyboard check', page.url())
    }
  )

  if (problems.length > 0) {
    throw new Error(
      `${problems.length} keyboard problem(s) on ${page.url()}\n` +
        problems.map((problem) => `- ${problem}`).join('\n')
    )
  }
}
