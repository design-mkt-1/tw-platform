# Gap 23 — sport page chrome, colours (frame `1:5994`)

File key `s2CqwGqe0O0FcALhBNlTRe`. Mobile, 390 wide.
Companion document: `07-sport.md` (geometry + the tokens the first pass did retrieve).

## Method and cost

**4 Figma MCP calls spent, budget was 8. No quota refusal was hit.**

1. `get_screenshot 1:5994 maxDimension=2042` → returned **438 x 1045 at 1:1**.
   `maxDimension` only *caps* the long edge, it never upscales, so **2x renders of this
   file are not obtainable** — 1:1 is the ceiling. Saved as `sport-frame.png`.
2. `get_screenshot 1:6085 maxDimension=1080` → came back 90 x 30 (1:1). **Wasted call**;
   see item 1. Do not repeat this for the other gaps.
3. `get_metadata 1:6378` — one line, settled the font conflict (below).
4. `get_design_context 1:6027` — settled the hero-wrapper fill, and as a side effect
   resolved old UNKNOWN #2 (the off-screen Hero-Card slides).

**Screenshot coordinate mapping (needed to re-read `sport-frame.png`):**
the render is the frame's *overflow* bounds, not the frame box. Canvas colour `#1E1E1E`
fills the margins. Frame origin sits at image **(24, 0)**:

```
image_x = frame_x + 24      image_y = frame_y + 0
frame content occupies image x 24..413, y 0..1020
```

Verified against three independent landmarks: filter pill 1 left edge frame 16 → image 40;
odds cell 1 left edge frame 192 → image 216; chip `1:6085` border frame 286 → image 310.

Colours below marked **[P]** were read out of that PNG with `pick.mjs`. **[C]** is
`get_design_context`, **[M]** is `get_metadata`. Nothing here is inferred unless it says so.

---

## 1. Page background — `#F7FAFF`

**[P]** Sampled at the left edge (frame x=0) and the right edge (frame x=389) in five
different bands — y=215 and y=400 (hero band), y=500 (filter band), y=560 and y=600
(events section). **All ten samples: `#F7FAFF` exactly, flat, no gradient.**

Additional interior samples, same value: frame (195, 60..83) — the strip inside `1:6007`
above its first child; frame (195, 136..151) — between the mode switch and the category
switcher; frame (195, 196..211) — bottom of `1:6007`; frame (195, 395..442) — leagues
band above the tiles; frame (195, 487..494) — leagues band below the tiles.

**Where the fill lives.** `1:6007` was reported by `get_design_context` in the earlier pass
with padding, radius, overflow and a drop-shadow and **no `background`** — and the pixels
inside it read `#F7FAFF`, the same as the bands either side of it. `1:6333` likewise
reported no background, and its 12px padding band reads `#F7FAFF`. Two sibling sections that
declare no fill both show `#F7FAFF`, so the paint is coming from their common parent, the
page frame `1:5994`. **[P] + [C], derived.**

> Not measured: `get_design_context` was never run on `1:5994` itself (it would return the
> whole page). The `#F7FAFF` value is measured; the attribution to `1:5994` is derivation
> from "no child declares it and every child shows it".

## 2. Hero wrapper `1:6027` — **transparent, no fill of its own** [C]

`get_design_context 1:6027` returns exactly:

```
1:6027  content-stretch flex flex-col items-center justify-center relative size-full
1:6028  h-[172px] overflow-clip relative shrink-0 w-[390px]        (hero-section)
1:6029  absolute flex gap-[4px] items-center left-0 pl-[16px] top-1/2 w-[718px] -translate-y-1/2
```

**No `bg-*` class on any of the three.** The whole hero band is transparent; the `#F7FAFF`
seen at y 212..222.5, y 394.5..405, x 0..16 and in the 4px slide gutters is the page
showing through. Also confirms from the CSS: track gap **4px**, left pad **16px**, track
width **718px**, vertically centred by `top-1/2 / -translate-y-1/2`.

