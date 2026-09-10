import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SCREENS, figmaUrl } from '../screens'
import type { AuthMode, PanelId } from '../types'

/**
 * Guards the registry and the deduplication it paid for.
 *
 * Two different failures are covered. The rows themselves can rot — an id that points at a route
 * nobody built, a query parameter the URL bridge does not accept — and that is what 3 and 4 catch.
 * And the duplication can come back: before 2026-09-10 the ten states were written out twice, in
 * scripts/review.mjs and in scripts/a11y.mjs, and nothing failed when the two disagreed. Assertion
 * 6 is what stops a third copy appearing.
 */

const APP_DIR = join(process.cwd(), 'src', 'app')

/**
 * Restated from src/components/UrlStateBridge.tsx:27-28, which keeps AUTH_MODES and PANELS
 * module-private. The weakness is deliberate and worth naming: `satisfies` catches a value that
 * leaves the union in src/lib/types.ts, but it cannot catch the bridge drifting away from these
 * arrays — only exporting them from types.ts and having the bridge import them would do that, and
 * the bridge was out of scope for this change.
 */
const AUTH_MODES = ['prelogin', 'postlogin', 'vip'] as const satisfies readonly AuthMode[]
const PANELS = ['menu', 'search'] as const satisfies readonly PanelId[]

/** `/sport?auth=prelogin` → `src/app/sport/page.tsx`. */
function pageFileFor(path: string): string {
  const route = path.split('?')[0].replace(/^\/|\/$/g, '')
  return join(APP_DIR, route, 'page.tsx')
}

const withPath = SCREENS.filter((s) => s.path)
const withoutPath = SCREENS.filter((s) => !s.path)

describe('screens registry', () => {
  it('carries one row per 390-wide frame in the design', () => {
    // A guard on the guard: every it.each below would pass vacuously on an empty array.
    expect(SCREENS).toHaveLength(11)
  })

  it('has unique ids and unique node ids', () => {
    expect(new Set(SCREENS.map((s) => s.id)).size).toBe(SCREENS.length)
    expect(new Set(SCREENS.map((s) => s.nodeId)).size).toBe(SCREENS.length)
  })

  it.each(withPath.map((s) => [s.id, s.path!] as const))('%s resolves to a page that exists', (_id, path) => {
    expect(existsSync(pageFileFor(path))).toBe(true)
  })

  it.each(withPath.map((s) => [s.id, s.path!] as const))('%s uses only URL-bridge params', (_id, path) => {
    const params = new URLSearchParams(path.split('?')[1] ?? '')
    for (const [key, value] of params) {
      expect(['auth', 'panel', 'q']).toContain(key)
      if (key === 'auth') expect(AUTH_MODES as readonly string[]).toContain(value)
      if (key === 'panel') expect(PANELS as readonly string[]).toContain(value)
      // `q` is free text — any non-empty string selects one of the four search states.
      if (key === 'q') expect(value.length).toBeGreaterThan(0)
    }
  })

  it.each(withoutPath.map((s) => [s.id] as const))('%s says why no built state reaches it', (id) => {
    expect(SCREENS.find((s) => s.id === id)!.note).toBeTruthy()
  })

  it('figmaUrl addresses the node in the form a Figma URL takes', () => {
    expect(figmaUrl('1:7363')).toContain('node-id=1-7363')
    expect(figmaUrl('1:7363')).not.toContain('1:7363')
  })
})

describe('capture scripts', () => {
  // The assertion that stops the duplication coming back. A state re-typed into a script instead
  // of read from the registry would carry one of these three fragments.
  it.each(['review.mjs', 'a11y.mjs'])('%s hard-codes no state URL', (name) => {
    const source = readFileSync(join(process.cwd(), 'scripts', name), 'utf8')
    expect(source).not.toContain('?auth=')
    expect(source).not.toContain('?panel=')
    expect(source).not.toContain('q=')
  })
})
