# Top-Win — casino-rows-b

File key `s2CqwGqe0O0FcALhBNlTRe`, parent frame `1:3289`, viewport 390 px wide.
Nodes measured: `1:4140`, `1:4340`, `1:4545`, `1:4714`.

Measured = read out of `get_metadata` / `get_design_context` / a rendered screenshot.
Reasoning = stated as such. Nothing here is filled in by guess.

`get_variable_defs` on `1:4140` returned `{}` — **this subtree binds no Figma variables**.
Every colour/size below is a raw literal in the file, not a token. (Measured.)

---

## 1. Row inventory at a glance

| Node | y | h | Section name | Ukrainian title | Icon node | See-all pill | Body |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `1:4140` | 1788 | 370 | `new-games-section` `1:4141` | `Краш Ігри` | `1:4290` "crash games" | `Всі (120) ` | 3×2 game grid |
| `1:4340` | 2158 | 370 | `new-games-section` `1:4341` | `Варто спробувати` | `1:4490` "Must-play slots" | `Всі (120) ` | 3×2 game grid |
| `1:4545` | 2528 | **276** | `new-games-section` `1:4546` | `Поточні Турніри` | `1:4695` "current tournaments" | **none** | **single tournament banner** |
| `1:4714` | 2804 | 370 | `new-games-section` `1:4715` | `Megaways` | `1:4864` "megaways" | `Всі (120) ` | 3×2 game grid |

**`1:4545` is the odd one out and needs its own component.** It is not a game-card grid: it is one
358×220 dark promo/tournament card with a countdown and a CTA button. Its header also has no
see-all pill and is 24 px tall instead of 30 px. Details in §4.

The other three are byte-for-byte the same structure — same paddings, same grid, same pill, same
literal count `120`. One `GameRow` component with `{icon, title, count, games[]}` covers all three.
(Reasoning, from three identical `get_design_context` dumps.)

---

## 2. Layout — the three grid rows (`1:4140`, `1:4340`, `1:4714`)

Outer frame 390 × 370. Inner `new-games-section` sits at **y = 16, h = 354** → 16 px lead-in gap
above the section, 0 px after it. Consecutive rows therefore read as 16 px separated.

`new-games-section`: `flex-col`, `gap 16`, `padding-inline 16`, width 390 → content width **358**.

### 2.1 section-header (358 × 30)
`flex-row`, `gap 8`, `align-items: center`.

| Part | Node (row `1:4140`) | Geometry |
| --- | --- | --- |
| title group | `1:4143` | h 24, `flex-row gap 8 items-center`, hugs width |
| ↳ icon | `1:4290` | 20 × 20, `overflow: clip` |
| ↳ title text | `1:4318` | h 21, baseline y 1.5 inside the 24 group |
| divider rule | `1:4319` | `flex: 1 0 0`, h 0, drawn 1 px (`inset -0.5px 0`) |
| see-all pill | `1:4320` | 90 × 30, x 268 |

Title-group widths differ per row because the label differs (measured):
`1:4143` = 112, `1:4343` = 180, `1:4717` = 115.
Divider width absorbs the rest: 140 / 72 / 137 respectively, always ending at x 260 (pill starts 268).

### 2.2 see-all pill ("Event filter") — identical in all three rows
```
w 90  h 30   radius 10
bg      #EFF6FF
border  1px solid #BFDBFE
padding-inline 4   gap 8   justify-center align-center   overflow: clip
label   "Всі (120) "   Roboto Regular 12px  #1E40AF   line-height normal
chevron 14 × 14 (chevron-right)
```
Literal label text is `Всі (120) ` — **with one trailing space** before the closing brace in the
Figma text node. All three rows carry the exact same count `120`. (Measured.)

### 2.3 grid-container
Two nested frames with the same 358 × 308 box: `1:4324` (outer, `flex-col`, no gap) wraps
`1:4325` (inner, `flex-col`, **gap 12**). The outer wrapper adds nothing — collapse it in code.

