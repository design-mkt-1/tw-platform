# Top-Win — Sport (sportsbook) page inventory

File key: `s2CqwGqe0O0FcALhBNlTRe`
Frames measured: `1:5994` "Prelog log" (390 x 1021), `1:88` "Post log" (390 x 1021),
`1:6484` "Bet slip action" (104 x 44).

Every value below is either **[M]** (`get_metadata` — geometry only) or **[C]**
(`get_design_context` — colours, type, padding, radius, shadow, literal text, asset URL).
A handful of things are marked **[derived]** with the arithmetic shown. Anything neither
tool produced is in **UNKNOWN** at the bottom, phrased as a question.

`get_design_context` was run on: `1:5999`, `1:6007`, `1:6030`, `1:6082`, `1:6090`, `1:6330`,
`1:6333`, `1:6367`, `1:6383`, `1:6433`, `1:6484`, `1:92`.
`get_variable_defs` was run on `1:5994`.

---

## 0. Headline findings

1. **The draw label is `Н`, not `X`.** Cyrillic capital EN, U+041D (for "нічия"). The brief
   said "1, X, 2"; the design says `1`, `Н`, `2`. **[C]**
2. **The register button copy is misspelled in the design: `Реєстарція`.** The correct
   Ukrainian is `Реєстрація` — the design has `стар` where it should have `стра`. **[C]**
3. **Team badges, the live dot, the favourite star, the league emblem and the gift are all
   text glyphs, not assets.** 🔵 🔴 🔷 ● ★ ♕ 🎁 live inside text nodes. Nothing to export. **[C]**
4. **The design system is nearly absent.** `get_variable_defs` over the whole frame returns
   exactly three named values: `Orange #FF4500`, `Navy #191970`, `BG main #FFFFFF`. Every
   other colour on this page is a raw hex with no variable behind it. **[C]**
5. **Six font families on one screen:** Inter, Roboto, Roboto Flex, Outfit, Archivo Narrow,
   Big Shoulders Display. **[C]**
6. **The two league cards are byte-identical placeholder duplicates** — same teams, same
   times, same odds, same `● EP`. **[C]**
7. **Login changes the header and nothing else.** The whole sportsbook body is node-for-node
   identical between `1:5994` and `1:88`. **[M]**

---

## 1. Page skeleton — `1:5994`, 390 x 1021 **[M]**

| y | h | node | name |
| --- | --- | --- | --- |
| 0 | 60 | `1:5995` | Header postlog |
| 60 | 152 | `1:6007` | Prematch/Live switch + sports navigation |
| 212 | 193 | `1:6027` | bonus banner carousel |
| 405 | 90 | `1:6081` | Recommended leagues widget |
| 495 | 60 | `1:6333` | Sport filters |
| 555 | 466 | `1:6366` | "Майбутні Події" section + navbar |

Bands butt together with no gaps and sum to exactly 1021. **[derived]**

Page gutter is **16px** on both sides everywhere: mode switch, sports nav, sport filters,
leagues header, section header and the league-card stack all start at x=16 and are 358
wide (390 − 32). **[M]**

---

## 2. Header — `1:5995`, 390 x 60

### 2.1 Geometry **[M]**

```
1:5995  Header postlog            0,0    390x60
  1:5996  Frame 578               16,12  358x36
    1:5997  Logo TopWin (instance)  0,8   111x20
    1:5998  Logo (instance)       135,8    88x24   hidden="true"
    1:5999  btns                  160,0   198x36
      1:6000  btn                   0,0    60x36  → 1:6001 label   8,10  44x16
      1:6002  btn                  68,0    86x36  → 1:6003 label   8,10  70x16
      1:6004  Button              162,0    36x36  → 1:6005 search_header.svg  -2,-2  40x40
```

`1:5999` is `display:flex; gap:8px; align-items:center`. 60+8+86+8+36 = 198 ✓ **[C][derived]**

### 2.2 Tokens **[C]**

**Login button `1:6000`** — the secondary/ghost button:
- `background: #edf5ff`, `height: 36px`, `padding: 6.606px 8px`, `border-radius: 8px`
- label `1:6001`: **`Увійти`** — Outfit SemiBold 600, `13px`, `line-height: normal`,
  colour `#102a67`, `letter-spacing: -0.2px`, `text-align: center`,
  `text-transform: capitalize`

**Register button `1:6002`** — the primary button:
- `height: 36px`, `padding: 8px`, `border-radius: 6px`
- `background: linear-gradient(to right, #ff8c00, #ff4500)`
- `filter: drop-shadow(0px 8px 12px rgba(255,69,0,0.33))`
- inner highlight: `box-shadow: inset 0px 1px 0px 0px rgba(255,255,255,0.25)`
- label `1:6003`: **`Реєстарція`** — Outfit SemiBold 600, `13px`, colour `#ffffff`,
  `letter-spacing: -0.2px`, `text-align: center`, `text-transform: capitalize`
  > **Literal text, character for character: `Реєстарція`.** This is a typo in the source
  > design (correct: `Реєстрація`). See UNKNOWN #1.

**Search button `1:6004`:**
- `background: #edf5ff`, **36 x 36**, `border-radius: 999px`, `overflow: clip`, centered
- icon `1:6005` `search_header.svg` is **40 x 40** inside a 36 x 36 clipping circle — the
  glyph is deliberately cropped 2px on every side. **[C][M]**

This exact gradient + drop-shadow + inset-highlight combination is reused on the banner
CTA `1:6036`. It is the platform's primary-button recipe. **[C]**

---

## 3. Prematch / Live switch + sports navigation — `1:6007`, 390 x 152 (y = 60)

Container `1:6007` **[C]**: `flex-direction: column`, `padding-top: 12px`,
`border-radius: 24px`, `overflow: clip`, `filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.05))`.

### 3.1 Mode switch — `1:6009`, 358 x 52 (absolute y = 84)

Wrapper `1:6008`: `flex-column`, `padding: 12px 16px 0`. **[C]**

Track `1:6009` **[C]**:
- `background: #dcebff`, `border-radius: 999px`, `padding: 4px`, `gap: 4px`
- children `flex: 1 0 0; height: 100%` → **173 x 44** each **[M]**

| | Prematch `1:6010` — **SELECTED** | Live `1:6012` — **UNSELECTED** |
| --- | --- | --- |
| background | `#ffffff` | none |
| box-shadow | `0px 6px 18px 0px rgba(23,69,143,0.08)` | none |
| radius | `999px` | `999px` |
| layout | `flex-col`, centered, `overflow: clip` | `flex-row`, `gap: 8px`, centered |
| icon | — | `1:6013` `stream_8191668 1`, **18 x 18** at (55,13) |
| label node | `1:6011`, box 64 x 20 at x=54.5 | `1:6015`, box 37 x 20 at x=81 |
| **literal copy** | **`Прематч`** | **`Лайв`** |
| type | Inter Regular 400, `15px`, `line-height: 1.35`, `#102a67` | identical |

Selected state = white fill + that one shadow. **Label colour is `#102a67` in both states.** **[C]**

### 3.2 Sports navigation — `1:6016`, 390 x 76 (absolute y = 136)

`1:6016` **[C]**: `height: 76px`, `padding: 8px 16px`, `align-items: center`, `overflow: clip`.
`1:6017` **[C]**: `flex: 1 0 0`, `gap: 8px`, `align-items: center` → 358 x 44 at (16,16). **[M]**

