# Top-Win — Area `casino-rows-a`

File key `s2CqwGqe0O0FcALhBNlTRe`. Parent frame `1:3289` (390px wide, mobile-only).
Nodes measured: `1:3414`, `1:3588`, `1:3762`, `1:3964`.

Measurement source: `get_metadata` on all four rows, `get_design_context` on all four
section headers and on the row-1 grid container. The Figma MCP returned
`tool call limit for your Full seat on the Professional plan` before I could pull
design context for the provider badges (`1:3784`) or a screenshot — see UNKNOWN.

---

## 1. The four rows at a glance

| Node | y | h | Title (literal) | Right-hand control | Content |
| --- | --- | --- | --- | --- | --- |
| `1:3414` | 414 | 370 | `Популярне` | chip `Всі (120) ` | 2×3 static game grid |
| `1:3588` | 784 | 370 | `Нові Ігри` | chip `Всі (120) ` | 2×3 static game grid |
| `1:3762` | 1154 | 264 | `Провідні провайдери` | round 40px search button | 2 horizontal provider tracks |
| `1:3964` | 1418 | 370 | `Рекомендовані` | chip `Всі (120) ` | 2×3 static game grid |

All four wrappers are 390 wide and start at x=0.
Each wrapper holds one child named `new-games-section` at y=16 — i.e. **16px top
padding, 0 bottom padding** (16 + section height = wrapper height, exactly, in all four).

---

## 2. Layout — the game-grid rows (`1:3414`, `1:3588`, `1:3964`)

Byte-for-byte identical geometry in all three. Numbers below are from `1:3414`
and were re-checked against `1:3588` and `1:3964` in metadata; every x/y/w/h matches.

```
wrapper 390 × 370
└─ new-games-section  y=16, 390 × 354
   ├─ section-header  x=16, y=0,  358 × 30
   └─ grid-container  x=16, y=46, 358 × 308
```

- Horizontal page padding: **16px** each side (358 = 390 − 32).
- Header → grid gap: **16px** (46 − 30).
- Vertical sum check: 16 + 30 + 16 + 308 = 370. ✔

### Grid

- Outer `grid-container` (`1:3572`) → inner `grid-container` (`1:3573`):
  `flex-col`, **gap 12px**, full width.
- Two rows, each named `grid-row-0`, each 358 × 148. Row 2 starts at y=160 (148 + 12). ✔
- Row: `flex`, **gap 8px**, `items-start`. Three cards at x = 0 / 122 / 244.
  114 × 3 + 8 × 2 = 358. ✔
- **Two lines, 3 cards per line, 6 cards total, all fully visible.**
- **No horizontal scroll.** The row content width equals the container width exactly
  (358 = 358); there is no overflowing track node. Contrast with the provider row below,
  where the track is genuinely wider than its wrapper.

### Card (`1:3575` `Overlay+Shadow` → `1:3576` image frame)

| Property | Value |
| --- | --- |
| Card size | 114 × 148 |
| Card radius | 15px |
| Card background | `rgba(240,243,255,0)` — fully transparent, so the name "Overlay+Shadow" describes intent, not a painted fill in this state |
| Card layout | `flex-col`, `items-center`, `justify-center` |
| Image frame | 114 × 147.5, `min-h`/`max-h` = 147.5 / 780, radius 15px, `overflow-hidden` |
| Image fit | `w-full`, `h-100.75%`, `top: -0.37%` — i.e. the bitmap is very slightly taller than the frame and vertically centred by that offset |

All 6 cards in a row point at the **same** PNG (one asset constant reused six times).

---

## 3. Layout — the provider row (`1:3762`)

```
wrapper 390 × 264
└─ new-games-section      y=16, 390 × 248
   ├─ section-header      x=16, y=0,  358 × 40   ← taller than the other three (30)
   └─ Frame 2135557702    x=16, y=56, 358 × 192
      ├─ Slider-Track-Wrapper 1:3784  y=0,  358 × 96
      │   └─ Row-1 1:3785             420 × 96   ← wider than wrapper
      └─ Slider-Track-Wrapper 1:3874  y=96, 358 × 96
          └─ Row-1 1:3875             420 × 96
```

- Header height **40** (not 30) because the right-hand control is a 40 × 40 circle.
- Header → content gap: **16px** (56 − 40). Same as the grid rows.
- The two track wrappers are stacked with **gap 0** (y=0 and y=96, each h=96).
- Vertical sum check: 16 + 40 + 16 + 192 = 264. ✔

