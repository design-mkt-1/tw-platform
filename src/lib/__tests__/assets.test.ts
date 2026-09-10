import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as assets from '../assets'

/**
 * Walks every asset path the app can produce, in both directions.
 *
 * Forward: everything assets.ts names must exist on disk. This is the failure that has already
 * shipped from this codebase once — a sub-path deploy where every image 404'd, which looked
 * perfect locally because locally there is no base path.
 *
 * Backward: everything on disk must be named. An orphan is either dead weight in a static
 * export that ships whatever it contains, or a file somebody forgot to wire up.
 *
 * What it cannot see: the inside of a file. It calls existsSync, nothing more. A dirty Figma
 * re-export carrying a whole page background passes this test — look at the bytes.
 */

const PUBLIC_DIR = join(process.cwd(), 'public')
const IMAGES_DIR = join(PUBLIC_DIR, 'images')

/** Deliberately unreferenced: Figma leftovers kept on disk so the decision is reversible. */
const ALLOWED_ORPHANS = new Set<string>(assets.UNUSED_SPORT_SLIDES)

function collectPaths(value: unknown, found: Set<string>): void {
  if (typeof value === 'string') {
    if (value.startsWith('/images/')) found.add(value)
    return
  }
  if (Array.isArray(value)) {
    for (const entry of value) collectPaths(entry, found)
    return
  }
  if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectPaths(entry, found)
  }
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(`/${relative(PUBLIC_DIR, full).split(sep).join('/')}`)
  }
  return out
}

const referenced = new Set<string>()
collectPaths(assets, referenced)

describe('assets', () => {
  it('names at least one path per area', () => {
    // A guard on the guard: if collectPaths ever stopped finding anything — a rename, a change
    // in how the module exports — both assertions below would pass vacuously.
    expect(referenced.size).toBeGreaterThan(40)
  })

  it.each([...referenced].sort())('%s exists on disk', (path) => {
    expect(existsSync(join(PUBLIC_DIR, path))).toBe(true)
  })

  it('has no unreferenced files under public/images', () => {
    const orphans = walk(IMAGES_DIR)
      .filter((path) => !referenced.has(path))
      .filter((path) => !ALLOWED_ORPHANS.has(path))
    expect(orphans).toEqual([])
  })

  it('prefixes nothing when NEXT_PUBLIC_BASE_PATH is unset', () => {
    // The deployed build sets it to /tw-platform. Locally it must stay empty, or every path
    // gains a prefix the dev server does not serve.
    expect(assets.LOGO).toBe('/images/nav/topwin-logo.svg')
  })

  it('rejects a relative path', () => {
    expect(() => assets.withBase('images/logo.svg')).toThrow()
  })
})
