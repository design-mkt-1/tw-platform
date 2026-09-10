# Top-Win — Search chrome (gap fill for `09-search-states.md` Q3, Q5, Q6)

File key: `s2CqwGqe0O0FcALhBNlTRe`. Mobile only, 390 wide.

**Method.** 4 Figma MCP calls spent (budget was 8), all `get_screenshot`. No `get_design_context`,
no quota refusal. The renderer **will not upscale** — `maxDimension: 1016` on a 390x508 node still
returned 390x508, so every frame is a **1:1 render** and a flat area in it *is* the fill.

Every value below was read out of those PNGs by decoding the IDAT chunks directly
(`pick.mjs`, plus a new `radfit.mjs` for the corner radius). Anything not measured sits under
**UNKNOWN**. Where a number reproduces one the earlier `get_design_context` pass already had, it is
marked *cross-checked* — two independent routes agreeing, not one value copied twice.

| Frame | Node | Render | Local file |
| --- | --- | --- | --- |
| `mob main - State 1` | `1:7363` | 390 x 508 | `s1.png` |
| `mob main - State 2` | `1:7595` | 390 x 336 | `s2.png` |
| `mob main - State 3` | `1:7806` | 390 x 496 | `s3.png` |
| `mob main - State not found` | `1:7214` | 390 x 571 | `s4.png` |

---

## 1. The root frames — Q6 answered

### 1.1 Background fill: `#EFF6FF`, flat

Sampled in all four frames at `(195,2)`, `(2,100)`, `(195,10)` → `#EFF6FF` every time.

It is a **solid fill, not a gradient.** A full-height scan of the left gutter (`x=8`, outside the
16px content padding) is `#EFF6FF` from top to bottom in all four, with one exception: a band at
**y 70..105** that darkens by ~2 units per channel (`#EDF4FE` at its deepest).

That band is not a gradient — it is the search field's own drop shadow
(`0 4px 8px rgba(59,130,246,0.1)`, field occupies y 60..108) bleeding into the gutter. The run
boundaries of that band are **byte-identical across s1, s2 and s4**, which is independent evidence
that all four frames carry the same background and the same field shadow.

`#EFF6FF` is not a new colour: it is already the `btn-close` fill and the empty-state icon-chip
fill. See §4.1 for what that collision costs.

### 1.2 Corner radius: `24`, all four corners, all four frames

The render places the frame on Figma's canvas backdrop `#1E1E1E`, so the rounded corner is
directly visible as a backdrop-to-fill ramp. Radius was fitted, not eyeballed: `radfit.mjs`
converts each edge pixel to fill-coverage on all three channels, then least-squares fits it against
16x16-supersampled exact coverage of a quarter disc, sweeping r in 0.1 steps from 0 to 50.

```
s1 tl: r=24.0   s1 tr: r=24.1   s1 bl: r=24.1   s1 br: r=24.0
s2 tl: r=24.0   s2 tr: r=24.1   s2 bl: r=24.1   s2 br: r=24.0
s3 tl: r=24.0   s3 tr: r=24.1   s3 bl: r=24.1   s3 br: r=24.0
s4 tl: r=24.0   s4 tr: r=24.1   s4 bl: r=24.1   s4 br: r=24.0
```

Residual SSE ≈ 0.004 over 40 rows — essentially an exact fit. The 24.0/24.1 split is subpixel
rasterisation of left vs right edges, not two different radii. Observed vs modelled ramp at the
top-left of `s1` (r=24):

| y | 16 | 17 | 18 | 19 | 20 | 21 | 22 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| observed coverage | 0.00 | 0.12 | 0.31 | 0.56 | 0.75 | 0.88 | 1.00 |
| model r=24 | 0.00 | 0.10 | 0.36 | 0.57 | 0.74 | 0.87 | 0.95 |
| model r=20 | 0.69 | 0.84 | 0.94 | — | — | — | — |
| model r=28 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.13 | 0.34 |

r=20 and r=28 are excluded by more than an order of magnitude. **24 is also already the search
field's radius**, so the panel and the field inside it share one radius token.

*Reasoning, not measured*: `#1E1E1E` in the corners is Figma's canvas showing through, the same
backdrop this repo's `scripts/clean-svg.mjs` strips out of exported SVGs. It is not part of the
design and must not be built.

---

## 2. Search field, chips, rows — pixel cross-check

All of these were already in `09-search-states.md` from `get_design_context`. Reading them a second
way out of the PNG confirms every one; nothing contradicts.

Row scan across the field at `y=84` in `s1`:

```
16-17:#BFDBFE   18-26:#FFFFFF   27-28:#3B82F6 …   44-46:#3B82F6 …   47-60:#FFFFFF   61-62:#AFBACA
```

