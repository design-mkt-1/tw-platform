# Top-Win — casino-top (frame 1:3289 "Pre log", 390 × 5628.7)

File key: `s2CqwGqe0O0FcALhBNlTRe`

## Probe coverage — read this first

| Node | `get_metadata` | `get_design_context` |
| --- | --- | --- |
| 1:3290 header | OK | OK |
| 1:3302 hero | OK | OK |
| 1:3335 navbar | OK | **FAILED — quota** |
| 1:3391 ticker | OK | **FAILED — quota** |

The Figma MCP server returned, on the 5th and every subsequent call:

```
You've reached the Figma MCP tool call limit for your Full seat on the Professional plan.
```

Retried once on `get_design_context` (1:3335), once on `get_screenshot` (1:3335), once on
`get_variable_defs` (1:3335) — same error every time. The limit is account-wide, not per-tool.

**Consequence:** for the navbar and the ticker this document carries geometry (x/y/w/h) and
layer names only. Every hex colour, font, weight, size, radius, border and asset URL in those
two sections is UNKNOWN. Copy in those two sections is taken from **Figma layer names**, which
Figma auto-populates from the text content but a designer can override — treat it as strong
evidence, not proof. Re-run `get_design_context` on 1:3335 and 1:3391 when quota resets.

---

## 1. Header — `1:3290` "Header postlog" (390 × 60, y = 0)

MEASURED via get_design_context.

- Background `#E8F1FC`. Flex column, items center, justify center.
- Horizontal padding **16px**.
- Vertical: metadata puts child `1:3291` at **y = 12, h = 36** → 12 top / 12 bottom. The
  generated code says `py-[14px]`. 12 + 36 + 12 = 60 matches the frame height; 14 + 36 + 14 = 64
  does not. Trusting metadata (12px); logged as a discrepancy under UNKNOWN.

### Row `1:3291` "Frame 578" — 358 × 36, flex row, justify-between, items center

**Logo** `1:3292` "Logo TopWin" — 111 × 20, y = 8 inside the 36px row (vertically centred).
SVG asset.

`1:3293` "Logo" — 88 × 24, **`hidden="true"`**. A second logo exists in the file but is not
rendered. No asset URL was returned for it (hidden nodes are not exported).

**Button group** `1:3294` "btns" — x = 160, 198 × 36, flex row, **gap 8px**, items center.

| Node | Size | Style | Copy |
| --- | --- | --- | --- |
| `1:3295` btn | 60 × 36 | bg `#EDF5FF`, radius **8px**, padding `6.606px 8px` | `Увійти` |
| `1:3297` btn | 86 × 36 | radius **6px**, linear-gradient to right `#FF8C00` → `#FF4500`, padding 8px | `Реєстарція` |
| `1:3299` Button | 36 × 36 | bg `#EDF5FF`, radius **999px**, `overflow: clip` | search icon |

- `1:3297` shadows: outer `drop-shadow(0px 8px 12px rgba(255,69,0,0.33))`; inner
  `inset 0px 1px 0px 0px rgba(255,255,255,0.25)`.
- `1:3299` contains `1:3300` "search_header.svg" at **40 × 40, offset (−2, −2)** inside the
  36 × 36 clip — the SVG is deliberately 2px oversized on every edge. Preserve outer 36 /
  leaf 40 separately.

### Header type

| Node | Font | Weight | Size | Colour | Tracking | Transform | Line-height |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `1:3296` `Увійти` | Outfit SemiBold | 600 | 13px | `#102A67` | −0.2px | capitalize | normal |
| `1:3298` `Реєстарція` | Outfit SemiBold | 600 | 13px | `#FFFFFF` | −0.2px | capitalize | normal |

`Реєстарція` is spelled exactly that way in the design (letters а/р transposed vs the correct
Ukrainian `Реєстрація`). Recorded character-for-character, not corrected. Ask the owner.

Both label text boxes are 16px tall and centred: `1:3296` at (8, 10) size 44 × 16,
`1:3298` at (8, 10) size 70 × 16.

Named styles reported for this node: **Orange `#FF4500`**, **Navy `#191970`**. `#191970` does
not appear in any rendered header property — it is a defined style, not an applied one here.

---

## 2. Hero — `1:3302` "Frame 2135557699" (375 × 232, x = 7.5, y = 60)

MEASURED via get_design_context.

