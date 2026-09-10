# 11 — Repo inventory: what survives a from-scratch rewrite of `src/`

Repo read: `C:/Users/grosu.b/orca/workspaces/tw-platform/main` (worktree, branch `design-mkt-1/main`, HEAD `d50b16f`, tree clean, no `node_modules`).
Nothing was executed. Every claim below is from reading a tracked file; file paths are absolute-from-repo-root.

Counts: 71 tracked files under `src/`, 60 under `public/images/`, 75 under `public/review/`, 6 scripts, 6 docs.

---

## 0. What the old app is, in one paragraph

Single-route Next.js 15 static export ("Jackpot" casino, `desktop-main` 1440 + `mob main` 390, Figma file `2MyylxdZblfGnf05nQacUz`). One page (`src/app/page.tsx`) renders 15 data-driven sections; a `/dev/screens` harness lists the Figma frames; `not-found.tsx` catches the header links that have no screen. State lives in one Zustand store mirrored into the query string by `UrlStateBridge`. All content is mock JSON in `src/data/`. Money is GBP, copy is English. The new Top-Win design is mobile-only 390 and Ukrainian, so the entire content and token layer is dead weight; the build/deploy/QA layer is not.

---

## 1. KEEP AS IS

Brand-agnostic. Works for any mobile-first Next.js static-export demo with no edits, unless a caveat is named.

### 1a. Build / toolchain — keep verbatim

| File | Why it survives |
| --- | --- |
| `package.json` | Deps are all generic: next 15.5.25, react 19.1.0, zustand ^5, tailwind ^3.4.19, vitest ^5, playwright ^1.63, sharp ^0.35.4, eslint 9 + eslint-config-next. Scripts (`dev`/`build`/`build:check`/`test`/`lint`) are brand-free. **Only Jackpot-ish token: `"name": "tw-platform"` (line 2)** — cosmetic, no code reads it. |
| `tsconfig.json` | Stock Next config + `@/*` → `./src/*` + `.next-build/types/**/*.ts` in `include` (pairs with `build:check`). Nothing brand-specific. |
| `postcss.config.mjs` | 6 lines, tailwindcss + autoprefixer. |
| `vitest.config.mts` | `environment: 'node'`, `include: ['src/**/*.test.ts']`, `@` alias duplicated from tsconfig. Config survives; the *tests it runs* do not (see REWRITE). |
| `eslint.config.mjs` | `next/core-web-vitals` + `next/typescript`, ignores, and the raw-hex ban scoped to `src/components/**`. The glob and the message reference `docs/tokens.md`; if that doc is renamed the message needs a one-word edit. Rule itself is design-system-agnostic and worth keeping for Top-Win. |
| `next.config.ts` | See Q2 below. Only the literal `'/tw-platform'` on line 10 is repo-specific; everything else (distDir switch, `NEXT_PUBLIC_BASE_PATH`, export/images/trailingSlash under `GITHUB_PAGES`) is reusable as-is. |
| `.github/workflows/pages.yml` | Gate order (tsc → eslint → test → build → a11y → upload) is generic. Four *executable* lines hard-code the repo name (59, 62, 68, 69) — see Q2. Node 24, `channel: 'chrome'` preinstalled on ubuntu-latest, `python3 -m http.server 4173`, `.nojekyll`. The deliberate repeated `curl -sf` on line 68 (guards against `a11y.mjs` scoring an unreachable page as zero violations) is a real bug guard — do not "simplify" it away. |
| `.gitignore` | Already covers `.next-build/`, `.next-export/`, `out/`, `.review-tmp/`. Keep. |
| `scripts/build-check.mjs` | 21 lines, zero brand references. Spawns `npx next build --turbopack` with `NEXT_DIST_DIR=.next-build`. Portable to Windows by design (that is why it spawns rather than inlines the env var). Keep verbatim. |
| `public/robots.txt` | 4 lines, `User-agent: * / Disallow: /`, comment says "unreleased design shown to a client". No brand name. Keep verbatim. |
| `.claude/settings.json`, `.claude/skills/**`, `.caveman/config.json` | Tooling config, not app code. Out of scope of a `src/` rewrite. |

### 1b. The five scripts — keep the script, rewrite the hard-coded list inside it

