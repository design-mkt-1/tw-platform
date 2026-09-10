'use client'

import { create } from 'zustand'
import { INERT } from '@/components/primitives/Button'
import { SPORT_ICONS } from '@/lib/assets'
import { LEAGUES, SPORT_FILTERS } from '@/lib/data'
import type { SportId } from '@/lib/types'

/**
 * The Футбол / Баскетбол / Теніс pills — node 1:6333, 390x60.
 *
 * The row is 400 wide inside a 390 frame (16 + 121 + 8 + 141 + 8 + 106), so the tennis pill is
 * clipped in the design and this scrolls.
 *
 * **Selected vs unselected is four changes, not one**, and the fourth was found in pixels rather
 * than in the tool output: fill `#FFFFFF` vs `--surface-muted`, `--shadow-card` vs none, count
 * text `--text-count-active` vs `--text-muted`, and the 16px icon takes that same pair.
 *
 * **The label is `--text-primary` in every state.** Pixel-confirmed on the 1:1 render — darkest
 * ink is #102A67 in the white pill and #102A67 in the tinted ones. The brief for this component
 * said the label moves with the count; the measurement says it does not, and the measurement is
 * what shipped. The count badge fill likewise stays `--surface-track` in both states.
 *
 * The three icons ship pre-coloured — `icon-football.svg` was exported from the SELECTED pill so
 * it is #17458F, while basketball and tennis came from unselected pills and are #71809A. A
 * static `<img>` therefore cannot follow the selection: tapping Баскетбол would leave a grey
 * glyph inside a selected pill. They are drawn as CSS masks instead, so one flat colour comes
 * from the token and the SVG supplies only the shape. No asset was edited to do this.
 */

/**
 * The selected pill, shared with `LeagueList`, which filters the cards under "Майбутні Події" by
 * it. A store of its own for the reason `useBetSlip` has one: nothing here belongs in the URL.
 */
export const useSportFilter = create<{ sport: SportId; setSport: (sport: SportId) => void }>(
  (set) => ({ sport: SPORT_FILTERS[0].id, setSport: (sport) => set({ sport }) }),
)

/**
 * A pill whose sport has no league in `leagues.json` would empty the list, so it is inert
 * instead: Теніс today (0 of 5 leagues). Derived from the data rather than listed, so adding a
 * tennis league brings the pill to life with no edit here. Its count keeps the design's literal
 * (46) — the counts are drawn numbers, not a tally of this file.
 */
const LIVE_SPORTS = new Set(LEAGUES.map((league) => league.sport))

/** Only the shape comes from the file; `background-color` paints it. */
function maskStyle(src: string) {
  return {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  } as const
}

export function SportFilterRow() {
  const active = useSportFilter((state) => state.sport)
  const setActive = useSportFilter((state) => state.setSport)

  return (
    // 12px padding-block, 16px padding-inline, 8px gap — 1:6333.
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-gutter py-3">
      {SPORT_FILTERS.map((filter) => {
        const isActive = filter.id === active
        const inert = !LIVE_SPORTS.has(filter.id)

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            aria-disabled={inert || undefined}
            onClick={inert ? undefined : () => setActive(filter.id)}
            className={[
              // 36 tall, 4px padding-inline, 8px gap, radius 10, no border in either state —
              // a row scan across every pill edge steps straight from page to fill.
              'flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-chip px-1',
              'text-sm text-primary',
              isActive ? 'bg-surface shadow-card' : 'bg-muted',
              inert ? INERT : '',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              style={maskStyle(SPORT_ICONS[filter.icon])}
              className={[
                'h-4 w-4 shrink-0',
                isActive ? 'bg-count-active' : 'bg-muted-text',
              ].join(' ')}
            />
            {filter.label}
            {/* 1:6337 — 33x21, radius 999, 4px/7px padding. The fill is --surface-track in both
                states; only the text moves. */}
            <span
              className={[
                'shrink-0 rounded-full bg-track px-[7px] py-1 text-5xs',
                isActive ? 'text-count-active' : 'text-muted-text',
              ].join(' ')}
            >
              {filter.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
