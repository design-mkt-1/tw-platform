# Top-Win — Menus (three jackpot-menu panels)

File key: `s2CqwGqe0O0FcALhBNlTRe`
Nodes: `1:6641`, `1:6816`, `1:7015`

## How this was measured — read this before trusting a number

Two sources, and they are not equally strong:

1. **`get_metadata`** on all three frames — complete subtree, ids, names, x/y/w/h. This is exact
   Figma geometry. Every coordinate and size below with a node id next to it comes from here.
2. **Pixel measurement of the Figma PNG render** of `1:6641` and `1:6816`
   (`get_screenshot`, 390x764 and 390x847, 1:1 — no scaling). Every hex, every rendered y-extent,
   every radius estimate below comes from decoding those PNGs and reading pixels
   (`scratchpad/topwin-inventory/pick.mjs`, `crop.mjs`).

**`get_design_context` never ran.** The Figma MCP account hit its tool-call limit
(`You've reached the Figma MCP tool call limit for your Full seat on the Professional plan`)
on the first `get_design_context` call and on every call after it, including `get_screenshot`
for `1:7015`. So: **no asset download URLs, no font family/size/weight, no declared
cornerRadius, no declared shadow values, no text-transform flags.** Those are listed under
UNKNOWN with the exact question. Colours are still exact — a flat fill in a 1:1 PNG is the fill.

---

## 1. What actually distinguishes the three variants

The names are useless (`jackpot-menu postlog`, `jackpot-menu postlog VIP`,
`jackpot-menu postlog ` with a trailing space). The difference is structural and measured:

| | `1:6641` | `1:6816` "VIP" | `1:7015` (trailing space) |
| --- | --- | --- | --- |
| Frame | 390 x 764 | 390 x 847 | 390 x 847 |
| `sidebar-panel` | `1:6642` 390 x **656** | `1:6817` 390 x **742** | `1:7016` 390 x **742** |
| Band under header | `1:6649` **62** tall — two auth buttons | `1:6824` **148** tall — identity block | `1:7023` **148** tall — identity block |
| Identity block | **absent** | present, **with** `vip-badge` `1:6832` | present, **without** vip-badge |
| `profile-info` | — | `1:6830` at (60,**4**) 173x**44** (badge + name) | `1:7029` at (60,**17.5**) 173x**17** (name only) |
| Menu body | `1:6655` y=122, 390x534 | `1:6854` y=208, 390x534 | `1:7049` y=208, 390x534 |
| navbar instance | `1:6815` at y=**653** | `1:7014` at y=**736** | `1:7209` at y=**736** |

So, in plain terms:

- **`1:6641` is the logged-OUT panel** despite "postlog" in its name. It has no avatar, no ID, no
  balance, no VIP badge — it has **Увійти / Реєстарція**. The label lies; the content is pre-login.
- **`1:6816` is logged-in VIP** — the orange `★VIP` pill sits above the username.
- **`1:7015` is logged-in non-VIP** — byte-identical to `1:6816` except `profile-info` has one
  child instead of two, and the username is re-centred vertically (y 17.5, h 17) to fill the same
  52px `profile-section`.

Everything from the menu body down (the 8 rows, the Terms/Language row, the Support/Vip Manager
row) is **identical in all three**: same child names, same offsets, same sizes, same order.

The 83px frame delta (764 → 847) is not the same as the 86px panel delta (656 → 742), because the
navbar overlaps the panel by 3px in `1:6641` and by 6px in the other two. See §6.

**There is no balance figure anywhere in any of the three panels.** The only account data shown is
avatar, optional VIP pill, username, and numeric ID. Deposit is a button, not a number.

---

## 2. Layout — `1:6641` (logged-out), absolute y in the 390x764 frame

