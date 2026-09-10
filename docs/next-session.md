# Next session — Top-Win

Rewritten 2026-09-10, at the end of the session that swept the build in a browser and fixed what it
found. The previous version of this file was written earlier the same day, before any of that.

## Where things stand

The demo is built, pushed and deployed.

**https://design-mkt-1.github.io/tw-platform/**

| Route | What is there |
| --- | --- |
| `/` | Casino home — header, hero carousel, a category bar that **filters the grids**, recent-wins ticker, eight game grids over a 53-game catalogue, provider row, three tournament cards with a live countdown, footer |
| `/sport` | Sportsbook — Прематч/Лайв switch, sports nav, bonus carousel, league strip, filter pills, five leagues with eleven fixtures, and the `Купон` bet-slip button |
| `?panel=menu` | The slide-in menu, three variants by `?auth=` |
| `?panel=search` | The provider search, four states derived from `?q=` |
| `/dev/screens` | The frame registry: eleven Figma frames, ten with a built state, each with its node id and a deep link. Published but linked from nowhere |
| anything else | `not-found` — every other href in the design is dead by design |

## What this session changed, and why it mattered

Both capture scripts were green and the accessibility report contained nothing but the one contrast
class the owner had already accepted. **Seven real defects were sitting under that.** Five parallel
read-only workers drove the live build in Chrome at 390×844; five more fixed what they found.

| Defect | What a user saw | Root cause |
| --- | --- | --- |
| **All eleven menu links navigated nowhere** | Tap SPORT in the menu: the panel closes and you are still on the casino home | `UrlStateBridge` called `history.replaceState(null, …)`. Next patches `replaceState` and treats any call carrying state that is not its own as a restore, which marks the click's own pending navigation as discarded. No `pushState` was ever issued |
| **The four category chips filtered nothing** | Tap `Слоти`: the paint moves, the 51 cards do not | `activeCategory` was written by `CategoryBar` and read by nothing else. `GameGrid` took its filter from the section spec |
| **The last odds cell on `/sport` opened the menu** | Tap the odds, get the menu | The raised button's decorative glow is 123.891×131.535 inside a 63.653×93 button, with pointer events on |
| **A `✦` sat on top of the hero headline** | The promo badge wrapped onto two lines | 169.98px of Cyrillic in a 168px content box. Outfit ships no Cyrillic; Inter is wider |
| **The tournament join button was cut off** | `Приєднатися` clipped out of the card | `tournaments.json` kept the design's second title paragraph `2000` inside the title string while the card also rendered `prizeMinor`, so the prize printed twice and pushed the pill to y 225 in a 220-tall clipped card |
| **The sportsbook header sat 12px low under two shadows** | Everything below the switch was 12px off | `pt-3` applied three times and `shadow-container` twice, across two nested plates. The design's own arithmetic puts the track at y 84 |
| **`Купон` was never mounted** | Select an outcome, nothing appears | The component existed and no file rendered it |

Two more were found and fixed while fixing those: the bet-slip button itself covered the last
fixture's odds cells at maximum scroll (it now reserves 60px of flow while visible), and the header
search button claimed neither `aria-haspopup` nor `aria-expanded` while the nav button carried both.

## Start here

```bash
npm ci                 # only in a fresh checkout
npm run dev            # http://localhost:3000 — check the port it prints
npm test
npm run build:check
node scripts/review.mjs <outDir> [baseUrl]
node scripts/a11y.mjs  <outDir> [baseUrl]
```

`CLAUDE.md` is the working rules and it is not optional reading. `docs/tokens.md` is the
design-to-code bridge. `docs/design-inventory/` is the measurement underneath it, and its README now
carries three answers to questions those files record as unknown.

Two new things to know before you run anything:

- **A free port is not enough for a parallel run.** Two dev servers on different ports still share
  `.next` and corrupt it into React-Client-Manifest 500s. Each concurrent agent needs its own
  `NEXT_DIST_DIR`.
- **Every build edits `tsconfig.json`, which is tracked.** Next appends its dist directory to
  `include`. Check `git diff tsconfig.json` before staging.

## Decisions already taken — do not re-open without a reason

