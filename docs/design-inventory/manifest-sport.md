# Manifest — sport area (frame `1:5994`, plus FAB `1:6484`)

File key `s2CqwGqe0O0FcALhBNlTRe`. Target dir
`C:/Users/grosu.b/orca/workspaces/tw-platform/main/public/images/sport/`.

Figma MCP calls spent: **1** (`download_assets` on `1:6089`, the league carousel).
Everything else came from URLs already recorded in `07-sport.md` §11.1 and
`23-gap-sport-chrome.md` §8 — every one of those URLs was still alive.

Every file below was verified after download: SVGs start with `<svg`, PNGs start with the
bytes `89 50 4E 47`. No 0-byte and no HTML-error files were kept.

---

## 1. Downloaded — 16 files

| file | node id(s) | Figma layer name | fmt | bytes | source |
| --- | --- | --- | --- | --- | --- |
| `league-badge-europa-league.svg` | `1:6091` `1:6121` `1:6151` `1:6181` `1:6211` `1:6241` `1:6271` `1:6301` | `Europa_League_2021.svg 1 [Vectorized]` | svg | 16858 | fresh call `1:6089` (identical to the recorded `1:6091` URL) |
| `chevron-down-more-leagues.svg` | `1:6331` | `chevron-down` | svg | 292 | recorded |
| `chevron-right-link-chip.svg` | `1:6087` `1:6380` | `chevron-right` | svg | 309 | recorded |
| `icon-football.svg` | `1:6335` `1:6385` `1:6435` | `football_1165187 1` | svg | 3165 | recorded |
| `icon-basketball.svg` | `1:6342` | `ball_11403030 1 → Group` | svg | 4525 | recorded |
| `icon-tennis.svg` | `1:6356` | `racket_5102924 1` | svg | 3379 | recorded |
| `icon-calendar.svg` | `1:6370` | `calendar_4339139 1 → Layer 2` | svg | 7078 | recorded |
| `icon-live-stream.svg` | `1:6013` | `stream_8191668 1` (Live tab) | svg | 3424 | recorded |
| `icon-betslip-ticket.svg` | `1:6485` | `ticket` (bet-slip FAB `1:6484`) | svg | 1117 | recorded |
| `icon-search-header.svg` | `1:6005` `1:101` | `search_header.svg` | svg | 1638 | recorded |
| `icon-balance-chip.svg` | `1:97` | `tabs_4511814 (1) 1 → Group` | svg | 1230 | recorded |
| `bonus-slide-welcome-photo.png` | `1:6031` | `enhanced_…6krli0pce31dlxk4zab7_1 (1) 1` | png | 4557445 | recorded (`23-gap` URL) |
| `bonus-slide-welcome-glow.svg` | `1:6032` | `Ellipse 4` | svg | 664 | recorded (`23-gap` URL) |
| **`casino-slide-zeus-character.png`** | `1:6061` `1:6078` | `Gates of Olympus_Game Art_2878x5319_Character_25` (parent layer `зевс`) | png | 638241 | recorded (`23-gap` URL) |
| **`casino-slide-blur-blob.png`** | `1:6059` | `enhanced_…xrq8r4aiizudy6f6mw29_1 2` | png | 1157722 | recorded (`23-gap` URL) |
| **`casino-slide-lens-flare.png`** | `1:6062` `1:6063` `1:6079` `1:6080` | `Lens Flare 2 8` / `Lens Flare 2 9` | png | 1990594 | recorded (`23-gap` URL) |

The three **bold** rows are the casino artwork flagged in the brief — see §3.

## 2. Layer-name → file-name mapping (machine names only)

| Figma layer name | file |
| --- | --- |
| `Europa_League_2021.svg 1 [Vectorized]` | `league-badge-europa-league.svg` |
| `football_1165187 1` | `icon-football.svg` |
| `ball_11403030 1` | `icon-basketball.svg` |
| `racket_5102924 1` | `icon-tennis.svg` |
| `calendar_4339139 1` | `icon-calendar.svg` |
| `stream_8191668 1` | `icon-live-stream.svg` |
| `tabs_4511814 (1) 1` | `icon-balance-chip.svg` |
| `enhanced_…6krli0pce31dlxk4zab7_1 (1) 1` | `bonus-slide-welcome-photo.png` |
| `enhanced_…xrq8r4aiizudy6f6mw29_1 2` | `casino-slide-blur-blob.png` |
| `Gates of Olympus_Game Art_2878x5319_Character_25` / `зевс` | `casino-slide-zeus-character.png` |
| `Lens Flare 2 8` / `Lens Flare 2 9` | `casino-slide-lens-flare.png` |

## 3. The two questions the brief asked

### 3.1 The eight league tiles are ONE badge repeated — placeholder, not varied content

**Measured, two independent ways.**

1. `download_assets` on `1:6089` (the whole League-carousel row: 8 tiles + "More leagues")
   returned exactly **two** `svgAssets` for the entire subtree — one 16858-byte badge and
   one 292-byte chevron. Figma emits one asset per distinct vector; eight different badges
   would have produced eight entries. `svgAssetsTruncated: false`, so nothing was cut.
