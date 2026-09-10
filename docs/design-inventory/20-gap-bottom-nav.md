# Top-Win — gap fill: navchrome (bottom nav + the two headers)

File key: `s2CqwGqe0O0FcALhBNlTRe`. Target nodes: `1:6489` (navbar, `Property 1=log in ua`, 390x111),
`1:6594` (Header Pre-login, 390x60), `1:6617` (Header POST-login, 390x60).

Companion to `10-navbar-headers.md`, which holds the geometry. This file holds the colours that
document listed as UNKNOWN (its Q1, Q2, Q3, Q6).

## How these values were obtained

Figma MCP calls spent: **3 of the 8 allowed** (`get_screenshot` on `1:6594`, `1:6617`, `1:6489`).
No call was refused; quota was not hit.

The eight navbar asset URLs recorded in `10-navbar-headers.md` §4 **were still live** and were
fetched with `curl` at zero MCP cost. Those SVG files are the primary source for every fill,
gradient stop, stroke and filter below — they are the exported vector source, not a sample of a
render. The screenshots were then decoded pixel-by-pixel (`pick.mjs`, plus `edge.mjs` written
here) to **confirm** each SVG value against the render and to measure things the SVG cannot say
(the notch clearance, the header hairline question).

Where SVG and pixel are both quoted below and they agree, that is two independent measurements
agreeing, not one restated.

Downloaded copies live in `.../topwin-inventory/svg/` (`subtract.svg`, `btn69.svg`, `dot.svg`,
`burger.svg`, `sport.svg`, `casino.svg`, `live.svg`, `promo.svg`). Screenshots: `nav-ua.png`
(391x134), `hdr-pre.png` (390x60), `hdr-post.png` (390x60).

---

## 1. The bar plate — `Subtract` `1:6490`

### 1.1 Fill

**`#191970` at 80% opacity** — i.e. `rgba(25, 25, 112, 0.8)`.

- SVG source: `<path ... fill="#191970" fill-opacity="0.8"/>`.
- Pixel confirmation: the plate renders `#1A1A60` in `nav-ua.png` (sampled at (30,44), (30,60),
  (30,110), alpha 255). Figma composited it over its own `#1E1E1E` canvas.
  0.8x25 + 0.2x30 = 26 = `0x1A` (R and G); 0.8x112 + 0.2x30 = 95.6 = `0x60` (B). Exact match on
  all three channels.

`#191970` is the file-level named style **Navy** (recorded in `00-tokens.md` and `07-sport.md`).
So the nav plate is Navy at 80%, not an unnamed one-off colour.

### 1.2 Corner radius — **12px, all four corners**

Measured two ways.

Exported path, top-left: `V13 C0.5 6.09644 6.09644 0.5 13 0.5` → 12.5 on a path whose coordinates
sit on the stroke centreline. Bottom-left: `H12.5 C5.87258 68.5 0.5 63.1274 0.5 56.5` → 12.0. The
0.5 difference is the 1px centred stroke, not two different radii.

Pixel, left edge of the plate in `nav-ua.png` (plate occupies rows 43..110):

| row | distance from plate edge | measured x of fill edge | predicted for r=12 |
| --- | --- | --- | --- |
| 44 | 1 from top | ~7.0 | 7.20 |
| 46 | 3 from top | ~4.5 | 4.06 |
| 49 | 6 from top | ~2.0 | 1.61 |
| 55 | 12 from top | 0.5 | 0 |
| 105 | 5.5 from bottom | ~2.0 | 1.91 |
| 108 | 2.5 from bottom | ~5.0 | 4.67 |

Implement as `border-radius: 12px`. All four corners, including the two that sit at the bottom of
the screen.

### 1.3 A 1px stroke with a vertical gradient — this was not in the earlier pass at all

The `Subtract` export contains a **second** path: the outlined 1px stroke, filled with

```
linearGradient  x1=236.06 y1=68.5  ->  x2=236.06 y2=0.5   (userSpaceOnUse, vertical)
  stop         stop-opacity="0"          (bottom of the bar — fully transparent)
  stop offset=1 stop-color="white"       (top of the bar — opaque #FFFFFF)
```

