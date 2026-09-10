'use client'

import { GameCard } from '@/components/casino/GameCard'
import { SectionHeader } from '@/components/casino/SectionHeader'
import { dealRows } from '@/lib/data'
import type { SectionSpec } from '@/lib/types'
import { useAppStore } from '@/store/useAppStore'

interface GameGridProps {
  /**
   * The row's SectionSpec id. Its games come from `dealRows`, which cuts every row's filter
   * against the rows above it — a row cannot pick its games alone without repeating theirs.
   */
  id: string
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
 * nothing scrolls; below 390 the cards shrink with the column (GameCard) so it still does not. The overflow is not decoration — it is what a longer row does, and 1:3785
 * (the provider track) proves the design already relies on that behaviour.
 *
 * **The header lives here rather than in page.tsx, and that is the whole reason this is one
 * component.** The row's own filter and the selected chip compose, so a row can legitimately come
 * back empty — `Джекпоти` asks for Pragmatic live-casino games and the `Краш Ігри` chip leaves
 * none — or with fewer than three tiles, which `dealRows` drops the same way. Only something that knows the game count can decide not to draw the heading, and a
 * heading with its dashed rule and its `Всі (120) ` pill standing over nothing is worse than
 * either showing an empty row or showing the wrong games. The alternative — a "нічого не
 * знайдено" line — would be invented Ukrainian: the design draws no such string anywhere.
 *
 * This is a client component only because the chip lives in the store. Everything it renders is
 * still static markup.
 */
export function GameGrid({ id, rows = 2, title, icon, seeAllLabel }: GameGridProps) {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const games = dealRows(activeCategory).get(id)
  if (!games) return null

  // Only a track that can overflow needs to be keyboard-scrollable (SC 2.1.1). The cards are
  // non-interactive <article>s, so without this a keyboard user could not reach the games past
  // the fold — and adding it unconditionally would plant an empty tab stop on all eight rows of
  // the design, none of which overflow. Counting tiles is only a valid test because the card is
  // sized from this scroller's own width (GameCard): three columns fill it at any width, so six
  // tiles never overflow and a seventh always does. With a fixed 114 the count lied below 390 —
  // at 375 every row measured scrollWidth 358 in clientWidth 343 and had no tab stop.
  const scrolls = games.length > rows * 3
  const headingId = `${id}-heading`

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4 px-gutter">
      <SectionHeader title={title} icon={icon} seeAllLabel={seeAllLabel} headingId={headingId} />
      <div className="w-full overflow-x-auto scrollbar-none" tabIndex={scrolls ? 0 : undefined}>
        {/*
         * Every column is a third of the content column less the two 8px gaps, capped at the
         * design's 114 — 358 at 390 gives 114. Tracks past the third overflow the grid, which is
         * what the scroller scrolls.
         *
         * The `+ 0.01px` is measured, not decoration. Chrome stores `(100% - 16px) / 3` as
         * `33.3333% - 5.33333px`, gets 113.99999 at 390 and floors it to 1/64px: every card came
         * out 113.984 wide and the third ended at 373.95 instead of 374. Nudging past the floor
         * lets the 114 cap win at 390; below 390 it adds at most 0.03px across three columns,
         * under what scrollWidth can report.
         */}
        <div
          className={`grid w-full auto-cols-[min(theme(spacing.card-w),calc((100%-16px)/3+0.01px))] grid-flow-col gap-x-2 gap-y-3 ${rows === 2 ? 'grid-rows-2' : 'grid-rows-1'}`}
        >
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </div>
    </section>
  )
}