| Element | Value | Status |
| --- | --- | --- |
| field fill | `#FFFFFF` | cross-checked |
| field border | `#BFDBFE`, **2px** (x 16-17) | cross-checked |
| field radius | 24 | from `get_design_context`; not re-measured (§UNKNOWN Q-A) |
| placeholder text | `#94A3B8` (darkest pixel in glyph box) | cross-checked |
| **magnifier glyph** | **`#3B82F6`** | **new** — the earlier pass had this as an un-coloured SVG asset |
| chip 1/3/5 fill | `#DBEAFE`, border `#BFDBFE` 1px, text `#1E3A8A` | cross-checked |
| chip 2/4 fill | `#FFF7ED`, border `#FED7AA` 1px | cross-checked |
| chip radius | 100 (pill) | see §UNKNOWN Q-A |
| chip 1 span | x 16..98 = **83 wide**, gap 8, chip 2 starts x 107 | cross-checked |
| recent row fill | `#DBEAFE`, border `#BFDBFE`, text `#102A67` | cross-checked |
| suggestion row fill | `#DBEAFE`, no border, row0 y 147..202 = **56**, gap 8, row1 y 211..267 = **57** | cross-checked |
| suggestion subtitle | `#839CBF` | cross-checked |
| suggestion badge | fill `#FFF7ED`, border `#FED7AA` 1px, y 162..187 | cross-checked |

The empty-state icon chip magnifier is also `#3B82F6` (measured at `(202,261)` and `(184,261)`
in `s4`).

---

## 3. Q3 — the 14 / 15 px suggestion title

**The 15px is real, it renders, and it is a stray override on one text node.**

Cap height scales linearly with font size, and Inter's cap height is 0.727 em. Ink boxes measured
at luminance threshold 120 and 145 (identical results at both, so not a threshold artefact):

| Text | Node | `P`/digit ink height | Implied size |
| --- | --- | --- | --- |
| `Pragmatic Play` — row 0 title | `1:7844` | **10px** (y 163..172) | 14 (14 x 0.727 = 10.2) |
| `Pragmatic Live` — row 1 title | `1:7853` | **11px** (y 226..236) | 15 (15 x 0.727 = 10.9) |
| `Prag` typed query, same frame | `1:7831` | **10px** (y 79..88) | 14 |
| `Пошук провайдерів...` placeholder, `s1` | `1:7388` | **10px** (y 79..88) | 14 |
| `245 ігор` — row 0 subtitle | `1:7845` | **8px** (y 181..188) | 11 |
| `32 гри` — row 1 subtitle | `1:7854` | **8px** (y 246..253) | 11 |

Full-title ink heights agree: 13px (row 0) vs 14px (row 1), a ratio of 1.077 against the predicted
15/14 = 1.071.

**Only the title differs.** Both subtitles measure 8px digit height, i.e. both 11px. So row 1 is
**not** a scaled-up instance of the row — its subtitle, badge, padding and logo are unchanged and
only `1:7853` carries a different size. That is the signature of a hand-edited text node, not a
variant.

**Which size is canonical: 14.** Inside this frame, 14px is what the typed query and the
placeholder use, and what row 0's title uses — three nodes to one. Across the whole inventory,
**Inter Medium 15 appears nowhere else**; the other 15px strings in the file are different faces
(sport tabs and `Купон` are Inter *Regular* 15, casino jackpot amounts are *Outfit Bold* 15).

**Build both rows at 14.** That also removes the 56/57px row-height split, which is the only reason
the two rows are unequal.

---

## 4. Q5 — the 4-segment bar `1:7358` is the carousel indicator, not an empty-state element

Measured position in `s4`, row scan at `y=549`:

| Segment | x span | Width | Fill |
| --- | --- | --- | --- |
| 1 | 145..184 | 40 | `#1E3A8A` |
| 2 | 189..212 | 24 | `#3B82F6` |
| 3 | 217..232 | 16 | `#F97316` |
| 4 | 237..244 | 8 | `#FED7AA` |

Height y 547..550 = **4**, gaps **4**. Total run 145..244 = **100px**, leaving 145px clear on the
left and 145px on the right of the 390 frame — **exactly centred**.

Against the casino hero indicator `1:3330` (measured in `01-casino-top.md`):

| | search `1:7358` | casino hero `1:3330` |
| --- | --- | --- |
| widths | 40 / 24 / 16 / 8 | 40 / 24 / 16 / 8 |
| fills | `#1E3A8A` `#3B82F6` `#F97316` `#FED7AA` | identical |
| height / radius / gap | 4 / 2 / 4 | 4 / 2 / 4 |
| container | 358 wide | 358 wide |
| alignment | **centred** (x 145..244) | **right-aligned**, `justify-end`, px 16 (x 242..342) |
| sits directly under | a horizontally-clipped provider carousel | a horizontally-clipped hero carousel |

