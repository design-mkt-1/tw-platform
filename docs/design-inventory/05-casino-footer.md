# Top-Win — casino-footer inventory

File key `s2CqwGqe0O0FcALhBNlTRe`. Area assigned: node **1:5417** on frame **1:3289**, 390 × 1438.7.

Measured with `get_metadata` (1:5417), `get_design_context` (1:5608, 1:5936, 1:5968, 1:5697, 1:5935, 1:5607),
`get_variable_defs` (1:5607), `get_screenshot` (1:5607, rendered 359 × 1024 from 390 × 1115).

---

## 0. Scope correction — 1:5417 is NOT only the footer

`1:5417` (`Frame 2135557710`, 390 × 1438.7) has **two** children:

| id | name | x | y | w | h |
| --- | --- | --- | --- | --- | --- |
| `1:5418` | `new-games-section` | 0 | 16 | 390 | 284 |
| `1:5607` | `footer-mobile` | 0 | 324 | 390 | **1114.7** |

The footer proper is `1:5607`. `1:5418` is a tournament/"Колесо" card section that sits above it and belongs to
another area's inventory. It is summarised in §7 for completeness but not measured in depth.

Vertical arithmetic for 1:5417: 16 + 284 = 300, gap 24, footer at 324, 324 + 1114.7 = 1438.7. ✔

---

## 1. `footer-mobile` — root container (1:5607)

```
bg            #000D3B
border-top    1px solid #1E2A44   (top edge only)
display       flex column, align-items: center
gap           32
padding       54px top / 8px left / 8px right / 44px bottom
width         390   → content box 374
height        1114.7
```

Vertical stack, all values measured, all gaps are the single 32px flex gap:

| # | node | name | y (in footer) | h | note |
| --- | --- | --- | --- | --- | --- |
| 1 | `1:5608` | `mobile-payment-logos` | 54 | 330 | card, full 374 wide |
| 2 | `1:5697` | `mobile-partners` | 416 | 182 | **375 wide** — 1px wider than the content box, x = 7.5 |
| 3 | `1:5935` | `Divider` | 630 | 0 | dashed line, 374 wide |
| 4 | `1:5936` | `Frame 2135557695` | 662 | 288 | the two link columns |
| 5 | `1:5967` | `Divider` | 982 | 0 | dashed line, 374 wide |
| 6 | `1:5968` | `Container` | 1014 | 56.7 | language selector |

54 + 330 + 32 + 182 + 32 + 0 + 32 + 288 + 32 + 0 + 32 + 56.7 + 44 = 1114.7 ✔

**There is nothing else in the footer.** See §6 (legal / age-rating) — this is load-bearing.

---

## 2. Block 1 — payment logos (`1:5608`, `mobile-payment-logos`)

Card:

```
bg            rgba(11,16,32,0.15)
border        1px solid rgba(255,255,255,0.06)
radius        16
padding       24px top/bottom, 20px left/right
layout        flex column, align-items: flex-start, gap 16
size          374 × 330   (content 334 wide)
```

### 2.1 Heading (`1:5609` wrapper → `1:5610` text)

Wrapper: flex row, `justify-content: center`, full width, height 22.

| property | value |
| --- | --- |
| copy | `Безпечні способи оплати` |
| rendered | `БЕЗПЕЧНІ СПОСОБИ ОПЛАТИ` (textCase: uppercase) |
| font | Roboto Flex, Bold (700) |
| size / line-height | 18 / 22 |
| colour | `#E6EDF5` |
| align | center |
| fontVariationSettings | `"GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100` |

### 2.2 Grid (`1:5611`, `logos-wrap-grid`)

```
layout   flex-wrap, gap 12 (both axes), align-items: center, justify-content: center, align-content: center
width    334 (full)
height   244
```

Not a CSS grid — a wrapping flex row. 160 + 12 + 160 = 332 ≤ 334, so **exactly 2 tiles per row**;
the 7th tile wraps alone and centres (x = 87). Row pitch 64 (52 tile + 12 gap): rows at y 0 / 64 / 128 / 192.

