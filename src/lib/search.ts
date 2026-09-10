/**
 * Catalogue search.
 *
 * One ranker, used by the search panel over providers. There is no separate game search: the
 * design's only search surface is a PROVIDER search, and its own copy says so at every step —
 * the panel is titled `Провідні провайдери`, the field reads `Пошук провайдерів...`, the empty
 * state reads `Провайдерів не знайдено` and its call to action is `Усі провайдери`. An earlier
 * pass returned games into that panel, which invited the player to search one thing and answered
 * with another.
 */

/**
 * Fold a string down to something two spellings of the same word share.
 *
 * The predecessor project's version ended with `.replace(/[^a-z0-9]+/g, ' ')`, which deletes
 * every character outside the ASCII alphabet. On a Ukrainian catalogue that is not cosmetic:
 * every title folds to an empty string, so every entry compares equal to every other and no
 * query a player could type ever matches. This one is built from what to REMOVE — punctuation
 * and separators — rather than what to keep, which is why it works in any script.
 */
export function normalize(value: string): string {
  return (
    value
      .toLowerCase()
      /*
       * NFC composes, it does not strip.
       *
       * The first version decomposed with NFD and then removed every combining mark, which is
       * the standard trick for making `é` match `e`. On Cyrillic it is wrong, and a test caught
       * it: `й` decomposes to `и` plus a breve, so stripping marks turned `Солодкий` into
       * `солодкии`. In Ukrainian `й` and `и` are two different letters, not a letter and its
       * accent — the same goes for `ї` against `і`, and `ґ` against `г`. Merging them would
       * make the search answer a question the player did not ask.
       *
       * Composing still fixes what that was reaching for: a `й` typed as one code point and a
       * `й` typed as two now compare equal, without either losing its identity.
       */
      .normalize('NFC')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim()
  )
}

export interface Ranked<T> {
  item: T
  /** Lower is better. Used only to sort; never rendered. */
  rank: number
}

/**
 * Rank items by how a player's query meets their name, in bands, stable inside each band so the
 * catalogue's own order breaks ties.
 *
 * The bands matter: somebody typing three letters expects the name that STARTS with them first,
 * which a plain `includes` cannot give. `Pragmatic` typed as `pra` should not sit below a name
 * that happens to contain `pra` in the middle.
 */
export function rankByName<T>(query: string, items: T[], toName: (item: T) => string): Ranked<T>[] {
  const q = normalize(query)
  if (!q) return []

  const ranked: Ranked<T>[] = []
  for (const item of items) {
    const name = normalize(toName(item))

    let rank: number | null = null
    if (name.startsWith(q)) rank = 0
    else if (new RegExp(`(^| )${escapeRegExp(q)}`, 'u').test(name)) rank = 1
    else if (name.includes(q)) rank = 2

    if (rank !== null) ranked.push({ item, rank })
  }

  return ranked.sort((a, b) => a.rank - b.rank)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
