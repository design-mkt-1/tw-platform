# Top-Win footer — asset harvest manifest

File key `s2CqwGqe0O0FcALhBNlTRe`. Area: node **1:5417** → footer proper **1:5607** on frame 1:3289.
Source inventory: `05-casino-footer.md` §9.

Downloaded into `C:/Users/grosu.b/orca/workspaces/tw-platform/main/public/images/footer/`.

**18 files on disk, 0 missing.** 49 of 50 URLs came from the inventory's recorded set (still live —
minted the same day). **One** Figma MCP call was spent, on `download_assets(1:5623, svg)`, to flatten
the 26-part Cryptocurrencies tile. Five calls of the six-call budget are unused. No quota message
was seen.

Every file was verified by magic bytes: SVGs start `<svg`, PNGs start `89 50 4E 47`. No 0-byte and
no HTML-error files.

---

## 1. Payment method tiles (`1:5608` → grid `1:5611`, 7 tiles of 160×52)

| file | node | Figma layer name | fmt | bytes | source | drawn box |
| --- | --- | --- | --- | --- | --- | --- |
| `payment/mastercard.svg` | `1:5617` | `Img - cascading_gbp_a:margin` (image) | svg | 907 | recorded URL | 51.30 × 31.92 |
| `payment/visa.svg` | `1:5621` | `Img - cascading_gbp_a:margin` (vector) | svg | 1313 | recorded URL | 63.40 × 20.46 |
| `payment/cryptocurrencies.svg` | `1:5623` | `Img - gateway_crypto:margin` | svg | 22511 | **fresh call** `download_assets` | 89 × 32 |
| `payment/bitcoin-cash.svg` | `1:5665` | `Img - gatewaycrypto_bch:margin` | svg | 1837 | recorded URL | 110 × 32 |
| `payment/bitcoin.svg` | `1:5669` | `Img - gatewaycrypto_btc:margin` | svg | 1843 | recorded URL | 110 × 32 |
| `payment/ethereum.svg` | `1:5677` | `Img - gatewaycrypto_eth:margin` | svg | 974 | recorded URL | **32 × 32** |
| `payment/tether.svg` | `1:5686` | `Img - gatewaycrypto_usdt:margin` | svg | 1137 | recorded URL | 110 × 32 |
| `payment/visa-mastercard-lockup.svg` | `1:5690` | `Img - mock:margin` | svg | 6812 | recorded URL | **120 × 30** |

### Naming corrections made

- **Tile 1 is two marks, not one image.** `1:5617` is the Mastercard roundel (fills `#EB001B`,
  `#F79E1B`, `#FF5A00`); `1:5621` is the VISA wordmark (fill `#3600FF`). The inventory listed them as
  one "VISA + Mastercard" leaf. They are separate files and must be laid out side by side inside the
  110 × 32 leaf. Measured from the exported fills and viewBoxes.
- Tile 7 (`1:5690`) is the *combined* `VISA × mastercard` lockup, a different asset from tile 1 —
  hence `visa-mastercard-lockup.svg`.
- Tile 5 is the only 32 × 32 square leaf, tile 7 the only 30-high one. Do not apply a global size.

### TRAP 1 — Cryptocurrencies tile: 26 exports, now ONE file. RESOLVED.

The inventory recorded 26 separate vector URLs for tile 2 (`1:5623`, nodes `1:5624`–`1:5663`).
All 26 downloaded cleanly from the recorded URLs, then were **superseded**: one
`download_assets(nodeId 1:5623, defaultFormat svg)` returned a single flattened 22.9 KB export of
the whole leaf. That is what shipped as `payment/cryptocurrencies.svg`, `viewBox="0 0 89 32"` —
exactly the leaf box.

`node scripts/clean-svg.mjs public/images/footer` was run on it and stripped 418 bytes of Figma
canvas furniture (a `#1E1E1E` full-viewBox rect and a 390 × 5628.7 page rect). Final size 22511 B.
That is one file instead of 26, and slightly smaller than the 26 parts summed (~28 KB).

The 26 parts were **not** deleted, only moved out of the repo, to
`…/scratchpad/topwin-inventory/cryptocurrencies-parts-fallback/`. If the flattened export ever turns
out to render wrong, the parts are there and do not need a fresh Figma call.

