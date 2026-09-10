import categoriesJson from '@/data/categories.json'
import footerJson from '@/data/footer.json'
import gamesJson from '@/data/games.json'
import providersJson from '@/data/providers.json'
import recentWinsJson from '@/data/recentWins.json'
import tournamentsJson from '@/data/tournaments.json'
import userJson from '@/data/user.json'
import type {
  Category,
  FooterData,
  Game,
  Provider,
  RecentWin,
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
