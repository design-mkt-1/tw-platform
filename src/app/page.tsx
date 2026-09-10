import { Footer } from '@/components/casino/Footer'
import { GameGrid } from '@/components/casino/GameGrid'
import { HeroCarousel } from '@/components/casino/HeroCarousel'
import { ProviderRow } from '@/components/casino/ProviderRow'
import { RecentWinsTicker } from '@/components/casino/RecentWinsTicker'
import { SectionHeader } from '@/components/casino/SectionHeader'
import { TournamentCard } from '@/components/casino/TournamentCard'
import { CategoryBar } from '@/components/layout/CategoryBar'
import { Header } from '@/components/layout/Header'
import { MobileShell } from '@/components/layout/MobileShell'
import { UrlStateBridge } from '@/components/UrlStateBridge'
import { PROVIDERS, RECENT_WINS, TOURNAMENTS } from '@/lib/data'
import { SECTIONS } from '@/lib/sections'
import type { SectionSpec } from '@/lib/types'

/**
 * The casino home page, frame 1:3289 pre-login / 1:581 post-login.
 *
 * Fourteen of the fifteen bands are data — src/lib/sections.ts holds the order and this file
 * holds one renderer per shape. A new row is four lines there and no new component here, which
 * is the only reason twelve rows that look identical in the design really are identical in the
 * code. If a change ever needs an `if` for one specific row, something has gone wrong.
 *
 * The fifteenth band, the category switcher at 1:3335, is not a section: it is chrome that sits
 * between the hero and the ticker and drives store state rather than rendering content.
 */

/**
 * One clock for every countdown on the page.
 *
 * Read once here, at module scope, and passed down. Each card reading its own Date.now() would
 * read it at a different instant, so two cards a millisecond apart would render different
 * strings on the server than on the client and React would throw a hydration mismatch — on a
 * page that looks perfectly fine locally, because locally the server and the browser are the
 * same machine within the same second.
 */
const RENDERED_AT = Date.now()

/**
 * The three bands the design draws contiguously, split out of the data-driven list.
 *
 * They are still SectionSpecs and still ordered by src/lib/sections.ts; only their spacing is
 * special, and it is special because the design measured that way. Everything below them stays
 * one row of data per band, which is the property worth protecting — twelve rows that look
 * identical in the design really are identical in the code.
 */
const HERO = SECTIONS.find((s) => s.kind === 'hero')!
const TICKER = SECTIONS.find((s) => s.kind === 'ticker')!
const CONTENT = SECTIONS.filter((s) => s !== HERO && s !== TICKER)

function Section({ spec }: { spec: SectionSpec }) {
  switch (spec.kind) {
    case 'hero':
      return <HeroCarousel />

    case 'ticker':
      return <RecentWinsTicker wins={RECENT_WINS} />

    // `title` is optional on SectionSpec because the hero and the ticker have no header at
    // all. A grid or a provider row without one is a data error, and rendering an untitled row
    // would hide it — a header with an empty title still draws its rule and its see-all pill,
    // so the page would look almost right and the missing string would never be noticed.
    //
    // The grid draws its own header: the selected category chip can empty a row, and only
    // something holding the game count can decide not to draw the heading over nothing.
    case 'game-grid':
      if (!spec.title) throw new Error(`section ${spec.id} is a game-grid with no title`)
      return (
        <GameGrid
          title={spec.title}
          icon={spec.icon}
          seeAllLabel={spec.seeAllLabel}
          filter={spec.filter}
          rows={spec.rows}
        />
      )

    case 'provider-row':
      if (!spec.title) throw new Error(`section ${spec.id} is a provider-row with no title`)
      return (
        <section aria-label={spec.title} className="flex flex-col gap-4">
          <div className="px-gutter">
            <SectionHeader title={spec.title} icon={spec.icon} seeAllLabel={spec.seeAllLabel} />
          </div>
          <ProviderRow providers={PROVIDERS} />
        </section>
      )

    case 'tournament': {
      const tournament = TOURNAMENTS.find((t) => t.id === spec.tournamentId)
      // A missing id is a data error, not a runtime state to design around. Rendering nothing
      // beats rendering a card with blank fields that reads as a loading state.
      if (!tournament) return null
      return (
        <section aria-label={spec.title ?? tournament.title} className="flex flex-col gap-4 px-gutter">
          {spec.title ? (
            <SectionHeader title={spec.title} icon={spec.icon} seeAllLabel={spec.seeAllLabel} />
          ) : null}
          <TournamentCard tournament={tournament} from={RENDERED_AT} />
        </section>
      )
    }
  }
}

export default function Home() {
  return (
    <>
      <UrlStateBridge />
      <Header />
      <MobileShell>
        {/*
         * `gap-4`, and the leading band with no gap at all, are both measured rather than chosen.
         *
         * The design's own y table (docs/design-inventory/04-casino-rows-c.md:302-318) gives every
         * content wrapper as 370 tall for a grid and 276 for a tournament card, and every wrapper
         * carries a 16px top lead-in — `03-casino-rows-b.md:138` lists 16 as the section gap and
         * the section top pad in the same breath. The content inside those wrappers measures 354
         * and 260, which is exactly what this build renders, so 354 + 16 = 370 reproduces the
         * pitch and 354 + 24 does not. Until 2026-09-12 this was `gap-6`, and the extra 8px at
         * every one of the twelve boundaries is most of why the page measured 5734 against the
         * frame's 5628.7.
         *
         * The first three bands are different and the same table says so: the hero runs 60..292,
         * the switcher 292..336 and the ticker 336..414, each starting exactly where the last one
         * ends. No gap between them at all. So they are one flex child of their own, and the 16px
         * pitch begins below them.
         */}
        <main className="flex flex-col gap-4 bg-page pb-6">
          <div className="flex flex-col">
            <Section spec={HERO} />
            {/* Chrome rather than a section: it drives store state instead of rendering content,
                which is why it has no SectionSpec of its own. */}
            <CategoryBar />
            <Section spec={TICKER} />
          </div>

          {CONTENT.map((spec) => (
            <Section key={spec.id} spec={spec} />
          ))}
          <Footer />
        </main>
      </MobileShell>
    </>
  )
}
