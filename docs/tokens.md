# Top-Win design tokens

## 1. What this file is

This is the only bridge between the Top-Win Figma file and the code. `tailwind.config.ts` names it
in its header comment, and the ESLint rule that rejects raw hex under `src/components/**` names it
in its error message. Every colour, type step, radius, shadow and spacing value the build is allowed
to use is listed here with the Figma node it was measured on. If a component needs a value that is
not in this table, the value gets added here first — with its node — and only then to
`globals.css` and `tailwind.config.ts`. If this file goes stale, components start carrying hex again.

Figma file key: **`s2CqwGqe0O0FcALhBNlTRe`**. Single page, `0:1 "New Platform"`.
The design is **mobile-only at 390 px**. There is no desktop frame, no tablet frame and no
breakpoint anywhere in the file. Every frame measured is 390 wide.

Measured 2026-09-10 across 18 inventory passes, using the Figma MCP (`get_metadata`,
`get_design_context`, `get_variable_defs`, `get_screenshot`), plus direct decoding of 1:1 PNG
renders and direct reading of exported SVG source. Section 10 separates what was read off a tool
from what is inference.

### Two dead nodes are excluded from this sheet

**`1:6594` ("Header Pre-login") and `1:6617` ("Header POST-login") are not part of Top-Win.**
They are leftover JACKPOT headers pasted onto the canvas: background `#080814`, English `Log In` /
`Sign In`, a gold `#F0C775 → #C6903D` gradient button, an emerald `$ 140.00` balance pill, and a
crown-over-`JACKPOT` wordmark. They are standalone frames at canvas (2184, 633) and are **not
children of any screen** — no screen frame in the file instantiates them.

`00-tokens.md` measured them and recorded `#080814` as "app header background". **That is wrong for
Top-Win.** The real headers are:

| Header | Node | Background |
| --- | --- | --- |
| Casino, pre-login | `1:3290` | `#E8F1FC` |
| Casino, post-login | inside frame `1:581` (`1:582`) | `#E8F1FC` |
| Sport | `1:5995` | `#E8F1FC` |

Every value whose only source was `1:6594` or `1:6617` has been dropped: `#080814`, the gold
gradient `#F0C775 → #C6903D`, `#00F299`, `rgba(0,92,64,0.04)`, `rgba(0,163,114,0.5)`, the
`#00F299 → #3B82F6` plus-button gradient, `#000000`-on-gold, and the Inter 14/600 and 14/800 button
steps. Two values that *also* appear on live nodes survive and are recorded below:
`#191970` (Navy) and `rgba(198,144,61,0.25)` — the latter as a shadow on the live DEPOSIT button
`1:6836`, which is the same `#C6903D` gold at 25 %.

---

## 2. Figma variables

Six named values exist in the file. That is the entire design system Figma carries.

| Variable | Value | Bound on | What it paints |
| --- | --- | --- | --- |
| `Orange` | `#FF4500` | `1:6518` (raised nav button glow, `#FF4500` at 21 % inside the exported SVG filter); end stop of the CTA gradient on `1:3297`, `1:3308`, `1:6002`, `1:6036`, `1:5235`, `1:6653`, `1:6832` | the platform orange |
| `Navy` | `#191970` | `1:6490` (bottom-nav bar plate, `fill-opacity 0.8`); `1:588` / `1:95` balance text; `1:6387` league-card sport name | plate fill and two text runs |
| `BG main` | `#FFFFFF` | `1:6488` (bottom navbar) | page white |
| `Footnote_e` | Roboto Bold 700, 14 / 16, letter-spacing 0 | `1:5938`, `1:5953` | footer column headings |
| `Footnote_m` | Roboto Medium 500, 14 / 16, letter-spacing 0 | `1:5941`–`1:5951` | footer navigation links |
| `Capation1` | Roboto Regular 400, 13 / 16, letter-spacing 0 | `1:5956`–`1:5966` | footer policy links |

`Capation1` is spelled exactly that way in the file. It is a misspelling of "Caption", and it is
the literal variable name — do not correct it when mapping, or the mapping breaks.

**`Orange` and `Navy` are live variables, not dead template leftovers.** The first pass
(`00-tokens.md`, UNKNOWN Q1 and Q2) could not find a node using either and recorded them as
possibly dead. `20-gap-bottom-nav.md` settled it by reading the exported SVG source of the navbar:
the bar plate is `<path fill="#191970" fill-opacity="0.8"/>`, and the raised button's glow filter is
`feColorMatrix` `1 / 0.270588 / 0` at alpha `0.21`, i.e. `#FF4500` at 21 %. Both were then confirmed
against the 1:1 render.

**The code cannot read its palette from Figma.** Six variables against roughly forty raw values.
`get_variable_defs` returned `{}` on `1:4140` and on `1:4888` — those subtrees bind nothing at all.
Every colour in section 3 that is not one of the six above is a raw literal in the file. The code
therefore hard-codes from measurement, and this document is the record of that measurement.

> One loose end: `24-gap-menu-type.md` reports the tool's own style summary on `1:6817` as
> `Orange: #FF4500`, `Navy: #191970`, **`white_gg: #DAD7E0`** — a seventh name that appears in no
> other pass and that no measured node consumes. Unresolved: is `white_gg` a real seventh variable,
> or a stale style dragged in with the menu panel? One `get_variable_defs` on `1:6817` would say.

---

## 3. Colour tokens

Proposed CSS custom-property names. Kebab-case, named for the role. Never named for the colour —
`--blue` ages badly the moment the blue changes.

### 3.1 Page and surfaces

| Token | Value | Measured on | Paints |
| --- | --- | --- | --- |
| `--bg-page` | `#F7FAFF` | `1:4888`, `1:5072`, `1:5240` (casino section wrappers, declared); `1:3391` (ticker); `1:5994` (sport page, ten pixel samples across five bands) | the page canvas behind every section |
| `--bg-surface` | `#FFFFFF` | variable `BG main` bound on `1:6488`; `1:6383` league card; `1:6010` selected Prematch tab; `1:6334` selected sport filter; `1:3787` provider circle; `1:6330` "More leagues"; `1:6643` / `1:6824` menu header and identity band; search field inside `1:7365` | cards and selected surfaces |
| `--bg-search-panel` | `#EFF6FF` | `1:7363`, `1:7595`, `1:7806`, `1:7214` (all four search roots, pixel) | the search panel's own page fill |
| `--bg-header` | `#E8F1FC` | `1:3290` (declared), `1:582` (declared), `1:5995` (pixel, full 390 × 60 band) | the app header bar, both auth states, casino and sport |
| `--surface-tint` | `#E8F1FC` | `1:3337` and `1:6018` switcher tracks; `1:6023` / `1:6025` Favorites and Gifts; `1:6090` league tile; `1:6384` league-card header; `1:6406` odds cell; `1:6857` menu row; `1:6838` ID field | tinted control surface |
| `--surface-track` | `#DCEBFF` | `1:6009` Prematch/Live track; `1:6337` sport-filter count badge (identical in both states) | segmented track and count pill |
| `--surface-muted` | `#EDF5FF` | `1:3295` and `1:6000` login button; `1:3299`, `1:593`, `1:6004` search button; `1:3781` row search button; `1:6340` / `1:6355` unselected sport pills; `1:6651` menu login button | secondary control fill |
| `--chip-link-bg` | `#EFF6FF` | `1:5052`, `1:5397`, `1:4320`, `1:3570`'s parent (see-all pills); `1:6085` "Всі ліги"; `1:6378` "Всі події"; `1:7390` btn-close; `1:7258` empty-state icon chip; `1:6646` menu close button | link chips and ghost circles |
| `--chip-active` | `#C9DCF4` | `1:3338` (casino), `1:6019` (sport) | selected segment in the category switcher |
| `--surface-row` | `#F5F8FD` | `1:6391` match row | the row inside a league card |
| `--bg-menu-panel` | `#F4F6FA` | `1:6655`, `1:6854` | slide-in menu body |
| `--bg-footer` | `#000D3B` | `1:5607` | footer |
| `--surface-footer-card` | `rgba(11,16,32,0.15)` | `1:5608` | payment-logos card |
| `--surface-footer-tile` | `rgba(11,16,32,0.1)` | `1:5612` and its six siblings | one payment tile |
| `--bg-card-dark` | `#11111A` | `1:5227`, `1:4701` | tournament / lottery card |
| `--bg-slide` | `#000000` | `1:3306`, `1:3318`, `1:6030`, `1:6038` | hero-slide base under the artwork |
| `--bg-game-card` | `rgba(240,243,255,0)` | `1:3575`, `1:4326`, `1:5057` | game-tile wrapper — alpha 0, deliberately transparent |
| `--chip-info-bg` | `#DBEAFE` | search chips 1/3/5 (`1:7396`…); `1:7410` recent item; `1:7843` suggestion row; header square 4 `1:7384` | search blue chip and row fill |
| `--chip-warn-bg` | `#FFF7ED` | search chips 2/4; `1:7846` suggestion badge | search orange chip fill |
| `--balance-pill-bg` | `#FFE2D5` | `1:586`, `1:93` | post-login balance chip. Used nowhere else in the file |
| `--avatar-bg` | `#DDE2ED` | `1:6826` | menu avatar circle |
| `--copy-btn-bg` | `rgba(216,221,231,0.6)` | `1:6843` | copy-ID button. Over `--surface-tint` it composites to the `#DFE5F0` the pixel pass measured |
| `--deposit-btn-bg` | `#00B579` | `1:6836` | DEPOSIT button in the menu identity block |
| `--contact-accent` | `#10B981` | `1:6983` border + label, `1:6985` fill | Support (outlined) and Vip Manager (filled) |
| `--cta-search-bg` | `#F97316` | `1:7263` | `Усі провайдери` empty-state CTA |
| `--join-pill-bg` | `rgba(242,193,70,0.5)` | `1:5234`, `1:4708` | join-timer pill (with `backdrop-filter: blur(2px)`) |
| `--wager-badge-bg` | `rgba(255,149,0,0.1)` | `1:3316`, `1:6053` | `20X WAGER` badge |
| `--sport-badge-bg` | `rgba(0,122,255,0.1)` | `1:6033` | sport banner badge (with `backdrop-filter: blur(8.539px)`) |
| `--ticker-thumb-bg` | `rgba(0,0,0,0.2)` | `1:3393`, `1:3401`, `1:3408` | fill behind the ticker thumbnail artwork |
| `--lang-flag-scrim` | `rgba(17,20,24,0.2)` | `1:6968` | scrim under the menu language flag |
| `--nav-plate` | `rgba(25,25,112,0.8)` — variable `Navy` at 80 % | `1:6490` | bottom-nav bar plate. Glass: 80 % over `backdrop-filter: blur(2.5px)` (Figma background-blur radius 5), clipped to the plate path so the notch stays sharp |

