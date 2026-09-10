# Top-Win — GAP FILL: menu panels, type / radii / effects / assets

File key: `s2CqwGqe0O0FcALhBNlTRe`. Closes the UNKNOWN list in `08-menus.md`.

## Method — read before trusting a number

**2 Figma MCP calls spent. No quota error. 6 of the 8 allowed calls left unspent.**

1. `get_design_context` on **`1:6817`** (VIP inner panel, `excludeScreenshot: true`) — returned the
   full React+Tailwind for header, identity block, all 8 menu rows, Terms/Language row, the
   Support / Vip Manager row, plus 32 asset URLs.
2. `get_design_context` on **`1:6650`** (`btns`, the auth pair inside `1:6641`) — the only region
   `1:6817` does not contain.

Every value below is **declared Figma data**, not a pixel inference. Where it contradicts the
screenshot-derived numbers in `08-menus.md`, the declared value wins and the delta is called out.

`1:7016` was not queried. Its subtree is identical to `1:6817` minus `vip-badge` (`08-menus.md` §1,
from `get_metadata`), so the styles below apply unchanged. That is reasoning, not measurement.

---

## 1. Type — every text style, declared

`fontVariationSettings: "wdth" 100` is present on every Roboto and Outfit node. It is Figma's
variable-font default, not design intent.

| Where | Node (6816) | Family | Weight | Size | Line-height | Tracking | Case | Colour |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Menu row labels x8 | `1:6865` `1:6904` `1:6914` `1:6919` `1:6935` `1:6940` `1:6947` `1:6958` | **Roboto** | **Medium / 500** | **13px** | **20px** | none | **uppercase (transform)** | `#102A67` |
| `Terms of Use` | `1:6966` | Roboto | Medium / 500 | 13px | 20px | none | uppercase (transform) | `#102A67` |
| `ENGLISH` | `1:6981` | Roboto | Medium / 500 | 13px | 20px | none | uppercase (transform) | `#102A67` |
| `Support` | `I1:6984;2642:42640` | Roboto | **Regular / 400** | 13px | **18px** | none | **none** | `#10B981` |
| `Vip Manager` | `1:7013` | Roboto | Regular / 400 | 13px | 18px | none | none | `#FFFFFF` |
| `Моre` | `1:6853` | Roboto | **Bold / 700** | **12px** | **16px** | none | none | `#FF8101`, centred |
| `Увійти` | `1:6652` (6641) | **Outfit** | **SemiBold / 600** | **13px** | **normal** | **-0.2px** | **capitalize (transform)** | `#102A67` |
| `Реєстарція` | `1:6654` (6641) | Outfit | SemiBold / 600 | 13px | normal | -0.2px | capitalize (transform) | `#FFFFFF` |
| username `luckytest1234567` | `1:6835` | **Inter** | **Bold / 700** | **14px** | normal | none | none | `#102A67`, `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` |
| `DEPOSIT` | `1:6837` | Inter | **ExtraBold / 800** | **12px** | normal | none | none | `#FFFFFF` |
| `VIP` | `1:6834` | Inter | Bold / 700 | **11px** | normal | **1.5px** | none | `#FFFFFF` |
| `★` | `1:6833` | Inter | Bold / 700 | **12px** | normal | none | none | `#FFFFFF` |
| `ID:` | `1:6841` | Inter | **Regular / 400** | **17px** | **22px** | none | none | **`#92BDF3`** |
| `23885` | `1:6842` | Inter | Regular / 400 | 17px | 22px | none | none | `#102A67` |

**Three families, not one: Roboto (menu chrome), Outfit (auth buttons only), Inter (identity
block only).**

Corrections to `08-menus.md` §4:
- Row labels are **13px**, not "12 or 13". Settled.
- The ID row is **17px**, not the ~18px implied from ink height.
- `ID:` colour is `#92BDF3` — previously recorded only as "pale blue, lighter than the value".
- Support / Vip Manager line-height is **18px**, a value the earlier pass never had.

## 2. The two literal-string questions — answered

### `Моre` — Cyrillic, confirmed in the text content

The text node `1:6853` content, round-tripped through `node -e` codepoint dump:

```
"Моre"  →  М U+041C | о U+043E | r U+0072 | e U+0065
```

`М` is CYRILLIC CAPITAL LETTER EM, `о` is CYRILLIC SMALL LETTER O. `r` and `e` are Latin.
**Mixed-script homoglyph in the stored string, not only in the layer name.** It renders
identically to `More` and will break any exact-match i18n key, search, or test assertion that
types Latin. Ship the Latin `More` and raise the Figma layer for correction.

Method caveat: the string was read out of the MCP tool response text and re-emitted into `node`
by me. That is a faithful copy, not a byte-level capture from the wire. It agrees with the layer
name the earlier pass reported, which is independent corroboration.