**Category switcher `1:6018` — 254 x 44** **[C][M]**
- `background: #e8f1fc`, `border-radius: 13px`, `padding: 4px`, `gap: 4px`
- **`1:6019` SELECTED** (121 x 36 at x=4): `background: #c9dcf4`, `border-radius: 10px`,
  `box-shadow: 0px 2px 5px 0px rgba(35,101,169,0.1)`, `overflow: clip`, centered.
  Label `1:6020` **`Спорт`** — Inter Regular 400, `13px`, `line-height: 1.35`, `#102a67`.
- **`1:6021` UNSELECTED** (121 x 36 at x=129): no fill, no shadow, `border-radius: 10px`.
  Label `1:6022` **`Кіберспорт`** — Inter Regular 400, `13px`, `line-height: 1.35`, `#102a67`.

**Favorites `1:6023` — 44 x 44 at x=262** **[C][M]**
- `background: #e8f1fc`, `border-radius: 13px`, centered, `overflow: clip`
- `1:6024` is a **text node**: **`★`** (U+2605) — Inter Regular 400, `25px`,
  `line-height: normal`, colour **`#1677e8`**. Box 27 x 30 at (8.5,7).

**Gifts `1:6025` — 44 x 44 at x=314** **[C][M]**
- `background: #e8f1fc`, `border-radius: 13px`, centered, `overflow: clip`
- `1:6026` is a **text node**: **`🎁`** (U+1F381) — Inter Regular 400, `22px`,
  declared colour `#000000` (moot — the emoji renders in colour). Box 22 x 22 at (11,11).

Widths check: 254 + 8 + 44 + 8 + 44 = 358 ✓ **[derived]**

---

## 4. Bonus banner carousel — `1:6027`, 390 x 193 (y = 212)

### 4.1 Track geometry **[M]**

```
1:6027  Frame 2135557699        0,212   390x193
  1:6028  hero-section          0,10.5  390x172
    1:6029  Frame 2135557696    0,1     718x170   ← frame declared 718; content runs to x=1424
      1:6030  WELCOME Sport bonus UA    16,0    340x170
      1:6038  WELCOME Sport bonus UA   360,0    340x170
      1:6046  Hero-Card                704,0    358x170
      1:6064  Hero-Card               1066,0    358x170
```

- Slide 1 starts at x=16, aligning with the page gutter. **[M]**
- Pitch: 16→360 = 344, 360→704 = 344, 704→1066 = 362. Gap between the two WELCOME
  slides = 344 − 340 = **4px**; between WELCOME 2 and Hero-Card 1 = 704 − 700 = **4px**;
  between the two Hero-Cards = 1066 − 1062 = **4px**. Uniform 4px gutter, mixed slide
  widths (340 vs 358). **[derived]**
- At 390px viewport, slide 1 is fully visible and **30px of slide 2** peeks in
  (360 + 340 = 700 vs viewport 390 → slide 2 occupies x 360–390). **[derived]**
- No pagination dots exist anywhere in the subtree. **[M]**

### 4.2 WELCOME slide `1:6030` (clone: `1:6038`) — 340 x 170 **[C]**

Card: `background: #000000`, `border-radius: 12px`, `overflow: clip`.

**Background photo `1:6031`:**
- outer box 612.783 x 466.18 at `left: -184.5px; top: -186.83px`
- `transform: rotate(17.94deg)`, inner image box 542.3 x 314.449
- PNG, drawn at `width:100%; height:99.94%; top:0.04%`
- URL: `https://www.figma.com/api/mcp/asset/2516e96f-66a1-41c3-8591-905005b647af.png`

**Glow ellipse `1:6032` "Ellipse 4":**
- box 155 x 227 at `left: 12px; top: calc(50% + 8.5px); transform: translateY(-50%)`
- `transform: rotate(90deg)`, inner 227 x 155, blur bleed `inset: -64.52% -44.05%`
- SVG: `https://www.figma.com/api/mcp/asset/c143f17f-773e-4e69-9faf-9a8ef3790bf5.svg`

**Badge `1:6033` — 124 x 20.494 at (20.5, 18):**
- `backdrop-filter: blur(8.539px)`
- `background: rgba(0,122,255,0.1)`
- `border: 0.854px solid rgba(255,255,255,0.09)`
- `border-radius: 853.079px`, `padding: 8.539px 13.663px`, `align-items: center`
- text `1:6034`: source string is **lowercase `вітальний бонус`** with
  `text-transform: uppercase` — Archivo Narrow SemiBold 600, `10px`, `line-height: normal`,
  colour **`#007aff`**. Renders as `ВІТАЛЬНИЙ БОНУС`.

**Offer text `1:6035` — at `left: 20.5px; top: 69px; transform: translateY(-50%)`, width 98:**
- Big Shoulders Display **Black 900**, colour **`#0d1a59`**,
  `letter-spacing: -1.2293px`, `text-transform: uppercase`, `line-height: 1` (`leading-none`)
- **one paragraph, four spans at three different sizes:**

| span | literal | font-size |
| --- | --- | --- |
| 1 | `225%` | `29.4px` |
| 2 | `` ` ` `` (a single space) | `61.464px` |
| 3 | `` `ДО ` `` (note trailing space) | `14.7px` |
| 4 | `15000 ₴` | `29.4px` |

The 61.464px space is a line-break spacer — it forces the wrap between "225%" and "ДО".
Full rendered string: **`225% ДО 15000 ₴`** on two lines. **[C]**

**CTA `1:6036` "ios-get-button" — h 28 at (20.5, 127):**
- `padding: 8px 16px`, `border-radius: 6px`, centered
- `background: linear-gradient(to right, #ff8c00, #ff4500)`
- `filter: drop-shadow(0px 8px 12px rgba(255,69,0,0.33))`
- `box-shadow: inset 0px 1px 0px 0px rgba(255,255,255,0.25)`
- label `1:6037`: source **`Депозит`** with `text-transform: uppercase` — Outfit **Bold 700**,
  `13px`, `#ffffff`, `letter-spacing: -0.2px`, `text-align: center`.
  Renders as `ДЕПОЗИТ`.

Same primary-button recipe as the header register button `1:6002`, only the font weight
differs (Bold vs SemiBold) and it adds `text-transform: uppercase`. **[C]**

### 4.3 Hero-Card slides `1:6046` / `1:6064` — 358 x 170, never visible **[M]**

These are casino hero cards sitting in the sport carousel. Layer names: `зевс`,
`Gates of Olympus_Game Art_2878x5319_Character_25`, `Lens Flare 2 8/9`, `Promo-Badge`
("WELCOME"), `Wager-Badge` ("20X WAGER"), `Bonus-Title`, `Bonus-Subtitle`.

```
1:6046  Hero-Card                       358x170
  1:6047  Card-Content                  358x170
    1:6048  Label-Stack         16,16   326x138
      1:6049  Frame 2135557697   8,0    318x95
        1:6050  Tag-Row          0,0    158x18
          1:6051  Promo-Badge    0,0     72x18  → 1:6052 text  8,3  56x12
          1:6053  Wager-Badge   78,0     80x18  → 1:6054 text  8,3  64x12
        1:6055  Frame 2135557698 0,34   318x53
          1:6056  Bonus-Title    0,0    318x31
          1:6057  Bonus-Subtitle 0,37   318x16
      1:6058  Button (instance)  8,102   97x36
      1:6059  enhanced_..._xrq8r4aiizudy6f6mw29_1 2  150,94.73  132.31x129.56
    1:6060  зевс              244,3    118.48x219
      1:6061  Gates of Olympus_..._Character_25  244,3  118.48x219
      1:6062  Lens Flare 2 8  275.63,9.93   16.98x16.87
      1:6063  Lens Flare 2 9  283.76,9.02   16.98x16.87
```

