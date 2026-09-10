import { Footer } from '@/components/casino/Footer'
import { GameGrid } from '@/components/casino/GameGrid'
import { HeroCarousel } from '@/components/casino/HeroCarousel'
import { ProviderRow } from '@/components/casino/ProviderRow'
import { RecentWinsTicker } from '@/components/casino/RecentWinsTicker'
import { SectionHeader } from '@/components/casino/SectionHeader'
import { TournamentCard } from '@/components/casino/TournamentCard'
import { BottomNavBar } from '@/components/layout/BottomNavBar'
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
    case 'game-grid':
      if (!spec.title) throw new Error(`section ${spec.id} is a game-grid with no title`)
      return (
        <section aria-label={spec.title} className="flex flex-col gap-4 px-gutter">
          <SectionHeader title={spec.title} icon={spec.icon} seeAllLabel={spec.seeAllLabel} />
          <GameGrid filter={spec.filter} rows={spec.rows} />
        </section>
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
        <main className="flex flex-col gap-6 bg-page pb-6">
          {SECTIONS.map((spec) =>
            spec.kind === 'ticker' ? (
              // The switcher sits between the hero and the ticker in the design (y 292 to 336),
              // and it is chrome rather than a section, so it is placed here rather than given a
              // SectionKind that would have exactly one member.
              <div key={spec.id} className="flex flex-col gap-6">
                <CategoryBar />
                <Section spec={spec} />
              </div>
            ) : (
              <Section key={spec.id} spec={spec} />
            ),
          )}
          <Footer />
        </main>
      </MobileShell>
      <BottomNavBar />
    </>
  )
}