Still true and still a question for the owner: the word `Cryptocurrencies` is **outlined vector, not
live text** (inventory §11 q12). It cannot be translated without a re-export. 22.5 KB is heavy for an
89 × 32 strip; the weight is real geometry (6 coin marks + an outlined wordmark), not canvas junk.

### Masks: 7 downloaded, all 7 deleted as dead files

`1:5617`, `1:5645`, `1:5658`, `1:5677`, `1:5737`, `1:5762`, `1:5902` each exported a `…-mask.svg`
alongside the image. **Every one is a single `<path>` that is a plain rectangle filling the whole
box** — e.g. gamblersbet's mask is `M100 0H0V32H100V0Z`, ethereum's is `M32 0H0V32H32V0Z`. They carry
no shape information, so the image SVGs are self-contained and usable standalone. Shipping them would
have been 7 dead files. Measured by reading all 7; reasoning is only that a full-box rect mask is a
no-op, which follows from the geometry.

---

## 2. Partner logos (`1:5697` → container `1:5699`, 7 links)

| file | link node | asset node | Figma layer name | fmt | bytes | source | link box | asset native |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `partners/casinostest.svg` | `1:5700` | `1:5703` | `Link - Casinostest` / `casinostest.svg` | svg | 17321 | recorded URL | 110 × 30 | 108.95 × 23.78 |
| `partners/gamblersbet.svg` | `1:5731` | `1:5737` | `Link - GamblersBet` / `gamblersbet.svg` | svg | 11971 | recorded URL | 100 × 32 | 99.99 × 31.02 |
| `partners/casino-bonuses-now.svg` | `1:5756` | `1:5762` | `Link - Casino Bonus Now` / `cbn.svg` | svg | 69291 | recorded URL | 100 × 32 | 99.78 × 24.81 |
| `partners/no-deposit.svg` | `1:5884` | `1:5887` | `Link - No Deposit` / `nodeposit.svg` | svg | 7200 | recorded URL | 100 × 32 | 99.53 × 21.75 |
| `partners/casino-bonus-club.svg` | `1:5896` | `1:5902` | `Link - Casino Bonus Club` / `cbc.svg` | svg | 15175 | recorded URL | 100 × 32 | 100 × 26.41 |
| `partners/zamsino.png` | `1:5932` | `1:5933` | `Link - Zamsino` | **png** | 7953 | recorded URL | 100 × 32 | **165 × 44** |
| `partners/deutschland-casinos.png` | `1:5934` | `1:5934` | `Link - Partner 7` | **png** | 969864 | recorded URL | **90 × 40** | **2048 × 2048** |

Machine-name → readable-name mapping (Figma name on the left is what the file is called *in Figma*):

| Figma asset name | file written |
| --- | --- |
| `casinostest.svg` | `casinostest.svg` (wordmark reads `CASINOSTEST.ORG`) |
| `gamblersbet.svg` | `gamblersbet.svg` |
| `cbn.svg` | `casino-bonuses-now.svg` (wordmark reads `CASINO BONUSES NOW`) |
| `nodeposit.svg` | `no-deposit.svg` |
| `cbc.svg` | `casino-bonus-club.svg` |
| `Link - Zamsino` (no asset name) | `zamsino.png` |
| `Link - Partner 7` (no asset name) | `deutschland-casinos.png` (artwork reads `Deutschland ★ casinos ★`) |

### TRAP 2 — the two PNG partners are scaled past their box and cropped

Natural sizes read from the PNG IHDR chunk of the downloaded files. Fill percentages are from the
inventory's `get_design_context` measurement. The derived render sizes below are arithmetic on those
two measured inputs, not separate measurements.

**Zamsino (`1:5932` / `1:5933`)**
- natural **165 × 44**, aspect 3.750
- drawn box **100 × 32**, aspect 3.125 — a *different* aspect, so it cannot fit without loss
- fill: `121.33%` width, left offset `−10.66%`
- derived: renders at 121.33 × 32.36 px, shifted left 10.66 px → the 100 × 32 window trims ≈10.7 px
  off each side, ≈17.6% of the width. Horizontal crop only; height is effectively exact.

**Partner 7 / Deutschland Casinos (`1:5934`)**
- natural **2048 × 2048**, square
- drawn box **90 × 40**
- fill: `113.83%` width, `261.1%` height, top offset `−77.78%`
- derived: renders at ≈102.4 × 104.4 px (square, consistent with 2048²), positioned 31.1 px above the
  box top → the 90 × 40 window shows the middle horizontal band of the square. Cropped top *and*
  bottom, and slightly on the sides.

