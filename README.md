# Top-Win — mobile casino and sportsbook demo

A working demo of the Top-Win platform, built from the Figma file `s2CqwGqe0O0FcALhBNlTRe`
(one page, `New Platform`). Next.js 15, TypeScript, Tailwind v3, no backend — every piece of data
is mock JSON under `src/data/`.

**Mobile only, at 390px.** Every one of the design's eleven frames is 390 wide. There is no desktop
frame, no tablet frame and no breakpoint anywhere in the file, so the code declares none either.

|          |                                             |
| -------- | ------------------------------------------- |
| **Demo** | https://design-mkt-1.github.io/tw-platform/ |

The site is public but carries `noindex` and a `robots.txt` disallow: it is an unreleased design
carrying third-party brand marks, so the link is shareable but should not surface in search.

## Running it

Needs Node 24 and Google Chrome (see _Screenshots_).

```bash
npm ci
npm run dev          # http://localhost:3000
```

If another Next project is already running, Next binds the next free port and says so in one line.
The capture scripts default to 3000 and would then photograph the other project, so they check what
they landed on and stop if it is not this app — see `scripts/assert-app.mjs`.

### Opening one state directly

The store mirrors three things into the query string, so any state the design draws can be linked
to instead of clicked to. A state nobody can link to is a state nobody can review.

| Suffix | Shows |
| --- | --- |
| `?auth=prelogin` · `?auth=vip` | the header and the menu in that account state |
| `?panel=menu` | the slide-in menu — nodes 1:6641 / 1:6816 / 1:7015 |
| `?panel=search` | the search panel at rest — node 1:7595 |
| `?panel=search&q=prag` | search suggestions — node 1:7806 |
| `?panel=search&q=ксзщ` | search with no matches — node 1:7214 |
| `/sport` | the sportsbook — node 1:5994 |

### Checks

```bash
npx tsc --noEmit
npx eslint src --max-warnings=0
npm test
npm run build:check          # production build, safe while dev is running
```

> **Never run `npm run build` while `next dev` is up.** Both own `.next`, and the collision corrupts
> it: every route starts returning 500 with `ENOENT ... _buildManifest.js.tmp.<random>` while the
> source is fine — a failure that looks like a code bug and is not one. `build:check` exists so this
> cannot happen.

> **In a checkout without `node_modules`, `npx tsc --noEmit` does not fail.** It downloads an
> unrelated `tsc@2.0.4`, prints "This is not the tsc command you are looking for", and exits 0. Run
> `npx tsc --version` and confirm 5.x before trusting a clean typecheck in a fresh clone.

### Screenshots

```bash
node scripts/shot.mjs <url> <out.png> [w] [h] [full|viewport] [scrollY|#selector]
node scripts/review.mjs <outDir> [baseUrl]   # every state, twice: reduce and no-preference
node scripts/a11y.mjs <outDir> [baseUrl]     # axe-core over the same states
node scripts/clean-svg.mjs public/images --dry
node scripts/to-webp.mjs public/images --dry
```

These drive **the Chrome already installed on the machine** (`channel: 'chrome'`), not a Playwright
download — that download fails in this environment, so `npx playwright install` is not needed.
`review.mjs` shoots every state in both motion modes, so a rule that only fires under Reduce Motion
cannot hide. A full-page shot walks the page down and back first; otherwise `loading="lazy"` never
fires and the artwork comes out blank.

## Deployment

Every push to `main` runs `.github/workflows/pages.yml`: typecheck, lint, tests, static export with
`GITHUB_PAGES=true`, an accessibility report, then deploy.

The Pages source must be **GitHub Actions**, not "deploy from a branch". With a branch source every
push starts two deployments — the workflow and GitHub's own build — and whichever finishes last
wins, while the branch build serves a repo root that has no `index.html`.

`basePath` is applied only when `GITHUB_PAGES=true`. Turning it on locally would move the dev server
to `/tw-platform` and break the capture scripts, which address the root.

## Where things are

| Path | What |
| --- | --- |
| `src/lib/sections.ts` | **The spine.** The casino page described as data; four renderers, not fourteen components. A new row is four lines here. |
| `src/lib/assets.ts` | The only place that turns an asset name into a URL, and the only place that knows about the deployment's base path |
| `src/lib/search.ts` | One ranker. Its `normalize()` is built from what to remove rather than what to keep, which is the only reason it works on Cyrillic at all |
| `src/store/useAppStore.ts` | Auth mode, open panel, query. Mirrored into the URL by `src/components/UrlStateBridge.tsx` |
| `docs/tokens.md` | **Read this before touching a colour.** 84 colours and 59 type steps, each with the Figma node it was measured on |
| `CLAUDE.md` | How to work in this repo, and every trap already hit |

## Known deliberate differences from the design

- **Fonts.** The design assigns Outfit, Archivo Narrow and Big Shoulders Display to strings that are
  entirely Cyrillic, and none of those three ships a Cyrillic subset — so Figma was already falling
  back when it rendered those frames. The build ships Inter and Roboto.
- **Colours are the design's, unchanged**, including 23 text pairs that fall below WCAG AA.
  `docs/tokens.md` §7 lists every pair with a value that would pass. The accessibility check runs on
  every push and reports; it does not block the deploy.
- **The footer ships exactly as drawn**: no licence number, no regulator mark, no 18+ badge, no
  responsible-gambling line, and the support address is the one the design writes. That is a
  decision, not an oversight.
- **Game cards without artwork draw a gradient with the title on it.** The whole Figma file contains
  four distinct game tiles and repeats one of them across all 48 cards.
- **Content is varied where the design repeats a placeholder.** The design draws the same category
  chip twice, the same league card twice and one Europa League badge eight times. The catalogue,
  the fixtures and the filter counts are real and distinct instead; the first league card reproduces
  the design's exactly.
- **`Реєстрація` is spelled correctly.** The design writes `Реєстарція`, with `а` and `р`
  transposed, in three places.
- **Currency is hryvnia throughout.** The design writes `₴` on the hero, `$` on the balance chip and
  `GBP` in the recent-wins ticker — three currencies on screens that sit beside each other.
- **The menu is in English.** That is the design's own copy, not a translation gap, on a site that
  is otherwise entirely Ukrainian.
- **The sport carousel ships two slides, not four.** Slides 3 and 4 in the file are casino artwork
  with English, GBP-denominated copy.
- **No interaction states are invented beyond the minimum.** The design draws no hover, pressed,
  focus or disabled state anywhere — not on a game card, a category chip, an odds cell or a button
  — so the build adds a pressed state and a visible focus ring, and nothing else.
