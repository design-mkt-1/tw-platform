import { describe, expect, it } from 'vitest'
import { PROVIDERS } from '../data'
import { normalize, rankByName } from '../search'

/**
 * The defect this file exists for.
 *
 * The predecessor's normaliser ended with `.replace(/[^a-z0-9]+/g, ' ')`. On a Latin catalogue
 * that is harmless. On this one it deletes every character: `Солодкий бонанза` normalises to an
 * empty string, so every title in the catalogue collapses to the same value and no query a
 * Ukrainian player could type would ever match anything. The search field would open, accept
 * input, and return nothing, forever, with no error anywhere.
 *
 * Every assertion below is Cyrillic on purpose. A Latin-alphabet test passes against the broken
 * implementation and therefore proves nothing.
 */
describe('normalize', () => {
  it('keeps Cyrillic letters', () => {
    expect(normalize('Солодкий Бонанза')).toBe('солодкий бонанза')
  })

  it('keeps digits alongside Cyrillic', () => {
    expect(normalize('Ворота Олімпу 1000')).toBe('ворота олімпу 1000')
  })

  it('turns punctuation into a separator rather than deleting the word around it', () => {
    expect(normalize("Book of Ra's")).toBe('book of ra s')
  })

  it('keeps й as й instead of reducing it to и', () => {
    // In Ukrainian these are two different letters, not a letter and its accent. An earlier
    // version decomposed with NFD and stripped combining marks — the standard trick for making
    // é match e — and turned "Солодкий" into "солодкии". This test is what caught it.
    expect(normalize('Солодкий')).toBe('солодкий')
    expect(normalize('Й')).not.toBe('и')
  })

  it('treats a precomposed and a decomposed й as the same string', () => {
    // NFC composes, so и + U+0306 and the single code point й compare equal without
    // either of them losing its identity.
    expect(normalize('й')).toBe(normalize('й'))
  })

  it('does not collapse a Cyrillic title to nothing', () => {
    // The single assertion that would have caught the original bug.
    expect(normalize('Спорт')).not.toBe('')
  })
})

describe('rankByName', () => {
  const name = (p: { name: string }) => p.name

  it('finds a provider from a Latin query', () => {
    const hits = rankByName('prag', PROVIDERS, name)
    expect(hits.map((h) => h.item.name)).toContain('Pragmatic')
  })

  it('finds a Cyrillic name from a Cyrillic query', () => {
    /*
     * Against a fixture, not against src/data/providers.json.
     *
     * Every provider in the shipped data is a Latin brand name, and deliberately so: the
     * design's own suggestion rows read `Pragmatic Play`. So the shipped data cannot exercise
     * this path, and a test that quietly found nothing to assert on would pass while proving
     * nothing — which is exactly how the Cyrillic defect survived in the first place.
     */
    const items = [{ name: 'Солодкий Бонанза' }, { name: 'Aviator' }]
    expect(rankByName('Сол', items, name).map((h) => h.item.name)).toEqual(['Солодкий Бонанза'])
    expect(rankByName('бонан', items, name).map((h) => h.item.name)).toEqual(['Солодкий Бонанза'])
  })

  it('ranks a name that starts with the query above one that merely contains it', () => {
    const items = [{ name: 'Nolimit City' }, { name: 'Limitless' }]
    const hits = rankByName('limit', items, name)
    expect(hits[0].item.name).toBe('Limitless')
    expect(hits.map((h) => h.rank)).toEqual([...hits.map((h) => h.rank)].sort((a, b) => a - b))
  })

  it('returns nothing for a query that matches nothing', () => {
    // The home row on a Ukrainian keyboard — a string a player could actually produce, not a
    // nonsense word chosen because it was safe.
    expect(rankByName('ксзщ', PROVIDERS, name)).toEqual([])
  })

  it('returns nothing for an empty query rather than the whole list', () => {
    expect(rankByName('   ', PROVIDERS, name)).toEqual([])
  })
})