**It is a carousel, not a single banner.** Evidence: a fixed-width horizontal track wider than
the viewport, sitting inside an `overflow-clip` 390px window, with a progress-bar indicator
below it.

### Structure and exact geometry

```
1:3302  375 × 232   pt 24, pb 16, flex col, items center, justify center
└ 1:3303  390 × 192  x = −7.5 (→ absolute x = 0), flex col, gap 16, items center
  ├ 1:3304 hero-section  390 × 172   overflow: clip
  │ └ 1:3305 track       718 × 170   absolute, left 0, top 50%, translateY(−50%),
  │                                   flex row, gap 4, items center, padding-left 16
  │   ├ 1:3306 slide A   340 × 170   x = 16
  │   └ 1:3318 slide B   340 × 170   x = 360
  └ 1:3330 dots          358 × 4     x = 16, flex row, gap 4, justify-end, px 16
```

Wrapper `1:3302` is **375 wide but its content is 390 wide** and starts at x = −7.5 relative
(absolute x = 0). The design bleeds past its own wrapper. Build the section full-bleed 390.

### Slides and peek

- **2 slide nodes exist** (`1:3306`, `1:3318`). Both are named "WELCOME Sport bonus UA", both
  carry the same background image and the same copy.
- Slide width **340**, gap **4**, left inset **16**.
- Slide A occupies x 16–356. Slide B starts at x = 360. The 390px window cuts it at 390, so
  **the next slide peeks in by exactly 30px** (390 − 360).
- Track declared width is **718**, but 16 + 340 + 4 + 340 = **700**. 18px of the track is
  unaccounted for. Listed under UNKNOWN.

### Slide A `1:3306` — 340 × 170, `background: #000000`, radius **12px**, `overflow: clip`

| Layer | Node | Position (in slide) | Size |
| --- | --- | --- | --- |
| bg image | `1:3307` | (−258, −35) | 700 × 217 |
| promo badge | `1:3310` | (16.5, 18) | 178 × 21.847 |
| title block | `1:3312` | (16.5, 58) | 131 × 42.318 |
| CTA | `1:3308` | (17, 121) | 130 × 28 |

- **bg image** `1:3307`: PNG, drawn inside a clip at `left: 0.02%; width: 99.98%; height: 100%`.
- **promo badge** `1:3310`: linear-gradient to right `rgba(255,140,0,0.15)` →
  `rgba(255,69,0,0.15)`; border `0.553px solid rgba(255,140,0,0.25)`; radius `552.388px`;
  padding `4.424px 4px`; box-shadow `0 0 6.635px rgba(255,140,0,0.12), 0 2.212px 6.635px rgba(0,0,0,0.25)`.
  - text `1:3311`: Outfit ExtraBold 800, colour `#FFAE00`, uppercase, letter-spacing `0.5529px`,
    line-height normal. Mixed sizes in one string: the two `✦` glyphs at **7.741px**, the
    words at **10px**.
  - literal copy, three runs: `✦ ` + `вітальний пакет казіно` + ` ✦`
- **title block** `1:3312`: flex column, gap 8, items start, width 131.
  - row `1:3313` (131 × 19): flex row, gap **2**, items center. Outfit **Bold** 700, **15px**,
    `#FFFFFF`, uppercase, line-height normal.
    - `1:3314` = `₴250.000` (70 × 19)
    - `1:3315` = `+ 250 fS` (59 × 19)
  - wager badge `1:3316` (70.847 × 15.318, y = 27): bg `rgba(255,149,0,0.1)`, radius `3.318px`,
    padding `1.659px 4.424px`, justify center.
    - `1:3317` = `20X WAGER` — **Inter** Bold 700, 10px, `#FFAE00`, uppercase,
      letter-spacing `0.2765px`, line-height normal.
- **CTA** `1:3308`: 130 × 28, radius **6px**, linear-gradient to right `#FF8C00` → `#FF4500`,
  padding `8px 16px`, `drop-shadow(0 8px 12px rgba(255,69,0,0.33))`,
  `inset 0 1px 0 rgba(255,255,255,0.25)`.
  - `1:3309` = `отримати бонус` — Outfit **Bold** 700, **12px**, `#FFFFFF`, centred,
    letter-spacing −0.2px, **capitalize**.

### Slide B `1:3318` — same copy, different metrics

Identical background asset, identical strings. Differences worth recording because they change
the render:

