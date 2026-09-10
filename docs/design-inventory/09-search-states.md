# Top-Win — Search states (mobile 390)

File key: `s2CqwGqe0O0FcALhBNlTRe`
Measured via Figma MCP `get_metadata` + `get_design_context` + `get_screenshot`.
Everything below is read off the file unless it sits under **UNKNOWN** or is explicitly labelled *reasoning*.

Frames measured:

| Frame | Node | Size | Blocks |
| --- | --- | --- | --- |
| `mob main - State 1` | `1:7363` | 390 x 508 | field block 88, popular-searches 85, recent-searches 55, carousel 192 |
| `mob main - State 2` | `1:7595` | 390 x 336 | field block 88, carousel 192 |
| `mob main - State 3` | `1:7806` | 390 x 496 | field block 88, suggestions 144, carousel 192 |
| `mob main - State not found` | `1:7214` | 390 x 571 | field block 88, popular-searches 85, empty-state 177, top-providers 113, progress dots 4 |

---

## 1. The state machine

What is actually in the input, per frame (read from the text node inside `input-wrapper`):

| Frame | Input text node | Literal string | Colour | Meaning |
| --- | --- | --- | --- | --- |
| State 1 | `1:7388` | `Пошук провайдерів...` | `#94a3b8` | placeholder — field is **empty**, caret present |
| State 2 | `1:7620` | `Пошук провайдерів...` | `#94a3b8` | placeholder — field is **empty**, caret present |
| State 3 | `1:7831` | `Prag` | `#102a67` | a real typed value (4 chars), caret after it |
| State not found | `1:7239` | `Пошук провайдерів...` | `#94a3b8` | placeholder — field is **empty**, caret present |

Placeholder and typed value share Inter Medium 14 / `leading-normal`; only the colour differs
(`#94a3b8` vs `#102a67`). The caret (`cursor`, 2 x 16, `#3b82f6`) is present in all four frames, so
all four are **focused** states. There is no unfocused/resting search frame in this set.

Response per state:

- **State 1 — focused, empty query, history exists.**
  Shows `Популярні запити` chips (5), `Нещодавні запити` (1 row: `BGaming`), then the two-row
  provider carousel. Nothing is headed here; the carousel has no label in State 1.
- **State 2 — focused, empty query, nothing to suggest.**
  Same field, then straight to the two-row carousel. Both `popular-searches` and `recent-searches`
  are absent from the node tree (not hidden — the nodes do not exist in `1:7595`).
- **State 3 — query typed, matches found.**
  `Відповідні пропозиції` list (2 rows), then the two-row carousel. `popular-searches` and
  `recent-searches` are gone; suggestions take their slot (same y = 124).
- **State not found — no results.**
  `Популярні запити` chips, then the empty-state block, then a *labelled* `Топ провайдерів`
  single-row carousel, then a 4-segment progress bar.

Transition reading (*reasoning, not measured*): the four frames are one flow — focus → (empty:
State 1 with history, State 2 without) → type ≥1 char → (matches: State 3 / no matches: State not
found). The file contains no prototype links; see UNKNOWN Q1.

### Two things worth flagging before this is built

1. **`State not found` draws an empty input.** The block that says "Провайдерів не знайдено" is
   paired with the placeholder, not with a query. A no-results screen with an empty search box is
   not reachable in a real implementation. Whatever query produced it has to be re-inserted.
   (Measured: text node `1:7239` = `Пошук провайдерів...`, `#94a3b8` — the placeholder token.)
2. **`State not found` also still shows `Популярні запити`.** So the failed-search screen offers
   the same five chips as the empty state above it, one of which is `Pragmatic` — the very chip
   that in State 3 does return results. Not a bug in the file, but it means the chip row is *not*
   a "did you mean" list and must not be relabelled as one.