A 1px border that is **opaque white along the top edge and fades to fully transparent by the
bottom edge**. It follows the whole outline, including the notch, so the notch gets a lit rim too.

Pixel confirmation, `nav-ua.png`:
- top edge at x=30: row 42 `#8E8E8E`, row 43 `#8B8BAF`, row 44 plate. `#8E8E8E` is white at ~50%
  over `#1E1E1E`; the two rows together carry ~1px of full-strength white. Opaque white at the top.
- left edge at x=1 going down: rows 48-53 bright (`#B5B5B9` peak, the top-left corner), then plate
  through row 99, then rows 100-104 drift `#1A1A5E` → `#1A1A57` → `#1A1A3E` → `#1D1D2C`. The rim
  has faded to nothing by the bottom-left corner. Matches the gradient.
- the notch rim is visible in every row scan (e.g. row 52: `#93899F` at x=163, `#AEA4AA` at x=211).

CSS: this is a gradient border, so `border: 1px solid` cannot express it. Either
`border-image: linear-gradient(to top, transparent, #fff) 1` (loses the radius) or the usual
two-layer `background-image` + `background-origin/clip: border-box/padding-box` mask. Simplest
faithful option is to keep the exported SVG as the bar plate.

### 1.4 Background blur

`data-figma-bg-blur-radius="5"`, exported as `backdrop-filter: blur(2.5px)` inside a
`<foreignObject>` clipped to the plate path.

So the plate is a **glass** surface: Navy at 80% over a 5-unit Figma background blur (CSS
`blur(2.5px)`). The blur is clipped to the plate shape — the notch cut-out is **not** blurred,
page content shows through it sharp.

This is invisible in the isolated screenshot (a flat `#1E1E1E` canvas blurs to itself), so the
blur is a read of the export, not of a pixel. The value itself is exact.

### 1.5 The notch, measured

Exported path, the top edge run:

```
H148.809  C151.759 0.5 154.606 1.58671 156.805 3.55258
L177.243 21.8184  C183.055 27.0128 192.024 27.0576 197.893 21.9219
L218.977 3.46981  C221.164 1.5553 223.973 0.5 226.88 0.5  H378
```

- Notch opening on the bar's top edge: **148.809 → 226.88 = 78.07 wide**.
- Notch centre: (148.809 + 226.88) / 2 = **187.84**.
- Notch floor: ~y 26.5 in the plate's own coordinates → **25px below the bar's top edge**
  (pixel: at x=188 the plate resumes at row 69; bar top is row 43).

### 1.6 There is a ~6px transparent ring between the notch and the button

Not previously recorded, and it changes how the component must be built.

Horizontal gap between the plate's inner notch edge and the diamond's edge, from `nav-ua.png`:

| row | left gap | right gap |
| --- | --- | --- |
| 44 | x 156..164 (~9px) | x 212..219 (~8px) |
| 52 | x 165..172 (~8px) | x 203..210 (~8px) |
| 60 | x 174..182 (~8px) | x 194..201 (~8px) |

Vertically, at x=188: orange ends at row 61, plate resumes at row 69 → **~6.5px** below the button.

Both notch edge and diamond edge run at dx/dy ≈ 1.06–1.19, so a constant ~8px horizontal offset is
a constant **~5.5–6px perpendicular clearance**. The ring is uniform all the way round.

Through that ring you see **whatever is behind the nav** — in the screenshot the `#1E1E1E` canvas,
on a real screen the scrolling page. It is a hole, not a dark stroke. An implementation that draws
the plate as a plain rounded rect and parks the button on top will fill this ring with plate colour
and lose the effect.

---

## 2. The raised centre button — `btn-69` `1:6518`

### 2.1 It is not a circle; "diameter" does not apply

Confirmed again from the exported path's own extrema: x 30.119 → 93.772 (**width 63.653**),
y 0.833 → 59.750 (**height 58.917**). A rounded diamond / rotated squircle, aspect 1.080.

Pixel confirmation, row-by-row orange extent in `nav-ua.png`:

```
y= 4  x 183..193  w=11   y=32  x 157..219  w=63   y=60  x 183..193  w=11
y=16  x 169..206  w=38   y=44  x 165..210  w=46
y=24  x 161..215  w=55   y=56  x 178..198  w=21
```

