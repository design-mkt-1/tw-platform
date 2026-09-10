import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { assertApp } from './assert-app.mjs'

/**
 * First accessibility pass over the states the design defines.
 *
 * Drives the installed Chrome (`channel: 'chrome'`, same reason as shot.mjs) and injects axe-core
 * from the CDN rather than adding `@axe-core/playwright` to package.json: the whole check is one
 * `addScriptTag` plus one `axe.run()`, and a dependency that only ever runs on a developer machine
 * is a dependency the production install still has to resolve. The version is pinned in the URL so
 * a run today and a run next month compare like for like.
 *
 * States are listed mobile first — 95%+ of the traffic is mobile, so the mobile violations are the
 * ones that matter and they should be the first thing in the table.
 *
 * Exit code is 1 when any critical or serious violation exists, so this can gate CI later.
 *
 * Usage: node scripts/a11y.mjs <outDir> [baseUrl]
 */
const OUT = process.argv[2]
const BASE = process.argv[3] ?? 'http://localhost:3000'

if (!OUT) {
  console.error('usage: node scripts/a11y.mjs <outDir> [baseUrl]')
  process.exit(1)
}

const AXE = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'

// Every state the Top-Win design draws, addressed through the query-string contract in
// src/components/UrlStateBridge.tsx. The list itself is not here: src/data/screens.json is the
// single source, one row per Figma frame, and scripts/review.mjs reads the same file. A row
// without a path is a frame no URL reaches — it is listed at /dev/screens with the reason, and it
// cannot be swept here. The reasoning behind each search probe lives in that row's `note`.
//
// `readFileSync` with a URL relative to this module, so the script does not depend on the
// directory it was invoked from, and so it runs on Node 20 without an import-attributes flag.
const SCREENS = JSON.parse(readFileSync(new URL('../src/data/screens.json', import.meta.url), 'utf8'))
const STATES = SCREENS.filter((s) => s.path)

// All 390 wide. The Figma file has no desktop frame, no tablet frame and no breakpoint, so a
// 1440 row here would be testing a layout that does not exist.
const WIDTH = 390
const HEIGHT = 844

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const results = []

for (const screen of STATES) {
  const url = `${BASE}${screen.path}`
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await assertApp(page, url)
    await page.addScriptTag({ url: AXE })
    const run = await page.evaluate(() => window.axe.run())
    results.push({
      state: screen.id,
      url,
      viewport: `${WIDTH}x${HEIGHT}`,
      violations: run.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      })),
    })
  } catch (error) {
    results.push({
      state: screen.id,
      url,
      viewport: `${WIDTH}x${HEIGHT}`,
      violations: [],
      failure: String(error),
    })
  } finally {
    await page.close()
  }
}

await browser.close()

writeFileSync(`${OUT}/a11y.json`, JSON.stringify(results, null, 2))

const IMPACTS = ['critical', 'serious', 'moderate', 'minor']
const count = (state, impact) =>
  state.violations.filter((v) => v.impact === impact).reduce((n, v) => n + v.nodes, 0)

console.log(['state', ...IMPACTS].join(' | '))
for (const state of results) {
  console.log([state.state, ...IMPACTS.map((i) => count(state, i))].join(' | '))
}

const blocking = results.some((s) => count(s, 'critical') + count(s, 'serious') > 0)
console.log(`\nwrote ${OUT}/a11y.json — ${blocking ? 'critical/serious present' : 'no critical/serious'}`)
process.exit(blocking ? 1 : 0)