`1:6064` differs: Label-Stack child at x=0 (not 8), Bonus-Title 326 x 29,
Bonus-Subtitle 326 x 16 at y=35, Button 97 x **30** at y=108, **no**
`enhanced_..._xrq8r4ai...` node, `зевс` 115.78 x 214 at x=232. **[M]**

Text content and tokens not retrieved. See UNKNOWN #2.

---

## 5. Recommended leagues widget — `1:6081`, 390 x 90 (y = 405)

### 5.1 Geometry **[M]**

```
1:6081  Recommended leagues widget    0,405   390x90
  1:6082  header                     16,0     360x30
    1:6083  title-pill                0,3     129x24  → 1:6084 text  0,4  129x16
    1:6085  header-accent           270,0      90x30
      1:6086  text                   12,7.5     44x15
      1:6087  chevron-right          64,8       14x14
  1:6089  League carousel            16,30     362x60
    1:6090  League tile               0,8       44x44  → 1:6091 logo  9,9  26x26
    1:6120  League tile              48,8       44x44  → 1:6121 logo  9,9  26x26
    1:6150  League tile              96,8       44x44  → 1:6151 …
    1:6180  League tile             144,8       44x44
    1:6210  League tile             192,8       44x44
    1:6240  League tile             240,8       44x44
    1:6270  League tile             288,8       44x44
    1:6300  League tile             336,8       44x44
    1:6330  More leagues            384,0       34x60  → 1:6331 chevron-down  10,25.5  14x9
```

- 8 tiles, all **44 x 44**, all at y=8 in a 60-tall row → 8px above and below. **[M]**
- Tile pitch 48 → **gap 4px**. **[derived]**
- Logo **26 x 26** at (9,9) → 9px inset all round inside the 44px tile. **[M]**
- "More leagues" is a 34 x 60 full-height column, not a tile. Chevron 14 x 9 at
  (10, 25.5) → vertically centred (25.5 + 4.5 = 30 = 60/2). **[derived]**
- Carousel frame declared **362** wide, content ends at 384+34 = **418**; absolute right
  edge 16+418 = **434** vs a 390 viewport → **44px off-screen, horizontal scroll row.** **[derived]**

### 5.2 Tokens **[C]**

**`1:6082` header:** `display: flex; align-items: center; justify-content: space-between`.

**`1:6083` title-pill:** despite the name it has **no background** — `height: 24px`,
`padding: 10px 0`, `border-radius: 12px`, `align-items: center`. It is a bare text wrapper.

**`1:6084`:** literal source string **`Рекомендовані ліги`** with `text-transform: capitalize`
→ renders as `Рекомендовані Ліги`. Inter **SemiBold 600**, `13px`, `line-height: normal`,
colour **`#173b68`**, `white-space: nowrap`.

**`1:6085` header-accent (the "Всі ліги" link chip):**
- `background: #eff6ff`
- `border: 1px solid #bfdbfe`
- `width: 90px`, `height: 30px`, `border-radius: 10px`, `padding: 0 4px`, `gap: 8px`, centered
- label `1:6086`: **`Всі ліги`** — Inter Regular 400, `12px`, colour **`#1e40af`**, nowrap
- `1:6087` chevron-right, **14 x 14**,
  `https://www.figma.com/api/mcp/asset/3542c411-7a21-4319-afe4-6540d83e5aae.svg`

**`1:6090` League tile:**
- `background: #e8f1fc`, `border-radius: 10px`, `flex-col`, centered, `overflow: clip`
- logo `1:6091` **26 x 26**,
  `https://www.figma.com/api/mcp/asset/8cabf9f9-d181-4121-8fcd-9669b1bce6cb.svg`

**`1:6330` More leagues:**
- `background: #ffffff`, `flex-col`, centered — **no radius, no border, no shadow**
- chevron-down `1:6331` **14 x 9**,
  `https://www.figma.com/api/mcp/asset/0340e6cb-4b63-4750-863c-70c414ae7087.svg`

Note: the tile fill `#e8f1fc` and the "More leagues" fill `#ffffff` are the *same pair* as
the unselected/selected sport-filter pills — but the widget frame itself has no background,
so the white block reads as a flat panel against the page. See UNKNOWN #3.

---

## 6. Sport filter pills — `1:6333`, 390 x 60 (y = 495)

`1:6333` **[C]**: `padding: 12px 16px`, `gap: 8px`, `align-items: flex-start`.

All three pills share **[C]**: `height: 36px`, `gap: 8px`, `padding: 0 4px`,
`border-radius: 10px`, `align-items: center`, `justify-content: center`, `overflow: clip`.

| # | node | w **[M]** | x **[M]** | background **[C]** | shadow **[C]** | icon | label | count colour **[C]** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 **SELECTED** | `1:6334` | 121 | 16 | `#ffffff` | `0px 6px 18px 0px rgba(23,69,143,0.08)` | `1:6335` football | **`Футбол`** | **`#17458f`** |
| 2 | `1:6340` | 141 | 145 | `#edf5ff` | none | `1:6341` basketball | **`Баскетбол`** | **`#71809a`** |
| 3 | `1:6355` | 106 | 294 | `#edf5ff` | none | `1:6356` racket | **`Теніс`** | **`#71809a`** |

Shared: **[C][M]**
- icon box **16 x 16** at (4,10) inside the pill
- label: Inter Regular 400, `13px`, `line-height: normal`, colour `#102a67`, nowrap —
  **same colour in every state**
- count badge: `background: #dcebff`, `border-radius: 999px`, `padding: 4px 7px`,
  `overflow: clip`. Measured box **33 x 21** at y=7.5.
- count text: Inter Regular 400, `11px`, `line-height: normal`. Box 19 x 13 at (7,4).
- **the count is literally `310` on all three pills**

Selected vs unselected is **three** changes, not one: **[C]**
1. fill `#ffffff` vs `#edf5ff`
2. shadow `0px 6px 18px rgba(23,69,143,0.08)` vs none
3. count text `#17458f` vs `#71809a` — the badge fill stays `#dcebff` in both

The basketball icon is not used flat: `1:6341` wraps a `Group` (`1:6342`/`1:6343`) inset
`1.09% 1% 1.08% 1%` and transformed `rotate(180deg) scaleX(-1)`. **[C]**

Row width = 16 + 121 + 8 + 141 + 8 + 106 = **400** > 390 → the tennis pill is clipped.
**Horizontal scroll row.** **[derived]**

---

## 7. "Майбутні Події" section — `1:6366`, 390 x 466 (y = 555)

### 7.1 Section header `1:6367` — 358 x 30 at (16,16), absolute y = 571

`1:6367` **[C]**: `display: flex; align-items: center; justify-content: space-between`.

**Title group `1:6368`** **[C][M]**: `gap: 8px`, `align-items: center`, `overflow: clip`. 156 x 22.
- calendar icon `1:6369` **22 x 22**, inner `Layer 2` (`1:6370`) at `inset: 3.13%`,
  `https://www.figma.com/api/mcp/asset/47a45606-d1c5-4950-83b7-42df149ff984.svg`
- title `1:6377`: **`Майбутні Події`** — Roboto **Medium 500**, `18px`,
  `line-height: normal`, colour **`#07134f`**, `font-variation-settings: "wdth" 100`, nowrap.
  Box 126 x 21 at x=30.

**Event filter `1:6378` — 90 x 30 at x=268** **[C]**
- `background: #eff6ff`, `border: 1px solid #bfdbfe`, `border-radius: 10px`,
  `padding: 0 4px`, `gap: 8px`, centered, `overflow: clip`
- label `1:6379`: **`Всі події`** — Roboto Regular 400 `wdth 100`, `12px`, colour `#1e40af`
- chevron-right `1:6380` **14 x 14**,
  `https://www.figma.com/api/mcp/asset/5a489d9e-208f-4e14-8772-d8dfcc09fe6b.svg`

