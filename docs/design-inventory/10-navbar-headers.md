# Top-Win — navbar + headers inventory

File key: `s2CqwGqe0O0FcALhBNlTRe`
Nodes measured: `1:6488` (component set), `1:6489` / `1:6524` / `1:6559` (variants), `1:6594` (Header Pre-login), `1:6617` (Header POST-login).
Every number below comes from `get_metadata` (x/y/w/h) or `get_design_context` (CSS/Tailwind reference output). Where a value could not be read from a tool it is under **UNKNOWN**, not estimated.

---

## 1. Bottom navigation — component set `1:6488`

Frame `1:6488` "navbar" is 415x413 at (3072, 313) and holds three variants, each **390 x 111**, stacked 131px apart (20, 151, 282):

| Variant node | Figma name | Language |
| --- | --- | --- |
| `1:6489` | `Property 1=log in ua` | Ukrainian |
| `1:6524` | `Property 1=log in ru` | Russian |
| `1:6559` | `Property 1=log in en` | English |

The variant property is `Property 1` with values `log in ua` / `log in ru` / `log in en`. It is a **language** switch only — geometry, icons, active tab and the raised button are identical across all three. The only differences are the five label strings and two sub-pixel layout shifts noted in §1.7.

### 1.1 THE HEIGHT TRAP — bar height vs. overhang (read this first)

The component is 111 tall but **the bar itself is only 68 tall**. The other 43px is empty space above the bar that exists purely so the raised centre button has somewhere to stick out.

Measured, from `1:6489`:

| Element | node | x | y | w | h |
| --- | --- | --- | --- | --- | --- |
| Bar shape `Subtract` | `1:6490` | 0 | **43** | 390 | **68** |
| Raised button vector `btn-69` | `1:6518` | **156** | **3** | **63.6528205871582** | **58.91634750366211** |

Derived (arithmetic on the measured numbers, not a separate measurement):

- Bar occupies y **43 → 111** of the component. Bar height **68**.
- Button occupies y **3 → 61.916**. Button height **58.916**.
- **Overhang above the bar top: 43 - 3 = 40px.** The button stands 40px proud of the bar.
- Portion of the button that is inside the bar: 61.916 - 43 = **18.916px**.
- 68 + 43 = 111 = component height. Consistent.

The reference code confirms the same numbers as percentages of the 390x111 box: `btn-69` is `inset-[2.7%_43.68%_44.22%_40%]` → left 0.40x390 = 156, top 0.027x111 = 3.0, width 390-156-(0.4368x390) = 63.65, height 111-3-(0.4422x111) = 58.92.

Implementation consequence: an implementation that gives the nav a height of 111 **with `overflow:hidden`**, or that gives it 68 and centres the button inside, paints the raised button as a flat semicircle. The button must be positioned relative to a 111-tall, non-clipping box whose bottom 68px is the painted bar. (This is the failure mode called out in the brief; the geometry above is what prevents it.)

Extra clipping hazard — the exported button SVG is **bigger than the button**, because it carries a glow. `btn-69`'s render box is `inset-[-1.41%_-47.32%_-121.84%_-47.32%]` of the 63.65 x 58.92 vector box:

- horizontal: +30.12px each side → rendered width **123.90px**
- top: +0.83px; bottom: **+71.79px** → rendered height **131.54px**
- rendered box sits at x 125.88 → 249.78, y 2.17 → **133.71**

i.e. the glow extends **22.7px below the bottom of the 111-tall component** and 30px past each side of the button. Clipping the component to 111 crops the glow.

### 1.2 Bar shape

`Subtract` (`1:6490`) is a boolean subtraction of two vectors:

- `1:6491` "Rectangle 6886255" — 389.0000915527344 x 67, at (0.49984103441238403, 43.5). The bar plate, rounded (radius UNKNOWN, see §5).
- `1:6492` "Rectangle 6886256" — 98.07487399486308 x 94.54516338453504, at (188.47015380859375, -17.13311767578125) — the notch **cut out** of the plate so the raised diamond button can sit in it.

The exported SVG render box is `inset-[-0.74%_-0.13%]` of the 390x68 box → 391.01 x 69.01 at (-0.507, 42.50); that is stroke/antialias bleed, not extra shape.