| Region | Node | Box | Fill (measured) |
| --- | --- | --- | --- |
| `sidebar-panel` | `1:6642` | 0,0 390x656 | see bands |
| `Header (POST-login)` | `1:6643` | y 0..60, 390x60 | `#FFFFFF` |
| ├ `Logo TopWin` (instance) | `1:6645` | 16,20 111x20 | asset |
| └ `btn-close` | `1:6646` | 334,10 40x40 | circle `#EFF6FF`, glyph `#3B82F6` |
| &nbsp;&nbsp;└ `x` | `1:6647` | +13,+13 14x14 | |
| Auth band `Frame 2135557614` | `1:6649` | y 60..122, 390x62 | `#FFFFFF` |
| └ `btns` | `1:6650` | 16,72 358x38 | |
| &nbsp;&nbsp;├ `btn` (login) | `1:6651` | abs 16,72 175x38 | `#EDF5FF` |
| &nbsp;&nbsp;└ `btn` (register) | `1:6653` | abs 199,72 175x38 | gradient, see §3 |
| Menu body `Frame 2135557615` | `1:6655` | y 122..656, 390x534 | `#F4F6FA` |
| └ `menu` | `1:6656` | abs 16,132 358x514 | |
| navbar (instance) | `1:6815` | 0,653 390x111 | see §6 |

Auth buttons: 175 + **8px gap** + 175 = 358. Both 38 tall. Band padding: 16 left/right, 12 top,
12 bottom.

### Menu rows — measured pixel extents, `1:6641` (identical in all three)

Column scan at x=300 of the render. Row fill `#E8F1FC`, panel behind `#F4F6FA`.

| # | Label (rendered) | Row node (6641 / 6816 / 7015) | slot y (abs) | painted y | painted h | pitch to next | chevron |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | SPORT | `1:6658` / `1:6857` / `1:7052` | 132 | 132..177 | **46** | 52 | yes `1:6667` |
| 2 | CASINO | `1:6669` / `1:6868` / `1:7063` | 184 | 184..227 | 44 | 52 | yes `1:6706` |
| 3 | REFERRAL PROGRAM | `1:6709`→`1:6710` / `1:6909` / `1:7104` | 236 | 236..279 | 44 | 50 | no |
| 4 | MY BONUSES | `1:6716` / `1:6915` / `1:7110` | 286 | 286..329 | 44 | 50 | no |
| 5 | PROMOTIONS | `1:6721` / `1:6920` / `1:7115` | 336 | 336..379 | 44 | 50 | no |
| 6 | CASHBACK | `1:6737` / `1:6936` / `1:7131` | 386 | 386..429 | 44 | 50 | no |
| 7 | PAYMENTS | `1:6742` / `1:6941` / `1:7136` | 436 | 436..481 | **46** | 50 | yes `1:6749` |
| 8 | PROFILE | `1:6751` / `1:6950` / `1:7145` | 486 | 486..529 | 44 | — | no |

Gaps between painted rows: 6, 8, 6, 6, 6, 6, 4 (px, top to bottom). They are not designed gaps —
they are what is left over after 44/46-tall rows are placed on a 52/52/50/50/50/50/50 pitch.

In `1:6816`/`1:7015` add **+76** to every absolute y in this table (menu body starts at 208, not
122; row 1 painted 208+... — verified against the `1:6816` render: ID band ends 171, panel grey
starts 208, first row fill starts 208+... measured `#E8F1FC` band at 132..171 is the ID field, and
the grey menu body begins exactly at y=208).

Row internals (all rows, from metadata):

- Row container width 358, x 16..374.
- Icon 15x15 at row-relative (12, 12) or (12, 13) — i.e. **12px left padding**, icon vertically
  centred in the 20px text line box.
- Label text box starts at row-relative x **25** from the icon frame origin, i.e. **icon 15 + 10px
  gap**, text box height 20.
- Chevron `weui:arrow-filled` 24x24 at row-relative x **346** → 346+24 = 370, 4px short of the 374
  right edge. Painted glyph is much smaller than its 24x24 box: measured ink around x 347..361,
  y ~148..160.
- Rows 1, 2 and 7 have an extra 46px-tall wrapper (`Frame 16154` / `Frame 16141`) inside a 44px
  slot. Rows 1 and 7 paint 46; row 2 paints 44 with the same nesting. Unexplained — see UNKNOWN.

### Footer of the panel (identical in all three)

