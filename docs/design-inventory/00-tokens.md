# Top-Win — design tokens

File key: `s2CqwGqe0O0FcALhBNlTRe`. Single page: `0:1 "New Platform"`.
Pass date: 2026-09-10. Method: `get_variable_defs` + `get_design_context` on named nodes.

**Coverage warning — read this first.** The Figma MCP server returned
`You've reached the Figma MCP tool call limit for your Full seat on the Professional plan`
after 6 successful calls. Three of the six nodes I was told to measure were never reached:
`1:3414` (content row), `1:6333` (sport filters), and any drill-down for the bottom-navbar
background. Everything below is measured from what did return; everything not reached is in
UNKNOWN, not guessed.

---

## 1. Figma variables — they exist, but only 6 of them

The predecessor file had none. **This one does.** Both probes returned real variable maps:

`get_variable_defs` on `1:3289`:

| Variable | Value |
| --- | --- |
| `Orange` | `#FF4500` |
| `Navy` | `#191970` |
| `Footnote_e` | Font(family: "Roboto", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0) |
| `Footnote_m` | Font(family: "Roboto", style: Medium, size: 14, weight: 500, lineHeight: 16, letterSpacing: 0) |
| `Capation1` | Font(family: "Roboto", style: Regular, size: 13, weight: 400, lineHeight: 16, letterSpacing: 0) |

`get_variable_defs` on `1:5994`:

| Variable | Value |
| --- | --- |
| `Orange` | `#FF4500` |
| `Navy` | `#191970` |
| `BG main` | `#FFFFFF` |

Union across both probes: **3 colour variables** (`Orange`, `Navy`, `BG main`) and
**3 type variables** (`Footnote_e`, `Footnote_m`, `Capation1`). Note `Capation1` — that is
the literal variable name in the file, misspelling included. Do not "correct" it when mapping.

**Decision this forces.** The variable set is not a palette. Not one of the six variables
appears in any node I measured: the headers are `#080814`, the navbar is `#E8F1FC` /
`#C9DCF4` / `#102A67` / `#71809A`, the accents are `#00F299` / `#F0C775` / `#C6903D`. None
of those is `Orange`, `Navy` or `BG main`. `get_design_context` on the bottom navbar
`1:6488` reported exactly one bound style — `BG main: #FFFFFF` — and the other five nodes
reported none at all.

So: the code **cannot** read its palette from Figma variables. It has to hard-code from
measurement. The three variables are worth carrying as named tokens only if a later pass
finds a node that actually uses them (see UNKNOWN Q1).

---

## 2. Colours, each with the node it came from

### Backgrounds / surfaces

| Hex | Where measured | Role |
| --- | --- | --- |
| `#080814` | `1:6594` Header (Pre-login), `1:6617` Header (POST-login) | app header background, opaque near-black |
| `#E8F1FC` | `1:3337` Category switcher (inside `1:3335` navbar) | segmented-control track, pale blue |
| `#C9DCF4` | `1:3338` Active category | selected segment fill |
| `rgba(0, 92, 64, 0.04)` | `1:6632` Emerald Outlined Button | balance-pill fill; over `#080814` it resolves to **`#080B16`** |
| `#FFFFFF` | variable `BG main`; bound on `1:6488` | page background (declared, not observed on a painted node) |

### Text

| Hex | Where measured | Role |
| --- | --- | --- |
| `#FFFFFF` | `1:6611` "Log In"; `1:6493`/`1:6502`/`1:6511`/`1:6515` bottom-nav labels | primary text on dark |
| `#000000` | `1:6613` "Sign In" | text on the gold gradient button |
| `#102A67` | `1:3342` "Популярне" | active category label, deep navy |
| `#71809A` | `1:3378`, `1:3384`, `1:3390` | inactive category label, slate grey |
| `#00F299` | `1:6634` "$ 140.00" | balance figure, emerald |
| `#FFB095` | `1:6506` "Спорт" | **active** bottom-nav label, warm peach |

### Accents / gradients

