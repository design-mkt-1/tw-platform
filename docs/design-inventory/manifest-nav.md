# manifest — nav (bottom navigation + page headers)

File key: `s2CqwGqe0O0FcALhBNlTRe`
Target dir: `C:/Users/grosu.b/orca/workspaces/tw-platform/main/public/images/nav/`
Figma MCP calls spent: **0**. Every asset came from a recorded URL or from the SVGs a previous
agent had already downloaded to `scratchpad/topwin-inventory/svg/`.

## Downloaded

| File | Node id | Figma layer name | Format | Bytes | Source |
| --- | --- | --- | --- | --- | --- |
| `public/images/nav/nav-bar-plate.svg` | `1:6490` | `Subtract` | SVG | 2913 | copied from `svg/subtract.svg` (prior download) |
| `public/images/nav/nav-center-button.svg` | `1:6518` | `btn-69` | SVG | 1883 | copied from `svg/btn69.svg` (prior download) |
| `public/images/nav/nav-active-dot.svg` | `1:6516` | `active-dot` | SVG | 230 | copied from `svg/dot.svg` (prior download) |
| `public/images/nav/nav-menu-burger.svg` | `1:6520` | `Frame 2135557745` (inside `menu_burger.svg`) | SVG | 492 | copied from `svg/burger.svg` (prior download) |
| `public/images/nav/tab-casino.svg` | `1:6499` | `Group` (inside `Icon_casino`) | SVG | 1439 | copied from `svg/casino.svg` (prior download) |
| `public/images/nav/tab-sport.svg` | `1:6504` | `game_15999999 (1) 1` | SVG | 2900 | copied from `svg/sport.svg` (prior download) |
| `public/images/nav/tab-live-casino.svg` | `1:6509` | `SVG` → `Vector` | SVG | 6148 | copied from `svg/live.svg` (prior download) |
| `public/images/nav/tab-promo.svg` | `1:6513` | `Icon_promotions` | SVG | 4117 | copied from `svg/promo.svg` (prior download) |
| `public/images/nav/topwin-logo.svg` | `1:3292` | `Logo TopWin` | SVG | 2733 | recorded URL `653406f6-87f0-4c77-b172-64eec586dad8.svg` (still live) |
| `public/images/nav/header-search.svg` | `1:3300` | `search_header.svg` | SVG | 1638 | recorded URL `75224228-cec6-47bd-90cc-a7677bc34603.svg` (still live) |
| `public/images/nav/balance-deposit-plus.svg` | `1:590` | `Group` (inside `tabs_4511814 (1) 1`) | SVG | 1230 | recorded URL `cfa25c9c-6984-41d6-b919-459831158214.svg` (still live) |

All eleven files verified: each starts with `<svg`, none is 0 bytes, none is an HTML error page.

## Name mapping (Figma machine name → readable file)

| Figma layer | File |
| --- | --- |
| `Subtract` | `nav-bar-plate.svg` |
| `btn-69` | `nav-center-button.svg` |
| `active-dot` | `nav-active-dot.svg` |
| `Frame 2135557745` | `nav-menu-burger.svg` |
| `Group` (under `Icon_casino`) | `tab-casino.svg` |
| `game_15999999 (1) 1` | `tab-sport.svg` |
| `SVG` → `Vector` | `tab-live-casino.svg` |
| `Icon_promotions` | `tab-promo.svg` |
| `Logo TopWin` | `topwin-logo.svg` |
| `search_header.svg` | `header-search.svg` |
| `Group` (under `tabs_4511814 (1) 1`) | `balance-deposit-plus.svg` |

## Notes that affect how these are used

- **Logo provenance.** `topwin-logo.svg` is `1:3292` from the real casino header `1:3290`,
  111 × 20, wordmark drawn in `#FF4500`. It is **not** the gold crown-over-`JACKPOT` mark that
  `1:6599` / `1:6622` carry — those two frames (`1:6594`, `1:6617`) were ruled out by the owner
  and nothing here was taken from them.
- **One logo asset, not two.** `1:584` (post-login, URL `ad05fcb3-…`) and `1:3292` (pre-login)
  are the same 111 × 20 artwork exported twice; the same holds for search `1:594` vs `1:3300`.
  Only one copy of each was downloaded. If a byte-level diff between the two exports ever
  matters, the second URLs are still recorded in `06-casino-postlogin-delta.md`.
- **Search box vs search asset.** The asset is 40 × 40 in both header states. Pre-login the
  button box is 36 × 36 with the SVG placed at `(-2, -2)` — the glyph is cropped 2px per side,
  not scaled. Post-login the box is 40 × 40 and the SVG sits at `(0, 0)`.
- **The deposit `+` is 23.2507 × 23.25**, sitting inside a 24 × 24 layer. Not a square number;
  do not round it into a 24 box without checking the centring.
- **Tab icons are single flat fills.** `tab-sport.svg` ships with `#FFB095` baked in (it is the
  active tab in the file); the other three ship `#FFFFFF`. Per `20-gap-bottom-nav.md` §4 the
  active state is a colour swap only, so the practical build is one glyph per tab with
  `fill: currentColor` and the colour set on the tab.
- **`nav-center-button.svg` carries its own glow filter** (`0 41.67px 30.12px rgba(255,69,0,.21)`)
  which extends ~72px below and ~30px each side of the 63.65 × 58.92 shape. Any
  `overflow: hidden` on the nav clips it.

## MISSING

None. Every asset in scope resolved.

Not downloaded **by design**, recorded here so the decision is visible:

| Node id | Layer | Why not |
| --- | --- | --- |
| `1:6599`, `1:6622` | `logo.svg` (JACKPOT wordmark, dark headers `1:6594` / `1:6617`) | Owner ruled these frames out |
| `1:584` | `Logo TopWin`, post-login instance | Same artwork as `1:3292`, already downloaded |
| `1:594` | `search_header.svg`, post-login instance | Same artwork as `1:3300`, already downloaded |
| `1:6525`, `1:6534`, `1:6539`, `1:6544`, `1:6548`, `1:6552`, `1:6554`, `1:6558` (ru) and `1:6560`, `1:6569`, `1:6574`, `1:6579`, `1:6583`, `1:6587`, `1:6589`, `1:6593` (en) | ru / en navbar variant exports | Same eight glyphs re-exported per language variant; the ua set was shipped |
| `1:596` / `1:3293` | `Logo` 88 × 24 | `hidden="true"` in both frames, never exported |