| Element | Node (6641) | Abs box | Notes |
| --- | --- | --- | --- |
| `Frame 2135557532` (links row) | `1:6760` | 16,530 358x46 | no fill (panel `#F4F6FA` shows) |
| ├ doc icon `solar:document-linear` | `1:6763` | 48,542 22x22 | |
| ├ text "TERMS OF USE" | `1:6767` | 80,543 90x20 | `#102A67` |
| ├ flag `lang` / `Group 277133701` | `1:6769` / `1:6770` | 237,541 24x24 | UK flag, full colour |
| └ text "ENGLISH" | `1:6782` | 271,543 54x20 | `#102A67` |
| `Frame 16148` (contact row) | `1:6783` | 16,576 358x70 | |
| ├ Support button | `1:6784` | 23,592 168x38 | fill transparent, 1px border `#10B981`, label `#10B981` |
| │ └ `Button_type_3_need_help` (instance) | `1:6785` | 73,602 68x18 | headset icon + "Support" |
| └ Vip Manager button | `1:6786` | 199,592 168x38 | fill `#10B981`, label + icon white |
| &nbsp;&nbsp;└ `Button_type_3_need_help` | `1:6787` | 235,602 96x18 | whatsapp 16x16 + text at +22 |

Contact buttons: 168 + **8px gap** + 168 = 344, inset 7px from the 358 menu width (x 23..191 and
199..367 — note the right button ends at 367, 7px short of 374, so the pair is centred inside the
358 column). Both 38 tall, painted y 592..629 (verified).

---

## 3. Layout — identity block, `1:6816` / `1:7015`

`Frame 2135557614` `1:6824` / `1:7023`: y 60..208, 390x**148**, fill `#FFFFFF`.

| Element | Node (6816 / 7015) | Abs box | Measured |
| --- | --- | --- | --- |
| `profile-section` | `1:6825` / `1:7024` | 16,72 358x52 | |
| ├ `avatar-wrapper` | `1:6826` / `1:7025` | 16,74 48x48 | circle, fill `#DDE2ED`, painted y 84..111 at x=20 |
| │ └ `user` glyph | `1:6828` / `1:7027` | 28,86 24x24 | outline, colour not isolated |
| ├ `profile-info` | `1:6830` / `1:7029` | 76,76 173x44 **(6816)** / 76,89.5 173x17 **(7015)** | **the variant switch** |
| │ ├ `vip-badge` | `1:6832` — **6816 only** | 76,76 59x23 | gradient `#FF8900` → `#FF4500` L→R |
| │ │ ├ `star-icon` (text node) | `1:6833` | 88,80 13x15 | renders `★`, white |
| │ │ └ `vip-text` (text node) | `1:6834` | 101,81 22x13 | renders `VIP`, white |
| │ └ username | `1:6835` / `1:7030` | 76,103 126x17 (6816) | "luckytest1234567", `#102A67`, bold, ink 77..200 x 107..119 |
| └ `profile-deposit-btn` | `1:6836` / `1:7031` | 261,79 113x38 | fill `#00B579`, painted y 79..116 |
| &nbsp;&nbsp;└ text | `1:6837` / `1:7032` | 291,90.5 53x15 | "DEPOSIT", white |
| `Container` (ID field) | `1:6838` / `1:7033` | 16,132 358x40 | fill `#E8F1FC`, painted y 132..171 |
| ├ `label` | `1:6840` / `1:7035` | 24,141 81x22 | |
| │ ├ `ID:` | `1:6841` / `1:7036` | 24,141 22x22 | pale blue, lighter than the value |
| │ └ `23885` | `1:6842` / `1:7037` | 52,141 53x22 | `#102A67`, digit ink height 13px |
| └ `copy` button | `1:6843` / `1:7038` | 332,135 34x34 | fill `#DFE5F0`, glyph `#191970`-ish |
| &nbsp;&nbsp;└ `Group` (copy icon) | `1:6844` / `1:7039` | 341.85,144 14.3x16 | |
| `Button:align-center` | `1:6847` / `1:7042` | 16,180 358x20 | |
| └ `Button` | `1:6848` / `1:7043` | 168.5,180 53x20 | centred |
| &nbsp;&nbsp;├ `Arrow`/`image` | `1:6849` / `1:6850` | 188.5,200 20x20 | **y offset +20 inside a 20-tall parent — it is positioned below the button box**; the rendered chevron nonetheless appears left of "More" at ~x 190..200, y 186..193 |
| &nbsp;&nbsp;└ text `Моre` | `1:6853` / `1:7048` | 192.5,182 29x16 | renders "More", `#FF8101`, ink 194..220 x 186..193 |

`1:7015` differs only in the `profile-info` row: no `vip-badge`, and `profile-info` is 17 tall at
y 89.5 instead of 44 tall at y 76. Every other node id, name, offset and size in this block matches
`1:6816` one-for-one.