Widest at y=32 (w=63 ≈ 63.65), symmetric top-to-bottom about y=32, vertical extent ~3..61
(h ≈ 59). Matches the vector exactly.

### 2.2 Fill — a vertical orange gradient

```
linearGradient  x1=61.9455 y1=0.833333  ->  x2=61.9455 y2=59.7497   (userSpaceOnUse)
  stop           stop-color="#FE8200"     (top vertex)
  stop offset=1  stop-color="#FE4800"     (bottom vertex)
```

x1 == x2 → strictly **top-to-bottom**, and it spans exactly the diamond's own height (0.833 to
59.750), not its bounding box or the SVG canvas.

CSS: `linear-gradient(180deg, #FE8200 0%, #FE4800 100%)`.

Pixel confirmation at x=188 in `nav-ua.png`: y=5 `#FE7F00`, y=20 `#FE7000`, y=32 `#FE6400`,
y=44 `#FC5800`, y=58 `#FC4A00`, y=60 `#FE4900`. A clean monotone ramp from `#FE8200` to `#FE4800`.

Note this is **not** the platform's `Orange #FF4500` named style, and not the header/CTA gradient
`#FF8C00 → #FF4500` used by the Register button (`1:3297`, `1:6002`). It is a third, distinct
orange pair. Do not substitute one for the other.

### 2.3 The glow — two stacked drop shadows, both baked into the SVG filter

`filter0_dd_0_18`, read directly off the `feOffset` / `feGaussianBlur` / `feColorMatrix` triples:

| # | dy | stdDeviation | colour matrix | colour | alpha |
| --- | --- | --- | --- | --- | --- |
| 1 | 1.19048 | 1.0119 | 0.317647 / 0.270588 / 0.619608 | `#51459E` | 0.0505556 |
| 2 | 41.6667 | 15.0595 | 1 / 0.270588 / 0 | `#FF4500` | 0.21 |

SVG `stdDeviation` is half the CSS blur radius, so as CSS:

```
filter:
  drop-shadow(0px 1.19px 2.02px rgba(81, 69, 158, 0.051))
  drop-shadow(0px 41.67px 30.12px rgba(255, 69, 0, 0.21));
```

Shadow 2 is the glow, and its colour is **`#FF4500` — the named style Orange**, at 21%. It is
thrown 41.67px straight down with a 30px blur, which is exactly the `+71.79px` bottom bleed that
`10-navbar-headers.md` §1.1 derived from the render box. The two agree.

Shadow 1 is a tight violet contact shadow, effectively invisible on its own (5% alpha).

Pixel confirmation of the glow, `nav-ua.png` column x=188:
- **on the plate**, rows 105-110: `#271C5A` against the plate's `#1A1A60`. Solving
  `#FF4500` over `#1A1A60` for that result gives alpha ≈ 0.19 — the glow paints **on top of** the
  bar plate, it is not behind it. Z-order matters: `btn-68` follows `Subtract` in the node list.
- **below the bar**, rows 111-124: `#251E1D` at row 111 decaying to the bare `#1E1E1E` canvas by
  row 125. The glow spills past the bottom of the 111-tall component.

Clipping consequence, restated because it is the expensive one: the glow needs ~72px of room below
the button and ~30px each side. `overflow: hidden` anywhere on the nav kills it.

### 2.4 The burger glyph

`burger.svg` — three `20 x 2` bars at y 0, 8, 16 in a 20x18 box, every one `fill="white"`. Flat
`#FFFFFF`, no gradient, no opacity.

---

## 3. The active dot `1:6516` — **`#F45B24`**

```
<circle id="active-dot" cx="2" cy="2" r="2" fill="#F45B24"/>
```

Solid fill, no stroke, no gradient, no opacity. A 4x4 box, r=2 → a true circle.

Pixel confirmation, `nav-ua.png` row 101: x 111,112,113 are all exactly `#F45B24`, with
antialiased `#7A3746` / `#6C3249` either side. Byte-identical to the SVG.

`#F45B24` is a **fourth** orange, distinct from the button gradient (`#FE8200`/`#FE4800`), from the
glow / named Orange (`#FF4500`), and from the active label (`#FFB095`). Four oranges in one 111px
component. Recorded as measured; whether that is intentional is question Q-A below.