**Verdict: the same object, differently justified.** Same four widths, same four fills, same
metrics, and in both cases it is parked immediately beneath a row that overflows its 358px clip.
It is a **carousel/scroll indicator**, and it must not be built as part of the empty state.

Consequences for the build:

1. It belongs to the carousel component, so it should appear wherever that carousel appears — it is
   currently drawn in only one of the four search frames even though States 1/2/3 all contain the
   same clipped carousel. That is a gap in the design, not a spec that the other three states hide it.
2. `justify-center` here vs `justify-end` in the casino hero is an inconsistency between two copies
   of one element. Pick one before building; they are separate node trees, not instances of a shared
   component, so nothing in the file forces them to agree.
3. It cannot be a literal page indicator in either place. The search carousel clips a 420px row into
   358px — about 1.2 screens, not 4. The casino hero has 4 bars over 2 authored slides. Which bar
   means "current" is still not derivable (this half of `01-casino-top.md`'s UNKNOWN stands).

---

## 4.1 Empty-state message — exact type, measured

`s4`, block `1:7257`. Colours are the darkest pixel of each glyph box; sizes are cap-height derived.

| Part | Measured | Type |
| --- | --- | --- |
| title `Провайдерів не знайдено` | ink x 92..298 (w 207), y 304..318; `П` cap **12px** | Inter ExtraBold **16** / lh 1.2, `#1E3A8A`, centred |
| body `Спробуйте інший пошуковий запит` | ink x 83..306 (w 223), y 336..348; `С` cap **10px** (round-letter overshoot) | Inter Medium **13** / lh 1.4, `#64748B`, centred |
| CTA `Усі провайдери` | box x 128..261 = **134 wide**, y 362..393 = **32 tall** | fill `#F97316`, text `#FFFFFF` |
| icon chip | x 167..222, y 233..288 = **56 x 56**, border `#BFDBFE` 1px | fill `#EFF6FF`, glyph `#3B82F6` |

Both text blocks centre on x ≈ 195, the frame centre — measured, so the centring is real and not a
fixed-width text box that happens to look centred.

Cap-height arithmetic: 16 x 0.727 = 11.6 → renders 12 ✓. 13 x 0.727 = 9.45, plus round-letter
overshoot on `С` → renders 10 ✓. Full ink height 13px = cap + descender = 13 x 0.967 = 12.6 ✓.
All three agree on 16 / 13, cross-checking the earlier `get_design_context` values.

**The icon chip has no visible fill.** Its interior measures `#EFF6FF` and the page behind it
measures `#EFF6FF` — the same hex. The chip reads as a bare 1px `#BFDBFE` ring, not as a tinted
circle. That is what the file says; whether it is intended is UNKNOWN Q-C. The same `#EFF6FF` on
`btn-close` is fine, because `btn-close` sits on the white field and does contrast.

The CTA's shadow is visible in the pixels as an orange-tinted falloff from x 120..127 and
x 262..270 against `#EFF6FF`, consistent with the recorded `0 4px 6px rgba(249,115,22,0.3)`.

---

## 5. Net token additions

Only one colour and one radius are genuinely new; everything else confirms `09-search-states.md`.

| Token | Value | Where |
| --- | --- | --- |
| page / panel background | `#EFF6FF` | all four search root frames — same hex as `btn-close` and empty-state icon-chip fill |
| panel corner radius | `24` | all four root frames, all four corners — same value as the search field radius |
| magnifier glyph | `#3B82F6` | field magnifier and empty-state magnifier |

---

## UNKNOWN

- **Q-A.** The search field radius (24), chip radius (100) and suggestion-row radius (12) are still
  single-sourced from the earlier `get_design_context` pass. A pixel could confirm them the same way
  §1.2 confirmed the frame radius, but each needs its own corner ramp fit against a known adjacent
  fill and I stopped at the frame radius, which was the actual gap. Not in doubt — just not
  double-sourced.
- **Q-B.** Whether `#EFF6FF` and radius `24` on the root frame are a Figma variable or a raw fill.
  `get_variable_defs` was never returned in this run either (`09-search-states.md` Q7 stands).
  Everything here is a raw measured value with no token name attached.
- **Q-C.** Is the empty-state icon chip's fill-equals-background deliberate (an outline chip) or an
  oversight (it should be white, or the page should be)? The file has no second variant to compare
  against.
- **Q-D.** Row 1's 15px title is an override with no visible intent, but the file cannot say whether
  a designer typed it or a resize handle caused it. Recommending 14 is a *judgement* from the
  three-to-one majority inside the frame and the absence of Inter Medium 15 elsewhere — it is not
  something the file states.
- **Q-E.** Which of the 4 indicator segments means "current", and why the search copy is centred
  while the casino copy is right-aligned. Neither has a second variant.
- **Q-F.** Why `1:7358` is drawn only in `State not found` when the carousel it indicates exists in
  all four frames.