---

## 4. Tokens — every value measured off the 1:1 render

### Colours

| Token / use | Hex | Where measured |
| --- | --- | --- |
| Header + identity band background | `#FFFFFF` | x=8, y 0..121 (6641); y 60..207 (6816) |
| Menu body background | `#F4F6FA` | x=8, y 122..695 (6641) |
| Menu row fill | `#E8F1FC` | x=300, all 8 rows |
| ID field fill | `#E8F1FC` | x=20, y 133..170 (6816) |
| Primary text / labels / username / ID value | `#102A67` | darkest pixel of every label rect |
| Menu row icon stroke | `#7FB4F2` | sport icon rect darkest |
| Chevron (`weui:arrow-filled`) | `#626A7A` core, edges `#6B7382`..`#949BAB` | chevron rect darkest |
| Login button fill | `#EDF5FF` | (17,73)..(189,109) |
| Register button gradient | `#FF8B00` @ x=199 → `#FF4600` @ x=370 (horizontal, no vertical component: `#FF6800` identical at y=73 and y=109 for x=286) | row scan y=80 and y=91 |
| Register button label | `#FFFFFF` | |
| VIP badge gradient | `#FF8B00` @ x=76 → `#FF4500` @ x=134 (horizontal) | row scan y=88 (6816) |
| Deposit button fill | `#00B579` | (320, 79..116) |
| Support button border + label | `#10B981` | 1px at x=23 and x=190, y=610 |
| Support button fill | none — panel `#F4F6FA` shows through | interior scan y=610 |
| Vip Manager button fill | `#10B981` | x=300, y 592..629 |
| Vip Manager label + icon | `#FFFFFF` | |
| Close button circle | `#EFF6FF` | rect(350,20,40,40) |
| Close button glyph | `#3B82F6` | same rect, darkest |
| Avatar circle | `#DDE2ED` | (40,98) 6816 |
| Copy button fill | `#DFE5F0` | rect(340,150) 6816 |
| Copy icon | `#191970` (darkest sampled) | same rect |
| "More" label | `#FF8101` | rect(190,190) 6816 |
| Navbar opaque bar | `#45458C` | x=8, y 698..761 (6641) |
| Navbar FAB (orange diamond) | `#FE7E00` at top → `#FE6900` at y=680 (vertical gradient) | col x=194, y 658..680 |

### Radii — derived from the anti-aliased corner profile, not read from Figma

Measured method: for each shape, find the x at which the fill starts on successive scanlines from
the top edge. All four shapes measured give the same profile (dx ≈ 5 at dy 0.5, dx ≈ 1 at dy 4,
dx = 0 at dy 8), which fits **r = 8px**:

- menu row (`#E8F1FC`): left edge x=16, fill reaches x=16 at y=140, x≈21 at y=132 → **≈8px**
- login button: **≈8px**
- Support button (border): **≈8px**
- ID field (`1:6838`): **≈8px**

VIP badge and DEPOSIT button corners could not be measured — both carry a soft warm glow that
swamps the edge (see shadows). Visually in a 4x crop both read as ~6px, not full pills.

### Shadows — present and measured, values not readable

- **Register button `1:6653`**: a warm halo below and around it. Measured falloff at x=300:
  `#F5E2E0` at y=122 → `#F4F0F3` at y=131 → clean `#E8F1FC` at 132. Roughly 10px of visible spread
  below the 38px button, warm/orange-tinted, not a neutral grey shadow.
- **DEPOSIT button `1:6836`**: same warm halo, `#F4E9DA` at y=117 fading to `#FEFEFE` by y=129 —
  about 12px of visible spread, and 3-4px above the button (y 75..78).
- **VIP badge `1:6832`**: warm halo of about 6px on all sides (`#FFF3EF` at x=70, badge starts 76).
- No shadow detected on the header, the panel edge, the menu rows, or the contact buttons.

### Type — sizes are DERIVED from ink height, not read from Figma

Cap/ink heights measured on the render; the em size below assumes cap-height ≈ 0.72em, which is a
guess about the typeface, not a measurement:

| Text | Figma text-box h | measured ink h | implied size |
| --- | --- | --- | --- |
| Menu row labels (uppercase) | 20 | 9 (cap) | ~12–13px |
| "Увійти" | 16 | 10 (cap + breve) | ~14px |
| "TERMS OF USE" / "ENGLISH" | 20 | 9 (cap) | ~12–13px |
| username `luckytest1234567` | 17 | 13 (with descender) | ~14–15px, bold |
| `23885` | 22 | 13 (digits) | ~18px |
| "More" | 16 | 8 | ~11px |

Figma line-height is readable directly from the text-node heights: **20px** for menu labels and the
footer links, **16px** for the auth-button labels and "More", **17px** for the username, **22px**
for the ID row, **15px** for "DEPOSIT", **13px** for "VIP".

Font family, weight and exact size: UNKNOWN (see §7).

---

## 5. Copy — literal, character for character

The brief expected Ukrainian. **The menu itself is in English.** Only the two auth buttons and the
navbar (a separate instance) are Ukrainian. Read off 4x and 10x crops of the render:

| String as rendered | Node (6641 / 6816 / 7015) | Note |
| --- | --- | --- |
| `Увійти` | `1:6652` | login button, 6641 only |
| `Реєстарція` | `1:6654` | register button, 6641 only. **This is a typo in the design** — correct Ukrainian is `Реєстрація`. Verified at 10x zoom: the glyph order after `ст` is `а`, `р`. Reproduce it as-is or raise it with the designer; do not silently "fix" it. |
| `SPORT` | `1:6666` / `1:6865` / `1:7060` | layer named `sport` |
| `CASINO` | `1:6705` / `1:6904` / `1:7099` | layer named `Casino` |
| `REFERRAL PROGRAM` | `1:6715` / `1:6914` / `1:7109` | layer named `Referral program` |
| `MY BONUSES` | `1:6720` / `1:6919` / `1:7114` | layer named `MY Bonuses` |
| `PROMOTIONS` | `1:6736` / `1:6935` / `1:7130` | layer named `promotions` |
| `CASHBACK` | `1:6741` / `1:6940` / `1:7135` | layer named `cashback` |
| `PAYMENTS` | `1:6748` / `1:6947` / `1:7142` | layer named `payments` |
| `PROFILE` | `1:6759` / `1:6958` / `1:7153` | layer named `Profile` |
| `TERMS OF USE` | `1:6767` / `1:6966` / `1:7161` | |
| `ENGLISH` | `1:6782` / `1:6981` / `1:7176` | |
| `Support` | inside instance `1:6785` / `1:6984` / `1:7179` | mixed case, not uppercase |
| `Vip Manager` | `1:6814` / `1:7013` / `1:7208` | mixed case, exactly `Vip`, not `VIP` |
| `VIP` | `1:6834` (6816 only) | in the badge, preceded by a `★` from text node `1:6833` |
| `luckytest1234567` | `1:6835` / `1:7030` | |
| `ID:` | `1:6841` / `1:7036` | |
| `23885` | `1:6842` / `1:7037` | |
| `DEPOSIT` | `1:6837` / `1:7032` | |
| `More` (rendered) | `1:6853` / `1:7048` | **the Figma layer name is `Моre` — `М` U+041C and `о` U+043E are Cyrillic.** The render is indistinguishable. If the string carries Cyrillic homoglyphs it will break search/i18n keys. Needs `get_design_context` to confirm. |

Every row label renders ALL CAPS while eight of the eight layer names are lower/mixed case. That is
consistent with a `text-transform: uppercase` in the design, but it is inference — the stored string
was not read.

---

## 6. The panel / navbar relationship — measured, not assumed

The question was: does the panel stop above the navbar, cover it, or leave it lit? Measured answer:
**it stops short of the bottom of the frame, the navbar sits on top of it, and the navbar is fully
lit — no scrim, no dimming, no overlay of any kind.**

| | `1:6641` | `1:6816` / `1:7015` |
| --- | --- | --- |
| panel bottom | y = 656 | y = 742 |
| navbar instance top | y = **653** | y = **736** |
| overlap of navbar over panel | **3px** | **6px** |
| navbar opaque bar starts | y = **697** (= navbar top + 44) | y = **781** (= navbar top + 45) |
| navbar opaque bar | 697..763 = 67px tall, `#45458C` | 781..846 = 66px tall, `#45458C` |
| pixels between panel bottom and bar | 656..696 = `#F4F6FA` | 742..780 = `#F4F6FA` |
| FAB (orange diamond) top | y = **658**, i.e. 2px **below** the panel bottom | not separately scanned |

