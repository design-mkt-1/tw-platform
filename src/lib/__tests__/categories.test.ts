import { describe, expect, it } from 'vitest'
import { CATEGORIES, GAMES, dealRows, gamesInCategory } from '@/lib/data'
import { SECTIONS } from '@/lib/sections'
import type { CategoryId, SectionSpec } from '@/lib/types'

/**
 * The defect this file exists for.
 *
 * Until 2026-09-10 the four category chips were paint. `activeCategory` was read in exactly three
 * places, all inside CategoryBar.tsx — the selected fill, the roving tabindex and `isActive` — and
 * nothing else in `src` read it at all. Clicking `Слоти` moved a highlight and left all 51
 * articles on the page byte-identical, while `aria-selected` told a screen reader that something
 * had been selected. A chip that announces a switch and performs none is worse than a chip that
 * announces nothing.
 *
 * These assertions are the behaviour, not the implementation. They would still catch the bug if
 * the wiring moved: they compare what each chip actually puts on the page.
 */

/** What a row draws for a given chip, in the order the page draws it — [] for a hidden row. */
function rowFor(spec: SectionSpec, category: CategoryId) {
  return (dealRows(category).get(spec.id) ?? []).map((game) => game.slug)
}

const GRIDS = SECTIONS.filter((spec) => spec.kind === 'game-grid')

describe('gamesInCategory', () => {
  /*
   * The one state the design does specify is the page as drawn, with `Популярне` selected. Anything
   * that changes it is a regression against the client's own file, so this is the assertion that
   * matters most in the file.
   *
   * Note this is NOT the same as "filter to the popular category": only 15 of the 53 games carry
   * `popular`, and `Нові Ігри` — eight Nolimit City games, none of them popular — is full in the
   * design. The first chip is the whole catalogue.
   */
  it('leaves the catalogue untouched on the default chip', () => {
    expect(gamesInCategory('popular')).toEqual(GAMES)
  })

  it('keeps only games carrying the chosen category', () => {
    for (const id of ['slots', 'live-casino', 'crash'] as const) {
      const pool = gamesInCategory(id)
      expect(pool.length).toBeGreaterThan(0)
      expect(pool.every((game) => game.categories.includes(id))).toBe(true)
    }
  })
})

describe('the category chips', () => {
  it('keeps the drawn page at eight full rows', () => {
    // Six games per row, eight rows, on the default chip — the 48 game cards that with the three
    // tournament cards make the 51 articles the page has always rendered.
    expect(GRIDS).toHaveLength(8)
    for (const spec of GRIDS) expect(rowFor(spec, 'popular')).toHaveLength(6)
  })

  it('never draws one game in two rows, and never a row of fewer than three', () => {
    // Until 2026-09-10, 12 of the 48 tiles were repeats and `Краш Ігри` / `Drop & Wins` shared
    // five of six. Under a chip `Рекомендовані` drew one tile and `Популярне` two. Owner's
    // decision: rows share nothing, and a row under three tiles is hidden.
    for (const category of CATEGORIES) {
      const rows = GRIDS.map((spec) => rowFor(spec, category.id)).filter((row) => row.length > 0)
      const slugs = rows.flat()
      expect(new Set(slugs).size).toBe(slugs.length)
      for (const row of rows) expect(row.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('draws a different page for every chip', () => {
    // The proof the chips are no longer paint. Counts alone cannot show it any more — лайв Казіно
    // and Краш Ігри both draw nine cards — so the pages are compared by what is on them.
    const pages = CATEGORIES.map((category) =>
      GRIDS.flatMap((spec) => rowFor(spec, category.id)).join(' '),
    )
    expect(pages.map((page) => page.split(' ').length)).toEqual([48, 36, 9, 9])
    expect(new Set(pages).size).toBe(CATEGORIES.length)
  })

  it('narrows a row rather than replacing its own filter', () => {
    // `Megaways` asks for Pragmatic slots. Under `Слоти` it keeps asking for Pragmatic slots — the
    // chip must not widen it to every slot in the catalogue, and must not collapse it to every
    // Pragmatic game either.
    const megaways = GRIDS.find((spec) => spec.id === 'megaways')!
    for (const slug of rowFor(megaways, 'slots')) {
      const game = GAMES.find((g) => g.slug === slug)!
      expect(game.provider).toBe('pragmatic')
      expect(game.categories).toContain('slots')
    }

    // And where the two genuinely do not overlap the row comes back empty, which is what lets the
    // page hide the heading instead of drawing a dashed rule over nothing. No Pragmatic slot is
    // also a live-casino game, so this is the real answer and not a placeholder.
    expect(rowFor(megaways, 'live-casino')).toEqual([])
  })

  it('never returns a game the chip excludes', () => {
    for (const category of CATEGORIES) {
      if (category.id === 'popular') continue
      for (const spec of GRIDS) {
        for (const slug of rowFor(spec, category.id)) {
          expect(GAMES.find((g) => g.slug === slug)!.categories).toContain(category.id)
        }
      }
    }
  })
})

describe('picking a provider in the search panel', () => {
  /*
   * SearchOverlay.tsx:184 calls `setCategory(dominantCategory(provider.id))` when a provider row is
   * tapped, then closes the panel. That was a no-op while chips were paint, which is exactly why it
   * read as dead code. It is not: this asserts each of the five providers lands on a chip that
   * leaves something on the page, so closing the panel never reveals a blank one.
   */
  it('lands on a chip that still has games behind it', () => {
    for (const id of ['pragmatic', 'nolimit-city', 'bgaming', '3-oaks', 'spribe'] as const) {
      const dominant = GAMES.filter((game) => game.provider === id)
        .flatMap((game) => game.categories)
        .filter((category) => category !== 'popular')
      expect(dominant.length).toBeGreaterThan(0)
      for (const category of new Set(dominant)) {
        expect(GRIDS.flatMap((spec) => rowFor(spec, category)).length).toBeGreaterThan(0)
      }
    }
  })
})
