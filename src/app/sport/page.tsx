import { BetSlipFab } from '@/components/sport/BetSlipFab'
import { BonusCarousel } from '@/components/sport/BonusCarousel'
import { LeagueList } from '@/components/sport/LeagueList'
import { LeagueStrip } from '@/components/sport/LeagueStrip'
import { PrematchLiveToggle } from '@/components/sport/PrematchLiveToggle'
import { SportFilterRow } from '@/components/sport/SportFilterRow'
import { SportNavRow } from '@/components/sport/SportNavRow'
import { UpcomingHeader } from '@/components/sport/UpcomingHeader'
import { Header } from '@/components/layout/Header'
import { MobileShell } from '@/components/layout/MobileShell'
import { UrlStateBridge } from '@/components/UrlStateBridge'

/**
 * The sportsbook, frame `1:5994` "Prelog log" / `1:88` "Post log", 390 x 1021.
 *
 * **Login changes the header and nothing else.** A node-for-node comparison of the two frames
 * (07-sport.md §10.4) found every child of every band below the header identical in name, x, y,
 * width and height — same mode switch, same four hero slides, same 121/141/106 filter pills, same
 * two league cards. So there is no post-login variant of this file: `Header` reads `auth` from the
 * store and this page never mentions it.
 *
 * The six bands butt together with no gaps and sum to exactly 1021 — unlike the casino page,
 * which spaces its sections with a 24px rhythm. Every gap you see here belongs to a band's own
 * padding, which is why `<main>` carries no `gap`.
 *
 *   0    60   `1:5995`  header
 *   60   152  `1:6007`  Prematch/Live switch + sports navigation  ← the one wrapper this file owns
 *   212  193  `1:6027`  bonus banner carousel
 *   405  90   `1:6081`  recommended leagues
 *   495  60   `1:6333`  sport filters
 *   555  466  `1:6366`  "Майбутні Події" + the league cards
 *
 * The bet-slip FAB `1:6484` is mounted here, docked bottom-right — and that corner is **this
 * build's decision, not a measurement**. `1:6484` sits at canvas (3528, 313) as a standalone frame
 * that no page frame instantiates, so the file states nothing about where it docks, what triggers
 * it or how long it stays (07-sport.md UNKNOWN #7). Owner's decision of 2026-09-10: mount it
 * anyway, bottom-right, present only while a selection exists. Recorded as a decision so nobody
 * later reads the corner as something Figma specified.
 */
export default function SportPage() {
  return (
    <>
      <UrlStateBridge />
      <Header />
      <MobileShell>
        <main className="flex flex-col bg-page">
          {/*
           * `1:6007` wraps the mode switch and the sports nav as ONE card: `padding-top: 12px`,
           * `border-radius: 24px`, `drop-shadow(0 8px 12px rgba(0,0,0,0.05))`. `PrematchLiveToggle`
           * *is* that card and takes the nav row as its child, so the plate and its shadow are
           * drawn exactly once. A second wrapper here used to nest one plate inside another: the
           * shadow painted twice and the extra `pt-3` pushed the track to y 96 instead of y 84.
           *
           * It has no fill of its own — ten pixel samples across five bands of `1:5994` returned
           * flat `--bg-page`, so the shadow is cast by the children's own alpha, exactly as Figma
           * renders it. The 12px top padding is `1:6007`'s; the mode track brings `1:6008`'s.
           */}
          <PrematchLiveToggle>
            <SportNavRow />
          </PrematchLiveToggle>

          <BonusCarousel />
          <LeagueStrip />
          <SportFilterRow />

          {/*
           * `1:6366`, 390 x 466. Header `1:6367` at (16, 16), card stack `1:6382` at (16, 54)
           * → 8px between them, and 20px between the two cards.
           */}
          <section aria-label="Майбутні Події" className="flex flex-col gap-2 px-gutter pt-gutter">
            <UpcomingHeader />
            {/* Filtered by the pill selected in `SportFilterRow`, through the `useSportFilter` store. */}
            <LeagueList />
          </section>
        </main>

        {/* Inside MobileShell so it shares the shell's stacking order: `z-30` puts it under the
            bottom nav (z-40) and under either panel (z-50). It is `fixed`, so where it sits in
            the tree changes nothing but that. */}
        <BetSlipFab />
      </MobileShell>
    </>
  )
}