This is the **same chip** as `1:6085` ("Всі ліги") — identical fill, border, size, radius,
padding, gap and text colour. The only difference is the font family: `1:6086` is Inter,
`1:6379` is Roboto. One component, one inconsistency. **[C]**

### 7.2 League-card stack `1:6382` — 358 x 412 at (16,54), absolute y = 609 **[M]**

Two `League card`s, 358 x 196, at y=0 and y=216 → **gap 20px**. **[derived]**

---

## 8. League card — `1:6383`, 358 x 196  ← the core structure

Card `1:6383` **[C]**:
- `background: #ffffff`
- `border-radius: 20px`
- `box-shadow: 0px 6px 18px 0px rgba(23,69,143,0.08)`
- `flex-direction: column`, `gap: 2px`, `overflow: clip`

### 8.1 League header `1:6384` — 358 x 32 **[C][M]**

`background: #e8f1fc`, `padding: 8px 12px`, `gap: 8px`, `align-items: center`, `overflow: clip`.

| slot | node | content | type | box **[M]** |
| --- | --- | --- | --- | --- |
| sport icon | `1:6385` | `football_1165187 1` svg | — | 16 x 16 at (12,8) |
| sport name | `1:6387` | **`Футбол`** | Roboto Regular 400 `wdth 100`, `14px`, **`#191970`** | 48 x 16 at x=36 |
| separator | `1:6388` | **`–`** (U+2013 EN DASH) | Inter Regular 400, `12px`, `#758098` | 6 x 15 at x=92 |
| emblem | `1:6389` | **`♕`** (U+2655, a **glyph**, not an icon) | Inter Regular 400, `12px`, `#758098` | 12 x 15 at x=106 |
| league name | `1:6390` | **`Ліга Чемпіонів УЄФА`** | Roboto Regular 400 `wdth 100`, `14px`, `#758098`, `flex: 1 0 0` | 220 x 16 at x=126 |

Sport name is `#191970` (the named **Navy** style); league name is `#758098`. Different
colours in the same row, on purpose. **[C]**

Football icon URL: `https://www.figma.com/api/mcp/asset/617c307d-65d0-4e49-87f4-0a3538b344ef.svg`
(same glyph as `1:6335`, exported under a different URL).

### 8.2 Match row `1:6391` — 358 x 80 **[C][M]**