| Decision | Date | Why it is written down |
| --- | --- | --- |
| **The design's colours ship unchanged.** 23 text pairs fall below WCAG AA and are reported, never silently corrected | 2026-09-10 | The accessibility step in CI is a report rather than a gate because of this |
| **Obvious mistakes are fixed, repeated placeholder content is varied** | 2026-09-10 | `Реєстарція` ships as `Реєстрація`; all three tournament cards carry the same title in Figma and are given distinct ones here |
| **The footer ships exactly as drawn** — no licence number, no regulator mark, no 18+ badge, no responsible-gambling line | 2026-09-10 | On a gambling site this is a decision, and it must not read as an oversight |
| **Game cards without artwork keep the generated gradient** | 2026-09-10 | Four distinct game tiles exist in the entire Figma file |
| **Ukrainian only.** No language switcher | 2026-09-10 | |
| **The menu avatar stays navy**, though `1:6828` declares white | 2026-09-10 | White measures 1.35:1 against its own circle |
| **The three chevron rows accept the difference.** SPORT, CASINO and PAYMENTS ship as plain links with no chevron | 2026-09-10 | The design draws `weui:arrow-filled` on all three and contains no expanded state anywhere. Building submenus would mean inventing rows, copy and geometry. The question is in the designer package instead |
| **The category chips filter the game grids** | 2026-09-10 | The behaviour is **ours**, not the design's — Figma has no frame with a different chip selected. `Популярне` deliberately narrows nothing, so the one state the file does draw is unchanged |
| **The bet slip is mounted, anchored bottom-right** | 2026-09-10 | Also ours: node `1:6484` sits alone on the canvas at (3528, 313) and no page frame instantiates it, so the corner is a decision |
| **`/dev/screens` is published and linked from nowhere** | 2026-09-10 | A static export has no dev-only mode. Its copy is English because it has no design and no player |
| **Every finished piece is pushed to `main` as it lands** | 2026-09-10 | |

## What is open

In the order I would take it.

1. **The coverage guard over-reports, and a guard nobody believes is worse than none.** The last
   clean run printed 24 problems, all on `/sport`, all odds cells sitting under the fixed bottom
   navigation at a sampled scroll position. **Measured: at true maximum scroll (991) all three are
   reachable** — the user scrolls 73px further and presses them. But `review.mjs` samples
   `[0, height/2, height]`, and `height` is the document height, not the maximum scroll offset, so it
   never tests the position that matters. The comment at `scripts/review.mjs:157` argues the reports
   are true and deliberate, and it is right about the glow — that defect showed at scrollY 462, twelve
   pixels **above** the painted bar, and a filter excluding the navigation would have hidden it. So
   the fix is not a filter. Start with the sampling: test at `scrollHeight - innerHeight`, not at
   `scrollHeight`.
2. **Three of the four category states have no address.** Tapping `Слоти` changes the page and
   nothing can link to the result, so `review.mjs` and `a11y.mjs` never see it. This is the same rule
   that gave the search states their `?q=`. It needs a fourth param in `UrlStateBridge` and three
   rows in `screens.json`.
3. **`1:7363`, the `Нещодавні запити` search state, still has no address** and has never been
   captured or scanned. It needs `recent.length > 0`, and `recent` lives only in the store. Same fix
   shape as item 2.
4. **The tournament prize shows `2 000 ₴`; the design draws a bare `2000`.** `formatUahWhole` is the
   single place in `src` that touches `Intl` and that is deliberate, so this is a copy decision, not
   a bug. Note the design is already inconsistent about currency across adjacent screens —
   `₴250.000` on the hero, `$ 140.00` on the balance chip, `41.04 GBP` in the ticker.
5. **`Купон` has no `onClick`.** The Figma file draws no bet-slip panel for it to open. Either it
   joins the register of controls the design gives no target, or the panel needs designing.
6. **The bottom navigation is unusable at a 195px layout viewport** — `Лайв казіно` and `Промо` are
   fully offscreen and a fixed box does not scroll (WCAG 1.4.10). That is 200% zoom on a 390px
   screen.
7. **The type scale is px-only**, so a reader who raises their browser font size sees no change
   (WCAG 1.4.4). Filed from `tailwind.config.ts:173-195`; **not observed in a browser**, because
   Chrome's font-size setting could not be reached from this environment.
8. **`a11y.mjs` does not assert which frame it scanned.** `review.mjs` now does, via `expectText` per
   registry row. Sharing that needs a helper under `scripts/`.

