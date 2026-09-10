# Gap 21 — catnav + recent-wins ticker (frame 1:3289)

File `s2CqwGqe0O0FcALhBNlTRe`, mobile 390.

Figma MCP calls spent: **4 of 8** (2x `get_screenshot`, 2x `get_design_context`). No quota refusal.
Method: 1:1 PNG renders decoded with the local `pick.mjs` for pixel truth, then `get_design_context`
for the things a pixel cannot answer (radius, shadow, font family/weight/size/line-height).
Where the two disagree, the Figma value is recorded and the pixel reading noted.

Renders kept:
- `catnav-3337.png` — node 1:3337, 375x44, 1:1
- `ticker-3391.png` — node 1:3391, 390x78, 1:1

---

## 1. Category bar — 1:3335 → 1:3337 "Category switcher"

### Track 1:3337

| Property | Value | Source |
| --- | --- | --- |
| Background | `#E8F1FC` | pixel + code |
| Height | 44 | code |
| Padding | 4 all round | code |
| Corner radius | 13 | code |
| Layout | flex row, items-center, no gap between chips | code |

The 4px track padding is why chip 1 starts at x=4 in the render, not x=0.
Parent 1:3336 is `w-358.226` with `pl-16`; the rendered node width is 375, not the 502 in the
brief — geometry outside this gap, flagged, not resolved.

### HOW ACTIVE IS DRAWN

Pure paint, three changes, no border and no underline anywhere:

1. **Fill.** Active chip 1:3338 has `background #C9DCF4`. Inactive chips 1:3343 / 1:3379 / 1:3385
   have **no fill at all** — the track's `#E8F1FC` shows through. Measured: solid `#C9DCF4` across
   the active chip body, uniform `#E8F1FC` across every inactive chip body.
2. **Label + icon colour.** Active `#102A67`, inactive `#71809A`. Measured as darkest ink in each
   chip; the icon takes the same colour as its label in both states.
3. **Shadow.** Active only: `box-shadow: 0px 2px 5px 0px rgba(35,101,169,0.1)`. Visible in the PNG
   as a faint blue darkening ~3px above and ~4px below the chip against the `#E8F1FC` track.

No stroke on either state. No tint difference in the icon beyond the label colour.

### Chip geometry / type (both states)

| Property | Active 1:3338 | Inactive 1:3343 / 1:3379 / 1:3385 |
| --- | --- | --- |
| Fill | `#C9DCF4` | none (track shows through) |
| Border | none | none |
| Corner radius | 10 | 10 |
| Width | 121 | 121 / 121 / hug (1:3385 has no fixed width) |
| Height | full (36 inside the 44 track) | same |
| Padding | `px-16`, vertically centred | same |
| Shadow | `0px 2px 5px 0px rgba(35,101,169,0.1)` | none |
| overflow | clip | clip |
| Icon | 11.226 x 16 SVG "Popular" | 16 x 16 SVG |
| Icon→label gap | **8** | **6** |
| Label font | Inter Medium (500) | Inter Medium (500) |
| Label size / line-height | 13px / 1.35 | 13px / 1.35 |
| Label transform | `capitalize` | `capitalize` |
| Label colour | `#102A67` | `#71809A` |

Pixel cross-check on the corner: the fill profile at the chip's left edge (4px inset at the edge
column, 1px at 2.5px in, 0 at 4.5px in) fits a radius near 10–12; the code value 10 is the one
recorded. The shadow smears the outer 2px, which is what pushed the pixel fit high.

Icon assets (7-day URLs):
- active "Popular" flame — `https://www.figma.com/api/mcp/asset/7a9214cc-fac8-440e-b4b5-cf7a7b0bbd1f.svg`
- "Must-play slots" (1:3345) is a mask/clip stack of 11 SVGs, not one flat file
- live-casino icon shared by 1:3381 and 1:3387 — `https://www.figma.com/api/mcp/asset/c900456b-3df9-4a9f-a638-854f1aa97e2e.svg`