| | Slide A | Slide B |
| --- | --- | --- |
| CTA node | `1:3308` (17, 121) 130 × 28 | `1:3320` (20.5, 127) **123 × 28** |
| CTA font-size | 12px | **10px** |
| CTA text-transform | capitalize | **uppercase** |
| promo badge | (16.5, 18) w 178, px **4** | `1:3322` (20, 18) w **189.906**, px **9.953** |
| title block y | 58 | `1:3324` y **64** |
| title vertical anchor | `top: calc(50% − 5.84px)` | `top: calc(50% + 0.16px)` |

Everything else (gradients, shadows, radii, colours, font families/weights) is identical.
Slide B reads as an un-normalised duplicate of slide A rather than a second, distinct offer.

### Carousel indicator `1:3330` — NOT dots

Four rounded bars, height 4, radius 2, gap 4, **right-aligned** (`justify-end`) inside a
358-wide box with 16px horizontal padding (→ 326 usable, content spans x 242–342 within the
358 box, i.e. flush right).

| Order | Node | Width | Fill |
| --- | --- | --- | --- |
| 1 | `1:3331` | **40px** | `#1E3A8A` |
| 2 | `1:3332` | **24px** | `#3B82F6` |
| 3 | `1:3333` | **16px** | `#F97316` |
| 4 | `1:3334` | **8px** | `#FED7AA` |

Interaction implication: 4 bars → **4 slides intended**, but only 2 slide nodes exist. Widths
decrease monotonically and each bar has a different colour, which is not how an active/inactive
pair normally reads. All four hexes are stock Tailwind values (blue-900, blue-500, orange-500,
orange-200). Which bar means "current" is UNKNOWN.

---

## 3. Category navbar — `1:3335` (390 × 44, y = 292)

GEOMETRY MEASURED via get_metadata. **All colours, fonts, radii and icon URLs UNKNOWN** —
`get_design_context` was refused by the quota limit.

```
1:3335 navbar             390 × 44
└ 1:3336 Frame …758       358.2257 × 44   x = 0
  └ 1:3337 Category switcher  502 × 44    x = 16
```

**It scrolls horizontally.** The chip row is **502px** wide inside a 390px frame. 112px of chips
sit off-screen to the right with no wrap container — a horizontal scroller, not a wrapped row.
Note the odd intermediate width 358.2257 on `1:3336`; it does not clip `1:3337` (which is a
child positioned at x = 16 and 502 wide), so the overflow is real.

### 4 chips, all 36px tall, all at y = 4 (→ 4px vertical inset top and bottom), no gap between them

| # | Node | x (in switcher) | Width | Icon node | Icon size | Text node | Copy | Text w × h |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `1:3338` **"Active category"** | 4 | 121 | `1:3340` "Popular" | 11.2257 × 16 | `1:3342` | `Популярне` | 70 × 18 |
| 2 | `1:3343` "Category" | 125 | 121 | `1:3345` "Must-play slots" | 16 × 16 | `1:3378` | `Слоти` | 40 × 18 |
| 3 | `1:3379` "Category" | 246 | 121 | `1:3381` "live-streaming_13013279 1" | 16 × 16 | `1:3384` | `лайв Казіно` | 77 × 18 |
| 4 | `1:3385` "Category" | 367 | **131** | `1:3387` "live-streaming_13013279 1" | 16 × 16 | `1:3390` | `лайв Казіно` | 77 × 18 |

4 + 121 + 121 + 121 + 131 = 502 ✓. Chips are flush (chip 2 starts exactly where chip 1 ends).

**Chip 4 duplicates chip 3** — same layer name, same icon node name, same copy `лайв Казіно`,
only the width (131 vs 121) and internal x-offset differ. Almost certainly an unfinished
placeholder; a real fourth category (Live? Table? Bonus Buy?) is missing.

Capitalisation is inconsistent in the source: `Популярне` and `Слоти` are sentence-case,
`лайв Казіно` is lower-then-upper. Reproduced literally.

### Inner row geometry (icon + label), all rows y = 9, height 18

| Chip | Row node | Row x | Row w | Icon→text gap |
| --- | --- | --- | --- | --- |
| 1 | `1:3339` | 15.8872 | 89.2257 | **8** (19.2257 − 11.2257) |
| 2 | `1:3344` | 29.5 | 62 | **6** (22 − 16) |
| 3 | `1:3380` | 11 | 99 | **6** |
| 4 | `1:3386` | 16 | 99 | **6** |