## 3. Header `1:5995` — fill `#E8F1FC` [P]

Not previously recorded anywhere. **[P]** Row scan at frame y=55 across the full 390:
`#E8F1FC` from x=0 to x=389, uninterrupted except x≈225..348 where the register button's
`drop-shadow(0px 8px 12px rgba(255,69,0,0.33))` tints it warm (peaks at `#ECD2D1`).
Column scan at frame x=195 gives `#E8F1FC` for y 0..11 and y 48..59 — i.e. the fill covers
the full 60px band, and the inner frame `1:5996` (y 12..48) sits on top of it.

---

## 4. Sport filters `1:6333` (390 x 60 at y=495)

### 4.1 Fills, measured

| what | frame x range | colour **[P]** |
| --- | --- | --- |
| container `1:6333` padding band (y 495..506) | 0..389 | `#F7FAFF` — the page, no fill of its own |
| pill 1 `1:6334` **selected** | 16..136 | `#FFFFFF` |
| gap | 137..144 | `#F7FAFF` |
| pill 2 `1:6340` unselected | 145..285 | `#EDF5FF` |
| gap | 286..293 | `#F7FAFF` |
| pill 3 `1:6355` unselected | 294..389 (clipped) | `#EDF5FF` |
| count badge, **both** states | pill-relative 84..116 | `#DCEBFF` |

Widths from the pixels: 121 / 141 / 106, gaps 8 — matches the `[M]` geometry exactly.

### 4.2 Border — **there is none** [P]

Row scan at y=525 crosses every pill edge. The transitions are:

```
…#EFF3FB  #FFFFFF          ← pill 1 left edge (frame x 15→16)
 #F4F7FD  #EDF5FF          ← pill 2 left edge (frame x 144→145)
```

The `#EFF3FB…#F4F7FD` ramp before each edge is pill 1's `0px 6px 18px rgba(23,69,143,0.08)`
shadow fading over the page, not a stroke: it is 8px wide and one-sided. **No pill carries a
1px border in either state.** The selected pill is distinguished by fill + that shadow only.

### 4.3 Radius and label type — unchanged from `07-sport.md` [C]

`border-radius: 10px`, `height: 36px`, `padding: 0 4px`, `gap: 8px`, centered, `overflow: clip`.
Label **Inter Regular 400, 13px, `line-height: normal`, `#102A67`, `white-space: nowrap`** —
**the same colour in all three pills**, selected or not. Pixel check confirms: darkest label
ink is `#102A67` in pill 1 (white bg) and `#102A67` in pill 2 (`#EDF5FF` bg). **[P]**

### 4.4 Count badge "310" — how it is drawn

- Wrapper: `background: #DCEBFF`, `border-radius: 999px`, `padding: 4px 7px`,
  `overflow: clip`, measured box **33 x 21** at pill-relative y=7.5. **[C][M]**
- **The badge fill does not change with state** — `#DCEBFF` on the selected pill and on both
  unselected pills. **[P]**, read at frame x 100..132 (selected) and x 249..281 (unselected).
- Text: Inter Regular 400, **11px**, `line-height: normal`, box 19 x 13 at (7,4). **[C][M]**
- Text colour: **`#17458F` selected**, **`#71809A` unselected**. **[C]**, and **[P]** the
  antialiased ink darkens to `#244F97` / `#7787A0` respectively at 11px, consistent.
- Literal string is `310` on **all three** pills. **[C]**

### 4.5 New finding — the sport icon is state-coloured too **[P]**

`07-sport.md` attributed `#17458F` / `#71809A` to the count text only. The 16x16 icon takes
the same pair:

| pill | icon | frame x of icon | flat colour hit in the render |
| --- | --- | --- | --- |
| 1 selected | `1:6335` football | 20..35 | **`#17458F`** (exact, multiple pixels) |
| 2 unselected | `1:6341` basketball | 149..164 | **`#71809A`** (exact, multiple pixels) |
| 3 unselected | `1:6356` racket | 298..313 | `#8896AC` darkest — thin strokes, never reaches flat; consistent with `#71809A` |

So selected → unselected is **four** changes, not three: fill, shadow, count text **and icon
fill**. The SVGs are monochrome — a single flat value across the whole glyph body.

---

## 5. Prematch/Live toggle `1:6007` (h=152 at y=60)

| element | frame box **[P]** | colour |
| --- | --- | --- |
| container `1:6007` | y 60..211 | **no fill** — `#F7FAFF` page shows at y 60..83, 136..151, 196..211 **[P][C]** |
| track `1:6009` | y 84..135, x 16..373 | `#DCEBFF` **[P][C]** |
| selected tab `1:6010` "Прематч" | x 20..192, y 88..131 (173 x 44) | `#FFFFFF` **[P]** |
| unselected tab `1:6012` "Лайв" | x 197..369 | **no fill** — track `#DCEBFF` shows through **[P]** |
| category switcher `1:6018` | y 152..195 | `#E8F1FC` **[P]** |
| both labels | — | ink `#102A67` in both tabs **[P][C]** |

**New finding [P]:** the Live tab icon `1:6013` (`stream_8191668 1`, 18x18) renders
**`#FF7A45`** — flat, exact, read at frame y=110, x 253..268. It is the only orange element
in the toggle; `07-sport.md` recorded the icon's size and URL but not its colour.

The white selected tab's `0px 6px 18px rgba(23,69,143,0.08)` shadow is visible in the pixels
as a `#D7E7FC` darkening of the `#DCEBFF` track in the 4px padding ring around it. **[P]**

---

## 6. Match row `1:6391` inside `1:6366` — odds cell

Absolute frame coordinates for card 1, row 1: card `1:6383` at (16, 609); league header
y 609..640 (`#E8F1FC`); 2px card gap y 641..642 (`#FFFFFF`, the card body); match row
y 643..722; row 2 y 723+.

| property | value | source |
| --- | --- | --- |
| match row `1:6391` fill | **`#F5F8FC`** measured; `#f5f8fd` declared | **[P]** / **[C]** — 1 unit apart in blue, sRGB rounding in the renderer. Ship the declared `#f5f8fd`. |
| **odds cell fill** | **`#E8F1FC`** — flat, exact | **[P]** at frame x 192..246, 252..305, 312..365, y 671..708 |
| **odds cell border** | **none** | **[P]** the row scan at y=690 steps `#F5F8FC` → `#E8F1FC` with no intermediate pixel at frame x 191→192, and back the same way at the right edge. No stroke on any of the three cells. |
| **odds cell radius** | `10px` | **[C]**; **[P]** consistent — a column 4px in from the cell's left edge shows the fill only from y 671..708 instead of the full 669..710, which is the corner arc eating 2px top and bottom |
| cell size / gap | 55.333 x 42, 4px gaps | **[C][M]**, gaps visible as `#F5F8FC` at frame x 247..251 and 306..311 **[P]** |
| **odds number colour** | **`#F45B24`** — flat, exact, hit on multiple pixels | **[P]** at y=690 inside all three cells / **[C]** |
| odds number type | Roboto Medium 500, 12px, `wdth 100`, nowrap | **[C]** |
| **`1` / `Н` / `2` label colour** | **`#758098`** declared; darkest measured ink `#7D879E` on the `Н` | **[C]** / **[P]** at y=656 — 10px stems never reach the flat value, `#7D879E` is the expected antialias of `#758098` on `#F5F8FC` |
| label type | Roboto Regular 400, 10px, `wdth 100` | **[C]** |

**The contrast asked about is real and large:** the labels above are grey `#758098`, the
numbers inside the cells are orange `#F45B24`. Nothing else in the row is orange except the
`● EP` live marker, which is the same `#F45B24`.

