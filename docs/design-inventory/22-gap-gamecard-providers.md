# Top-Win — Gap fill: game card + provider badge

File key `s2CqwGqe0O0FcALhBNlTRe`. Frame `1:3289`, 390px mobile.
Targets: row `1:3414` (y=414) section header + card; provider badge `1:3784` / `1:3785`.

**Figma MCP calls spent: 3 of 8.** Quota was NOT hit.

1. `get_screenshot` `1:3414` → 390x370 PNG, 1:1 (`row-3414.png`)
2. `get_screenshot` `1:3785` → 358x96 PNG, 1:1 (`prov-3785.png`)
3. `get_design_context` `1:3784` → circle paint + shadow + 11 asset URLs

Everything else came from decoding those PNGs with the existing `pick.mjs` / `crop.mjs`,
or from `curl`-ing SVG asset URLs that the earlier pass had already recorded (an HTTP
fetch, not an MCP call — zero quota cost). Geometry is not re-derived here; it was already
correct in `02-casino-rows-a.md` and every number I re-checked against pixels matched.

---

## 1. THE HEADLINE: the card has no shadow, the provider circle does

The two questions in the brief have opposite answers, and both are settled by pixels.

### Game card — genuinely flat. No shadow, no overlay.

The 8px gutter between card 1 and card 2 in row `1:3414` was scanned as a full column,
`x=134`, `y=58..214` — 157 consecutive pixels:

```
col 134 [58..214]
  58-214:#F7FAFF        <- ONE run. Zero variation over 157px.
```

The 12px gutter between grid row 1 and grid row 2 (`col 60`, `y=210..221`) is likewise a
flat `#F7FAFF`, and so is the page background far from any card (`(5,100)`, `(385,100)`,
`(200,5)`, `(8,300)` — all `#F7FAFF`). A drop shadow produces a falloff ramp; there is not
one pixel of ramp anywhere around these cards.

**Verdict: the wrapper named `Overlay+Shadow` really does paint neither.** The earlier
agent's reading of `rgba(240,243,255,0)` (alpha 0) and no `box-shadow` was not an export
bug — it is what the design contains. The artwork carries everything. The layer name is
stale intent, not a lost effect.

This matters because the same file *does* export a shadow when one exists — see the
provider circle below, where `drop-shadow-[...]` came back in the very same call format.
The tool is capable of emitting a shadow. It emitted none for the card because there is none.

### Provider circle — has a real, blue-tinted drop shadow

Measured first in pixels, then confirmed against the declaration.

Pixel evidence (`prov-3785.png`), circle 1 occupies `x=4..75`, `y=12..83`:

```
col 39 (circle centre), below the circle:
  84:#EAEFF9  85-86:#EBF0F9  87:#ECF1F9  88:#EDF2FB  89:#EFF2FB
  90:#F0F4FB  91:#F1F5FC  92:#F2F5FC  93-94:#F3F6FC  95:#F3F7FC   -> still fading at frame edge
col 39, above the circle:
  0-4:#F7FAFF  5-6:#F6F9FE  ...  11:#F4F8FE                        -> barely present
```

Darker below than above, by a wide margin — the signature of a downward-offset shadow.
The 8px gap between two circles (`x=76..83`) sits at `~#EEF3FB`, never returning to the
`#F7FAFF` page colour, because the halos of both neighbours overlap there.

Declared value from `get_design_context`:

```
drop-shadow-[0px_6px_9px_rgba(23,69,143,0.08)]
```

**The measurement and the declaration agree.** Solving the darkest sampled pixel
`#EAEFF9` as `#F7FAFF` composited with `rgb(23,69,143)` gives an effective alpha of
0.058 / 0.061 / 0.054 across R/G/B — consistent with a declared peak of 0.08 attenuated by
the 9px blur. The shadow colour being blue (`23,69,143`) rather than black is why the halo
reads `#EAEFF9` and not a neutral grey; that is measured, not assumed.

---

## 2. Section header of `1:3414`

Header box: `x=16`, `y=16`, `358 x 30`. Vertical centre `y=31`.

| Part | Value | Source |
| --- | --- | --- |
| Title text | `Популярне` | prior pass |
| Title type | Roboto **Medium**, **18px**, `line-height: normal`, `wdth 100`, nowrap | prior pass |
| Title colour | **`#07134F`** | **pixel-confirmed** — darkest in `rect(36,20,100,22)` |
| Title ink box | `x=39..129` (w=91), `y=25..40` (h=16 cap) | measured |
| Icon | `Popular` `1:3426`, 14.032 x 20, flame glyph | prior pass |
| Icon colour | **`#92BDF3`** (single flat fill) | **pixel `#92BDF3`, and the SVG's own `fill="#92BDF3"` — two independent sources agree** |

