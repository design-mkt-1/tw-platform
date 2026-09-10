import type { Game, Provider } from './types'

/**
 * Catalogue search.
 *
 * The predecessor project's normaliser ended with `.replace(/[^a-z0-9]+/g, ' ')`, which strips
 * every character outside the ASCII alphabet. On a Ukrainian catalogue that is not a cosmetic
 * problem: `Солодкий бонанза` normalises to an empty string, every title collapses to the same
 * value, and the search returns nothing for any query a player could type. The class below is
 * built from what to REMOVE (punctuation and separators) rather than what to keep, so it works
 * for Cyrillic and Latin alike.
 */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    // Strip combining marks so `й` and `и`+breve compare equal, and `é` matches `e`.
    .replace(/\p{Mn}+/gu, '')
    // Everything that is not a letter or a digit becomes a space — in any script.
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export interface SearchHit {
  game: Game
  /** Lower is better. Used only to sort; never rendered. */
  rank: number
}

/**
 * Ranked in bands, stable inside each band so the catalogue's own order decides ties. A player
 * typing three letters expects the title that STARTS with them first, which a plain `includes`
 * cannot give.
 */
export function searchGames(query: string, games: Game[], providers: Provider[]): SearchHit[] {
  const q = normalize(query)
  if (!q) return []

  const providerName = new Map(providers.map((p) => [p.id, normalize(p.name)]))

  const hits: SearchHit[] = []
  for (const game of games) {
    const title = normalize(game.title)
    const provider = providerName.get(game.provider) ?? ''

    let rank: number | null = null
    if (title.startsWith(q)) rank = 0
    else if (new RegExp(`(^| )${escapeRegExp(q)}`, 'u').test(title)) rank = 1
    else if (title.includes(q)) rank = 2
    else if (provider.startsWith(q)) rank = 3
    else if (provider.includes(q)) rank = 4

    if (rank !== null) hits.push({ game, rank })
  }

  return hits.sort((a, b) => a.rank - b.rank)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