Re the predecessor-project failure (empty-state copy naming off-screen categories): **this copy is
clean.** `Спробуйте інший пошуковий запит` names no category and no filter. The only pointer is the
`Усі провайдери` button, and the frame does render a provider carousel (`Топ провайдерів`) directly
below it, so the CTA has a visible referent on the same screen. Its destination route is not in
Figma — UNKNOWN Q4.

---

## 2. Literal copy (Ukrainian, verbatim — do not translate, do not re-case)

| Node | String | Where |
| --- | --- | --- |
| `1:7379` / `1:7611` / `1:7822` / `1:7230` | `Провідні провайдери` | section header, all 4 frames |
| `1:7388` / `1:7620` / `1:7239` | `Пошук провайдерів...` | placeholder (three ASCII full stops, not `…`) |
| `1:7831` | `Prag` | typed query, State 3 |
| `1:7394` / `1:7245` | `Популярні запити` | label, State 1 + State not found |
| `1:7397` | `Pragmatic` | chip 1 |
| `1:7399` | `Evolution` | chip 2 |
| `1:7401` | `NetEnt` | chip 3 |
| `1:7403` | `Microgaming` | chip 4 |
| `1:7405` | `Play'n GO` | chip 5 (straight apostrophe U+0027) |
| `1:7407` | `Нещодавні запити` | label, State 1 |
| `1:7411` | `BGaming` | recent item 0 |
| `1:7837` | `Відповідні пропозиції` | label, State 3 |
| `1:7844` | `Pragmatic Play` | suggestion 0 title |
| `1:7845` | `245 ігор` | suggestion 0 subtitle |
| `1:7847` | `СЛОТИ` | suggestion 0 badge (stored uppercase in the file) |
| `1:7853` | `Pragmatic Live` | suggestion 1 title |
| `1:7854` | `32 гри` | suggestion 1 subtitle |
| `1:7856` | `ЛАЙВ` | suggestion 1 badge (stored uppercase) |
| `1:7261` | `Провайдерів не знайдено` | empty-state title |
| `1:7262` | `Спробуйте інший пошуковий запит` | empty-state body (no trailing full stop) |
| `1:7264` | `Усі провайдери` | empty-state CTA |
| `1:7266` | `Топ провайдерів` | carousel label, State not found only |

**Casing trap:** the four section labels (`Популярні запити`, `Нещодавні запити`,
`Відповідні пропозиції`, `Топ провайдерів`) are stored **mixed-case** and rendered uppercase by
`text-transform: uppercase`. The two suggestion badges (`СЛОТИ`, `ЛАЙВ`) are stored **already
uppercase** with no transform. Copy them as stored.

---

## 3. Layout

Frame padding is identical in all four: **x = 16** on both sides (content width 358), **top = 20**,
**bottom = 20**. Every top-level gap between blocks is **16**.

### 3.1 Field block — `Frame` (358 x 88), identical in all four frames
`flex-col`, `gap: 16`.

- `section-header` 358 x 24 — `flex row`, `justify-between`, `items-center`.
  - left group (`1:7366`, 210 x 24): `gap: 8`; icon `new 1` 21 x 20 at y=2; title text.
  - right group (`1:7380`, 18 x 3): 4 squares 3 x 3, `gap: 2`, `radius: 2`, colours in order
    `#3b82f6` → `#93c5fd` → `#bfdbfe` → `#dbeafe`.
  - two sibling nodes are **hidden** in every frame: `activity_8138338 1` (20 x 20) and `Popular`
    (14.03 x 20). They are alternate header icons — not rendered.
- `search-input` 358 x 48 — `bg #ffffff`, `border 2px solid #bfdbfe`, `radius 24`,
  `drop-shadow 0 4px 8px rgba(59,130,246,0.1)`, `px 12`, `gap 12`, `items-center`.
  - magnifier vector 20 x 20 at x=12.
  - `input-wrapper` flex-1, `gap 4`: text + caret 2 x 16 `#3b82f6` `radius 2` (rounded-rectangle).
  - `btn-close` 28 x 28 at x=318 — `bg #eff6ff`, `border 1px solid #bfdbfe`, `radius 14`,
    centred `x` glyph 14 x 14.