- 2 rows × 3 cards. Row 1 at y 0, row 2 at y 160 → **row gap 12**.
- Row is `flex-row`, **gap 8**, `items-start`, width 358.
- Card x positions: 0, 122, 244 → **114 + 8 + 114 + 8 + 114 = 358 exactly**.

**No horizontal scroll.** The three cards fill the content width to the pixel and the second line
wraps below. This is a two-line static grid, not a carousel. (Measured: exact width arithmetic,
confirmed on the screenshot of `1:4140` — six full cards, no clipped seventh.)

### 2.4 game card (`Overlay+Shadow` → `Gates of Olympus 1000`)
```
outer  114 × 148   radius 15   bg rgba(240,243,255,0)   flex-col items-center justify-center
inner  114 × 147.5 radius 15   min-h 147.5  max-h 780
img    width 100%  height 100.75%  top -0.37%  left 0   (overflow hidden on the radius box)
```
The wrapper is literally named `Overlay+Shadow` but the returned code carries **no box-shadow and a
fully transparent background** (alpha 0). See UNKNOWN #2.

Card art in every slot of every row is the same placeholder: *Gates of Olympus 1000 / Pragmatic
Play*. (Measured on the `1:4140` screenshot; the node name repeats identically in `1:4340` and
`1:4714`.)

---

## 3. Tokens (exact literals)

### Colours
| Hex / rgba | Where |
| --- | --- |
| `#07134F` | section title text, all four rows |
| `#EFF6FF` | see-all pill background |
| `#BFDBFE` | see-all pill 1 px border |
| `#1E40AF` | see-all pill label |
| `rgba(240,243,255,0)` | game-card wrapper background (transparent) |
| `#11111A` | tournament card background |
| `rgba(255,255,255,0.08)` | tournament card 1 px border |
| `#FF8700` | tournament title |
| `#FFFFFF` | tournament subtitle, CTA label, timer value |
| `rgba(255,255,255,0.8)` | timer label |
| `rgba(242,193,70,0.5)` | join-timer pill background |
| `#FF8C00` → `#FF4500` | CTA linear gradient, to right |
| `rgba(255,69,0,0.33)` | CTA drop shadow colour |
| `rgba(255,255,255,0.25)` | CTA inset top highlight |

### Type
| Role | Family / weight | Size | Extra |
| --- | --- | --- | --- |
| Section title | Roboto Medium (500) | 18 | `line-height: normal`, `font-variation-settings: "wdth" 100`, nowrap |
| See-all label | Roboto Regular (400) | 12 | `line-height: normal`, `"wdth" 100`, nowrap |
| Tournament title | Inter Bold (700) | 28 | `letter-spacing: -0.5px`, `line-height: normal` |
| Tournament subtitle | Inter Medium (500) | 13 | `line-height: normal` |
| CTA label | Inter SemiBold (600) | 13 | `line-height: 19px`, `letter-spacing: -0.26px` |
| Timer label | Inter Regular (400) | 10 | `line-height: normal` |
| Timer value | Inter ExtraBold (800) | 11 | `line-height: normal` |

Two families in this area: **Roboto** for the section chrome, **Inter** for everything inside the
tournament card. (Measured.)

### Radii
`10` see-all pill · `15` game card (outer and inner) · `6` CTA button and join-timer pill ·
`24` tournament card and its image layer.

### Shadows / effects
- CTA button: `drop-shadow(0px 8px 12px rgba(255,69,0,0.33))` **plus** `inset 0px 1px 0px 0px rgba(255,255,255,0.25)`.
- join-timer pill: `backdrop-filter: blur(2px)`.
- Nothing else in this area declares a shadow.

### Spacing scale actually used
`4` (pill padding-inline) · `6` (title↔subtitle gap, radius) · `8` (header gap, title-group gap, card column gap, pill inner gap) · `12` (grid row gap) · `16` (section gap, section padding-inline, top lead-in) · `20` (tournament card padding).

---

## 4. `1:4545` — tournament block (needs its own component)

