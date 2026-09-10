import { chromium } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'
import { assertApp } from './assert-app.mjs'

/**
 * Drives the interactive states the design defines and captures each one.
 *
 * These are the states no static screenshot can reach: the search states, the two header panels
 * and the three jackpot menus. Anything that renders wrong here would otherwise only be found by
 * a person clicking through the demo.
 *
 * Which states those are is not decided here. src/data/screens.json is the single source — one
 * row per Figma frame, with the reasoning behind each probe in its `note` — and scripts/a11y.mjs
 * reads the same file. Until 2026-09-10 the list lived in both scripts and the two copies could
 * disagree without anything failing.
 *
 * Read with `readFileSync` and a URL relative to this module, so the script does not depend on
 * the directory it was invoked from, and so it runs on Node 20 without an import-attributes flag.
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

const SCREENS = JSON.parse(readFileSync(new URL('../src/data/screens.json', import.meta.url), 'utf8'))

/*
 * The one width the design has. The Figma file contains no desktop frame, no tablet frame and no
 * breakpoint, so every shot is 390 wide. The predecessor's list was two thirds desktop; carrying
 * that over would have produced ten captures of a layout that was never designed.
 */
const WIDTH = 390
const HEIGHT = 844

const browser = await chromium.launch({ channel: 'chrome' })
const findings = []

/**
 * Responses this run is allowed to see fail, by exact URL.
 *
 * Exactly one entry, and it is a browser behaviour rather than an app one. Chrome asks the
 * ORIGIN ROOT for `/favicon.ico` on every navigation, unconditionally, before it has read the
 * document's own icon link. This app declares `src/app/icon.svg` and is served under the
 * `/tw-platform/` prefix, so nothing is ever published at the origin root and that one request is
 * a 404 by construction — on the deployed site as much as locally.
 *
 * Matched on the full URL and not on a pattern. `/favicon.ico` as a substring would also swallow
 * `/tw-platform/favicon.ico`, which is a request the app COULD make and which failing would be a
 * real defect; the whole point of the guard is that a 404 nobody expected is visible.
 */
function isAllowedFailure(url) {
  return url === new URL(url).origin + '/favicon.ico'
}

/**
 * Guard 1 — every response under 400, in every state.
 *
 * A 404 on an asset is one of the few defects that leaves no trace anywhere else in this review.
 * The sharpest case is measured: fifteen menu glyphs, four bottom-nav icons and the sport filter
 * icons are painted with `mask-image: url(...)` over a background colour. A mask whose URL 404s
 * does not fall back and does not warn — the element paints fully transparent. No console error,
 * no page error, a screenshot that captures a tidy row of nothing, and no axe rule that can see
 * it, because an empty span is not an accessibility violation. All 23 mask URLs answered 200
 * under the `/tw-platform/` prefix when this guard was written; the guard exists for the day one
 * of them does not.
 *
 * It also covers the class above that one: a `basePath` that only half applies, a renamed image,
 * a font that stopped being emitted.
 */
function watchResponses(page, sink) {
  page.on('response', (response) => {
    const status = response.status()
    if (status < 400) return
    if (isAllowedFailure(response.url())) return
    sink.push({ status, url: response.url() })
  })
}

/**
 * Guard 2 — overflow and truncation, on every element rather than on labelled sections.
 *
 * Until 2026-09-11 this looked only at `section[aria-label]` that were themselves scrollable,
 * which is the shape of the deliberate carousels and therefore the shape of everything that was
 * NOT a defect. The two things it could not see were both real: the hero promo badge needs
 * 167.74px of text in a 168px box, so its trailing `✦` wrapped onto the headline; and the
 * tournament card's join pill was clipped out of its own card. Neither element is a section and
 * neither carries an aria-label.
 *
 * Two kinds are reported. `overflow` is content wider than its box with `overflow-x: visible`,
 * which is content escaping. `truncated` is content wider than its box under `text-overflow:
 * ellipsis` or `white-space: nowrap`, which is text being cut.
 *
 * Elements are keyed by the nearest enclosing `aria-label` plus their tag, because that is the
 * part of the tree that survives a restyle — a key built from Tailwind classes would need
 * rewriting every time a padding changed, and an allowlist that needs rewriting stops being read.
 */