### Horizontal scroll — yes, on this row only

`Row-1` is **420 wide inside a 358-wide wrapper**. That 62px overflow is the scroll
affordance. Wrapper names (`Slider-Track-Wrapper`, `Row-1`) support the same reading.

### Provider badge

| Property | Value |
| --- | --- |
| Badge frame | 80 × 96, at x = 0 / 80 / 160 / 240 / 320 → **gap 0** (spacing is inside the badge) |
| Badges per track | 5 |
| Visible at 358 | 4.475 badges — the 5th is clipped, which is the scroll hint |
| Circle | 72 × 72 at x=4, y=12 inside the badge (4px side inset, 12px top inset) |
| Logo leaf | 44 × 44 at x=14, y=14 inside the circle. Exception: `3-OAKS 1` is **45 × 44 at x=13.5** |
| Row-1 declared width | 420, but the 5 badges total 400 → 20px unaccounted (see UNKNOWN) |

Providers, in order, from the Figma layer names (both tracks carry the same five):
`Pragmatic`, `3 Oaks`, `BGaming`, `Nolimit`, `Spribe`.

---

## 4. Section header — measured tokens

### Title block (`Frame 2135557683`, present in all four)

- `flex`, gap **8px**, `items-center`, height **24**.
- Icon then text.
- Text: Roboto **Medium**, **18px**, `#07134f`, `line-height: normal`,
  `font-variation-settings: "wdth" 100`, `white-space: nowrap`, `word-break: break-word`.

| Row | Icon layer | Icon box | Title text | Title text width |
| --- | --- | --- | --- | --- |
| `1:3414` | `Popular` (`1:3426`) | 14.032 × 20 | `Популярне` | 93 |
| `1:3588` | `new 2` (`1:3738`) | 21 × 20 | `Нові Ігри` | 76 |
| `1:3762` | `new 1` (`1:3776`) | 21 × 20 | `Провідні провайдери` | 181 |
| `1:3964` | `Recomended` (`1:4114`) | 20 × 20, `overflow-clip`, inner Group at `inset-[3.13%]` | `Рекомендовані` | 131 |

Note the layer names lie: the text node in row 1 is *named* `Recent games` but *renders*
`Популярне`. Trust the rendered string, not the layer name.

### Divider (`Vector 100`, all four rows)

- 1px horizontal rule, `flex: 1 0 0`, `min-width: 1px`, `height: 0`,
  drawn as an SVG with `inset: -0.5px 0`.
- Widths (a consequence of the title length, not authored): 136.968 / 147 / 100 / 93.
- Colour: **UNKNOWN** — it is an exported SVG asset, not a hex in the reference code.

### Right-hand control A — "see all" chip (rows `1:3414`, `1:3588`, `1:3964`)

Identical in all three, down to the label.

| Property | Value |
| --- | --- |
| Size | 90 × 30 |
| Background | `#eff6ff` |
| Border | 1px solid `#bfdbfe` |
| Radius | 10px |
| Padding | `px-[4px]`, no vertical padding (fixed h) |
| Layout | `flex`, gap 8px, `items-center`, `justify-center`, `overflow-clip` |
| Label (literal) | `Всі (120) ` — **note the trailing space**, and the count `120` is identical in all three rows |
| Label type | Roboto Regular, 12px, `#1e40af`, `line-height: normal`, `wdth 100`, nowrap |
| Chevron | `chevron-right`, 14 × 14, SVG |
| Header gap | parent header is `flex gap-[8px] items-center` |

### Right-hand control B — search button (row `1:3762` only)

| Property | Value |
| --- | --- |
| Size | 40 × 40 |
| Background | `#edf5ff` (note: **not** `#eff6ff`) |
| Radius | `999px` (pill/circle) |
| Content | `search_header.svg`, 40 × 40, filling the button edge-to-edge (no inner padding) |
| Header gap | this header uses `flex gap-[4px]`, **not** 8px like the other three |

---

## 5. Copy inventory (literal, untranslated)

```
Популярне
Нові Ігри
Провідні провайдери
Рекомендовані
Всі (120)          ← trailing space in the Figma string: "Всі (120) "
```

That is the complete text content of this area. The game cards carry no visible label
text (the layer name `Gates of Olympus 1000` is a layer name, and the artwork is a bitmap);
the provider badges carry no text node at all — the brand is the logo bitmap/vector.

