/**
 * Money, clocks and names. Ukrainian locale, hryvnia.
 *
 * The design is inconsistent about currency — the hero writes `₴250.000`, the sport banner
 * `15000 ₴`, the balance chip `$ 140.00` and the recent-wins ticker `41.04 GBP`. Three
 * currencies on screens that sit next to each other. The owner's decision is to fix the
 * obvious mistakes, so everything the code formats is hryvnia in uk-UA, and the deviation is
 * recorded in docs/tokens.md.
 */

const UAH = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const UAH_WHOLE = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  maximumFractionDigits: 0,
})

/** Amounts are carried in kopiyky so no total is ever the sum of two floats. */
export function formatUah(minor: number): string {
  return UAH.format(minor / 100)
}

/** Prize pots and bonus figures, which the design always writes without decimals. */
export function formatUahWhole(minor: number): string {
  return UAH_WHOLE.format(minor / 100)
}

/**
 * `luckytest1234567` becomes `lu***********567`: first two and last three, the shape node
 * 1:3397 draws as `le****et`. Short names are returned whole rather than reduced to asterisks,
 * which would mask nothing while looking broken.
 */
export function maskUsername(name: string): string {
  const chars = [...name]
  if (chars.length <= 5) return name
  const head = chars.slice(0, 2).join('')
  const tail = chars.slice(-3).join('')
  return `${head}${'*'.repeat(chars.length - 5)}${tail}`
}

/* --- countdown -------------------------------------------------------------- */

/**
 * A static export has no server, so anything computed at build time freezes. The tournament
 * deadlines in the design are already in the past, and a naive `max(0, end - now)` renders
 * `00:00:00` on every card forever — that exact bug shipped in the predecessor project.
 *
 * So a past deadline rolls forward in whole periods until it is in the future. 24 hours keeps
 * the hours field at two digits, which is the width the design draws.
 */
export const PERIOD_MS = 24 * 60 * 60 * 1000

export function nextCountdownEnd(endsAt: string, from: number): number {
  const end = Date.parse(endsAt)
  if (Number.isNaN(end)) throw new Error(`invalid deadline: ${endsAt}`)
  if (end > from) return end
  const periods = Math.ceil((from - end) / PERIOD_MS)
  return end + periods * PERIOD_MS
}

/**
 * `from` is a parameter rather than a call to Date.now() so the same input always produces the
 * same output. Server and client format the identical string and React raises no hydration
 * mismatch; a function reading the clock internally cannot promise that.
 */
export function countdownEndIso(endsAt: string, from: number): string {
  return new Date(nextCountdownEnd(endsAt, from)).toISOString()
}

export interface CountdownParts {
  hours: string
  minutes: string
  seconds: string
}

/** Zero-padded to two digits each, which the 24-hour period guarantees for hours. */
export function formatCountdown(endsAt: string, from: number): CountdownParts {
  const remaining = Math.max(0, nextCountdownEnd(endsAt, from) - from)
  const total = Math.floor(remaining / 1000)
  return {
    hours: String(Math.floor(total / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    seconds: String(total % 60).padStart(2, '0'),
  }
}