async function scanOverflow(page) {
  return page.evaluate(() => {
    // Nearest enclosing accessible name, falling back to the element's own text. The fallback
    // earns its place: the bottom navigation's raised button carries no aria-label anywhere up
    // its ancestry, so without it every unlabelled overflowing element in the build would share
    // the key `(unlabelled) > button` — and one allowlist entry would silence all of them.
    const keyOf = (el) => {
      const labelled = el.closest('[aria-label]')
      const label = labelled
        ? labelled.getAttribute('aria-label')
        : (el.textContent ?? '').trim().slice(0, 24) || '(unlabelled)'
      return `${label} > ${el.tagName.toLowerCase()}`
    }

    const offenders = []
    for (const el of document.querySelectorAll('*')) {
      const style = getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') continue
      // +1 absorbs sub-pixel layout. A box that is 0.3px short of its content is a rounding
      // artefact of a fractional font metric, not a defect anybody can see.
      if (el.scrollWidth <= el.clientWidth + 1) continue

      const kind =
        style.overflowX === 'visible'
          ? 'overflow'
          : style.textOverflow === 'ellipsis' || style.whiteSpace === 'nowrap'
            ? 'truncated'
            : null
      if (!kind) continue

      offenders.push({
        kind,
        key: keyOf(el),
        text: (el.textContent ?? '').trim().slice(0, 40),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      })
    }
    return offenders
  })
}

/**
 * Guard 3 — no control may be covered by anything.
 *
 * For every control in the viewport, the centre of its own box must resolve back to it. This is
 * the guard for a defect that was invisible in the code, in the screenshots and in axe: the
 * bottom navigation's decorative glow is a `123.891 x 131.535` span inside a button that is
 * `63.653 x 93`, so it hung out over the page and swallowed taps meant for whatever was behind
 * it. On `/sport` that made the last odds cell of the first match unreachable — the control was
 * present, correctly labelled, correctly sized, and could not be pressed.
 *
 * **Controls that have scrolled under the bottom navigation are reported, and that is on purpose.**
 * They are true reports — at that scroll position those odds cells genuinely cannot be pressed —
 * and the obvious rule for suppressing them does not survive contact with the defect. Measured on
 * the 2026-09-11 export at 390x844: with the glow live, `/sport` at scrollY 462 reported the odds
 * cell `1 1.71` covered at y 763, which is twelve pixels ABOVE the painted bar; the same scan with
 * `pointer-events: none` on the glow does not report it at all. Every remaining report sits at
 * y >= 787, inside the bar. A filter that excluded the fixed navigation would have excluded the
 * bug, because the bug lived inside the fixed navigation.
 *
 * When a modal sheet is open the scan is scoped to it. That is not a convenience: the menu and
 * the search render as `role="dialog" aria-modal="true"`, and `aria-modal` means everything
 * outside is out of the tree by declaration. Reporting the whole catalogue behind the panel as
 * "covered" would bury the one control the panel itself got wrong.
 */
async function scanCoverage(page) {
  return page.evaluate(() => {
    const describe = (el) => {
      if (!el) return '(nothing)'
      const label = el.getAttribute('aria-label')
      const classes =
        typeof el.className === 'string' && el.className.trim()
          ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
          : ''
      return `${el.tagName.toLowerCase()}${label ? `[aria-label="${label}"]` : ''}${classes}`
    }

    const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
    const scope = modal ?? document
    const offenders = []

    for (const el of scope.querySelectorAll('a[href], button, input, [tabindex="0"]')) {
      const rect = el.getBoundingClientRect()
      // The visible part of the box, not the whole box: a control half-scrolled off the top has
      // a centre above the viewport, and elementFromPoint answers null for a point outside it.
      const left = Math.max(rect.left, 0)
      const right = Math.min(rect.right, window.innerWidth)
      const top = Math.max(rect.top, 0)
      const bottom = Math.min(rect.bottom, window.innerHeight)
      if (right - left < 1 || bottom - top < 1) continue

      const x = (left + right) / 2
      const y = (top + bottom) / 2
      const hit = document.elementFromPoint(x, y)
      if (hit && (hit === el || el.contains(hit))) continue

      offenders.push({
        control: describe(el),
        coveredBy: describe(hit),
        at: `${Math.round(x)},${Math.round(y)}`,
      })
    }
    return offenders
  })
}

