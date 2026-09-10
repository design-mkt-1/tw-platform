# Next session — Top-Win

Written 2026-09-10, at the end of the session that built it.

## Where things stand

The demo is built, pushed and deployed.

**https://design-mkt-1.github.io/tw-platform/**

| Route | What is there |
| --- | --- |
| `/` | Casino home — header, hero carousel, category bar that filters, recent-wins ticker, eight game grids over a 53-game catalogue, provider row, three tournament cards with a live countdown, footer |
| `/sport` | Sportsbook — Прематч/Лайв switch, sports nav, bonus carousel, league strip, filter pills, and five leagues with eleven fixtures |
| `?panel=menu` | The slide-in menu, three variants by `?auth=` |
| `?panel=search` | The provider search, four states derived from `?q=` |
| anything else | `not-found` — every other href in the design is dead by design |

Four commits, in order: `9a70afb` the foundation, `656c1a6` the casino home, `6d96f2a` the
sportsbook and the panels, `c4ddc1c` the real menu icons.

Every push to `main` deploys. The workflow typechecks, lints, tests, builds and runs an
accessibility report before the deploy step, so a broken commit does not reach the client's link.

## Start here

```bash
npm ci                 # only in a fresh checkout
npm run dev            # http://localhost:3000
npm test
npm run build:check
node scripts/review.mjs <outDir> [baseUrl]
node scripts/a11y.mjs  <outDir> [baseUrl]
```

`CLAUDE.md` is the working rules and it is not optional reading — it carries the default working
mode for this repo, the skills that fire without being asked, and every trap already paid for.
`docs/tokens.md` is the design-to-code bridge. `docs/design-inventory/` is the measurement
underneath it.

### Three traps that cost time on 2026-09-10

**A dev server for another project was holding port 3000**, so this app bound 3001 and said so in
a line nobody read. All three capture scripts default to 3000. The first screenshot of the
"Top-Win casino home" was a screenshot of the Jackpot demo — dark, English, GBP — taken with zero
errors and saved under a Top-Win filename. Nothing in a filename, an exit code or a log
distinguishes those two runs. `scripts/assert-app.mjs` now checks the page's title after every
navigation and stops with the port to look at. If a capture script refuses, read what it says
rather than pointing it somewhere else.

**In a checkout without `node_modules`, `npx tsc --noEmit` does not fail.** It downloads an
unrelated `tsc@2.0.4`, prints "This is not the tsc command you are looking for", and exits 0. Run
`npx tsc --version` and confirm 5.x before believing a clean typecheck in a fresh clone.

**GitHub Pages was set to "deploy from a branch"**, so every push started two deployments — the
workflow and GitHub's own build — and whichever finished last won, while the branch build serves
a repo root with no `index.html`. Fixed with
`gh api -X PUT repos/design-mkt-1/tw-platform/pages -f build_type=workflow`. If the site ever
shows something that is not the build, check that first.

## Decisions already taken — do not re-open without a reason

| Decision | Why it is written down |
| --- | --- |
| **The design's colours ship unchanged.** 23 text pairs fall below WCAG AA and are reported, never silently corrected | The accessibility step in CI became a report rather than a gate because of this. `docs/tokens.md` §7 lists each pair with a value that would pass |
| **Obvious mistakes are fixed, repeated placeholder content is varied** | `Реєстарція` ships as `Реєстрація`; the fourth category chip, the second league card and the filter counts are real instead of duplicates |
| **The footer ships exactly as drawn** — no licence number, no regulator mark, no 18+ badge, no responsible-gambling line, support address unchanged | On a gambling site this is a decision, and it must not read as an oversight |
| **Game cards without artwork keep the generated gradient** | Four distinct game tiles exist in the entire Figma file |
| **Ukrainian only.** No language switcher, though the nav component carries ua/ru/en variants | |
| **Every finished piece is pushed to `main` as it lands** | Rather than held for a complete build |
| **The menu avatar stays navy**, though `1:6828` declares white | Taken from a side-by-side comparison on 2026-09-10. It is the one place the "colours ship as measured" rule is deliberately not applied: white measures 1.35:1 against its own circle |

## What is open

In the order I would take it.

1. **Three menu rows draw a disclosure chevron and cannot expand.** SPORT, CASINO and PAYMENTS
   carry `weui:arrow-filled` in the design, and the file contains no expanded state for any of
   them, anywhere. They currently ship as links with no chevron, so nothing promises a submenu
   that does not exist. Either build the submenus or accept the difference — but do not put the
   chevron back without one.