So the navbar instance is 111 tall but only its bottom ~66-67px is painted; the top ~44-45px is
transparent and holds only the orange menu FAB. Between the panel's bottom edge and the painted bar
the render is `#F4F6FA` — the same colour as the panel body, so **there is no visible seam and I
cannot tell from pixels alone whether that strip is the panel overflowing or the parent frame's own
fill.** Both would look identical. Recorded as a question in §7.

The navbar renders in its **"Меню" active state** in all three frames: the orange FAB is raised and
the Меню label is light, the other four items are dimmer. Navbar labels (Ukrainian, from the render;
they belong to the navbar area, listed here only for the relationship): `Казино`, `Спорт`, `Меню`,
`Лайф казино`, `Промо`.

---

## 7. Interaction and state

Everything below is what the geometry implies. **No hover, pressed, focus or disabled variant
exists in any of the three frames** — checked against the full metadata subtree of all three; there
are no such layers.

- **Close** `btn-close` `1:6646`/`1:6821`/`1:7020`, 40x40 hit area around a 14x14 glyph. Dismisses
  the panel.
- **Auth pair** (6641 only): two peer buttons, register is the visually primary one (orange
  gradient + glow), login is the secondary (tinted fill, no border).
- **Expandable menu rows**: SPORT, CASINO and PAYMENTS carry a `weui:arrow-filled` chevron pointing
  down; the other five rows have none. That is a two-state accordion — the three chevrons are all
  in the collapsed (down) orientation in all three frames. **No expanded state is present in the
  file at these node ids.**
- **"More"** `1:6847`/`1:7042`: a down-chevron plus the word More, centred under the ID field. The
  identity block is therefore in a **collapsed** state; more account fields exist behind it. The
  expanded state is not in these three frames.
- **Copy button** `1:6843`/`1:7038`: 34x34 with a duplicate-sheets glyph next to the ID — copy to
  clipboard, implies a transient confirmation that is not designed here.
- **DEPOSIT** `1:6836`/`1:7031`: primary CTA, only in the two logged-in variants.
- **Language switcher**: flag + `ENGLISH` in the footer row implies a picker; no picker frame here.
- **Support / Vip Manager**: two contact routes, the second is WhatsApp (`whatsapp_4423697 1`).
  Support is the ghost/outlined variant, Vip Manager is filled — a deliberate primary/secondary pair.
- **Scroll**: nothing indicates scrolling. Panel content is 656 / 742 tall against a 764 / 847
  frame, so it fits without scroll at 390px. No scrollbar, no clipped row, no fade edge.
- **VIP badge** is a pure display state (VIP vs not), driving the `1:6816` vs `1:7015` split.

---

## 8. Assets — node ids; download URLs NOT retrieved

`get_design_context` was rate-limited before a single asset URL was returned, so this is an
inventory by node id only. Sizes are from metadata.

| Asset | 6641 | 6816 | 7015 | Size | Kind |
| --- | --- | --- | --- | --- | --- |
| `Logo TopWin` (instance) | `1:6645` | `1:6820` | `1:7019` | 111x20 | wordmark, multi-colour |
| close `x` | `1:6647` | `1:6822` | `1:7021` | 14x14 | icon |
| `soccer-ball_17713374 1` | `1:6662` | `1:6861` | `1:7056` | 15x15 | row icon (SPORT) |
| `slots_5705209 1` | `1:6672` | `1:6871` | `1:7066` | 15x15 | row icon (CASINO) |
| `human_4623628 1` | `1:6712` | `1:6911` | `1:7106` | 15x15 | row icon (REFERRAL) |
| `bonuses 1` | `1:6718` | `1:6917` | `1:7112` | 15x15 | row icon (MY BONUSES) |
| `promotions_372754 (1) 1` | `1:6723` | `1:6922` | `1:7117` | 15x15 | row icon (PROMOTIONS) |
| `vip 1` | `1:6739` | `1:6938` | `1:7133` | 15x15 | row icon (CASHBACK, a crown) |
| `bank 1` | `1:6745` | `1:6944` | `1:7139` | 15x15 | row icon (PAYMENTS, a wallet) |
| `Group` (profile person) | `1:6753` | `1:6952` | `1:7147` | 15.0003x15.00001 | row icon (PROFILE) |
| `weui:arrow-filled` x3 | `1:6667`,`1:6706`,`1:6749` | `1:6866`,`1:6905`,`1:6948` | `1:7061`,`1:7100`,`1:7143` | 24.000001x24.000001 | chevron, same glyph 3x |
| `solar:document-linear` | `1:6763` | `1:6962` | `1:7157` | 22x22 | Terms icon |
| `lang` / `Group 277133701` | `1:6769`/`1:6770` | `1:6968`/`1:6969` | `1:7163`/`1:7164` | 24x24 | UK flag, full colour |
| headset (inside Support instance) | inside `1:6785` | inside `1:6984` | inside `1:7179` | not exposed | icon |
| `whatsapp_4423697 1` | `1:6788` | `1:6987` | `1:7182` | 16x16 | icon |
| `user` (avatar glyph) | — | `1:6828` | `1:7027` | 24x24 | icon |
| `Group` (copy) | — | `1:6844` | `1:7039` | 14.300762x16.001316 | icon |
| `image` (More arrow) | — | `1:6850` | `1:7045` | 20x20 | icon, named `image` |