---

## 4. Active vs inactive icons — same kind of asset, different baked fill

Every one of the five nav glyphs is a **single-colour flat-filled vector**. No gradients, no
strokes, no multi-tone artwork:

| Tab | asset | fills present in the file |
| --- | --- | --- |
| Casino `1:6499` | `casino.svg` 24x24 | one path, `fill="white"` |
| **Sport (active)** `1:6504` | `sport.svg` 24x24, `<path id="soccer">` | one path, **`fill="#FFB095"`** |
| Live casino `1:6509` | `live.svg` 19x24 | 3 paths, all `fill="white"` |
| Promo `1:6513` | `promo.svg` 24x24 | 4 paths, all `fill="white"` |
| Burger `1:6520` | `burger.svg` 20x18 | 3 paths, all `fill="white"` |

Pixel confirmation at row 67 in `nav-ua.png`: the Sport glyph reads `#FFB095` (x 109, 117-119); the
Casino glyph at the same row reads `#FFFFFF` (x 33, 37, 42, 47, 51).

**Answer to the question as asked:** the active Sport icon is not a differently-drawn asset. It is
the same class of asset — one flat colour — exported with `#FFB095` baked in instead of `#FFFFFF`.
`#FFB095` is the same value as the active label colour, so active state is a single colour applied
to both glyph and label.

Build it as **one glyph per tab with `fill: currentColor`** (or a CSS mask), and set the colour on
the tab: `#FFFFFF` inactive, `#FFB095` active. That reproduces both states from one asset and makes
the other four tabs' active states — which do not exist anywhere in the file — fall out for free.

Caveat, unchanged from the earlier pass: the file contains **only** Sport-active. I measured that
the active treatment is a flat colour swap. I did **not** measure that no other property changes on
activation, because there is no second active state to compare against. See Q-B.

---

## 5. The ~7px leftward offset — the button really is nudged; the artwork is centred

This is the oddity the brief asked to resolve rather than fix. Four independent measurements, all
agreeing, and they point one way.

**The artwork inside the button is dead-centre in its own box.** From `btn69.svg`, the diamond's
extrema are x 30.119 → 93.772, so its centre is x 61.9455 — which is also the value Figma wrote
into the gradient's `x1`/`x2`. Half of the 63.653 width is 31.826; 30.119 + 31.826 = 61.945. Centred
to five decimal places.

Pixel confirmation is stronger still — `edge.mjs` traced the orange extent on 15 rows:

```
y= 4 centre 188.00    y=24 centre 188.00    y=44 centre 187.50
y= 8 centre 188.00    y=28 centre 188.00    y=48 centre 187.50
y=12 centre 188.00    y=32 centre 188.00    y=52 centre 188.00
y=16 centre 187.50    y=36 centre 188.00    y=56 centre 188.00
y=20 centre 188.00    y=40 centre 188.00    y=60 centre 188.00
```

Constant. The diamond is not lopsided, not skewed, not off-centre in its frame.

**What is off-centre is the whole centre cluster, as one unit:**

| element | measured centre x | source |
| --- | --- | --- |
| plate notch | **187.84** | `(148.809 + 226.88) / 2`, exported path |
| button vector `btn-69` | **187.83** | x 156 + 63.653/2, metadata |
| burger glyph | **187.72** | `10-navbar-headers.md` §1.5 |
| burger, in pixels | **188.0** | middle bar spans png x 179..197 |
| `Меню` label | **188** | `left-[calc(50%-7px)]` |
| notch, in pixels | **187.25–187.5** | plate inner edges at rows 44 / 52 / 60 |
| — frame centre | 195 | 390 / 2 |
| — the four flanking tabs | 42, 112, 278, 348 | symmetric about 195 |

Every part of the centre cluster sits at 187.8 ± 0.6. The four flanking tabs sit symmetric about
195. The offset is **7.17px**, it is identical in all three language variants, and — the new fact —
**the plate's notch was cut at 187.84 too**, in a separate exported vector.

**Conclusion (reasoning, flagged as such):** a stray nudge on one layer cannot move a boolean
subtraction inside a different node. For the notch, the button, the glyph and the label to agree at
187.8 while the tab row is symmetric about 195, either the whole cluster was moved together after
the notch was cut, or all of them were positioned against something that is not the frame centre.
The artwork is not the cause; the placement is.