Tile (identical for all 7):

```
w × h        160 × 52
bg           rgba(11,16,32,0.1)
border       1px solid rgba(255,255,255,0.08)
radius       10
padding      8px vertical, 16px horizontal
layout       flex column, items-center, justify-center
```

| # | node | Figma name | inner leaf box | leaf x,y in tile | what it shows (from screenshot) |
| --- | --- | --- | --- | --- | --- |
| 1 | `1:5612` → `1:5613` | `Img - cascading_gbp_a:margin` | 110 × 32 | 25, 10 | VISA + Mastercard side by side |
| 2 | `1:5622` → `1:5623` | `Img - gateway_crypto:margin` | 89 × 32 | 35.5, 10 | word `Cryptocurrencies` over a strip of 6 coin icons |
| 3 | `1:5664` → `1:5665` | `Img - gatewaycrypto_bch:margin` | 110 × 32 | 25, 10 | green Bitcoin-Cash coin |
| 4 | `1:5668` → `1:5669` | `Img - gatewaycrypto_btc:margin` | 110 × 32 | 25, 10 | orange Bitcoin coin |
| 5 | `1:5672` → `1:5673` | `Img - gatewaycrypto_eth:margin` | **32 × 32** | 64, 10 | blue Ethereum coin |
| 6 | `1:5685` → `1:5686` | `Img - gatewaycrypto_usdt:margin` | 110 × 32 | 25, 10 | green Tether coin |
| 7 | `1:5689` → `1:5690` | `Img - mock:margin` | **120 × 30** | 20, 11 | `VISA × mastercard` lockup |

Tile 5 is the only square leaf; tile 7 is the only 30-high leaf. Do not apply one global asset size.

Tile 2 (`Cryptocurrencies`) is the one piece of literal Latin copy in the block. It is baked into the
exported vectors, not a text node — there is no editable text layer for it.

---

## 3. Block 2 — partners (`1:5697`, `mobile-partners`)

```
layout   flex column, align-items: center, gap 24
padding  0 8px
size     375 × 182     ← 375, inside a 374 content box; x = 7.5
```

### 3.1 Heading (`1:5698`)

Layer name is `Heading 2 → Our Partners`; the actual text content is Ukrainian.

| property | value |
| --- | --- |
| copy | `Наші партнери` |
| rendered | `НАШІ ПАРТНЕРИ` (textCase: uppercase) |
| font | Roboto Flex Bold (700), 18 / 22 |
| colour | `#E6EDF5` |
| align | center, width 148, height 22 |
| fontVariationSettings | same 10-axis string as §2.1 |

Identical type recipe to the payment heading → one shared heading component.

### 3.2 Partners container (`1:5699`)

```
layout   flex-wrap, gap 16, align-items: center, justify-content: center, align-content: center
size     359 × 136
```

7 partner logos. Row pitch 48 (32 + 16); rows at y 0 / 48 / 96.

| # | link node | name | link box | inner asset frame | x, y in container | wordmark seen in screenshot |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `1:5700` | `Link - Casinostest` | 110 × 30 | `casinostest.svg` 110 × 55, centred, overflow clipped | 8.5, 1 | `CASINOSTEST.ORG` |
| 2 | `1:5731` | `Link - GamblersBet` | 100 × 32 | `gamblersbet.svg` 100 × 32 | 134.5, 0 | `GamblersBet` |
| 3 | `1:5756` | `Link - Casino Bonus Now` | 100 × 32 | `cbn.svg` 100 × 50, centred, clipped | 250.5, 0 | `CASINO BONUSES NOW` |
| 4 | `1:5884` | `Link - No Deposit` | 100 × 32 | `nodeposit.svg` 100 × 24 | 13.5, 48 | `no deposit` |
| 5 | `1:5896` | `Link - Casino Bonus Club` | 100 × 32 | `cbc.svg` 100 × 28 | 129.5, 48 | `Casino Bonus Club` |
| 6 | `1:5932` | `Link - Zamsino` | 100 × 32 | raster fill, 121.33% width, offset −10.66% | 245.5, 48 | `ZAMSINO / APPROVED CASINO` |
| 7 | `1:5934` | `Link - Partner 7` | **90 × 40** | raster fill, 113.83% w / 261.1% h, top −77.78% | 134.5, 96 | `Deutschland ★ casinos ★` |