Icon then 8px gap then title: icon `x=16..30`, title ink starts `x=39`. Consistent with the
declared 8px gap and a 14.032px icon box.

### Divider `Vector 100` — RESOLVED (was UNKNOWN #1 of the earlier pass)

The earlier pass could not colour this because it exports as an SVG asset with no hex in
the reference code. Fetching that asset over plain HTTP settles it exactly:

```svg
<svg width="136.968" height="1" viewBox="0 0 136.968 1">
  <path id="Vector 100" d="M0 0.5H136.968" stroke="#DCEBFF" stroke-dasharray="2 2"/>
</svg>
```

- **Stroke `#DCEBFF`**, 1px, **`stroke-dasharray="2 2"`** — a **dashed** rule, 2px on / 2px off.
- It is *not* the solid 1px rule the earlier pass described. That description was inferred
  from the wrapper CSS (`height: 0`, `inset: -0.5px 0`); the dash pattern lives inside the
  asset and only shows up if you open it.

Pixel cross-check, row `y=31`, `x=139..275`: `#E9F2FF` in 2px runs separated by 2px of
`#F7FAFF` — period 4. Confirms the dash. The stroke occupies **two** pixel rows
(`y=30..31`, `col 199` and `col 163` both give `30-31:#E9F2FF`) because the path sits at
`y=0.5` of a zero-height line placed on the header's centre `y=31.0`, so a 1px stroke
straddles the 30/31 boundary at 50% each. Un-compositing those rows predicts a source
stroke of `#DBEAFF`; the file says `#DCEBFF`. Agreement to within 1-2 per channel.

Divider spans roughly `x=138..276` (declared width 136.968), flexing to fill between the
title and the pill.

### "Всі (120) " pill — pixel-confirmed

| Property | Value | Source |
| --- | --- | --- |
| Box | 90 x 30, `x=284..373`, `y=16..45` | pixel-confirmed |
| Fill | **`#EFF6FF`** | pixel `(330,17..44)` |
| Border | **1px `#BFDBFE`** | pixel — `col 330` gives `16:#BFDBFE`, `45:#BFDBFE`; `row 31` gives `284:#BFDBFE` |
| Radius | 10px | prior pass; corner ramp at `row 20` (`371:#C5DEFE`) is consistent |
| Label | `Всі (120) ` — trailing space | prior pass |
| Label colour | **`#1E40AF`** | pixel — darkest in `rect(290,22,80,16)` |
| Label type | Roboto Regular 12px, `wdth 100`, nowrap | prior pass |
| Label ink box | `x=295..359` (w=65), `y=26..36` (h=11) | measured |
| Chevron | `chevron-right` 14x14, **`stroke="#1E40AF"`, `stroke-width="2"`, `stroke-linecap="round"`** | fetched SVG — it is a stroked path, not a filled glyph |

Note the chevron is a 2px *stroke*, so it does not scale like a filled icon and it inherits
no fill. Same `#1E40AF` as the label.

---

## 3. The card

| Property | Value | Source |
| --- | --- | --- |
| Size | 114 x 148 | prior pass, pixel-confirmed |
| Position, row 1 | `x=16 / 138 / 260`, `y=62..209` | pixel-confirmed (`row 100` left edge at `x=16`; `col 60` top edge at `y=62`; last card right edge at `x=373`) |
| Column gap | 8px (`x=130..137` background) | pixel-confirmed |
| Row gap | 12px (`y=210..221` background) | pixel-confirmed |
| Corner radius | **15px** | pixel-confirmed, see below |
| Background | `rgba(240,243,255,0)` — transparent | prior pass, pixel-confirmed (no tint anywhere in the gutters) |
| Shadow | **none** | pixel-proven |
| Overlay | **none** | alpha-0 background |
| Artwork | one PNG reused 6x, `452c0ce3-7377-409e-9396-608133375458.png` | prior pass |
| Page colour behind | **`#F7FAFF`** | pixel |

**On the radius — a trap worth recording.** Tracing "first non-background pixel" down the
corner arc suggests r=11, not 15:

