import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { assertApp } from './assert-app.mjs'

/**
 * Drives the interactive states the design defines and captures each one.
 *
 * These are the states no static screenshot can reach: the three search states, the two header
 * panels and the three jackpot menus. Anything that renders wrong here would otherwise only be
 * found by a person clicking through the demo.
 */
const OUT = process.argv[2]
const BASE = process.argv[3] ?? 'http://localhost:3000'
// Trailing slash stripped once, so every URL below is built the same way. `${ROOT}/sport`
// silently produces `http://localhost:3000sport`, which resolves to nothing and is captured
// as a blank page rather than an error.
const ROOT = BASE.replace(/\/$/, '')

if (!OUT) {
  console.error('usage: node scripts/review.mjs <outDir> [baseUrl]')
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const findings = []

/*
 * Every state is captured twice, once with Reduce Motion on and once with it off. Commit 4e4be67
 * is the reason: the provider marquee only widened the document to 3307px under `reduce`, so a
 * single-mode run reported a page that was fine in the one mode nobody was looking at.
 */
const MOTION = [
  ['reduce', 'reduce'],
  ['no-preference', 'motion'],
]

/** Scroll the whole page past the viewport once and come back, so every lazy image has been seen. */
async function settleLazyImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 80))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(300)
}

async function shot(name, { width, height, url = BASE, steps, full = false }) {
  for (const [reducedMotion, suffix] of MOTION) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion,
    })
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })

    const entry = { name, motion: reducedMotion, url, viewport: `${width}x${height}`, errors }
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
      await assertApp(page, url)
      if (steps) await steps(page)
      await page.waitForTimeout(500)
      // `fullPage` resizes the viewport once and captures, so Next's default `loading="lazy"` never
      // fires and the footer's payment, partner and flag logos come out blank. Walking the page down
      // and back first is what puts them in view long enough to load.
      if (full) await settleLazyImages(page)
      await page.screenshot({ path: `${OUT}/${name}.${suffix}.png`, fullPage: full })
      // Horizontal overflow is a mobile bug, so only the 390 states are measured for it.
      if (width <= 390) {
        Object.assign(
          entry,
          await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            overflowingSections: [...document.querySelectorAll('section[aria-label]')]
              .filter((s) => s.scrollWidth > s.clientWidth)
              .map((s) => s.getAttribute('aria-label')),
          })),
        )
      }
      findings.push({ ...entry, ok: true })
    } catch (error) {
      findings.push({ ...entry, ok: false, failure: String(error) })
    } finally {
      await page.close()
    }
  }
}

/*
 * Every state the Top-Win design draws, at the one width the design has.
 *
 * The Figma file contains no desktop frame, no tablet frame and no breakpoint, so every shot is
 * 390 wide. The predecessor's list was two thirds desktop; carrying that over would have
 * produced ten captures of a layout that was never designed.
 *
 * States are reached by URL rather than by clicking, through the contract in
 * src/components/UrlStateBridge.tsx. A state nobody can link to is a state nobody can review:
 * before those parameters existed, a capture called "the balance panel" was only ever a capture
 * of the default page.
 */
await shot('casino-home', { width: 390, height: 844, full: true })
await shot('casino-home-prelogin', { width: 390, height: 844, full: true, url: `${ROOT}/?auth=prelogin` })

await shot('sport', { width: 390, height: 844, full: true, url: `${ROOT}/sport` })
await shot('sport-prelogin', { width: 390, height: 844, full: true, url: `${ROOT}/sport?auth=prelogin` })

await shot('menu-postlogin', { width: 390, height: 844, url: `${ROOT}/?panel=menu` })
await shot('menu-prelogin', { width: 390, height: 844, url: `${ROOT}/?auth=prelogin&panel=menu` })
await shot('menu-vip', { width: 390, height: 844, url: `${ROOT}/?auth=vip&panel=menu` })

/*
 * The four search frames are one component with a state derived from the query, so the query is
 * what selects them.
 *
 * 'bon' matches Sweet Bonanza and Sweet Bonanza CandyLand. The hit probe is Latin because the
 * catalogue is Latin, and deliberately so — the design's own tile reads GATES OF OLYMPUS 1000
 * and its suggestions read Pragmatic Play. An earlier version of this file probed with 'бон',
 * which matches nothing here, so it would have captured the empty state and filed it under
 * 'search-suggestions'. The screenshot would have looked like a design decision.
 *
 * 'ксзщ' matches nothing and is Cyrillic on purpose: it is the home row on a Ukrainian keyboard,
 * so it is a string a player could actually produce, and it also proves the search survives
 * Cyrillic input at all.
 */
await shot('search-resting', { width: 390, height: 844, url: `${ROOT}/?panel=search` })
await shot('search-suggestions', { width: 390, height: 844, url: `${ROOT}/?panel=search&q=bon` })
await shot('search-no-results', { width: 390, height: 844, url: `${ROOT}/?panel=search&q=${encodeURIComponent('ксзщ')}` })

await browser.close()

console.log(JSON.stringify(findings, null, 2))