| Value | Where measured | Role |
| --- | --- | --- |
| `linear-gradient(to right, #F0C775, #C6903D)` | `1:6612` Sign In Button | primary CTA, gold |
| `linear-gradient(to right, #00F299, #3B82F6)` | `1:6635` action (deposit `+`) | emerald→blue, 32px circle |
| `#FF4500` | variable `Orange` | declared; **no measured node uses it** |
| `#191970` | variable `Navy` | declared; **no measured node uses it** |

### Borders

| Value | Where measured | Role |
| --- | --- | --- |
| `1.5px solid rgba(0, 163, 114, 0.5)` | `1:6632` Emerald Outlined Button | over `#080814` resolves to **`#045643`** |
| `1px solid rgba(255, 255, 255, 0.4)` | `1:6635` action circle | hairline highlight on the gradient |

No other border was found on any measured node. The category switcher and both headers are
borderless — separation is done with fill alone.

---

## 3. Type

Three families in one file, which is a finding in itself:

| Family | Where | Notes |
| --- | --- | --- |
| **Inter** | both headers, category navbar | UI chrome |
| **Roboto** | bottom navbar `1:6488`, and all three type variables | tab labels |
| — | — | no third family observed; see UNKNOWN Q2 |

Bottom-nav text carries `font-variation-settings: "wdth" 100`, i.e. Roboto is used as a
**variable font** at default width. A static Roboto webfont will render at the same width,
so this is safe to drop, but it tells you the source was Roboto Flex / Roboto variable.

Observed scale, grouped:

| Step | Size / line-height | Weight | Family | Letter-spacing | Nodes |
| --- | --- | --- | --- | --- | --- |
| Button label | 14px / `normal` | 600 SemiBold | Inter | `-0.14px` | `1:6611` "Log In" |
| Button label (strong) | 14px / `normal` | 800 ExtraBold | Inter | `-0.14px` | `1:6613` "Sign In", `1:6634` "$ 140.00" |
| Nav / chip | 13px / `1.35` (≈17.55px) | 500 Medium | Inter | 0 | `1:3342`, `1:3378`, `1:3384`, `1:3390` |
| Tab label | 12px / `14.143px` | 500 Medium | Roboto | 0 | `1:6493`, `1:6502`, `1:6506`, `1:6511`, `1:6515` |
| var `Footnote_e` | 14px / 16px | 700 Bold | Roboto | 0 | variable only |
| var `Footnote_m` | 14px / 16px | 500 Medium | Roboto | 0 | variable only |
| var `Capation1` | 13px / 16px | 400 Regular | Roboto | 0 | variable only |

`14.143px` is not a round number — it is `12 × 1.17858`. Reproduce it literally
(`line-height: 14.143px`), not as a ratio, or the 68px bottom bar will drift.

The `-0.14px` tracking on the 14px buttons is exactly `-0.01em`. Either form is fine.

## 4. Radii

| Radius | Node | Element |
| --- | --- | --- |
| `13px` | `1:3337` | category switcher track |
| `10px` | `1:3338`, `1:3343`, `1:3379`, `1:3385` | category segment (active and inactive alike) |
| `20px` | `1:6610`, `1:6612` | Log In / Sign In buttons (h ≈ 40px → not a full pill) |
| `20px` | `1:6635` | deposit circle, 32px box → renders as a circle |
| `22px` | `1:6632` | emerald outlined balance pill, h 40px → full pill |

Set: `{10, 13, 20, 22}`. Note `20` on a 40px-tall button is exactly half the height, so it
is a pill; `20` on the 32px circle is over-specified and clips to a circle.

## 5. Shadows

| Value | Node | Notes |
| --- | --- | --- |
| `drop-shadow(0px 4px 6px rgba(198,144,61,0.25))` | `1:6610`, `1:6612` | gold glow; **both** buttons carry it, including the transparent Log In one |
| `0px 2px 8px 0px rgba(0,242,153,0.12)` | `1:6632` | emerald glow on balance pill |
| `0px 6px 14px 0px rgba(59,130,246,0.2), 0px 10px 18px 0px rgba(0,242,153,0.2)` | `1:6635` | two-layer glow under the deposit circle |
| `0px 2px 5px 0px rgba(35,101,169,0.1)` | `1:3338` | lift under the active category segment |

