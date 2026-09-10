# Next session — fluid on every phone, plus the owner's remaining decisions

## Start here (the session that runs this plan has no memory of the one that wrote it)

- Repo: `C:\Users\BogdanLocal\orca\workspaces\tw-platform\main`, branch `design-mkt-1/main`,
  pushed to `origin/main` at `74e9478` (2026-09-10). Push target: `git push origin HEAD:main`.
- Read first: `CLAUDE.md` (binding house rules, skills table), `docs/ux-audit-2026-09-10.md`
  (the audit this continues, IDs like B1-18 / B4-13 refer to it), `docs/next-session.md`.
- The last session's work, one commit per area: `865b796` casino, `0b47ba9` sport, `ddca08f`
  shell, `cef4286` audit docs, `74e9478` inert controls dimmed.
- Talk to the owner in Romanian; everything written to files in English.
- Skills that fire on this work (CLAUDE.md table): `ui-ux-pro-max:design` / `ui-ux-pro-max`
  (owner asked for it "la maxim"), `make-interfaces-feel-better`, `motion-foundations` then
  `motion-ui` for the hero indicator, `accessibility`, `browser-qa`, `click-path-audit`,
  `verification-loop`, `variante` if the nav plate needs a visual choice.
- Chrome's window cannot be resized here (maximised); last session measured widths by loading
  the app into a same-origin `<iframe>` of exact size inside a Chrome tab, and by
  `scripts/shot.mjs` (Playwright, installed Chrome). Keep each `javascript_tool` call short —
  a 12-page loop froze the tab at 45s.
- Step 0 (saving this plan as `docs/plan-fluid-phones.md` and linking it from
  `docs/next-session.md`) was done by the session that wrote it. Start at "Execution".

## Context

The 2026-09-10 audit made the app fluid **below** 390 and capped it at a centred 390 column
above. On the owner's iPhone (440 wide) that leaves 25px of empty page each side — measured
from their screenshot: header 816 of 921 image px = 390 css, so viewport ≈ 440. `ui-ux-pro-max`
agrees this is wrong for a phone: `container-width` is a *desktop* rule, "consistent content
width per device class (phone/tablet)", and "Don't: fixed width images".

Owner decisions of 2026-09-10 (all taken in chat, do not re-open):

| Item | Decision |
| --- | --- |
| Phone widths | **Fluid on every phone.** A desktop version comes later, after mobile is right — keep that in mind, do not build it now. |
| Hero | **5 slides** (repeating the one offer is fine, it is a demo), indicator bars that follow the scroll |
| `Всі (120)` | Keep the literal |
| Countdown | Starts correct (no jump from build time), stays live |
| Phone Back gesture | Closes an open menu / search instead of leaving the site |
| Copy-ID | Icon becomes a check for 1.5s, no new text |
| Menu `More`, `ENGLISH` | Become inert controls (dimmed like the rest) |
| `Drop & Wins` | Stays as dealt (next six free games) |
| Small type | 12px for the information-bearing ones only: kickoff time, countdown, sport filter counts |
| Search field focus | Blue border on focus (`focus-within:border-label`), accepted in every search frame |
| `Лайв` / `Лайф` | `Лайв` stays — record the decision, no code |
| `Купон` | Stays inert |