Rows 1 and 2 hold 3 logos each; row 3 holds the single 90 × 40 logo, centred.
Logos 1–5 are vector (SVG); 6 and 7 are PNG. 6 and 7 are also the two whose exported bitmap is larger
than the visible box and is cropped by the frame — preserve the crop, do not letterbox.

No partner has a visible caption, badge or `rel` hint in the design.

---

## 4. Dividers (`1:5935`, `1:5967`)

Both are the same vector, exported identically:

```
width         374 (full content width)
height        0   (rendered as a 1px path, inset −0.5px)
stroke        #1E2A44
stroke-dasharray  4 4
```

Measured directly from the exported SVG body:
`<path d="M0 0.5H374" stroke="#1E2A44" stroke-dasharray="4 4"/>`

This is reproducible in CSS as `border-top: 1px dashed #1E2A44` — it does not need to ship as an asset.

---

## 5. Block 3 — link columns (`1:5936`, `Frame 2135557695`)

```
layout   flex row, align-items: center, justify-content: center, gap 32
padding  0 10px
size     374 × 288
```

158 + 32 + 141 = 331, centred in the 354 inner width → left column starts at x 21.5, right at 211.5.

Both columns: `flex column, align-items: flex-start, gap 8`. Heading (16 high) then a list with **no gap**
between rows — each row is a fixed-height 44 hit area.

Row style, identical in both columns: `flex row, align-items: center, height 44, border-radius 6, width 100%`.
The 6px radius on a row with no background is a resting-state artefact — it implies a hover/pressed
background fill that is **not present in this frame**.

### 5.1 Left column (`1:5937`) — heading `1:5938`

| property | value |
| --- | --- |
| copy | `НАВІГАЦІЯ` (already uppercase in the source string) |
| style token | `Footnote_e` — Roboto Bold 700, 14 / 16, letter-spacing 0 |
| colour | `#AFC1E8` |
| width | 72 |

Items (`1:5939`), each Roboto **Medium 500, 14 / 16, `#AFC1E8`** — style token `Footnote_m`:

| # | node | y | text width | literal copy |
| --- | --- | --- | --- | --- |
| 1 | `1:5941` | 0 | 55 | `Платежі` |
| 2 | `1:5943` | 44 | 82 | `Провайдери` |
| 3 | `1:5945` | 88 | 145 | `Support@jack-pot.com` |
| 4 | `1:5947` | 132 | 121 | `Відповідальна гра` |
| 5 | `1:5949` | 176 | 111 | `Запросити друга` |
| 6 | `1:5951` | 220 | 116 | `Спортивні ставки` |

Item 3 is an e-mail address, capital `S`, domain `jack-pot.com` — note it does **not** say top-win.

### 5.2 Right column (`1:5952`) — heading `1:5953`

| property | value |
| --- | --- |
| copy | `ПОЛІТИКИ Й ПРАВО` (uppercase in source) |
| style token | `Footnote_e` — Roboto Bold 700, 14 / 16 |
| colour | `#AFC1E8` |
| width | 134 |

