# 06 — Casino post-login delta (`1:581` "Post log" vs `1:3289` "Pre log")

File key: `s2CqwGqe0O0FcALhBNlTRe`
Both frames: `390 × 5628.7001953125`, both start at `y=313` on the canvas.

## Method (what was measured, not reasoned)

`get_metadata` was run on `1:581` and on `1:3289`. Both dumps exceeded the inline token
limit and were saved to file, then parsed and diffed programmatically by document-order
path (`/0`, `/0/0`, `/0/0/1`, …), comparing `tag`, `name`, `x`, `y`, `width`, `height`,
`hidden` at every depth.

- POST tree: **666 nodes**. PRE tree: **666 nodes**.
- Differing paths: **19**.
- Of those 19, **16 are the header subtree**, 2 are the hero carousel wrapper, 1 is a
  float-rounding artefact.

Limitation of the method, stated plainly: the diff compares *layer names*, not text
*content*. Figma auto-names a text layer after its content unless a designer renamed it, so
any renamed text layer could differ in copy without showing up. Only **2** such layers exist
per frame outside the header (`button-label`, `1:604`/`1:3309` and `1:616`/`1:3321`) plus
the `Bonus-Title` pair. All of them were verified individually with `get_design_context` on
`1:601` and `1:3306` — see "Verified identical" below.

---

## The complete list of differences

### 1. Header subtree — the only real difference

`Header postlog` `1:582` (post) vs `1:3290` (pre). Both are `390 × 60` at `y=0`, both
`bg-[#e8f1fc]`, both `px-[16px]`. Everything inside differs. Full measurement in the next
section.

| | POST `1:581` | PRE `1:3289` |
| --- | --- | --- |
| Inner row `Frame 578` | `1:583` — `x=16 y=10 w=358 h=40` | `1:3291` — `x=16 y=12 w=358 h=36` |
| `Logo TopWin` instance | `1:584` — `x=0 y=10 w=111 h=20` | `1:3292` — `x=0 y=8 w=111 h=20` |
| Right-hand cluster | `1:585` `Frame 2135557747` — `x=211 y=0 w=147 h=40` | `1:3294` `btns` — `x=160 y=0 w=198 h=36` |
| Balance pill | `1:586` `Background+Border` `99 × 40` | *(absent)* |
| Balance text | `1:588` `$ 140.00` `55 × 18` | *(absent)* |
| Deposit icon | `1:589` `tabs_4511814 (1) 1` `24 × 24` | *(absent)* |
| Login button | *(absent)* | `1:3295` `btn` `60 × 36`, label `1:3296` |
| Register button | *(absent)* | `1:3297` `btn` `86 × 36`, label `1:3298` |
| Search button | `1:593` `Button` `40 × 40`, svg `1:594` at `0,0` `40 × 40` | `1:3299` `Button` `36 × 36`, svg `1:3300` at `-2,-2` `40 × 40` |
| Hidden `Logo` instance | `1:596` `x=135 y=8 88 × 24` `hidden=true`, **3rd child** | `1:3293` `x=135 y=8 88 × 24` `hidden=true`, **2nd child** |

The hidden `Logo` instance exists in both, same geometry, hidden in both. Only its sibling
index moves (it sits after the button cluster post-login, before it pre-login). No visual effect.

### 2. Hero carousel wrapper — name only

| | POST | PRE |
| --- | --- | --- |
| `/1/0` | `1:598` name **`Frame 2135557759`** | `1:3303` name **`Frame 2135557760`** |

Same `x=-7.5 y=24 w=390 h=192`. Same children, same everything below it. A layer-name
difference with no rendered consequence.

### 3. Hero pagination bar — shifted 16 px right post-login

| | POST | PRE |
| --- | --- | --- |
| `Frame` (dots row) | `1:625` — **`x=32`** `y=188 w=358 h=4` | `1:3330` — **`x=16`** `y=188 w=358 h=4` |