**`#E8F1FC` is measured for the same role in two independent areas** — `1:3290` (casino header,
declared) and `1:5995` (sport header, decoded from a 1:1 render). Two areas, two methods, one hex:
that is evidence `--bg-header` is a real token and not a one-off.

**`#F7FAFF` likewise** — declared on the casino section wrappers `1:4888` / `1:5072` / `1:5240`, and
independently decoded as ten flat pixel samples across the sport frame `1:5994`.

**Two hex collisions worth knowing before you name anything:**
`#EFF6FF` is both the search panel's page fill and the see-all chip's fill, so on a search screen a
chip has no contrast against its own background (the empty-state icon chip at `1:7258` is a bare
`#BFDBFE` ring for exactly this reason). `#92BDF3` is both the section icon colour and the `ID:`
label colour. `#F97316` is both the search CTA fill and the ticker's alternate amount colour. These
are separate tokens on purpose: the roles are independent and one of them will move first.

### 3.2 Text

| Token | Value | Measured on | Paints |
| --- | --- | --- | --- |
| `--text-title` | `#07134F` | `1:4318`, `1:5045`, `1:6377`, `1:7379`; `1:3414`'s title pixel-confirmed | section titles, and team names `1:6398` / `1:6399` |
| `--text-primary` | `#102A67` | `1:3342`, `1:3296`, `1:6011`, `1:6015`, `1:6020`, `1:6022`, sport-filter labels `1:6336`, `1:7410`, `1:7831`, menu row labels `1:6865`–`1:6958`, `1:6835`, `1:6842` | the default dark-blue body colour |
| `--text-navy` | `#191970` (variable `Navy`) | `1:6387` league-card sport name; `1:588` / `1:95` `$ 140.00` | two specific runs, not general body text |
| `--text-widget-title` | `#173B68` | `1:6084` | "Рекомендовані ліги" only |
| `--text-muted` | `#71809A` | `1:3378`, `1:3384`, `1:3390`; `1:6345` unselected count; unselected sport icons `1:6341` / `1:6356` | inactive labels and inactive icons |
| `--text-meta` | `#758098` | `1:6390`, `1:6388`, `1:6389`, `1:6394`, `1:6396`, `1:6402`–`1:6404` | league name, separators, kickoff time, `1 Н 2` labels |
| `--text-body-muted` | `#64748B` | `1:7262` empty-state body; `1:3397` masked player in the ticker | secondary prose |
| `--text-placeholder` | `#94A3B8` | `1:7388`, `1:7620`, `1:7239`; `1:3398` ticker game name | input placeholder |
| `--text-subtle` | `#839CBF` | `1:7845`, `1:7854` | suggestion subtitle |
| `--text-link` | `#1E40AF` | `1:5053` and siblings (`Всі (120) `), `1:6086`, `1:6379`; also the chevron's `stroke` | link-chip label and its chevron |
| `--text-accent` | `#1E3A8A` | search chips 1/3/5, `1:7844`, `1:7853`, `1:7261`, indicator segment 1 | search blue |
| `--text-label` | `#3B82F6` | `1:7394`, `1:7407`, `1:7837`, `1:7266` section labels; caret `1:7389`; field and empty-state magnifier glyphs; `1:6647` menu close glyph; indicator segment 2 | small uppercase labels and blue glyphs |
| `--text-count-active` | `#17458F` | `1:6338` count text and `1:6335` football icon, both on the selected pill | selected-filter count and icon |
| `--text-on-dark` | `#FFFFFF` | `1:6493`, `1:6502`, `1:6511`, `1:6515` nav labels; `1:5233`; `1:5239`; `1:3298`; `1:6837`; `1:6834` | text on dark surfaces |
| `--text-nav-active` | `#FFB095` | `1:6506` label **and** `1:6504` icon (baked `fill="#FFB095"` in `sport.svg`) | the active bottom-nav tab |
| `--text-footer-heading` | `#E6EDF5` | `1:5610`, `1:5698` | the two uppercase footer headings |
| `--text-footer-link` | `#AFC1E8` | `1:5938`, `1:5953` and all twelve link rows | footer column headings and links |
| `--icon-section` / `--text-id-label` | `#92BDF3` | `1:3426` section flame icon (pixel **and** the SVG's own `fill`); `1:6841` `ID:` label | two roles, one hex |
| `--text-win-up` | `#16A34A` | `1:3396` | ticker amount, entry 1 |
| `--text-win-alt` | `#F97316` | `1:3404`, `1:3411` | ticker amount, entries 2 and 3. The rule that switches between this and `--text-win-up` is not in the design |
| `--text-badge-warn` | `#E67508` | `1:7847`, `1:7856` | `СЛОТИ` / `ЛАЙВ` suggestion badges |
| `--text-chip-warn` | `#C2410C` | search chips 2/4 | orange chip label |
| `--text-promo` | `#FFAE00` | `1:3311`, `1:3323`, `1:3317`, `1:3329` | hero promo badge and wager badge |
| `--text-tournament-title` | `#FF8700` | `1:5232`, `1:4706` | `СПІН-ЧЕЛЕНДЖ` / `2000` |
| `--text-banner-offer` | `#0D1A59` | `1:6035` | `225% ДО 15000 ₴` |
| `--text-banner-badge` | `#007AFF` | `1:6034` | `ВІТАЛЬНИЙ БОНУС` |
| `--text-more` | `#FF8101` | `1:6853` | the menu "More" toggle |
| `--accent-hot` | `#F45B24` | `1:6407`–`1:6411` and nine sibling odds values; `1:6395` `● EP`; `1:6484` bet-slip FAB fill; `1:6516` active nav dot (SVG `<circle fill="#F45B24">`, pixel-identical) | odds, live marker, FAB, active dot |

### 3.3 Accents, icons and gradients

| Token | Value | Measured on | Paints |
| --- | --- | --- | --- |
| `--icon-menu-row` | `#1677E8` | `1:6861` and its seven siblings — the **declared `fill`** of the SVG exports | the eight menu row icons, each painted at `opacity: 0.5` |
| `--icon-menu-terms` | `#7FB4F2` | `1:6962` — the **declared `stroke`** of the SVG export | the Terms document icon, painted at `opacity: 0.5` |
| `--icon-chevron` | `#626A7A` | `1:6667`, `1:6706`, `1:6749` (pixel; edges ramp `#6B7382`…`#949BAB`) | `weui:arrow-filled` in the menu |
| `--icon-star-active` | `#1677E8` | `1:6024` | the `★` in the sport Favorites button (a text glyph, 25 px) |
| `--icon-live` | `#FF7A45` | `1:6013` (pixel, flat) | the Live-tab stream icon |
| `--dot-1` | `#1E3A8A` | `1:3331`, and the same segment in `1:7358` | carousel indicator, widest segment (40 px) |
| `--dot-2` | `#3B82F6` | `1:3332`, `1:7358` | segment 2 (24 px) |
| `--dot-3` | `#F97316` | `1:3333`, `1:7358` | segment 3 (16 px) |
| `--dot-4` | `#FED7AA` | `1:3334`, `1:7358` | segment 4 (8 px) |
| `--grad-cta` | `linear-gradient(to right, #FF8C00, #FF4500)` | `1:3297` register; `1:3308` / `1:3320` hero CTA; `1:6002`; `1:6036`; `1:5235` / `1:4709` join button; `1:6653` menu register; `1:6832` VIP badge | **the** primary-button recipe, seven independent nodes |
| `--grad-nav-button` | `linear-gradient(180deg, #FE8200, #FE4800)` | `1:6518` | the raised centre nav button |
| `--grad-promo-badge` | `linear-gradient(to right, rgba(255,140,0,0.15), rgba(255,69,0,0.15))` | `1:3310`, `1:3322` | hero promo badge |
| `--grad-flag-active` | `linear-gradient(118.99639858552104deg, #1E40AF 5.5841%, #3B82F6 99.924%)` | `1:5970` | the selected language flag ring in the footer |
| `--grad-nav-plate-stroke` | `linear-gradient(to top, transparent, #FFFFFF)`, 1 px | `1:6490` (second path in the export) | a 1 px rim, opaque white along the bar's top edge, fully transparent by its bottom edge. Follows the notch too |

`--icon-menu-row` **was `#7FB4F2`** until the eight row icons were finally exported. That value was
not a bad sample — it is exactly what the design renders, and it is exactly what the app still
renders. It was the *composite*, not the paint: seven of the eight glyphs declare `fill="#1677E8"`
inside a group at `opacity="0.5"`, and `#1677E8` at 50% over the row fill `#E8F1FC` is `#7FB4F2` in
all three channels, to the byte. The pixel pass sampled the result of a blend and recorded it as the
source. The eighth, REFERRAL (`1:6911`), carries no opacity group and declares `fill="#7FB4F2"`
outright — the same 50% pre-composited by hand in Figma, which is why the two disagree at all.

So the token now holds the paint and the component holds the 0.5. Nothing about the rendered colour
changed. What changed is that the token is now a value that survives being put on a different
background, which `#7FB4F2` was not.

The same export pass corrects `24-gap-menu-type.md` §5, which recorded `opacity: 0.5` on CASINO and
PROMOTIONS only and "the other 6 row icons are full opacity". Seven of the eight declare it; the
eighth has it baked into its fill. There is no dim/bright distinction between the rows.

The Terms document icon (`1:6962`) is a third case: `stroke="#7FB4F2"` *and* a group at
`opacity="0.5"`, i.e. the row-icon blue through two 50% steps. It was drawn as `--icon-menu-row` at
`opacity: 0.25`, which lands within 3/255 per channel of the declared composite (`#BDD6F6` against
`#BAD5F6`) — the residual is the difference between the row fill `#E8F1FC` the first 50% was baked
against and the panel `#F4F6FA` the second falls on. **It now has `--icon-menu-terms`, and the
approximation is gone.**

The token holds `#7FB4F2` — the declared stroke — and the component supplies the remaining
`opacity: 0.5`, exactly as `--icon-menu-row` holds `#1677E8` and the row supplies its 0.5. Blending
by hand confirms it: `(0x7F+0xF4)/2 = 0xBA`, `(0xB4+0xF6)/2 = 0xD5`, `(0xF2+0xFA)/2 = 0xF6` →
**`#BAD5F6`**, the declared composite to the byte. Storing `#BAD5F6` directly would have been one
fewer step and wrong for the same reason `#7FB4F2` was wrong as `--icon-menu-row`: it bakes in a
background, so it stops being correct the moment the icon moves off `#F4F6FA`.

### The six panel-chrome glyphs — declared paints

Exported after the eight row icons, from the per-node asset URLs rather than `download_assets`
(`src/lib/assets.ts` records why; two of the six had no other route). Five declare exactly the
token they are painted with:

| Glyph | Node | Declared | Painted with | Agrees |
| --- | --- | --- | --- | --- |
| Avatar person | `1:6828` | `stroke="white"` | `--text-primary` `#102A67` | **no — see below** |
| Copy button | `1:6844` | `fill="#191970"` | `--text-navy` | yes, exactly |
| Close `x` | `1:6822` | `stroke="#3B82F6"` | `--text-label` | yes, exactly |
| "More" arrow | `1:6850` | `fill="#FF8101"` | `--text-more` | yes, exactly |
| Support headset | `I1:6984;2642:42639` | `fill="#10B981"` | `--contact-accent` | yes, exactly |
| WhatsApp mark | `1:6988` | `fill="white"` | `--text-on-dark` | yes, exactly |

**The avatar is the one place in this repo where the design's declared colour is deliberately not
shipped.** `1:6828` declares `stroke="white"`; white on the `#DDE2ED` avatar circle (`--avatar-bg`,
node `1:6826`) measures **1.35:1**, a faint outline rather than a figure. The owner compared the
declared white against the live render side by side on 2026-09-10 and chose `--text-primary`, which
is what the site already showed. That decision came from the comparison, not from the file — it is
the one documented exception to §7's "the design's colours ship unchanged", and it is recorded here
and at the call site in `MenuPanel.tsx` so it is findable rather than quietly complied with. Do not
"correct" it back to white on the strength of the export alone.

The `1:6850` arrow points **up** in the file (path apex at y 7.08, base at y 12.9). The `Arrow`
frame carries `rotate(180)` in Figma, which is also what explains the `y=+20` offset the earlier
pass read inside a 20px-tall parent: a rotated node's bounding box, not a mislaid layer. The export
is the pre-rotation art, so `MenuPanel.tsx` reapplies `rotate-180`.

The chevron `weui:arrow-filled` (`1:6866`) declares `fill="#626A7A"`, confirming `--icon-chevron`
exactly as the pixel pass read it. That one needed no correction.

The four carousel-indicator hexes are stock Tailwind values (blue-900, blue-500, orange-500,
orange-200) and appear as a set in two unrelated places — `1:3330` (casino hero, right-aligned) and
`1:7358` (search, centred). Same four widths, same four fills, same 4 px height and 4 px gap. They
are the same object justified differently, not two designs.

The four bars **decrease monotonically in width and fade in colour**, which is not how an
active/inactive pair reads. Which bar means "current" is not derivable from the file, and the casino
hero has 4 bars over 2 authored slides.

Off-screen only, recorded so nobody spends a Figma call rediscovering it: the two Hero-Card slides
`1:6046` / `1:6064` parked in the sport carousel carry
`linear-gradient(to right, #0b1530, #141d40 50%, #0d2c54)` plus `#ffae00`, `#ffb900`, `#ff9500`,
`#00f0ff` and `#8e9bb0`. They are English, £-denominated casino cards in a Ukrainian sportsbook
carousel, never visible at 390 px. **Do not ship these as tokens.**

### 3.4 Borders

| Token | Value | Measured on | Paints |
| --- | --- | --- | --- |
| `--border-chip` | `#BFDBFE` | `1:5052` / `1:5397` / `1:4320` see-all pills; `1:6085`; `1:6378`; search field (**2 px**); search chips 1/3/5 (1 px); `1:7390` btn-close; `1:7258` icon chip; `1:6821` menu close button | the default 1 px chip border |
| `--border-warn` | `#FED7AA` | search chips 2/4; `1:7846` suggestion badge | orange chip border |
| `--border-divider` | `#DCEBFF`, 1 px, `stroke-dasharray: 2 2` | `1:3567`, `1:3741`, `1:3779`, `1:4119`, `1:4319`, `1:4524`, `1:4700`, `1:4867`, `1:5051`, `1:5226`, `1:5396`, `1:5570`, `1:6700` (`Vector 100` in every section header) | the flexible rule between a section title and its right-hand control. **Dashed, not solid** |
| `--border-ticker-divider` | `#CBD5E1`, 1 × 44 vertical | `1:3399` | the single vertical hairline in the recent-wins ticker |
| `--border-footer` | `#1E2A44` | `1:5607` top border; `1:5935` and `1:5967` dashed dividers (`stroke-dasharray: 4 4`); `1:5972` active-flag border | footer rules |
| `--border-panel` | `#D8DDE7` | `1:6817` `border-right` | the menu panel's right edge. Off-screen at 390 px; keep it for wider viewports |
| `--border-on-dark-06` | `rgba(255,255,255,0.06)` | `1:5608` | payment card |
| `--border-on-dark-08` | `rgba(255,255,255,0.08)` | `1:5612`+ payment tiles; `1:5227` / `1:4701` tournament card | dark-surface hairlines |
| `--border-on-dark-09` | `rgba(255,255,255,0.09)` | `1:6033` (0.854 px) | sport banner badge |
| `--border-on-dark-10` | `rgba(255,255,255,0.1)` | `1:3393` | ticker thumbnail |
| `--border-promo` | `rgba(255,140,0,0.25)`, 0.553 px | `1:3310` | hero promo badge |

Two dividers, two dash patterns: the section-header rule is `#DCEBFF` **2 on / 2 off**, the footer
divider is `#1E2A44` **4 on / 4 off**. Both were read out of the exported SVG `stroke` attribute;
the section-header one was then confirmed in pixels as a 4 px period. Neither needs to ship as an
asset — `border-top: 1px dashed` reproduces both.

Nothing else in the design carries a border. The category switcher, both headers, the game card,
the provider circle, the odds cell and every sport-filter pill are borderless — separation is done
with fill and shadow alone. That was checked in pixels, not assumed: a row scan across every
sport-filter pill edge steps straight from page to fill with no intermediate stroke pixel.

---

## 4. Type

### 4.1 The three families that carry the UI

| Family | Where it is used | Nodes |
| --- | --- | --- |
| **Inter** | interactive chrome — segmented switches, category chips, sport filters, the whole search panel, the tournament card, the menu identity block, the bet-slip FAB | `1:6011`, `1:6020`, `1:3342`, `1:6336`, `1:7388`, `1:7844`, `1:5232`, `1:6835`, `1:6487` |
| **Roboto** | section titles, match data, the menu row list, the bottom-nav labels, the footer link columns | `1:6377`, `1:6398`, `1:6407`, `1:6865`, `1:6493`, `1:5941` |
| **Outfit** | buttons only — the two auth buttons and the two hero CTAs | `1:3296`, `1:3298`, `1:3309`, `1:6037`, `1:6652`, `1:6654` |

**Only two of the six families can render this design's own copy. Measured, not assumed** — read
out of Next's Google Fonts catalogue (`next/dist/compiled/@next/font/dist/google/font-data.json`)
on 2026-09-10:

| Family | Subsets Google publishes | Can it draw Ukrainian? |
| --- | --- | --- |
| Inter | cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, vietnamese | yes |
| Roboto | cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, math, symbols, vietnamese | yes |
| Outfit | latin, latin-ext | **no** |
| Archivo Narrow | latin, latin-ext, vietnamese | **no** |
| Big Shoulders Display | not in the catalogue at all | **no** |
| Roboto Flex | — | not loaded; static Roboto renders it identically, see §4.2 |

The three that cannot are each assigned to Cyrillic strings and nothing else. Outfit carries
`Увійти`, `Реєстрація`, `Депозит` and the hero CTA — four strings, all Cyrillic. Archivo Narrow
carries one string, `вітальний бонус`. Big Shoulders Display carries `225% ДО 15000 ₴`.

**So Figma was already falling back when it rendered those frames.** What the design *looks like*
is not Outfit either — a font file with no Cyrillic glyphs cannot draw them anywhere, in Figma or
in a browser. Substituting Inter matches the render rather than departing from it.

**What the build does:** `layout.tsx` loads Inter and Roboto with `subsets: ['latin', 'cyrillic']`.
`tailwind.config.ts` keeps a `font-outfit` name that resolves to Inter, so every call site the
substitution touches stays visible and swapping in a Cyrillic-capable face later is one line.

**What this costs, and who should decide it:** the two auth buttons and both hero CTAs lose Outfit's
narrower, more geometric letterforms. If the brand needs that shape, the fix is a face that ships
Cyrillic — Manrope, Montserrat and Nunito Sans are the near neighbours in Google Fonts and all three
carry the subset. That is a designer's call, not a developer's, and nothing in the file answers it.

### 4.2 Three more families appear, on four surfaces

Measured, and it contradicts a tidy three-family story, so it is recorded rather than smoothed over.

| Family | Where | Nodes | Note |
| --- | --- | --- | --- |
| **Roboto Flex** | the two uppercase footer headings; the post-login balance figure; all three recent-wins ticker lines | `1:5610`, `1:5698`, `1:588` / `1:95`, `1:3396`–`1:3398` | The variable superset of Roboto. Carries a full ten-axis `fontVariationSettings` string on the footer headings and the balance: `"GRAD" 0, "XOPQ" 96, "XTRA" 468, "YOPQ" 79, "YTAS" 750, "YTDE" -203, "YTFI" 738, "YTLC" 514, "YTUC" 712, "wdth" 100`. Every one of those is the axis default, so a static Roboto at the same weight renders identically |
| **Archivo Narrow** | the sport banner badge, one string | `1:6034` (`вітальний бонус`) | Cyrillic — needs the cyrillic subset too |
| **Big Shoulders Display** | the sport banner headline, one string | `1:6035` (`225% ДО 15000 ₴`) | Cyrillic `ДО` — needs the cyrillic subset too |

Plain Roboto nodes carry only `"wdth" 100`, which is the default width axis and safe to drop.

### 4.3 The scale

59 rows: 58 real steps plus one spacer. Size / line-height / weight / family / letter-spacing /
nodes. Odd values are reproduced literally — see the note under the table.

| # | Size | Line-height | Weight | Family | Letter-spacing | Nodes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 61.464px | 1 | 900 Black | Big Shoulders Display | −1.2293px | `1:6035` span 2 — a lone space that forces a line break. Not a text style; a spacer |
| 2 | 29.4px | 1 | 900 Black | Big Shoulders Display | −1.2293px | `1:6035` spans 1 and 4 (`225%`, `15000 ₴`), uppercase |
| 3 | 28px | normal | 700 Bold | Inter | −0.5px | `1:5232`, `1:4706` |
| 4 | 25px | normal | 400 Regular | Inter | — | `1:6024` — the `★` glyph in Favorites |
| 5 | 22px | normal | 400 Regular | Inter | — | `1:6026` — the `🎁` glyph in Gifts |
| 6 | 18px | 22px | 700 Bold | Roboto Flex | — | `1:5610`, `1:5698`, uppercase, centred |
| 7 | 18px | normal | 500 Medium | Roboto | — | `1:4318`, `1:5045`, `1:6377`, `1:7379` and every other section title |
| 8 | 17px | 22px | 400 Regular | Inter | — | `1:6841` (`ID:`), `1:6842` (`23885`) |
| 9 | 16px | 1.2 | 800 ExtraBold | Inter | — | `1:7261` empty-state title |
| 10 | 15px | normal | 400 Regular | Inter | — | `1:6011`, `1:6015` (Прематч / Лайв), `1:6487` (`Купон`) |
| 11 | 15px | normal | 700 Bold | Outfit | — | `1:3314`, `1:3315`, uppercase |
| 12 | 15px | normal | 500 Medium | Inter | — | `1:7853` **only** — a stray override, see 4.4 |
| 13 | 14.7px | 1 | 900 Black | Big Shoulders Display | −1.2293px | `1:6035` span 3 (`ДО ` — trailing space is in the string) |
| 14 | 14px | 18px | 600 SemiBold | Roboto Flex | — | `1:588`, `1:95` (`$ 140.00`) |
| 15 | 14px | 16px | 700 Bold | Roboto | 0 | variable `Footnote_e` — `1:5938`, `1:5953` |
| 16 | 14px | 16px | 500 Medium | Roboto | 0 | variable `Footnote_m` — `1:5941`, `1:5943`, `1:5945`, `1:5947`, `1:5949`, `1:5951` |
| 17 | 14px | normal | 700 Bold | Inter | — | `1:6835` username, with `text-overflow: ellipsis` |
| 18 | 14px | normal | 500 Medium | Inter | — | `1:7388` / `1:7620` / `1:7239` placeholder, `1:7831` typed query, `1:7844` suggestion title |
| 19 | 14px | normal | 400 Regular | Inter | — | `1:6396`, `1:6417`, `1:6446`, `1:6467` — the `★` in a match row |
| 20 | 14px | normal | 400 Regular | Roboto | — | `1:6387` sport name, `1:6390` league name |
| 21 | 13px | 16px | 400 Regular | Roboto | 0 | variable `Capation1` — `1:5956`, `1:5958`, `1:5960`, `1:5962`, `1:5964`, `1:5966` |
| 22 | 13px | 20px | 500 Medium | Roboto | — | menu rows `1:6865`, `1:6904`, `1:6914`, `1:6919`, `1:6935`, `1:6940`, `1:6947`, `1:6958`, plus `1:6966`, `1:6981`. `text-transform: uppercase` |
| 23 | 13px | 18px | 400 Regular | Roboto | — | `Support` (`I1:6984;2642:42640`), `Vip Manager` (`1:7013`). No transform |
| 24 | 13px | normal | 600 SemiBold | Outfit | −0.2px | `1:3296`, `1:3298`, `1:6001`, `1:6003`, `1:6652`, `1:6654`. `text-transform: capitalize` |
| 25 | 13px | normal | 700 Bold | Outfit | −0.2px | `1:6037` (`Депозит`), uppercase |
| 26 | 13px | 1.35 | 500 Medium | Inter | — | `1:3342`, `1:3378`, `1:3384`, `1:3390`. `text-transform: capitalize` |
| 27 | 13px | 1.35 | 400 Regular | Inter | — | `1:6020`, `1:6022` (Спорт / Кіберспорт) |
| 28 | 13px | normal | 400 Regular | Inter | — | sport filter labels `1:6336`, `1:6343`, `1:6357` |
| 29 | 13px | normal | 600 SemiBold | Inter | — | `1:6084`, `text-transform: capitalize` |
| 30 | 13px | 19px | 600 SemiBold | Inter | −0.26px | `I1:5235;112:330`, `I1:4709;112:330` (`Приєднатися`) |
| 31 | 13px | normal | 500 Medium | Inter | — | `1:5233` / `1:4707` subtitle, `1:7411` recent item |
| 32 | 13px | 1.4 | 500 Medium | Inter | — | `1:7262` empty-state body |
| 33 | 13px | normal | 700 Bold | Inter | — | `1:7264` (`Усі провайдери`) |
| 34 | 12px | **14.143px** | 500 Medium | Roboto | — | bottom-nav labels `1:6493`, `1:6502`, `1:6506`, `1:6511`, `1:6515` (and the ru/en variants) |
| 35 | 12px | 22px | 700 Bold | Roboto Flex | — | `1:3396`, `1:3404`, `1:3411` ticker amount |
| 36 | 12px | 14px | 400 Regular | Roboto Flex | — | `1:3397`, `1:3405`, `1:3412` masked player |
| 37 | 12px | 16px | 700 Bold | Roboto | — | `1:6853` (`Моre`) |
| 38 | 12px | normal | 500 Medium | Roboto | — | team names `1:6398` / `1:6399`, odds values `1:6407`–`1:6411` |
| 39 | 12px | normal | 400 Regular | Roboto | — | see-all pill labels `1:5053` and siblings, `1:6379` |
| 40 | 12px | normal | 400 Regular | Inter | — | `1:6086`, `1:6388` (`–`), `1:6389` (`♕`) |
| 41 | 12px | normal | 500 Medium | Inter | — | search chips `1:7397`, `1:7399`, `1:7401`, `1:7403`, `1:7405` |
| 42 | 12px | normal | 700 Bold | Inter | — | `1:6833` — the `★` in the VIP badge |
| 43 | 12px | normal | 800 ExtraBold | Inter | — | `1:6837` (`DEPOSIT`) |
| 44 | 12px | normal | 700 Bold | Outfit | −0.2px | `1:3309` hero CTA, slide A. `capitalize` |
| 45 | 11px | 14px | 600 SemiBold | Roboto Flex | — | `1:3398`, `1:3406`, `1:3413` ticker game name |
| 46 | 11px | normal | 800 ExtraBold | Inter | — | `1:5239`, `1:4713` timer value |
| 47 | 11px | normal | 400 Regular | Inter | — | `1:6339`, `1:6346`, `1:6358` count badges |
| 48 | 11px | normal | 500 Medium | Inter | — | `1:7845`, `1:7854` suggestion subtitle |
| 49 | 11px | normal | 600 SemiBold | Inter | — | `1:7847`, `1:7856` suggestion badge |
| 50 | 11px | normal | 700 Bold | Inter | — | `1:7394`, `1:7407`, `1:7837`, `1:7266`, `1:7245`. `uppercase` |
| 51 | 11px | normal | 700 Bold | Inter | **1.5px** | `1:6834` (`VIP`) |
| 52 | 10px | normal | 400 Regular | Inter | — | `1:5238`, `1:4712` timer label |
| 53 | 10px | normal | 700 Bold | Inter | 0.2765px | `1:3317`, `1:3329` (`20X WAGER`), uppercase |
| 54 | 10px | normal | 800 ExtraBold | Outfit | 0.5529px | `1:3311`, `1:3323`, uppercase |
| 55 | 10px | normal | 600 SemiBold | Archivo Narrow | — | `1:6034`, uppercase |
| 56 | 10px | normal | 400 Regular | Roboto | — | `1:6394` kickoff time, `1:6402`–`1:6404` (`1` `Н` `2`) |
| 57 | 10px | normal | 700 Bold **italic** | Roboto | — | `1:6395` and its three siblings (`● EP`) |
| 58 | 10px | normal | 700 Bold | Outfit | −0.2px | `1:3321` hero CTA, slide B. `uppercase`, not `capitalize` |
| 59 | 7.741px | normal | 800 ExtraBold | Outfit | 0.5529px | the two `✦` spans inside `1:3311` |

**58 real steps plus one spacer.** That is what the file contains, not a scale anyone designed.

### 4.4 Values that must be reproduced literally

- **`14.143px` line-height on the bottom-nav tab label (`1:6493` and its four siblings).** It is
  `12 × 1.17858`. Write it as `line-height: 14.143px`, not as a ratio and not rounded to 14. The
  label row sits at y 81 in a 111-tall component whose painted bar is exactly 68 tall; rounding this
  drifts the bar.
- **`−1.2293px`, `0.5529px`, `0.2765px`, `553.879px`, `61.464px`, `7.741px`** — all Figma float
  artefacts of scaled artwork, all real in the render. Reproduce as written.
- **`−0.14px` does not appear here.** It belonged only to the dead JACKPOT header buttons.
  **`−0.2px`** (the Outfit button tracking, exactly `−0.0154em` at 13px) is the live one.
- **`py: 6.606px`** on `1:3295` / `1:6651` is a Figma centring artefact, not a design value. Use
  `align-items: center` and drop it. Same for the `14px` declared header padding: metadata puts the
  inner row at y 12 (pre-login, 12 + 36 + 12 = 60) and y 10 (post-login, 10 + 40 + 10 = 60). The
  declared `14` would give 68 and contradicts the fixed 60. **Build to the measured values.**
- **`Всі (120) ` has a trailing space** and the count is literally `120` in all five pills
  (`1:4320`, `1:5052`, `1:5397`, and the two in `02-casino-rows-a`). Both are in the design.
- **Store source strings, apply `text-transform` in CSS.** `Рекомендовані ліги` is stored
  mixed-case and rendered `Рекомендовані Ліги`; `вітальний бонус` is stored lowercase and rendered
  uppercase; all eight menu row labels are stored `sport` / `Casino` / `Referral program` and
  rendered ALL CAPS. Shipping the rendered strings breaks every other locale.
- **`1:7853` is 15px where `1:7844` is 14px** — same component, adjacent rows, and only the title
  differs (both subtitles measure 11px). Cap-height decoding of the 1:1 render confirms 10px vs 11px
  ink. It is a hand-edited node. Build both at **14**, which also removes the 56/57px row-height
  split. That recommendation is judgement from a three-to-one majority inside the frame, not
  something the file states.

---

## 5. Radii, shadows, spacing

### 5.1 Radii

| Token | Value | Measured on |
| --- | --- | --- |
| `--radius-hairline` | `2px` | `1:3331`–`1:3334` carousel bars; `1:7358` segments; `1:7389` search caret |
| `--radius-wager` | `3.318px` | `1:3316`, `1:3328` wager badge |
| `--radius-sm` | `6px` | `1:3297` register button; `1:3308` / `1:3320` hero CTA; `1:5235` / `1:4709` join button; `1:5234` / `1:4708` join-timer pill; `1:5940`–`1:5966` footer link rows; `1:6832` VIP badge; `1:6983` / `1:6985` Support and Vip Manager; `1:6843` copy button; `1:6653` menu register |
| `--radius-md` | `8px` | `1:3295` / `1:6000` / `1:6651` login button; `1:586` / `1:93` balance chip; `1:3393` ticker thumbnail; `1:6857` and the seven other menu rows; `1:6838` ID field |
| `--radius-chip` | `10px` | `1:3338`, `1:3343`, `1:3379`, `1:3385` category chips; `1:5052` / `1:5397` / `1:4320` see-all pills; `1:6334` / `1:6340` / `1:6355` sport filters; `1:6090` league tile; `1:6406` odds cell; `1:6085` / `1:6378` link chips; `1:5612`+ payment tiles; `1:6824` identity band |
| `--radius-slide` | `12px` | `1:3306` / `1:3318` casino hero slide; `1:6030` / `1:6038` sport WELCOME slide; `1:7843` suggestion row; `1:6490` nav plate (all four corners) |
| `--radius-track` | `13px` | `1:3337` and `1:6018` switcher tracks; `1:6023` Favorites; `1:6025` Gifts |
| `--radius-close` | `14px` | `1:7390` btn-close |
| `--radius-card` | `15px` | `1:3575`, `1:4326`, `1:5057` game card (outer and inner image frame alike) |
| `--radius-flag-outer` | `15.98px` | `1:5970` flag pill container |
| `--radius-lg` | `16px` | `1:5608` payment card; `1:6046` / `1:6064` off-screen hero card |
| `--radius-league-card` | `20px` | `1:6383`, `1:6433` |
| `--radius-xl` | `24px` | `1:6007` mode-switch container; `1:5227` / `1:4701` tournament card; `1:6826` avatar; the search field; **and all four search root frames `1:7363` / `1:7595` / `1:7806` / `1:7214`** |
| `--radius-icon-chip` | `28px` | `1:7258` empty-state icon chip |
| `--radius-pill` | `100px` | search chips, `1:7410` recent item, `1:7846` suggestion badge, `1:7263` CTA, `1:6821` menu close, `1:5972` flag Border |
| `--radius-full` | `999px` | `1:3299` / `1:593` / `1:6004` search buttons; `1:3781`; `1:6009` mode-switch track; `1:6337` count badge; `1:6484` bet-slip FAB |
| — | `1000px` | `1:3787` provider circle |
| — | `10000px` | `1:5978` inactive flag `en` frame |
| — | `552.388px` | `1:3310` promo badge |
| — | `853.079px` | `1:6033` sport banner badge |
| — | `60px` | `1:6968` menu language flag wrapper (a circle at 24 × 24) |

The last five are pill radii applied to boxes far smaller than the radius — they all clip to a
circle or a pill. `--radius-pill` covers them in code; they are listed separately so a
diff-against-Figma does not read as a discrepancy.

The nav plate's **12px** was derived twice: from the exported path (`V13 C0.5 6.09644 6.09644 0.5
13 0.5` at the top-left, `C5.87258 68.5 0.5 63.1274 0.5 56.5` at the bottom-left — the 0.5
difference is the centred 1 px stroke, not two radii) and from a six-row pixel fit of the left edge.
The search-panel **24px** was fitted by least squares against 16× supersampled quarter-disc coverage
on all four corners of all four frames — r = 20 and r = 28 are excluded by more than an order of
magnitude.

The game card's **15px** looks like 11 if you trace "first non-background pixel". It is not: near
the top of the arc the curve is almost tangent to the horizontal, so one pixel row shows a long
coverage ramp (`#EDEFFA → #BEBFE2 → #A1A1D4 → #9896CD → #8683C2`). Full opacity arrives at dx ≈ 15.
**Do not "correct" 15 to 11.**

### 5.2 Shadows

| Token | Value | Measured on |
| --- | --- | --- |
| `--shadow-cta` | `drop-shadow(0 8px 12px rgba(255,69,0,0.33))` **plus** `inset 0 1px 0 0 rgba(255,255,255,0.25)` | `1:3297`, `1:3308`, `1:3320`, `1:6002`, `1:6036`, `1:5235`, `1:4709`, `1:6653` |
| `--shadow-vip-badge` | `0 8px 24px 0 rgba(255,69,0,0.33)` plus the same inset highlight | `1:6832` |
| `--shadow-card` | `0 6px 18px 0 rgba(23,69,143,0.08)` | `1:6010` selected Prematch tab; `1:6334` selected sport filter; `1:6383` / `1:6433` league card |
| `--shadow-chip-active` | `0 2px 5px 0 rgba(35,101,169,0.1)` | `1:3338` (casino), `1:6019` (sport) |
| `--shadow-provider` | `0 6px 9px 0 rgba(23,69,143,0.08)` | `1:3787` and its four siblings |
| `--shadow-fab` | `0 10px 24px 0 rgba(16,42,103,0.15)` | `1:6484` — heavier and more diffuse than anything else on the page |
| `--shadow-field` | `0 4px 8px rgba(59,130,246,0.1)` | the search field inside `1:7365` and its three copies |
| `--shadow-search-cta` | `0 4px 6px rgba(249,115,22,0.3)` | `1:7263` |
| `--shadow-deposit` | `drop-shadow(0 4px 6px rgba(198,144,61,0.25))` | `1:6836` — a **gold** glow on a **green** button. Measured, flagged in §7 |
| `--shadow-nav-button` | `0 1.19px 2.02px rgba(81,69,158,0.051)`, `0 41.67px 30.12px rgba(255,69,0,0.21)` | `1:6518`, read off the SVG's `feOffset`/`feGaussianBlur`/`feColorMatrix` triples |
| `--shadow-container` | `drop-shadow(0 8px 12px rgba(0,0,0,0.05))` | `1:6007` |
| `--shadow-promo-badge` | `0 0 6.635px rgba(255,140,0,0.12)`, `0 2.212px 6.635px rgba(0,0,0,0.25)` | `1:3310`, `1:3322` |

**The game card has no shadow and no overlay**, despite being named `Overlay+Shadow`. A 157-pixel
column scan down the 8 px gutter between cards 1 and 2 in `1:3414` returned one flat run of
`#F7FAFF` — zero variation. The same tool call format *did* return `drop-shadow-[...]` for the
provider circle, so the tool emits a shadow when one exists. The layer name is stale intent.

**The footer declares no shadow anywhere** — `1:5607` and its entire subtree.

**`overflow: hidden` on the bottom nav destroys two things.** The raised button's glow is thrown
41.67 px straight down with a 30.12 px blur, so it needs ~72 px of room below the button and ~30 px
each side — it spills past the bottom of the 111-tall component. And the ~6 px ring between the
plate's notch and the button is a genuine hole through which page content shows; a plate drawn as a
plain rounded rect fills it in.

### 5.3 Spacing

The set actually used, with a node for each. There is no 14, no 18, no 28.

| Value | Where |
| --- | --- |
| `2px` | `1:6383` league-card gap between header and rows; `1:6494` icon↔label gap in a nav tab; `1:5234` join-pill left padding; `1:7380` header-square gap |
| `4px` | `1:3337` / `1:6018` track padding; `1:6009` track padding and gap; `1:5052` pill `padding-inline`; `1:6089` league-tile gap; `1:6029` hero track gap; `1:5237` timer-group gap; `1:587` balance-chip inner gap; `1:6405` odds-cell gap; `1:6830` profile-info gap |
| `6px` | `1:5231` title↔subtitle gap; `1:3344` icon↔label on an inactive chip; `1:6392` match-details gap; `1:6393` metadata gap; `1:6908` menu rows 3–8 gap; `1:6983` icon↔label |
| `8px` | `1:3291` button-group gap; `1:3294` / `1:585` header cluster gap; every `section-header` gap; `1:3573` card column gap; `1:3339` icon↔label on the **active** chip; `1:6017` sports-nav gap; `1:6333` filter gap; `1:5611` payment-grid gap (both axes are 12, see below); `1:6856` menu SPORT/CASINO gap; `1:6650` auth-pair gap; `1:5968` flag gap |
| `10px` | `1:7394` label↔content gap in the search panel; `1:6859` menu row `padding-block`; `1:5936` link-block `padding-inline`; `1:5968` `padding-top` |
| `12px` | `1:3573` grid row gap; `1:5611` payment-grid gap; `1:3392` thumbnail↔content gap; `1:3391` ticker entry gap; `1:6632`-class control gaps; `1:7365` search-field gap; `1:7257` empty-state gap; `1:6825` profile-section gap; `1:6333` container `padding-block`; `1:3785` provider badge padding |
| `16px` | **the page gutter** — every section on every screen starts at x 16 and is 358 wide; also `1:4141` section gap and `padding-inline`; `1:5608` grid gap; `1:5699` partner gap; `1:7363` frame padding |
| `20px` | `1:5229` tournament-card padding; `1:5608` payment-card `padding-inline`; `1:6983` `padding-inline` |
| `24px` | `1:5608` payment-card `padding-block`; `1:5697` partners gap; `1:6836` DEPOSIT `padding-inline`; `1:5417` gap between the last section and the footer |
| `32px` | `1:5607` footer gap; `1:5936` link-column gap |
| `44px` | `1:5940` footer link-row height — the only element in the file that respects a 44 px hit target |
| `54px` / `44px` / `8px` | `1:5607` footer padding: 54 top, 8 sides, 44 bottom |

Fixed heights that behave as spacing: header `60`, category switcher `44`, chip `36`, game card
`114 × 148`, provider badge `80 × 96`, provider circle `72`, league card `358 × 196`, odds cell
`55.33333206176758 × 42`, bottom nav `390 × 111` of which the painted bar is the **bottom 68**.

The odds cell width is `(174 − 2 × 4) / 3` and Figma wrote it out to 17 digits. Use
`flex: 1 0 0; min-width: 1px` and let the browser divide, exactly as the file does.

---

## 6. The four oranges

They are genuinely different values on genuinely different nodes. **Do not normalise them into one
token.** Anyone who "tidies" these will change the raised nav button, the register button, the
active-tab dot and the active-tab label all at once, and three of those four changes will be wrong.

| Pair / value | Token | Node | What it is |
| --- | --- | --- | --- |
| `#FE8200` → `#FE4800` | `--grad-nav-button` | `1:6518` | The raised centre button in the bottom nav. `linear-gradient(180deg, …)` — strictly top-to-bottom, spanning the diamond's own height (y 0.833 → 59.750), not its bounding box. Read from the SVG's `linearGradient` stops with `x1 == x2`, then confirmed pixel-by-pixel down column x = 188: `#FE7F00` at y 5 → `#FE6400` at y 32 → `#FE4900` at y 60, a clean monotone ramp |
| `#FF8C00` → `#FF4500` | `--grad-cta` | `1:3297` register, `1:3308` / `1:3320` hero CTA, `1:6002`, `1:6036`, `1:5235` / `1:4709` join, `1:6653` menu register, `1:6832` VIP badge | The platform's primary-button recipe, on seven independent nodes across four areas. Always `to right`. The end stop is variable **`Orange`** |
| `#F45B24` | `--accent-hot` | `1:6516` active nav dot; also `1:6407`–`1:6411` odds values, `1:6395` `● EP`, `1:6484` bet-slip FAB | The dot is `<circle id="active-dot" cx="2" cy="2" r="2" fill="#F45B24"/>` — flat, no stroke, no gradient. Pixel-identical in the render: row 101 gives exactly `#F45B24` at x 111–113 |
| `#FFB095` | `--text-nav-active` | `1:6506` label **and** `1:6504` icon | The active bottom-nav tab. `sport.svg` has `fill="#FFB095"` baked in where the other four glyphs have `fill="white"`, so label and icon are the same value. Build one glyph per tab with `fill: currentColor` and set `#FFFFFF` / `#FFB095` on the tab |

A fifth orange sits in the same 111 px component and belongs to none of the four: the raised
button's glow is **`#FF4500` at 21 %** — variable `Orange`, not the gradient's own `#FE4800`. So the
button is painted in one orange and glows in another.

`#F45B24` is 4 / 22 / 36 away from `#FF4500` in RGB — close enough to look like a duplicate, far
enough to be deliberate. Nothing in the file says which it is. Both are recorded as measured; the
question sits in §7's list.

Two more oranges exist outside the nav and are separate tokens for separate reasons:
`#FF7A45` (`1:6013`, the Live-tab icon), `#F97316` (`1:7263` search CTA fill and `1:3404` ticker
amount), `#FF8101` (`1:6853` "More"), `#FF8700` (`1:5232` tournament title), `#FFAE00` (`1:3311`
promo text), `#E67508` (`1:7847` badge). Seven distinct oranges in one product. That is a finding,
not a token proposal.

---

## 7. Contrast

WCAG 2.x, computed with the sRGB relative-luminance formula over the exact hexes in §3. Alpha fills
were composited onto their real backdrop before the ratio was taken. AA needs **4.5:1** for text
below 18.66px bold / 24px regular, **3:1** for larger text, and **3:1** for non-text UI boundaries
and meaningful graphics (1.4.11).

### 7.1 Failures — lead with these

**The owner has decided the design's colours ship unchanged.** The suggested values below are
recommendations for the designer. This sheet records the failure and the suggestion; the code
applies neither.

`scripts/a11y.mjs` exits 1 on any axe-core critical or serious finding, and `color-contrast` is
rated **serious**, so every text row in this table fails the CI gate on its own. The 1.4.11 rows do
not — axe-core does not test 1.4.11 — so those fail a manual audit instead.

**This section has a reader-facing twin**, built from these exact tables on 2026-09-10 and meant to
be sent to whoever owns the design:
<https://claude.ai/code/artifact/a9e0078e-01e0-40c8-9a70-dd312d2c9997>. It renders every failing
pair in its own real colours, which is the thing a hex in a table cannot do. Change a row here and
the page needs redeploying, or the two drift and only one of them is in front of the designer.

| Pair | Ratio | Node | Suggested value that keeps the hue |
| --- | --- | --- | --- |
| `#71809A` on `#E8F1FC` — inactive category label, 13px | **3.50** | `1:3378`, `1:3384`, `1:3390` | `#5F6C86` → 4.53 |
| `#71809A` on `#DCEBFF` — unselected filter count, 11px | **3.30** | `1:6346`, `1:6358` | `#636D86` → 4.62 on this backdrop |
| `#758098` on `#E8F1FC` — league name, 14px | **3.48** | `1:6390` | `#636D86` → 4.53 |
| `#758098` on `#F5F8FD` — kickoff time and `1 Н 2` labels, 10px | **3.72** | `1:6394`, `1:6402`–`1:6404` | `#636D86` → 4.86 |
| `#F45B24` on `#E8F1FC` — **the odds values**, 12px | **2.89** | `1:6407`–`1:6411` and nine siblings | `#C4380A` → 4.70. This is the single most load-bearing number on the sportsbook page |
| `#F45B24` on `#F5F8FD` — `● EP` live marker, 10px | **3.10** | `1:6395` + 3 siblings | `#C4380A` → 5.04 |
| `#FFFFFF` on `#F45B24` — bet-slip FAB label, 15px | **3.30** | `1:6484` / `1:6487` | `#C4380A` fill → 4.99 with white |
| `#FFFFFF` on `--grad-cta` — **every primary button label**, 13px | **2.33** at `#FF8C00`, **3.44** at `#FF4500` | `1:3298`, `1:6003`, `1:3309`, `1:6037`, `I1:5235;112:330`, `1:6654` | No white text reaches 4.5 on an orange this saturated. Switching the label to `#000000` gives **9.00** at the light stop and **6.10** at the dark stop and changes no brand colour. The alternative is darkening both stops to about `#C43700 → #9E2A00`, which does |
| `#FFFFFF` on `#00B579` — `DEPOSIT`, 12px ExtraBold | **2.66** | `1:6837` on `1:6836` | Black label → 7.88, or darken the fill to `#00754E` → 5.75 with white |
| `#10B981` on `#F4F6FA` — `Support` label and its 1px border, 13px | **2.35** | `1:6983` | `#0A7A55` → 4.94 |
| `#FFFFFF` on `#10B981` — `Vip Manager`, 13px | **2.54** | `1:6985` / `1:7013` | Same `#0A7A55` fill → 5.35 with white. One change fixes both contact buttons |
| `#FF8101` on `#FFFFFF` — "More", 12px Bold | **2.50** | `1:6853` | `#BE5400` → 4.71 |
| `#92BDF3` on `#E8F1FC` — the `ID:` label, 17px Regular | **1.71** | `1:6841` | `#3C6FB0` → 4.50 |
| `#94A3B8` on `#FFFFFF` — search placeholder, 14px | **2.57** | `1:7388`, `1:7620`, `1:7239` | `#67748A` → 4.73 |
| `#94A3B8` on `#F7FAFF` — ticker game name, 11px | **2.45** | `1:3398`, `1:3406`, `1:3413` | `#67748A` → 4.52 |
| `#839CBF` on `#DBEAFE` — suggestion subtitle, 11px | **2.30** | `1:7845`, `1:7854` | `#54688F` → 4.59 |
| `#3B82F6` on `#EFF6FF` — the four search section labels, 11px Bold | **3.38** | `1:7394`, `1:7407`, `1:7837`, `1:7266` | `#2A6BDE` → 4.53 |
| `#64748B` on `#EFF6FF` — empty-state body, 13px | **4.37** | `1:7262` | `#606F86` → 4.69. Misses by 0.13 |
| `#E67508` on `#FFF7ED` — suggestion badge, 11px SemiBold | **2.86** | `1:7847`, `1:7856` | `#B05700` → 4.70 |
| `#16A34A` on `#F7FAFF` — ticker amount, entry 1, 12px Bold | **3.15** | `1:3396` | `#158040` → 4.79 |
| `#F97316` on `#F7FAFF` — ticker amount, entries 2–3, 12px Bold | **2.68** | `1:3404`, `1:3411` | `#BE5000` → 4.63 |
| `#FFFFFF` on `#F97316` — `Усі провайдери` CTA, 13px Bold | **2.80** | `1:7264` on `1:7263` | Black label → 7.49, or `#BE5000` fill → 4.84 with white |
| `#FF4500` on `#FFFFFF` — variable `Orange` as text on variable `BG main` | **3.44** | latent: no node uses it as text today | Passes the 3:1 large-text and UI bars, fails everything else. If `Orange` ever becomes a body-text colour it fails immediately |

### 7.2 Failures against 1.4.11 (non-text) — axe will not catch these

| Pair | Ratio | Node | Suggestion |
| --- | --- | --- | --- |
| `#C9DCF4` active segment against the `#E8F1FC` track | **1.23** | `1:3338` vs `1:3337` | The fill difference is nearly invisible; `--shadow-chip-active` is doing the work, and shadows do not survive high-contrast mode or grayscale. `#5E8DC8` → 3.01. The robust signal today is the label colour change (`#71809A` → `#102A67`, 9.70) plus `aria-selected` |
| `#FFFFFF` selected sport-filter pill against `#F7FAFF` | **1.05** | `1:6334` vs the page | The pill is marked *only* by fill + shadow. `--border-chip` `#BFDBFE` would give 1.36 and is not enough; a boundary at 3:1 needs about `#5E8DC8` (3.28) |
| `#F45B24` active nav dot on the composited plate | **2.53** | `1:6516` on `1:6490` | `#FF7A45` → 3.23. That hex is already live elsewhere (`1:6013`) |
| `#FF7A45` Live-tab icon on `#DCEBFF` | **2.14** | `1:6013` | `#C4380A` → 4.43 |
| `#7FB4F2` menu row icons on `#E8F1FC` | **1.90** | `1:6862` + 7 siblings | `#3C6FB0` → 4.50 |
| `#FFFFFF` burger glyph on the light stop of `--grad-nav-button` | **2.50** at `#FE8200`, **3.42** at `#FE4800` | `1:6520` on `1:6518` | The glyph sits across both stops. Darkening the top stop to about `#E86A00` clears 3:1 across the whole run |
| `#DCEBFF` section-header divider on `#F7FAFF` | ~1.15 | `1:5051` and twelve siblings | Decorative, carries no information. No action needed; recorded so nobody "fixes" it |
| `#3B82F6` **focus ring** on the composited nav plate `#45468D` | **2.30** | not a design node — `globals.css:165-167` | **This row is ours, not the design's.** The file draws no focus state anywhere (§8), so the build supplied one: `outline: 2px solid var(--text-label)`, offset 2. Against `--bg-page` `#F7FAFF` it is 3.51 and passes. Against the navigation bar — where five controls sit on every screen — it is 2.30. It needs a second value for dark surfaces, or a light outer halo. Added 2026-09-10 |

### 7.3 Passes

| Pair | Ratio | Node |
| --- | --- | --- |
| `#07134F` on `#F7FAFF` — section titles | 16.67 | `1:6377`, `1:4318` |
| `#E6EDF5` on `#000D3B` — footer headings | 15.90 | `1:5610`, `1:5698` |
| `#191970` on `#FFFFFF` — variable `Navy` on variable `BG main` | 14.85 | `1:6387` |
| `#102A67` on `#EDF5FF` — `Увійти` | 12.34 | `1:3296` |
| `#102A67` on `#E8F1FC` — active category label, menu row labels | 11.90 | `1:3342`, `1:6865` |
| `#102A67` on `#DBEAFE` — recent search item | 11.12 | `1:7411` |
| `#FFAE00` on `#000000` — promo badge text on the slide base | 11.31 | `1:3311` |
| `#AFC1E8` on `#000D3B` — all twelve footer links | 10.37 | `1:5941`–`1:5966` |
| `#173B68` on `#F7FAFF` — "Рекомендовані ліги" | 10.78 | `1:6084` |
| `#102A67` on `#C9DCF4` — selected segment label | 9.70 | `1:3342` on `1:3338` |
| `#1E3A8A` on `#EFF6FF` — empty-state title | 9.52 | `1:7261` |
| `#1E3A8A` on `#DBEAFE` — chip text, suggestion titles | 8.49 | `1:7397`, `1:7844` |
| `#FFFFFF` on the composited nav plate | 8.36 | `1:6493`, `1:6502`, `1:6511`, `1:6515` |
| `#1E40AF` on `#EFF6FF` — `Всі (120) `, `Всі ліги`, `Всі події` | 8.01 | `1:6086`, `1:6379` |
| `#FF8700` on `#11111A` — tournament title | 7.85 | `1:5232` |
| `#17458F` on `#DCEBFF` — selected filter count | 7.61 | `1:6338` |
| `#C2410C` on `#FFF7ED` — orange chip label | 4.88 | search chips 2/4 |
| `#FFB095` on the composited nav plate — the active tab label | **4.73** | `1:6506` |
| `#64748B` on `#F7FAFF` — masked player in the ticker | 4.55 | `1:3397` |
| `#1677E8` favourites `★` on `#E8F1FC` — non-text, 3:1 bar | 3.81 | `1:6024` |

### 7.4 Two things the numbers depend on

**The nav plate is 80 % opaque, so its contrast moves with the page behind it.** Every nav ratio
above is computed against `#191970` at 80 % over `--bg-page` `#F7FAFF`, which composites to
**`#45468D`**. Over a dark hero image the same white label is brighter-on-darker and safe; over a
pale card it is what is quoted. The active label at 4.73 is the one with no headroom — a 0.23
margin. If the page colour behind the bar ever lightens, it fails.

**Four pairs cannot be computed at all** because the backdrop is a photograph: `#0D1A59` on the
WELCOME banner (`1:6035`), `#007AFF` on the same banner (`1:6034`), `#FFFFFF` and `#FFAE00` on the
casino hero artwork (`1:3314`, `1:3311`), and the tournament card's white subtitle over its
cropped bitmap (`1:5233`). These need a scrim or a manual check against the real image; a ratio
against the flat base fill under the photo would be a fiction.

---

## 8. What has no design at all

**There is no hover, pressed, focus or disabled state anywhere in this Figma file.** Not on one
control. This was checked against the full metadata subtree of every frame measured — 666 nodes in
the casino page alone, all three menu panels, all four search states, both sport frames and the
navbar component set. No component in the file carries a state variant. The only variant properties
that exist are `Property 1 = log in ua | log in ru | log in en` on `1:6488`, which is a **language**
switch, and the pre-login/post-login split, which is expressed as two separate top-level frames
rather than as variants.

The design is mobile-only, so hover is close to moot. **Pressed and focus-visible are not.** Every
item below is something the build must invent, with no design cover. Recorded here so the inventions
are on the record rather than discovered in review.

| Control | Node | States that exist in the file | What the build must invent |
| --- | --- | --- | --- |
| Game card | `1:3575`, `1:4326`, `1:5057` | one. Wrapper named `Overlay+Shadow` with alpha-0 fill and no shadow — pixel-proven flat | pressed, focus ring. The layer name promises an overlay that is not drawn |
| Category chip | `1:3343`, `1:3379`, `1:3385` | active / inactive (paint only) | pressed, focus, keyboard traversal of a horizontally scrolling row |
| See-all pill `Всі (120) ` | `1:5052`, `1:5397`, `1:4320` | one | pressed, focus |
| Provider badge | `1:3786` and 4 siblings | one | pressed, focus |
| Sport filter pill | `1:6334`, `1:6340`, `1:6355` | selected / unselected (fill + shadow + count colour + icon colour) | pressed, focus, **zero-count**, disabled |
| Prematch / Live switch | `1:6010`, `1:6012` | selected / unselected | pressed, focus |
| Спорт / Кіберспорт switch | `1:6019`, `1:6021` | selected / unselected | pressed, focus |
| **Odds cell** | `1:6406` and 11 siblings | one — resting only | **selected**, pressed, suspended/locked, odds-drifted up, odds-drifted down. The core sportsbook interaction has no design |
| Favourite `★` in a match row | `1:6396`, `1:6417`, `1:6446`, `1:6467` | unselected grey only, on all four rows | the selected/filled star |
| Favorites and Gifts buttons | `1:6023`, `1:6025` | resting only | active, count badge, pressed |
| League tile | `1:6090` and 7 siblings | resting only | selected league, pressed |
| "More leagues" | `1:6330` | collapsed | expanded |
| Link chips `Всі ліги` / `Всі події` | `1:6085`, `1:6378` | resting | pressed, focus |
| Bet-slip FAB | `1:6484` | resting only | empty vs populated, a selection count (the design shows none), pressed. It is also a standalone canvas frame at (3528, 313) — **where it docks on screen is not expressed in Figma at all** |
| Auth buttons | `1:3295`, `1:3297`, `1:6651`, `1:6653` | one each | pressed, focus, loading, disabled |
| Search button | `1:3299` / `1:593` | one | pressed, focus |
| Search chips | `1:7396` and 4 siblings | one | pressed, selected |
| Recent-search row and its clear button | `1:7410`, `1:7412` | one | pressed, focus, removal animation. Also: the file draws exactly one recent entry, so **multi-row spacing is unspecified** |
| Suggestion row | `1:7843`, `1:7852` | one | pressed, focus, keyboard highlight |
| `btn-close` in the search field | `1:7390` | one, present even when the field is empty | pressed, and a decision on whether it clears the text or closes the panel — the file gives it no label and no second variant |
| Empty-state CTA `Усі провайдери` | `1:7263` | one | pressed, focus, and a destination |
| Menu rows SPORT / CASINO / PAYMENTS | `1:6857`, `1:6868`, `1:6941` | collapsed, chevron down | **expanded**. Three accordion rows, no expanded state anywhere |
| Menu "More" toggle | `1:6847` | collapsed | expanded identity block |
| Copy-ID button | `1:6843` | one | pressed, and the transient "copied" confirmation, which is not designed |
| Footer link rows | `1:5940`–`1:5966` | one — `height: 44`, `border-radius: 6`, **no fill** | the hover/pressed fill the 6 px radius implies. A radius on nothing is a resting state waiting for a background |
| Partner logos | `1:5700` and 6 siblings | one | pressed, visited, external-link affordance |
| Language flag pills | `1:5970`, `1:5977`, `1:5986` | selected / unselected — the only real state machine in the footer | pressed, focus, and an open picker |
| Bottom-nav tabs | `1:6496`, `1:6503`, `1:6508`, `1:6512` | **Sport active only**, in all three language variants | the active state of the other four tabs, plus pressed and focus. §6 establishes that activation is a flat colour swap (`#FFFFFF` → `#FFB095` on both glyph and label), so the other four fall out of `fill: currentColor` — but that no *other* property changes on activation could not be measured, because there is no second active state to diff against |
| Raised Menu button | `1:6517` | closed | open/active |
| Hero and provider carousels | `1:3305`, `1:3785`, `1:6029` | resting; overflow is the only scroll affordance | scroll-snap or free scroll (Figma cannot express it), autoplay, and which indicator segment means "current" |

**Focus-visible has no design anywhere in the file.** Every interactive element in the table above
will need a focus ring invented, and the a11y gate will look for it.

**Four hit areas are below 44 × 44 as drawn**, measured not estimated:

| Element | Node | Size |
| --- | --- | --- |
| Deposit `+` inside the balance pill | `1:589` / `1:96` | 24 × 24 |
| Recent-search clear button | `1:7412` | 14 × 14 |
| Language flag pill | `1:5970` | 32.2 × 31.7 |
| Copy-ID button | `1:6843` | 34 × 34 |

The deposit `+` is additionally ambiguous: Figma names the search control `Button` and does not name
this one, so whether the 99 × 40 pill is one target or two is not encoded.

There is also **no loading state, no error state, no zero-balance state and no empty state** outside
the search panel's own `State not found`.

---

## 9. Known omissions in the design

These are recorded because they must be findable, not because they are bugs to fix in code. The
owner has taken them knowingly.

**The footer carries no legal block.** The complete `1:5417` subtree and the complete generated code
for `1:5607` were searched. There is **no licence number, no licence text, no regulator logo, no
18+ or 21+ age mark, no responsible-gambling badge** (no GamCare, BeGambleAware or GAMSTOP), **no
company or registration line and no copyright line.** There are no hidden nodes of that kind either
— the only `hidden="true"` nodes anywhere in `1:5417` are the category icons inside `1:5418` and
decorative shapes in the tournament artwork. There are also no social icons. The footer is exactly
six blocks: payment logos, partners, divider, two link columns, divider, language selector.

The only responsible-gambling reference in the entire design is the **link text**
`Відповідальна гра` (`1:5947`). It is a label in a list, not a policy statement.

**The support address is `Support@jack-pot.com`** (`1:5945`) — capital `S`, and the domain is
`jack-pot.com`, the **previous project's** domain, not a Top-Win one. Recorded character for
character.

On a gambling site the licence, regulator and age mark are normally mandatory. Nothing here may be
invented by the build: if they are required, the exact licence text, licensing body and age mark
have to come from the owner.

Three more literal strings in the same category — measured, deliberately not corrected:

- **`Реєстарція`** (`1:3298`, `1:6003`, `1:6654`). The correct Ukrainian is `Реєстрація`; the design
  has `стар` where it should have `стра`. Confirmed as the **stored** string, not a render artefact.
  Fixing it silently makes the build diverge from the Figma the client reviews against.
- **`Моre`** (`1:6853`). Codepoint-dumped: `М` is U+041C CYRILLIC CAPITAL EM and `о` is U+043E
  CYRILLIC SMALL O; `r` and `e` are Latin. It renders identically to `More` and will break any
  exact-match i18n key, search or test assertion that types Latin.
- **`Н`** (`1:6403`), the draw label on every odds row. Cyrillic capital EN, U+041D, for "нічия" —
  **not** Latin `X` and not Latin `H`. The near-universal sportsbook convention is `1 X 2`; the
  design says `1 Н 2`.

And two structural placeholders that will read as bugs if nobody records them: every see-all pill
says `Всі (120) ` with the same count and a trailing space; every sport filter shows the count
`310`; both league cards (`1:6383`, `1:6433`) are byte-identical — same league, same kickoff
`Сьогодні, 22:00`, same teams, same odds, same `● EP`; and the fourth category chip (`1:3385`)
duplicates the third's icon and copy `лайв Казіно`.

---

## 10. Measured vs reasoned

### 10.1 Measured — read off a tool or decoded from a 1:1 render

- Every hex, gradient, radius, shadow, padding and font declaration attributed to a node id in
  §§3–5 came from `get_design_context`, `get_variable_defs`, an exported SVG's own attributes, or a
  pixel decode of a 1:1 PNG. Which one, per value, is stated in the "Measured on" column where the
  method mattered.
- All geometry — every x, y, width, height — came from `get_metadata`.
- The six Figma variables and their values.
- The literal Ukrainian copy, including the trailing space in `Всі (120) `, the `Реєстарція`
  transposition, the Cyrillic `Н` and the Cyrillic homoglyphs in `Моre`.
- The absence of the footer legal block: searched, not assumed.
- The absence of any hover/pressed/focus/disabled variant: checked against full metadata subtrees.
- The bottom nav's 111 = 43 + 68 split, the button's 40 px overhang, the 78.07 × 25 notch and the
  ~6 px transparent ring between notch and button.

### 10.2 Confirmed twice, by two independent methods

Two independent measurements agreeing is stronger than one restated, so these are called out
separately:

| Value | Method 1 | Method 2 |
| --- | --- | --- |
| Nav plate fill `#191970` @ 80 % | `<path fill="#191970" fill-opacity="0.8">` in `subtract.svg` | plate renders `#1A1A60`; 0.8 × 25 + 0.2 × 30 = 26 = `0x1A`, 0.8 × 112 + 0.2 × 30 = 95.6 = `0x60` — exact on all three channels |
| Nav plate radius `12px` | exported path arc coordinates | six-row pixel fit down the left edge, predicted vs measured within 0.5 px |
| Raised button gradient `#FE8200 → #FE4800` | SVG `linearGradient` stops, `x1 == x2` | pixel column x = 188, monotone ramp `#FE7F00` → `#FE6400` → `#FE4900` |
| Raised button glow, `#FF4500` @ 21 %, dy 41.67, blur 30.12 | SVG `feColorMatrix` / `feOffset` / `feGaussianBlur` | pixel: `#271C5A` over the plate solves to alpha ≈ 0.19; and the `+71.79px` bottom bleed derived independently from the render box in `10-navbar-headers.md` matches |
| Active dot `#F45B24` | `<circle fill="#F45B24">` | row 101, x 111–113, byte-identical |
| Active tab colour `#FFB095` | `sport.svg` `fill="#FFB095"` | row 67, glyph reads `#FFB095` while the Casino glyph at the same row reads `#FFFFFF` |
| Section divider `#DCEBFF`, dashed 2/2 | SVG `stroke` + `stroke-dasharray` | row y = 31, 2 px runs on a 4 px period |
| Section icon `#92BDF3` | SVG `fill` | darkest pixel in the icon rect |
| Provider circle shadow `0 6px 9px rgba(23,69,143,0.08)` | `get_design_context` | pixel falloff `#EAEFF9` solves to alpha 0.054–0.061, consistent with 0.08 attenuated by a 9 px blur; darker below than above, the signature of a downward offset |
| Game card has **no** shadow | no `box-shadow` emitted | 157-pixel column of flat `#F7FAFF` |
| Page background `#F7FAFF` | declared on the casino section wrappers | ten pixel samples across five bands of the sport frame |
| Header fill `#E8F1FC` | declared on `1:3290` | full 390-wide row scan of `1:5995` |
| See-all pill `#EFF6FF` / `#BFDBFE` / `#1E40AF` | `get_design_context` | pixel at fill, border rows and darkest label ink |
| Suggestion title 14 vs 15 px | declared font sizes | cap-height decode: 10 px vs 11 px ink, ratio 1.077 against a predicted 1.071 |
| `1:6086` is Inter, `1:6379` is Roboto | two `get_design_context` reports | metadata box heights 15 vs 14, calibrated against every other 12 px node in the frame (Inter → 15, Roboto → 14, without exception) |
| Game card radius `15px` | declared | corner coverage ramp reaching full opacity at dx ≈ 15 |
| Search panel radius `24px` | — | least-squares fit against 16× supersampled quarter-disc coverage, all four corners of all four frames, SSE ≈ 0.004 |

### 10.3 Reasoned — inference, not measurement

- **`1:6594` / `1:6617` are dead.** Measured: they are standalone canvas frames, they are dark
  `#080814` with Inter and gold buttons and English copy, while every screen header measured is
  light `#E8F1FC` with Outfit and orange buttons and Ukrainian copy. Not measured: a whole-file
  search for instances of them. The exclusion is a judgement from the mismatch, taken as instructed.
- **`#F7FAFF` belongs to the page frame `1:5994`.** Measured: the colour, and that every child which
  shows it declares no background. Not measured: `1:5994`'s own `background` — that call was never
  run.
- **Horizontal scroll.** Six rows are wider than their clip: the casino hero track (718 in 390), the
  category switcher (502 in 390), the ticker (482 in 390), both provider tracks (420 in 358), the
  league strip (to x 434) and the sport filter row (400 in 390). Figma geometry cannot distinguish
  free scroll from scroll-snap from a paged carousel. The overflow is measured; the behaviour is
  inferred.
- **The `~7px` leftward offset of the nav centre cluster is placement, not artwork.** Measured: the
  diamond is centred in its own box to five decimals (x 61.9455 of 63.653), the container sits at
  x 156, and the plate's notch was cut at 187.84 in a separate vector. Reasoned: a stray nudge on
  one layer cannot move a boolean subtraction inside a different node, so the cluster was moved as a
  unit. Consequence, which is arithmetic not inference: centring the button at 195 requires
  re-cutting the notch by the same 7.17 px, or the 6 px ring goes lopsided.
- **The 420 px provider track is an over-declared width, not a deleted sixth badge.** Measured:
  exactly five 80 px children, no padding or gap property, `w-[420px]` hardcoded. Reasoned: a
  deleted node leaves no trace, so what the 20 px was originally for is not recoverable.
- **The three-family split.** Inter / Roboto / Outfit is the working set; Roboto Flex is the
  variable superset of Roboto with every axis at its default, so a static Roboto renders identically.
  That equivalence is reasoning about the font, not a measurement of the render.
- **Recommending 14px for `1:7853`** — a three-to-one majority inside the frame plus the absence of
  Inter Medium 15 anywhere else in the inventory. Judgement.
- **The suggested replacement hexes in §7** are computed, not measured: each was chosen by solving
  the WCAG luminance formula for a target ratio while holding the hue, and each quoted ratio is the
  computed result for that exact hex. None of them is in the Figma file.

### 10.4 Conflicts between inventory passes

| Conflict | Resolution |
| --- | --- |
| Match row `1:6391`: `#F5F8FC` decoded from the render vs `#f5f8fd` declared by `get_design_context` | **`#f5f8fd` wins.** One unit in blue. A declaration is the source; a render is subject to the rasteriser's rounding. Flagged because a pixel-diff test against Figma will report it |
| Register gradient: `#FF8B00 → #FF4600` decoded vs `#FF8C00 → #FF4500` declared | **Declared wins**, same reasoning. The declared end stop is also variable `Orange`, which the decoded value would obscure |
| Header vertical padding: `py-[14px]` declared vs y = 12 (pre-login) / y = 10 (post-login) in metadata | **Metadata wins.** 12 + 36 + 12 = 60 and 10 + 40 + 10 = 60 match the fixed frame height; 14 + 36 + 14 = 64 does not |
| Section-header divider described as a solid 1 px rule in `02-casino-rows-a.md` vs dashed `2 2` in `22-gap-gamecard-providers.md` | **Dashed wins.** The first was inferred from the wrapper CSS (`height: 0`, `inset: -0.5px 0`); the second read the asset's own `stroke-dasharray` and then confirmed a 4 px period in pixels. A value read from the file beats a value inferred from a wrapper |
| Menu radii "8px everywhere" (pixel inference) vs declared per-node | **Declared wins.** Rows, ID field and login button are 8; the register button, both contact buttons, the VIP badge and the copy button are **6**. A 2 px difference is below what an anti-aliased corner profile can separate, which is why the pixel pass missed it |
| Category switcher track width: 502 (`get_metadata` on `1:3337`) vs a 375-wide render | **Unresolved.** Both are measurements of the same node by different tools. Question for the owner: is the chip row 502 px scrolling inside 390, or 375 and clipped? |
| Chip icon→label gap: 8 px on the active chip, 6 px on the three inactive ones | **Unresolved.** Both measured, on both the casino and sport switchers. Either the `Popular` icon's 11.2257 px box sits in a wider 14 px slot, or the active chip really uses a different gap. Which is the token? |
| Link-chip font: `1:6086` Inter Regular 12 vs `1:6379` Roboto Regular 12, everything else about the two chips identical | **Unresolved, and now proven to be a real difference rather than a tool error.** Each chip matches the family of the title in its own section header, so neither is an obvious typo. Designer's call |
| A seventh named style `white_gg: #DAD7E0` reported once, on `1:6817` | **Unresolved.** No measured node uses it. Is it a real variable or a stale style? |
| `#F45B24` vs `#FF4500` — 4/22/36 apart in RGB | **Unresolved.** Close enough to look like a duplicate, far enough to be deliberate. Only `#FF4500` is a named variable. Should the active dot be `Orange`? |