The gap is 6px on three chips and 8px on the active one. Either the "Popular" icon's 11.2257px
box sits inside a wider 14px layout slot, or the active chip uses a different gap. Cannot be
resolved without `get_design_context`. Listed under UNKNOWN.

Rows are horizontally centred in their chips: chip 3 = (121 − 99)/2 = 11 ✓; chip 4 =
(131 − 99)/2 = 16 ✓; chip 2 = (121 − 62)/2 = 29.5 ✓; chip 1 = (121 − 89.2257)/2 = 15.887 ✓.

### Active state

The only evidence is the layer name: `1:3338` is **"Active category"**, the other three are
"Category". Both variants are 36px tall and 121px wide with identically centred contents, so
**the active state is a paint difference, not a layout difference** — a fill and/or a border on
the 121 × 36 chip box, plus probably a different label/icon colour. The actual fill, radius and
text colour were not retrieved. UNKNOWN.

---

## 4. Recent wins ticker — `1:3391` "Recent wins - Ticker (iOS)" (390 × 78, y = 336)

GEOMETRY MEASURED via get_metadata. **All colours, fonts, radii, divider colour and thumbnail
asset URLs UNKNOWN** — quota.

### It scrolls / marquees

Three entries laid out left-to-right. Entry 3 spans x **341 → 482**, i.e. **92px past the
390px frame edge**. Content deliberately runs off the right edge with no wrap — a marquee or
horizontal scroll row. The "(iOS)" in the frame name suggests a platform-specific variant
exists elsewhere in the file (not probed).

### Entries

| # | Node | x | Width | Thumbnail node | Thumb label |
| --- | --- | --- | --- | --- | --- |
| 1 | `1:3392` | 16 | **147** | `1:3394` | `Big Bass Amazon Xtreme` |
| 2 | `1:3400` | 188 | 141 | `1:3402` | `Yeti Quest` |
| 3 | `1:3407` | 341 | 141 | `1:3409` | `Yeti Quest` |

All entries: y = 16, height 58.
Vertical padding is **asymmetric**: 16 top, 78 − 16 − 58 = **4 bottom**.

### One entry contains exactly 4 things

Taking entry 1 `1:3392` (147 × 58) as the reference:

```
1:3393 Game thumbnail   (4, 6)   46 × 46      ← wrapper, 4px left / 6px top inset
  └ 1:3394              (0, 0)   46 × 46      ← the image, named after the game
1:3395 Content          (62, 2)  75 × 54
  ├ 1:3396  y = 0   59 × 22   "41.04 GBP"                 ← amount, largest type
  ├ 1:3397  y = 24  46 × 14   "le****et"                  ← masked username
  └ 1:3398  y = 40  90 × 14   "у Big Bass Amazon Xtreme"  ← game name, prefixed "у "
```

So: thumbnail + amount + masked player + game name. Content starts at x = 62 → gap from the
46px thumbnail (which ends at 4 + 46 = 50) is **12px**.

The game-name line `1:3398` is **90px wide inside a 75px Content box** — it overflows its
parent by 15px. Entry 2's `у Yeti Quest` is 62 wide and fits. Whether the design intends
truncation/ellipsis on long game names is UNKNOWN.

### Entry 2 vs entry 3 — inconsistent internal rhythm

| | Entry 2 `1:3400` | Entry 3 `1:3407` |
| --- | --- | --- |
| Content box | `1:3403` (62, 2) 75 × 54 | `1:3410` (62, **0**) 75 × **58** |
| amount y | 0 | 0 |
| username y | 24 | **26** |
| game name y | 40 | **44** |
| game name w | 62 | **67** |

Same strings (`37.5 GBP`, `le****et`, `у Yeti Quest`), different vertical spacing. Entry 3
appears to be a loosened duplicate. Build from entry 1/2 metrics.

### Divider

`1:3399` "divider" — **1 × 44** at x = 175, y = 23. Vertically centred against the 58px entry
(16 + 58 = 74; 23 + 44 = 67 — it is centred on the 78px section, not on the entry:
(78 − 44)/2 = 17, which is also not 23). Position is measured, its logic is not derived.