- `background: #f5f8fd`
- `padding: 8px 8px 12px 8px` (top 8, sides 8, **bottom 12**)
- `gap: 8px`, `align-items: flex-end`, `overflow: clip`
- Two rows per card, at y=34 and y=116 inside the card
  (0 + 32 + 2 = 34; 34 + 80 + 2 = 116 — the 2px is the card's `gap`). **[derived]**

#### Left column — `Match details` `1:6392`, 160 x 55 at (8,13)

`flex: 1 0 0`, `flex-direction: column`, `gap: 6px`, `align-items: flex-start`, `overflow: clip`. **[C]**

**Metadata line `1:6393` — 119 x 17, `flex-row`, `gap: 6px`, `align-items: center`:** **[C][M]**

| element | node | literal content | font | size | colour | box |
| --- | --- | --- | --- | --- | --- | --- |
| start time | `1:6394` | **`Сьогодні, 22:00`** | Roboto Regular 400 `wdth 100` | `10px` | `#758098` | 71 x 12 at (0, 2.5) |
| live marker | `1:6395` | **`● EP`** | Roboto **Bold Italic** 700 italic `wdth 100` | `10px` | **`#f45b24`** | 21 x 12 at (77, 2.5) |
| favourite | `1:6396` | **`★`** | Inter Regular 400 | `14px` | `#758098` | 15 x 17 at (104, 0) |

> **The live indicator is not an icon.** `1:6395` is a text node containing `●` (U+25CF),
> a space, then the literal ASCII string `EP`, set in Roboto Bold Italic 10px `#f45b24`.
> The whole thing is one text run — the dot cannot be styled separately without splitting it.

> **The favourite star is not an icon either.** `1:6396` is the character `★` (U+2605),
> Inter 14px `#758098` — the same character as the header Favorites button `1:6024`, but
> 14px/grey instead of 25px/`#1677e8`. Only the grey (unselected) state exists here.

**Teams block `1:6397` — 160 x 32 at y=23:** **[C][M]**
`flex-direction: column`, `gap: 4px`, `width: 100%`, `white-space: pre-wrap`,
Roboto **Medium 500** `wdth 100`, `12px`, colour **`#07134f`**.

| row | node | literal string — **two spaces after the emoji** | box |
| --- | --- | --- | --- |
| home | `1:6398` | `` 🔵  Наполі `` | 160 x 14 at y=0 |
| away | `1:6399` | `` 🔴  Арсенал `` | 160 x 14 at y=18 |

Row 2 of the card (`1:6412`): `` 🔴  Ліверпуль `` / `` 🔷  Атлетіко ``. **[C]**

> **Team "badges" are emoji inside the text node** — 🔵 U+1F535, 🔴 U+1F534, 🔷 U+1F537.
> They have no node id, no size, no fill and no asset URL. The `white-space: pre-wrap` is
> what preserves the double space that spaces the badge off the name.

#### Right column — `Odds` `1:6400`, 174 x 60 at (176, 8)

`flex-direction: column`, `gap: 6px`, `align-items: flex-start`, **fixed `width: 174px`**,
`overflow: clip`. **[C]**

**Odds labels `1:6401` — 174 x 12** — Roboto Regular 400 `wdth 100`, `10px`, `#758098`, nowrap: **[C][M]**

| meaning | node | **literal** | box |
| --- | --- | --- | --- |
| home win | `1:6402` | **`1`** | 6 x 12 at x = 25.666666030883789 |
| draw | `1:6403` | **`Н`** | 8 x 12 at x = 83 |
| away win | `1:6404` | **`2`** | 6 x 12 at x = 142.3333282470703 |

> **The middle label is `Н` — Cyrillic capital EN (U+041D)**, short for "нічия" (draw).
> It is **not** Latin `X` and **not** Latin `H`. The brief said "1, X, 2"; that is not what
> the design contains. Verify before shipping — see UNKNOWN #6.

The label row's distribution is **`justify-content: space-around`**, which the Figma
reference code dropped. Proved against the measured x's: free space 174 − (6+8+6) = 154,
share 154/3 = 51.333, half-share 25.667 →
x₁ = 25.667 ✓ · x₂ = 25.667 + 6 + 51.333 = 83 ✓ · x₃ = 83 + 8 + 51.333 = 142.333 ✓.
Exact to all three measured values. **[derived]**

**Odds values `1:6405` — 174 x 42 at y=18** — `flex-row`, `gap: 4px`, `width: 100%`. **[C]**

Each **`Odd` cell** — this is the number the brief asked for: **[C][M]**

| property | value |
| --- | --- |
| **width** | **`55.33333206176758` px** (`flex: 1 0 0`, `min-width: 1px`; (174 − 2×4) / 3 = 55.333) |
| **height** | **`42px`** (fixed) |
| background | `#e8f1fc` |
| border-radius | `10px` |
| layout | `flex-col`, `align-items: center`, `justify-content: center`, `overflow: clip` |
| x positions | `0` · `59.33333206176758` · `118.66667175292969` |
| value text | Roboto **Medium 500** `wdth 100`, `12px`, `line-height: normal`, **`#f45b24`**, nowrap |
| value text box | 24 x 14 at (15.667, 14) inside the cell |

**Exact odds values in the design** — both cards, all four rows: **[C]**

| card | row | teams | node ids | **1** | **Н** | **2** |
| --- | --- | --- | --- | --- | --- | --- |
| `1:6383` | 1 | 🔵 Наполі / 🔴 Арсенал | `1:6407` `1:6409` `1:6411` | **5.68** | **4.00** | **1.62** |
| `1:6383` | 2 | 🔴 Ліверпуль / 🔷 Атлетіко | `1:6428` `1:6430` `1:6432` | **1.77** | **3.96** | **4.46** |
| `1:6433` | 1 | 🔵 Наполі / 🔴 Арсенал | `1:6457` `1:6459` `1:6461` | **5.68** | **4.00** | **1.62** |
| `1:6433` | 2 | 🔴 Ліверпуль / 🔷 Атлетіко | `1:6478` `1:6480` `1:6482` | **1.77** | **3.96** | **4.46** |

**Card `1:6433` is a byte-identical duplicate of `1:6383`** — same league header
(`Футбол – ♕ Ліга Чемпіонів УЄФА`), same times (`Сьогодні, 22:00`), same `● EP` on every
row, same teams, same odds, same tokens throughout. Confirmed by running
`get_design_context` on both. This is placeholder content, not two real fixtures. **[C]**

### 8.3 navbar (pre-login)

`1:6483` "navbar" (instance), 390 x 111, at (−16, 301) **inside** `1:6382` — the −16
cancels the parent's 16px left offset. Absolute: x = 0, y = 555 + 54 + 301 = **910**. **[derived]**
Not measured further — the navbar is shared chrome, not sport-specific.

---

## 9. Bet slip action — `1:6484`, 104 x 44 (a floating FAB)

Sits at canvas (3528, 313), i.e. a **standalone frame beside the page frames, not a child
of either.** Its docking position on the page is not expressed in Figma. **[M]**

Geometry **[M]**:
```
1:6484  Bet slip action        104x44
  1:6485  ticket          16,12   20x20
  1:6487  Coupon label    44,13   44x18
```

Tokens **[C]**:
- `background: **#f45b24**` — the same orange as the odds values and the `● EP` marker
- `border-radius: 999px` (full pill)
- `padding: 12px 16px`, `gap: 8px`, `align-items: center`, `overflow: clip`
- `box-shadow: 0px 10px 24px 0px rgba(16,42,103,0.15)` — a heavier, more diffuse shadow
  than anything else on the page (page shadows are `0px 6px 18px rgba(23,69,143,0.08)`)
- icon `1:6485` "ticket", **20 x 20**,
  `https://www.figma.com/api/mcp/asset/3e3af51e-7c02-46c8-8062-86792a613c11.svg`
- label `1:6487`: **`Купон`** — Inter Regular 400, `15px`, `line-height: normal`,
  colour `#ffffff`, nowrap

Width check: 16 + 20 + 8 + 44 + 16 = **104** ✓ · height: text 18px centred in 44 (13 + 9 = 22 = 44/2) ✓ **[derived]**

There is **no selection count** in the design — just the ticket glyph and the word `Купон`.
See UNKNOWN #7.

---

## 10. Post-login `1:88` vs pre-login `1:5994` — differences only

Both frames are 390 x 1021 with the same six bands at the same y and heights
(0/60, 60/152, 212/193, 405/90, 495/60, 555/466). **[M]**

### 10.1 Header — the only substantive difference

| | pre-login `1:5995` | post-login `1:89` |
| --- | --- | --- |
| inner frame | `1:5996` at (16, **12**), 358 x **36** | `1:90` at (16, **10**), 358 x **40** |
| logo | `1:5997` at (0, **8**), 111 x 20 | `1:91` at (0, **10**), 111 x 20 |
| hidden `Logo` | `1:5998` (135,8) 88x24 `hidden`, **first** child | `1:103` (135,8) 88x24 `hidden`, **last** child |
| right cluster | `1:5999` at (**160**, 0), **198 x 36** | `1:92` at (**211**, 0), **147 x 40** |

**Pre-login right cluster `1:5999`** — two auth buttons + search, gap 8: **[C][M]**
- `1:6000` `Увійти` — `#edf5ff` fill, h36, `padding: 6.606px 8px`, `radius: 8px`,
  Outfit SemiBold 13px `#102a67`, `letter-spacing: -0.2px`, capitalize. 60 x 36.
- `1:6002` `Реєстарція` — h36, `padding: 8px`, `radius: 6px`,
  `linear-gradient(to right, #ff8c00, #ff4500)`,
  `drop-shadow(0px 8px 12px rgba(255,69,0,0.33))`,
  `inset 0px 1px 0px rgba(255,255,255,0.25)`,
  Outfit SemiBold 13px white, `-0.2px`, capitalize. 86 x 36.
- `1:6004` search — `#edf5ff`, **36 x 36**, `radius: 999px`, `overflow: clip`;
  icon `1:6005` **40 x 40** (cropped by the 36px circle).
  `https://www.figma.com/api/mcp/asset/9f2d16b7-8963-4f2c-90f9-61197ff0453f.svg`

**Post-login right cluster `1:92`** — balance chip + search, gap 8: **[C][M]**
- `1:93` `Background+Border` — `background: **#ffe2d5**` (a warm peach; not used anywhere
  else on the page), `height: 40px`, `padding: 6.606px 8px`, `border-radius: 8px`. **99 x 40**.
  - `1:94` `Container` — `gap: 4px`, centered, `overflow: clip`, `border: 0`. 83 x 24.
    - `1:95` **`$ 140.00`** — **Roboto Flex SemiBold 600**, `14px`, `line-height: 18px`,
      colour **`#191970`** (the named **Navy** style), with the full variable axis stack:
      `"GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738,
      "YTLC" 514, "YTUC" 712, "wdth" 100`. Box 55 x 18.
    - `1:96` `tabs_4511814 (1) 1` — **24 x 24**, inner `Group` `1:97` at `inset: 1.56%`,
      `https://www.figma.com/api/mcp/asset/57c9a553-9f4a-4d9c-8963-789a7faf9c40.svg`
- `1:100` search — `#edf5ff`, **40 x 40**, `radius: 999px`, `overflow: clip`;
  icon `1:101` **40 x 40**, now an exact fit rather than cropped.
  `https://www.figma.com/api/mcp/asset/ef0a4092-1983-4024-9f31-4739b0776c91.svg`

Summary of the header change: the two auth buttons are replaced by one 99 x 40 balance chip
in `#ffe2d5` showing `$ 140.00` plus a 24 x 24 action icon; the search button grows
36 → 40 and stops cropping its icon; the whole cluster is 51px narrower and starts 51px
further right; the bar stays 60 tall. **[C][M]**

### 10.2 Recommended leagues widget — 2–4px of frame drift **[M]**

| | pre-login | post-login |
| --- | --- | --- |
| header frame | `1:6082` 16,0 **360** x 30 | `1:179` 16,0 **358** x 30 |
| header-accent x | `1:6085` **270** | `1:182` **268** |
| carousel frame | `1:6089` 16,30 **362** x 60 | `1:186` 16,30 **358** x 60 |

All tile geometry is identical in both: 8 tiles 44 x 44 at y=8, x = 0/48/96/144/192/240/
288/336, logo 26 x 26 at (9,9), "More leagues" 34 x 60 at x=384 with a 14 x 9 chevron
at (10, 25.5). **[M]**

Post-login has the correct numbers (358 = 390 − 32, matching every other section); the
pre-login frames are 2–4px wide. Content overflows both, so it is visually invisible.
This is drift, not intent. **[derived]**

### 10.3 navbar parenting **[M]**

| | pre-login | post-login |
| --- | --- | --- |
| node | `1:6483`, child of `1:6382` | `1:580`, direct child of `1:88` |
| declared position | (−16, 301) | (0, 910) |
| absolute position | (0, 910) | (0, 910) |
| size | 390 x 111 | 390 x 111 |

Same instance, same place on screen, different parent. Post-login is the clean version.

### 10.4 Everything else is node-for-node identical **[M]**

Mode switch (`1:6007` ↔ `1:104`), sports navigation, the four-slide hero track including
both off-screen Hero-Cards and all their sub-nodes, the three sport filter pills with their
121/141/106 widths and 33 x 21 count badges, the section header, and both league cards with
all four match rows — every child name, x, y, width and height matches exactly.

**There is no bet-slip element, no "my bets" entry point and no balance-aware odds
treatment in `1:88` that is absent from `1:5994`.** The sportsbook body does not change on
login. `1:6484` is a separate canvas frame, present for neither state specifically.

---

## 11. Asset inventory — node id + download URL, not downloaded

URLs expire ~7 days from this pass.

### 11.1 Assets with a confirmed URL **[C]**

| # | node | layer name | rendered size | type | download URL |
| --- | --- | --- | --- | --- | --- |
| 1 | `1:6013` | stream_8191668 1 (Live tab) | 18 x 18 | svg | `https://www.figma.com/api/mcp/asset/a2523a13-0ac8-4ed6-bca4-e04360e58a5f.svg` |
| 2 | `1:6335` | football_1165187 1 (filter pill) | 16 x 16 | svg | `https://www.figma.com/api/mcp/asset/cef02255-d10d-4b63-b387-5a08a0a663bb.svg` |
| 3 | `1:6385` | football_1165187 1 (league header, card 1) | 16 x 16 | svg | `https://www.figma.com/api/mcp/asset/617c307d-65d0-4e49-87f4-0a3538b344ef.svg` |
| — | `1:6435` | football_1165187 1 (league header, card 2) | 16 x 16 | svg | `https://www.figma.com/api/mcp/asset/70ce2aa8-1b02-4d62-9373-424e44e71885.svg` |
| 4 | `1:6342` | ball_11403030 1 → Group (basketball) | 16 x 16 | svg | `https://www.figma.com/api/mcp/asset/1b93def2-9894-4ef8-b78d-262f8263cb74.svg` |
| 5 | `1:6356` | racket_5102924 1 (tennis) | 16 x 16 | svg | `https://www.figma.com/api/mcp/asset/afce1a8a-3a70-4cdc-af4a-9e4d167da075.svg` |
| 6 | `1:6370` | calendar_4339139 1 → Layer 2 | 22 x 22 | svg | `https://www.figma.com/api/mcp/asset/47a45606-d1c5-4950-83b7-42df149ff984.svg` |
| 7 | `1:6087` | chevron-right ("Всі ліги") | 14 x 14 | svg | `https://www.figma.com/api/mcp/asset/3542c411-7a21-4319-afe4-6540d83e5aae.svg` |
| — | `1:6380` | chevron-right ("Всі події") | 14 x 14 | svg | `https://www.figma.com/api/mcp/asset/5a489d9e-208f-4e14-8772-d8dfcc09fe6b.svg` |
| 8 | `1:6331` | chevron-down (More leagues) | 14 x 9 | svg | `https://www.figma.com/api/mcp/asset/0340e6cb-4b63-4750-863c-70c414ae7087.svg` |
| 9 | `1:6091` | Europa_League_2021.svg 1 [Vectorized] | 26 x 26 | svg | `https://www.figma.com/api/mcp/asset/8cabf9f9-d181-4121-8fcd-9669b1bce6cb.svg` |
| 10 | `1:6005` | search_header.svg (pre-login) | 40 x 40 | svg | `https://www.figma.com/api/mcp/asset/9f2d16b7-8963-4f2c-90f9-61197ff0453f.svg` |
| — | `1:101` | search_header.svg (post-login) | 40 x 40 | svg | `https://www.figma.com/api/mcp/asset/ef0a4092-1983-4024-9f31-4739b0776c91.svg` |
| 11 | `1:97` | tabs_4511814 (1) 1 → Group (balance chip) | 24 x 24 | svg | `https://www.figma.com/api/mcp/asset/57c9a553-9f4a-4d9c-8963-789a7faf9c40.svg` |
| 12 | `1:6485` | ticket (bet slip) | 20 x 20 | svg | `https://www.figma.com/api/mcp/asset/3e3af51e-7c02-46c8-8062-86792a613c11.svg` |
| 13 | `1:6031` | enhanced_..._6krli0pce31dlxk4zab7_1 (1) 1 (banner photo) | 542.3 x 314.449, rotated 17.94°, clipped to 340 x 170 | **png** | `https://www.figma.com/api/mcp/asset/2516e96f-66a1-41c3-8591-905005b647af.png` |
| 14 | `1:6032` | Ellipse 4 (banner glow) | 227 x 155, rotated 90° | svg | `https://www.figma.com/api/mcp/asset/c143f17f-773e-4e69-9faf-9a8ef3790bf5.svg` |

**14 distinct source assets** (the duplicate rows marked `—` are the *same glyph* exported
again under a second URL: football ×2, chevron-right ×2, search ×2 — three files cover six
URLs). Only asset #13 is a raster PNG; everything else is SVG.

`1:6031` is the one to watch for `scripts/to-webp.mjs`: it is a large photo rendered at
542 x 314 but placed inside a 340 x 170 clipping box with a 17.94° rotation.

### 11.2 Assets identified by node but **without** a URL (design context not run) **[M]**

| node | layer name | size | where |
| --- | --- | --- | --- |
| `1:6121` `1:6151` `1:6181` `1:6211` `1:6241` `1:6271` `1:6301` | Europa_League_2021.svg 1 [Vectorized] | 26 x 26 | league strip tiles 2–8 |
| `1:6059` | enhanced_..._xrq8r4aiizudy6f6mw29_1 2 | 132.31 x 129.56 | off-screen Hero-Card 1 |
| `1:6061` `1:6078` | Gates of Olympus_..._Character_25 ("зевс") | 118.48 x 219 / 115.78 x 214 | off-screen Hero-Cards |
| `1:6062` `1:6063` `1:6079` `1:6080` | Lens Flare 2 8 / 2 9 | ~16.98 x 16.87 | off-screen Hero-Cards |

The four off-screen entries belong to the casino Hero-Card component, not to the sport page.

### 11.3 Glyphs that are text, **not** assets — do not export **[C]**

| glyph | codepoint | where | size / colour |
| --- | --- | --- | --- |
| `★` | U+2605 | Favorites button `1:6024` | Inter 25px `#1677e8` |
| `★` | U+2605 | match-row favourite `1:6396` etc. | Inter 14px `#758098` |
| `🎁` | U+1F381 | Gifts button `1:6026` | Inter 22px |
| `♕` | U+2655 | league emblem `1:6389` | Inter 12px `#758098` |
| `–` | U+2013 | league header separator `1:6388` | Inter 12px `#758098` |
| `●` | U+25CF | inside `● EP` `1:6395` | Roboto Bold Italic 10px `#f45b24` |
| `🔵` | U+1F535 | home team badge, inside `1:6398` | Roboto Medium 12px |
| `🔴` | U+1F534 | away/home team badge | Roboto Medium 12px |
| `🔷` | U+1F537 | away team badge, row 2 | Roboto Medium 12px |
| `₴` | U+20B4 | banner `15000 ₴` | Big Shoulders Display Black 29.4px |

---

## 12. Token summary — every value `get_design_context` returned

### 12.1 Figma variables (the entire named system) **[C]**

```
Orange   #FF4500
Navy     #191970
BG main  #FFFFFF
```

Three. Everything below is raw hex with no variable behind it.

### 12.2 Colours

| hex | used for |
| --- | --- |
| `#ffffff` | selected Prematch tab · selected sport-filter pill · league card body · "More leagues" block · **BG main** |
| `#dcebff` | mode-switch track · sport-filter count badge (both states) |
| `#e8f1fc` | category-switcher track · Favorites/Gifts buttons · league-tile fill · league-card header · **odds cell** |
| `#c9dcf4` | selected category chip (Спорт) |
| `#edf5ff` | unselected sport-filter pill · pre-login `Увійти` button · both search buttons |
| `#eff6ff` | "Всі ліги" and "Всі події" link chips |
| `#bfdbfe` | 1px border on those two link chips |
| `#f5f8fd` | match row |
| `#ffe2d5` | post-login balance chip (used nowhere else) |
| `#000000` | WELCOME banner card background · Gifts text colour (moot) |
| `#102a67` | Prematch/Live labels · category labels · sport-filter labels · `Увійти` label |
| `#17458f` | count text on the **selected** filter pill · base of `rgba(23,69,143,…)` shadows |
| `#71809a` | count text on **unselected** filter pills |
| `#758098` | league name · `–` · `♕` · start time · favourite `★` · odds labels |
| `#173b68` | "Рекомендовані ліги" title |
| `#1e40af` | "Всі ліги" / "Всі події" link text |
| `#191970` | sport name in the league-card header · post-login balance `$ 140.00` — **Navy** |
| `#07134f` | team names · "Майбутні Події" title |
| `#0d1a59` | banner offer text `225% ДО 15000 ₴` |
| `#f45b24` | `● EP` live marker · odds values · **bet-slip FAB fill** |
| `#1677e8` | Favorites `★` in the sports-navigation row |
| `#007aff` | banner badge text `ВІТАЛЬНИЙ БОНУС` |
| `rgba(0,122,255,0.1)` | banner badge fill (over `backdrop-blur(8.539px)`) |
| `rgba(255,255,255,0.09)` | banner badge 0.854px border |
| `#ff8c00 → #ff4500` | `linear-gradient(to right, …)` — register button and banner CTA — **Orange** |

### 12.3 Shadows

| value | used on |
| --- | --- |
| `drop-shadow(0px 8px 12px rgba(0,0,0,0.05))` | `1:6007` mode-switch + nav container |
| `0px 6px 18px 0px rgba(23,69,143,0.08)` | selected Prematch tab · selected sport-filter pill · league card |
| `0px 2px 5px 0px rgba(35,101,169,0.1)` | selected category chip |
| `0px 10px 24px 0px rgba(16,42,103,0.15)` | bet-slip FAB `1:6484` |
| `drop-shadow(0px 8px 12px rgba(255,69,0,0.33))` | register button `1:6002` · banner CTA `1:6036` |
| `inset 0px 1px 0px 0px rgba(255,255,255,0.25)` | same two gradient buttons (top highlight) |

### 12.4 Radii

`999px` — mode-switch track and tabs · count badge · search buttons · bet-slip FAB
`853.079px` — banner badge (effectively a pill)
`24px` — `1:6007` container
`20px` — league card
`13px` — category-switcher track · Favorites · Gifts
`12px` — WELCOME banner card · `title-pill`
`10px` — category chips · sport-filter pill · **odds cell** · league tile · link chips
`8px` — `Увійти` button · balance chip
`6px` — register button · banner CTA

### 12.5 Type

| role | family / weight | size | line-height | colour | extras |
| --- | --- | --- | --- | --- | --- |
| Прематч / Лайв | Inter Regular 400 | 15px | 1.35 | `#102a67` | |
| Купон (bet slip) | Inter Regular 400 | 15px | normal | `#ffffff` | |
| Спорт / Кіберспорт | Inter Regular 400 | 13px | 1.35 | `#102a67` | |
| sport filter label | Inter Regular 400 | 13px | normal | `#102a67` | |
| "Рекомендовані ліги" | Inter **SemiBold 600** | 13px | normal | `#173b68` | `text-transform: capitalize` |
| "Всі ліги" | Inter Regular 400 | 12px | normal | `#1e40af` | |
| count badge | Inter Regular 400 | 11px | normal | `#17458f` / `#71809a` | |
| `–` and `♕` | Inter Regular 400 | 12px | normal | `#758098` | |
| Favorites `★` | Inter Regular 400 | 25px | normal | `#1677e8` | |
| match `★` | Inter Regular 400 | 14px | normal | `#758098` | |
| Gifts `🎁` | Inter Regular 400 | 22px | normal | `#000000` | |
| "Майбутні Події" | Roboto **Medium 500** | 18px | normal | `#07134f` | `wdth 100` |
| league header sport | Roboto Regular 400 | 14px | normal | `#191970` | `wdth 100` |
| league header name | Roboto Regular 400 | 14px | normal | `#758098` | `wdth 100` |
| "Всі події" | Roboto Regular 400 | 12px | normal | `#1e40af` | `wdth 100` |
| team names | Roboto **Medium 500** | 12px | normal | `#07134f` | `wdth 100`, `white-space: pre-wrap` |
| odds values | Roboto **Medium 500** | 12px | normal | `#f45b24` | `wdth 100` |
| start time | Roboto Regular 400 | 10px | normal | `#758098` | `wdth 100` |
| odds labels `1 Н 2` | Roboto Regular 400 | 10px | normal | `#758098` | `wdth 100` |
| `● EP` | Roboto **Bold Italic** 700 italic | 10px | normal | `#f45b24` | `wdth 100` |
| balance `$ 140.00` | **Roboto Flex** SemiBold 600 | 14px | **18px** | `#191970` | full axis stack (see §10.1) |
| `Увійти` / `Реєстарція` | **Outfit** SemiBold 600 | 13px | normal | `#102a67` / `#ffffff` | `-0.2px`, capitalize |
| banner CTA `Депозит` | **Outfit** Bold 700 | 13px | normal | `#ffffff` | `-0.2px`, uppercase |
| banner badge | **Archivo Narrow** SemiBold 600 | 10px | normal | `#007aff` | uppercase |
| banner `225%` / `15000 ₴` | **Big Shoulders Display** Black 900 | 29.4px | 1 | `#0d1a59` | `-1.2293px`, uppercase |
| banner `ДО` | Big Shoulders Display Black 900 | 14.7px | 1 | `#0d1a59` | same |
| banner spacer span | Big Shoulders Display Black 900 | 61.464px | 1 | — | a lone space, forces the line break |

**Six families**: Inter (chrome/controls) · Roboto (match data) · Roboto Flex (balance only)
· Outfit (buttons) · Archivo Narrow (banner badge) · Big Shoulders Display (banner headline).

---

## 13. Literal Ukrainian copy — character for character

### 13.1 Confirmed by `get_design_context` (actual text-node contents) **[C]**

```
Прематч
Лайв
Спорт
Кіберспорт
Увійти
Реєстарція
Рекомендовані ліги
Всі ліги
Футбол
Баскетбол
Теніс
310
Майбутні Події
Всі події
Футбол
–
♕
Ліга Чемпіонів УЄФА
Сьогодні, 22:00
● EP
★
🔵  Наполі
🔴  Арсенал
🔴  Ліверпуль
🔷  Атлетіко
1
Н
2
5.68
4.00
1.62
1.77
3.96
4.46
Купон
$ 140.00
вітальний бонус
225%
ДО 
15000 ₴
Депозит
```

Source-vs-rendered, where CSS changes what the eye sees: **[C]**

| source string | CSS | rendered |
| --- | --- | --- |
| `Рекомендовані ліги` | `text-transform: capitalize` | `Рекомендовані Ліги` |
| `вітальний бонус` | `text-transform: uppercase` | `ВІТАЛЬНИЙ БОНУС` |
| `Депозит` | `text-transform: uppercase` | `ДЕПОЗИТ` |
| `Увійти` | `text-transform: capitalize` | `Увійти` (no change) |
| `Реєстарція` | `text-transform: capitalize` | `Реєстарція` (no change — the typo survives) |

**Store the source strings, not the rendered ones**, and apply `text-transform` in CSS —
otherwise `capitalize` on a Ukrainian phrase will not round-trip.

### 13.2 Not confirmed — layer names only, no text content returned **[M]**

Off-screen Hero-Card slides `1:6046` / `1:6064`: layer names `WELCOME`, `20X WAGER`,
`Bonus-Title`, `Bonus-Subtitle`. See UNKNOWN #2.

---

## 14. Interaction / state inventory

| control | nodes | states present in the design | states NOT in the design |
| --- | --- | --- | --- |
| Prematch / Live segmented switch | `1:6009` → `1:6010` `1:6012` | selected (white + `0 6 18 rgba(23,69,143,.08)`), unselected (transparent) | pressed, focus, disabled |
| Спорт / Кіберспорт segmented switch | `1:6018` → `1:6019` `1:6021` | selected (`#c9dcf4` + `0 2 5 rgba(35,101,169,.1)`), unselected | pressed, focus |
| Favorites button | `1:6023` | resting only | active / count |
| Gifts button | `1:6025` | resting only | active / badge |
| Bonus banner carousel | `1:6029`, 4 slides, 4px gutter | resting; slide 2 peeks 30px | dots, autoplay indicator, active-slide state — **none exist** |
| League logo strip | `1:6089`, 8 tiles + `1:6330` | resting; overflows viewport by 44px → h-scroll | selected league, pressed |
| "More leagues" | `1:6330` + chevron-down | collapsed | expanded |
| Sport filter pills | `1:6334` `1:6340` `1:6355` | selected (white + shadow + `#17458f` count), unselected (`#edf5ff` + `#71809a` count) | pressed, disabled, zero-count |
| "Всі ліги" / "Всі події" chips | `1:6085` `1:6378` | resting | pressed |
| Match favourite star | `1:6396` `1:6417` `1:6446` `1:6467` | unselected grey `#758098` on all four rows | selected / filled |
| **Odds cell (bet selection)** | `1:6406` `1:6408` `1:6410` + 9 more | resting only: `#e8f1fc` fill, `#f45b24` text, `10px` radius, 55.333 x 42 | **selected, pressed, suspended/locked, odds-drifted up/down** |
| Live marker `● EP` | `1:6395` and every sibling | present on all four rows | a non-live row (no marker) is never shown |
| Bet slip FAB | `1:6484` | resting only | empty vs populated, selection count, pressed |
| Header | `1:5999` (pre) ↔ `1:92` (post) | logged-out and logged-in | loading balance, zero balance |

---

## UNKNOWN

1. **`Реєстарція` (`1:6003`).** The literal string in the design is `Реєстарція` —
   `с-т-а-р` where correct Ukrainian is `с-т-р-а` (`Реєстрація`). Is this a typo to fix in
   implementation, or does the client want the design reproduced exactly? Fixing it silently
   would make the build diverge from the Figma the client reviews against.

2. **Off-screen Hero-Card slides `1:6046` / `1:6064`.** Their text and tokens were never
   retrieved. Two questions: (a) what are `Bonus-Title` / `Bonus-Subtitle` / the two badge
   strings? (b) **Are these casino cards supposed to be in the *sport* carousel at all?**
   Their layer names are `зевс`, `Gates of Olympus_Game Art_2878x5319_Character_25` and
   `Lens Flare 2 8/9` — that is slot artwork, not sportsbook. They read as leftovers pasted
   from the casino page. Should the sport carousel be only the two WELCOME slides?

3. **The eight league tiles are indistinguishable in the data.** All 8 carry the layer name
   `Europa_League_2021.svg 1 [Vectorized]` at the same 26 x 26. I only pulled the URL for
   tile 1 (`1:6091`). The tile node ids are 30 apart (`1:6091`, `1:6121`, `1:6151`, …),
   which suggests ~30 vector children each, i.e. distinct artwork — but that is inference,
   not measurement. Are these 8 *different* league logos with a copy-pasted layer name, or
   genuinely the same Europa League badge repeated 8 times as placeholder?

4. **The `1:6027` hero-section wrapper.** I have its geometry (`1:6028` at y=10.5, 172 tall
   inside a 193-tall band → 10.5 above, 10.5 below) but never its padding, background or
   overflow. Does `1:6027` have a fill, or is it transparent over the page background? And
   what *is* the page background — every section I measured has either a white or a tinted
   fill of its own, and no page-level background colour was returned.

5. **Scroll behaviour is inferred from overflow, never declared.** Three rows are wider than
   the viewport: hero track (content to x=1424 vs 390), league strip (to x=434), sport
   filter pills (to x=400). Figma geometry cannot distinguish free scroll, scroll-snap, or a
   paged carousel. Which is intended for each of the three? The hero's uniform 4px gutter
   with *mixed* slide widths (340 / 358) argues against scroll-snap-to-slide.

6. **The draw label `Н`.** Cyrillic EN (U+041D), presumably "нічия". The task brief
   specified "1, X, 2" — the near-universal sportsbook convention. Is `Н` a deliberate
   Ukrainian localisation, or a mistake for Latin `X`? This decides the shipped string.

7. **Bet-slip FAB `1:6484` docking and behaviour.** It is a standalone canvas frame at
   (3528, 313), not a child of either page frame, so Figma states nothing about where it
   sits on screen. Where does it dock — bottom-right above the navbar, bottom-centre,
   or is it pinned to the odds area? Does it appear only once a selection exists? It shows
   no count, so how does the user know how many selections are in the coupon?

8. **The link chip is one component with two fonts.** `1:6085` ("Всі ліги") uses Inter
   Regular 12; `1:6378` ("Всі події") uses Roboto Regular 12. Everything else about them —
   `#eff6ff` fill, `1px #bfdbfe` border, 90 x 30, `10px` radius, `0 4px` padding, `8px`
   gap, `#1e40af` text, 14 x 14 chevron — is identical. Which font is correct?

9. **`● EP`.** Is `EP` a literal broadcaster abbreviation that ships as-is on every row, or a
   placeholder for a per-match channel value? It appears identically on all four rows, which
   is what a placeholder looks like.

10. **Odds-label alignment is ~1px out.** The labels use `space-around` over 174px (centres
    at 28.67 / 87 / 145.33) while the odds cells below are 55.333 wide with 4px gaps
    (centres at 27.67 / 87 / 146.33). The outer two labels sit 1px inboard of the cells they
    label. Intentional, or should each label simply be centred on its cell?

11. **Both league cards are identical placeholder content.** Same league, same kickoff
    (`Сьогодні, 22:00`), same teams, same odds, in both cards. Confirmed by measurement, not
    assumed. What should the second card actually show — a different league, a different
    sport? And is a league card always exactly 2 match rows, or is 2 just what fits the mock?

12. **Design tokens barely exist.** `get_variable_defs` over the whole frame returns only
    `Orange #FF4500`, `Navy #191970`, `BG main #FFFFFF`. The page uses ~25 further raw
    hexes, three separate shadow recipes and six font families. Should implementation invent
    a token layer (and if so, who signs off on the names), or mirror the raw hexes so the
    build stays diff-able against Figma?