/**
 * Run a viewport-relative scan at the top, the middle and the bottom of the page.
 *
 * One position is not enough, and the measurement says so rather than the intuition. On `/sport`
 * the odds cell the nav glow stole, `1 1.71`, is only covered at scrollY 462 — at 0 it has not
 * scrolled down to the glow yet, and at the bottom of the page it has passed under the opaque
 * bar, where being covered proves nothing. The one scroll position that shows the defect cleanly
 * is the one in the middle.
 *
 * Offenders are deduplicated across the three positions, because a fixed element covers the same
 * control at every one of them and three copies of one defect read as three defects.
 */
async function atThreeScrollPositions(page, scan) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  const seen = new Map()
  for (const y of [0, Math.round(height / 2), height]) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(120)
    for (const offender of await scan(page)) {
      const key = JSON.stringify([offender.control, offender.coveredBy])
      if (!seen.has(key)) seen.set(key, { ...offender, scrollY: y })
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  return [...seen.values()]
}

/**
 * The overflow and truncation this build draws on purpose.
 *
 * Guard 2 reports every element wider than its box, and this build contains a lot of them by
 * design: seven horizontal carousels the design draws as scrollable, and one deliberate
 * truncation. Every entry below was triaged once against a measurement, and each carries the
 * reason it is not a defect. Entries are matched on the key Guard 2 emits — the nearest enclosing
 * `aria-label` plus the tag — so a restyle does not invalidate them and a genuinely new offender
 * inside the same section still reports, because its tag or its label differs.
 *
 * What is allowlisted is printed at the end of every run. An allowlist nobody sees reads as
 * "we checked everything" when it is the opposite.
 */
const ALLOWED_OVERFLOW = new Map([
  /*
   * The recent-wins ticker, three entries of one measured fact.
   *
   * Node 1:3398 draws the `у <game name>` run 90px wide with an ellipsis inside a 75px content
   * box (1:3395), and the design's own ellipsis is drawn in the file. So the 90px span overhangs
   * the 75px box by 15, and the 141px entry that holds it measures 152. All three numbers are the
   * design reproduced rather than a layout that got away — RecentWinsTicker.tsx:63-79 carries the
   * measurement. This is the only deliberate truncation in the build.
   */
  ['truncated Останні виграші > span', 'the design\'s own ellipsised title, 1:3398, 90px in a 75px box'],
  ['overflow Останні виграші > span', 'the 75px content box 1:3395 holding that 90px title'],
  ['overflow Останні виграші > li', 'the same 15px overhang, measured at the 141px entry'],

  /*
   * The bottom navigation's raised button, whose glow is baked into the artwork and is thrown
   * about 30px past the button on each side — 123.891 wide over a 63.653 button, which is the 94
   * against 64 reported here. BottomNavBar.tsx:20-22 records that nothing on this subtree may
   * carry `overflow: hidden`, because clipping it would cut the glow off square.
   *
   * Allowlisted for PAINT only. The tap-stealing half of the same span is a separate fact and is
   * not allowlisted anywhere: it is fixed with `pointer-events-none` and Guard 3 is what watches
   * it. If the glow ever swallows a control again, this entry does not hide it.
   */
  ['overflow Меню > button', 'the nav glow bleeds ~30px each side by design; clipping it would cut it square'],

  /*
   * The search field's close control. The painted box is the design's 28 and stays 28; the
   * `after:-inset-2` pseudo-element is a transparent 44x44 target over it, because the design's
   * own hit area is below the minimum and growing the paint would not fit a 48px field
   * (SearchField.tsx:92-95). The 34 against 26 is that target measured from the border box.
   */
  ['overflow Закрити пошук > button', 'the transparent 44x44 hit target over a 28px painted box'],
])

/** Every allowlist entry this run actually used, printed at the end so the exclusions are read. */
const allowlistHits = new Set()

function allowlisted(offenders) {
  return offenders.filter((offender) => {
    const reason = ALLOWED_OVERFLOW.get(`${offender.kind} ${offender.key}`)
    if (reason) allowlistHits.add(`${offender.kind} ${offender.key} — ${reason}`)
    return !reason
  })
}

