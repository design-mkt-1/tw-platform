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
 * All eleven of the design's section icons.
 *
 * The last three arrived late and by a different route. `download_assets` caps a subtree at 20 SVG
 * fragments, and the header group's mask stacks consume the cap before every icon is reached, so
 * the first pass could not attribute a fragment to an icon and those three sections fell back to
 * `popular`. The fix was one `download_assets` per icon *frame* — that flattens the stack and
 * returns the whole node as a single export:
 *
 *   megaways          `1:4864`, recovered from a URL already recorded in the inventory, no new call
 *   must-play-slots   `1:4490`, one call
 *   wheel-fortune     `1:5567`, one call
 *
 * `mustPlaySlots` is the 20px `#92BDF3` header version and is NOT the same file as
 * `CHIP_ICONS.mustPlaySlots`, which is 16px `#71809A`. Both were exported and compared here: the
 * four path ids are identical (`path2815/2819/2823/2829`), so it is one drawing at two sizes in two
 * paints. `docs/design-inventory/manifest-casino-icons.md` recorded that as an open question; this
 * is the answer.
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
  mustPlaySlots: withBase('/images/icons/section-must-play-slots.svg'),
  megaways: withBase('/images/icons/section-megaways.svg'),
  wheelFortune: withBase('/images/icons/section-wheel-fortune.svg'),
} as const

export type SectionIconName = keyof typeof SECTION_ICONS

/** The dashed rule between a section title and its right-hand control. */
export const SECTION_DIVIDER = withBase('/images/icons/section-divider.svg')

/* --- menu panel ----------------------------------------------------------- */

/**
 * Every glyph the jackpot menu draws: eight row icons, the Terms document, the row chevron, and
 * the six panel-chrome glyphs (avatar, copy, close, More arrow, Support headset, WhatsApp).
 *
 * ## The eight row icons + Terms + chevron — one `download_assets` call each
 *
 * `download_assets` caps a subtree at 20 SVG fragments and its URLs carry no node id, so a single
 * call on the whole panel returns an unattributable pile — the CASINO slot machine alone is 9
 * fragments and 2 luminance masks. One call per icon costs ten calls and makes attribution free.
 *
 * Every one arrived with the whole 390px panel behind the glyph: the `#F4F6FA` sidebar, its
 * `#D8DDE7` right border and the `#E8F1FC` row pill. The viewBox hides them, so an `<img>` looks
 * right — but MenuPanel paints these as CSS masks, and an opaque rect covering the box masks to
 * a solid square, not to an icon. scripts/clean-svg.mjs cannot reach that furniture: it is
 * `<path>`s rather than `<rect>`s, sitting 12..338px outside a 15px box, inside the script's
 * 1000px threshold. It was stripped by hand, along with the `opacity="0.5"` seven of the eight
 * carry — a mask reads group opacity as coverage, so the file must supply shape and nothing else.
 *
 * ## The six panel glyphs — the per-node asset URL, not `download_assets`
 *
 * These came from the URLs the earlier `get_design_context` pass recorded per node
 * (`https://www.figma.com/api/mcp/asset/<uuid>.svg`), which cost zero MCP calls and return the
 * VECTOR LAYER rather than a whole-node render — so five of the six arrived with no panel
 * furniture at all and needed no stripping. Two of them could not have been fetched any other way:
 *
 * - The Support headset is `I1:6984;2642:42639`. `download_assets` validates `nodeId` against
 *   `^\d+[:-]\d+$`, so an instance-child id cannot be passed to the tool at all. The recorded
 *   UUID is the only route to that glyph.
 * - The recorded WhatsApp UUID is NOT the glyph: it is a 190.809x79.8116 sheet of 23 messenger
 *   brand marks (Slack `#E01E5A`, Zoom `#4A8CFF`, Viber `#904A97`, …) that node `1:6988` clips a
 *   16x16 window onto. That one needed a real `download_assets` export — the single Figma call
 *   this pass spent — and it is the ONLY one of the six carrying panel furniture. clean-svg.mjs
 *   reached two of its five pieces (the `#1E1E1E` canvas rect by fill, the 168x38 `#10B981`
 *   button rect by rule 3, 168 > 3x16); the two `#F4F6FA` panel paths, the `#D8DDE7` border path
 *   and its `<mask>` all start at x -235, inside the script's 1000px threshold, and went by hand.
 *
 * `moreArrow` points UP in the file (apex at y 7.08, base at y 12.9). The `Arrow` frame carries
 * `rotate(180)` in Figma, which is also what explains its y=+20 offset inside a 20px parent, so
 * MenuPanel supplies `rotate-180`. Do not re-export it expecting a down chevron.
 *
 * `chevronDown` is exported but NOT drawn. The design gives SPORT, CASINO and PAYMENTS a
 * collapsed `weui:arrow-filled` and contains no expanded state for any of them, so MenuPanel
 * ships the rows as links with no chevron (its own comment explains why). The file is kept
 * because re-exporting it costs a Figma call and the decision may be revisited.
 */
export const MENU_ICONS = {
  sport: withBase('/images/menu/row-sport.svg'),
  casino: withBase('/images/menu/row-casino.svg'),
  referral: withBase('/images/menu/row-referral.svg'),
  bonuses: withBase('/images/menu/row-bonuses.svg'),
  promotions: withBase('/images/menu/row-promotions.svg'),
  cashback: withBase('/images/menu/row-cashback.svg'),
  payments: withBase('/images/menu/row-payments.svg'),
  profile: withBase('/images/menu/row-profile.svg'),
  terms: withBase('/images/menu/terms-document.svg'),
  chevronDown: withBase('/images/menu/chevron-down.svg'),
  avatar: withBase('/images/menu/avatar.svg'),
  copy: withBase('/images/menu/copy.svg'),
  /**
   * NOT from Figma — the design has no check glyph anywhere. Drawn by hand on 2026-09-10 for the
   * Copy-ID confirmation (owner's decision): copy.svg's 14.3008 x 16.0013 box so the mask needs no
   * new size, and its 0.97 line weight and #191970 (`--text-navy`), so the two read as one set.
   */
  check: withBase('/images/menu/check.svg'),
  close: withBase('/images/menu/close.svg'),
  moreArrow: withBase('/images/menu/more-arrow.svg'),
  supportHeadset: withBase('/images/menu/support-headset.svg'),
  whatsapp: withBase('/images/menu/whatsapp.svg'),
} as const

export type MenuIconName = keyof typeof MENU_ICONS

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