18 distinct assets. The `★` in the VIP badge is a **text node** (`1:6833`), not an asset.

Note the sub-pixel sizes (`15.000289916992188`, `24.00000104907349`, `14.300762176513672`) — these
are Figma float artefacts, not design intent. Round them.

---

## UNKNOWN — questions that need answering before implementation

1. **Asset download URLs.** `get_design_context` never returned one — the Figma MCP seat hit its
   call limit. Who can re-run `get_design_context` on `1:6642`, `1:6817` and `1:7016` once the quota
   resets, or export the 18 assets by hand?
2. **Font family, weight and exact px size** for every text style. Only line-heights (from text-box
   heights) and ink heights are known. Which typeface is this, and are the row labels 12 or 13px?
3. **Declared `cornerRadius`** — the render is consistent with 8px on rows, buttons and the ID
   field, but the value was inferred from anti-aliasing. Confirm 8, and give the radius for the VIP
   badge and the DEPOSIT button (both obscured by their glow).
4. **Shadow values.** Warm halos are measurably present on the register button, the DEPOSIT button
   and the VIP badge. What are the actual x/y/blur/spread/colour? Is the warm tint intentional or a
   coloured-glow effect left on by accident?
5. **`Реєстарція`** — is the transposition a typo to fix, or copy to reproduce verbatim?
6. **`Моre`** — does the "More" text node contain Cyrillic `М`/`о`, as the layer name does? If yes,
   is that intentional?
7. **Row labels render ALL CAPS but the layer names are lower/mixed case.** Is the stored string
   uppercase, or is there a `text-transform: uppercase`? This decides whether i18n strings ship
   uppercase.
8. **Why does row 2 (CASINO) paint 44px** when it has the same 46-in-44 nesting as rows 1 and 7,
   which paint 46? Is the 46px inner frame a mistake in all three, and should every row be exactly
   44 with a uniform 6px gap?
9. **Row pitch is 52, 52, 50, 50, 50, 50, 50.** Is the 52 for the first two rows deliberate
   (grouping SPORT/CASINO apart from the account rows) or leftover?
10. **The navbar overlaps the panel by 3px in `1:6641` and 6px in `1:6816`/`1:7015`.** Which is
    right? Should the panel end exactly at the navbar top?
11. **The strip between the panel bottom and the navbar's painted bar** (656..696 / 742..780) is
    `#F4F6FA`, the same colour as the panel body, so its owner cannot be determined from pixels.
    Is that the panel overflowing, or the parent frame's fill? It decides whether the implemented
    panel is `height: 100%` or a fixed height.
12. **`1:7015` was never rendered.** Its structure was read from metadata and is identical to
    `1:6816` minus `vip-badge`, but no screenshot confirms the render. Worth one `get_screenshot`
    when the quota resets.
13. **The `Arrow` frame inside the "More" button** (`1:6849`) sits at y=+20 inside a 20px-tall
    parent — outside its own box — yet the chevron renders next to the label. Is the layer
    mispositioned in Figma, or is something else drawing that chevron?
14. **No balance anywhere.** Was a balance meant to be in the identity block, or is Deposit the
    whole story?
15. **No expanded state** exists for the three chevron rows or for "More". Where do those states
    live in the file?
