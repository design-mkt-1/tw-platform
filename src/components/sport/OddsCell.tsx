/**
 * One odds cell — nodes 1:6406 / 1:6408 / 1:6410 and their nine siblings.
 *
 * 42 tall, `#E8F1FC`, radius 10, value in Roboto Medium 12 `#F45B24`. The width is
 * `55.33333206176758px` in the file, which is `(174 − 2×4) / 3` written out to 17 digits — so the
 * cell does what the file does and lets the browser divide: `flex: 1 0 0; min-width: 1px`. Typing
 * the literal would be a rounded copy of an exact expression.
 *
 * **It is a button, and two of its states are invented.** The design draws one state, resting, for
 * all twelve cells (07-sport.md §14): no selected, no pressed, no suspended, no drifted. This is
 * the primary action of a sportsbook, so it cannot ship as a rectangle.
 *
 * - *Pressed* is Button's `active:scale-[0.97]`, so an odds cell presses like every other control
 *   in the build, and it is disabled under `prefers-reduced-motion`.
 * - *Selected* is a white fill plus a 2px inset `--accent-hot` ring, with the value staying orange.
 *   It borrows the vocabulary this very page already uses for selection — the Prematch tab and the
 *   selected sport-filter pill both go white against a tinted neighbour — and it adds no new
 *   contrast failure: `#F45B24` on white is 3.14:1, marginally better than the 2.89:1 the design
 *   ships on `--surface-tint`, and the ring clears the 3:1 that 1.4.11 asks of a UI boundary.
 *   Inverting to a solid orange fill was rejected for the opposite reason — white on `#F45B24` is
 *   3.30:1, so it would have invented a text-contrast failure rather than reproducing one.
 *
 * `aria-pressed` carries the state independently of the paint, which is what a user in forced
 * colours or greyscale is left with. The accessible name is `${label} ${value}` — "1 5.68" — built
 * from the two strings already on screen; no Ukrainian phrasing is invented for it, because none
 * exists in the design to copy.
 *
 * No `'use client'`: it holds no state and runs no effect. It reaches the browser through
 * MatchRow, which does both.
 */
interface OddsCellProps {
  /** The design's own label for this column: `1`, `Н` (Cyrillic EN, U+041D) or `2`. */
  label: string
  value: number
  selected: boolean
  onToggle: () => void
}

export function OddsCell({ label, value, selected, onToggle }: OddsCellProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${label} ${value.toFixed(2)}`}
      onClick={onToggle}
      className={[
        'flex h-[42px] min-w-px flex-1 items-center justify-center rounded-chip',
        'font-roboto text-xs font-medium text-hot',
        'transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100',
        selected ? 'bg-surface ring-2 ring-inset ring-hot' : 'bg-tint',
      ].join(' ')}
    >
      {/* The design writes `5.68`, `4.00`, `1.62` — two decimals always, dot-separated. Formatting
          through Intl would give `5,68` in uk-UA and change what the design draws. */}
      {value.toFixed(2)}
    </button>
  )
}