Both hold the same four `Rectangle` pills at the same local offsets: `x=242 w=40`,
`x=286 w=24`, `x=314 w=16`, `x=334 w=8`, all `h=4`. Parent `1:598`/`1:3303` sits at
`x=-7.5`, so the post-login bar's absolute left is `+16 px` versus pre-login and the last
pill would sit at absolute `x = 7.5 - 7.5 + 32 + 334 = 366`, i.e. `16 px` right of pre-login's
`350`. With `w=358` inside a `390`-wide parent starting at `x=32`, the row's right edge lands
at `390`, flush to the frame edge with no right margin — pre-login has `16 px` margin on both
sides. This reads as a stray nudge, not a design decision. See UNKNOWN 4.

### 4. Float-rounding artefact — not a difference

| | POST | PRE |
| --- | --- | --- |
| `image 1816785501` (hidden) | `1:2878` `w=66.26472519772108` | `1:5583` `w=66.2647251977211` |

Same number, different decimal serialisation. `hidden="true"` in both. Ignore.

### 5. Everything else is identical

All 16 top-level sections match on name, x, y, width, height and child count:

| # | Node (post / pre) | Name | y | h |
| --- | --- | --- | --- | --- |
| 0 | `1:582` / `1:3290` | `Header postlog` | 0 | 60 |
| 1 | `1:597` / `1:3302` | `Frame 2135557699` (hero) | 60 | 232 |
| 2 | `1:630` / `1:3335` | `navbar` | 292 | 44 |
| 3 | `1:686` / `1:3391` | `Recent wins - Ticker (iOS)` | 336 | 78 |
| 4 | `1:709` / `1:3414` | `Frame 2135557678` | 414 | 370 |
| 5 | `1:883` / `1:3588` | `Frame 2135557700` | 784 | 370 |
| 6 | `1:1057` / `1:3762` | `Frame 2135557701` | 1154 | 264 |
| 7 | `1:1259` / `1:3964` | `Frame 2135557702` | 1418 | 370 |
| 8 | `1:1435` / `1:4140` | `Frame 2135557703` | 1788 | 370 |
| 9 | `1:1635` / `1:4340` | `Frame 2135557704` | 2158 | 370 |
| 10 | `1:1840` / `1:4545` | `Frame 2135557705` | 2528 | 276 |
| 11 | `1:2009` / `1:4714` | `Frame 2135557706` | 2804 | 370 |
| 12 | `1:2183` / `1:4888` | `Frame 2135557707` | 3174 | 370 |
| 13 | `1:2367` / `1:5072` | `Frame 2135557708` | 3544 | 276 |
| 14 | `1:2535` / `1:5240` | `Frame 2135557709` | 3820 | 370 |
| 15 | `1:2712` / `1:5417` | `Frame 2135557710` | 4190 | 1438.699951171875 |

**The premise held: only the header changes.** Two footnotes (hero wrapper name, pagination
`x`) and nothing else, across 666 nodes.

