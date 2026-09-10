import { GameCard } from '@/components/casino/GameCard'
import { selectGames } from '@/lib/data'
import type { GameFilter } from '@/lib/types'

interface GameGridProps {
  /** Rows select from the catalogue; a row is a filter, never a hand-picked list. */
  filter?: GameFilter
  /** One line of six or two lines of three. The design draws two everywhere. */
  rows?: 1 | 2
}

/**
 * The game grid — 1:3573 and its seven siblings. 8px between columns, 12px between the two
 * lines, 114px cards.
 *
 * Two lines is `grid-auto-flow: column` over two rows, not two stacked flex rows: filling by
 * column is what makes 6 games read as 3 columns of 2, and it keeps a horizontal scroll honest
 * when a filter returns more than 6.
 *
 * At the design's six games the track is 3x114 + 2x8 = 358, exactly the content column, so
 * nothing scrolls. The overflow is not decoration — it is what a longer row does, and 1:3785
 * (the provider track) proves the design already relies on that behaviour.
 */
export function GameGrid({ filter, rows = 2 }: GameGridProps) {
  const games = selectGames(filter)
  if (games.length === 0) return null

  // Only a track that actually overflows needs to be keyboard-scrollable (SC 2.1.1). The cards
  // are non-interactive <article>s, so without this a keyboard user could not reach the games
  // past the fold — and adding it unconditionally would plant an empty tab stop on all eight
  // rows of the design, none of which overflow.
  const scrolls = games.length > rows * 3

  return (
    <div className="w-full overflow-x-auto scrollbar-none" tabIndex={scrolls ? 0 : undefined}>
      <div
        className={`grid w-max grid-flow-col gap-x-2 gap-y-3 ${rows === 2 ? 'grid-rows-2' : 'grid-rows-1'}`}
      >
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  )
}