2. **The `/dev/screens` registry.** One row per Figma frame with its node id and a deep link, so a
   designer can open a single state instead of clicking to it. The predecessor project had one and
   it was the difference between a reviewable demo and a demo.
3. **The contrast report as a deliverable for the designer.** 23 pairs, each already computed with
   a replacement value that passes, in `docs/tokens.md` §7. It needs to leave the repo and reach
   whoever owns the design.
4. **A `code-tour` walkthrough** for the team taking this over — anchored to file and line, which
   is the difference between handing over code and handing over code somebody can read.
5. **Three section icons could not be exported**: megaways, wheel-fortune and the 20px
   must-play-slots. `download_assets` caps a subtree at 20 SVG fragments and the icons' mask
   stacks consume the cap. The sections using them fall back to an icon that exists.

### One thing that has already expired

The per-node asset UUIDs recorded across `docs/design-inventory/` were minted on 2026-09-10 and
Figma expires them after about seven days. They were still returning 200 on the last day and five
of the six final menu glyphs came free that way. **From now on they will not.** Anything still to
be exported needs a fresh `get_design_context` or `download_assets` call, which means it costs
quota — and that quota ran out once already, halfway through a twelve-agent pass.

Two other things worth knowing before spending a call on them:

- **`download_assets` cannot take every node id.** It validates against `^\d+[:-]\d+$`, so an
  instance node like the Support headset's `I1:6984;2642:42639` cannot be passed to it at all. A
  recorded UUID, or `get_design_context` on the parent, is the only route.
- **A recorded UUID is not always the glyph you asked for.** The WhatsApp mark's UUID turned out
  to be a 190.809x79.8116 sheet of 23 messenger brand marks — Slack, Zoom, Viber and the rest —
  that node `1:6988` clips a 16x16 window onto. Check what you downloaded before you ship it.

## What the design itself is missing or wrong

These are findings about the Figma file, not defects in the build. They belong in front of
whoever owns the design.

- **No legal block in the footer** — no licence number, no regulator logo, no 18+ mark, no
  responsible-gambling line. The support address is `Support@jack-pot.com`, the previous
  project's domain.
- **The menu is in English** on a site that is otherwise entirely Ukrainian. SPORT, CASINO,
  REFERRAL PROGRAM, TERMS OF USE. That is the design's own copy.
- **`Реєстарція`** — `а` and `р` transposed — on the register button, in three places.
- **Three font families cannot render the strings assigned to them.** Outfit ships latin and
  latin-ext only, Archivo Narrow the same, and Big Shoulders Display is not in Google's catalogue
  under that name; every string assigned to them is Cyrillic. Figma was already falling back when
  it rendered those frames. Expect layout fallout wherever a Figma box was fitted to Outfit's
  narrower metrics — the hero title's 131px box was the first.
- **One game tile repeated across all 48 cards.** The five URLs an earlier pass read as different
  artwork are byte-identical; Figma mints a fresh URL per instance.
- **One league badge repeated eight times** in the "Рекомендовані ліги" strip, all named
  `Europa_League_2021.svg`. Verified by sha256, not by layer name.
- **Two casino slides sit in the sportsbook carousel** — layer names `зевс` and
  `Gates of Olympus`, English copy, GBP prices. Their assets are on disk and deliberately
  unreferenced.
- **Three currencies on adjacent screens**: `₴250.000` on the hero, `$ 140.00` on the balance
  chip, `41.04 GBP` in the ticker.
- **No interaction states anywhere.** No hover, pressed, focus or disabled variant on a game card,
  a category chip, an odds cell or any button. The build invents a pressed state and a focus ring
  and nothing else.
- **Two dead frames on the canvas**, `1:6594` and `1:6617`, drawing a JACKPOT wordmark in English
  on a dark header. Not children of any screen. Not implemented.

## Where the numbers came from

Measured on the static export served the way CI serves it, on 2026-09-10:

- `scripts/review.mjs`: 10 states in both motion modes, 20 of 20 captured, zero console errors,
  `document.scrollWidth` 390 in every one.
- `scripts/a11y.mjs`: **0 critical, 191 serious, and every one of the 191 is the same rule** —
  `color-contrast`. No missing accessible name, no ARIA error, no landmark problem. The only
  accessibility failures in this build are the design's own colours.
- 77 assets, 2.30 MB total. They started at 22.2 MB: six files had been downloaded twice under
  different names, and the game tile arrived as a 2.7 MB animated GIF behind a `.png` URL for a
  card the design draws at 114x148.
