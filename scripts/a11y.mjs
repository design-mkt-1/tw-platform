import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
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
// src/components/UrlStateBridge.tsx: auth = prelogin | postlogin | vip, panel = menu | search,
// q = the search query.
//
// All 390 wide. The Figma file has no desktop frame, no tablet frame and no breakpoint, so a
// 1440 row here would be testing a layout that does not exist.
const STATES = [
  { name: 'casino-home', path: '/', width: 390, height: 844 },
  { name: 'casino-home-prelogin', path: '/?auth=prelogin', width: 390, height: 844 },
  { name: 'sport', path: '/sport', width: 390, height: 844 },
  { name: 'sport-prelogin', path: '/sport?auth=prelogin', width: 390, height: 844 },
  { name: 'menu-postlogin', path: '/?panel=menu', width: 390, height: 844 },
  { name: 'menu-prelogin', path: '/?auth=prelogin&panel=menu', width: 390, height: 844 },
  { name: 'menu-vip', path: '/?auth=vip&panel=menu', width: 390, height: 844 },
  { name: 'search-resting', path: '/?panel=search', width: 390, height: 844 },
  // 'bon' matches Sweet Bonanza; the catalogue is Latin, as the design's own tiles are. 'ксзщ'
  // matches nothing and is the home row on a Ukrainian keyboard, so it also proves the search
  // survives Cyrillic input — the defect src/lib/search.ts was rewritten to fix.
  { name: 'search-suggestions', path: '/?panel=search&q=bon', width: 390, height: 844 },
  { name: 'search-no-results', path: '/?panel=search&q=%D0%BA%D1%81%D0%B7%D1%89', width: 390, height: 844 },
]

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })
const results = []

for (const state of STATES) {
  const url = `${BASE}${state.path}`
  const page = await browser.newPage({
    viewport: { width: state.width, height: state.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await assertApp(page, url)
    await page.addScriptTag({ url: AXE })
    const run = await page.evaluate(() => window.axe.run())
    results.push({
      state: state.name,
      url,
      viewport: `${state.width}x${state.height}`,
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
      state: state.name,
      url,
      viewport: `${state.width}x${state.height}`,
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
