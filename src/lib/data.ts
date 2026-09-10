import categoriesJson from '@/data/categories.json'
import footerJson from '@/data/footer.json'
import gamesJson from '@/data/games.json'
import leaguesJson from '@/data/leagues.json'
import providersJson from '@/data/providers.json'
import recentWinsJson from '@/data/recentWins.json'
import sportFiltersJson from '@/data/sportFilters.json'
import tournamentsJson from '@/data/tournaments.json'
import userJson from '@/data/user.json'
import { SECTIONS } from './sections'
import type {
  Category,
  FooterData,
  Game,
  League,
  Provider,
  RecentWin,
  SectionSpec,
  SportFilter,
  Tournament,
  UserProfile,
} from './types'

/**
 * The one place JSON meets types.
 *
 * Every component imports from here rather than from '@/data/*.json' directly. In the
 * predecessor project fifteen `as Game[]` casts were spread across thirteen files, which meant
 * fifteen chances for two of them to disagree about the same file. One cast per dataset cannot
 * disagree with itself.
 */
export const CATEGORIES = categoriesJson as Category[]
export const GAMES = gamesJson as Game[]
export const PROVIDERS = providersJson as Provider[]
export const RECENT_WINS = recentWinsJson as RecentWin[]
export const TOURNAMENTS = tournamentsJson as Tournament[]
export const FOOTER = footerJson as FooterData
export const USER = userJson as UserProfile
export const LEAGUES = leaguesJson as League[]
export const SPORT_FILTERS = sportFiltersJson as SportFilter[]

/**
 * The catalogue as the selected category chip sees it.
 *
 * **The chip narrows a row; it never replaces it.** A row keeps its own filter and draws only the
 * games in it that also carry the chosen category — so `Megaways`, which asks for Pragmatic slots,
 * comes back with nothing under the `лайв Казіно` chip, because no Pragmatic game is both. That is
 * the honest answer to that combination and it is why an empty row is hidden whole rather than
 * refilled from somewhere else (see GameGrid).
 *
 * **`popular` narrows nothing.** The design's one drawn frame has that chip selected and every row
 * full, including `Нові Ігри`, whose eight Nolimit City games are not in the `popular` category at
 * all. So the first chip is the page as drawn rather than a fifth filter, and the untouched page
 * renders exactly what it rendered before chips did anything.
 *
 * Owner's decision, 2026-09-10: the selected chip filters the game grids. Recorded as a decision
 * and not a measurement — the Figma file contains no second frame in which a different chip is
 * selected, so what filtering does here is ours and not the design's.
 */
export function gamesInCategory(category: Category['id']): Game[] {
  return category === 'popular' ? GAMES : GAMES.filter((g) => g.categories.includes(category))
}

/** Rows select from the catalogue through here, so a row is a filter and not a hand-picked list. */
export function selectGames(
  filter: { category?: Category['id']; provider?: Provider['id']; limit?: number } | undefined,
  games: Game[] = GAMES,
): Game[] {
  if (!filter) return games
  let out = games
  if (filter.category) out = out.filter((g) => g.categories.includes(filter.category!))
  if (filter.provider) out = out.filter((g) => g.provider === filter.provider)
  return filter.limit ? out.slice(0, filter.limit) : out
}

/**
 * Fewer tiles than one full column-line of three reads as a broken row, not a short one: under the
 * `Краш Ігри` chip `Рекомендовані` came back with Space XY alone and `Популярне` with two tiles
 * (measured 2026-09-10). Owner's decision of the same day: such a row is hidden whole.
 */
const MIN_ROW = 3

/**
 * What every game grid on the page draws for a chip, dealt top to bottom so no game is in two
 * rows.
 *
 * Until 2026-09-10 each row cut its own filter independently, and 12 of the 48 tiles on the drawn
 * page were repeats: `Краш Ігри` (category crash) and `Drop & Wins` (provider Spribe) shared five
 * of six, because every Spribe game is a crash game. Dealing fixes the class rather than the pair:
 * a row takes the first `limit` games of its own filter that no row above it has taken, so a new
 * row or a reordered catalogue cannot bring a repeat back. A row that would draw fewer than
 * MIN_ROW is dropped and takes nothing, so its games stay available to the rows below it.
 */
export function dealRows(category: Category['id'], specs: SectionSpec[] = SECTIONS) {
  const taken = new Set<string>()
  const rows = new Map<string, Game[]>()
  const pool = gamesInCategory(category)
  for (const spec of specs) {
    if (spec.kind !== 'game-grid') continue
    const games = selectGames(spec.filter, pool.filter((g) => !taken.has(g.slug)))
    if (games.length < MIN_ROW) continue
    for (const g of games) taken.add(g.slug)
    rows.set(spec.id, games)
  }
  return rows
}