---

## 2. Recent-wins ticker — 1:3391, 390x78

### Section

| Property | Value | Source |
| --- | --- | --- |
| Section background | `#F7FAFF` | pixel + code |
| Padding | `pt-16 pb-4 px-16` | code |
| Layout | flex row, items-center, `gap-12` | code |
| Entry background | **none** — no card, no fill, no border on the entry itself | pixel + code |

Entry inner padding is `px-4`, `gap-12` between thumbnail and text, height full.
Entry 1 (1:3392) is `w-147`; entries 2 and 3 hug.

### Divider 1:3399 — **vertical**

`background #CBD5E1`, `width 1px`, `height 44px`, between entry 1 and entry 2 only.
Measured in the PNG at x=175, spanning y=23..66, single column, exactly `#CBD5E1`.
It is a vertical hairline rule, not a horizontal one.

### Thumbnail (1:3393 / 1:3401 / 1:3408)

| Property | Value |
| --- | --- |
| Size | 46 x 46 (measured x20..65, y22..67) |
| Corner radius | **8** (code) |
| Fill under the image | `rgba(0,0,0,0.2)` |
| Border | 1px solid `rgba(255,255,255,0.1)` |
| overflow | clip; the artwork is scaled up and cropped (entry 1: `h-202.45% top--51.22%`) |

Pixel corner profile suggested ~6; the artwork fills the corner so the antialiased ramp reads
smaller than the true radius. Code value 8 recorded.

### Three text lines (stack 1:3395, `flex-col gap-2`, `w-75`, nowrap)

| Line | Node | Font | Size | Line-height | Colour |
| --- | --- | --- | --- | --- | --- |
| Amount | 1:3396 | Roboto Flex **Bold** (700) | 12 | 22 | `#16A34A` (entry 1) |
| Amount | 1:3404 / 1:3411 | Roboto Flex Bold (700) | 12 | 22 | `#F97316` (entries 2, 3) |
| Masked player | 1:3397 / 1:3405 / 1:3412 | Roboto Flex Regular (400) | 12 | 14 | `#64748B` |
| Game name | 1:3398 / 1:3406 / 1:3413 | Roboto Flex **SemiBold** (600) | 11 | 14 | `#94A3B8` |

**The amount colour is per-entry, not fixed** — green `#16A34A` for entry 1, orange `#F97316` for
entries 2 and 3. Both confirmed in the PNG (`#16A34A` at the entry-1 amount, `#F97316` at the
entry-2 amount). Reasoning, not measured: this is almost certainly win-size or win-type coding,
but the design gives only two samples and no legend, so the rule behind the switch is unknown.

Every line carries the same Roboto Flex variation settings:
`"GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100`.

Game name on entry 1 only: `w-90`, `overflow-hidden`, `text-ellipsis` — it truncates
("у Big Bass Amazon Xtreme" renders clipped). Entries 2 and 3 have no ellipsis wrapper.
Entry 3's text stack uses `gap-4`, not `gap-2` — likely a design slip, flagged not fixed.

Measured ink boxes, entry 1 (origin = ticker node):
amount x78..135 y24..32 · player x79..122 y44..51 · game x78..167 y61..71.

Thumbnail assets: `.../aa008146-9400-450e-ae0f-0170998084fb.png` (Big Bass Amazon Xtreme),
`.../499c3692-ddc6-4d23-be58-a1ca36923dbb.png` (Yeti Quest, used twice).

---

## UNKNOWN

- What decides the amount colour green `#16A34A` vs orange `#F97316`? Two samples, no legend.
- Hover / pressed / focus paint for a category chip — the file has only rest states.
- Why node 1:3337 renders 375 wide when the brief records the track as 502, and where the fourth
  chip's 131 width comes from (1:3385 is hug-width in the code, no fixed 131).
- Scroll/marquee behaviour of the ticker: entry 3 overflows the frame, but the design carries no
  animation spec.
