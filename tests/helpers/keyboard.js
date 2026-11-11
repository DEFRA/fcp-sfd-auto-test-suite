import { reportName, waitForPageReady } from './accessibility.js'

const MAX_TAB_STOPS = 200
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

async function describeFocus(page) {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body || el === document.documentElement) {
      return null
    }
    el.dataset.a11yFocused = 'true'
    if (!el.dataset.a11yId) {
      window.__a11yCount = (window.__a11yCount || 0) + 1
      el.dataset.a11yId = String(window.__a11yCount)
    }

    const style = window.getComputedStyle(el)
    const outlineVisible =
      style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
    const shadowVisible = style.boxShadow !== 'none'
    // GOV.UK radios and checkboxes hide the input (opacity 0) and draw the
    // focus ring on the label, so the input itself has no indicator to read.
    const customControl = style.opacity === '0'

    return {
      id: el.dataset.a11yId,
      description: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} "${(el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 40)}"`,
      hasFocusIndicator: outlineVisible || shadowVisible || customControl,
      isSkipLink: el.classList.contains('govuk-skip-link'),
      inCookieBanner: !!el.closest('.govuk-cookie-banner')
    }
  })
}

async function findUnreachable(page) {
  return page.evaluate(() => {
    const selector =
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'
    return [...document.querySelectorAll(selector)]
      .filter((el) => {
        const style = window.getComputedStyle(el)
        return (
          !el.disabled &&
          style.visibility !== 'hidden' &&
          el.getClientRects().length > 0 &&
          el.dataset.a11yFocused !== 'true'
        )
      })
      .map(
        (el) =>
          `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} "${(el.innerText || el.value || '').trim().slice(0, 40)}"`
      )
  })
}

async function checkSkipLink(page) {
  await resetFocus(page)
  // The GOV.UK cookie banner sits before the skip link, so Tab past it
  let first = null
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    first = await describeFocus(page)
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

  const seen = new Set()
  let previousId = null
  let repeats = 0
  let firstStopChecked = false

  for (let i = 0; i < MAX_TAB_STOPS; i++) {
    await page.keyboard.press('Tab')
    const focus = await describeFocus(page)

    // Focus left the document, so the whole tab order has been walked
    if (!focus) break

    if (focus.id === previousId) {
      repeats++
      if (repeats >= TRAP_REPEATS) {
        problems.push(`Keyboard trap: focus stuck on ${focus.description}`)
        break
      }
      continue
    }
    repeats = 1
    previousId = focus.id

    if (seen.has(focus.id)) break
    seen.add(focus.id)
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

  for (const description of await findUnreachable(page)) {
    problems.push(`Not reachable with the keyboard: ${description}`)
  }

  const skipLinkProblem = await checkSkipLink(page)
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
