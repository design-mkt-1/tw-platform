import type {
  ChipIconName,
  GameArtName,
  LanguageFlagName,
  PartnerLogoName,
  PaymentLogoName,
  ProviderLogoName,
  SectionIconName,
  SportIconName,
  TournamentArtName,
} from './assets'

/* --- account ------------------------------------------------------------- */

/**
 * Three header and menu states exist in the design. `vip` differs from `postlogin` only by a
 * VIP badge above the username in the menu panel (node 1:6832) — the header is identical.
 */
export type AuthMode = 'prelogin' | 'postlogin' | 'vip'

/** The two full-screen sheets. Only one can be open: both cover the whole viewport. */
export type PanelId = 'menu' | 'search'

export interface UserProfile {
  username: string
  /** Node 1:6842 prints a bare number, not a slug. */
  id: string
  /** Minor units (kopiyky), so arithmetic never touches a float. */
  balanceMinor: number
}

/* --- casino --------------------------------------------------------------- */

/**
 * The four chips in the category bar. The design's fourth chip is a byte-identical copy of the
 * third — same layer name, same icon, same string `лайв Казіно` — so the fourth category is
 * ours. Recorded as a deviation in docs/tokens.md.
 */
export type CategoryId = 'popular' | 'slots' | 'live-casino' | 'crash'

export interface Category {
  id: CategoryId
  /** Stored mixed-case; the chip applies `text-transform: capitalize`, as node 1:3342 does. */
  label: string
  icon: ChipIconName
}

export interface Game {
  slug: string
  title: string
  provider: ProviderId
  categories: CategoryId[]
  /**
   * Four distinct tiles exist in the entire Figma file and the design repeats one of them
   * across all 48 cards. A game without art gets a generated gradient rather than the same
   * picture a fourth time — see GameCard.
   */
  art?: GameArtName
}

export type ProviderId = ProviderLogoName

export interface Provider {
  id: ProviderId
  name: string
}

/** One entry in the recent-wins ticker, node 1:3392 and its two siblings. */
export interface RecentWin {
  id: string
  amountMinor: number
  /** Stored whole; the ticker masks it for display, as `le****et` in node 1:3397. */
  player: string
  gameTitle: string
  art: GameArtName
  /** Node 1:3396 is green and 1:3404 / 1:3411 are orange. No rule in the design says why. */
  tone: 'up' | 'alt'
}

export interface Tournament {
  id: string
  /** Node 1:5232, uppercase in the design via CSS, stored as written. */
  title: string
  subtitle: string
  prizeMinor: number
  art: TournamentArtName
  /** ISO instant. Past deadlines roll forward — see nextCountdownEnd in format.ts. */
  endsAt: string
}

/* --- page composition ------------------------------------------------------ */

/**
 * The casino page is fifteen sections of four shapes. Keeping them as data means a new row is
 * a few lines here rather than a new component, and it is why every row in the design that
 * looks the same really is the same code.
 */
export type SectionKind = 'game-grid' | 'provider-row' | 'tournament' | 'hero' | 'ticker'

export interface SectionSpec {
  id: string
  kind: SectionKind
  /** Node 1:4318 and siblings. Absent on the hero and the ticker, which have no header. */
  title?: string
  icon?: SectionIconName
  /** The see-all pill's literal label. The design writes `Всі (120) ` with a trailing space. */
  seeAllLabel?: string
  /** Which games this row draws. Absent means the section supplies its own content. */
  filter?: GameFilter
  /** Rows are one line of six or two lines of three; both scroll horizontally past 390. */
  rows?: 1 | 2
  tournamentId?: string
  /** The Figma node this section was built from, so a review can open it directly. */
  figmaNodeId: string
}

export interface GameFilter {
  category?: CategoryId
  provider?: ProviderId
  limit?: number
}

/* --- sportsbook ------------------------------------------------------------ */

export type SportId = 'football' | 'basketball' | 'tennis'

export interface SportFilter {
  id: SportId
  label: string
  icon: SportIconName
  /** Node 1:6339 — the count badge beside the label. */
  count: number
}

/**
 * One match row, node 1:6391. The three odds are labelled `1`, `Н`, `2` — the middle one is
 * Cyrillic Н for нічия (draw), not a Latin X. Shipping X would be a translation nobody asked
 * for.
 */
export interface Match {
  id: string
  kickoff: string
  /** Node 1:6395 renders `● EP` in bold italic. Whether EP is a real broadcaster is unknown. */
  channel: string
  isLive: boolean
  home: Team
  away: Team
  odds: { home: number; draw: number; away: number }
}

export interface Team {
  name: string
  /** A coloured glyph, not an asset — the design draws 🔵 🔴 🔷 as text in nodes 1:6397+. */
  badge: string
}

export interface League {
  id: string
  sport: SportId
  /** Node 1:6387, the sport name printed above the league. */
  sportLabel: string
  name: string
  matches: Match[]
}

/* --- footer ---------------------------------------------------------------- */

export interface FooterLinkColumn {
  heading: string
  links: { label: string; href: string }[]
}

export interface FooterData {
  columns: FooterLinkColumn[]
  policies: { label: string; href: string }[]
  payments: PaymentLogoName[]
  partners: PartnerLogoName[]
  flags: { id: LanguageFlagName; active: boolean }[]
  /**
   * The design's footer carries no licence number, no regulator mark, no 18+ badge and no
   * responsible-gambling line, and its support address is the previous project's domain. The
   * owner has decided to ship it exactly as drawn. Recorded here so it is findable in code and
   * not only in a document.
   */
  supportEmail: string
}

/* --- search ----------------------------------------------------------------- */

/**
 * Four frames, one component. Which one renders is derived from the query, not stored: an
 * empty field with history shows `popular`, an empty field without it shows `empty`, a query
 * with matches shows `suggestions`, one without shows `no-results`.
 */
export type SearchState = 'empty' | 'popular' | 'suggestions' | 'no-results'