### Row labels — text-transform, NOT stored uppercase

Every row label node carries the Figma text case `UPPER` (emitted as the Tailwind `uppercase`
class) while the stored string is lower/mixed case. The literal stored characters:

| Rendered | **Stored string** | Node (6816) |
| --- | --- | --- |
| SPORT | `sport` | `1:6865` |
| CASINO | `Casino` | `1:6904` |
| REFERRAL PROGRAM | `Referral program` | `1:6914` |
| MY BONUSES | `MY Bonuses` | `1:6919` |
| PROMOTIONS | `promotions` | `1:6935` |
| CASHBACK | `cashback` | `1:6940` |
| PAYMENTS | `payments` | `1:6947` |
| PROFILE | `Profile` | `1:6958` |
| TERMS OF USE | `Terms of Use` | `1:6966` |
| ENGLISH | `ENGLISH` | `1:6981` — already caps in source **and** transformed |

**So: ship mixed-case i18n strings and apply `text-transform: uppercase` in CSS.** Do not ship
uppercase strings — Ukrainian and other locales need the untransformed source.

`Support` (`1:6984`) and `Vip Manager` (`1:7013`) have **no** transform. `Увійти` / `Реєстарція`
carry `capitalize` (Figma `TITLE`), which is a visual no-op on those two strings but will change
any lower-case translation dropped into those slots.

`Реєстарція` is confirmed as the **stored** string, transposition and all. Still a design typo
(correct Ukrainian: `Реєстрація`); now known to be in the content, not a render artefact.

## 3. Corner radii — declared, no longer inferred

| Element | Node | Radius |
| --- | --- | --- |
| Menu row (all 8, outer + inner wrappers) | `1:6857` `1:6858` `1:6859` `1:6868` `1:6909` `1:6915` `1:6920` `1:6936` `1:6941` `1:6942` `1:6950` | **8px** |
| ID field `Container` | `1:6838` | **8px** |
| Login button `Увійти` | `1:6651` | **8px** |
| **Register button `Реєстарція`** | `1:6653` | **6px** — *not 8* |
| **DEPOSIT button** | `1:6836` | **8px** |
| **VIP badge** | `1:6832` | **6px** |
| **Support button** | `1:6983` | **6px** — *not 8* |
| **Vip Manager button** | `1:6985` | **6px** |
| Copy button | `1:6843` | **6px** |
| Close button | `1:6821` | **100px** (pill → circle at 40x40) |
| Avatar wrapper | `1:6826` | **24px** (circle at 48x48) |
| Identity band `1:6824` | `1:6824` | **10px** |
| `profile-section` | `1:6825` | 16px (no fill — invisible) |
| `menu` containers | `1:6855` `1:6907` | 16px (no fill — invisible) |
| Language flag wrapper `lang` | `1:6968` | 60px (circle at 24x24) |
| Button inner `Button_type_3_need_help` | `1:6984` `1:6986` | 4px (no fill — invisible) |

The earlier "8px everywhere" inference was **right for the rows, the ID field and the login
button, and wrong for both contact buttons and the register button (6px)**. The 2px difference is
below what an anti-aliased corner profile can separate, which is exactly why it was missed.

## 4. Effects — the warm halos, declared

All three are **coloured** shadows. The warm tint is deliberate, not an accident.

| Element | Node | Effect (CSS) |
| --- | --- | --- |
| Register button | `1:6653` | `filter: drop-shadow(0px 8px 12px rgba(255,69,0,0.33))` **plus** inner highlight `box-shadow: inset 0px 1px 0px 0px rgba(255,255,255,0.25)` |
| VIP badge | `1:6832` | `box-shadow: 0px 8px 24px 0px rgba(255,69,0,0.33)` **plus** `box-shadow: inset 0px 1px 0px 0px rgba(255,255,255,0.25)` |
| DEPOSIT button | `1:6836` | `filter: drop-shadow(0px 4px 6px rgba(198,144,61,0.25))` — **no** inner highlight |

`rgba(255,69,0,·)` is `#FF4500`, the same orange the gradient ends on — a self-coloured glow.
`rgba(198,144,61,0.25)` is `#C6903D`, a warm gold, on a **green** button. That is the one value
worth querying with the designer: it reads as a leftover from an orange button.

No other node in any of the three panels declares an effect. The header, the panel edge, the menu
rows and the contact buttons have none — confirming the earlier pixel finding.

## 5. Fills and borders the pixel pass could not see