---

## 7. Font conflict `1:6086` vs `1:6379` — **settled: they genuinely differ**

Both `get_design_context` reports were correct. This is a real inconsistency in the design,
not a tool error.

**The measurement.** `get_metadata 1:6378` returns:

```
<text id="1:6379" name="Filter label" x="10.5" y="8" width="47" height="14" />
```

against `1:6086` = **44 x 15 at y=7.5** from the earlier pass. Same 12px size, same
`line-height: normal`, **different box height: 15 vs 14.**

That 1px is the discriminator, and this file calibrates it internally — every text node in
`1:5994` whose family `get_design_context` reported, at 12px:

| node | declared family **[C]** | measured box h **[M]** |
| --- | --- | --- |
| `1:6086` `Всі ліги` | Inter Regular | **15** |
| `1:6388` `–` | Inter Regular | **15** |
| `1:6389` `♕` | Inter Regular | **15** |
| `1:6398` `🔵  Наполі` | Roboto Medium | **14** |
| `1:6379` `Всі події` | Roboto Regular | **14** ← this pass |

Inter's default line height at 12px is 14.52 → Figma box 15; Roboto's is 14.06 → box 14.
Every Inter node in the file measures 15 and every Roboto node measures 14, and `1:6379`
measures 14. **`1:6086` is Inter Regular 12, `1:6379` is Roboto Regular 12.**

Pixel confirmation of the consequence, from `sport-frame.png` **[P]**: the two chips are both
90 x 30 with the same `#EFF6FF` fill, `1px #BFDBFE` border and `#1E40AF` text, but their
interiors are laid out differently because the strings measure differently —
`1:6086` text ink spans frame x 299..339 with the chevron at 350; `1:6379` text ink spans
frame x 295..340 with the chevron at 349.5. Text widths 44 vs 47, so the centred flex row
puts them at different offsets (12 vs 10.5).

> **Still a decision, not a measurement:** which font *should* win. Observation that may
> help, marked as reasoning not measurement — each chip currently matches the family of the
> title in its own section header: the leagues widget title `1:6084` is Inter SemiBold 13,
> the events title `1:6377` is Roboto Medium 18. So neither chip is an obvious typo; the
> split runs section by section. This still needs the designer's call.

---

## 8. Side effect — old UNKNOWN #2 is now closed

`get_design_context 1:6027` returned the two off-screen Hero-Card slides in full. They are
**casino cards, in English, with a £ currency** — they do not belong to this Ukrainian
sportsbook page. Recording the tokens so nobody spends another call on them.

**Card `1:6046`** (358 x 170, `padding: 16px`):
- `background: linear-gradient(to right, #0b1530, #141d40 50%, #0d2c54)`, `border-radius: 16px`
- Promo-Badge `1:6051`: `bg rgba(0,122,255,0.1)`, `radius 6px`, `padding 3px 8px`;
  text `WELCOME` Inter **Bold** 10px `#007aff`, `letter-spacing 0.5px`, uppercase
- Wager-Badge `1:6053`: `bg rgba(255,149,0,0.1)`, same box; text `20X WAGER` Inter Bold 10px **`#ffae00`**
- Title `1:6056`: **`£5,500`** Inter **ExtraBold 800**, `26px`, `#ffffff`, `letter-spacing -0.26px`
- Subtitle `1:6057`: `UP TO ` Inter Medium 13px **`#8e9bb0`** + `250 FREE SPINS` Inter Bold 13px `#ffffff`
- Button `1:6058`: `bg #ffae00`, `h 36px`, `radius 6px`, `padding 0 20px`;
  label `Play Now` Inter SemiBold 13px, `line-height 19px`, **`#000000`**, `-0.26px`
- `1:6059`: `blur(25px)`, `rotate(-13.47deg)`, 110.476 x 106.758 inner