Outer 390 × 276 at y 2528. `new-games-section` `1:4546` at y 16, h 260, `flex-col gap 16 px-16`.

### 4.1 Header (358 × **24**)
Icon `1:4695` (20×20, trophy — inner group named `_x32_0_Trophy`) + title `Поточні Турніри`
(Roboto Medium 18, `#07134F`, w 135) + divider `1:4700` from x 171, width 187, y 12.
**No see-all pill and no count.** (Measured — no `Event filter` node exists in this subtree.)

### 4.2 Card `1:4701` (358 × 220)
```
bg #11111A   border 1px solid rgba(255,255,255,0.08)   radius 24   overflow: clip
flex-col  items-start  justify-end
```
- **Image layer** `1:4702`: 358 × 220, radius 24, absolutely centred (`left/top 50%`, translate -50%).
  The bitmap inside is heavily cropped: `width 273.72%`, `height 128.21%`, `left -102.53%`, `top -28.18%`.
- **`card-text-container`** `1:4703`: fills the card, `padding 20`, `flex-col justify-end`.
- **`Frame 2135557687`** `1:4704`: x 20, y 20, 303 × 180, `flex-col justify-between`, h 180.

  - **Text block** `1:4705` — 190 × 140, `flex-col gap 6`:
    - `tournament-title` `1:4706`, 190 × 102, two paragraphs in one text node:
      `СПІН-ЧЕЛЕНДЖ` and `2000`. At 28 px inside a 190 px box the first paragraph wraps at the
      hyphen, so it renders on **three visual lines**: `СПІН-` / `ЧЕЛЕНДЖ` / `2000`.
      (Measured on the screenshot; the 102 px height is 3 lines.)
    - `tournament-subtitle` `1:4707`, 190 × 32, y 108:
      `Найкращі слоти, великі виграші!` — wraps to two lines in the 190 px box.

  - **`join-timer-pill`** `1:4708` — y 146, 303 × 34:
    ```
    bg rgba(242,193,70,0.5)  backdrop-blur 2px  radius 6
    padding: 6px 10px 6px 2px   gap 8   items-center
    ```
    - `Button` instance `1:4709` (x 2, y 2, 116 × 30) — a **component instance**, label node
      `I1:4709;112:330`. Gradient `#FF8C00 → #FF4500` left→right, radius 6, padding 8/16,
      drop shadow + inset highlight as listed above. Label: `Приєднатися`.
    - `Line` `1:4710` at x 126 — a 16 px rule rotated 90° (vertical separator), 1 px.
    - `timer-group` `1:4711` at x 134, y 10.5, 159 × 13, `flex-row gap 4 items-center`:
      - `time-label` `1:4712`: `Залишилось часу`
      - `time-value` `1:4713`: `08:12:36:35`

---

## 5. Copy — literal Ukrainian strings (not translated)

```
Краш Ігри
Варто спробувати
Поточні Турніри
Megaways
Всі (120) 
СПІН-ЧЕЛЕНДЖ
2000
Найкращі слоти, великі виграші!
Приєднатися
Залишилось часу
08:12:36:35
```
`Megaways` is Latin script in the source — it is not a transliteration mistake.
`Всі (120) ` carries a trailing space.

---

## 6. Assets (node id → URL returned by `get_design_context`; **not downloaded**)

URLs expire ~7 days from this pass. Every request re-exports and returns a *different* URL for the
same node, so these are one-shot handles, not stable identifiers.

