'use client'

import { create } from 'zustand'
import { SPORT_ICONS } from '@/lib/assets'
import { INERT } from '@/components/primitives/Button'
import { Icon } from '@/components/primitives/Icon'

/* --- the bet slip's state -------------------------------------------------- */

export type BetOutcome = 'home' | 'draw' | 'away'

interface BetSlipState {
  /** matchId → the one outcome picked on that match. */
  selections: Record<string, BetOutcome>
  toggle: (matchId: string, outcome: BetOutcome) => void
}

/**
 * A store of its own rather than a field on `useAppStore`.
 *
 * `useAppStore` holds what the URL can address — auth, panel, query — and `UrlStateBridge`
 * round-trips all of it. A bet selection is not addressable and must not end up in the URL, and
 * this file is not allowed to edit the shared store anyway. Zustand is already a dependency, so
 * this is one `create` call and no provider for either OddsCell or the FAB to be wrapped in.
 *
 * **One outcome per match, not many.** Picking `Н` on a match that already has `1` replaces it;
 * picking the same cell again clears it. Nothing in the design says this — the design draws no
 * selected state at all (07-sport.md §14) — but 1 and Н on the same fixture is a bet that cannot
 * be placed, and a slip that accepts it is a bug wearing a feature's clothes. Recorded as an
 * invention.
 */
export const useBetSlip = create<BetSlipState>((set) => ({
  selections: {},
  toggle: (matchId, outcome) =>
    set((state) => {
      const selections = { ...state.selections }
      if (selections[matchId] === outcome) delete selections[matchId]
      else selections[matchId] = outcome
      return { selections }
    }),
}))

/* --- the button ------------------------------------------------------------ */

/**
 * The bet-slip FAB — node 1:6484, 104x44, `#F45B24`, radius 999, `0 10px 24px rgba(16,42,103,.15)`.
 *
 * **Where it sits is this build's decision, not the design's.** `1:6484` is a standalone frame at
 * canvas (3528, 313); it is not a child of `1:5994` or `1:88`, so Figma states nothing about its
 * docking, its trigger or its lifetime (07-sport.md UNKNOWN #7). It docks bottom-right, 16px — the
 * page gutter — above the painted bottom-nav plate, and it is absent until a selection exists.
 *
 * The outer frame is `mx-auto w-full max-w-[390px]` so the button tracks the 390px page column
 * above 390 and the viewport's own gutter below it — a fixed `w-[390px]` put its right edge at
 * x 374 on a 375 screen, `pointer-events-none` so the empty band beside it stays
 * transparent to taps, and the same `env(safe-area-inset-bottom)` term the nav is pinned with.
 * `z-30` keeps it under the nav (z-40) and under a Sheet (z-50).
 *
 * There is no selection count anywhere in the design — just the ticket and the word `Купон` — so
 * none is drawn. It is announced, though: `aria-label` is "Купон, N", the design's word plus the
 * number, so a screen reader hears that a pick landed. No new copy.
 *
 * **It has no destination, and that is a known open question rather than an oversight.** The Figma
 * file draws no bet-slip panel, sheet or route for `Купон` to open — 1:6484 is the only node about
 * the slip in the whole page — so inventing one would invent a screen. Until the owner says what
 * it opens, the button carries no `onClick`, and so it is `aria-disabled` with `INERT`: no
 * press squash on a control that does nothing — the defect class MobileShell's comment records.
 */
export function BetSlipFab() {
  const count = useBetSlip((state) => Object.keys(state.selections).length)

  if (count === 0) return null

  return (
    <>
      {/*
       * A floating button over a scrolling list covers whatever is under it, and at the bottom of
       * the document that is not recoverable by scrolling. Measured at 390x844: with the page
       * scrolled to its end, the last fixture's `Н` and `2` cells sit at y 722..764 while the FAB
       * holds y 716..760 — `elementFromPoint` at both cell centres returned the FAB, so two odds
       * cells were unreachable for as long as a selection existed.
       *
       * This is 44 (the button) + 16 (its gap above the nav plate) of extra document, present only
       * while the FAB is, so the list can always be scrolled clear of it. It sits in normal flow
       * next to the fixed frame rather than as page padding, because only this component knows
       * whether the button is up.
       */}
      <div aria-hidden className="h-[60px]" />

      <div
        className="pointer-events-none fixed inset-x-0 z-30 mx-auto flex w-full max-w-[390px] justify-end px-gutter"
        // Inline because Tailwind cannot express the env() term, and this is the same expression
        // MobileShell's spacer and BottomNavBar's `bottom` are built from.
        style={{ bottom: 'calc(var(--nav-bar-h) + env(safe-area-inset-bottom) + 16px)' }}
      >
        <button
          type="button"
          aria-disabled="true"
          aria-label={`Купон, ${count}`}
          // 16 + 20 + 8 + 44 + 16 = 104 and h-11 = 44, so the measured box falls out of the padding
          // rather than being pinned.
          className={`pointer-events-auto inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-hot px-4 shadow-fab ${INERT}`}
        >
          <Icon src={SPORT_ICONS.betslip} alt="" width={20} height={20} className="h-5 w-5" />
          {/* 1:6487 — Inter Regular 15, white. 3.30:1 on this fill: a recorded failure, shipped as
              drawn per the owner's decision on colours (docs/tokens.md §7.1). */}
          <span className="font-sans text-md text-on-dark">Купон</span>
        </button>
      </div>
    </>
  )
}