**Card `1:6064`** differs in four values only: Promo-Badge `bg rgba(0,240,255,0.1)` with text
**`#00f0ff`**; Wager text **`#ff9500`** (not `#ffae00`); title **24px** `-0.24px`; button
`bg #ffb900`, `h 30px`. Same gradient, same radius, same copy.

Fresh asset URLs from this call (7-day expiry, replaces the ones in `07-sport.md` §11):

| asset | URL |
| --- | --- |
| WELCOME banner photo | `https://www.figma.com/api/mcp/asset/18b8ed18-4499-44d0-89f8-f4b82ee3f674.png` |
| Ellipse 4 glow | `https://www.figma.com/api/mcp/asset/098ae5a1-738b-4a6d-94c2-487a65750ab0.svg` |
| `enhanced_…xrq8r4ai…` blur blob | `https://www.figma.com/api/mcp/asset/f8926888-8130-4283-b5cf-6b03b645b083.png` |
| Gates of Olympus character (зевс) | `https://www.figma.com/api/mcp/asset/9b52f3f0-e6b3-4aec-86b0-5a696ed0ce7b.png` |
| Lens Flare 2 8 / 2 9 (one file, used twice per card) | `https://www.figma.com/api/mcp/asset/0bdf3f2f-1ef4-4941-90b4-b042cf288507.png` |

---

## 9. Colours this pass adds to the page palette

| hex | where | source |
| --- | --- | --- |
| **`#F7FAFF`** | **page background `1:5994`** — behind every section | **[P]** |
| **`#E8F1FC`** | **header `1:5995` fill** (full 390 x 60 band) | **[P]** |
| **`#FF7A45`** | Live-tab icon `1:6013` | **[P]** |
| `#17458F` | football icon in the **selected** filter pill (was recorded for count text only) | **[P]** |
| `#71809A` | sport icons in **unselected** filter pills | **[P]** |
| `#0b1530 → #141d40 → #0d2c54` | off-screen Hero-Card gradient | **[C]** |
| `#ffae00` · `#ffb900` · `#ff9500` · `#00f0ff` · `#8e9bb0` | off-screen Hero-Card only | **[C]** |

---

## UNKNOWN — still open after this pass

1. **Does `1:5994` itself carry the `#F7FAFF` fill, or does some ancestor/canvas?** The
   colour is measured beyond doubt and every child that shows it declares no background of
   its own, so `1:5994` is the only candidate left — but `get_design_context 1:5994` was not
   run (it would dump the entire page) and no tool has stated the frame's own fill. Question
   for whoever has a spare call: *what is `1:5994`'s `background`?*

2. **Which font is correct for the two link chips?** Measurement now proves `1:6086` is Inter
   and `1:6379` is Roboto — it does not say which one the design intends. This is a
   designer decision, not a measurement gap.

3. **Is the sport-icon colour change intentional or a by-product?** Measured: the selected
   pill's icon is `#17458F` and the unselected ones are `#71809A`. Not measured: whether the
   three SVGs are recoloured by a Figma fill override (so the exported files are all one
   colour and the app tints them) or whether three differently-coloured files were exported.
   `get_design_context` on `1:6334` and `1:6340` would say. This decides whether the icons
   ship as `currentColor` SVGs or as separate assets.

4. **The odds cell has one state only.** `#E8F1FC` fill, `#F45B24` number, `10px` radius, no
   border — that is the *resting* cell. The design contains no selected, pressed, locked or
   odds-drifted cell anywhere on the frame. What do those look like? (Carried over from
   `07-sport.md` UNKNOWN, unchanged — this pass found nothing new.)

5. **`#F5F8FC` vs `#f5f8fd` on the match row.** The renderer produced `#F5F8FC` and
   `get_design_context` declared `#f5f8fd`. One unit in blue. Almost certainly the renderer
   rounding, but not proven — if a diff-against-Figma screenshot test is planned, it will
   flag this pixel.