In the ru and en variants the same shape is 389.963 wide and offset `left-[calc(50%-0.02px)]` instead of exactly 390 / `left-1/2`. A 0.037px difference — treat as 390 x 68 in all three.

### 1.3 The five tabs, in order

Row container `Frame 2135557623` (`1:6494` ua / `1:6529` ru / `1:6564` en): x **7**, y **55**, **376 x 41**, `flex items-center justify-between`, horizontally centred in the 390 frame (spans x 7 → 383).

It holds **two groups of two tabs**, not five items — the centre "Menu" is not in this row:

- Left group `1:6495`: x 0 (abs 7), 140 x 41 = two 70px items, no gap.
- Right group `1:6507`: x 236 (abs 243), 140 x 41 = two 70px items, no gap, `justify-end`.
- Gap between the two groups: 376 - 280 = **96px** — the well the raised button and the "Menu" label occupy.

Each tab item: **70 wide, 41 tall**, `flex-col items-center`, **gap 2px**. Icon 24x24 on top (Live casino is 19x24), label below with its 15px line box starting at y 26 inside the item.

| # | Tab | Item node (ua) | Icon node (ua) | Icon size | Item abs x | Centre x |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Casino | `1:6496` | `1:6497` → `1:6498` `Icon_casino` → `1:6499` `Group` | 24 x 24 (icon x=23 in item) | 7 → 77 | **42** |
| 2 | Sport (ACTIVE) | `1:6503` | `1:6504` `game_15999999 (1) 1` | 24 x 24 (x=23) | 77 → 147 | **112** |
| 3 | Menu (raised) | `1:6517` `btn-68` | `1:6519` `menu_burger.svg` | see §1.5 | 156 → 219.65 | **187.83** |
| 4 | Live casino | `1:6508` | `1:6509` `SVG` → `1:6510` `Vector` | **19 x 24** (x=25.5) | 243 → 313 | **278** |
| 5 | Promo | `1:6512` | `1:6513` `Icon_promotions` | 24 x 24 (x=23) | 313 → 383 | **348** |

Note the centre button's centre is **187.83, not 195** — it is 7.17px left of the frame centre. The "Menu" label agrees: it is placed at `left-[calc(50%-7px)]` → centre x **188**. The burger glyph agrees too (§1.5). So the whole centre cluster is deliberately (or accidentally) offset ~7px left; the four flanking tabs are symmetric. Do not "fix" this to 195 without asking — but see UNKNOWN Q3.

### 1.4 Copy — all three languages, character for character

| # | ua (`1:6489`) | ru (`1:6524`) | en (`1:6559`) |
| --- | --- | --- | --- |
| 1 | `Казіно` | `Казино` | `Casino` |
| 2 | `Спорт` | `Спорт` | `Sport` |
| 3 | `Меню` | `Меню` | `Menu` |
| 4 | `Лайф казіно` | `Лайф казино` | `Live casino` |
| 5 | `Промо` | `Промо` | `Promos` |

Text node ids per language:

| # | ua | ru | en |
| --- | --- | --- | --- |
| 1 Casino | `1:6502` | `1:6537` | `1:6572` |
| 2 Sport | `1:6506` | `1:6541` | `1:6576` |
| 3 Menu | `1:6493` | `1:6528` | `1:6563` |
| 4 Live casino | `1:6511` | `1:6546` | `1:6581` |
| 5 Promo | `1:6515` | `1:6550` | `1:6585` |

ua and ru differ only by і/и in Казіно/Казино and Лайф казіно/Лайф казино. All five ua/ru strings are Cyrillic; the brief said "Ukrainian text" and the ua variant is indeed Ukrainian orthography (і), the ru variant Russian (и).

### 1.5 The raised centre button

`btn-68` (`1:6517`) is a container frame at x 156, y 3, **63.6528205871582 x 58.91634750366211**. It contains:

- `btn-69` (`1:6518`) — the shape vector, same box. **It is not a circle**: 63.653 wide x 58.916 tall, aspect 1.080. The screenshot shows a rounded **diamond / squircle rotated 45°**, orange. So "diameter" does not apply — use the two dimensions.
- `menu_burger.svg` (`1:6519`) — ua: **40 x 34** at (168, 12); ru/en (`1:6553`, `1:6588`): **40 x 40**, centred differently (`top-[calc(50%-23.5px)]` vs ua's `top-[calc(50%-26.5px)]`). The clipping frame differs; the glyph inside does not.
  - `Frame 2135557745` (`1:6520`) — **20 x 18** at (9.719970703125, 11) inside the burger frame → abs x 177.72 → 197.72, abs y 23 → 41, centre **(187.72, 32)**.
  - Three bars, each **20 x 2**, at y 0, 8, 16 inside that 20x18 frame → **6px gap between bars**.
- Button geometric centre: (187.83, 32.458). Burger centre (187.72, 32). They agree within 0.5px.

Vertical relationship to the bar, restated: top of button y=3, top of bar y=43 → **40px proud**; bottom of button y=61.92 → 18.92px sunk into the bar.

The "Menu"/"Меню" label is **not** inside `btn-68`. It is a sibling absolute text node (`1:6493` ua) at x 171, y **81.00006103515625**, 34 x 15, centred on x 188 — i.e. it sits on the bar below the button, at the same y-band as the other four labels (their labels start at 55+26 = **81**). So all five labels share the same baseline row at y 81.

### 1.6 Active state

Active tab = **Sport** (tab 2), in all three variants. Two things mark it, and only these two:

1. **Label colour** `#FFB095` instead of `#FFFFFF`. Nodes `1:6506` (ua), `1:6541` (ru), `1:6576` (en) carry `text-[#ffb095]`; the other four labels carry `text-white`.
2. **A dot** — `active-dot`, an ellipse **4 x 4** at (110, 99), centre **(112, 103)**, i.e. exactly under the Sport tab centre (112) and 3px below the bottom of the label row (81+15 = 96). Nodes: `1:6516` (ua), `1:6558` (ru), `1:6593` (en). It is exported as an SVG, so its fill is not in the tool output — see UNKNOWN Q1.

The active Sport **icon** is a separate exported asset per variant and appears orange-tinted in the screenshot while the other four icons appear white; whether the active icon is a different asset from the inactive one cannot be established from this component set, because there is no inactive-Sport state in the file — see UNKNOWN Q2.

### 1.7 Differences between the three variants

Beyond the five strings:

- `Subtract` is 390 x 68 at `left-1/2` in ua; 389.963 x 68 at `left-[calc(50%-0.02px)]` in ru/en.
- `menu_burger.svg` clip frame is 40x34 in ua, 40x40 in ru/en, with a 3px difference in its vertical anchor. The glyph lands in the same place.
- Node order differs: in ua `active-dot` precedes `btn-68`; in ru/en it follows it. No visual effect (they do not overlap).
- The Live casino label is `min-w-full w-[min-content]` (wrappable, 70px) in ua, but `whitespace-nowrap` in ru and en. `Лайф казіно` (ua) is allowed to wrap inside 70px; `Лайф казино` (ru) and `Live casino` (en) are told not to and will overflow the 70px item. This is a real difference, not a rounding artefact.

---

## 2. Header (Pre-login) — `1:6594`

**390 x 60**, at (2184, 633). Background **`#080814`**.

Structure:

- Root `1:6594`: `flex flex-col items-center justify-between`, **padding-left 16px** and no right padding.
- `Container` `1:6595`: x 16, **374 x 60**, `flex row items-center justify-between`, **padding-inline 10px**, `max-width 1440px`, `flex: 1 0 0`.
  → usable content runs from abs x **26** to abs x **380** (26px inset left, 10px right — asymmetric, as measured).

### 2.1 Logo

- `Center` `1:6596`: x 10 (abs 26), y **12**, **77.14286041259766 x 36**, `overflow: clip`.
- `Link` `1:6597` → `logo` `1:6598` (77.143 x 36, `flex-col items-center justify-center`, `overflow: clip`) → `logo.svg` `1:6599`: **72.88524627685547 x 36** at x offset 2.128723621368408, y -0.000164031982421875.
- Vertical: 12 top + 36 + 12 bottom = 60. Centred.
- The artwork reads **`JACKPOT`** in gold with a crown above it — not "Top-Win". Flagged, see UNKNOWN Q4.

### 2.2 Right cluster

`Frame 2135557747` `1:6608`: x 132 (abs 148), y 10, **232 x 40**, `flex items-center`, **gap 2px**.

`Frame 2135557746` `1:6609`: x 0, y 1.5, **190 x 37**, `flex items-center`, gap 0 — the two auth buttons butt directly against each other.

**Button A — "Log In"** (`1:6610`, Figma name `Sign In Button`)
- 95 x 37, `border-radius 20px`, padding `10px 24px`, `flex items-center justify-center`
- No fill declared (transparent over `#080814`)
- `drop-shadow: 0px 4px 6px rgba(198,144,61,0.25)`
- Text `1:6611`: literal copy **`Log In`**, Inter **Semi Bold** (600), **14px**, `line-height: normal`, colour **`#FFFFFF`**, `letter-spacing -0.14px`, `white-space: nowrap`. Text box 41 x 17 at (27, 10) inside the button.

**Button B — "Sign In"** (`1:6612`, Figma name `Sign In Button`)
- 95 x 37 at x 95 (abs 243), `border-radius 20px`, padding `10px 24px`
- Fill: **linear gradient to right, `#F0C775` → `#C6903D`**
- `drop-shadow: 0px 4px 6px rgba(198,144,61,0.25)`
- Text `1:6613`: literal copy **`Sign In`**, Inter **Extra Bold** (800), **14px**, `line-height: normal`, colour **`#000000`**, `letter-spacing -0.14px`, nowrap. Text box 47 x 17 at (24, 10).

**Search button** (`1:6614`, Figma name `Button`)
- **40 x 40** at x 192 (abs 340 → 380), `flex items-center justify-center`, `overflow: clip`
- Child `search_header.svg` `1:6615`: **40 x 40** — the asset fills the button box exactly; the magnifier glyph inside the asset is smaller than 40 (padding is baked into the SVG). Do not re-pad it in code.

Vertical: cluster y 10 → 50 inside a 60 header; the two 37-tall auth buttons sit at y 11.5 → 48.5.

---

## 3. Header (POST-login) — `1:6617`

**390 x 60**, at (2184, 633) — same canvas position as the pre-login header, i.e. they are two states of one bar, drawn on top of each other. Background **`#080814`**. Root and `Container` (`1:6618`) are byte-identical to §2 (pl 16, 374 x 60, px 10, max-w 1440).

Logo block is identical in geometry: `Center` `1:6619` (x 10, y 12, 77.143 x 36) → `Link` `1:6620` → `logo` `1:6621` → `logo.svg` `1:6622` (72.885 x 36 at x 2.1287). Different exported asset id from the pre-login one (same artwork).

### 3.1 Right cluster

`Frame 2135557747` `1:6631`: x 200 (abs 216), y 10, **164 x 40**, `flex items-center`, **gap 2px**.

**Balance pill — "Emerald Outlined Button"** (`1:6632`)
- **122 x 40**, `border-radius 22px`, padding `4px 8px`, `flex items-center justify-center`, **gap 12px**
- Fill `rgba(0,92,64,0.04)`
- Border **1.5px solid `rgba(0,163,114,0.5)`**
- `box-shadow: 0px 2px 8px 0px rgba(0,242,153,0.12)`
- `Frame` `1:6633` (62 x 17 at x 8, y 11.5) → `Price Label` `1:6634`: literal copy **`$ 140.00`** (dollar sign, space, 140.00), Inter **Extra Bold** (800), **14px**, `line-height: normal`, colour **`#00F299`**, `letter-spacing -0.14px`, nowrap.
- `action` `1:6635`: **32 x 32** at x 82, y 4, `border-radius 20px`, `flex-col items-center justify-center`
  - Fill: **linear gradient to right, `#00F299` → `#3B82F6`**
  - Border **1px solid `rgba(255,255,255,0.4)`**
  - `box-shadow: 0px 6px 14px 0px rgba(59,130,246,0.2), 0px 10px 18px 0px rgba(0,242,153,0.2)`
  - `plus` `1:6636`: **16 x 16** at (8, 8) — 8px inset on all sides of the 32px circle.

**Search button** (`1:6638`)
- **40 x 40** at x 124 → **abs 340 → 380**, identical to the pre-login one (same size, same absolute position, different exported asset id).

So between the two header states only the middle control changes: `190 x 37` auth pair → `122 x 40` balance pill. The logo and the search button do not move.

---

## 4. Assets (node id → download URL). Listed only — none downloaded.

URLs expire ~7 days after the `get_design_context` call that produced them.

### Navbar — ua `1:6489`
| Layer | node | URL |
| --- | --- | --- |
| Bar shape `Subtract` | `1:6490` | https://www.figma.com/api/mcp/asset/4c44190e-e901-4650-bd97-1a65b98f8540.svg |
| Casino icon `Group` | `1:6499` | https://www.figma.com/api/mcp/asset/32d3cd47-8299-4dab-a8b3-8798057f5081.svg |
| Sport icon `game_15999999 (1) 1` | `1:6504` | https://www.figma.com/api/mcp/asset/5d34cc1f-6409-49e2-89ef-dde523855f4d.svg |
| Live casino icon `SVG` | `1:6509` | https://www.figma.com/api/mcp/asset/72f80ee9-399d-4abd-a58a-08436b933b5c.svg |
| Promo icon `Icon_promotions` | `1:6513` | https://www.figma.com/api/mcp/asset/bd85897e-c693-4700-bfba-13f9154257f4.svg |
| `active-dot` | `1:6516` | https://www.figma.com/api/mcp/asset/537bec79-1cb9-40f4-8b0e-bb13840126cf.svg |
| Raised button `btn-69` | `1:6518` | https://www.figma.com/api/mcp/asset/a685ef64-b11d-4571-9569-480ce5d40b4f.svg |
| Burger glyph `Frame 2135557745` | `1:6520` | https://www.figma.com/api/mcp/asset/89f5d8c6-7214-49a2-9a38-998bdaa5c6be.svg |

Re-export of `1:6490` on its own produced a second, equally valid URL: https://www.figma.com/api/mcp/asset/6c8cd135-4f1b-415b-98d1-f2b2fe468df0.svg

### Navbar — ru `1:6524`
| Layer | node | URL |
| --- | --- | --- |
| `Subtract` | `1:6525` | https://www.figma.com/api/mcp/asset/41e2596d-5426-48d5-af18-a892ce7efb1a.svg |
| Casino icon | `1:6534` | https://www.figma.com/api/mcp/asset/ca856b51-7867-4fa7-ad5e-790e357afc8c.svg |
| Sport icon | `1:6539` | https://www.figma.com/api/mcp/asset/3968e1df-9f3a-443c-ba65-0dce701f4e2d.svg |
| Live casino icon | `1:6544` | https://www.figma.com/api/mcp/asset/befbf7e2-dd8d-4564-80b9-992223cab69d.svg |
| Promo icon | `1:6548` | https://www.figma.com/api/mcp/asset/7f14101f-0b0c-470e-88b8-928228febbbd.svg |
| Raised button | `1:6552` | https://www.figma.com/api/mcp/asset/53349f01-53b4-4746-9d38-e7052e662916.svg |
| Burger glyph | `1:6554` | https://www.figma.com/api/mcp/asset/6a797f18-ae30-4459-9116-d114f725b556.svg |
| `active-dot` | `1:6558` | https://www.figma.com/api/mcp/asset/fcff7f64-f3f2-41d1-8688-4d4cd09fb0c7.svg |

### Navbar — en `1:6559`
| Layer | node | URL |
| --- | --- | --- |
| `Subtract` | `1:6560` | https://www.figma.com/api/mcp/asset/f5c67161-7f24-4ae7-b9b7-a68a2bb0373f.svg |
| Casino icon | `1:6569` | https://www.figma.com/api/mcp/asset/bf71c57d-71d9-4619-aff1-c4c8208ee296.svg |
| Sport icon | `1:6574` | https://www.figma.com/api/mcp/asset/c39ee081-5280-46a1-ac6f-8741f7603ad1.svg |
| Live casino icon | `1:6579` | https://www.figma.com/api/mcp/asset/2190ecb8-9af2-4aa9-999b-e6f0789e74f4.svg |
| Promo icon | `1:6583` | https://www.figma.com/api/mcp/asset/c57f06df-e20c-4d88-a0cb-f87808ce70b4.svg |
| Raised button | `1:6587` | https://www.figma.com/api/mcp/asset/63b6049f-8157-4b8c-80a5-ba9f30b9e725.svg |
| Burger glyph | `1:6589` | https://www.figma.com/api/mcp/asset/85a56841-6903-43a8-8787-6034d77bf608.svg |
| `active-dot` | `1:6593` | https://www.figma.com/api/mcp/asset/ce428940-83b7-4521-bb13-e2a17cabff93.svg |

The three variants export the same eight glyphs under different ids. Ship **one** set (the ua ids are as good as any); nothing observed suggests the artwork differs by language.

### Headers
| Layer | node | URL |
| --- | --- | --- |
| Pre-login `logo.svg` | `1:6599` | https://www.figma.com/api/mcp/asset/9af92689-ac13-4383-8c0f-2977be481217.svg |
| Pre-login `search_header.svg` | `1:6615` | https://www.figma.com/api/mcp/asset/6a60d7a0-6552-4b78-a9b9-457138d32765.svg |
| Post-login `logo.svg` | `1:6622` | https://www.figma.com/api/mcp/asset/2ad4e671-9bcb-4853-a7d6-504597ec87f0.svg |
| Post-login `plus` | `1:6636` | https://www.figma.com/api/mcp/asset/8304798d-86a5-48a4-8d1a-1617cd537f14.svg |
| Post-login `search_header.svg` | `1:6639` | https://www.figma.com/api/mcp/asset/991f1cce-d031-45ad-98ce-34cb8b2e48f0.svg |

**Distinct assets needed: 13** — 8 navbar glyphs + logo + search + plus = 11 unique artworks; the logo and search appear twice (once per header state) with different ids, which is why the table lists 13 rows.

---

## 5. Token summary (exact values from tool output only)

**Colours**
| Token | Value | Where |
| --- | --- | --- |
| Header background | `#080814` | `1:6594`, `1:6617` |
| Nav label, default | `#FFFFFF` | 4 of 5 nav labels + Menu label |
| Nav label, active | `#FFB095` | Sport label only |
| Sign In gradient | `linear-gradient(to right, #F0C775, #C6903D)` | `1:6612` |
| Sign In text | `#000000` | `1:6613` |
| Log In text | `#FFFFFF` | `1:6611` |
| Balance text | `#00F299` | `1:6634` |
| Balance pill fill | `rgba(0,92,64,0.04)` | `1:6632` |
| Balance pill border | `rgba(0,163,114,0.5)` @ 1.5px | `1:6632` |
| Plus button gradient | `linear-gradient(to right, #00F299, #3B82F6)` | `1:6635` |
| Plus button border | `rgba(255,255,255,0.4)` @ 1px | `1:6635` |

`get_design_context` on all three navbar variants also reported the file-level style **"BG main: #FFFFFF"**. That is the page/canvas style behind the component, not the nav's own fill; the nav bar plate is an exported SVG (see UNKNOWN Q1).

**Typography**
| Use | Family / weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- |
| All 5 nav labels (all 3 languages) | Roboto Medium (500), `font-variation-settings: "wdth" 100` | **12px** | **14.143px** | not specified |
| Log In | Inter Semi Bold (600) | 14px | `normal` | -0.14px |
| Sign In | Inter Extra Bold (800) | 14px | `normal` | -0.14px |
| `$ 140.00` | Inter Extra Bold (800) | 14px | `normal` | -0.14px |

Two families only: **Roboto** (nav) and **Inter** (headers). Nav label text alignment is `center` everywhere.

**Radii**
| Element | Radius |
| --- | --- |
| Log In / Sign In buttons | 20px |
| Balance pill | 22px |
| Plus button (32x32) | 20px |
| Nav bar plate | UNKNOWN (Q1) |

**Shadows**
| Element | Value |
| --- | --- |
| Log In + Sign In | `drop-shadow(0px 4px 6px rgba(198,144,61,0.25))` |
| Balance pill | `0px 2px 8px 0px rgba(0,242,153,0.12)` |
| Plus button | `0px 6px 14px 0px rgba(59,130,246,0.2), 0px 10px 18px 0px rgba(0,242,153,0.2)` |
| Raised nav button | Baked into the exported SVG. Its extent is measurable (§1.1: +30.12px sides, +71.79px bottom) but its colour/blur values are not in the tool output. |

---

## 6. Interaction / state implied

1. **Language variant** — `Property 1` = `log in ua` | `log in ru` | `log in en`. Affects the five nav strings only. Both headers are English-only in this file; no ua/ru header variants exist.
2. **Active nav tab** — Sport, drawn as `#FFB095` label + a 4x4 dot at the tab centre, 3px under the label. The other four are `#FFFFFF` with no dot. Only one active state exists in the file, so the hover/pressed treatment is undefined.
3. **Raised centre button = "Menu"** — a burger glyph, so it opens a drawer or sheet rather than navigating. Only its closed state exists here.
4. **Header auth state** — Pre-login (`Log In` + `Sign In`) and POST-login (balance pill + plus) occupy the same 390x60 box at the same canvas coordinates. One component, two states.
5. **Balance pill "+"** — a distinct 32x32 tappable target inside the 122x40 pill (deposit). The pill therefore has two hit areas, not one.
6. **Search** — 40x40, present in both header states at the same position; opens whatever the search states are (not in this node set).
7. Nothing here is a scroll row; the nav row is a fixed 5-slot layout, not scrollable.

---

## UNKNOWN — open questions, in priority order

**Q1. What are the nav bar plate's fill, corner radius, and the raised button's fill and shadow?**
Both `Subtract` (`1:6490`) and `btn-69` (`1:6518`) are returned by the MCP as **exported SVG assets**, so no hex, no gradient stops and no radius appear in the tool output. The `active-dot` fill is unknown for the same reason. The screenshot shows a dark navy/violet plate and an orange raised diamond, but a screenshot is not a measurement and I did not sample it. These values are recoverable in one step — either open the three SVGs at the URLs in §4 and read their `fill` attributes, or re-inspect the nodes in Figma. **I did not fetch them because the brief says list assets, do not download.** Whoever builds this must resolve Q1 before picking any nav colour.
*(A follow-up probe of `1:6518` and a `get_variable_defs` call on `1:6489`, which might have named these as variables, both failed: "You've reached the Figma MCP tool call limit for your Full seat on the Professional plan." The rate limit, not the data, is the blocker.)*

**Q2. Is there an inactive Sport icon, and does the active tab change its icon as well as its label colour?**
The component set contains only one active state (Sport active) across all three language variants. There is no variant with a different tab active, so it is impossible to tell from this file whether the icon artwork swaps, gets tinted, or stays identical when a tab activates. Does another node in the file carry a second active state?

**Q3. Is the ~7px leftward offset of the centre cluster intentional?**
Measured: the raised button's centre is x 187.83 and the Menu label's centre is x 188, while the frame centre is 195 and the four flanking tabs are symmetric about 195. That is a consistent 7px offset across all three variants, so it is not a stray nudge on one layer — but it also has no obvious reason. Should the implementation centre the button at 195, or reproduce 187.8?

**Q4. The logo artwork says `JACKPOT`, not `Top-Win`.**
Both headers render a gold crown-over-`JACKPOT` mark (`1:6599`, `1:6622`). The brief calls the product Top-Win. Is the Figma logo a placeholder to be replaced, or is `JACKPOT` the actual brand for this demo?

**Q5. Where exactly does the navbar sit inside the 1021-tall screen frames?**
The brief states the bar sits at the bottom of 1021-tall frames. I measured the component in isolation (111 tall, at (3072,313) inside its own 415x413 holder frame) and **did not measure a single instance placed on a screen**, so I cannot confirm the y offset, whether the instance is clipped, or whether a safe-area gap sits below it. If the component's top is at y 910 the bar plate's top lands at y 953 — that is arithmetic from §1.1, not an observation. Which node is a representative screen frame containing a navbar instance?

**Q6. Do the headers have a bottom border or blur?**
`1:6594` and `1:6617` report only `background: #080814`; no border, no backdrop-filter appeared in the tool output. Absence in the reference code is weak evidence — a 1px hairline could be a separate sibling node outside these two frames. Is there a divider node under the header on the full screens?

**Q7. Live casino label overflow.**
Measured: the ua label is wrappable within its 70px item while ru (`Лайф казино`) and en (`Live casino`) are `whitespace-nowrap` in a 70px item, so they will overrun the slot. Is the intent that these labels overflow their 70px box, or should all three wrap?