---

## 6. Assets

Do not download; listed for the asset pipeline. URLs from `get_design_context` expire ~7 days.

| # | Node id | Layer | Type | URL |
| --- | --- | --- | --- | --- |
| 1 | `1:3426` | `Popular` icon (row 1) | svg | `https://www.figma.com/api/mcp/asset/80b08b29-0c06-4593-9cff-fb328bb652e2.svg` |
| 2 | `1:3567` | `Vector 100` divider (row 1) | svg | `https://www.figma.com/api/mcp/asset/36e77b81-8c86-4309-a890-ca54ba0efb81.svg` |
| 3 | `1:3570` | `chevron-right` (row 1) | svg | `https://www.figma.com/api/mcp/asset/dd83cb3e-e9d4-48a8-a685-b3a59d2533c7.svg` |
| 4 | `1:3738` | `new 2` icon (row 2) | svg | `https://www.figma.com/api/mcp/asset/ea00531c-a7ed-4060-9bdb-6677684feab7.svg` |
| 5 | `1:3741` | `Vector 100` divider (row 2) | svg | `https://www.figma.com/api/mcp/asset/b77f49ff-9948-4172-b45e-8b01290080b3.svg` |
| 6 | `1:3744` | `chevron-right` (row 2) | svg | `https://www.figma.com/api/mcp/asset/10036b7c-e51f-481c-bdc0-e0209aef04cb.svg` |
| 7 | `1:3776` | `new 1` icon (row 3) | svg | `https://www.figma.com/api/mcp/asset/b604b0ec-6911-4180-9958-9acfd379424f.svg` |
| 8 | `1:3779` | `Vector 100` divider (row 3) | svg | `https://www.figma.com/api/mcp/asset/dc987e99-3299-4a01-b709-48226accc3f0.svg` |
| 9 | `1:3781` | `search_header.svg` | svg | `https://www.figma.com/api/mcp/asset/2dd41f99-9027-4c74-9189-05202b3d1c39.svg` |
| 10 | `1:4115` | `Group` inside `Recomended` icon (row 4) | svg | `https://www.figma.com/api/mcp/asset/2fdc77e5-2816-40ae-bb05-37121581eb68.svg` |
| 11 | `1:4119` | `Vector 100` divider (row 4) | svg | `https://www.figma.com/api/mcp/asset/86c248e1-7463-4c79-a4e7-462bcc5090bd.svg` |
| 12 | `1:4122` | `chevron-right` (row 4) | svg | `https://www.figma.com/api/mcp/asset/b7e9a969-ca77-4194-b89b-81368373a545.svg` |
| 13 | `1:3576` and 5 siblings | `Gates of Olympus 1000` game thumbnail | **png** | `https://www.figma.com/api/mcp/asset/452c0ce3-7377-409e-9396-608133375458.png` |

Deduplicated, the four `Vector 100` exports are the same 1px rule at four widths, and the
three `chevron-right` exports are the same glyph. **Distinct logical assets in this area: 12** —
4 title icons (Popular, new, Recomended; `new 1`/`new 2` are two different files), 1 divider
rule, 1 chevron, 1 search button glyph, 1 game thumbnail, 5 provider logos.

Provider logo URLs were **not** retrieved (rate limit). Their node ids are:

- Pragmatic: `1:3788` (`Frame`, 44 × 44) and duplicate `1:3878`
- 3 Oaks: `1:3799` (`3-OAKS 1`, 45 × 44) and duplicate `1:3889`
- BGaming: `1:3820` (`BGAMING 1`, 44 × 44) and duplicate `1:3910`
- Nolimit City: `1:3843` (`NOLIMIT-CITY 1`, 44 × 44) and duplicate `1:3933`
- Spribe: `1:3871` (`Frame`, 44 × 44) and duplicate `1:3961`

The PNG at #13 is one bitmap reused for all 6 cards in row 1. Rows 2 and 4 have the same
structure and almost certainly reuse it too, but I could not confirm — see UNKNOWN.

---

## 7. Interaction / state signals

1. **"See all" chip carries a count.** `Всі (120) ` in all three grid rows. Identical count
   across rows means the design is placeholder-numbered; the count is a data slot.
