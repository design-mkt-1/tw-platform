'use client'

import { create } from 'zustand'
import { SPORT_ICONS } from '@/lib/assets'
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
 * The outer frame copies BottomNavBar: `mx-auto w-[390px]` so the button tracks the 390px page
 * rather than the viewport edge, `pointer-events-none` so the empty band beside it stays
 * transparent to taps, and the same `env(safe-area-inset-bottom)` term the nav is pinned with.
 * `z-30` keeps it under the nav (z-40) and under a Sheet (z-50).
 *
 * There is no selection count anywhere in the design — just the ticket and the word `Купон` — so
 * none is drawn or announced. That is a gap in the design, not a simplification here.
 */
export function BetSlipFab() {
  const count = useBetSlip((state) => Object.keys(state.selections).length)

  if (count === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-30 mx-auto flex w-[390px] justify-end px-gutter"
      // Inline because Tailwind cannot express the env() term, and this is the same expression
      // MobileShell's spacer and BottomNavBar's `bottom` are built from.
      style={{ bottom: 'calc(var(--nav-bar-h) + env(safe-area-inset-bottom) + 16px)' }}
    >
      <button
        type="button"
        // 16 + 20 + 8 + 44 + 16 = 104 and h-11 = 44, so the measured box falls out of the padding
        // rather than being pinned. The pressed state is Button's invented `active:scale`, so this
        // presses like every other control in the build.
        className="pointer-events-auto inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-hot px-4 shadow-fab transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100"
      >
        <Icon src={SPORT_ICONS.betslip} alt="" width={20} height={20} className="h-5 w-5" />
        {/* 1:6487 — Inter Regular 15, white. 3.30:1 on this fill: a recorded failure, shipped as
            drawn per the owner's decision on colours (docs/tokens.md §7.1). */}
        <span className="font-sans text-md text-on-dark">Купон</span>
      </button>
    </div>
  )
}