Notably unchanged: the `navbar` at `y=292` (`1:630` / `1:3335`) is a **category switcher**,
not an account bar — `Популярне` (active), `Слоти`, `лайв Казіно`, `лайв Казіно` (the fourth
tab duplicates the third's icon and label). Nothing in it changes on login. There is no
profile, account, wallet, history or logout entry point anywhere in the post-login page.

### Verified identical (copy checked, not just names)

`get_design_context` on hero slide 1, `1:601` (post) vs `1:3306` (pre), returned
character-for-character identical copy and identical styling:

- `отримати бонус` — `1:604` / `1:3309`, Outfit Bold 12px, white, `tracking-[-0.2px]`, capitalize
- `✦ вітальний пакет казіно ✦` — `1:606` / `1:3311`, Outfit ExtraBold, `#FFAE00`,
  `✦` spans at `7.741px`, middle span at `10px`, `tracking-[0.5529px]`, uppercase
- `₴250.000` — `1:609` / `1:3314`, Outfit Bold 15px, white, uppercase
- `+ 250 fS` — `1:610` / `1:3315`, same style
- `20X WAGER` — `1:612` / `1:3317`, Inter Bold 10px, `#FFAE00`, `tracking-[0.2765px]`

Only the exported asset URL for the slide background differs (different export id, same
`enhanced_..._9naffaz26g5z3r0l2dxs_0 1` source layer at `-258,-35 700×217`).

---

## Post-login header measured in depth — `1:582`

### Container

| Property | Value |
| --- | --- |
| Node | `1:582` `Header postlog` |
| Box | `x=0 y=0 w=390 h=60` |
| Background | `#E8F1FC` |
| Layout | `flex flex-col items-center justify-center` |
| Horizontal padding | `16px` |
| Vertical padding, **declared** | `14px` (from the auto-layout in the reference code) |
| Vertical padding, **measured** | `10px` — child `1:583` sits at `y=10`, is `40` tall, `10+40+10 = 60` |
| Border / shadow | none returned |

The declared `py-[14px]` and the fixed `h=60` are inconsistent (`14+40+14 = 68 ≠ 60`). The
metadata `y=10` is the authoritative rendered position. Build to `10`. The pre-login header
has the same conflict and resolves to `12` (`12+36+12 = 60`).

### Inner row `1:583` "Frame 578"

`x=16 y=10 w=358 h=40`, `flex items-center justify-between w-full`.
Right edge `16+358 = 374 = 390-16`. Symmetric `16px` gutters.

### Left — logo

| Property | Value |
| --- | --- |
| Node | `1:584` `Logo TopWin` (instance) |
| Local box | `x=0 y=10 w=111 h=20` |
| Absolute box | `x=16 y=20 w=111 h=20` |
| Asset | SVG, `imgLogoTopWin` |

Absolute position is identical pre- and post-login (`x=16 y=20`), because the row height
change (36 → 40) is absorbed by the centring. The logo does not move.

### Right cluster `1:585` "Frame 2135557747"

`x=211 y=0 w=147 h=40` local → absolute `x=227 y=10`.
`flex items-center gap-[8px]`. Measured gap: pill ends at `227+99 = 326`, search starts at
`334`. **8 px**, confirmed.

#### Balance pill `1:586` "Background+Border"

| Property | Value |
| --- | --- |
| Local box | `x=0 y=0 w=99 h=40` (absolute `x=227 y=10`) |
| Background | `#FFE2D5` |
| Border radius | `8px` |
| Border | none (`border-0 border-[transparent]` on the inner Container — a no-op) |
| Horizontal padding | `8px` (measured: container at `x=8`, `83 + 8 + 8 = 99`) |
| Vertical padding, declared | `6.606px` |
| Vertical padding, **measured** | `8px` — container at `y=8`, `h=24`, `8+24+8 = 40` |
| Shadow | none returned |

Build to the measured `8px`. Same declared-vs-measured conflict as the header container.

##### Container `1:587`

`x=8 y=8 w=83 h=24` local. `flex items-center justify-center gap-[4px] overflow-clip`.
Measured gap: text `w=55` at local `x=0`, icon at local `x=59` → **4 px**, confirmed.

##### Balance text `1:588`

| Property | Value |
| --- | --- |
| Literal string | `$ 140.00` |
| Local box (in Container) | `x=0 y=3 w=55 h=18` |
| Absolute box | `x=235 y=21 w=55 h=18` |
| Font family | `Roboto Flex` |
| Weight | SemiBold / `600` |
| Size | `14px` |
| Line height | `18px` |
| Colour | `#191970` (design variable **Navy**) |
| Wrapping | `whitespace-nowrap` |
| Variable font axes | `"GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100` |

There is **no Ukrainian copy in the post-login header**. The only string is `$ 140.00` — a
dollar sign, while the hero directly below it prices the bonus in `₴250.000`. See UNKNOWN 1.

##### Deposit icon `1:589` "tabs_4511814 (1) 1"

| Property | Value |
| --- | --- |
| Local box (in Container) | `x=59 y=0 w=24 h=24` |
| Absolute box | `x=294 y=18 w=24 h=24` |
| Inner leaf | `1:590` `Group`, `inset-[1.56%]` → `23.25 × 23.25` at `+0.375,+0.375` |
| Type | SVG asset |
| Design variable present | **Orange `#FF4500`** (`get_design_context` on `1:589` reports it) |
| Renders as | orange rounded square, white `+` glyph (verified on the `147×40` screenshot of `1:585`) |

This is **not** a separate button frame. It is a plain 24 px frame inside the pill's
Container, sibling to the balance text — unlike the search control, which Figma names
`Button`. See UNKNOWN 2.

#### Search button `1:593` "Button"

| Property | Value |
| --- | --- |
| Local box | `x=107 y=0 w=40 h=40` (absolute `x=334 y=10`) |
| Background | `#EDF5FF` |
| Border radius | `999px` (full circle) |
| Layout | `flex items-center justify-center overflow-clip` |
| Icon | `1:594` `search_header.svg`, `x=0 y=0 w=40 h=40` — leaf fills the button exactly |
| Hit area | `40 × 40` |

Right edge `334+40 = 374`. Pre-login the same control is `36 × 36` at `x=338` with a `40 × 40`
svg inset at `-2,-2` (clipped by `overflow-clip`). Post-login it grows to `40 × 40` and the
svg is no longer offset. Both end at `x=374`. The rendered glyph is therefore ~11% larger
post-login. See UNKNOWN 3.

### There is no avatar and no account control

Measured, not inferred: the full 666-node post-login tree contains no node named avatar,
profile, account, user, menu, burger, wallet or similar. The header's three visible controls
are logo, balance pill (with embedded deposit icon) and search. The one extra node in the
header, `1:596` `Logo`, is `hidden="true"`.

---

## Pre-login header `1:3290` — recorded for contrast

Included because the delta is only meaningful against it.

- Container: `390 × 60`, `#E8F1FC`, `px-[16px]`, measured vertical padding `12px`.
- Row `1:3291`: `x=16 y=12 w=358 h=36`.
- `btns` cluster `1:3294`: `x=160 y=0 w=198 h=36`, `flex items-center gap-[8px]`.

**Login button `1:3295`** — `x=0 y=0 w=60 h=36`

| Property | Value |
| --- | --- |
| Copy (`1:3296`) | `Увійти` |
| Background | `#EDF5FF` |
| Radius | `8px` |
| Padding | `px-[8px] py-[6.606px]` declared; label at local `x=8 y=10 w=44 h=16` |
| Font | `Outfit` SemiBold `13px`, `leading-[normal]`, `tracking-[-0.2px]`, `capitalize`, centred |
| Colour | `#102A67` |

**Register button `1:3297`** — `x=68 y=0 w=86 h=36`

| Property | Value |
| --- | --- |
| Copy (`1:3298`) | `Реєстарція` — recorded verbatim; this is a **typo in the design**, the Ukrainian word is `Реєстрація` |
| Background | `linear-gradient(to right, #FF8C00, #FF4500)` |
| Radius | `6px` |
| Padding | `p-[8px]`; label at local `x=8 y=10 w=70 h=16` |
| Drop shadow | `0px 8px 12px rgba(255, 69, 0, 0.33)` |
| Inner shadow | `inset 0px 1px 0px 0px rgba(255, 255, 255, 0.25)` |
| Font | `Outfit` SemiBold `13px`, `leading-[normal]`, `tracking-[-0.2px]`, `capitalize`, centred |
| Colour | `#FFFFFF` |

**Search button `1:3299`** — `x=162 y=0 w=36 h=36`, `#EDF5FF`, `rounded-[999px]`,
`overflow-clip`, icon `1:3300` `40 × 40` at `-2,-2`.

Gaps measured: `60 → 68` = `8px`; `68+86 = 154 → 162` = `8px`. Consistent with `gap-[8px]`.

---

## Design variables in scope

`get_variable_defs` on `1:582`: `{"Orange": "#FF4500", "Navy": "#191970"}`.
The same two on `1:3290`. Only `Navy` is consumed as a text colour in the post-login header;
`Orange` reaches it only through the deposit icon SVG.

Raw hexes used in the two headers that are **not** variables:
`#E8F1FC` (header bg), `#FFE2D5` (balance pill bg), `#EDF5FF` (search + login button bg),
`#102A67` (login button label), `#FF8C00` (gradient start), `#FFFFFF`.

## Assets — post-login header

Remote URLs expire ~7 days from this run. Listed, not downloaded.

| Node | Name | Type | Box | URL |
| --- | --- | --- | --- | --- |
| `1:584` | `Logo TopWin` | SVG | `111 × 20` | `https://www.figma.com/api/mcp/asset/ad05fcb3-e1ea-4e87-9695-879438b4dddd.svg` |
| `1:590` | `Group` (deposit `+`, inside `1:589`) | SVG | outer `24 × 24`, leaf `23.25 × 23.25` | `https://www.figma.com/api/mcp/asset/cfa25c9c-6984-41d6-b919-459831158214.svg` |
| `1:590` | same node, re-exported on an isolated call | SVG | same | `https://www.figma.com/api/mcp/asset/478a73b2-3728-443d-8316-522ea7eda497.svg` |
| `1:594` | `search_header.svg` | SVG | `40 × 40` | `https://www.figma.com/api/mcp/asset/b9decebd-5b3b-45c5-9c9f-514317c23b9d.svg` |

The two URLs for `1:590` are the same layer exported twice — Figma mints a fresh id per
export call. One asset, not two.

## Assets — pre-login header (for the diff only)

| Node | Name | Type | Box | URL |
| --- | --- | --- | --- | --- |
| `1:3292` | `Logo TopWin` | SVG | `111 × 20` | `https://www.figma.com/api/mcp/asset/bcd9a57d-0484-4497-8c35-55cc4620bbb1.svg` |
| `1:3300` | `search_header.svg` | SVG | `40 × 40` | `https://www.figma.com/api/mcp/asset/9c1f363b-8e0b-489d-ad5d-da258a30bcfc.svg` |

Distinct asset count for the post-login header: **3**.

## Interaction implied by the delta

- **Auth state is a header-only swap.** One header component with two variants — `logged-out`
  (login + register + search, row `36` tall) and `logged-in` (balance pill + search, row `40`
  tall). Nothing below `y=60` reacts to auth. Measured across 666 nodes.
- **Balance pill is a composite control.** Amount text plus an orange `+`. Whether that is
  one tap target or two is not encoded in the file (UNKNOWN 2).
- **Search stays a control in both states**, only its box changes `36 → 40`.
- No pressed, hover, focus or disabled variant exists for any header control in either frame.
  No component variant set was returned. The only state axis present in the file is
  pre-login vs post-login, expressed as two separate top-level frames rather than as variants.
- The category switcher (`1:630`, `y=292`) has an active/inactive pattern —
  `Active category` `1:633` (`#C9DCF4` fill, `rounded-[10px]`,
  `shadow-[0px_2px_5px_0px_rgba(35,101,169,0.1)]`, label `#102A67`) versus inactive
  `Category` (no fill, label `#71809A`). Identical in both auth states, so not part of this
  delta — recorded here only to establish that the navbar is a category filter, not an
  account bar.

---

## UNKNOWN

1. The post-login balance reads `$ 140.00` while the hero bonus reads `₴250.000` on the same
   screen. Which currency ships — is `$` a placeholder to be replaced with `₴`, and does the
   separator convention (`.` as thousands separator in `250.000`, `.` as decimal in `140.00`)
   need reconciling?
2. Is the orange `+` (`1:589`, `24 × 24` at absolute `294,18`) its own tap target opening a
   deposit flow, or is the whole `99 × 40` pill one target? Figma names the search control
   `Button` and does not name this one, but a `24 × 24` hit area would fail the `44 × 44`
   minimum this project's a11y gate enforces. Which is intended?
3. The search button changes size with auth state — `36 × 36` pre-login, `40 × 40`
   post-login, same right edge. Is that deliberate, or should both be `40` (or both `36`)?
   Pre-login it also clips a `40 × 40` glyph into a `36 × 36` box via `-2,-2` offset.
4. The hero pagination bar sits at `x=32` post-login and `x=16` pre-login (`1:625` vs
   `1:3330`), which pushes its right edge flush to the `390` frame edge post-login. Stray
   nudge to correct to `16`, or intentional?
5. Where does a logged-in user reach account, profile, deposit history, bonuses or logout?
   No such control exists anywhere in `1:581`. Is there an unmeasured frame for it, or is it
   out of scope for this demo?
6. The pre-login register label is spelled `Реєстарція` (`1:3298`). The correct Ukrainian is
   `Реєстрація`. Ship the typo verbatim, or correct it? Recorded as-is above.
7. The fourth navbar category (`1:680`, in both frames) repeats `лайв Казіно` with the same
   icon as the third (`1:674`). Placeholder, or two genuinely distinct categories that were
   never differentiated?
8. Header vertical padding is declared `14px` but measures `10px` (post) / `12px` (pre)
   against the fixed `60` height; the balance pill declares `6.606px` but measures `8px`.
   The measured values are used above. Confirm the fixed `60` header height is the constraint
   and the auto-layout padding is stale.