### 3.2 `popular-searches` (358 x 85) — States 1, not found
`flex-col`, `gap: 10`. Label 11px block is 13 tall; `tags-wrapper` starts at y=23.
`tags-wrapper` is `flex-wrap`, `gap: 8` (both axes — row 2 sits at y=35 = 27 + 8).

Chip geometry: `px 12`, `py 6`, height **27**, `radius 100`, `border 1px`.
Widths as laid out: 83 / 78 / 64 / 99 / 80. Wrapping observed: chips 1-4 on row 1
(0, 91, 177, 249), chip 5 alone on row 2.

Chip colour is **alternating, not semantic** (positions 1,3,5 blue; 2,4 orange):

| Chip | bg | border | text |
| --- | --- | --- | --- |
| Pragmatic | `#dbeafe` | `#bfdbfe` | `#1e3a8a` |
| Evolution | `#fff7ed` | `#fed7aa` | `#c2410c` |
| NetEnt | `#dbeafe` | `#bfdbfe` | `#1e3a8a` |
| Microgaming | `#fff7ed` | `#fed7aa` | `#c2410c` |
| Play'n GO | `#dbeafe` | `#bfdbfe` | `#1e3a8a` |

### 3.3 `recent-searches` (358 x 55) — State 1 only
`flex-col`, `gap: 10`; list starts y=23. One row only.
`recent-item-0` 358 x 32, full width: `bg #dbeafe`, `border 1px solid #bfdbfe`, `radius 100`,
`px 12`, `py 6`, `justify-between`. Label `#102a67` 13px Inter Medium. Right side `clear-btn`
14 x 14 at x=332 (circle-x glyph).

The list container `recent-list` is `flex-col … justify-between h-32` — sized for exactly one row
as drawn. Multi-row spacing is not specified in the file (UNKNOWN Q2).

### 3.4 `suggestions` (358 x 144) — State 3 only
`flex-col`, `gap: 10`; list at y=23; rows `gap: 8`.
Row: `bg #dbeafe`, **no border**, `radius 12`, `padding 12` all round, `gap 12`, `items-center`.

- `circle-logo-placeholder` 32 x 32, `radius 16`, **no fill declared** — holds an 18 x 18 ring SVG.
  It is a placeholder, not the real provider logo (name says so, and the glyph is a plain circle).
- `details` flex-1, `flex-col`, `gap 2`, Inter Medium:
  - title `#1e3a8a`; **14px on row 0, 15px on row 1** — inconsistent in the file, see UNKNOWN Q3.
  - subtitle `#839cbf` 11px.
- `badge` right: `bg #fff7ed`, `border 1px solid #fed7aa`, `radius 100`, `px 12`, `py 6`,
  height 25, text Inter SemiBold 11 `#e67508`. Widths 64 (`СЛОТИ`) / 56 (`ЛАЙВ`).
- Row heights: row 0 = 56, row 1 = 57 (1px difference caused by the 15px title).

### 3.5 Provider carousel — `Frame 2135557702`
States 1 / 2 / 3: **two** stacked `Slider-Track-Wrapper`, each 358 x 96, **no gap** → 192 total.
State not found: **one** wrapper, 358 x 96, and it is the only one carrying a label.

Each wrapper is `overflow-clip` around `Row-1` of width **420** inside a 358 viewport — 62px of
row 1 hangs off the right edge, so the 5th badge (Spribe) is drawn half-cut. That overhang is the
horizontal-scroll affordance (*reasoning*: the file has no scroll property; the clipped 420 > 358
is what is measured).

Badge: 80 x 96, `padding 12`, centred. Inner `Circle` 72 x 72, `bg #ffffff`, `radius 1000`,
`px 4`, `drop-shadow 0 6px 9px rgba(23,69,143,0.08)`. Logo leaf 44 x 44 (3 Oaks is 45 x 44).
Order in every row: Pragmatic, 3 Oaks, BGaming, Nolimit City, Spribe.