| Element | Node | Declared | Note |
| --- | --- | --- | --- |
| `sidebar-panel` | `1:6817` | `background: #F4F6FA`, **`border-right: 1px solid #D8DDE7`** | **NEW.** A right-hand hairline the render could not show — the panel is full-bleed 390px in these frames, so the border sits off the visible edge. Keep it for wider viewports. |
| Close button | `1:6821` | fill `#EFF6FF`, **`border: 1px solid #BFDBFE`** | **NEW.** The border was never isolated from the fill by pixel sampling. |
| Copy button | `1:6843` | fill **`rgba(216,221,231,0.6)`** | Composites over `#E8F1FC` to the `#DFE5F0` that was measured. Both are correct; this is the source. |
| Language flag wrapper | `1:6968` | fill **`rgba(17,20,24,0.2)`** | A dark scrim under the flag, invisible against the full-colour flag art. |
| Register gradient | `1:6653` | `linear-gradient(to right, #FF8C00, #FF4500)` | Measured `#FF8B00`→`#FF4600`; declared is `#FF8C00`→`#FF4500`. Use declared. |
| VIP badge gradient | `1:6832` | `linear-gradient(to right, #FF8C00, #FF4500)` | Same pair, same correction. |
| CASINO icon | `1:6871` | `opacity: 0.5` | **NEW.** |
| PROMOTIONS icon | `1:6922` | `opacity: 0.5` | **NEW.** |
| Terms doc icon | `1:6962` | `opacity: 0.5` | **NEW.** The other 6 row icons are full opacity. |