`1:6610` uses `drop-shadow` (filter), not `box-shadow`. On a transparent element with only
a text child, a CSS `filter: drop-shadow` traces the glyphs, while `box-shadow` traces the
rounded rect. Figma's is the box. Use `box-shadow` unless the screenshot shows glyph glow —
I could not re-fetch the screenshot to confirm (UNKNOWN Q3).

## 6. Spacing measured on token-bearing nodes

Recorded only where it came back with a colour; full layout is another agent's area.

- Pre/post-login header: `padding-left: 16px`, inner container `padding: 0 10px`, container
  `max-width: 1440px`, right cluster `gap: 2px`, logo box `77.143 × 36`, logo art `72.885 × 36`.
- Buttons `1:6610` / `1:6612`: `padding: 10px 24px`, fixed `width: 95px`.
- `1:6632`: `height: 40px`, `padding: 4px 8px`, `gap: 12px`.
- Search button `1:6614` / `1:6638`: `40 × 40`, icon fills the full 40px box (no inset).
- Category switcher `1:3337`: `height: 44px`, `padding: 4px`, segments `width: 121px` fixed
  (the fourth, `1:3385`, is hug-width), segment `padding: 0 16px`, icon+label `gap: 8px` on
  the active segment but `6px` on the three inactive ones — a 2px inconsistency in the source.
- Bottom navbar `1:6488`: frame `390 × 111`, bar art `390 × 68` at `top: 43`, tab row
  `376px` wide at `top: 55`, each tab `width: 70px`, `gap: 2px` between icon and label,
  icons `24 × 24` (except Live casino `19 × 24`), active dot `4 × 4`.

## 7. Interaction states visible in the tokens

- `1:6488` is a **component with a `Property 1` variant**: `"log in ua" | "log in ru" | "log in en"`.
  It is a language switch, not a state switch — the only differences are the label strings
  and a 0.037px width wobble on the Subtract art. Ukrainian is the default.
- Bottom nav selected state = label recoloured `#FFFFFF` → `#FFB095` **plus** a 4px
  `active-dot` SVG at `left: calc(50% - 83px); top: 99px`. In the UA variant the peach label
  is "Спорт", but the dot sits under the left-hand pair — see UNKNOWN Q4.
- Category switcher selected state = fill `#C9DCF4` + `0 2px 5px rgba(35,101,169,0.1)` +
  label `#71809A` → `#102A67`. Inactive segments have no fill and no shadow.
- Header has two whole variants as separate nodes: `1:6594` pre-login (Log In / Sign In) and
  `1:6617` post-login (balance pill + deposit `+`). The search button `40×40` is common to both.
- No hover, focus, pressed or disabled variant was found on any node I reached. Mobile-only
  design, so hover is moot, but **focus-visible has no design and will have to be invented**.

---

## 8. Contrast — computed, not eyeballed

Ratios below are WCAG 2.x, computed with the sRGB relative-luminance formula over the exact
hexes above. Alpha fills were composited onto their real backdrop first.

| Ratio | Pair | Verdict |
| --- | --- | --- |
| 19.90 | `#FFFFFF` on `#080814` — header + bottom-nav labels | pass |
| 13.24 | `#00F299` on `#080B16` — balance figure | pass |
| 13.13 | `#000000` on `#F0C775` — Sign In, light stop | pass |
| 11.89 | `#102A67` on `#E8F1FC` | pass |
| 9.70 | `#102A67` on `#C9DCF4` — active category label | pass |
| 7.46 | `#000000` on `#C6903D` — Sign In, dark stop | pass |
| 14.85 | `#191970` on `#FFFFFF` — var Navy on var BG main | pass |

### FAILURES — these will red the CI a11y gate

