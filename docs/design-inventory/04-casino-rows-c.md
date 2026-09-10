# Top-Win — area `casino-rows-c`

File key: `s2CqwGqe0O0FcALhBNlTRe` · Page frame: `1:3289` "Pre log" (x=0, y=313, w=390, h=5628.7)

Measured nodes: **1:4888** (y=3174, h=370), **1:5072** (y=3544, h=276), **1:5240** (y=3820, h=370).

Source of every number below: `get_metadata` on `1:3289` (full subtree dump) + `get_design_context` on
`1:4888`, `1:5072`, `1:5240`, + `get_screenshot` on `1:5072`. `get_variable_defs` on `1:4888`
returned `{}` — **there are no Figma variables/tokens bound in this area; every value is a raw literal.**

---

## 1. Shared shell (identical in all three sections)

All three top-level frames are the same wrapper:

| Property | Value |
| --- | --- |
| Width | 390 (full viewport) |
| Background | `#F7FAFF` |
| Layout | vertical flex, `align-items: flex-start` |
| Padding | `padding-top: 16px`, no bottom padding, no side padding at this level |
| Inner node | `new-games-section` — vertical flex, `gap: 16px`, `padding-inline: 16px`, width 100% |

So the content column is **358px wide** (390 − 16 − 16), and the vertical rhythm inside a section is
16px top pad → header → 16px gap → body. Section total height is body-driven; there is no gap
*between* consecutive sections (each section's next sibling starts exactly at `y + height`).

Every section in the page carries the name `new-games-section` regardless of what it shows — the name
is not meaningful, the body child (`grid-container` vs `tournament-card`) is.

### 1.1 `section-header` (component A)

Shared by `1:4890`, `1:5074`, `1:5242`. Horizontal flex, `gap: 8px`, `align-items: center`, width 358.

Children in order:
1. **Title group** (`Frame 2135557683`) — horizontal flex, `gap: 8px`, height 24, `align-items: center`.
   - 20×20 category icon (SVG).
   - Title text: `Roboto Medium`, `18px`, `line-height: normal`, colour `#07134F`,
     `font-variation-settings: "wdth" 100`, `white-space: nowrap`, `word-break: break-word`.
2. **Rule** (`Vector 100`) — a 1px horizontal line SVG, `flex: 1 0 0`, `height: 0`, `min-width: 1px`,
   rendered with `inset: -0.5px 0`. It fills whatever is left between title and filter.
3. **Event filter pill** — present in `1:4888` and `1:5240`, **absent in `1:5072`**.

Header height differs only because of the pill: **30px with the pill, 24px without.**

The title group inside every header contains **14 hidden 20×20 icon frames** (one per category:
`activity_8138338 1`, `new 1`, `Recomended`, `crash games`, `Must-play slots`, `Bonus buy`,
`megaways`, `jackpots`, `Drops&wins`, `wheel-fortune_18604065 1`, `current tournaments`, `Lottery`,
`instant games`, `egypt`) plus **one visible** one. This is a variant-by-visibility pattern, not a
component variant property — see UNKNOWN 3.

### 1.2 `Event filter` pill (component B)

`1:5052` (in 1:4888) and `1:5397` (in 1:5240). Byte-identical styling:

| Property | Value |
| --- | --- |
| Size | `width: 90px`, `height: 30px` (fixed) |
| Background | `#EFF6FF` |
| Border | `1px solid #BFDBFE` |
| Radius | `10px` |
| Overflow | clipped |
| Layout | horizontal flex, `gap: 8px`, centred both axes, `padding-inline: 4px` |
| Label | `Roboto Regular`, `12px`, `line-height: normal`, `#1E40AF`, `wdth 100`, nowrap |
| Label copy | `Всі (120) ` — **note the single trailing space, it is in the design** |
| Chevron | 14×14 SVG, `chevron-right` |

Same copy `Всі (120) ` in both sections — the count is not per-section in this mock.

### 1.3 `grid-container` (component C) — the 3×2 game grid

`1:5056` (1:4888) and `1:5401` (1:5240). Two nested `grid-container` frames; the outer is a plain
vertical flex with no gap, the inner carries the layout:

| Property | Value |
| --- | --- |
| Outer width | 358 (full content column) |
| Rows | 2, both named `grid-row-0` |
| Row gap | **12px** (row 2 starts at y=160 relative to grid, row height 148) |
| Row layout | horizontal flex, `gap: 8px`, `align-items: flex-start`, width 100% |
| Tiles per row | 3 |
| Grid total height | 308 (148 + 12 + 148) |

**Tile** (`Overlay+Shadow` → `Gates of Olympus 1000`):

| Property | Value |
| --- | --- |
| Tile box | `114 × 148` fixed |
| Tile x offsets | 0, 122, 244 (114 + 8 gap) |
| Background | `rgba(240,243,255,0)` — fully transparent; the `#F0F3FF` is dead but present |
| Radius | `15px` (on both the wrapper and the inner image frame) |
| Inner image frame | `height: 147.5px`, `min-height: 147.5px`, `max-height: 780px`, width 100%, y offset `0.25` |
| Image fit | `width: 100%`, `height: 100.75%`, `top: -0.37%`, `overflow: hidden`, `pointer-events: none` |

The wrapper is named `Overlay+Shadow` but **no shadow and no overlay are emitted in the reference
code** — see UNKNOWN 1.

All six tiles in a section reference **one** image asset URL (Figma dedupes identical fills), i.e. the
mock repeats the same artwork six times. `1:4888` and `1:5240` use *different* artwork from each other.

---

## 2. Section `1:4888` — "Джекпоти" (jackpots)

y=3174, h=370. Layout = shell + header(30) + 16 gap + grid(308) → 16 + 30 + 16 + 308 = 370. ✅

- Icon `1:5038` name `jackpots`, 20×20, inner group at `inset: 5.27% 0`.
- Title copy: `Джекпоти` (measured 88×21 at x=28, y=1.5)
- Rule `1:5051` at x=124, width 136.
- Filter pill `1:5052` at x=268, label `Всі (120) `.
- Grid `1:5056` at x=16, y=46 (relative to `1:4889`).

### Assets (do not download — URLs expire ~7 days)

| Node | Name | Type | URL |
| --- | --- | --- | --- |
| `1:5039` (in `1:5038`) | jackpots icon `Group` | svg | `https://www.figma.com/api/mcp/asset/f33e9d42-3c93-44fe-b881-913a02980110.svg` |
| `1:5051` | `Vector 100` divider rule | svg | `https://www.figma.com/api/mcp/asset/f2cc3078-025e-4bd0-9281-642ae42fef15.svg` |
| `1:5054` | `chevron-right` | svg | `https://www.figma.com/api/mcp/asset/0bb2d501-4fe5-4e6e-9761-9ccafbfbd787.svg` |
| `1:5060` … `1:5071` (6 tiles, one URL) | `Gates of Olympus 1000` | png | `https://www.figma.com/api/mcp/asset/e5f918f8-c2d5-4ee4-a80f-d5a0aacaa47c.png` |

---

## 3. Section `1:5072` — "Лотерея" (lottery / tournament card)

y=3544, h=276. Layout = 16 + header(24) + 16 gap + card(220) = 276. ✅
**No `Event filter` pill**, so the header is 24px and the rule runs from x=107 to the right edge
(width 251).

- Icon `1:5222` name `Lottery`, 20×20, inner `layer2` at `inset: 8.33% 6.25%`.
- Title copy: `Лотерея` (71×21).

### 3.1 `tournament-card` (component D) — `1:5227`

| Property | Value |
| --- | --- |
| Size | `358 × 220` |
| Background | `#11111A` |
| Border | `1px solid rgba(255,255,255,0.08)` |
| Radius | `24px` |
| Overflow | clipped |
| Layout | vertical flex, `align-items: flex-start`, `justify-content: flex-end` |

**Background image** `1:5228` (`image`): absolutely positioned, `358 × 220`, centred via
`left:50%; top:50%; translate(-50%,-50%)`, radius `24px`, clipped. The `<img>` inside is
`width: 213.55%`, `height: 100.03%`, `left: -59.89%`, `top: 0` — i.e. a very wide source cropped to
show the right-hand third.

**Text container** `1:5229` (`card-text-container`): `padding: 20px` all round, `flex: 1 0 0`,
vertical flex, `justify-content: flex-end`, width 100%.

**Inner column** `1:5230` (`Frame 2135557687`): `303 × 180` at (20,20), vertical flex,
`justify-content: space-between`.

**Title block** `1:5231` (`Frame`): vertical flex, `gap: 6px`, `width: 190px`, `not-italic`.

| Node | Copy (literal) | Type |
| --- | --- | --- |
| `1:5232` `tournament-title` | `СПІН-ЧЕЛЕНДЖ` then `2000` (two paragraphs in one text node) | `Inter Bold`, `28px`, `letter-spacing: -0.5px`, colour `#FF8700`, `line-height: normal` (container `leading-[0]`), width 190 |
| `1:5233` `tournament-subtitle` | `Найкращі слоти, великі виграші!` | `Inter Medium`, `13px`, `line-height: normal`, colour `#FFFFFF`, width 190 |

Measured text box for `1:5232` is 190×102 — at 190px wide the first paragraph wraps, so the card
renders on **three** visual lines: `СПІН-` / `ЧЕЛЕНДЖ` / `2000`. Confirmed against the screenshot of
`1:5072`. Subtitle box is 190×32 → it wraps to two lines: `Найкращі слоти, великі` / `виграші!`
(also confirmed on the screenshot).

**`join-timer-pill`** `1:5234` — `303 × 34` at y=146:

| Property | Value |
| --- | --- |
| Background | `rgba(242,193,70,0.5)` |
| Backdrop filter | `blur(2px)` |
| Radius | `6px` |
| Layout | horizontal flex, `gap: 8px`, `align-items: center` |
| Padding | `padding: 6px 10px 6px 2px` (left 2, right 10) |

Children:
1. **Button instance** `1:5235` — `116 × 30` at (2,2).
   - Fill: `linear-gradient(to right, #FF8C00, #FF4500)`
   - Radius `6px`, `padding: 8px 16px`, centred flex
   - Drop shadow: `0px 8px 12px rgba(255,69,0,0.33)`
   - Inner highlight: `inset 0px 1px 0px 0px rgba(255,255,255,0.25)`
   - Label `I1:5235;112:330`: `Приєднатися` — `Inter SemiBold`, `13px`, `line-height: 19px`,
     `letter-spacing: -0.26px`, `#FFFFFF`, nowrap
2. **Divider** `1:5236` (`Line`) — SVG, a 16px line rotated 90° (so a 16px-tall vertical rule),
   container `width: 0`, `height: 16px`, at x=126, y=9.
3. **`timer-group`** `1:5237` — `159 × 13` at (134, 10.5), horizontal flex, `gap: 4px`, centred:
   - `1:5238` `time-label`: `Залишилось часу` — `Inter Regular`, `10px`, `rgba(255,255,255,0.8)`
   - `1:5239` `time-value`: `08:12:36:35` — `Inter ExtraBold`, `11px`, `#FFFFFF`

### Assets

| Node | Name | Type | URL |
| --- | --- | --- | --- |
| `1:5223` (in `1:5222`) | Lottery icon `layer2` | svg | `https://www.figma.com/api/mcp/asset/af554f9c-28e2-4867-8eac-0a5a92205ea6.svg` |
| `1:5226` | `Vector 100` divider rule | svg | `https://www.figma.com/api/mcp/asset/6de6055f-3ad0-4c4d-9f87-b6f73242b013.svg` |
| `1:5228` | tournament card background `image` | png | `https://www.figma.com/api/mcp/asset/9012f749-e5b1-4dad-a7f9-ec06a0e7b946.png` |
| `1:5236` | pill divider `Line` | svg | `https://www.figma.com/api/mcp/asset/93bb1b1b-bac5-4283-8c69-b30e469bf95f.svg` |

Screenshot of the rendered section saved at
`C:\Users\grosu.b\AppData\Local\Temp\claude\C--Users-grosu-b-orca-workspaces-tw-platform-main\6a9908ae-4f67-4540-9f9b-8b60b065241a\scratchpad\s5072.png`
(390×276, native size).

---

## 4. Section `1:5240` — "Drop & Wins"

y=3820, h=370. Structurally **identical to `1:4888`** — same shell, same header (30px, with pill),
same 16px gap, same 3×2 grid of 114×148 tiles at 8px/12px gaps. Only three things differ:

1. Category icon `1:5390` name `Drops&wins`, 20×20, **no inner inset wrapper** (the SVG fills the
   20×20 box directly, unlike `1:5038`/`1:5222` which nest an inset group).
2. Title copy: `Drop & Wins` — Latin, not Ukrainian. Measured 99×21. Confirmed literally from
   `get_design_context` (`{`Drop & Wins`}`), not inferred from the layer name.
3. Rule `1:5396` at x=135, width 125 (title is wider).

Filter pill `1:5397` label is again exactly `Всі (120) `.

### Assets

| Node | Name | Type | URL |
| --- | --- | --- | --- |
| `1:5390` | `Drops&wins` icon | svg | `https://www.figma.com/api/mcp/asset/172beb78-d0ba-4aae-87e6-edf4fb7b1956.svg` |
| `1:5396` | `Vector 100` divider rule | svg | `https://www.figma.com/api/mcp/asset/da71f537-99b5-44ba-b983-5e20283e7acb.svg` |
| `1:5399` | `chevron-right` | svg | `https://www.figma.com/api/mcp/asset/d755a3a2-7773-4a39-ba08-5f3613ec5998.svg` |
| `1:5405` … `1:5416` (6 tiles, one URL) | `Gates of Olympus 1000` | png | `https://www.figma.com/api/mcp/asset/b1f9ce5e-d32f-448f-816b-cd0787195b64.png` |

The `Vector 100` and `chevron-right` SVGs get a *different* asset URL in every section even though
they are the same shape at a different width — the export is per-instance, so one shared component
covers all of them in code.

---

## 5. Token inventory for this area (exact literals, no variables bound)

**Colours**

| Hex / rgba | Used for |
| --- | --- |
| `#F7FAFF` | section background (all three) |
| `#07134F` | section title text |
| `#EFF6FF` | filter pill background |
| `#BFDBFE` | filter pill border |
| `#1E40AF` | filter pill label |
| `rgba(240,243,255,0)` | game-tile wrapper background (transparent) |
| `#11111A` | tournament card background |
| `rgba(255,255,255,0.08)` | tournament card border |
| `#FF8700` | tournament title |
| `#FFFFFF` | tournament subtitle, button label, timer value |
| `rgba(255,255,255,0.8)` | timer label |
| `rgba(242,193,70,0.5)` | join-timer pill background |
| `#FF8C00` → `#FF4500` | join button gradient (left → right) |
| `rgba(255,69,0,0.33)` | join button drop shadow |
| `rgba(255,255,255,0.25)` | join button inset top highlight |

**Type**

| Face | Size | Weight | Line-height | Tracking | Where |
| --- | --- | --- | --- | --- | --- |
| Roboto Medium | 18 | 500 | normal | — | section title |
| Roboto Regular | 12 | 400 | normal | — | filter pill label |
| Inter Bold | 28 | 700 | normal | −0.5px | tournament title |
| Inter Medium | 13 | 500 | normal | — | tournament subtitle |
| Inter SemiBold | 13 | 600 | 19px | −0.26px | join button label |
| Inter Regular | 10 | 400 | normal | — | timer label |
| Inter ExtraBold | 11 | 800 | normal | — | timer value |

Roboto text nodes carry `font-variation-settings: "wdth" 100` (variable-font axis, default width).

**Radii**: `6px` (join pill, join button), `10px` (filter pill), `15px` (game tile), `24px` (tournament card).

**Shadows**: only two, both on the join button — `0px 8px 12px rgba(255,69,0,0.33)` (drop) and
`inset 0px 1px 0px 0px rgba(255,255,255,0.25)`. No shadow anywhere on the game tiles despite the
`Overlay+Shadow` layer name.

**Effects**: `backdrop-filter: blur(2px)` on `join-timer-pill` only.

**Spacing**: 16 (section top pad, section side pad, section gap, card padding), 12 (grid row gap),
8 (header gap, tile gap, join pill gap), 6 (title/subtitle gap), 4 (timer group gap), 2 (join pill left pad).

---

## 6. Interaction / state implications

| Where | Implied state | Evidence |
| --- | --- | --- |
| `Event filter` pill (`1:5052`, `1:5397`) | Opens a filter list — it has a `chevron-right` and a count. Only one state is drawn (collapsed, `Всі (120) `). | node names `Event filter` / `Filter label` / `chevron-right`; static count |
| Section title icon group | 15 sibling 20×20 icon frames, 14 `hidden="true"`, 1 visible. A category-switch mechanism baked as visibility. | metadata `hidden` flags |
| Game tile wrapper `Overlay+Shadow` | Name promises a hover/press overlay + shadow. **Neither is present in the emitted styles.** | reference code has only `bg-[rgba(240,243,255,0)]` |
| Grid | Static 3×2, **not** a horizontal scroll row. Fixed 114px tiles + 8px gaps = exactly 358, no overflow. | fixed widths sum to container width |
| `Приєднатися` button (`1:5235`) | Instance of a shared `Button` component with a gradient + inset highlight; only default state drawn. | `<instance>` in metadata, `I1:5235;112:330` label id |
| `08:12:36:35` timer | Live countdown (DD:HH:MM:SS shape). Static value in Figma. | copy format |
| Tournament card | Whole card is likely tappable; no separate pressed variant in the file. | — |

---

## 7. All fifteen page sections in vertical order (`1:3289`, y=60 → y=5628.7)

Header `1:3290` "Header postlog" (y=0, h=60) sits above the range and is not counted.

| # | y | h | Node | Title copy (literal) | Component shape | Same as? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 60 | 232 | `1:3302` `Frame 2135557699` | — | hero carousel (`hero-section` 390×172 + 4px dot row) | unique |
| 2 | 292 | 44 | `1:3335` `navbar` | — | `Category switcher` 390×44 | unique |
| 3 | 336 | 78 | `1:3391` `Recent wins - Ticker (iOS)` | — | 3 × `Entry` (46px thumb + content) with a 44px `divider` | unique |
| 4 | 414 | 370 | `1:3414` `Frame 2135557678` | node named `Recent games` (Latin layer name — **copy not read**, see UNKNOWN 2) | header(30)+pill + 3×2 grid | **same as 1:4888 / 1:5240** |
| 5 | 784 | 370 | `1:3588` `Frame 2135557700` | `Нові Ігри` | header(30)+pill + 3×2 grid | same as 1:4888 |
| 6 | 1154 | 264 | `1:3762` `Frame 2135557701` | `Провідні провайдери` | header(40) with a 40×40 `Button` instead of a pill + `Frame 2135557702` body 390×192 | unique (provider row) |
| 7 | 1418 | 370 | `1:3964` `Frame 2135557702` | `Рекомендовані` | header(30)+pill + 3×2 grid | same as 1:4888 |
| 8 | 1788 | 370 | `1:4140` `Frame 2135557703` | `Краш Ігри` | header(30)+pill + 3×2 grid | same as 1:4888 |
| 9 | 2158 | 370 | `1:4340` `Frame 2135557704` | `Варто спробувати` | header(30)+pill + 3×2 grid | same as 1:4888 |
| 10 | 2528 | 276 | `1:4545` `Frame 2135557705` | `Поточні Турніри` | header(24) no pill + `tournament-card` 358×220 | **same as 1:5072** |
| 11 | 2804 | 370 | `1:4714` `Frame 2135557706` | `Megaways` | header(30)+pill + 3×2 grid | same as 1:4888 |
| 12 | **3174** | **370** | **`1:4888`** `Frame 2135557707` | `Джекпоти` | header(30)+pill + 3×2 grid | **measured here** |
| 13 | **3544** | **276** | **`1:5072`** `Frame 2135557708` | `Лотерея` | header(24) no pill + `tournament-card` 358×220 | **measured here** |
| 14 | **3820** | **370** | **`1:5240`** `Frame 2135557709` | `Drop & Wins` | header(30)+pill + 3×2 grid | **measured here** |
| 15 | 4190 | 1438.7 | `1:5417` `Frame 2135557710` | `Колесо` | header(24) no pill + `tournament-card` 358×220 (`new-games-section` h=284) **plus `footer-mobile` 1114.7 tall** | tournament card same as 1:5072; footer unique |

Counts:

- **Grid sections = 8** — `1:3414`, `1:3588`, `1:3964`, `1:4140`, `1:4340`, `1:4714`, `1:4888`,
  `1:5240`. All 370 tall, all the same component.
- **Tournament-card sections = 3** — `1:4545`, `1:5072`, `1:5417`. The first two are 276 tall;
  `1:5417` is 1438.7 only because the footer is bolted into the same wrapper.
- **One-off sections = 4** — `1:3302` hero, `1:3335` navbar, `1:3391` ticker, `1:3762` providers.

`1:5417`'s `new-games-section` is 284 tall, not 260, because `footer-mobile` (h=1114.7) sits as a
second child of the same wrapper starting at y=324.

---

## UNKNOWN

1. The game-tile wrapper is named `Overlay+Shadow` but `get_design_context` emits no shadow and no
   overlay layer for it — only `bg-[rgba(240,243,255,0)]`. **Question for the owner: is the tile
   overlay/shadow a hover-only treatment that Figma does not export, or is the layer name stale and
   the tiles really are flat?**

2. Section #4 (`1:3414`) has a header text node named `Recent games` (Latin) while every other
   section's text node name is the Ukrainian copy itself. Layer names are not reliably the content —
   I did not spend a `get_design_context` call on `1:3414`, so **its literal copy is unread.**
   That section is another agent's area; flagging it so nobody copies `Recent games` as the label.

3. The 15 category icons inside every `section-header` are plain frames toggled by `hidden`, not a
   component variant with a named property. **Question: should the implementation ship one
   `<CategoryIcon name>` component with 15 SVGs, or is there a Figma component set elsewhere in the
   file that these were detached from?**

4. All six tiles in a grid section share one image URL, and `1:4888` vs `1:5240` use different
   artwork. **Question: is the repetition just mock filler (real data = 6 different games), or is the
   per-section artwork meaningful?** Assuming filler, but that is reasoning, not measurement.

5. `Всі (120) ` — the same count in both filter pills, with a trailing space.
   **Question: is `120` a placeholder, and should the trailing space be preserved?**

6. No hover, focus, pressed or selected variant exists anywhere in these three sections. The design
   file shows one state only. **Question: who owns the interaction states — is there a second Figma
   page with them?**

7. `get_variable_defs` on `1:4888` returned `{}`. Measured: no variables are bound in this subtree.
   Not measured: whether the file has a variable collection at all that simply isn't applied here.