### Row `1:4140` — Краш Ігри
| Node | Name | URL |
| --- | --- | --- |
| `1:4292` | crash-games icon, Group 1/13 | `https://www.figma.com/api/mcp/asset/8f953b7b-8f6b-448f-86e5-e67ff2542e49.svg` |
| `1:4294` | Group 2/13 | `.../51ee9228-046b-42ea-a53f-0f8ff4148176.svg` |
| `1:4296` | Group 3/13 | `.../bca9284f-bd84-407c-8b3e-ef0df3620bd8.svg` |
| `1:4298` | Group 4/13 | `.../499022ed-2dcd-4e11-b530-8e71b56df06d.svg` |
| `1:4300` | Group 5/13 | `.../bc3be9c0-88f5-4a8a-b48e-021e53d0d279.svg` |
| `1:4302` | Group 6/13 | `.../f7be86ef-53ac-4d60-af9e-a6bef48cedea.svg` |
| `1:4304` | Group 7/13 | `.../998b937a-76b1-4fa6-83d3-f5a7fc5abaf1.svg` |
| `1:4306` | Group 8/13 | `.../45522f8b-aced-4e1f-aa49-0f00e142c283.svg` |
| `1:4308` | Group 9/13 | `.../1670144e-22f4-4dc4-a864-039a0bf3557d.svg` |
| `1:4310` | Group 10/13 | `.../af1eb3f1-fb2f-4ac8-88f5-dfa467ba0ad4.svg` |
| `1:4312` | Group 11/13 | `.../787fe0ec-d94a-45d2-912c-0da10887d8f4.svg` |
| `1:4314` | Group 12/13 | `.../2e97aece-0c51-4b1e-802f-c8655526458f.svg` |
| `1:4316` | Group 13/13 | `.../c31cecb9-1375-4328-84ce-a101cf92cea9.svg` |
| `1:4319` | divider rule | `.../cf24633f-01d8-4401-9658-f18daafa80f4.svg` |
| `1:4322` | chevron-right | `.../9282c098-20ce-45dd-ac51-9179a1552ca6.svg` |
| `1:4328` … `1:4339` | game art, all 6 cards | `.../984b82ee-7986-4c19-b3e4-422d184dfbdc.png` (one URL reused for all six) |

**The `crash games` icon exports as 13 separate SVG fragments**, absolutely positioned inside a
20×20 clip box. Do not stitch these by hand — re-export node `1:4290` as one flat SVG. (Reasoning:
13 `<img>` layers for a 20 px glyph is the exact pathology `scripts/clean-svg.mjs` exists for.)

### Row `1:4340` — Варто спробувати
| Node | Name | URL |
| --- | --- | --- |
| `1:4500`,`1:4502`,`1:4504` | mask shape (shared) | `.../c4466213-d342-4586-b13a-35a1363f76cd.svg` |
| same | fill (shared) | `.../b4e5af74-47c1-4e7c-a709-364274c18eee.svg` |
| `1:4511` | mask 2 (shared) | `.../efa18f75-5dcd-4143-8cf9-ae99b08accf5.svg` |
| `1:4511` | g2833 fill | `.../0e9971ab-5775-41e1-ab28-3e7f81b986ce.svg` |
| `1:4513` | g2837 fill | `.../0efcf949-3220-4857-a667-a91f99e154bc.svg` |
| `1:4515` | g2841 fill | `.../f8bf6df7-2657-469b-8fd6-bba9155bcc3f.svg` |
| `1:4517` | g2845 fill | `.../0188acfe-08fa-4cd7-a414-fa3d4e5bae2c.svg` |
| `1:4519` | g2849 fill | `.../26968708-370e-4e96-9787-25a14907cb27.svg` |
| `1:4521` | g2853 fill | `.../862ee0d3-7541-4d79-a027-b78435d7c5c7.svg` |
| `1:4524` | divider rule | `.../aac96cab-fbe5-4bb3-a494-c15a49db4e37.svg` |
| `1:4527` | chevron-right | `.../463ee69e-e37f-4316-9fdf-f6148c0023ce.svg` |

**The `Must-play slots` icon is the worst asset in this area**: 9 SVG fragments composed through
CSS `mask-image`, `container-type: size`, `-rotate-180` and `-scale-x-100`. Reproducing that markup
is not viable — re-export node `1:4490` as a single flat SVG.