**F1 — `#71809A` on `#E8F1FC` = 3.50:1. Fails AA (needs 4.5:1).**
Nodes `1:3378` "Слоти", `1:3384` and `1:3390` "лайв Казіно". 13px Inter Medium is body text,
not large text, so 4.5 is the bar. This is a plain `color-contrast` hit — axe-core rates it
**serious**, `scripts/a11y.mjs` exits 1 on serious, so this one fails the build on its own.
Darkening the label to about `#5F6C86` reaches 4.53:1 against `#E8F1FC` and keeps the hue.
The designer has to sign that off; do not silently change it.

**F2 — `#FF4500` on `#FFFFFF` = 3.44:1. Fails AA for body text.**
This is variable `Orange` against variable `BG main`. It passes the 3:1 large-text bar
(≥18.66px bold or ≥24px regular) and the 3:1 UI-boundary bar, and fails everything else. I
found no node using either variable, so this is a latent failure, not a live one — but if
`Orange` becomes the brand text colour on a white page, it fails immediately.

### Below 3:1, non-text — axe will not catch these, a reviewer will

**F3 — emerald border `rgba(0,163,114,0.5)` over `#080814` resolves to `#045643`, which is
2.29:1 against `#080814`.** Node `1:6632`. That border is the only thing marking the
boundary of the balance control, so WCAG 1.4.11 wants 3:1. axe-core does **not** test
1.4.11, so this will not fail the build — it will fail a manual audit. Raising the alpha to
about 0.62 gets it over 3:1.

**F4 — active segment `#C9DCF4` against track `#E8F1FC` = 1.23:1.** Node `1:3338` vs
`1:3337`. The fill difference is nearly invisible; the `0 2px 5px rgba(35,101,169,0.1)`
shadow is doing most of the work and shadows do not survive high-contrast modes or
grayscale. The label colour change (`#71809A` → `#102A67`, 9.70:1) is the only robust
selected-state signal. If the built control is a real tab list, `aria-selected` covers the
assistive-tech side; the visual side stays weak.

---

## UNKNOWN

Every one of these is a probe that did not run, not a judgement call I skipped.

**Q1.** Do `Orange` `#FF4500` and `Navy` `#191970` appear on any real node, or are they dead
variables inherited from a template? Nothing I measured uses them. Which nodes bind them?

**Q2.** What is the background fill of the bottom navbar `1:6488`? The bar is drawn as a
single `Subtract` SVG (`1:6490`, `390 × 68`, asset
`https://www.figma.com/api/mcp/asset/2e55b305-c396-44e4-bd8a-57ea100c0506.svg`), so
`get_design_context` returned no hex for it. Every contrast number for the bottom-nav labels
in section 8 assumed `#080814` by analogy with the headers — **that assumption is unverified
and I have not treated it as measured.** If the bar is lighter, `#FFB095` at 12px could fail.
Resolve by reading the `fill` in that SVG, or by asking the designer.

**Q3.** Is the gold glow on `1:6610` / `1:6612` a box shadow or a glyph-tracing filter?
Figma emitted `drop-shadow(...)`, which behaves differently from `box-shadow` on the
transparent Log In button.

**Q4.** In the `"log in ua"` variant the peach `#FFB095` label is "Спорт" (tab 2 of 4), but
`active-dot` `1:6516` sits at `left: calc(50% - 83px)`, which is under the left pair. Are the
dot and the colour marking the same tab, or is one of them misplaced in the source?

**Q5.** Content row `1:3414` — never reached (rate limit). Its surface colour, card radius,
card shadow and title type are missing from this sheet.

**Q6.** Sport filters `1:6333` — never reached (rate limit). Its chip fill, selected-chip
fill, border and label type are missing from this sheet.

**Q7.** Is there any focus, pressed or disabled state anywhere in the file? None of the six
nodes I reached had one. If the answer is no, the implementer is inventing a11y states with
no design cover.

**Q8.** No blur, no opacity-on-overlay and no backdrop-filter was found on any node I
reached, but I only reached 6 of them. Are there scrim/modal tokens elsewhere?

**Q9.** The Figma MCP quota for this seat is exhausted. When does it reset, and is there a
higher-tier seat available? Sections 2–8 cannot be completed without more calls.