### Ten accessibility findings that were always there and were never mentioned

The previous handover said "no landmark problem". That was true of the *serious* set only. The
current run reports **0 critical, 188 serious — every one `color-contrast` — and 10 moderate**:

- `landmark-no-duplicate-banner` and `landmark-unique`, in the three menu states. The panel renders
  its own `<header>` while the page header is also in the tree. The panel header predates this
  session (`MenuPanel.tsx` line 131 of the committed file).
- `page-has-heading-one`, on both pages. The only `<h1>` in the repo is in `not-found.tsx`.

Serious went from 191 to 188. I did not attribute the three.

### One thing that has expired, and one that had not

The per-node asset UUIDs across `docs/design-inventory/` were minted on 2026-09-10 and Figma expires
them after about seven days. **On the day they were still resolving**, and the `megaways` section
icon was recovered from the URL recorded at `03-casino-rows-b.md:263` with a plain `curl` and no MCP
call. Two Figma calls recovered the other two. All three sections that had fallen back to the
`popular` glyph now carry their own.

That route is closing. Anything still to be exported needs a fresh call, which costs quota — and
that quota ran out once already, halfway through a twelve-agent pass. Two things worth knowing
before spending one:

- **`download_assets` cannot take every node id.** It validates against `^\d+[:-]\d+$`, so an
  instance node like `I1:6984;2642:42639` cannot be passed at all.
- **A recorded UUID is not always the glyph you asked for.** The WhatsApp mark's UUID turned out to
  be a 190.809×79.8116 sheet of 23 messenger brand marks that node `1:6988` clips a 16×16 window
  onto.

The cap that blocked those three icons is per **subtree**: calling `download_assets` on the icon
frame itself returns the whole node as one flat export and the cap never bites.

## What the design itself is missing or wrong

Findings about the Figma file, not defects in the build. They belong in front of whoever owns the
design, and they are in the contrast report that was delivered with it.

- **No legal block in the footer** — no licence number, no regulator logo, no 18+ mark, no
  responsible-gambling line. The support address is `Support@jack-pot.com`, the previous project's
  domain.
- **The menu is in English** on a site that is otherwise entirely Ukrainian.
- **`Реєстарція`** — `а` and `р` transposed — on the register button, in three places.
- **Three font families cannot render the strings assigned to them.** Outfit and Archivo Narrow ship
  no Cyrillic and Big Shoulders Display is not in Google's catalogue under that name; every string
  assigned to them is Cyrillic. Expect layout fallout wherever a box was fitted to Outfit's metrics.
- **One game tile repeated across all 48 cards**, byte-identical. **One league badge repeated eight
  times.** **The same tournament card title in all three cards.** All verified by sha256 or by node
  id, not by layer name.
- **Two casino slides sit in the sportsbook carousel** — `зевс` and `Gates of Olympus`, English copy,
  GBP prices.
- **Three currencies on adjacent screens**: `₴250.000`, `$ 140.00`, `41.04 GBP`.
- **No interaction states anywhere.** No hover, pressed, focus or disabled variant on any control.
  The build invents one pressed state and one focus ring and nothing else.
- **Three menu rows draw a chevron with no expanded state behind it.**
- **Two dead frames on the canvas**, `1:6594` and `1:6617`, drawing a JACKPOT wordmark in English on
  a dark header. Not children of any screen. Not implemented.

## Where the numbers came from

Measured on the static export served the way CI serves it, on 2026-09-10, after the fixes:

- `npx tsc --noEmit` and `npx eslint src --max-warnings=0`: clean. **Confirm `npx tsc --version`
  says 5.x** — in a checkout without `node_modules`, npx fetches an unrelated `tsc@2.0.4`, prints
  "This is not the tsc command you are looking for", and exits 0.
- `npm test`: 181 tests in 6 files.
- `next build` with `GITHUB_PAGES=true`: 7 static routes, including `/dev/screens`.
- `scripts/review.mjs`: 20 of 20 captured, zero console errors, zero responses at 400 or above, zero
  wrong-frame reports, `scrollWidth` 390 in every state, five allowlisted overflows printed by name,
  and the 24 coverage reports discussed in open item 1.
- `scripts/a11y.mjs`: 0 critical, 188 serious, 10 moderate.
- 86 files under `public/images`, 2.6 MB — three more than the previous count, the recovered
  section icons.
