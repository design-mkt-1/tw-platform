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
 * 390 is the one width the design draws: the Figma file has no desktop frame, no tablet frame and
 * no breakpoint. 440 is the widest current phone (iPhone Pro Max), and the page is fluid up to
 * --page-max (globals.css). Until 2026-09-10 the guards ran at 390 only, which is how a page
 * capped at a centred 390 column shipped to a 440 phone with 25px of empty page on each side.
 * Every guard runs at both widths; 440 shots carry a `-440` suffix.
 */
const WIDTHS = [390, 440]
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
      // `aria-labelledby` counts too: since 2026-09-10 the casino rows name their <section>
      // by pointing at the <h2> rather than repeating the title in aria-label.
      const labelled = el.closest('[aria-label], [aria-labelledby]')
      const label = labelled
        ? labelled.getAttribute('aria-label') ??
          document.getElementById(labelled.getAttribute('aria-labelledby'))?.textContent?.trim()
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

const CONTROL = 'a[href], button, input, [tabindex="0"]'

/**
 * Give every control a name that survives scrolling, so one control can be followed from the top
 * of the page to the bottom.
 *
 * Tagged once, before the scan loop, rather than matched on the description string: two odds
 * cells on `/sport` can carry the same accessible name — `1 1.77` appears on more than one
 * fixture — and merging them would let a pressable cell vouch for an unpressable one.
 */
async function tagControls(page) {
  await page.evaluate((selector) => {
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
    const scope = modal ?? document
    scope
      .querySelectorAll(selector)
      .forEach((el, index) => el.setAttribute('data-review-control', String(index)))
  }, CONTROL)
}

/**
 * Guard 3 — every control must be pressable somewhere.
 *
 * For every tagged control, the centre of its visible box must resolve back to it at at least one
 * scroll position. This is the guard for a defect that was invisible in the code, in the
 * screenshots and in axe: the bottom navigation's decorative glow is a `123.891 x 131.535` span
 * inside a button that is `63.653 x 93`, so it hung out over the page and swallowed taps meant for
 * whatever was behind it. On `/sport` that made the last odds cell of the last fixture
 * unreachable — the control was present, correctly labelled, correctly sized, and could not be
 * pressed at any scroll position.
 *
 * **"Somewhere" is the whole guard, and it is a correction of 2026-09-12.** Until then any control
 * covered at any one sampled position was reported, and the last clean run printed 24 problems on
 * that rule, every one of them an odds cell passing under the painted glass bar on its way down
 * the page. Those were false. Measured on the dev server at 390x844: the cell `1 1.77` on `/sport`
 * is covered by the nav plate at scrollY 0, where its centre lands at y 775 — the plate's own top
 * edge — and free at every position from 50 to 750. The player scrolls and presses it. A guard
 * that reports 24 things a player can do is a guard nobody reads.
 *
 * The defect survives that change and the false reports do not, which is the measurement the rule
 * is built on. With `pointer-events: none` lifted from the glow, the cell `1 2.12` is covered at
 * 3 of the 3 positions it is ever visible at, by the glow, and reports; with the glow as built the
 * same cell is free at scrollY 991 and does not. One caveat, because it is a real loss: on `/` the
 * revived glow steals footer links and part of the provider scroller, and every one of those is
 * free at some other scroll position, so this rule alone would not report the defect there. That
 * is why Guard 6 exists — it catches the same fault statically, on both pages, without scrolling.
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

    const sightings = []

    for (const el of document.querySelectorAll('[data-review-control]')) {
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

      sightings.push({
        id: el.getAttribute('data-review-control'),
        control: describe(el),
        pressable: Boolean(hit && (hit === el || el.contains(hit))),
        coveredBy: describe(hit),
        at: `${Math.round(x)},${Math.round(y)}`,
      })
    }
    return sightings
  })
}

/**
 * Guard 6 — nothing inside a control may take pointer events far outside it.
 *
 * Guard 3 catches the consequence, and only where the page cannot scroll the victim clear. This
 * catches the cause, in one static pass: a decoration that has grown past the control it belongs
 * to steals taps from whatever is behind it, on whichever page that decoration appears.
 *
 * The tolerance is measured rather than chosen. As built, on `/` and `/sport` at 390x844, the only
 * non-scrolling controls with a child that bleeds past them are the bottom tab's deliberate
 * 44px hit overlay at 1.5px (BottomNavBar.tsx:90) and its 4x4 active dot at 7px, which sits below
 * a 41px link by design (BottomNavBar.tsx:96). With `pointer-events: none` lifted from the nav
 * glow, that span bleeds 37.7px. Twelve separates them with room on both sides.
 *
 * Controls that scroll their own content are skipped, and they have to be: the sport bonus
 * carousel is a `ul` with `tabindex="0"`, and its slides stick 310px past it because that is what
 * a scroller is. Those children cannot steal a tap, because the scroller clips them.
 */
const HIT_BLEED_TOLERANCE = 12