Still undecided and out of scope: currency format, the search suggestion row copy
(`Pragmatic` / `20 ігор`), provider row second track (UNKNOWN #6), `1:7363` stays unaddressable.

## Where the 390 cap lives today (grep, 2026-09-10)

- `src/app/globals.css:167` `body { max-width: 390px }`
- `src/components/layout/BottomNavBar.tsx:151` frame `max-w-[390px]`; plate stretches
  (`preserveAspectRatio=none`), the 96px well and the Меню button track the notch centre
- `src/components/primitives/Sheet.tsx:122` `max-w-[390px]`
- `src/components/sport/BetSlipFab.tsx:91` `max-w-[390px]`
- `src/components/casino/GameGrid.tsx:77` `auto-cols-[min(theme(spacing.card-w),calc((100%-16px)/3+0.01px))]` — the `min(114px, …)` stops cards growing
- `HeroCarousel.tsx:154`, `BonusCarousel.tsx:140` slides `w-[340px] h-[170px]` with artwork and
  text placed in px inside
- Smaller fixed widths that leave dead space when wider: `Footer.tsx:134` tiles `w-[160px]`,
  `FooterLinkColumn.tsx:22-24` columns 158/141, `MenuPanel.tsx:517,534` Support / Vip `w-[168px]`,
  `TournamentCard.tsx:61-62` inner 303/190

## Approach

**Cap.** `body` max-width becomes **480px**: covers every current phone (440 Pro Max, Androids
to 480); on desktop it is still a centred phone column until the desktop project. Nav, Sheet
and FAB caps follow to 480 through one CSS variable (`--page-max: 480px` in `globals.css`), so
the desktop project later changes one value. At 390 every drawn pixel stays identical.

**Scale rule.** Anything drawn as a fixed-size artwork (hero and bonus slides, tournament card
inner) keeps the design's proportions by expressing its inner px values in container units:
`container-type: inline-size` on the slide, and each drawn value written as
`calc(100cqw * <px> / 340)` (valid CSS: a length times a number over a number; `cqw` is in
Safari 16+ and Chrome 105+). At a 340px slide that resolves to the exact design px. Slide
width becomes `calc(100% - 50px)` (keeps the 30px peek of the next slide) with
`aspect-[340/170]`.

**Grids** drop the 114px cap: `auto-cols-[calc((100%-16px)/3+0.01px)]` (the +0.01px is the
measured Chrome rounding fix from D2 — keep it). Cards keep `aspect-[114/148]`.

**Nav plate** above 390: stretching widens the notch (78 → 88 at 440), loosening the ring
around the Меню button. First thing in that stream: screenshot at 440 and 480, and if the ring
looks wrong use the `variante` skill to show the owner 2–3 options (stretch as now / fixed-width
centre notch with stretching sides / scale the whole nav) before coding.
**Done 2026-09-10:** the owner picked the fixed notch (option A, `docs/mockups/nav-notch/`).

## Execution — three agents on disjoint files (CLAUDE.md default)

Write a common brief like last session's (it lived in a scratchpad and is gone): one dev server
**on a port you check first** (`D:\jp-platform` held 3000 on 2026-09-10 — the port trap);
every agent its own `NEXT_DIST_DIR` if it must run next; no commits by agents; verify with
`scripts/shot.mjs` at **360, 375, 390, 414, 430, 440, 480**; 390 pixel-diffed against a
baseline taken before any change.

**F1 — shell** (`globals.css`, `layout/*`, `panels/*`, `primitives/*`, `UrlStateBridge.tsx`,
`store/*`, `not-found.tsx`)
1. `--page-max: 480px`; body, Sheet, nav use it. Nav plate at 440/480 (see above).
2. Menu `Support` / `Vip Manager` share the row (`flex-1`), not 168px each.
3. **Back gesture**: `openPanel` pushes one history entry; a `popstate` listener closes the
   panel. `UrlStateBridge` uses `replaceState` for everything else — keep it (it carries
   `window.history.state`; passing `null` once killed every menu link).
4. **Copy-ID**: swap to a check glyph for 1.5s after `writeText` resolves (reuse `MENU_ICONS`;
   if no check glyph exists, ask before drawing one).
5. **`More` and `ENGLISH`**: become `<button type="button" aria-disabled="true">` so the global
   inert style applies (`globals.css` `[aria-disabled='true']`).
6. **Search focus**: re-add `focus-within:border-label` on the `SearchField` form (removed on
   2026-09-10; the owner now wants it).
7. Polish carried over: focus lands on `<main>` after a menu row changes route (B1-18); delete
   the unused `ghost` Button variant (B4-13).

**F2 — casino** (`app/page.tsx`, `components/casino/*`, `lib/data.ts`, `lib/sections.ts`, casino data)
1. Grids: drop the 114 cap. Footer tiles two per row by `basis-[calc(50%-6px)]`, link columns
   `flex-1`. Tournament card inner in container units.
2. **Hero**: 5 slides, width `calc(100% - 50px)`, inner in container units. Indicator: 5 bars,
   bound to scroll position (one `scroll` listener with `scrollLeft / slideWidth`, or an
   IntersectionObserver). **At rest the first bar looks exactly like the design's bar 1** and
   the bars step down through the design's styles 2–4 by distance from the active one.
3. **Countdown**: render `--:--:--` until the first client tick, then live — no jump from the
   build instant (`RENDERED_AT`, `page.tsx:37`). Countdown font 11 → 12px.
4. Polish: grid tiles as `<ul>/<li>` (B2-24).

**F3 — sport** (`app/sport/page.tsx`, `components/sport/*`, sport data)
1. Bonus carousel: same slide treatment as the hero (2 slides stay).
2. `BetSlipFab` uses `--page-max`.
3. Small type: kickoff time (`MatchRow.tsx` `text-6xs`, 10px) and filter counts
   (`SportFilterRow.tsx` `text-5xs`, 11px) → 12px; check nothing wraps or clips at 360.

## Then (main session)

- Chrome pass at 360 / 375 / 390 / 414 / 430 / 440 / 480: no empty strip at the sides, no
  element off screen, 390 identical to baseline. Click paths: hero swipe moves the bars; Back
  closes the menu and the search; copy-ID shows the check.
- Gate: `npx tsc --noEmit`, `npx eslint src --max-warnings=0`, `npm test`, CI-identical build
  (`GITHUB_PAGES=true npm run build`, dev stopped, delete `.next` after), `serve.mjs`, then
  `review.mjs` + `a11y.mjs`: 0 problems, 0 moderate.
- Extend `review.mjs` so Guard 2 (horizontal overflow) also runs at 440 — today it runs only
  at 390, which is how this bug shipped.
- Docs: `CLAUDE.md` — replace "every frame is 390, no breakpoint" framing with "fluid on
  phones, capped by `--page-max`; desktop is a later project"; add the decision rows above.
  Update `docs/ux-audit-2026-09-10.md` statuses and the report page
  (https://claude.ai/code/artifact/1b83de4c-e680-4ed3-bffe-96209ea13310).
- Commit per area, `git fetch` + `git log HEAD..origin/main`, push to `main` (deploys).

## Verification

```
node scripts/shot.mjs http://localhost:<port>/ .review-tmp/fluid/home-440.png 440 956 full
npx tsc --noEmit && npx eslint src --max-warnings=0 && npm test
GITHUB_PAGES=true npm run build
node scripts/serve.mjs out 4173
node scripts/review.mjs .review-tmp/fluid http://127.0.0.1:4173/tw-platform
node scripts/a11y.mjs  .review-tmp/fluid http://127.0.0.1:4173/tw-platform
```

On the owner's phone: open https://design-mkt-1.github.io/tw-platform/ — the header and the
page fill the screen edge to edge.