This is the part that matters. Each script is worth keeping; each one carries a Jackpot-specific list that a Top-Win rebuild must replace. Exact locations:

#### `scripts/shot.mjs` (84 lines) — cleanest of the five
- **Hard-coded to Jackpot: essentially nothing executable.** No route list, no query params, no node ids, no selectors.
- **Must change:** default viewport `Number(wRaw ?? 1440)` / `Number(hRaw ?? 1000)` (lines 23–24). Top-Win is mobile-only 390; the default should be `390 × 844`. Today an argument-less call silently shoots a desktop viewport that the new design does not have.
- **Comment-only Jackpot references** (harmless, but stale after the rewrite): line 33 "the provider marquee runs forever"; line 75 "the footer's payment, partner and flag logos"; line 62 example selector `section[aria-label="…"]`.
- Generic and worth keeping: `channel: 'chrome'` (Playwright's bundled Chromium does not download in this environment), `reducedMotion: 'reduce'`, `settleLazyImages()` walk, pageerror/console-error capture, element-vs-scrollY targeting, JSON result line.

#### `scripts/review.mjs` (151 lines) — the most Jackpot-bound
Everything from line 90 down is a Jackpot script. Precisely:

1. **Deep-link query parameters** (the app contract, invented by `UrlStateBridge.tsx`): `?panel=balance`, `?panel=personalInfo`, `?auth=prelogin`, `?auth=vip`, `?auth=prelogin&panel=jackpotMenu`, `?auth=postlogin&panel=jackpotMenu`, `?auth=vip&panel=jackpotMenu`, `?pq=xyzgame`. Four param names total: `auth`, `panel`, `q`, `pq`. Lines 133–146.
2. **State/route list**: 15 `shot()` calls, names `desktop-main`, `mob-main`, `mobile-nav`, `search-1-popular-recent`, `search-2-suggestions`, `search-3-no-results`, `panel-balance`, `panel-personal`, `auth-prelogin`, `auth-vip`, `mob-menu-prelogin`, `mob-menu-postlogin`, `mob-menu-vip`, `providers-no-results-mob`, `providers-no-results-desktop`. Lines 105–146. There is only ever one route (`BASE`) — states are query strings, not paths.
3. **Viewport list**: `1440×1000`, `1440×900`, `1440×700`, `390×844`, `390×900`. Nine of the fifteen shots are desktop. For a 390-only Top-Win, ten of these disappear.
4. **A DOM selector**: `page.getByRole('button', { name: /search games/i }).locator('visible=true').first()` (lines 97–100). Matches the accessible name of `CategoryNavBar`'s fake search field. Dead the moment that component is gone; the Ukrainian equivalent will not match `/search games/i`.
5. **Two typed query strings**: `'swe'` (line 118 — chosen because it matches three Sweet Bonanza titles in `games.json`) and `'xyzzy'` (line 128). Both depend on the old catalogue. A Ukrainian catalogue needs a new pair, and the comment on lines 118–119 documents exactly the trap (`'zeu'` matched nothing and made a correct empty state look like a bug).
6. **Overflow probe** `document.querySelectorAll('section[aria-label]')` (line 75) — assumes the app labels its sections. Cheap contract; worth re-honouring in the rewrite rather than rewriting the probe.
- Generic and worth keeping: the dual-motion loop `MOTION = [['reduce','reduce'],['no-preference','motion']]` (lines 29–32, added because the marquee only overflowed in the mode nobody screenshotted), `settleLazyImages`, the `width <= 390` overflow measurement, the `findings` JSON with per-state `errors`/`failure`.

#### `scripts/a11y.mjs` (99 lines)
- **Hard-coded: the `STATES` array, lines 30–40.** Nine states, mobile-first by policy. Paths: `/`, `/?panel=jackpotMenu`, `/?auth=prelogin&panel=jackpotMenu`, `/?pq=xyzgame`, `/?panel=balance`, `/?panel=personalInfo`, `/?q=swe`. Viewports `390×844` (×4) and `1440×1000` (×5). Same four query-param names as review.mjs and the same `'swe'` catalogue dependency.
- **Also pinned**: axe-core CDN URL `https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js` (line 28), injected via `addScriptTag` rather than adding `@axe-core/playwright` as a dependency. Version-pinned on purpose. Not brand-specific; note that it requires network access at run time.
- Generic and worth keeping: the impact table printer, `process.exit(blocking ? 1 : 0)` on any critical/serious, `writeFileSync(OUT/a11y.json)`, per-state failure capture. The exit code is what `.github/workflows/pages.yml` line 69 gates on.

#### `scripts/clean-svg.mjs` (171 lines)
- **Hard-coded to the Figma *export process*, not to the Jackpot brand — but calibrated on the Jackpot asset set.**
  - Rule 1: literal fill `#1E1E1E` (line 117) — Figma's canvas grey, tool-level not brand-level. Safe.
  - Rule 2: `OUTSIDE = 1000` (line 42) — coordinate distance outside the viewBox. Tool-level.
  - Rule 3: `FURNITURE_SCALE = 3` (line 61) — **this is the calibrated number.** The comment states it was measured across "all 62 SVGs under public/images" of *this* export, where kept shapes topped out at 1.63× the viewBox (the flag ring at 39.142 in a 39 box, gb.svg's 44.694 gradient backing, the 110.833 provider disc, the 160×52 payment chip) and removed shapes started at 2.7× (the 1440×7453 page rect in 27 files, the 1244×138 footer panel, slots.svg's 1280×78 capsule and 117×54 chip). Those measurements are of the Jackpot export. **Run `--dry` on the Top-Win export before trusting `3`**, and re-verify that nothing legitimate in the new set sits above 3×.
  - `ROOT = process.argv[2] ?? 'public/images'` (line 38) — fine.
  - Comments name Jackpot files (`bonus-buy.svg`, `slots.svg`, `drops-wins.svg`, `gb.svg`) and Jackpot hexes (`#0F121D`, `#151624`) as evidence. Rule 3 is geometric and does not read those hexes, so nothing breaks; the comments just go stale.
- Verdict: keep the script; treat `FURNITURE_SCALE` as a knob to re-measure, not a constant to trust.

#### `scripts/to-webp.mjs` (87 lines)
- **Hard-coded:** `QUALITY = 90` (line 25), justified as "below ~85 the hero's navy gradient starts to band" — a Jackpot-specific measurement. Harmless default; re-check on the Top-Win hero.
- `ROOT = process.argv[2] ?? 'public/images'` (line 22). The `--dry` flag, the `after >= before` guard (keeps the PNG when WebP is bigger), and `effort: 6` are all generic.
- **Stale-path trap:** the closing message (lines 82–85) tells the operator that references live in `src/lib/assets.ts` and `src/data/*.json` and that `src/lib/__tests__/assets.test.ts` fails until they are updated. All three paths are in the REWRITE list. If the rewrite renames them, this message becomes a wrong instruction printed by a passing script.
- Never point either of the last two scripts at `public/review` (both are already guarded by defaulting to `public/images`; `to-webp.mjs` says so in its header comment).

---

## 2. REWRITE

Exists, needed, but 100% Jackpot. Every one of these is content or tokens for the old design.

### 2a. Tokens and global CSS
| File | What is Jackpot in it |
| --- | --- |
| `tailwind.config.ts` (108 lines) | All 47 colour tokens, all 8 border tokens. `fontFamily`: Inter / Bricolage Grotesque / Roboto Flex. `spacing`: `page-x: 80px`, `card-w: 203px` (GameCard node 1:2602), `card-h: 264px`. `maxWidth`: `content 1280px`, `shell 1440px` — desktop geometry, meaningless for a 390-only build. `screens.mobile: {max: '767px'}` — the whole desktop/mobile split disappears when there is no desktop. Token names cite Jackpot Figma nodes (1:5687, 13:2340, 13:2491, 13:2362, 13:2342, 13:2325). |
| `src/app/globals.css` (249 lines) | The entire `:root` token block, transcribed from Jackpot UI Kit nodes 1:5199 / 1:4745. Includes the AA-corrected derivations (`--blue #006ee6` from Figma's `#007AFF`, `--blue-text #479fff`, `--text-legal #7f7a85`) and one-off tokens tied to rebuilt Jackpot menu nodes. Also `--mobile-nav-h: 84px` (node 1:8235), the `@media (max-width:767px)` overlay override, and the `marquee-left`/`marquee-right` keyframes for the Leading Providers row. **Structure worth copying** (single `:root`, one value per token, node cited beside every non-kit colour, reduced-motion pause rather than `animation: none` — the latter is a real fixed bug: `animation:none` widened the document to 3307px at 390). **Values: all replaced.** |
| `docs/tokens.md` (26 KB) | The name-by-name Figma → CSS mapping for Jackpot. Both `tailwind.config.ts` and `eslint.config.mjs` point at it by name. Needs a Top-Win equivalent at the same path or both references edited. |

### 2b. App shell
- `src/app/layout.tsx` — three `next/font/google` families (Inter, Roboto_Flex, Bricolage_Grotesque, Figma node 1:5325), `title: 'Jackpot'`, description "built from the Jackpot Figma file", `viewportFit: 'cover'`, `<html lang="en">`. The `lang` must become `uk`. The `robots: {index:false, follow:false}` and `viewportFit` lines are reusable.
- `src/app/page.tsx` (177 lines) — the whole homepage composition, the desktop/mobile twin logic (`rendersTheSame`, `DESKTOP_ONLY`/`MOBILE_ONLY`), and the vertical-rhythm comment block quoting absolute y offsets from frames 1:2431 / 21:2896. A 390-only rebuild deletes half of this on structure alone.
- `src/app/not-found.tsx` — English copy, "Jackpot — design review", links to `/dev/screens`. Keep the *idea* (header links with no screen behind them land somewhere honest), rewrite the copy.
- `src/app/dev/screens/page.tsx` (424 lines) — renders `src/lib/screens.ts`. Same idea, entirely new content. Also holds one of the 45 `tw-platform` occurrences (line 363).
- `src/app/favicon.ico` (25931 bytes) — Jackpot mark. **Note: the favicon is in `src/app/`, not in `public/`.**

### 2c. Every component — 41 files, ~278 KB, all Jackpot
`src/components/**`: `UrlStateBridge`, `cards/` (GameCard, PromoBanner, PromoBannerMobile, ProviderCard, RecentWinItem), `layout/` (CategoryNavBar, Footer, FooterBottom, FooterLinkColumn, Header, HeaderNavMenu, HeaderPostlogin, HeaderPrelogin, HeaderVip, HeroBanner, MobileNavBar, MobileShell, RecentWinsTicker), `panels/` (BalancePanel, JackpotMenu, PersonalInfoPanel), `primitives/` (Badge, Button, CategoryPill, Icon, IconButton, Panel, SearchInput, Sheet), `search/` (ProviderSearch, SearchNoResults, SearchOverlay, SearchPopularRecent, SearchSuggestions), `sections/` (CategoryView, ContentRow, GameGrid, PromoRow, ProviderRow, SectionHeader, SectionRenderer).
Largest: `MobileNavBar.tsx` 28.3 KB / 369 lines, `JackpotMenu.tsx` 20.0 KB / 408 lines, `SearchOverlay.tsx` 16.1 KB / 379 lines, `Panel.tsx` 13.7 KB / 336 lines.
The `primitives/` eight are the only plausible *pattern* donors (Sheet's `clearsNavBar`, Panel's focus trap, Icon's `next/image` wrapper) — but every one carries Jackpot tokens and node ids, so they are a read-and-reimplement, not a copy.

### 2d. Data
`src/data/*.json` — all eight files, all English/GBP Jackpot content: `categories.json` (4 tabs), `footer.json` (144 lines: payment logos, partner logos, link columns, legal), `games.json` (11.9 KB, ~60 games incl. Sweet Bonanza / Gates of Olympus), `jackpots.json`, `providers.json`, `recentWins.json`, `tournaments.json` (tournaments + promos with Figma clock `endsAt`), `user.json` (profile, vipProfile, balances keyed by AuthMode).

### 2e. `src/lib/` — mixed, split it explicitly

| File | Verdict |
| --- | --- |
| `src/lib/sections.ts` (241 lines) | REWRITE. 15 `SectionSpec` entries × 2 viewports, every one carrying a Jackpot `figmaNodeId` (1:2592 … 1:3635 desktop, 1:5882 … 1:6499 mobile), `SEE_ALL_TOTAL = 206`. The **pattern** (homepage-as-data, one renderer, `selectGames(filter, games)` as the single row query) is the best idea in the repo and should be carried across. The data is dead. |
| `src/lib/screens.ts` (123 lines) | REWRITE. 13 screen entries, all Jackpot node ids, plus the archaeology of ids that stopped resolving when Figma frames were rebuilt (`1:5720` → `21:2896`, `1:8260` → `13:2307`, `1:8503/1:8504` → `13:2519`). New file key, new nodes. |
| `src/lib/assets.ts` (159 lines) | **Split.** `BASE_PATH` + `withBase()` (lines 25–34) are the load-bearing generic part — keep them verbatim, they exist because Next's `basePath` does not rewrite an image `src`. Everything else — `gameThumb`, `providerLogo`, `sectionIcon`, `LOGO`, `GAMES_WITH_ART` (3 slugs), `PROVIDERS_WITH_LOGO` (5 ids), `HERO_BONUS`, `HERO_BONUS_MOBILE`, `PROMO_BANNERS`, `PAYMENT_LOGOS` (7), `PARTNER_LOGOS` (6), `LANGUAGE_FLAGS` (10 codes), `SEARCH_ICON`, `SEARCH_BUTTON_ICON` — is a Jackpot asset manifest. Also cites the old Figma file key `2MyylxdZblfGnf05nQacUz`. |
| `src/lib/types.ts` (235 lines) | REWRITE. `CategoryId`, `GameTag` (10 values), `IconName` (21 values), `Game`, `Provider`, `RecentWin`, `Jackpot`, `Tournament`, `PromoBannerData`, `Category`, `UserProfile`, `Balance`, `AuthMode`, `Footer*`, `GameFilter`. All shaped to the Jackpot design. `GameFilter` and the closed-union-`IconName` trick are worth reusing as patterns. |
| `src/lib/data.ts` (49 lines) | REWRITE. Pure re-export/cast layer over `src/data/*.json`. Trivial to rebuild; the **rule it enforces** (one place where JSON meets types, so fifteen `as Game[]` casts cannot disagree) is worth keeping. |
| `src/lib/format.ts` (141 lines) | REWRITE. Hard-locked to `en-GB` + GBP: `formatGbp` "£5,500.00", `formatGbpSuffix` "41.04 GBP", `formatGbpCompact` "£1.25M". Top-Win is Ukrainian — currency, locale and separators all change. **Keep unchanged:** `nextCountdownEnd` / `countdownEndIso` / `formatCountdown` / `formatCountdownClock` / `maskUsername` are brand-free logic, and the `PERIOD_MS = 24h` roll-forward plus the `from` parameter (purity, so server and client format the same string) are both fixes for real shipped bugs — a static export freezes any build-time clock at "00:00:00". |
| `src/lib/search.ts` (95 lines) | REWRITE, but only partly. `normalize()` strips accents via NFD and removes apostrophes — **that specific behaviour is Latin-alphabet reasoning** (`'gonzos'` → `Gonzo's Quest`) and the `.replace(/[^a-z0-9]+/g, ' ')` class **will destroy Cyrillic input entirely**. This is a real defect for a Ukrainian catalogue, not a cosmetic rewrite. `popularSearches` (8 English titles) and `defaultRecentSearches` (4) are content. The ranking ladder (title-prefix 0, word-boundary 1, contains 2, provider-prefix 3, provider-contains 4, stable within band) is a good pattern to keep. |
| `src/lib/useCountdown.ts` (37 lines) | **Closest thing to KEEP in `src/`.** Zero brand references, zero Jackpot tokens, formatter injected as a parameter. Copy it across unchanged if the new design has any countdown; delete it if not. |
| `src/store/useAppStore.ts` (161 lines) | REWRITE. Zustand store shaped to Jackpot: `AuthMode` × 3, `PanelId` = balance / personalInfo / jackpotMenu, `activeCategory: CategoryId`, `providerQuery`, `RECENT_LIMIT = 4`. The mutual-exclusion discipline (opening any one overlay closes the other two; switching tab drops a committed search) is a click-path lesson worth re-encoding. |
| `src/components/UrlStateBridge.tsx` (83 lines) | REWRITE. Param names `auth` / `panel` / `q` / `pq` and their allowed values are the Jackpot state machine — and they are the contract `review.mjs` and `a11y.mjs` deep-link against. **Whatever the new param set is, it must be decided before the QA scripts are rewritten, not after.** The mechanism (`replaceState` not router, read-once-on-mount, URL is a mirror never a source, and the ordering comment on lines 46–48) is generic and correct. |

### 2f. Tests — all six rewrite
`src/lib/__tests__/`: `assets.test.ts` (194 lines — asserts every image the app can ask for exists on disk, cross-checking `footer.json`/`games.json`/`providers.json`/`tournaments.json` against `public/images`; **the most valuable test in the repo and the pattern must survive**), `sections.test.ts` (95), `search.test.ts` (90 — asserts `'swe'` returns the three Sweet Bonanza titles), `format.test.ts` (56 — asserts `'£5,500.00'`), `countdown.test.ts` (133 — pins `from` to `2026-09-09T12:00:00Z`, asserts `'08h : 12m : 36s'`), `screens.test.ts` (39 — unique ids, `/^\d+:\d+$/` node ids, viewport ∈ {1440, 390}).
`screens.test.ts`'s viewport assertion hard-codes `1440` and `390`; on a 390-only rebuild it must drop 1440 or it will pass vacuously.

### 2g. Docs and README
`README.md` (Jackpot demo, deep-link table, 4 `tw-platform` URLs), `docs/tokens.md`, `docs/build-plan.md`, `docs/audit-session-8.md`, `docs/next-session.md` (64.5 KB of Jackpot session history), `docs/start-here.txt`. `docs/install-skills-in-a-repo.md` is the only one that is not about the Jackpot design — it is a portable prompt for installing this skill set elsewhere, and is closer to KEEP.
`CLAUDE.md` is a REWRITE in the same sense: the *rules* (build/dev collision, worktree tsc trap, mobile-first, a11y gate, skill precedence) survive; every Jackpot-specific incident cited as evidence does not.

---

## 3. DELETE

No counterpart in the new design.

| Path | Size | Why |
| --- | --- | --- |
| `public/images/**` | 60 files | Entire Jackpot artwork set: `games/` (3 webp), `hero/` (5 webp incl. `welcome-bonus.webp` / `welcome-bonus-mobile.webp`), `icons/` (21 svg — bonus-buy, crash, drops-wins, egypt, instant, jackpots, live-casino, lottery, megaways, new, popular, providers, recommended, slots, tournaments, wheel, plus close/chevron-down/plus/search/search-blue/search-btn), `providers/` (5 svg), `payments/` (7 svg), `partners/` (5 svg + 2 webp), `flags/` (10 svg), `logo.svg`. None of it is Top-Win. |
| `public/review/**` | 75 files, `index.html` alone is 148 KB | The Jackpot design-vs-implementation report: 26 figma-vs-app screenshot pairs under `cmp/`, plus `hero.png`, `popular.png`, `providers.png`, `card-real.png`. **Do not regenerate or reprocess — CLAUDE.md forbids pointing `clean-svg.mjs`/`to-webp.mjs` at it because it is the report itself.** For the rebuild it is dead weight; archive it out of the repo rather than editing it. |
| `src/app/dev/screens/page.tsx` | 17.4 KB | Listed under REWRITE if a Top-Win screen registry is wanted; DELETE if not. It is a review-harness convenience, not product. |
| `src/app/favicon.ico` | 25.9 KB | Jackpot mark. |
| `src/components/panels/JackpotMenu.tsx` | 20.0 KB | Named for and shaped to a Jackpot frame that no longer exists even in the old Figma file (rebuilt as 13:2307 / 13:2519). Nothing in a Top-Win sportsbook+casino design maps to it 1:1. |
| `docs/audit-session-8.md`, `docs/next-session.md` | 19.2 KB + 64.5 KB | Session logs of the Jackpot build. Historical only. |

Nothing else is a clean DELETE — every remaining file is either KEEP or REWRITE.

---

## 4. The three specific questions

### Q1 — Does `eslint.config.mjs` really reject raw hex colours under `src/components`? **Yes.**

`eslint.config.mjs` lines 23–47, quoted verbatim:

```js
  {
    // Colour discipline. The Figma file has no variables, so docs/tokens.md plus the
    // Tailwind theme are the only mapping between design and code. A raw hex in a
    // component silently forks that mapping and cannot be re-themed, so reject it here
    // rather than hoping review catches it. Token definitions live in
    // src/app/globals.css and tailwind.config.ts, which are outside this glob.
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-fA-F])/]",
          message:
            "No raw hex colours in components. Use a Tailwind token (see docs/tokens.md); add new values to globals.css and tailwind.config.ts.",
        },
        {
          selector:
            "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-fA-F])/]",
          message:
            "No raw hex colours in components. Use a Tailwind token (see docs/tokens.md); add new values to globals.css and tailwind.config.ts.",
        },
      ],
    },
  },
```

Notes: it is `error`, two selectors (plain string literals and template-literal chunks), scoped to `src/components/**/*.{ts,tsx}` only — `src/app/globals.css` and `tailwind.config.ts` are deliberately outside the glob so tokens can be *defined*. It does not catch hex in `src/lib/`, `src/data/`, or `src/app/*.tsx`. It does not catch `rgb()`/`hsl()` literals. CI runs it as `npx eslint src --max-warnings=0` (`pages.yml` line 37). **Keep this rule for Top-Win.**

### Q2 — `next.config.ts`, `GITHUB_PAGES`, `basePath`, and how many places repeat `"tw-platform"`

What `next.config.ts` does, exactly (43 lines):

```ts
const isPages = process.env.GITHUB_PAGES === 'true'
const basePath = isPages ? '/tw-platform' : undefined
```

Then, unconditionally:
- `distDir: process.env.NEXT_DIST_DIR ?? '.next'` — lets `build:check` build into `.next-build` so a running `next dev` cannot have its `.next` corrupted.
- `env: { NEXT_PUBLIC_BASE_PATH: basePath ?? '' }` — exported to the client because Next applies `basePath` to links and its own bundles **but not to an image `src`**; `src/lib/assets.ts` reads this var and prefixes every `public/` path itself.

And only when `isPages`:
- `output: 'export'`
- `basePath` (`'/tw-platform'`)
- `images: { unoptimized: true }` (no server exists to resize)
- `trailingSlash: true` (Pages serves `/route/` as `/route/index.html`)

So locally `basePath` is `undefined`, `NEXT_PUBLIC_BASE_PATH` is `''`, output is a normal dev/build — deliberate, because turning it on locally moves the dev server to `localhost:3000/tw-platform` and breaks every screenshot script, which address the root.

**Occurrence count of the literal string `tw-platform`, across all tracked files: 45.**

| File | Occurrences | Load-bearing? |
| --- | --- | --- |
| `docs/next-session.md` | 9 | no (prose) |
| `docs/start-here.txt` | 7 | no (prose) |
| `.github/workflows/pages.yml` | 6 | **4 yes** (lines 59, 62, 68, 69 — `cp -r out a11y-site/tw-platform`, two `curl` probes, and the `a11y.mjs` base URL); lines 4 and 50 are comments |
| `CLAUDE.md` | 6 | no (prose) |
| `docs/install-skills-in-a-repo.md` | 5 | no (prose) |
| `README.md` | 4 | no (prose/links) |
| `next.config.ts` | 3 | **1 yes** (line 10, the `basePath` literal); lines 4 and 6 are comments |
| `package-lock.json` | 2 | no (the package's own `name`) |
| `package.json` | 1 | no (`"name"`, cosmetic) |
| `src/app/dev/screens/page.tsx` | 1 | no (display text, line 363) |
| `src/lib/assets.ts` | 1 | no (comment, line 18) |

**Five executable occurrences across two files** (`next.config.ts:10` plus `pages.yml:59,62,68,69`). They must agree with each other and with the GitHub repo name; there is no shared constant. If the Top-Win rebuild lives in a repo with a different name, those five are the edit — everything else is prose.

### Q3 — Does `public/` contain anything that is NOT Jackpot artwork?

`public/` has exactly three entries: `images/`, `review/`, `robots.txt`.

- **`public/robots.txt` — yes, brand-agnostic.** 192 bytes, 4 lines, no brand name:
  ```
  # This is an unreleased design shown to a client for review, not a public site.
  # The GitHub Pages URL is shareable, but it should not turn up in search results.
  User-agent: *
  Disallow: /
  ```
  KEEP verbatim. It pairs with `metadata.robots = { index: false, follow: false }` in `src/app/layout.tsx`.
- **`public/review/` — 75 files, the design-vs-implementation report.** `index.html` (148 KB, `<title>Jackpot — design vs implementation</title>`, its own copy of the Jackpot tokens inlined in a `<style>` block), `cmp/` with 26 `figma-*.png` / `app-*.png` pairs, plus `hero.png`, `popular.png`, `providers.png`, `card-real.png`. Not artwork — it is a *report* — but it is entirely Jackpot. DELETE/archive for the rebuild; never let `clean-svg.mjs` or `to-webp.mjs` touch it.
- **`public/images/` — 60 files, all Jackpot artwork.** DELETE.
- **No fonts.** `public/fonts` does not exist. All three families come from `next/font/google` in `src/app/layout.tsx` (Inter, Roboto_Flex, Bricolage_Grotesque) and are fetched/self-hosted by Next at build time. A Ukrainian design needs `subsets` extended beyond `['latin']` — currently all three declare `subsets: ['latin']` only, which will not render Cyrillic.
- **No favicon in `public/`.** The favicon is `src/app/favicon.ico` (25931 bytes), picked up by the App Router convention.
- **No `manifest.json`, no `sitemap.xml`, no `.nojekyll`** in the repo — `.nojekyll` is created at deploy time by `pages.yml` line 81 (`touch out/.nojekyll`).

---

## 5. UNKNOWN — questions for the owner

1. Does Top-Win need a `/dev/screens` registry at all, or was that a Jackpot-review-only convenience? It decides whether `src/lib/screens.ts` + `src/app/dev/screens/page.tsx` + `screens.test.ts` are REWRITE or DELETE.
2. What are the new deep-link query parameters? `review.mjs` and `a11y.mjs` cannot be rewritten until the new `UrlStateBridge` contract exists. Which states must be linkable — is there still an auth-mode switch, or is Top-Win single-state?
3. Will the new repo keep the name `tw-platform` and the URL `https://design-mkt-1.github.io/tw-platform/`? If not, five executable occurrences need editing (`next.config.ts:10`, `pages.yml:59,62,68,69`).
4. Does Top-Win have any desktop frames at all? If it is strictly 390, then `screens.mobile: {max:'767px'}`, `maxWidth.shell/content`, `spacing.page-x`, `page.tsx`'s desktop/mobile twin logic, and 10 of the 15 `review.mjs` shots all disappear rather than being rewritten — a much bigger deletion than a rewrite.
5. Currency and locale for Top-Win: which currency replaces GBP, and is the locale `uk-UA`? `src/lib/format.ts` hard-codes `en-GB`/GBP in two `Intl.NumberFormat` instances plus a literal `£` in `formatGbpCompact`.
6. Is `public/review/` to be preserved as a historical artifact in-repo, moved out, or deleted? It is 75 files and CLAUDE.md explicitly protects it byte-for-byte, so deleting it needs an owner decision, not an agent's.
7. `docs/tokens.md` is named inside both `tailwind.config.ts` and the eslint error message. Same path for the Top-Win token map, or a new name (and therefore two edits)?

## 6. Things measured vs things reasoned

- **Measured** (read directly from files): every file path, byte size and line count; the eslint rule text; the `next.config.ts` logic; the 45 `tw-platform` occurrences and their per-file split; the contents of `public/`; the absence of `public/fonts`; the location of the favicon; every hard-coded list inside the five scripts, with line numbers.
- **Reasoned, not measured**: that `normalize()` in `src/lib/search.ts` will break on Cyrillic (the `[^a-z0-9]+` class provably strips non-ASCII, but no Ukrainian input was run through it here); that `FURNITURE_SCALE = 3` may mis-fire on the Top-Win export (the 1.63×/2.7× gap is quoted from the script's own comment about the *Jackpot* set — the Top-Win set has not been measured); that `subsets: ['latin']` will not render Cyrillic (standard `next/font` behaviour, not verified in a browser here). No build, test, lint or script was executed — this worktree has no `node_modules`, and CLAUDE.md forbids running checks from it.