**Measured, not reasoned:** the artwork is centred, the container is at x=156, and 156 + 31.826 =
187.83 ≠ 195. To centre the button you would move `btn-68` from x=156 to x=163.17 — **and you would
have to re-cut the plate notch by the same 7.17px**, or the ring in §1.6 goes lopsided by 7px on a
6px gap, i.e. the button would touch the notch on one side and show a 13px hole on the other. That
is the reason not to "just centre it" in code without asking. See Q-C.

---

## 6. The two headers `1:6594` / `1:6617` — flat `#080814`, nothing else

**Measured, at 1:1, on both.** `get_screenshot` returned 390x60 for each (natural size).

- Full-height column scans at x=8 and x=200 (pre-login) and x=8 and x=180 (post-login): every row
  from 0 to 59 is exactly **`#080814`**. One run, no transitions.
- Full-width scan of **row 0**: `#080814` across all 390 columns. No top hairline.
- Full-width scan of **row 59** (the bottom row): `#080814` for x 0..251, then a faint lift to
  `#0B0A14` / `#0C0B15` for x 252..330, then `#080814` again for x 331..389.
  That band is **not a divider** — it is the bottom of the Sign In button's own shadow. The Sign In
  button spans x 243..338 at y 11.5..48.5 and carries
  `drop-shadow(0px 4px 6px rgba(198,144,61,0.25))`, which reaches y ≈ 58.5. The band is inset from
  the button's edges the way a 20px-radius pill's shadow is. A divider would run the full 390.
- Corners `(0,0)`, `(389,0)`, `(0,59)`, `(389,59)`: all `#080814`, **alpha 255**. Square corners, no
  radius, fully opaque.

**So: no bottom hairline, no top hairline, no corner radius, no transparency.** The headers are a
flat opaque `#080814` rectangle.

**Backdrop blur:** none is declared on either node. `get_design_context` in the earlier pass
reported `background: #080814` and nothing else, and the Figma MCP does emit backdrop blur when it
is present — the `Subtract` export in §1.4 is the proof that it does. Absence here is therefore
meaningful, not merely unreported. An opaque fill would make a backdrop blur invisible anyway.

**The one thing this cannot rule out** is a hairline drawn as a *sibling* node outside the header
frame. But `1:6594` and `1:6617` both sit at canvas (2184, 633) as standalone spec frames, not
inside a screen, so there is no sibling context around them to hold such a node. The screens'
headers are different nodes entirely — see §7.

---

## 7. Flag: these two headers are not the headers on the measured screens

Not part of the assigned gap, but it falls out of the colours and it is load-bearing.

| | `1:6594` / `1:6617` (this file) | `1:3290` (casino), `1:5995` (sport) |
| --- | --- | --- |
| background | **`#080814`** dark | **`#E8F1FC`** light |
| font | Inter | Outfit |
| primary button | `linear-gradient(to right, #F0C775, #C6903D)` gold, radius 20 | `linear-gradient(to right, #FF8C00, #FF4500)` orange, radius 6 |
| secondary button | transparent, radius 20 | `#EDF5FF`, radius 8 |
| copy | `Log In` / `Sign In` (English) | `Увійти` / `Реєстарція` (Ukrainian) |
| search | 40x40 square-ish | 36x36 circle, `#EDF5FF`, 40x40 icon cropped 2px |
| logged-in control | 122x40 pill, `$ 140.00` in `#00F299`, + gradient `#00F299→#3B82F6` | 99x40 balance chip, `$ 140.00` in `#191970` Roboto Flex |

Two different header designs, sharing only the 390x60 box and the `$ 140.00` placeholder. Per
`07-sport.md` §8.3 and §10.3 the navbar instance **is** placed on the screens (`1:6483` / `1:580`,
390x111 at absolute (0, 910) — 910 + 111 = 1021, so it lands flush on the frame bottom). No
equivalent placement was found for `1:6594` / `1:6617`. See Q-D.

Worth noting the nav plate is Navy at 80% with a background blur, which is a dark glass bar — that
reads correctly over the **light** screens (`BG main #FFFFFF`), so the navbar and the light headers
are consistent with each other. The dark `#080814` headers are the odd ones out.