/**
 * Guard 5 — the state renders the frame its row claims.
 *
 * `search-suggestions` was addressed with a query that matches nothing, so the URL rendered the
 * NO-RESULTS frame and the capture was filed under the suggestions name. Two of the design's four
 * search states had therefore never been screenshotted or swept, and the review looked complete.
 * Nothing failed, because nothing checked that a state renders what its name says.
 *
 * The expectation lives in the row, next to the `figmaName` it claims — `expectText` for a string
 * the frame must contain and `rejectText` for one that would mean a neighbouring frame drew
 * instead. Both are optional; a row with neither is unchecked, which is the honest state for a
 * frame whose copy is identical to its neighbour's.
 */
async function scanCopy(page, screen) {
  /*
   * `innerText`, and case-folded, and both for a measured reason.
   *
   * `textContent` is wrong here because it reads the text of `<script>` elements: Next embeds the
   * flight payload inline, so `Провідні провайдери` — a string that only the search panel renders
   * — is present in `document.body.textContent` on the plain casino home with no panel open. A
   * marker matched there would prove nothing.
   *
   * `innerText` is what the player sees, which introduces the opposite problem: this build stores
   * its section labels mixed-case and uppercases them in CSS (SearchOverlay.tsx:31), so the
   * suggestions label reads `Відповідні пропозиції` in the source and `ВІДПОВІДНІ ПРОПОЗИЦІЇ` on
   * screen. Folding both sides is what lets the registry quote the copy as the design writes it.
   */
  const body = (await page.evaluate(() => document.body.innerText)).toLowerCase()
  const has = (text) => body.includes(text.toLowerCase())
  return [
    ...(screen.expectText ?? [])
      .filter((text) => !has(text))
      .map(
        (text) =>
          `missing ${JSON.stringify(text)} — this state is not rendering ${JSON.stringify(screen.figmaName)}`,
      ),
    ...(screen.rejectText ?? [])
      .filter((text) => has(text))
      .map((text) => `found ${JSON.stringify(text)}, which belongs to a neighbouring frame`),
  ]
}

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

async function shot(name, screen, { width, height, url, steps, full = false }) {
  for (const [reducedMotion, suffix] of MOTION) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion,
    })
    const errors = []
    const badResponses = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    watchResponses(page, badResponses)

    const entry = {
      name,
      motion: reducedMotion,
      url,
      viewport: `${width}x${height}`,
      errors,
      badResponses,
    }
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
      entry.wrongFrame = await scanCopy(page, screen)
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
        entry.overflow = allowlisted(await scanOverflow(page))
        entry.coveredControls = await atThreeScrollPositions(page, scanCoverage)
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
 * Every frame the registry can address. A row with no path is a frame the build never reaches —
 * it is listed at /dev/screens with its reason and cannot be captured here.
 *
 * States are reached by URL rather than by clicking, through the contract in
 * src/components/UrlStateBridge.tsx. A state nobody can link to is a state nobody can review:
 * before those parameters existed, a capture called "the balance panel" was only ever a capture
 * of the default page.
 */
for (const screen of SCREENS.filter((s) => s.path)) {
  await shot(screen.id, screen, {
    width: WIDTH,
    height: HEIGHT,
    full: screen.fullPage,
    url: ROOT + screen.path,
  })
}

await browser.close()

console.log(JSON.stringify(findings, null, 2))

// Every deliberate overflow this run declined to report, so the allowlist is read rather than
// trusted. A guard whose exclusions are invisible is a guard that quietly stops guarding.
console.log(`\nallowlisted overflow (${allowlistHits.size} distinct):`)
for (const hit of [...allowlistHits].sort()) console.log(`  ${hit}`)

const problems = findings.flatMap((f) => [
  ...(f.ok ? [] : [`${f.name}/${f.motion}: ${f.failure}`]),
  ...(f.badResponses ?? []).map((r) => `${f.name}/${f.motion}: HTTP ${r.status} ${r.url}`),
  ...(f.wrongFrame ?? []).map((w) => `${f.name}/${f.motion}: ${w}`),
  ...(f.overflow ?? []).map((o) => `${f.name}/${f.motion}: ${o.kind} ${o.key} ${o.scrollWidth} in ${o.clientWidth} — ${JSON.stringify(o.text)}`),
  ...(f.coveredControls ?? []).map((c) => `${f.name}/${f.motion}: ${c.control} covered by ${c.coveredBy} at ${c.at} (scrollY ${c.scrollY})`),
])

console.log(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`)
for (const problem of problems) console.log(`  ${problem}`)
