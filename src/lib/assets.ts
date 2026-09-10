/**
 * Every image path the app can produce, in one place.
 *
 * Why this file exists at all: the site deploys to a sub-path
 * (https://design-mkt-1.github.io/tw-platform/) and Next's `basePath` rewrites links and its
 * own bundles but NOT an image `src`. A component writing "/images/logo.svg" directly renders
 * a broken image on the deployed build and a perfectly fine one locally, so the mistake never
 * shows up until the client opens the link. `withBase()` is the fix and every path below is
 * already wrapped.
 *
 * `src/lib/__tests__/assets.test.ts` walks this file both ways: every path here must exist on
 * disk, and every file on disk must be named here. That test exists because this project has
 * shipped a sub-path deploy that 404'd every image.
 */

/**
 * Set by next.config.ts from GITHUB_PAGES. Empty locally, '/tw-platform' on Pages.
 * Read once at module scope: it is inlined at build time, not read at runtime.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function withBase(path: string): string {
  if (!path.startsWith('/')) throw new Error(`asset path must be absolute: ${path}`)
  return `${BASE_PATH}${path}`
}

/* --- chrome ------------------------------------------------------------- */

export const LOGO = withBase('/images/nav/topwin-logo.svg')

/** Header and in-row search glyph. One file, three call sites in the design. */
export const SEARCH_ICON = withBase('/images/icons/search-header.svg')
export const CHEVRON_RIGHT = withBase('/images/icons/chevron-right.svg')
export const DEPOSIT_PLUS = withBase('/images/icons/balance-deposit-plus.svg')

/* --- bottom navigation --------------------------------------------------- */

/**
 * The plate ships as an SVG rather than a CSS box for two reasons that a rounded rect cannot
 * reproduce: a 78px notch cut into its top edge, and a 1px rim that fades from opaque white at
 * the bar's top to nothing at its bottom, following the notch. See docs/tokens.md §5.2.
 */
export const NAV_PLATE = withBase('/images/nav/nav-bar-plate.svg')
export const NAV_CENTER_BUTTON = withBase('/images/nav/nav-center-button.svg')
export const NAV_BURGER = withBase('/images/nav/nav-menu-burger.svg')
export const NAV_ACTIVE_DOT = withBase('/images/nav/nav-active-dot.svg')

export const NAV_TABS = {
  casino: withBase('/images/nav/tab-casino.svg'),
  sport: withBase('/images/nav/tab-sport.svg'),
  liveCasino: withBase('/images/nav/tab-live-casino.svg'),
  promo: withBase('/images/nav/tab-promo.svg'),
} as const

/* --- casino category chips ----------------------------------------------- */

export const CHIP_ICONS = {
  popular: withBase('/images/icons/chip-popular.svg'),
  slots: withBase('/images/icons/chip-must-play-slots.svg'),
  liveCasino: withBase('/images/icons/chip-live-casino.svg'),
} as const

export type ChipIconName = keyof typeof CHIP_ICONS

/* --- casino section headers ---------------------------------------------- */

/**
 * Nine of the design's section icons. Three more (megaways, wheel-fortune, and the 20px
 * must-play-slots) could not be exported: download_assets caps a subtree at 20 SVG fragments
 * and the icons' mask stacks consume the cap. Sections using those fall back to `popular`,
 * and the gap is recorded in docs/tokens.md.
 */
export const SECTION_ICONS = {
  popular: withBase('/images/icons/section-popular.svg'),
  newGames: withBase('/images/icons/section-new-games.svg'),
  recommended: withBase('/images/icons/section-recommended.svg'),
  crashGames: withBase('/images/icons/section-crash-games.svg'),
  tournaments: withBase('/images/icons/section-current-tournaments.svg'),
  jackpots: withBase('/images/icons/section-jackpots.svg'),
  lottery: withBase('/images/icons/section-lottery.svg'),
  dropsAndWins: withBase('/images/icons/section-drops-and-wins.svg'),
} as const

export type SectionIconName = keyof typeof SECTION_ICONS

/** The dashed rule between a section title and its right-hand control. */
export const SECTION_DIVIDER = withBase('/images/icons/section-divider.svg')

/* --- artwork -------------------------------------------------------------- */

/**
 * Four distinct game tiles exist in the whole Figma file. The design itself uses ONE, repeated
 * across all 48 cards of all 8 grid rows — the five URLs an earlier pass recorded as different
 * artwork are byte-identical (Figma mints a fresh URL per instance). Three more were recovered
 * from a page-wide sweep. This is the ceiling on how varied the grid can look.
 */
export const GAME_ART = {
  'gates-of-olympus-1000': withBase('/images/games/gates-of-olympus-1000.webp'),
  'big-bass-amazon-extreme': withBase('/images/games/big-bass-amazon-extreme.webp'),
  'yeti-quest': withBase('/images/games/yeti-quest.webp'),
} as const

export type GameArtName = keyof typeof GAME_ART

export const PROVIDER_LOGOS = {
  pragmatic: withBase('/images/providers/pragmatic.svg'),
  '3-oaks': withBase('/images/providers/3-oaks.svg'),
  bgaming: withBase('/images/providers/bgaming.svg'),
  'nolimit-city': withBase('/images/providers/nolimit-city.svg'),
  spribe: withBase('/images/providers/spribe.svg'),
} as const