2. **Chip is a link/button** — `chevron-right` glyph, `#eff6ff` fill on `#bfdbfe` border.
   No hover/pressed/focus variant exists anywhere in these four nodes. Not designed.
3. **Provider tracks scroll horizontally.** 420px track inside a 358px wrapper, twice.
   No dots, arrows, or scrollbar node in the design.
4. **Hidden icon variants in every header.** Each `Frame 2135557683` carries a stack of
   `hidden="true"` sibling icon frames — `activity_8138338 1`, `new 1`, `Recomended`,
   `crash games`, `Must-play slots`, `Bonus buy`, `megaways`, `jackpots`, `Drops&wins`,
   `wheel-fortune_18604065 1`, `current tournaments`, `Lottery`, `instant games`, `egypt`,
   `Popular`. Only one is visible per row. This is a designer's icon-swap rig, and it is the
   clearest evidence in the file that **the header is one component with an icon prop**, and
   that at least 15 category rows are anticipated beyond the 4 measured here.
5. **Card layer name `Overlay+Shadow`** with a fully transparent fill and no shadow in the
   returned CSS. The name implies a hover/press overlay that is not drawn in this state.
6. No tab, toggle, or selected/unselected variant anywhere in these four nodes.

---

## 8. The one component

**`CasinoGameRow` renders three of the four rows unchanged** — `1:3414`, `1:3588`, `1:3964`
are structurally identical: same wrapper height (370), same padding (16 top, 16 sides),
same header height (30) with an 8px gap, same 16px header→grid gap, same 2×3 grid
(12px row gap, 8px column gap, 114 × 148 cards at radius 15). They differ only in
**title string** and **title icon**. Two props.

The chip label is the same literal in all three, so it is a third prop with a default.

`1:3762` is **not** the same component. Three concrete differences, all measured:

- header height 40 vs 30, and header gap 4px vs 8px
- a 40 × 40 `#edf5ff` circular search button replaces the 90 × 30 `#eff6ff` chip
- two 96px horizontally-scrolling 420px tracks of 80 × 96 badges replace the 2×3 static grid

What it *does* share with the other three: the 390 wrapper, the 16px top padding, the 16px
side padding, the 358 content width, the title block (`flex gap-8 h-24`, Roboto Medium 18px
`#07134f`), the flexible `Vector 100` divider, and the 16px header→content gap.

The lazy split that follows from the measurements: one `SectionHeader` shared by all four
(props: icon, title, right-hand slot), plus `CasinoGameRow` for the three grid rows and a
separate `ProviderRow` for `1:3762`. Do not try to make one component cover all four —
the second one is a different content model, not a variant of the first.

---

## UNKNOWN

1. **Divider colour.** `Vector 100` comes back as an SVG asset in all four rows; no hex
   appears in the reference code. *Question for the owner: what is the stroke colour and
   opacity of the header divider rule?*
2. **Row-1 track width 420 vs 400 of badges.** Five 80px badges occupy 0–400, but `Row-1`
   is declared 420 wide. *Question: is the extra 20px trailing padding on the track, a 6th
   badge that was deleted, or an auto-layout artefact?*
3. **Provider badge fills and radii.** `Circle` (72 × 72) and the badge background — no
   design context retrieved. *Question: what is the circle fill, border, and shadow on a
   provider badge, and is `Circle` a true circle (radius 36 / 999px)?*
4. **Provider logo asset URLs.** Node ids listed above; URLs not fetched.
5. **Rows 2 and 4 card artwork.** Confirmed only for row 1 that all six cards share one PNG.
   Rows 2 and 4 have identical structure and identical layer names, but their image URLs
   were not retrieved. *Question: do rows 2 and 4 use different thumbnails, or is the whole
   design placeholdered with one image?*
6. **Why the two provider tracks are identical.** Both `Slider-Track-Wrapper` nodes contain
   the same five providers in the same order. *Question: are these two distinct data rows
   that happen to be placeholdered identically, or is the second one a duplicate to be
   deleted?*
7. **Reason the tool ran out.** `get_design_context` on `1:3784`, `1:3749`, `1:4127` and
   `get_screenshot` on `1:3762` all returned
   `You've reached the Figma MCP tool call limit for your Full seat on the Professional plan`.
   Items 3–6 are answerable by re-running exactly those four calls once quota resets.
8. **No screenshot was ever obtained** for this area. Everything above is from metadata
   geometry and generated reference code — measured, but never visually confirmed.