Both rows in States 1/2/3 contain the **same five providers in the same order** — the second row is
a duplicate of the first, not a continuation.

### 3.6 Empty-state block `1:7257` (358 x 177) — State not found only
`flex-col`, `items-center`, `gap: 12`, `py: 8`.

1. icon chip 56 x 56 — `bg #eff6ff`, `border 1px solid #bfdbfe`, `radius 28`, magnifier 28 x 28.
2. title `Провайдерів не знайдено` — Inter ExtraBold 16, `#1e3a8a`, `line-height 1.2`,
   `text-align center`, full width (358), block height 19.
3. body `Спробуйте інший пошуковий запит` — Inter Medium 13, `#64748b`, `line-height 1.4`,
   centred, full width, block height 18.
4. CTA `Усі провайдери` — 134 x 32, `bg #f97316`, `radius 100`, `px 16`, `py 8`,
   `drop-shadow 0 4px 6px rgba(249,115,22,0.3)`, text Inter Bold 13 `#ffffff`.

### 3.7 Progress dots `1:7358` (358 x 4) — State not found only
`flex row`, `gap 4`, `justify-center`. Four rounded rects, all h=4, `radius 2`:

| # | width | fill |
| --- | --- | --- |
| 1 | 40 | `#1e3a8a` |
| 2 | 24 | `#3b82f6` |
| 3 | 16 | `#f97316` |
| 4 | 8 | `#fed7aa` |

Decreasing width + fading colour. Reads as a decorative scroll/step indicator rather than a
selectable control — no active/inactive pair exists to compare against (UNKNOWN Q5).

---

## 4. Tokens (exact)

### Colours
| Hex | Used for |
| --- | --- |
| `#ffffff` | search field bg, provider circle bg, CTA label |
| `#07134f` | section-header title `Провідні провайдери` |
| `#102a67` | recent-item label, typed query text |
| `#1e3a8a` | chip text (blue), suggestion title, empty-state title, dot 1 |
| `#3b82f6` | all section labels, caret, header square 1, dot 2 |
| `#93c5fd` | header square 2 |
| `#bfdbfe` | search field border, chip border (blue), btn-close border, icon-chip border, header square 3 |
| `#dbeafe` | chip bg (blue), recent-item bg, suggestion row bg, header square 4 |
| `#eff6ff` | btn-close bg, empty-state icon chip bg |
| `#839cbf` | suggestion subtitle |
| `#94a3b8` | placeholder |
| `#64748b` | empty-state body |
| `#fff7ed` | chip bg (orange), suggestion badge bg |
| `#fed7aa` | chip border (orange), suggestion badge border, dot 4 |
| `#c2410c` | chip text (orange) |
| `#e67508` | suggestion badge text |
| `#f97316` | CTA bg, dot 3 |

Shadows:
- search field — `0 4px 8px rgba(59,130,246,0.1)`
- provider circle — `0 6px 9px rgba(23,69,143,0.08)`
- CTA — `0 4px 6px rgba(249,115,22,0.3)`

### Type
| Role | Family / weight | Size | Line-height | Colour |
| --- | --- | --- | --- | --- |
| Section header title | Roboto Medium (`fontVariationSettings: "wdth" 100`) | 18 | normal | `#07134f` |
| Section label (4x) | Inter Bold, `uppercase` | 11 | normal | `#3b82f6` |
| Placeholder | Inter Medium | 14 | normal | `#94a3b8` |
| Typed query | Inter Medium | 14 | normal | `#102a67` |
| Chip | Inter Medium | 12 | normal | `#1e3a8a` / `#c2410c` |
| Recent item | Inter Medium | 13 | normal | `#102a67` |
| Suggestion title | Inter Medium | 14 (row 0) / 15 (row 1) | normal | `#1e3a8a` |
| Suggestion subtitle | Inter Medium | 11 | normal | `#839cbf` |
| Suggestion badge | Inter SemiBold | 11 | normal | `#e67508` |
| Empty-state title | Inter ExtraBold | 16 | 1.2 | `#1e3a8a` |
| Empty-state body | Inter Medium | 13 | 1.4 | `#64748b` |
| CTA | Inter Bold | 13 | normal | `#ffffff` |