export type ProviderLogoName = keyof typeof PROVIDER_LOGOS

export const HERO_CASINO = withBase('/images/promo/hero-casino-welcome.webp')

/**
 * The tournament banners are the FULL-BLEED source, not the cropped view Figma draws. The card
 * is 358x220 and the file is 1573x478, so CSS re-crops with the percentages recorded in
 * docs/tokens.md. Deriving the crop from the file's own pixel size gives the wrong framing.
 */
export const TOURNAMENT_ART = {
  zeus: withBase('/images/promo/tournament-zeus-trophy.webp'),
  bigBass: withBase('/images/promo/tournament-big-bass-trophy.webp'),
  spinWheel: withBase('/images/promo/tournament-spin-wheel.webp'),
} as const

export type TournamentArtName = keyof typeof TOURNAMENT_ART

/* --- sportsbook ----------------------------------------------------------- */

export const SPORT_HERO = withBase('/images/sport/hero-sport-welcome.webp')
export const SPORT_HERO_GLOW = withBase('/images/sport/hero-sport-welcome-glow.svg')

export const SPORT_ICONS = {
  football: withBase('/images/sport/icon-football.svg'),
  basketball: withBase('/images/sport/icon-basketball.svg'),
  tennis: withBase('/images/sport/icon-tennis.svg'),
  liveStream: withBase('/images/sport/icon-live-stream.svg'),
  calendar: withBase('/images/sport/icon-calendar.svg'),
  betslip: withBase('/images/sport/icon-betslip-ticket.svg'),
  moreLeagues: withBase('/images/sport/chevron-down-more-leagues.svg'),
} as const

export type SportIconName = keyof typeof SPORT_ICONS

/**
 * One badge, not eight. The design's league strip repeats a single Europa League mark eight
 * times — proven by sha256, not by layer name. Varied league logos are not obtainable from
 * this Figma file.
 */
export const LEAGUE_BADGE = withBase('/images/sport/league-badge-europa-league.svg')

/**
 * Slides 3 and 4 of the sport carousel are casino artwork with English, GBP-denominated copy —
 * layer names "зевс" and "Gates of Olympus_Game Art". They are Figma leftovers on a Ukrainian
 * sportsbook page and are deliberately NOT referenced by any component. Kept on disk so the
 * decision is reversible without another Figma call; excluded from the asset test for the same
 * reason.
 */
export const UNUSED_SPORT_SLIDES = [
  '/images/sport/casino-slide-blur-blob.webp',
  '/images/sport/casino-slide-lens-flare.webp',
  '/images/sport/casino-slide-zeus-character.webp',
] as const

/* --- footer --------------------------------------------------------------- */

export const PAYMENT_LOGOS = {
  visa: withBase('/images/footer/payment/visa.svg'),
  mastercard: withBase('/images/footer/payment/mastercard.svg'),
  'visa-mastercard': withBase('/images/footer/payment/visa-mastercard-lockup.svg'),
  bitcoin: withBase('/images/footer/payment/bitcoin.svg'),
  'bitcoin-cash': withBase('/images/footer/payment/bitcoin-cash.svg'),
  ethereum: withBase('/images/footer/payment/ethereum.svg'),
  tether: withBase('/images/footer/payment/tether.svg'),
  /** 26 separate vector exports in Figma, recombined into one file. The word itself is
   *  outlined rather than live text, so it cannot be translated without a re-export. */
  cryptocurrencies: withBase('/images/footer/payment/cryptocurrencies.svg'),
} as const

export type PaymentLogoName = keyof typeof PAYMENT_LOGOS

export const PARTNER_LOGOS = {
  'casino-bonus-club': withBase('/images/footer/partners/casino-bonus-club.svg'),
  'casino-bonuses-now': withBase('/images/footer/partners/casino-bonuses-now.svg'),
  casinostest: withBase('/images/footer/partners/casinostest.svg'),
  gamblersbet: withBase('/images/footer/partners/gamblersbet.svg'),
  'no-deposit': withBase('/images/footer/partners/no-deposit.svg'),
  /** Both PNG originals are scaled past their box and cropped — 165x44 in a 100x32 slot, and
   *  2048x2048 in a 90x40 slot. The crops are part of the design; preserve them. */
  zamsino: withBase('/images/footer/partners/zamsino.webp'),
  'deutschland-casinos': withBase('/images/footer/partners/deutschland-casinos.webp'),
} as const

export type PartnerLogoName = keyof typeof PARTNER_LOGOS

/**
 * All three flag layers are named "en" in Figma and carry no locale metadata. Ukraine is
 * certain — the layer is also named Flag_of_Ukraine and the fills are #0057B7 / #FFD700. The
 * other two are named for the artwork they draw, not for a locale nobody could prove.
 */
export const LANGUAGE_FLAGS = {
  ukraine: withBase('/images/footer/flags/flag-ukraine.svg'),
  'union-jack': withBase('/images/footer/flags/flag-union-jack.svg'),
  'tricolour-white-blue-red': withBase('/images/footer/flags/flag-tricolour-white-blue-red.svg'),
} as const

export type LanguageFlagName = keyof typeof LANGUAGE_FLAGS
