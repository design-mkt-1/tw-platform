import { describe, expect, it } from 'vitest'
import {
  PERIOD_MS,
  countdownEndIso,
  formatCountdown,
  formatUah,
  formatUahWhole,
  maskUsername,
  nextCountdownEnd,
} from '../format'

describe('money', () => {
  it('writes the hryvnia symbol, not a locale abbreviation', () => {
    // The regression this guards: with `style: 'currency', currency: 'UAH'`, Node returns
    // "140,00 грн" and Chrome returns "140,00 ₴" for the same input — different ICU data, same
    // code. Next renders on one and re-renders on the other, so React threw a hydration mismatch
    // on the header balance and rebuilt the whole tree in the browser on every page load.
    // Nothing about that is visible on screen, which is why it needs a test rather than an eye.
    expect(formatUah(14000)).toContain('₴')
    expect(formatUah(14000)).not.toContain('грн')
  })

  it('formats kopiyky as hryvnia with two decimals', () => {
    expect(formatUah(14000).replace(/ /g, ' ')).toBe('140,00 ₴')
  })

  it('groups thousands the Ukrainian way', () => {
    // uk-UA groups with a narrow no-break space, not a comma or a dot. Asserting the digits and
    // the separator's absence is what catches a locale silently falling back to en-US.
    const formatted = formatUahWhole(125_000_00)
    expect(formatted).toContain('125')
    expect(formatted).toContain('000')
    expect(formatted).not.toContain(',000')
  })

  it('keeps the amount and its symbol on one line', () => {
    // U+00A0. A plain space lets a narrow column wrap "140,00" onto one line and "₴" onto the next.
    expect(formatUah(14000)).toContain(' ')
  })
})

describe('maskUsername', () => {
  it('keeps the first two and last three characters', () => {
    expect(maskUsername('luckytest1234567')).toBe('lu***********567')
  })

  it('leaves a short name alone rather than masking it to nothing', () => {
    expect(maskUsername('ivan')).toBe('ivan')
  })

  it('counts Cyrillic characters, not UTF-16 units', () => {
    expect(maskUsername('олександр')).toBe('ол****ндр')
  })
})

describe('countdown', () => {
  const from = Date.parse('2026-09-10T12:00:00Z')

  it('rolls a past deadline forward instead of freezing at zero', () => {
    // The design's deadlines are already in the past, and a static export has no server, so
    // anything computed at build time stays computed. Without the roll-forward every tournament
    // card reads 00:00:00 forever — which is exactly what shipped in the predecessor project.
    const past = '2026-09-08T18:12:36Z'
    const end = nextCountdownEnd(past, from)
    expect(end).toBeGreaterThan(from)
    expect(end - from).toBeLessThanOrEqual(PERIOD_MS)
  })

  it('leaves a future deadline where it is', () => {
    const future = '2026-09-11T09:00:00Z'
    expect(nextCountdownEnd(future, from)).toBe(Date.parse(future))
  })

  it('keeps the hours field to two digits', () => {
    // A 24-hour period is what makes this true, and two digits is the width the design draws.
    const { hours } = formatCountdown('2026-09-08T18:12:36Z', from)
    expect(hours).toHaveLength(2)
  })

  it('returns the same string for the same instant', () => {
    // Purity is the whole point of the `from` parameter: the server and the browser format the
    // identical markup, so there is no hydration mismatch to chase.
    const a = formatCountdown('2026-09-08T18:12:36Z', from)
    const b = formatCountdown('2026-09-08T18:12:36Z', from)
    expect(a).toEqual(b)
  })

  it('publishes a machine-readable instant that is not in the past', () => {
    const iso = countdownEndIso('2026-09-08T18:12:36Z', from)
    expect(Date.parse(iso)).toBeGreaterThan(from)
  })

  it('rejects a deadline it cannot parse', () => {
    expect(() => nextCountdownEnd('not a date', from)).toThrow()
  })
})