```
y=62 dx=10 | y=63 dx=8 | y=64 dx=6 | y=65 dx=5 | y=66 dx=4 | y=67 dx=3 | y=68 dx=2 | y=70 dx=1 | y=72 dx=0
```

That is an artifact of the threshold, not a real disagreement. Near the top of the arc the
curve is almost tangent to the horizontal, so one pixel row shows a long shallow coverage
ramp: at `y=62` the pixels run `x=26:#EDEFFA` (barely tinted) → `27:#BEBFE2` → `28:#A1A1D4`
→ `29:#9896CD` → `30:#8683C2` (solid). Full opacity arrives at `dx≈14-15`, which is
exactly r=15. The left edge agrees: at `x=16` colour is solid by `y≈76-77`, i.e. `dy≈15`.
**r=15 confirmed.** Do not "correct" it to 11 from a first-ink scan.

---

## 4. Provider badge `1:3784` / `1:3785`

### Badge and circle

```
Badge-<name>   80 x 96,  flex-col items-center justify-center, p-[12px]
└─ Circle      72 x 72,  bg-white, rounded-[1000px], px-[4px],
                         drop-shadow-[0px_6px_9px_rgba(23,69,143,0.08)]
   └─ logo     44 x 44   (3 Oaks: 45 x 44)
```

| Property | Value |
| --- | --- |
| Circle fill | **`#FFFFFF`** — `bg-white`, pixel-confirmed solid white across `x=4..75`, `y=12..83` |
| Circle border | **NONE.** No stroke in the code, and no distinct edge colour in the pixels — white ramps straight into the shadow halo |
| Circle radius | **`1000px`** — a true circle (pill radius on a square) |
| Circle shadow | **`0px 6px 9px rgba(23,69,143,0.08)`** — see section 1 |
| Circle inset | `x=4`, `y=12` inside the 80x96 badge — pixel-confirmed |

The `x=4` inset the earlier pass measured is a *consequence*, not an authored value: the
badge is `p-[12px]` so its content box is 56px wide, but the circle is `shrink-0 size-[72px]`
and overflows it evenly — `12 + 28 - 36 = 4`. Vertically `p-12` on a 96px badge gives a
72px content box exactly, so `y=12` is the real padding. If you rebuild this, the honest
model is "72px circle centred in an 80x96 cell", not "4px side padding".

### The 420-vs-400 question — ANSWERED

Row-1 is:

```jsx
<div className="content-stretch flex items-start relative shrink-0 w-[420px]" data-node-id="1:3785" data-name="Row-1">
```

with exactly **five** `w-[80px]` children and nothing else.

- **No sixth badge node exists** — not hidden, not zero-width. The subtree has five children.
- **No padding property exists** — there is no `p-*`, `pr-*`, or `gap-*` on Row-1.
- The width is a **hardcoded `w-[420px]`** on a flex row whose children total 400px, with
  `items-start` and no `justify-*`, so the badges pack left and 20px of empty track trails.

So it is neither trailing padding nor a recoverable deleted badge: it is an **over-declared
fixed width, an authoring artifact**. In implementation the track width should be
content-driven (5 x 80 = 400) and the 420 dropped. Caveat on the deleted-badge theory: a
node that was deleted leaves no trace in the file, so I can prove there is no sixth badge
*now* and that no padding is declared — I cannot prove what the 420 was originally for.

Secondary confirmation from the render: `get_screenshot` on `1:3785` returned
`original_width: 358`, not 420 — the parent `Slider-Track-Wrapper` clips it. That is also
why the 5th badge (Spribe) is visibly cut off in `prov-3785.png`, which is the scroll hint.

### Provider logo assets — URLs retrieved

These expire ~7 days from now. **Important: only Spribe exports as one self-contained
SVG.** The other four come back as Figma clip-path decompositions — a mask file plus a
fill file that must be composited with `mask-image`. Reassembling those in code is fragile;
re-export each logo as a single flattened SVG from Figma instead.