Per the inventory: **preserve the crop, do not letterbox.** Whether the crop is intentional is
inventory §11 q8 and is still open — it is not for this pass to decide.

**Weight warning, not fixed here:** `deutschland-casinos.png` is **969,864 bytes (947 KB) for a
90 × 40 slot** — 2048 × 2048 delivered for a box 0.2% of its area, and the static export sets
`images: { unoptimized: true }`, so whatever is committed is what ships. Per CLAUDE.md this is a
`node scripts/to-webp.mjs` candidate. **Not run** — this pass only harvests, and converting format
would change what the other five partners' sizing assumptions were measured against. Flagging for a
human. Zamsino at 7,953 B is fine as-is.

---

## 3. Language flags (`1:5968` → group `1:5969`, 3 pills)

| file | node | Figma layer name | fmt | bytes | source | leaf | pill state |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `flags/flag-ukraine.svg` | `1:5974` | `Flag_of_Ukraine 1` | svg | 471 | recorded URL | 27 × 27 | **ACTIVE / selected** |
| `flags/flag-union-jack.svg` | `1:5980` | `en` → `image` | svg | 1426 | recorded URL | 27.99 × 27.99 | inactive |
| `flags/flag-tricolour-white-blue-red.svg` | `1:5990` | `en` → `image` | svg | 593 | recorded URL | 27.99 × 27.99 | inactive |

### TRAP 3 — all three layers are named `en`. Files named by artwork, locale NOT assigned.

Named from the artwork by reading the fills out of each downloaded SVG. What is **measured**:

- `1:5974` — two bands, `#0057B7` over `#FFD700`. Layer is additionally named `Flag_of_Ukraine 1`.
  **Ukraine, certain** — name and artwork agree.
- `1:5980` — `#012169` field with white and red diagonal + upright crosses. **A Union Jack.** The
  layer name is `image` inside a frame named `en`.
- `1:5990` — three horizontal bands: `white` / `#0039A6` / `#D52B1E`, top to bottom.
  **A white-blue-red horizontal tricolour.** Layer name `image` inside a frame named `en`.

What is **reasoning, not measured**: `#0039A6` and `#D52B1E` in a white-over-blue-over-red order are
the colours and order conventionally used for the flag of the Russian Federation, and a Union Jack is
conventionally the flag used for English. Neither node carries any locale metadata, a country code, or
a name other than the boilerplate `en`. **No locale code has been assigned to any file.** Inventory
§11 q3 stays open — the owner must say which three languages these are and what the URL locales are.

Two more measured details worth carrying:

- Both inactive flags are drawn **wider than their clip**: the Union Jack's paths run x −13.5 → 41.9
  and the tricolour's −6.998 → 34.987, inside a 27.99 viewBox. They are cover-cropped horizontally by
  the round frame. The Ukraine flag alone is drawn exactly 0 → 27 with an `rx="13.5"` clipPath, i.e.
  it is the one authored to fit the circle.
- The middle pill `1:5977` is named `Background`, not `Link`, unlike pills 1 and 3 (inventory §11 q11).

---

## 4. Not harvested, on purpose

| item | node | why |
| --- | --- | --- |
| Dashed divider | `1:5935`, `1:5967` | Reproducible as `border-top: 1px dashed #1E2A44`. Inventory §4 already read its stroke out of the SVG. Shipping it as an asset would be a file for one CSS line. |
| `new-games-section` | `1:5418` | Inside 1:5417 but not the footer; another area owns it (inventory §0, §7). |
| Legal / licence / age-rating / social art | — | **Measured absent** from the whole 1:5607 subtree (inventory §6). Nothing to download, and nothing may be invented. |

---

## 5. Budget

| | |
| --- | --- |
| Figma MCP calls allowed | 6 |
| Figma MCP calls spent | **1** (`download_assets` on `1:5623`) |
| Assets from recorded URLs | 49 of 50 raw exports |
| Quota / limit message seen | **no** |

All recorded URLs in inventory §9 were still live at harvest time. They will not be for long — they
expire roughly 7 days after the `get_design_context` call that minted them, which was earlier the
same day this manifest was written.