Roboto is used for exactly one string (the section header). Everything else is Inter.

### Radii
`24` search field · `14` btn-close · `100` chips / recent item / suggestion badge / CTA ·
`12` suggestion row · `16` suggestion logo placeholder · `28` empty-state icon chip ·
`1000` provider circle · `2` caret and progress dots.

### Spacing scale in use
`2, 4, 6, 8, 10, 12, 16, 20` — no other values appear.

---

## 5. Assets

Not downloaded. URLs expire ~7 days from 2026-09-10.

| Node | Name | Size | URL |
| --- | --- | --- | --- |
| `1:7377` | `new 1` (header icon) | 21 x 20 | `https://www.figma.com/api/mcp/asset/d944a94f-5587-4ebd-a52f-148dfc90c9b8.svg` |
| `1:7386` | search magnifier (field) | 20 x 20 | `https://www.figma.com/api/mcp/asset/9301d17f-cdca-4edb-9250-fb3e5fbd769d.svg` |
| `1:7391` | `x` (btn-close) | 14 x 14 | `https://www.figma.com/api/mcp/asset/35731be8-53e8-40d0-9a71-9f8c9911c0ea.svg` |
| `1:7829` | search magnifier (State 3 copy) | 20 x 20 | `https://www.figma.com/api/mcp/asset/47e3801a-9868-42c3-8f70-3e53d63e627a.svg` |
| `1:7834` | `x` (State 3 copy) | 14 x 14 | `https://www.figma.com/api/mcp/asset/829e9d40-8a35-4f7d-8088-1ca11e0f6a90.svg` |
| `1:7412` | `clear-btn` (recent item) | 14 x 14 | `https://www.figma.com/api/mcp/asset/ab8c59ed-1a20-418f-b0ed-1bae2c5ee714.svg` |
| `1:7841`, `1:7850` | suggestion logo placeholder ring | 18 x 18 | `https://www.figma.com/api/mcp/asset/f2fe84c0-ff28-45bc-ac1d-ee0a7970d5b1.svg` |
| `1:7259` | empty-state magnifier | 28 x 28 | `https://www.figma.com/api/mcp/asset/9151cb1f-13c3-4b07-953c-47e3c48d635d.svg` |

Provider logos (URLs taken from the `State not found` carousel, `1:7265`; the other three frames
carry duplicate node ids for the same glyphs):

| Node | Provider | Leaf size | URLs |
| --- | --- | --- | --- |
| `1:7272` | Pragmatic Play | 44 x 44 | mask `…/6bb2e03c-1baa-4281-a5a0-eea3f45b0f4c.svg` + fill `…/f9a5a65b-5e77-40c9-99b7-3884bc966ec7.svg` |
| `1:7283` | 3 Oaks | 45 x 44 | mask `…/ba5c0c6f-9d47-4392-9223-94dbd8a2014b.svg` + fill `…/4c8ade14-6728-4e32-8076-985a87ee631b.svg` |
| `1:7304` | BGaming | 44 x 44 | `…/fcfe2852-e89f-4902-9634-d374b906dc02.svg`, `…/0f37aa84-dcd2-41e3-b77f-afc08443f1d4.svg`, mask `…/24c3dda1-6e48-4ccf-a059-e313051d987f.svg` + fill `…/2b07d552-37d4-4ef1-9f4e-8e5601a7fe4e.svg` |
| `1:7327` | Nolimit City | 44 x 44 | mask `…/500c47ce-c7a6-450f-8699-adb0768aaa53.svg` + fill `…/004a0915-e193-49d6-986d-d057a3ce6a95.svg` |
| `1:7355` | Spribe | 44 x 44 | `…/4008a5c7-002a-4d89-9f52-5c73db35963a.svg` |