Items (`1:5954`), each Roboto **Regular 400, 13 / 16, `#AFC1E8`** — style token `Capation1` (sic, Figma's spelling):

| # | node | y | literal copy | note |
| --- | --- | --- | --- | --- |
| 1 | `1:5956` | 0 | `Умови використання` | **`text-transform: capitalize`** → renders `Умови Використання`. The screenshot confirms the capital `В`. |
| 2 | `1:5958` | 44 | `Політика конфіденційності` | fixed width 141, wraps to **2 lines**, text block height 32, y-offset 6 inside the 44 row |
| 3 | `1:5960` | 88 | `Бонусна політика` | |
| 4 | `1:5962` | 132 | `Політика AML` | Latin `AML` inside Cyrillic |
| 5 | `1:5964` | 176 | `Політика KYC` | Latin `KYC` |
| 6 | `1:5966` | 220 | `Платіжна політика` | |

Only item 1 carries the `capitalize` transform. The other five do not. That asymmetry is in the source.

Font size differs between the columns: navigation 14 Medium, policies 13 Regular. Not a mistake to normalise away.

---

## 6. Legal / licence / age rating — MEASURED ABSENCE

Searched the complete `1:5417` subtree returned by `get_metadata` and the complete code for `1:5607`.

**There is no licence badge, no licence text, no regulator logo, no 18+/21+ age rating, no
responsible-gambling logo (GamCare / BeGambleAware / GAMSTOP), no company/registration line and no
copyright line anywhere in this footer.** No hidden nodes of that kind either — the only `hidden="true"`
nodes in 1:5417 are the category icons inside `1:5418` (§7) and decorative shapes in the tournament art.

The only responsible-gambling reference is the *link text* `Відповідальна гра` (§5.1 item 4).

Per the brief: **do not invent any of these.** If the build needs them, they must come from the owner.
Recorded as an UNKNOWN below.

Likewise there are **no social icons** in the footer (no Telegram/Instagram/Facebook/X). The only icon
row at the bottom is the language selector (§6.1).

### 6.1 Block 4 — language selector (`1:5968`, `Container`)

```
layout   flex-wrap, align-items: center, justify-content: center, align-content: center, row-gap 8
padding  10px top, 15px bottom
size     374 × 56.7
```

Inner group `1:5969`: `flex row, gap 8, align-items: center`, 112.6 × 31.7, x 130.7 / y 10.

Three flag pills, each 32.2 × 31.7 outer, at x 0 / 40.2 / 80.4 inside the group (pitch 40.2 = 32.2 + 8).

Pill anatomy (outer → inner): `Container` (radius 15.98, padding 1.5px h / 1.25px v)
→ `Border` (29.2 × 29.2, radius 100, padding 0.606, overflow clip)
→ `en` (27.99 × 27.99, overflow clip)
→ flag image.

| # | nodes | state | ring | inner radius | flag leaf | flag shown |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `1:5970` `Link` → `1:5971` … `1:5974` `Flag_of_Ukraine 1` | **ACTIVE / selected** | `linear-gradient(118.99639858552104deg, rgb(30,64,175) 5.5841%, rgb(59,130,246) 99.924%)` on the Container, plus `1px solid #1E2A44` on the Border | Border `100px`, `en` frame has **no** radius | 27 × 27 | Ukraine (blue/yellow) |
| 2 | `1:5977` **`Background`** → `1:5978` … `1:5980` `image` | inactive | none | Border `100px`, `en` `10000px` | 27.99 × 27.99 | Union Jack |
| 3 | `1:5986` `Link` → `1:5987` … `1:5990` `image` | inactive | none | Border `100px`, `en` `10000px` | 27.99 × 27.99 | white/blue/red tricolour |

This is a clear **selected vs unselected variant**: the gradient ring + `#1E2A44` border marks the current
language, and the active flag leaf is 27 (not 27.99) with a squarer inner frame. Nodes 2 and 3 are
byte-for-byte the same recipe apart from the image.

The `en` layer name is used for all three — it is boilerplate, not a locale code. Node 2 is named
`Background`, not `Link`, unlike 1 and 3.

Hit area is 32.2 × 31.7 — **below the 44 px minimum** the link rows in §5 respect. Flagging, not fixing.

---

## 7. `new-games-section` (`1:5418`) — out of scope, recorded for the seam

Not measured in depth; another area owns it. Structure only, so the boundary is clean:

- `1:5419` `section-header` (358 × 24) at x 16 — an icon + title pair `1:5420` where **13 of the 14 icon
  frames are `hidden="true"`**; the visible one is `1:5567` `wheel-fortune_18604065 2` (20 × 20).
  Title text `1:5569` = `Колесо`. `1:5570` is a 260-wide rule to the right of the title.
  The hidden siblings are named `activity_8138338 1`, `new 1`, `Recomended`, `crash games`,
  `Must-play slots`, `Bonus buy`, `megaways`, `jackpots`, `Drops&wins`, `wheel-fortune_18604065 1`,
  `current tournaments`, `Lottery`, `instant games`, `egypt` — a **single header component with 14 icon
  variants**, only one shown per instance.
- `1:5571` `tournament-card` (358 × 220) with artwork, three info pills and a CTA:
  pill copy pairs — `Ваші квитки` / `1`, `Переможці` / `20`, `Крутити` / `20 GBP`
  (note: the pill *frames* are named `Winners Pill` / `1 Ticket Pill` / `1 Ticket Pill`, which does not match
  the text order — the labels are what count). `1:5604` `tournament-title` is an empty-looking 318 × 36 text
  node; `1:5605` is a `Button` instance, 200 × 34, at x 59 y 48.

---

## 8. Token roll-up (exact values only)

### Colour
| value | where |
| --- | --- |
| `#000D3B` | footer background |
| `#1E2A44` | footer top border; both dashed dividers; active flag pill border |
| `rgba(11,16,32,0.15)` | payment card background |
| `rgba(255,255,255,0.06)` | payment card border |
| `rgba(11,16,32,0.1)` | payment tile background |
| `rgba(255,255,255,0.08)` | payment tile border |
| `#E6EDF5` | both section headings |
| `#AFC1E8` | every link column heading and every link |
| `rgb(30,64,175)` → `rgb(59,130,246)` | active-flag gradient, 118.99639858552104deg, stops 5.5841% / 99.924% |

### Type
| token | family | style | size | line-height | letter-spacing | used by |
| --- | --- | --- | --- | --- | --- | --- |
| (unnamed) | Roboto Flex | Bold 700 | 18 | 22 | — | `1:5610`, `1:5698` — uppercase, centred, `#E6EDF5` |
| `Footnote_e` | Roboto | Bold 700 | 14 | 16 | 0 | column headings `1:5938`, `1:5953` |
| `Footnote_m` | Roboto | Medium 500 | 14 | 16 | 0 | navigation links |
| `Capation1` | Roboto | Regular 400 | 13 | 16 | 0 | policy links |

`get_variable_defs` on `1:5607` returns **only** those three text styles — no colour, spacing or radius
variables are bound anywhere in this footer. Every colour above is a raw hex/rgba in the file.

The two 18/22 headings use Roboto **Flex** with an explicit 10-axis `fontVariationSettings`; the four
column/link styles use plain **Roboto** with only `"wdth" 100`. Two different families, not one.

### Radius
`16` payment card · `10` payment tile · `6` link rows (no fill) · `15.98` flag pill outer ·
`100` flag Border · `10000` inactive flag `en` frame · active flag `en` frame has none.

### Spacing
Footer gap `32`; footer padding `54 / 8 / 44 / 8`; payment card padding `24 / 20`, gap `16`,
grid gap `12`; tile padding `8 / 16`; partners gap `24`, grid gap `16`, padding `0 8`;
link block gap `32`, padding `0 10`, column gap `8`, row height `44`;
language container padding `10` top `15` bottom, row-gap `8`, pill gap `8`.

### Shadow
**None.** No `box-shadow` / effect appears on any node in `1:5607`.

---

## 9. Asset list (node id → download URL). NOT downloaded, except the divider SVG (read for its stroke).

URLs are the ones returned by `get_design_context` on `1:5607`. Figma asset URLs expire in ~7 days.
49 raw exported files; **17 distinct logical assets** once the multi-vector lockups are treated as one
image each (7 payment marks + 7 partner logos + 3 flags). The divider is CSS, not an asset.

### 9.1 Payment tile 1 — VISA + Mastercard (`1:5613`)
| node | role | url |
| --- | --- | --- |
| `1:5617` | mask | https://www.figma.com/api/mcp/asset/0a7c2439-b780-4485-8a39-292ad12bfa99.svg |
| `1:5617` | image | https://www.figma.com/api/mcp/asset/7e0ef3db-3b96-4d1e-b5c7-ed0375757001.svg |
| `1:5621` | vector | https://www.figma.com/api/mcp/asset/807eec78-8ffd-4109-b356-38b9d798cc4b.svg |

### 9.2 Payment tile 2 — `Cryptocurrencies` strip (`1:5623`) — 26 files
| node | url |
| --- | --- |
| `1:5624` | https://www.figma.com/api/mcp/asset/2bf7a3d6-afbd-4264-b3e0-d53dcd79b98c.svg |
| `1:5625` | https://www.figma.com/api/mcp/asset/ca5f5a2c-14d8-40b5-9504-49588f8581c7.svg |
| `1:5626` | https://www.figma.com/api/mcp/asset/68f6c4dc-1513-487c-88e4-fa070573c77b.svg |
| `1:5627` | https://www.figma.com/api/mcp/asset/14a382a1-0aa0-4448-9816-875211f6cb12.svg |
| `1:5628` | https://www.figma.com/api/mcp/asset/75d330ac-3055-4e79-b886-6d1939c3ed11.svg |
| `1:5629` | https://www.figma.com/api/mcp/asset/6b1bd883-cf45-4c00-aaa0-88dc44b314a3.svg |
| `1:5630` | https://www.figma.com/api/mcp/asset/538486c7-5d81-43c1-a5c7-13469b31c372.svg |
| `1:5631` | https://www.figma.com/api/mcp/asset/4a6f3da6-c3f2-4e6b-993d-66767880f924.svg |
| `1:5632` | https://www.figma.com/api/mcp/asset/7b863dab-6b47-423a-8f41-d35375d7093a.svg |
| `1:5633` | https://www.figma.com/api/mcp/asset/69e0c3fc-3575-4428-acf7-97c9c96380c6.svg |
| `1:5634` | https://www.figma.com/api/mcp/asset/5d2a4e5f-bd9d-4d8c-947d-42f960ef637d.svg |
| `1:5635` | https://www.figma.com/api/mcp/asset/d313455e-4718-4a40-9681-78d93df64e0a.svg |
| `1:5636` | https://www.figma.com/api/mcp/asset/abd6f9fa-c728-4afa-8117-08282649751b.svg |
| `1:5637` | https://www.figma.com/api/mcp/asset/1a173c4f-65f9-4e57-b273-afffbabae623.svg |
| `1:5638` | https://www.figma.com/api/mcp/asset/b4bbfafe-0d58-4f61-8758-9c07822686d8.svg |
| `1:5639` | https://www.figma.com/api/mcp/asset/c3548488-1c23-487c-9c3f-222001a8ce3a.svg |
| `1:5640` | https://www.figma.com/api/mcp/asset/0084346a-af80-4d1f-b816-976cd2f52743.svg |
| `1:5641` | https://www.figma.com/api/mcp/asset/0283966f-742b-405b-9785-422e77c0eb93.svg |
| `1:5645` mask | https://www.figma.com/api/mcp/asset/32b56331-7684-4a75-a5fb-10e7a43188ee.svg |
| `1:5645` img | https://www.figma.com/api/mcp/asset/3d10689f-e3ef-4064-9f1f-b48f09c661fb.svg |
| `1:5653` | https://www.figma.com/api/mcp/asset/79085d6d-f262-4f95-ad1f-59afbe671b01.svg |
| `1:5654` | https://www.figma.com/api/mcp/asset/7378e68c-5340-4533-88e0-ceed1cfba011.svg |
| `1:5658` mask | https://www.figma.com/api/mcp/asset/d49a8796-df94-444f-b5b3-d0a6fa4d6ca3.svg |
| `1:5658` img | https://www.figma.com/api/mcp/asset/08cc8630-b68c-425c-8106-3d251440e252.svg |
| `1:5662` | https://www.figma.com/api/mcp/asset/7fd5ca2f-0717-4870-bf86-5e8e93b254ff.svg |
| `1:5663` | https://www.figma.com/api/mcp/asset/26a973ae-dc17-4c79-aac5-c637b1a958e8.svg |

This tile is 26 separate exports for one logo strip. It must be flattened to a single SVG before it ships.

### 9.3 Payment tiles 3–7
| node | asset | url |
| --- | --- | --- |
| `1:5665` | BCH, 110×32 | https://www.figma.com/api/mcp/asset/08bc19e3-dc3e-45b5-a098-17f33763291d.svg |
| `1:5669` | BTC, 110×32 | https://www.figma.com/api/mcp/asset/2a6db70a-058c-4c12-80eb-6e0c69356ac8.svg |
| `1:5677` | ETH mask, 32×32 | https://www.figma.com/api/mcp/asset/0767a1a3-834f-4639-9508-d18e8120b57c.svg |
| `1:5677` | ETH image, 32×32 | https://www.figma.com/api/mcp/asset/2a422e19-abcb-48c5-a97d-3455e650f3a7.svg |
| `1:5686` | USDT, 110×32 | https://www.figma.com/api/mcp/asset/4cd91c99-63a8-4dde-8968-0ebab478324a.svg |
| `1:5690` | VISA × mastercard, 120×30 | https://www.figma.com/api/mcp/asset/68169adb-67f4-467d-86b6-fc8a78875d47.svg |

### 9.4 Partner logos
| node | asset | url |
| --- | --- | --- |
| `1:5703` | casinostest.svg | https://www.figma.com/api/mcp/asset/4e211221-87bc-468f-ab71-30776bc017d7.svg |
| `1:5737` | gamblersbet mask | https://www.figma.com/api/mcp/asset/840f5924-eca4-431c-9990-ac273c289922.svg |
| `1:5737` | gamblersbet image | https://www.figma.com/api/mcp/asset/cea7be93-d230-4394-af90-70342a14b1ce.svg |
| `1:5762` | cbn mask | https://www.figma.com/api/mcp/asset/bcca9455-6bad-4ab9-9217-d63f9e660c06.svg |
| `1:5762` | cbn image | https://www.figma.com/api/mcp/asset/48db1e17-bfde-49db-a66c-b5a7f118ac0b.svg |
| `1:5887` | nodeposit.svg | https://www.figma.com/api/mcp/asset/850efe26-95d8-45a7-a101-894bfab38273.svg |
| `1:5902` | cbc mask | https://www.figma.com/api/mcp/asset/952d2614-aa2d-446b-9d67-fabd20159721.svg |
| `1:5902` | cbc image | https://www.figma.com/api/mcp/asset/d4600351-ee0b-4dc6-908e-e21635cf2d2f.svg |
| `1:5933` | Zamsino **PNG** | https://www.figma.com/api/mcp/asset/193cfe98-55fd-4453-a160-93d58150a759.png |
| `1:5934` | Partner 7 (Deutschland Casinos) **PNG** | https://www.figma.com/api/mcp/asset/60490f95-bff8-4ec9-b61c-50790b743827.png |

### 9.5 Divider and flags
| node | asset | url |
| --- | --- | --- |
| `1:5935` / `1:5967` | dashed divider (same file both times) | https://www.figma.com/api/mcp/asset/9afeefb8-fb87-4af5-81b1-f998d82e6f7b.svg |
| `1:5974` | Flag_of_Ukraine 1 | https://www.figma.com/api/mcp/asset/e962f015-1387-45d2-874a-469ddef0902b.svg |
| `1:5980` | flag 2 (Union Jack) | https://www.figma.com/api/mcp/asset/835c5d64-3710-47cb-952c-a755c31c6dd5.svg |
| `1:5990` | flag 3 (tricolour) | https://www.figma.com/api/mcp/asset/90ee6d9b-eac1-4328-962b-c94f8d13fcff.svg |

Note: the same nodes were exported twice under different URLs (once from the `1:5608`/`1:5697`/`1:5968`
calls, once from the `1:5607` call). Both sets are valid; the `1:5607` set above is the one to use.

Reference render saved to
`C:/Users/grosu.b/AppData/Local/Temp/claude/C--Users-grosu-b-orca-workspaces-tw-platform-main/6a9908ae-4f67-4540-9f9b-8b60b065241a/scratchpad/topwin-inventory/footer.png`
(359 × 1024, downscaled from 390 × 1115).

---

## 10. Interaction / state surface

| # | element | evidence | state implied |
| --- | --- | --- | --- |
| 1 | Language flag pills `1:5970` / `1:5977` / `1:5986` | pill 1 alone has the blue gradient ring + `#1E2A44` border and a 27px (not 27.99px) flag leaf | **selected / unselected variant**, exactly one selected |
| 2 | 12 footer links (`1:5940`–`1:5950`, `1:5955`–`1:5965`) | each row is `height 44` + `border-radius 6` with **no** fill | radius-on-nothing is a resting state; a hover/pressed fill exists in intent but is not drawn in this file |
| 3 | 7 partner logos | frames named `Link - …` | anchors, external; no visited/hover style drawn |
| 4 | `Support@jack-pot.com` | it is a mail address in a link row | `mailto:` |
| 5 | Payment grid `1:5611`, partners grid `1:5699` | both are `flex-wrap`, not fixed grids or scroll rows | reflow on width change; **no horizontal scroll anywhere in this footer** |
| 6 | Payment tile 7 / partner logo 7 | odd counts in 2-up and 3-up wraps | last item centres on its own row — a real layout state to preserve |

Nothing in the footer is a tab, toggle, accordion or drawer. The only genuine state machine is the
language selector.

---

## 11. UNKNOWN — questions for the owner, not to be guessed

1. **Licence, regulator and age rating.** The footer contains no licence number, no regulator logo,
   no 18+ mark and no responsible-gambling badge. On a gambling site these are usually mandatory.
   Is the Figma incomplete, or is the demo deliberately shipping without them — and if they are needed,
   what is the exact licence text, licensing body and age mark? Nothing here may be invented.
2. **Copyright / company line.** No `© …` line and no operating-company name anywhere. Intended?
3. **Which three languages?** All three flag layers are named `en`. Ukraine is visually certain
   (`Flag_of_Ukraine 1`); flags 2 and 3 read as a Union Jack and a white/blue/red tricolour in the
   screenshot but have no locale metadata. Are they `uk` / `en` / `ru`, and what are the URL locales?
4. **`Умови використання` renders as `Умови Використання`** because only that one policy link carries
   `text-transform: capitalize`. The other five do not. Is the capitalisation wanted, or is it a leftover?
5. **`Support@jack-pot.com`** — capital `S`, and the domain is `jack-pot.com`, not a Top-Win domain.
   Is this the real support address for this build?
6. **Where do the 12 links point?** No URLs, no route names, no annotations in the file.
7. **Hover / focus / pressed styling** for the link rows, partner logos and flag pills is not drawn.
   The 6px row radius says a fill is expected — which colour?
8. **Zamsino (`1:5932`) and Partner 7 (`1:5934`) are PNG** while the other five partners are SVG, and both
   PNGs are scaled past their box (121.33% wide, and 261.1% tall with a −77.78% top offset) and cropped.
   Is the crop intentional, or should the artwork be re-exported to fit?
9. **`mobile-partners` is 375 wide inside a 374 content box** and sits at x 7.5. 1px overflow / half-pixel
   position — collapse to 374 at x 8, or is the 375 deliberate?
10. **Flag pill hit area is 32.2 × 31.7**, below the 44px the link rows use. Should it be enlarged for a11y?
11. **Middle flag `1:5977` is named `Background`, not `Link`,** unlike the other two. Is the middle language
    non-clickable, or is this a naming slip?
12. **Payment tile 2 is 26 separate vector exports** for one `Cryptocurrencies` strip, and the word
    `Cryptocurrencies` is outlined, not live text. Is there a clean source SVG, and does that word need
    to be translatable?
13. **Was a licence/social/copyright row ever designed on the desktop frame?** This inventory covers only
    the mobile footer `1:5607`; if a desktop footer carries the legal block, that is where it should be
    read from rather than invented here.
