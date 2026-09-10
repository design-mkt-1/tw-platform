import { Icon } from '@/components/primitives/Icon'
import { CHEVRON_RIGHT, LEAGUE_BADGE, SPORT_ICONS } from '@/lib/assets'

/**
 * The "Рекомендовані ліги" widget — node 1:6081, 390x90: a 30-tall header and a 60-tall strip.
 *
 * **All eight tiles are the same badge, and that is measured, not assumed.** `download_assets`
 * on the whole carousel 1:6089 returned exactly two vectors for the subtree — one 16858-byte
 * Europa League mark and one chevron — with `svgAssetsTruncated: false`, and that badge is
 * byte-identical (sha256 e88d7caa…607b) to the one pulled from tile 1's own URL. Eight different
 * badges would have produced eight entries. The earlier "node ids are 30 apart, so the artwork
 * must differ" inference was wrong. **Varied league logos are not obtainable from this Figma
 * file**; they have to be sourced by hand or the strip has to come from a different design.
 *
 * The strip overflows on purpose: content ends at x 434 against a 390 viewport, so 44px sits off
 * the right edge with no wrap container.
 *
 * Header width is 360, not the usual 358 — measured at (16,0) with the chip's right edge landing
 * on 376. That is where the 14px right inset comes from.
 */

/** 1:6090 and its seven siblings: 44x44 tile, radius 10, a 26x26 logo inset 9px all round. */
const TILE_COUNT = 8

export function LeagueStrip() {
  return (
    <section className="flex h-[90px] w-full flex-col">
      {/* 1:6082 — 360x30, space-between. */}
      <div className="flex h-[30px] items-center justify-between pl-gutter pr-[14px]">
        {/*
         * 1:6084. The source string is mixed-case and `text-transform: capitalize` renders it
         * `Рекомендовані Ліги`. Storing the rendered form would break every other locale —
         * docs/tokens.md §4.4. 1:6083 is named "title-pill" and has no background; it is a bare
         * text wrapper, so nothing is painted behind this.
         */}
        <h2 className="whitespace-nowrap text-sm font-semibold capitalize text-widget-title">
          Рекомендовані ліги
        </h2>

        {/*
         * 1:6085 "Всі ліги" — 90x30, the same four skin classes as the casino see-all pill.
         *
         * It has no href and no handler anywhere in the design. `aria-disabled` says so rather
         * than drawing a live-looking control that swallows a tap, and it stays focusable so the
         * state is discoverable. Deliberately not the Button primitive: Button carries the
         * invented `active:scale` pressed state, and a pressed animation on a control that does
         * nothing is exactly the affordance-without-behaviour this avoids.
         *
         * Inter 12, not Roboto. Its twin on the events section, "Всі події" (1:6379), is Roboto
         * 12 and identical in every other property — a real inconsistency in the design, proven
         * by the 15px vs 14px text box (Inter's default line height at 12px is 14.52, Roboto's
         * is 14.06, and every Inter node in the frame measures 15 while every Roboto node
         * measures 14). Each chip matches its own section title's family. Which one is intended
         * is a designer's call and is in this run's questions.
         */}
        <button
          type="button"
          aria-disabled="true"
          className="inline-flex h-[30px] w-[90px] shrink-0 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-chip border border-chip bg-chip-link px-1 font-sans text-xs text-link"
        >
          Всі ліги
          <Icon src={CHEVRON_RIGHT} alt="" width={14} height={14} className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 1:6089 — 60 tall, tiles at y=8 with a 4px gap, then "More leagues" as a full-height
          column rather than a tile. aria-hidden on the list: eight identical unnamed badges read
          as "list, 8 items" of nothing. */}
      <div className="scrollbar-none flex h-[60px] items-center overflow-x-auto pl-gutter">
        <ul aria-hidden="true" className="flex shrink-0 gap-1">
          {Array.from({ length: TILE_COUNT }, (_, index) => (
            <li
              key={index}
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-chip bg-tint"
            >
              {/*
               * Not a button and not a link: the design draws no selected, pressed or hovered
               * tile, and every tile carries the same badge with no league name attached to it,
               * so there is nothing to name a control after or to send it to. Eight identically
               * named dead buttons would be worse for a keyboard than eight quiet images.
               */}
              <Icon
                src={LEAGUE_BADGE}
                alt=""
                width={26}
                height={26}
                className="h-[26px] w-[26px]"
              />
            </li>
          ))}
        </ul>

        {/*
         * 1:6330 — 34x60, white, no radius, no border, no shadow. Collapsed is its only state:
         * the design contains no expanded strip. Dead control, same treatment as the chip above.
         * The accessible name is INVENTED — the design labels this with a chevron alone.
         */}
        <button
          type="button"
          aria-disabled="true"
          aria-label="Більше ліг"
          className="flex h-[60px] w-[34px] shrink-0 cursor-default items-center justify-center bg-surface"
        >
          <Icon
            src={SPORT_ICONS.moreLeagues}
            alt=""
            width={14}
            height={9}
            className="h-[9px] w-[14px]"
          />
        </button>
      </div>
    </section>
  )
}