**There is only one divider.** Entry 1 ends at 163, divider at 175, entry 2 starts at 188 →
12px on each side. Entry 2 ends at 329 and entry 3 starts at 341 → 12px gap with **no divider
between them**. Either the second divider is missing from the design or dividers are only
drawn on some boundaries. UNKNOWN.

---

## 5. Token roll-up (only values actually returned by the tool)

### Colours

| Hex / value | Where |
| --- | --- |
| `#E8F1FC` | header background `1:3290` |
| `#EDF5FF` | login button `1:3295`, search button `1:3299` |
| `#102A67` | `Увійти` label `1:3296` |
| `#FFFFFF` | `Реєстарція`, hero CTA labels, hero bonus title |
| `#FF8C00` → `#FF4500` | primary gradient (to right): `1:3297`, `1:3308`, `1:3320` |
| `#FF4500` | named style "Orange" |
| `#191970` | named style "Navy" (defined, not applied in this area) |
| `#000000` | hero slide base fill `1:3306`, `1:3318` |
| `#FFAE00` | promo badge text `1:3311`/`1:3323`, wager text `1:3317`/`1:3329` |
| `rgba(255,140,0,0.15)` → `rgba(255,69,0,0.15)` | promo badge gradient (to right) |
| `rgba(255,140,0,0.25)` | promo badge border |
| `rgba(255,149,0,0.1)` | wager badge fill |
| `#1E3A8A` / `#3B82F6` / `#F97316` / `#FED7AA` | carousel bars 1–4 |

### Shadows

| Value | Where |
| --- | --- |
| `drop-shadow(0px 8px 12px rgba(255,69,0,0.33))` | `1:3297`, `1:3308`, `1:3320` |
| `inset 0px 1px 0px 0px rgba(255,255,255,0.25)` | `1:3297`, `1:3308`, `1:3320` |
| `0 0 6.635px rgba(255,140,0,0.12), 0 2.212px 6.635px rgba(0,0,0,0.25)` | promo badge |

### Radii

`999px` search button · `552.388px` promo badge · `12px` hero slide · `8px` login button ·
`6px` gradient buttons · `3.318px` wager badge · `2px` carousel bars

### Type

| Family | Weight | Sizes seen |
| --- | --- | --- |
| Outfit SemiBold | 600 | 13 |
| Outfit Bold | 700 | 15, 12, 10 |
| Outfit ExtraBold | 800 | 10, 7.741 |
| Inter Bold | 700 | 10 |

Every text node in the measured area uses `line-height: normal`. Tracking values seen:
`−0.2px` (buttons), `0.5529px` (promo badge), `0.2765px` (wager badge).

Navbar and ticker type: **UNKNOWN**. Text-box heights suggest 18px line boxes for chip labels
and 22 / 14 / 14 for ticker amount / player / game — those are box heights, not line-heights.

---

## 6. Assets — node id → URL (NOT downloaded)

| Node | Name | Type | URL |
| --- | --- | --- | --- |
| `1:3292` | Logo TopWin (111 × 20) | SVG | `https://www.figma.com/api/mcp/asset/653406f6-87f0-4c77-b172-64eec586dad8.svg` |
| `1:3300` | search_header.svg (40 × 40 in a 36 clip) | SVG | `https://www.figma.com/api/mcp/asset/75224228-cec6-47bd-90cc-a7677bc34603.svg` |
| `1:3307`, `1:3319` | hero background (700 × 217, same file both slides) | PNG | `https://www.figma.com/api/mcp/asset/d4c14b97-731f-46fd-8d23-c5ff3b4cbc7e.png` |
| `1:3293` | Logo (88 × 24) — `hidden="true"` | ? | not exported (hidden) |
| `1:3340` | "Popular" icon 11.2257 × 16 | ? | **UNKNOWN — quota** |
| `1:3345` | "Must-play slots" icon 16 × 16 | ? | **UNKNOWN — quota** |
| `1:3381` | "live-streaming_13013279 1" 16 × 16 | ? | **UNKNOWN — quota** |
| `1:3387` | "live-streaming_13013279 1" 16 × 16 (same glyph as `1:3381`) | ? | **UNKNOWN — quota** |
| `1:3394` | Big Bass Amazon Xtreme thumb 46 × 46 | ? | **UNKNOWN — quota** |
| `1:3402` | Yeti Quest thumb 46 × 46 | ? | **UNKNOWN — quota** |
| `1:3409` | Yeti Quest thumb 46 × 46 (same game as `1:3402`) | ? | **UNKNOWN — quota** |

