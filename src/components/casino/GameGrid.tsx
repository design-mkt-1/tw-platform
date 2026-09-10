'use client'

import { GameCard } from '@/components/casino/GameCard'
import { SectionHeader } from '@/components/casino/SectionHeader'
import { gamesInCategory, selectGames } from '@/lib/data'
import type { GameFilter, SectionSpec } from '@/lib/types'
import { useAppStore } from '@/store/useAppStore'

interface GameGridProps {
  /** Rows select from the catalogue; a row is a filter, never a hand-picked list. */
  filter?: GameFilter
  /** One line of six or two lines of three. The design draws two everywhere. */
  rows?: 1 | 2
  /** The header this row draws above itself. Required — a grid with no title is a data error. */
  title: string
  icon?: SectionSpec['icon']
  seeAllLabel?: string
}

/**
 * One titled row of games — 1:3414 and its seven siblings, header and grid together. 8px between
 * columns, 12px between the two lines, 114px cards.
 *
 * Two lines is `grid-auto-flow: column` over two rows, not two stacked flex rows: filling by
 * column is what makes 6 games read as 3 columns of 2, and it keeps a horizontal scroll honest
 * when a filter returns more than 6.
 *
 * At the design's six games the track is 3x114 + 2x8 = 358, exactly the content column, so
 * nothing scrolls. The overflow is not decoration — it is what a longer row does, and 1:3785
 * (the provider track) proves the design already relies on that behaviour.
 *
 * **The header lives here rather than in page.tsx, and that is the whole reason this is one
 * component.** The row's own filter and the selected chip compose, so a row can legitimately come
 * back empty — `Джекпоти` asks for Pragmatic live-casino games and the `Краш Ігри` chip leaves
 * none. Only something that knows the game count can decide not to draw the heading, and a
 * heading with its dashed rule and its `Всі (120) ` pill standing over nothing is worse than
 * either showing an empty row or showing the wrong games. The alternative — a "нічого не
 * знайдено" line — would be invented Ukrainian: the design draws no such string anywhere.
 *
 * This is a client component only because the chip lives in the store. Everything it renders is
 * still static markup.
 */
export function GameGrid({ filter, rows = 2, title, icon, seeAllLabel }: GameGridProps) {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const games = selectGames(filter, gamesInCategory(activeCategory))
  if (games.length === 0) return null

  // Only a track that actually overflows needs to be keyboard-scrollable (SC 2.1.1). The cards
  // are non-interactive <article>s, so without this a keyboard user could not reach the games
  // past the fold — and adding it unconditionally would plant an empty tab stop on all eight
  // rows of the design, none of which overflow.
  const scrolls = games.length > rows * 3

  return (
    <section aria-label={title} className="flex flex-col gap-4 px-gutter">
      <SectionHeader title={title} icon={icon} seeAllLabel={seeAllLabel} />
      <div className="w-full overflow-x-auto scrollbar-none" tabIndex={scrolls ? 0 : undefined}>
        <div
          className={`grid w-max grid-flow-col gap-x-2 gap-y-3 ${rows === 2 ? 'grid-rows-2' : 'grid-rows-1'}`}
        >
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </div>
    </section>
  )
}
