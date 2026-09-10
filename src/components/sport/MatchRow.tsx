'use client'

import { OddsCell } from './OddsCell'
import { useBetSlip, type BetOutcome } from './BetSlipFab'
import type { Match } from '@/lib/types'

/**
 * One match row — node 1:6391, 358x80, `#F5F8FD`, `padding: 8px 8px 12px`, `gap: 8`,
 * `align-items: flex-end`.
 *
 * Nothing in here is a fixed height, and that is deliberate: every measured box falls out of the
 * type and the gaps. Left column 55 = metadata 17 + 6 + teams 32; right column 60 = labels 12 + 6
 * + cells 42; the row 80 = 8 + 60 + 12. `items-end` is what puts the shorter left column at y=13
 * where the design has it. The only pinned numbers are the ones the design pins: the 174px odds
 * column and the 42px cell.
 *
 * **The three column labels are centred on their cells, not distributed.** The design uses
 * `space-around` across 174px (centres 28.67 / 87 / 145.33) while the cells below are 55.333 wide
 * with 4px gaps (centres 27.67 / 87 / 146.33), so the outer two labels sit 1px inboard of the
 * column each one names. In a betting interface a label that does not line up with its own price
 * is a defect whatever the file does, so both rows use the same `flex-1 / gap-4px` division here
 * and all three centres agree exactly. The 1px difference from Figma is recorded as a deviation —
 * it is 07-sport.md UNKNOWN #10 answered rather than reproduced.
 */
const OUTCOMES: { key: BetOutcome; label: string }[] = [
  { key: 'home', label: '1' },
  // 1:6403 is Cyrillic capital EN, U+041D, for "нічия". Not Latin X and not Latin H.
  { key: 'draw', label: 'Н' },
  { key: 'away', label: '2' },
]

export function MatchRow({ match }: { match: Match }) {
  // A primitive, so this row re-renders only when its own selection changes.
  const selected = useBetSlip((state) => state.selections[match.id])
  const toggle = useBetSlip((state) => state.toggle)

  return (
    <li className="flex items-end gap-2 bg-row px-2 pb-3 pt-2">
      {/* 1:6392 — flex: 1 0 0, column, gap 6. min-w-0 lets long team names truncate instead of
          pushing the odds column off the card. */}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        {/* 1:6393 — metadata line, gap 6, centred. */}
        <div className="flex items-center gap-1.5">
          {/* 1:6394 — Roboto 10, #758098. The design's literal is `Сьогодні, 22:00`; the field is
              carried as the display string, not as an instant, because nothing formats it. */}
          <span className="whitespace-nowrap font-roboto text-6xs text-meta">{match.kickoff}</span>

          {/*
           * 1:6395 — `● EP` in Roboto **Bold Italic** 10, #F45B24. The dot is U+25CF inside the
           * text run, not an icon: the whole marker is one text node in the design and cannot be
           * styled in two pieces without splitting it, so `channel` carries the whole string and
           * this prints it unaltered.
           *
           * Presence is the switch, not `match.isLive`. The design puts the marker on all four of
           * its rows and draws no non-marked row at all (07-sport.md §14), so nothing in the file
           * ties it to a live flag; a row without the marker is simply a row with no channel.
           */}
          {match.channel ? (
            <span className="whitespace-nowrap font-roboto text-6xs font-bold italic text-hot">
              {match.channel}
            </span>
          ) : null}

          {/*
           * 1:6396 — `★` U+2605, Inter 14, #758098. Decorative, and that is measured rather than
           * chosen: only the grey state exists, on all four rows, with no selected variant
           * anywhere in the file and no node around it that behaves like a control. Drawing it as
           * a button would invent a favourites feature; drawing it as a glyph reproduces the
           * design. Flagged for the designer rather than guessed at.
           */}
          <span aria-hidden="true" className="font-sans text-base leading-none text-meta">
            ★
          </span>
        </div>

        {/*
         * 1:6397 — teams, column, gap 4, Roboto Medium 12, #07134F.
         *
         * The badge is a text glyph (🔵 U+1F535, 🔴 U+1F534, 🔷 U+1F537), not an asset, and the
         * design separates it from the name with **two** spaces preserved by `white-space:
         * pre-wrap`. Both are reproduced literally.
         */}
        <div className="flex w-full min-w-0 flex-col gap-1 whitespace-pre-wrap font-roboto text-xs font-medium text-title">
          <span className="truncate">{`${match.home.badge}  ${match.home.name}`}</span>
          <span className="truncate">{`${match.away.badge}  ${match.away.name}`}</span>
        </div>
      </div>

      {/* 1:6400 — fixed 174 wide, column, gap 6. The one width the design really does pin. */}
      <div className="flex w-[174px] shrink-0 flex-col gap-1.5">
        {/* 1:6401 — Roboto 10, #758098. aria-hidden because each cell already carries its label in
            its accessible name; announcing the row twice adds nothing. */}
        <div aria-hidden="true" className="flex gap-1 font-roboto text-6xs text-meta">
          {OUTCOMES.map((outcome) => (
            <span key={outcome.key} className="min-w-px flex-1 text-center">
              {outcome.label}
            </span>
          ))}
        </div>

        {/* 1:6405 — gap 4, full width. */}
        <div className="flex gap-1">
          {OUTCOMES.map((outcome) => (
            <OddsCell
              key={outcome.key}
              label={outcome.label}
              value={match.odds[outcome.key]}
              selected={selected === outcome.key}
              onToggle={() => toggle(match.id, outcome.key)}
            />
          ))}
        </div>
      </div>
    </li>
  )
}