Named styles present in the file (from the tool's own summary): `Orange: #FF4500`,
`Navy: #191970`, `white_gg: #DAD7E0`.

## 6. Box model — declared padding and gaps

Replaces the offsets-arithmetic in `08-menus.md` §2.

| Container | Node | Padding | Gap | Size |
| --- | --- | --- | --- | --- |
| Header | `1:6818` | inner `Container` `1:6819` px 16 | space-between | h 60, bg white |
| Identity band | `1:6824` | px 16, pt 12, pb 8 | 8 | w full, r 10, bg white |
| `profile-section` | `1:6825` | py 16 | 12 | h 52 |
| DEPOSIT btn | `1:6836` | px 24, py 10 | — | 113x38 |
| VIP badge | `1:6832` | p 8 | — | 59x23, `overflow: clip` |
| `profile-info` | `1:6830` | — | 4 | flex-col |
| ID field | `1:6838` | px 8, py 6 | space-between | h 40, `overflow: clip` |
| `label` (ID) | `1:6840` | — | 6 | — |
| Menu wrapper | `1:6854` | px 16, py 10 | — | w 390 |
| Row group (SPORT/CASINO + nested) | `1:6856` | — | **8** | — |
| Row group (rows 3-8) | `1:6908` | — | **6** | — |
| Each menu row | `1:6859` etc | px 12, py 10 | 10 (icon↔label) | h 44 |
| Terms/Language row | `1:6960` | px 12, py 10 | 10 | h 46 |
| Contact row | `1:6982` | px 12, py 16 | **8** | — |
| Support / Vip Manager btn | `1:6983` `1:6985` | px 20, py 10 | 6 (icon↔label) | w 168 |
| Auth pair `btns` | `1:6650` | — | **8** | h 38 |
| Login btn | `1:6651` | px 8, **py 6.606** | — | flex-1, h 38 |
| Register btn | `1:6653` | p 8 | — | flex-1, h 38 |

The two different row gaps (8 then 6) are **declared**, not leftover — the earlier pass read
pitches of 52,52,50,50,50,50,50 and could not tell which were intentional. SPORT and CASINO sit in
a group with `gap: 8`; rows 3-8 sit in a nested `menu` with `gap: 6`. That answers `08-menus.md`
UNKNOWN #9: **deliberate.**

`py: 6.606px` on the login button is a Figma float artefact of vertical-centring a 13px Outfit
line in 38px. Use `align-items: center` and drop it.

UNKNOWN #8 is now **confirmed as a Figma bug**: rows `1:6857` (SPORT), `1:6868` (CASINO) and
`1:6941` (PAYMENTS) are `h-[44px]` containers whose single child is `h-[46px]`. The child
overflows by 2px and is not clipped. Implement all eight rows at **44px**.

## 7. Asset download URLs — all 32

`https://www.figma.com/api/mcp/asset/<uuid>.svg`. **Every one expires 7 days from 2026-09-10.**
Download now; do not commit this table as the source of truth.

| Asset | Node (6816) | UUID |
| --- | --- | --- |
| Logo TopWin | `1:6820` | `91e8bfb5-f251-410c-98fa-8f717f1aaa78` |
| close `x` | `1:6822` | `6fe2984e-8516-4625-8767-65801ff26922` |
| avatar `user` | `1:6828` | `8b8a8430-a394-475a-b986-27e857caf35c` |
| copy icon | `1:6844` | `097fa3f2-2c4b-4380-9c01-7303440bc406` |
| More arrow (`image`) | `1:6850` | `4baa3454-00a3-4c42-8e3e-fae255d17e49` |
| SPORT — soccer ball | `1:6861` | `7657d3b4-1a93-44de-a252-b574779337ac` |
| chevron `weui:arrow-filled` (all 3) | `1:6866` `1:6905` `1:6948` | `bc03fd68-1c60-400e-9729-38ad7538f195` |
| REFERRAL — human | `1:6912` | `fa07a5e7-8ca2-4c8f-8df7-ea48b67b7e59` |
| MY BONUSES — bonuses | `1:6917` | `eeaa9b69-b16a-4d26-b09f-812afaca7d89` |
| CASHBACK — vip crown | `1:6938` | `c6ba6be1-b40c-47b9-82eb-196b541e1b27` |
| PAYMENTS — bank | `1:6944` | `3dea871d-5776-4877-a426-fffe1ce17b72` |
| PROFILE — person | `1:6952` | `3ecb3a3e-11b7-41c8-b54c-93f4e6dad52b` |
| Terms — `solar:document-linear` | `1:6963` | `c1511621-a546-46c7-b227-18c8a2a2a645` |
| Support — headset | `I1:6984;2642:42639` | `bcccbae0-4b89-493d-8e09-1ffab7beea37` |
| Vip Manager — whatsapp | `1:6988` | `0c04feac-ef82-4973-a260-60dbea075d77` |

**Fragmented assets — these do NOT come out as one usable SVG:**

| Asset | Fragments | UUIDs |
| --- | --- | --- |
| CASINO — `slots_5705209 1` `1:6871` | **9 pieces + 2 luminance masks**, each piece `rotate(180) scaleX(-1)` | `9c15a1f5-4da8-453e-bb45-b0719580167b` (mask g2813), `041b0130-56fa-4549-8579-688789c76eec` (g2814, used 3x), `de54ad8c-2e07-4113-bc22-460e9cdb5968` (mask g2833), `6127a303-52cd-4a69-a87c-24595fd49e62` (g2834), `3b137987-52d3-4141-8d08-a20d6ca7820c` (g2837), `97b246e3-53ae-4c8b-a872-59204660e62b` (g2841), `79c0b69c-48e8-4137-9f43-44c8ee07402a` (g2845), `2ad42b78-5d14-44d6-90f3-3b7971075905` (g2849), `3f3d2d38-cf43-4483-bbca-40782e20dff0` (g2853) |
| PROMOTIONS — `1:6922` | 4 pieces, plain absolute positioning, no masks | `a03c6d15-bd39-4f3d-8dfe-611a150dc394`, `babd026c-0285-4858-b656-4f5702dfd89a`, `b6eb3c71-b5de-484e-9738-db2b3f3e6989`, `efed0bb8-228d-4999-a624-cc9e97cb6e7c` |
| Language — UK flag `1:6969` | circle + 2 masks + art | `8d7a1d15-e012-487a-8c03-b7dfd481e040` (Ellipse 1085), `4dfc1684-8c1e-4d33-9084-a8768e32a0ce` + `8240e2af-05bc-4a5f-a89c-b0194a5dd7de` (masks), `7119eb02-b88c-497a-bd74-99c25f9429e7` (art) |

Do not reassemble the CASINO icon from its 9 fragments and 2 CSS masks. Export `1:6871` as a
single flat SVG (`download_assets` with `defaultFormat: "svg"`, or hand-export from Figma), then
run it through `scripts/clean-svg.mjs` like every other Figma SVG in this repo. Same for the flag
(`1:6969`). PROMOTIONS is composable from its 4 plain pieces but a flat export is still cheaper.
Not done here: it would have cost Figma calls the other five agents in this run are sharing.

---

## Still UNKNOWN after this pass

These were **not** in my gap and were not answered by the two calls:

1. `1:7016` never queried or rendered. Styles assumed identical to `1:6817` minus `vip-badge`,
   on the strength of the metadata subtree match. One `get_design_context` would settle it.
2. **The `Arrow` frame `1:6849` position anomaly.** The code shows it as a normal flex child with
   `rotate(180)` on a 20x20 `Arrow`, gap 4 to the label — which renders fine. The `y=+20` offset
   the earlier pass read from `get_metadata` is therefore an absolute-coordinate artefact of a
   rotated node's bounding box, **not** a mispositioned layer. That resolves `08-menus.md`
   UNKNOWN #13, but by inference from the emitted flex layout, not by reading a transform matrix.
3. `Реєстарція` — the *string* is now confirmed stored with the transposition. Whether to ship the
   typo or fix it is a decision for the owner, not a measurement.
4. `rgba(198,144,61,0.25)` — a gold glow on the green DEPOSIT button. Measured, but whether it is
   intentional is a question for the designer.
5. Panel-vs-navbar overlap (3px / 6px), the `#F4F6FA` strip ownership, the missing balance, and
   the absent expanded states — all outside this gap, still open in `08-menus.md` §UNKNOWN
   10, 11, 14, 15.