async function scanHitBleed(page) {
  return page.evaluate(
    ({ selector, tolerance }) => {
      const describe = (el) => {
        const label = el.getAttribute('aria-label')
        const classes =
          typeof el.className === 'string' && el.className.trim()
            ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
            : ''
        return `${el.tagName.toLowerCase()}${label ? `[aria-label="${label}"]` : ''}${classes}`
      }

      const offenders = []
      for (const control of document.querySelectorAll(selector)) {
        const box = control.getBoundingClientRect()
        if (box.width < 1 || box.height < 1) continue
        const own = getComputedStyle(control)
        if (/auto|scroll/.test(own.overflowX + own.overflowY)) continue

        for (const child of control.querySelectorAll('*')) {
          const style = getComputedStyle(child)
          if (style.pointerEvents === 'none') continue
          if (style.display === 'none' || style.visibility === 'hidden') continue
          // Only the control's own descendants. A nested control owns its own subtree.
          if (child.closest(selector) !== control) continue

          const rect = child.getBoundingClientRect()
          if (rect.width < 1 || rect.height < 1) continue
          const bleed =
            Math.round(
              Math.max(
                box.left - rect.left,
                rect.right - box.right,
                box.top - rect.top,
                rect.bottom - box.bottom,
              ) * 100,
            ) / 100
          if (bleed <= tolerance) continue

          offenders.push({ control: describe(control), child: describe(child), bleed })
        }
      }
      return offenders
    },
    { selector: CONTROL, tolerance: HIT_BLEED_TOLERANCE },
  )
}

/**
 * Walk the page in half-viewport steps and keep only the controls that were pressable nowhere.
 *
 * Half a viewport rather than a round number, because it is what guarantees the sampling: a
 * control shorter than the viewport is on screen across more than `innerHeight` of scroll travel,
 * so a step of `innerHeight / 2` sees every control at least twice. Three fixed positions did not
 * guarantee that, and a control seen once and covered once reads as a control that is never
 * pressable.
 *
 * The last position is the true maximum, `scrollHeight - innerHeight`. Asking for `scrollHeight`
 * would have worked too and the handover of 2026-09-11 was wrong to file it as the bug: measured
 * on `/sport`, `window.scrollTo(0, 1835)` lands at 991, because the browser clamps. What it did
 * not do was report the position it actually reached — the finding said `scrollY 1835` for a page
 * that stops at 991 — so the number in the report is now read back from `window.scrollY`.
 */
async function whereverItCanBePressed(page, scan) {
  await tagControls(page)
  const { maxScroll, step } = await page.evaluate(() => ({
    maxScroll: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    step: Math.max(1, Math.round(window.innerHeight / 2)),
  }))

  const positions = []
  for (let y = 0; y < maxScroll; y += step) positions.push(y)
  positions.push(maxScroll)

  const seen = new Map()
  for (const y of positions) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(120)
    const scrollY = await page.evaluate(() => Math.round(window.scrollY))
    for (const sighting of await scan(page)) {
      const record = seen.get(sighting.id) ?? { covered: [], pressableAt: [] }
      if (sighting.pressable) record.pressableAt.push(scrollY)
      else record.covered.push({ ...sighting, scrollY })
      seen.set(sighting.id, record)
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0))

  return [...seen.values()]
    .filter((record) => record.pressableAt.length === 0 && record.covered.length > 0)
    .map((record) => ({
      control: record.covered[0].control,
      coveredBy: record.covered[0].coveredBy,
      at: record.covered[0].at,
      scrollY: record.covered[0].scrollY,
      coveredAt: record.covered.length,
    }))
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
      // Every width review.mjs shoots is a phone width, so every one is measured.
      {
        Object.assign(
          entry,
          await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            overflowingSections: [
              ...document.querySelectorAll('section[aria-label], section[aria-labelledby]'),
            ]
              .filter((s) => s.scrollWidth > s.clientWidth)
              .map(
                (s) =>
                  s.getAttribute('aria-label') ??
                  document.getElementById(s.getAttribute('aria-labelledby'))?.textContent?.trim(),
              ),
          })),
        )
        entry.overflow = allowlisted(await scanOverflow(page))
        entry.hitBleed = await scanHitBleed(page)
        entry.coveredControls = await whereverItCanBePressed(page, scanCoverage)
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
for (const width of WIDTHS) {
  for (const screen of SCREENS.filter((s) => s.path)) {
    await shot(width === 390 ? screen.id : `${screen.id}-${width}`, screen, {
      width,
      height: HEIGHT,
      full: screen.fullPage,
      url: ROOT + screen.path,
    })
  }
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
  ...(f.hitBleed ?? []).map((h) => `${f.name}/${f.motion}: ${h.child} takes pointer events ${h.bleed}px outside ${h.control}`),
  ...(f.coveredControls ?? []).map(
    (c) =>
      `${f.name}/${f.motion}: ${c.control} pressable at no scroll position — covered by ${c.coveredBy} at ${c.at} (scrollY ${c.scrollY}; covered at all ${c.coveredAt} positions it was visible at)`,
  ),
])

console.log(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`)
for (const problem of problems) console.log(`  ${problem}`)