---

## 8. Consolidated navchrome tokens

| Token | Value | Source |
| --- | --- | --- |
| nav plate fill | `rgba(25,25,112,0.8)` = **Navy `#191970` @ 80%** | SVG + pixel |
| nav plate radius | **12px**, all four corners | path + pixel |
| nav plate stroke | 1px, `linear-gradient(to top, transparent, #FFFFFF)` | SVG + pixel |
| nav plate backdrop blur | Figma radius 5 → `backdrop-filter: blur(2.5px)` | SVG |
| notch opening | 78.07 wide, 25 deep, centred x 187.84 | path + pixel |
| notch-to-button clearance | ~6px perpendicular, uniform, **transparent** | pixel |
| raised button size | 63.653 x 58.917, rounded diamond | path + pixel |
| raised button fill | `linear-gradient(180deg, #FE8200, #FE4800)` | SVG + pixel |
| raised button shadow 1 | `0 1.19px 2.02px rgba(81,69,158,0.051)` | SVG |
| raised button glow | `0 41.67px 30.12px rgba(255,69,0,0.21)` — **Orange `#FF4500`** | SVG + pixel |
| active dot | **`#F45B24`**, 4x4 circle, flat | SVG + pixel |
| icon, inactive | `#FFFFFF` flat | SVG + pixel |
| icon, active | `#FFB095` flat (= active label colour) | SVG + pixel |
| burger glyph | `#FFFFFF`, three 20x2 bars, 8px pitch | SVG |
| header background (both states) | `#080814`, opaque, flat | pixel |
| header border / radius / blur | **none** | pixel + design context |

Four distinct oranges in the navchrome: `#FE8200`, `#FE4800`, `#FF4500`, `#F45B24`, plus `#FFB095`
for active text and icon.

---

## UNKNOWN — what this pass did not settle

**Q-A. Four oranges — token or accident?** Measured: the button gradient is `#FE8200 → #FE4800`,
the glow is `#FF4500`, the active dot is `#F45B24`, active text/icon is `#FFB095`. Only `#FF4500`
is a named style (Orange). `#F45B24` is 4/22/36 away from `#FF4500` in RGB — close enough to look
like a duplicate, far enough to be deliberate. Should the dot be `#FF4500`, or is `#F45B24` real?
Not answerable from the file; needs the designer.

**Q-B. Does anything besides colour change on activation?** The component set has only
Sport-active, in all three language variants. I measured that the active icon and label are
`#FFB095` and the inactive ones `#FFFFFF`, and that all five glyphs are single-flat-colour vectors.
I could not measure whether activation also changes glyph weight, adds a background, or changes the
icon's shape, because there is no second active state anywhere in `1:6488` to diff against. Is
there another node in the file carrying a different active tab?

**Q-C. Centre the cluster at 195, or reproduce 187.83?** Now fully characterised: the artwork is
centred, the container is nudged, and the plate's notch is nudged with it. The design decision is
still open. If the answer is "centre it", both `btn-68` **and** the notch in `Subtract` must move
7.17px right together — moving only the button breaks the 6px ring.

**Q-D. Are `1:6594` / `1:6617` live, or a dead/alternate spec?** They are dark `#080814` Inter
headers with gold buttons; the two screens measured in `01-casino-top.md` and `07-sport.md` use
light `#E8F1FC` Outfit headers with orange buttons. I did not find `1:6594`/`1:6617` placed on any
screen frame, but I also did not search the whole file for instances of them — that would have cost
Figma calls. Which header ships?

**Q-E. What is behind the nav on a real screen?** The plate is 80% opaque over a 5-unit background
blur, and the notch ring is a genuine hole. Both only make sense over content. `07-sport.md` puts
the navbar at absolute (0, 910) in a 1021-tall frame, so 111px of page content sits behind it. Not
verified visually here — no screenshot of a screen with the nav composited over scrolled content
was taken.

**Q-F. Asset URL expiry.** The eight navbar URLs from `10-navbar-headers.md` §4 still resolved
today and are now downloaded to `svg/`. The five header URLs in that same section were not
re-tested. They expire ~7 days from the call that minted them.
