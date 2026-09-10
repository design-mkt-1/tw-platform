# Manifest — promo area

File key `s2CqwGqe0O0FcALhBNlTRe`. Target dir `public/images/promo/`.
Sources read: `01-casino-top.md` (hero `1:3302`), `03-casino-rows-b.md` (tournament `1:4545`),
plus cross-checks in `07-sport.md` / `23-gap-sport-chrome.md`.

**Figma MCP calls spent: 0.** Every recorded URL was still live; nothing needed re-minting.

## Downloaded

| File | Node | Figma layer name | Format | Bytes | Intrinsic px | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `public/images/promo/hero-welcome-sport-bonus.png` | `1:3307` (= `1:3319`, same file on both slides) | hero slide background, inside "WELCOME Sport bonus UA" | PNG | 2 311 943 | 4093 x 1270 | recorded URL (`d4c14b97…png`) |
| `public/images/promo/tournament-spin-challenge.png` | `1:4702` | tournament card image layer, "Поточні Турніри" / `СПІН-ЧЕЛЕНДЖ` | PNG | 589 785 | 1573 x 478 | recorded URL (`494d1aea…png`) |
| `public/images/promo/sport-welcome-bonus-photo.png` | `1:6031` | `enhanced_…6krli0pce31dlxk4zab7_1 (1) 1` — sport WELCOME banner photo | PNG | 4 557 445 | 4094 x 2368 | recorded URL (`18b8ed18…png`, the fresher one from `23-gap-sport-chrome.md`) |
| `public/images/promo/sport-welcome-bonus-glow.svg` | `1:6032` | `Ellipse 4` — sport WELCOME banner glow | SVG | 664 | viewBox 0 0 427 355 | recorded URL (`098ae5a1…svg`) |

All four verified on disk: the three PNGs start `89 50 4E 47 0D 0A 1A 0A`, the SVG starts `<svg`.
No 0-byte and no HTML-error bodies.

## Tournament bitmap — which one did we get

**Full-bleed source. CSS must re-crop it.** (Measured.)

- The card `1:4701` is 358 x 220 → aspect **1.627**.
- The exported file is **1573 x 478** → aspect **3.291**. It does not match the card, so this is
  not the already-cropped 358 x 220 view.
- The recorded placement of the bitmap inside the card is `width 273.72%`, `height 128.21%`,
  `left -102.53%`, `top -28.18%`. Those percentages are relative to the 358 x 220 box, so they
  reproduce the design regardless of the file's intrinsic size:

```css
.tournament-card { position: relative; width: 358px; height: 220px;
                   overflow: hidden; border-radius: 24px; background: #11111A; }
.tournament-card > img { position: absolute;
                         width: 273.72%; height: 128.21%; left: -102.53%; top: -28.18%; }
```

- Cross-check, and the one thing that is *reasoning* rather than measurement: 358 x 2.7372 =
  979.9 and 220 x 1.2821 = 282.1 → rendered aspect 3.474, against the file's 3.291. The 5.6%
  difference means Figma's fill transform is slightly non-uniform; the exporter hands back the raw
  source bytes, not the composited crop. Using the percentages above sidesteps this entirely.
  Do **not** derive the crop from the file's own pixel dimensions.

## Hero bitmap — also a crop, in the other direction

The file matches its Figma layer exactly: 4093 x 1270 is 700 x 217 at ~5.85x (aspect 3.2228 vs
3.2258, within 0.1%). But that 700 x 217 layer is itself placed at **(-258, -35)** inside a
340 x 170 `overflow: clip` slide — the slide shows a 340 x 170 window of it. In slide-relative
percentages: `width: 205.88%; height: 127.65%; left: -75.88%; top: -20.59%`.
Both slides `1:3306` and `1:3318` carry the same file.

## Badge and CTA artwork — not assets

`get_design_context` on `1:3302` succeeded and returned an asset URL for the sibling image node
`1:3307`, and **no URL for any of these**. They are live text plus CSS, not exported vectors.
(Measured — same call, one node exported, the others not.)

| Node | What it is | Build as |
| --- | --- | --- |
| `1:3310` / `1:3322` promo badge | box: gradient `rgba(255,140,0,.15)→rgba(255,69,0,.15)`, border `0.553px rgba(255,140,0,.25)`, radius `552.388px`, shadow `0 0 6.635px rgba(255,140,0,.12), 0 2.212px 6.635px rgba(0,0,0,.25)` | CSS |
| `1:3311` / `1:3323` badge text | three literal runs `✦ ` + `вітальний пакет казіно` + ` ✦`, Outfit ExtraBold 800, `#FFAE00`, uppercase, tracking `0.5529px`; the two `✦` at **7.741px**, the words at **10px** | text — the star is the character U+2726, not an icon file |
| `1:3316` / `1:3328` wager badge | box: `rgba(255,149,0,.1)`, radius `3.318px`, padding `1.659px 4.424px` | CSS |
| `1:3317` / `1:3329` wager text | `20X WAGER`, Inter Bold 700 10px `#FFAE00`, tracking `0.2765px` | text |
| `1:3308` / `1:3320` CTA | gradient `#FF8C00→#FF4500`, radius 6, `drop-shadow(0 8px 12px rgba(255,69,0,.33))`, `inset 0 1px 0 rgba(255,255,255,.25)` | CSS |
| `1:3309` / `1:3321` CTA label | `отримати бонус`, Outfit Bold — 12px capitalize on slide A, **10px uppercase** on slide B | text |
| `1:3330` carousel indicator | four bars 40/24/16/8 x 4, radius 2, `#1E3A8A` `#3B82F6` `#F97316` `#FED7AA` | CSS |

## MISSING

None. Every promo asset that exists as an exported bitmap or vector was downloaded.

## Flags for whoever commits this

1. **The two large PNGs must go through `node scripts/to-webp.mjs public/images` before commit.**
   4.5 MB and 2.3 MB on a static export with `images: { unoptimized: true }` ships as-is.
2. `sport-welcome-bonus-photo.png` and `sport-welcome-bonus-glow.svg` are the **sport** page's
   WELCOME banner (`1:6027` carousel), taken here because they are promo artwork and the URLs
   were free. If the sport harvest produced the same two files under `public/images/sport/`,
   delete one copy — they are the same nodes.
3. Not taken, and out of this area: the off-screen Hero-Card slides in the sport carousel
   (`1:6046` / `1:6064` — зевс `9b52f3f0…png`, lens flare `0bdf3f2f…png`, blur blob
   `f8926888…png`). Those are English/£ casino cards that never render on the sport page;
   `23-gap-sport-chrome.md` records their URLs if anyone wants them.