| Provider | Logo node | Size | Files | URL |
| --- | --- | --- | --- | --- |
| Pragmatic | `1:3788` `Frame` | 44x44 | mask | `https://www.figma.com/api/mcp/asset/7308af00-b721-4acc-ad1d-70e1c8dea11f.svg` |
| | | | fill | `https://www.figma.com/api/mcp/asset/fae97fc6-5d80-4a07-8e72-723edd174ec3.svg` |
| 3 Oaks | `1:3799` `3-OAKS 1` | **45**x44 | mask | `https://www.figma.com/api/mcp/asset/e68a8dc6-8dc6-4424-8ef3-39309d63cf67.svg` |
| | | | fill | `https://www.figma.com/api/mcp/asset/be8f8e1b-5477-4b9d-9433-00ee26c51c43.svg` |
| BGaming | `1:3820` `BGAMING 1` | 44x44 | vector 1 (`1:3821`) | `https://www.figma.com/api/mcp/asset/22fea2f9-de8b-40c9-b99a-a62747614388.svg` |
| | | | vector 2 (`1:3822`) | `https://www.figma.com/api/mcp/asset/b784b172-86af-4613-b676-94f665dbe9f4.svg` |
| | | | mask (`1:3826`) | `https://www.figma.com/api/mcp/asset/f5bf1e11-aee5-4f30-962d-a4a04bcc5c36.svg` |
| | | | fill | `https://www.figma.com/api/mcp/asset/4eb78288-26ce-4d91-9a3b-c5fd8c1b3782.svg` |
| Nolimit City | `1:3843` `NOLIMIT-CITY 1` | 44x44 | mask | `https://www.figma.com/api/mcp/asset/cef54368-8097-49dd-a515-64c156f3b96f.svg` |
| | | | fill | `https://www.figma.com/api/mcp/asset/1acc2980-7b39-4c7e-8448-cf5a50634650.svg` |
| **Spribe** | `1:3871` `Frame` | 44x44 | **single SVG** | `https://www.figma.com/api/mcp/asset/309b5d7d-cb94-4ff9-a9d4-a501a450e988.svg` |

Badge wrapper node ids, in track order: `1:3786` Pragmatic, `1:3797` 3 Oaks, `1:3818`
BGaming, `1:3841` Nolimit, `1:3869` Spribe. Circle node ids: `1:3787`, `1:3798`, `1:3819`,
`1:3842`, `1:3870` — all five carry the identical `bg-white` + `rounded-[1000px]` +
`drop-shadow-[0px_6px_9px_rgba(23,69,143,0.08)]`, so the circle is one component.

Visually the logos are near-black/grey wordmarks with brand accents (3 Oaks and BGaming
carry orange/amber `#F2972F`-range marks; Pragmatic has a small amber accent at `x≈55-61`).
Exact per-logo brand hexes were not extracted — they live inside the fill SVGs and are not
needed to build the badge.

---

## 5. Colour additions to the token list

| Hex | Used by | How measured |
| --- | --- | --- |
| `#F7FAFF` | page background behind the game rows and the provider track | pixel, 4 widely separated samples |
| `#FFFFFF` | provider circle fill | pixel + `bg-white` |
| `#07134F` | section title | pixel + prior design context |
| `#92BDF3` | section icon (`Popular` flame) | pixel + SVG `fill` |
| `#DCEBFF` | header divider stroke, dashed 2/2 | SVG `stroke` |
| `#EFF6FF` | see-all pill fill | pixel |
| `#BFDBFE` | see-all pill border | pixel |
| `#1E40AF` | see-all label + chevron stroke | pixel + SVG `stroke` |
| `rgba(23,69,143,0.08)` | provider circle drop shadow | design context, pixel-corroborated |

---

## UNKNOWN

1. **Whether the two provider tracks differ.** `1:3785` and `1:3875` carry the same five
   providers in the same order. I measured only `1:3785`. *Question for the owner: are the
   two tracks two real data rows placeholdered identically, or is the second a duplicate?*
   (Carried over unresolved from the earlier pass; I did not spend a call on `1:3874`.)
2. **Per-logo brand colours.** Not extracted — they are inside the fill SVGs. Not needed to
   build the badge, and recoverable for free by curling the URLs above while they live.
3. **What the 20px on Row-1 was originally for.** I can prove there is no sixth badge and
   no padding property today. A deleted node leaves no trace, so the original intent is not
   recoverable from the file.
4. **Card artwork for rows `1:3588` and `1:3964`.** Confirmed only for `1:3414` that all six
   cards share one PNG. Same structure and layer names in the other rows, but not verified.
5. **Hover / pressed / focus states.** None exist for the card, the pill, or the provider
   badge anywhere in these nodes. The `Overlay+Shadow` name implies a hover treatment was
   intended for the card but it is not drawn. *Question: what should the card and badge do
   on press?* This is a mobile-first design, so press feedback is the relevant state, not hover.