(All prefixed `https://www.figma.com/api/mcp/asset/`.)

Distinct assets to acquire: 6 UI icons (header, magnifier-20, x-14, clear-btn-14, ring-18,
magnifier-28) + 5 provider logos = **11**. The State-3 magnifier/x are byte-duplicates of the
State-1 ones as far as geometry goes but were exported under separate URLs — treat as the same
two assets.

---

## 6. Interaction implied by the file

- **Focus.** All four frames carry the caret, so this whole set is the focused search panel.
  There is no unfocused frame here.
- **Clear field.** `btn-close` (28 x 28, `x` glyph) present in all four. Since it is present in
  State 1 where the field is empty, it is more likely a *close the panel* control than a *clear
  the text* control (*reasoning* — the file gives it no label and no second variant).
- **Clear one recent entry.** `clear-btn` 14 x 14 inside `recent-item-0`, right-aligned. Removes
  that entry. Hit area as drawn is 14 x 14 — below the 44px minimum; will need enlarging.
- **Chip tap.** 5 chips, 27px tall. No pressed/selected variant exists in the file.
- **Suggestion tap.** 2 rows, no pressed variant.
- **Horizontal scroll.** Both carousel wrappers clip a 420px row into 358px. Scroll, not wrap.
- **CTA.** `Усі провайдери` — one state only, no hover/pressed variant.
- **Progress dots.** 4 segments of decreasing width and fading colour; no second variant, so no
  active/inactive pair can be derived.
- **Section header `…` group.** 4 tiny squares, colours fading. Present in all four frames,
  identical. Decorative as far as the file shows — no menu, no variant.

No pressed, hover, focus-ring, disabled or loading variant exists for **any** control in these
four frames.

---

## UNKNOWN

- **Q1.** The file has no prototype wiring between `1:7363`, `1:7595`, `1:7806`, `1:7214`.
  What triggers each transition — is State 2 "focused with no search history", or is it
  "recent list just cleared", or a debounce/loading gap while a query resolves?
- **Q2.** `recent-searches` shows exactly one entry (`BGaming`). What is the maximum number of
  recent entries, and what is the vertical gap between them? `recent-list` is fixed to h=32 in the
  file, so multi-row spacing is unspecified.
- **Q3.** Suggestion title is 14px on row 0 (`Pragmatic Play`) and 15px on row 1
  (`Pragmatic Live`), giving rows of 56 and 57px. Is 15px intentional or a stray override? Which
  size is canonical?
- **Q4.** Where does `Усі провайдери` navigate — a full providers page, or does it just reset the
  search and show the carousel already on screen?
- **Q5.** The 4-segment bar at the bottom of `State not found` (`1:7358`): decorative, a carousel
  page indicator, or a scroll-position indicator? It has no second variant to compare against, and
  it appears only in this one frame even though the carousel exists in all four.
- **Q6.** Frame background colour was not measured. `get_design_context` on the four root frames
  was not run (the returned subtree is too large and the account hit the Figma MCP tool-call rate
  limit). The screenshots show a pale blue page behind the content and a rounded outer container,
  but a screenshot is not a measurement — the exact fill and corner radius of the 390-wide frame
  are unconfirmed.
- **Q7.** `get_variable_defs` was never returned (rate-limited on both attempts). If this file has
  Figma variables/tokens behind these hexes, their names are unknown; every colour above is a raw
  hex read off `get_design_context`.
- **Q8.** Two header icons (`activity_8138338 1`, `Popular`) are `hidden="true"` in all four
  frames. Are they dead layers, or alternates for a header variant that lives elsewhere in the
  file?