### Row `1:4545` — Поточні Турніри
| Node | Name | URL |
| --- | --- | --- |
| `1:4697` | trophy icon (single SVG) | `.../b13c012d-5dc6-4ca9-9c31-6738270c323a.svg` |
| `1:4700` | divider rule | `.../527198c2-4f6e-4bbf-b82d-2f90c346a3b6.svg` |
| `1:4702` | tournament background art | `.../494d1aea-16a2-4191-9c28-452e98ec5ab9.png` |
| `1:4710` | vertical separator line | `.../32b26471-74f1-4159-9885-a047b3b61da5.svg` |

### Row `1:4714` — Megaways
| Node | Name | URL |
| --- | --- | --- |
| `1:4864` | megaways icon (single SVG) | `.../a3fde02b-d3c4-422f-b2a2-0d187e407f7d.svg` |
| `1:4867` | divider rule | `.../f5b52097-908c-43c3-b791-771dac6933ce.svg` |
| `1:4870` | chevron-right | `.../8728c7f4-ad51-4d62-a66e-43c445d405cc.svg` |
| `1:4876` | game art (card 1; probe on `1:4875`) | `.../37b95c3e-6394-4241-9037-93d8f92523f3.png` |

Distinct asset count for this area (dedup by node, treating each multi-fragment icon as one icon):
4 section icons + 1 chevron (repeated 3×) + 1 divider rule (repeated 4×) + 1 game tile bitmap
(repeated 18×) + 1 tournament bitmap + 1 separator line = **9 distinct assets**.

Screenshots saved next to this file for reference:
`_shot-1-4140.png`, `_shot-1-4545.png` (both in the same directory).

---

## 7. Interaction / state implied

- **See-all pill** (`Всі (120) ` + chevron-right) — a link/button to the full category listing.
  No hover, focus, or pressed variant exists in the file for it. (Measured: only one state node.)
- **Game card** — the wrapper name `Overlay+Shadow` and the `pointer-events-none` on the image
  layer imply a hover/press overlay was intended, but no second variant is present.
- **`Приєднатися` button** — a **component instance** (`1:4709`, label `I1:4709;112:330`), so a real
  component with possible variants lives elsewhere in the file. Its variant set was not inspected.
- **`08:12:36:35`** — a live countdown, format `DD:HH:MM:SS`. It is a static text node in Figma;
  whether the demo should tick is a product decision, not something the file states.
- **No tab, toggle, carousel, or horizontal scroll anywhere in these four rows.** The three grids
  are static 3×2 blocks; the tournament block is a single card. (Measured — exact width arithmetic
  plus the `1:4140` screenshot.)

---

## 8. UNKNOWN

1. **Divider rule colour.** `Vector 100` is exported as an SVG asset, so its stroke never appears as
   a hex in the returned code. *Question for the owner: what is the stroke colour and width of the
   header divider rule — is it the same value in all four rows?*
2. **`Overlay+Shadow` has no shadow.** The wrapper's background is `rgba(240,243,255,0)` (alpha 0)
   and no `box-shadow` is emitted. *Question: is the layer name stale, or is there a shadow/overlay
   effect that should be on the game card and is currently switched off?*
3. **Card art image URL for row `1:4340` was never fetched.** The `get_design_context` call on
   `1:4532` was refused three times with the Figma MCP rate limit
   ("reached the Figma MCP tool call limit for your Full seat"). The node name and geometry are
   identical to the other rows, so the art is very probably the same placeholder — but that is
   inference, not measurement. *Question: re-probe `1:4532` when quota allows.*
4. **All three counts are literally `120`.** Placeholder, or does each category genuinely show 120?
   *Question: should the count be per-category real data?*
5. **`Приєднatися` button variants.** The instance points at a component outside this subtree; its
   variant set (size / state / disabled) was not opened. *Question: which component is
   `112:330` and does it define hover/pressed states we should honour?*
6. **Tournament card image crop.** The bitmap is placed at 273.72% width / 128.21% height with a
   large negative offset. That is a crop of a much wider source image. *Question: is the exported
   PNG the already-cropped 358×220 view, or the full-bleed source that must be re-cropped in CSS?*
7. **Roboto vs Inter split.** Section chrome is Roboto, tournament card is Inter. *Question:
   intentional, or did the tournament card get pasted in from another file?*
