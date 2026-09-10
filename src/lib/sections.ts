import type { SectionSpec } from './types'

/**
 * The casino page in the design's own vertical order, frame `1:3289` "Pre log".
 *
 * Every entry carries the Figma node it was built from, so a review can open the section in the
 * file rather than guess which row it is looking at. The y offsets in
 * `04-casino-rows-c.md` §7 are the source for the order.
 *
 * The design's fifteenth element, `navbar` `1:3335` at y=292, is NOT in this list: it is the
 * category switcher, and `SectionKind` has no value for it. It is page chrome that renders
 * between the hero and the ticker and reads `src/data/categories.json`.
 */

/**
 * The literal label of the see-all pill, `1:5052` / `1:5397` and six siblings — including its
 * trailing space, which is in the Figma string. The count `120` is the same in every row of the
 * design; it is not per-section data.
 */
const SEE_ALL = 'Всі (120) '

/**
 * Two lines of three, 114x148 tiles at 8px column / 12px row gaps. Every grid section in the
 * design is that same 3x2 block, so every grid row asks for six games.
 */
const GRID_ROWS = 2
const GRID_LIMIT = 6

export const SECTIONS: SectionSpec[] = [
  {
    id: 'hero',
    kind: 'hero',
    figmaNodeId: '1:3302',
  },
  {
    id: 'recent-wins',
    kind: 'ticker',
    figmaNodeId: '1:3391',
  },
  {
    // Layer name is `Recent games`; the rendered string is `Популярне`. Trust the render.
    id: 'popular',
    kind: 'game-grid',
    title: 'Популярне',
    icon: 'popular',
    seeAllLabel: SEE_ALL,
    filter: { category: 'popular', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:3414',
  },
  {
    id: 'new-games',
    kind: 'game-grid',
    title: 'Нові Ігри',
    icon: 'newGames',
    seeAllLabel: SEE_ALL,
    filter: { provider: 'nolimit-city', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:3588',
  },
  {
    // Header `1:3776` reuses the `new` icon and ends in a round search button, not a see-all
    // pill — the one section header in the page that is not the shared component.
    id: 'providers',
    kind: 'provider-row',
    title: 'Провідні провайдери',
    icon: 'newGames',
    figmaNodeId: '1:3762',
  },
  {
    id: 'recommended',
    kind: 'game-grid',
    title: 'Рекомендовані',
    icon: 'recommended',
    seeAllLabel: SEE_ALL,
    filter: { provider: 'bgaming', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:3964',
  },
  {
    id: 'crash-games',
    kind: 'game-grid',
    title: 'Краш Ігри',
    icon: 'crashGames',
    seeAllLabel: SEE_ALL,
    filter: { category: 'crash', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:4140',
  },
  {
    // Icon `Must-play slots` `1:4490` exports as 9 mask fragments and was not recovered;
    // falls back to `popular`. Recorded in docs/tokens.md and in assets.ts.
    id: 'must-play',
    kind: 'game-grid',
    title: 'Варто спробувати',
    icon: 'popular',
    seeAllLabel: SEE_ALL,
    filter: { provider: '3-oaks', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:4340',
  },
  {
    id: 'current-tournaments',
    kind: 'tournament',
    title: 'Поточні Турніри',
    icon: 'tournaments',
    tournamentId: 'spin-challenge',
    figmaNodeId: '1:4545',
  },
  {
    // `megaways` icon `1:4864` was not recovered; falls back to `popular`.
    id: 'megaways',
    kind: 'game-grid',
    title: 'Megaways',
    icon: 'popular',
    seeAllLabel: SEE_ALL,
    filter: { provider: 'pragmatic', category: 'slots', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:4714',
  },
  {
    id: 'jackpots',
    kind: 'game-grid',
    title: 'Джекпоти',
    icon: 'jackpots',
    seeAllLabel: SEE_ALL,
    filter: { provider: 'pragmatic', category: 'live-casino', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:4888',
  },
  {
    id: 'lottery',
    kind: 'tournament',
    title: 'Лотерея',
    icon: 'lottery',
    tournamentId: 'lottery',
    figmaNodeId: '1:5072',
  },
  {
    // Latin in the source, not a transliteration slip — confirmed from the rendered string.
    id: 'drops-and-wins',
    kind: 'game-grid',
    title: 'Drop & Wins',
    icon: 'dropsAndWins',
    seeAllLabel: SEE_ALL,
    filter: { provider: 'spribe', limit: GRID_LIMIT },
    rows: GRID_ROWS,
    figmaNodeId: '1:5240',
  },
  {
    // `1:5417` wraps two things: this section (`1:5418`) and the footer (`1:5607`). The node id
    // here is the section, not the wrapper. Its `wheel-fortune` icon was not recovered; falls
    // back to `popular`.
    id: 'wheel',
    kind: 'tournament',
    title: 'Колесо',
    icon: 'popular',
    tournamentId: 'wheel',
    figmaNodeId: '1:5418',
  },
]