2. The 16858-byte file is **byte-identical** (sha256 `e88d7caa…607b`) to the badge
   downloaded from tile 1's own recorded URL (`1:6091`).
3. The row export `1:6089` renders as eight visually identical UEFA Europa League badges.

So `07-sport.md` UNKNOWN #3 is closed: the "node ids 30 apart implies distinct artwork"
inference was **wrong**. It is the same badge eight times.

**Consequence for the owner's decision:** the demo cannot show varied leagues from Figma —
there is no second badge in the file to export. Varied league logos have to come from
somewhere else (sourced by hand, or the strip is built from a different design).

### 3.2 Slides 3 and 4 are casino artwork — harvested, flagged

`1:6046` and `1:6064` sit in the sport carousel track `1:6029` at x=704 and x=1066, i.e.
never visible at a 390px viewport. `23-gap-sport-chrome.md` §8 already measured their
content: English copy, **£5,500 / 250 FREE SPINS / Play Now / 20X WAGER**, on a dark blue
gradient. That is a casino slot promo inside a Ukrainian sportsbook carousel.

The three `casino-slide-*.png` files are exported and usable, but **do not place them on the
sportsbook page without a decision from the designer.** They read as leftovers pasted from
the casino page.

## 4. Not assets — text glyphs, nothing to download

Confirmed by `get_design_context` in the earlier pass (`07-sport.md` §11.3). These are
characters inside text nodes: no node of their own, no fill, no URL.

| what the brief asked for | what it actually is |
| --- | --- |
| team badges | `🔵` U+1F535, `🔴` U+1F534, `🔷` U+1F537 inside the team-name text (`1:6398`, `1:6399`, …), Roboto Medium 12px, two literal spaces after the emoji |
| live indicator | `1:6395` is one text run: `●` U+25CF + space + ASCII `EP`, Roboto Bold Italic 10px `#f45b24` |
| star / favourite glyph | `★` U+2605 — nav Favorites `1:6024` at Inter 25px `#1677e8`; match rows `1:6396` `1:6417` `1:6446` `1:6467` at Inter 14px `#758098` |
| league emblem in the card header | `♕` U+2655, `1:6389`, Inter 12px `#758098` |
| gifts button | `🎁` U+1F381, `1:6026`, Inter 22px |

Implement these as characters, not as files. An emoji font dependency is the trade — the
design has no vector for them.

## 5. Deduplication actually performed

Six recorded URLs resolved to three files. Verified by sha256, not assumed:

- `1:6385` and `1:6435` (football, both league-card headers) — identical to each other and
  to `1:6335` apart from a generated `clip-path` id (`clip0_0_4` vs `clip0_0_20`). One file.
- `1:6087` ("Всі ліги") and `1:6380` ("Всі події") chevrons — byte-identical. One file.
- `1:6005` (pre-login) and `1:101` (post-login) search icons — byte-identical. One file.
  They differ only in *rendered* size: 40x40 cropped by a 36px circle pre-login, exact fit
  post-login. Same asset.
- The `07-sport.md` and `23-gap` URLs for the WELCOME banner photo are byte-identical; the
  two `Ellipse 4` URLs differ only in a generated filter id. Kept the `23-gap` copies.

## 6. Facts worth carrying forward

**Sport icons ship pre-coloured, they are not tinted at runtime.** Measured from the files:
`icon-football.svg` is `#17458F` (exported from the *selected* pill `1:6335`),
`icon-basketball.svg` and `icon-tennis.svg` are both `#71809A` (exported from the
*unselected* pills). Also `icon-live-stream.svg` `#FF7A45`, `icon-calendar.svg` `#FF8500`,
`icon-search-header.svg` `#102A67`, `icon-balance-chip.svg` `#FF4500`, badge `#FE6A00` +
`#737B8C`. This closes `23-gap-sport-chrome.md` UNKNOWN #3 on the export side: Figma
exported three differently-coloured football/basketball/tennis files. If the pills need to
switch colour on selection, the fills must be swapped to `currentColor` by hand — the
harvest cannot do it.

**`clean-svg.mjs` is not needed here.** No file contains the `#1E1E1E` canvas rect that
`CLAUDE.md` describes, and every `viewBox` matches the glyph box (26x26, 16x16, 14x9 …).
Checked, not assumed.

**`to-webp.mjs` has not been run and should be.** `bonus-slide-welcome-photo.png` is
**4.56 MB** for a photo that Figma clips to a 340x170 slide, and the three casino PNGs add
3.7 MB. Total PNG weight in this directory is **8.3 MB**, on a page where 95% of traffic is
mobile and the static export sets `images: { unoptimized: true }` — whatever is committed is
what ships. It was not run here because this worktree
(`C:/Users/grosu.b/orca/workspaces/tw-platform/main`) has no `node_modules`; `CLAUDE.md`
requires scripts to run from `D:\tw-platform`. **Run
`node scripts/to-webp.mjs public/images/sport` from `D:\tw-platform` before committing.**

## 7. MISSING

Nothing. Every asset the sport page references as a real vector or raster was downloaded and
verified. The items the brief listed as "team badges / live indicator / star glyph" are not
missing — they do not exist as assets (§4).