Distinct assets the area needs: **8** — logo, search icon, hero background PNG, 3 category
icons, 2 game thumbnails (Yeti Quest reused twice, so 2 distinct games).

Asset URLs expire in ~7 days. `1:3300` must keep its 40 × 40 leaf inside a 36 × 36 clip — do
not normalise it to 36.

---

## 7. Interaction / state implications

1. **Hero is a carousel** — 718px track in a 390px clip, 30px peek of the next slide. Swipe /
   drag horizontally. 2 slides authored, 4 indicator bars.
2. **Carousel indicator** `1:3330` — 4 bars, right-aligned, decreasing widths (40/24/16/8),
   four different colours. Implies a current-slide state, but the mapping is not derivable.
3. **Category navbar scrolls horizontally** — 502px of chips in 390px, 112px off-screen.
4. **Category chip has two variants** — "Active category" vs "Category", identical box
   (121 × 36) and identical inner centring, so the difference is paint only.
5. **Ticker scrolls / marquees** — entry 3 runs 92px past the right edge, no wrap.
6. **Two pressed/hover-capable button styles** in the header: flat tinted (`#EDF5FF`) and
   gradient. No hover, focus or pressed variants were found in these four nodes — none exist,
   or they live in a component set elsewhere in the file (not probed).
7. **`Pre log` frame name** — this is the logged-out state. A logged-in header variant is
   implied by the name and by the hidden `1:3293` "Logo", but was not probed.

---

## 8. UNKNOWN — questions for the owner

1. **Quota.** `get_design_context` on `1:3335` (navbar) and `1:3391` (ticker) was refused:
   "You've reached the Figma MCP tool call limit for your Full seat on the Professional plan."
   When can these two be re-probed, or can someone with remaining quota run them?
2. **Navbar tokens.** What are the chip fill, border, radius, label font/size/weight/colour,
   and how is "Active category" (`1:3338`) drawn — fill, underline, border, icon tint?
3. **Ticker tokens.** What are the section background, entry background, the divider's colour
   (`1:3399`), the thumbnail radius, and the three text styles (amount `1:3396`, masked player
   `1:3397`, game name `1:3398`)?
4. **Chip 4 is a duplicate** of chip 3 — same name, same icon, same copy `лайв Казіно`, width
   131 instead of 121. What is the real fourth category and its icon?
5. **`Реєстарція`** (`1:3298`) — is the transposition intentional, or should it ship as
   `Реєстрація`? Not corrected without a decision.
6. **Carousel: 4 bars, 2 slides.** Are there 4 promo slides and only 2 designed, or 2 slides
   and a placeholder indicator? Which bar is the current slide?
7. **Slide B differs from slide A** in CTA size (123 vs 130), CTA font-size (10 vs 12) and
   text-transform (uppercase vs capitalize), badge padding (9.953 vs 4) and title y (64 vs 58),
   while carrying identical copy. Which slide is canonical?
8. **Hero track is 718px** but its contents measure 700px (16 + 340 + 4 + 340). What is the
   extra 18px — a trailing gap/padding, a third slide slot, or drift?
9. **Hero wrapper `1:3302` is 375 wide** while its content is 390 and bleeds to x = 0. Is the
   hero meant to be full-bleed 390, or inset with a 7.5px margin?
10. **Header vertical padding** — metadata says 12px (12 + 36 + 12 = 60 ✓); the generated code
    says 14px (would give 64). 12 is being used. Confirm.
11. **Ticker has one divider** (between entries 1 and 2) and none between 2 and 3, though both
    gaps are 12px. Is the second divider missing?
12. **Ticker game name overflows** — `у Big Bass Amazon Xtreme` (`1:3398`) is 90px wide in a
    75px Content box. Truncate with ellipsis, wrap, or let it overflow?
13. **Ticker vertical padding is asymmetric** — 16 top, 4 bottom. Intentional?
14. **Chip icon→label gap** is 8px on the active chip and 6px on the other three. Which is the
    token?
15. **Ticker "(iOS)"** in the frame name — is there a separate Android/web ticker variant, and
    does this mobile-only build need both?
16. **Hidden logo `1:3293`** (88 × 24) — is that the logged-in header logo, or dead layer?
