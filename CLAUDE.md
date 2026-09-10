# tw-platform — working rules

Top-Win: a mobile demo of a casino plus sportsbook, built from Figma file
`s2CqwGqe0O0FcALhBNlTRe`, page `0:1 "New Platform"`. Next.js 15 + Tailwind v3, static export to
`out/`, Vitest for tests. Ukrainian copy, hryvnia, light theme.

**Mobile only, and that is not a preference.** Every one of the design's eleven frames is 390 wide.
There is no desktop frame, no tablet frame and no breakpoint anywhere in the file, so
`tailwind.config.ts` declares none either. A `mobile:` variant here would be a lie.

Jackpot is a **different project** and lives in its own repo. Nothing from it belongs here. This
checkout carried a copy of it until 2026-09-10 because commit `5e61622` ported it in; all 211 of
its files are gone.

---

## Default working mode, every session

These are not suggestions and they are not per-task decisions. They are how work starts here.

### 1. Orchestrate by default

**Any substantial task starts as a workflow with subagents on disjoint file sets.** Do not ask
first; announce how many agents and which areas, then run. Solo work is for conversational turns
and single-file edits.

This is not enthusiasm for agents. It is what the material demands: the Figma metadata dump for
this one page is 251,055 characters, which no single context reads usefully. On 2026-09-10 the
build ran 31 agents across five workflows — inventory, gap-fill, asset harvest, casino home,
sportsbook — and each pass produced measurements the previous one had recorded as unknown.

Rules learned here, each from something that went wrong:

- **Disjoint paths, always.** Every agent owns named files and is told which files are off limits.
  Two agents editing one file lose each other's work.
- **Give each agent its own inventory file**, not the whole directory. An agent that reads
  everything spends its context reading instead of building.
- **Structured returns.** Every agent returns a schema with `deviations` and `questions`, because
  the useful output of a build agent is not the code — it is what it had to decide.
- **Never take an agent's summary as measured.** On the first inventory pass an agent reported
  `#080814` as "the app header background". It had measured nodes `1:6594` and `1:6617`, which are
  dead leftover JACKPOT headers pasted on the canvas. Building from that would have produced a
  black header on a white site. Check which node a claim came from.
- **Brief every number with the node id or file line it came from.** Measured on 2026-09-10 across
  eleven workers: every brief that named a source survived contact, and five that did not were
  refuted by the worker running them. Three were the coordinator's own claims — that
  `SportNavRow` was rendered outside its plate (it was inside), that the sport filter pills all
  read `310` (already varied to `310 / 84 / 46`), and that `UrlStateBridge` had been cleared of
  the dead-menu bug (it was the cause). `docs/sweep-2026-09-10.md` records all five and how each
  was caught. **A worker that contradicts its brief with a measurement is the system working.**

#### Two things about the Orca CLI that cost this session real time

- **`check --types worker_done,escalation,question` does not filter.** Heartbeat batches come back
  regardless, so `--wait` returns immediately and the caller learns nothing — the same six
  heartbeats replay for as long as you let them. Every batch has to be acknowledged by its
  `deliveryId` and the check re-issued in a loop. A small drain loop that acks and repeats until a
  batch contains something that is not a heartbeat is the only reliable way to block on a result.
- **`worker-release` on a terminal you have opened in the Orca UI does nothing, and reports `ok`.**
  The response body carries `state: "retained"`, `reason: "user_takeover"`, `processAction:
  "none"`. Six of eleven terminals ended that way. They close from the UI, not from the CLI — do
  not report them as released on the strength of the exit code.

### 2. Skills that fire without being asked

| When | Skill |
| --- | --- |
| Any new page, component, colour, type scale, or layout | `ui-ux-pro-max:design`, then `ui-ux-pro-max:ui-styling` |
| Changing shared tokens or `tailwind.config.ts` | `design-system` |
| Spacing, borders, shadows, hit areas, hover/focus states | `make-interfaces-feel-better` |
| Anything animated | `motion-foundations` first, then `motion-ui` |
| Any interactive control | `accessibility` and `frontend-a11y` |
| Before designing anything non-trivial | `superpowers:brainstorming` |
| Work spanning more than one file or sitting | `superpowers:writing-plans` |
| Writing code | `ponytail:ponytail` — simplest thing that works, stdlib first |
| Component work | `react-patterns`, `react-performance`, `react-testing` |
| A bug whose cause is not already known | `superpowers:systematic-debugging` |
| Before shipping copy or visual design | `no-ai-slop`, `taste` |
| Any visual change, before calling it done | `browser-qa` |
| Buttons, menus, tabs, drawers | `click-path-audit` |
| Closing out a task | `verification-loop` |
| After finishing the changed code | `simplify` — reuse, simplification, efficiency |
| After any non-trivial task | `agent-self-evaluation` — five axes, with evidence |
| Architecture, "where does X live", "how does Y work" | `graphify` |
| Explaining a bug, a decision, or why something behaves as it does | `explica` |
| Handing work to the team that will take it over | `code-tour` — walkthroughs anchored to file and line |
| When the context window starts filling | `context-budget` |
| A plan, comparison, table, diff or report better read as a page | `lavish` |

`explica` decides **what must be present**; `caveman` decides **how tightly it is written**. On any
conflict `explica` wins. The concrete named example, the line between measured and reasoned, and
naming what is unknown are content and are never cut. Cut pleasantries, hedging, tool-call
narration and restating the question instead.

### 3. Never fill a gap with a plausible guess

Name what you do not know and ask. If an answer has already shipped, say which part was measured
and which was reasoning. Two examples from this project, both of which a plausible guess would
have got wrong:

- Five URLs for the game tile looked like five different artworks. They are byte-identical —
  Figma mints a fresh URL per instance, so "different URL" never meant "different picture".
  Verified by sha256.
- The design's eight league badges look like eight leagues. They are one Europa League mark
  repeated. Also sha256.

---

## Plugins

Five, all committed in `.claude/settings.json`:

```
claude plugin install superpowers@claude-plugins-official   --scope project
claude plugin install figma@claude-plugins-official         --scope project
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill     --scope project
claude plugin install ponytail@ponytail                     --scope project
claude plugin install caveman@caveman                       --scope project
```

`extraKnownMarketplaces` says where each catalogue lives; `enabledPlugins` says which to turn on.
`claude-plugins-official` is absent from the first block on purpose — Claude Code registers it for
every user by itself.

**A clone is not finished until you run the installs.** Since Claude Code v2.1.195 `enabledPlugins`
alone fetches nothing; a plugin from a GitHub marketplace stays dormant until somebody runs the
install in that checkout. Install records are keyed on the absolute project path, so a second
worktree needs its own run even though it shares `.git`. Verify with `claude plugin list`, not by
reading this file.

**`claude plugin enable <name>` defaults to user scope.** Measured on 2026-09-10: enabling `figma`
that way reported `scope: user`, which does not travel with the repo. Put it in
`.claude/settings.json` as well, or the next person to clone does not get it.

The `figma` plugin matters specifically: the Figma MCP server's own tool description says to load
its `figma-design-to-code` guidance before calling `get_design_context`. Without the plugin that
guidance has to be hand-written into every agent prompt.

## Skills live in this repo — and a twin can silently win

Project skills are in `.claude/skills/` and committed, so every clone has them.

**A same-named skill in `~/.claude/skills/` wins over the committed one.** Measured: a marker was
added to the user copy of `nextjs-turbopack` only, the skill was invoked, and Claude Code reported
the user path as its base directory. All 21 skills in this repo currently have a same-named twin
under `~/.claude/skills/` — checked again on 2026-09-10, 21 of 21. So editing
`.claude/skills/explica/SKILL.md` and committing it does nothing on a machine that carries the
twin, and the same commit then behaves one way there and another way on a clean clone. If a change
to a committed skill appears to have no effect, check `~/.claude/skills/<name>/` before debugging
anything else.

---

## Where commands run

Run them in this worktree, `C:\Users\grosu.b\orca\workspaces\tw-platform\main`. It has
`node_modules` as of 2026-09-10.

**The `tsc@2.0.4` trap.** In a checkout without `node_modules`, `npx tsc --noEmit` does not fail —
it downloads an unrelated `tsc@2.0.4` from npm, prints "This is not the tsc command you are looking
for", and **exits 0**. A typecheck that never ran is indistinguishable from one that passed. Before
trusting a check in a fresh checkout, run `npx tsc --version` and confirm it says 5.x.

**The port trap, measured on 2026-09-10.** A dev server for a different project already held port
3000, so `npm run dev` here bound 3001 and said so in a line nobody read. All three capture scripts
default to 3000. The first screenshot of the "Top-Win casino home" was a screenshot of the Jackpot
demo — dark, English, GBP — captured with zero errors and saved under a Top-Win filename. Nothing
in a filename, an exit code or a log distinguishes those two runs.

`scripts/assert-app.mjs` now checks the page's title after every navigation and stops with the port
to look at. **Do not remove it, and do not pass `--no-assert` equivalents.** If a capture script
refuses, read what it says rather than pointing it somewhere else.

Before any push, check whether the remote has moved: `git fetch`, then
`git log --oneline HEAD..origin/main`. If that prints anything, merge it in first. Never
force-push.

## Build and the dev server

Never run `next build` while `next dev` is up. Both own `.next`, and running them together
corrupts it: every route then returns 500 with `ENOENT ... _buildManifest.js.tmp.<random>` while
the source is fine. It reads as a code bug and is not one.

Use `npm run build:check`. It points the build at its own directory through `NEXT_DIST_DIR`, so it
cannot touch a running server's. Plain `npm run build` is for CI.

**`NEXT_DIST_DIR` does not protect `.next` once `GITHUB_PAGES=true` is set** — an export writes
into `.next` anyway and leaves `basePath` in its manifest, which makes the dev server answer 500 on
every route. To produce an export locally, stop `next dev` first, and delete `.next` afterwards.

**A free port is not enough for a parallel run.** Measured on 2026-09-10: a worker started
`next dev` on its own port while another already had one up, they shared `.next`, and the second
corrupted it into React-Client-Manifest 500s. It is the directory that collides, never the port.
Every concurrent agent needs its own `NEXT_DIST_DIR`, not just its own `--port`.

**Every build edits `tsconfig.json`, which is tracked.** Next appends its dist directory to
`include` on each run, so a five-worker pass left the file carrying `.next-b1`, `.next-b2`,
`.next-b4` and `.review-tmp/next-dev-b3`. Nobody typed that and no review would have questioned it.
Check `git diff tsconfig.json` before staging and `git checkout --` it if the only change is
Next's. `.gitignore` learned `/.next-*/` and `/.review-tmp/` the same day — until then
`.next-build`, the directory this section tells everyone to use, was **not ignored**, so a
`git add -A` would have committed 30 MB of build output.

**Serve an export with a threaded server.** `python -m http.server` is single-threaded;
`review.mjs` drives it with enough parallel requests that it returns `ERR_EMPTY_RESPONSE` and the
run reads as an app failure. `ThreadingHTTPServer` with the same handler is a one-liner and holds.

## Before pushing to main

A push to `main` deploys. `.github/workflows/pages.yml` publishes to
`https://design-mkt-1.github.io/tw-platform/` — the link the client opens. Run its gate locally
first, in this order:

```
npx tsc --noEmit
npx eslint src --max-warnings=0
npm test
npm run build                 # CI sets GITHUB_PAGES=true
node scripts/a11y.mjs <outDir> [baseUrl]
```

**Pages must be sourced from GitHub Actions, not from a branch.** Measured on 2026-09-10: the
source was set to "Deploy from a branch → main /", so every push started two deployments — the
workflow and GitHub's own branch build — and whichever finished last won. The branch build serves
the repo root, which has no `index.html`. Fixed with
`gh api -X PUT repos/design-mkt-1/tw-platform/pages -f build_type=workflow`. If the site ever shows
something that is not the build, check this first.

**The accessibility step reports, it does not block.** Owner's decision of 2026-09-10: the design
ships with its colours unchanged, and 23 of its text pairs fall below WCAG AA. `a11y.json` is still
produced and uploaded on every push. The server-reachability guard in the same step stays blocking,
because `a11y.mjs` scores a page it could not reach as zero violations — swallowing that too would
make the report worthless.

## Design review loop

`browser-qa` and `click-path-audit` are not satisfied by reading the diff. They are satisfied by
running these:

| Script | Usage | What it covers |
| --- | --- | --- |
| `scripts/review.mjs` | `node scripts/review.mjs <outDir> [baseUrl]` | every state the design draws, each shot in both motion modes |
| `scripts/a11y.mjs` | `node scripts/a11y.mjs <outDir> [baseUrl]` | axe-core over the same states |
| `scripts/shot.mjs` | `node scripts/shot.mjs <url> <out> [w] [h] [full\|viewport] [scrollY\|#sel]` | a single screenshot, 390x844 by default |

All three drive the installed Chrome (`channel: 'chrome'`), not Playwright's bundled Chromium,
which fails to download here.

Do not report a UI change as working on the strength of the diff. Two defects on 2026-09-10 were
invisible in the code and obvious in the browser: a hydration mismatch on the header balance, and
the hero title wrapping onto the artwork. A third — the menu and search panels existing but
rendered nowhere, so the button did nothing — was found by grepping for who mounts them.

### States are reached by URL

`src/components/UrlStateBridge.tsx` mirrors store state into the query string:

| Param | Values |
| --- | --- |
| `auth` | `prelogin` \| `postlogin` \| `vip` |
| `panel` | `menu` \| `search` |
| `q` | the search query, which selects one of the four search states |

A state nobody can link to is a state nobody can review. Change these names and both capture
scripts need changing with them — `src/lib/__tests__/screens.test.ts` fails if either script starts
carrying a hard-coded `?auth=` / `?panel=` / `q=` again.

**`src/data/screens.json` is the single list of reviewable states**, one row per 390-wide Figma
frame: node id, layer name as Figma holds it, the URL that reaches it, and a `note` for anything a
reviewer needs first. `review.mjs`, `a11y.mjs` and `/dev/screens` all read that one file. Until
2026-09-10 the list lived in both scripts and the two copies could disagree without anything
failing.

A row with `path: null` is a frame the build cannot address. There is one: `1:7363`, the
`Нещодавні запити` search state, which needs `recent.length > 0` — and `recent` lives only in the
store, so no URL produces it. It has never been captured or scanned.

**A URL that renders the wrong frame is worse than a missing one, because it looks captured.**
`?panel=search&q=bon` was recorded as the suggestions state for weeks; `bon` matches none of the
five providers, so it rendered no-results — the same frame as the row below it. Each row now
carries `expectText` and `review.mjs` asserts it.

`/dev/screens` renders the registry as a page. It is published in the export because a static
export has no dev-only mode, nothing in the app links to it, and `robots` is `noindex` everywhere.

## Working with the Figma file

- **The MCP call quota is real and it runs out.** On 2026-09-10 a twelve-agent pass exhausted it
  mid-run with `You've reached the Figma MCP tool call limit for your Full seat on the Professional
  plan`. Ration calls: `get_metadata` for structure, `get_screenshot` plus pixel decoding for flat
  colours, and spend `get_design_context` only where a pixel cannot answer — gradients, shadows,
  font metrics, asset URLs.
- **Asset URLs expire about seven days after the call that minted them.** Harvest before building.
- **`download_assets` caps a subtree at 20 SVG fragments.** Icons with mask stacks consume the cap
  and the returned URLs carry no node id, so the fragments cannot be attributed. Three section
  icons could not be exported for that reason.
- **Nodes `1:6594` and `1:6617` are dead.** Leftover JACKPOT headers on the canvas, not children of
  any screen. Do not implement them and do not take token values from them.
- **Three of the design's six font families cannot render its own copy.** Outfit and Archivo Narrow
  ship no Cyrillic subset and Big Shoulders Display is not in Next's catalogue at all, yet every
  string assigned to them is Cyrillic — so Figma was already falling back. The build ships Inter
  and Roboto. Expect fallout wherever a Figma width was fitted to Outfit's narrower metrics: the
  hero title's 131px box was the first.
- `docs/tokens.md` is the only bridge between the design and the code. The file carries six
  variables against roughly forty raw values, so the palette is hard-coded from measurement. An
  eslint rule rejects raw hex under `src/components/`.
- **`docs/design-inventory/` holds the measurements underneath it** — 25 files, one per area,
  plus the asset manifests. Read them before spending a Figma call on something that was already
  measured. Its own README lists what is in each file and the two places where a file is known to
  be wrong. They are committed rather than left in a scratch directory precisely because the
  quota makes re-measuring expensive.
- **`docs/sweep-2026-09-10.md` holds the browser sweep underneath the build** — eleven worker
  reports verbatim, what each one could not measure and why, and the five coordinator claims the
  workers refuted. Committed for the same reason as the inventory: a browser session is expensive
  and reading is free. `docs/next-session.md` is the distilled version to read first.

## Decisions the owner has taken

Recorded so nobody re-opens them without a reason.

| Decision | Date |
| --- | --- |
| The design's colours ship unchanged; contrast failures are reported, never silently corrected | 2026-09-10 |
| Obvious mistakes are fixed — `Реєстарція` ships as `Реєстрація` — and repeated placeholder content is varied | 2026-09-10 |
| The footer ships exactly as drawn: no licence number, no 18+ mark, no responsible-gambling line, support address unchanged | 2026-09-10 |
| Game cards without artwork keep the generated gradient. Only four distinct tiles exist in the whole Figma file | 2026-09-10 |
| Ukrainian only. No language switcher, even though the nav component carries ua/ru/en variants | 2026-09-10 |
| Every finished piece is pushed to `main` as it lands, rather than held for a complete build | 2026-09-10 |
| **This is a demo of how the Figma design looks on a live site, not a working product.** Effort goes on the front end and on appearance. Not everything has to function. Build what the Figma file draws; anything it does not draw is built only when the owner asks, or after asking and being answered | 2026-09-12 |

## Bug fixes

Understand why the bug exists and where it came from, then grep for every other place the same
pattern appears. **Fix the class, not the instance.** This codebase has a history of the opposite:
`prefetch` on dead routes was fixed three separate times in the predecessor project, each time only
where it had been noticed.

Two fixes from 2026-09-10 that were deliberately made once rather than per site: the currency
formatter is the only place in `src` that touches `Intl`, and `prefetch={false}` is hard-coded
inside the shared link primitive before the prop spread, so a caller can still override it.

### Three classes this project keeps producing, each with the guard that now catches it

**A control that is drawn, labelled and wired to nothing.** `BetSlipFab` was a finished component
no file rendered, so an odds cell set `aria-pressed="true"` and nothing drew the coupon. The menu
and search panels shipped the same way in an earlier session. `src/lib/__tests__/mounted.test.ts`
fails on any exported component no other file under `src` names.
Its sibling cannot be caught that way and is worth knowing: `activeCategory` was a **store field**
written by `CategoryBar` and read by nobody, so four chips changed paint and filtered nothing. A
component-level walk does not see that. Grep the store for a field whose only reader is its writer.

**Decorative artwork that takes pointer events.** The raised Menu button's glow is a `123.891 x
131.535` span inside a `63.653 x 93` button; it surrendered 748 of 837 sample points to a decoration
and made the last odds cell on `/sport` open the menu instead. Three sibling cases —
`HeroCarousel.tsx:53` and both slides in `BonusCarousel.tsx` — already carried `pointer-events-none`;
only the nav had been missed. Two guards in `review.mjs` watch it, and it takes both. Guard 3
hit-tests every control's own centre at every half-viewport of scroll and reports only a control
that is pressable at **no** position — measured 2026-09-12, the earlier "covered anywhere" rule
produced 24 false reports of odds cells passing under the glass bar, and a guard nobody believes is
worse than none. That rule alone would have missed the `/` half of this very defect, where every
stolen control is free further up the page, so Guard 6 checks the cause statically instead: nothing
inside a control may take pointer events more than 12px outside it. As built the only bleeds are
1.5px and 7px, both deliberate and both in `BottomNavBar.tsx`; the glow bleeds 37.7px.

**A layout box measured against a font that cannot render its text.** The hero promo badge is 178
wide and the Cyrillic inside it needs 169.98 in a 168px content box, so it wrapped and dropped its
trailing `✦` onto the headline. Outfit ships no Cyrillic and the build aliases it to Inter, which is
wider. Not every such box is wrong: the footer's `Політика конфіденційності` overflows `w-[141px]`
and the design draws it on two lines (`05-casino-footer.md:242`). The guard reports both; the
allowlist carries the node id that makes one of them correct.

This paragraph is the house rule and it wins over `superpowers:systematic-debugging` on any
conflict, the same way `explica` wins over `caveman`.

Two superpowers skills overlap with skills this repo already has, and the repo's own win:
`superpowers:verification-before-completion` does not replace `verification-loop`, and
`superpowers:using-git-worktrees` does not override the checkout rules above.

## Static export constraints

There is no server. Do not propose API routes, server actions, middleware, ISR, or `next/image`
optimisation — none of them can run.

`basePath` `/tw-platform` applies only when `GITHUB_PAGES=true`. Do not set it locally: it moves
the dev server to `localhost:3000/tw-platform` and breaks the capture scripts, which address the
root.

Asset URLs go through `src/lib/assets.ts`, which reads `NEXT_PUBLIC_BASE_PATH`. Next applies
`basePath` to links and to its own bundles, but **not** to an image `src` — that is why the helper
exists. Use it rather than writing `/images/...` directly. `src/lib/__tests__/assets.test.ts` walks
every path both ways and fails on a missing file or an unreferenced one.

## Figma assets

Exported SVGs go through `node scripts/clean-svg.mjs [root] [--dry]` before being committed; PNGs
go through `node scripts/to-webp.mjs [root] [--dry]`. The static export sets
`images: { unoptimized: true }` — there is no server to resize anything, so whatever is committed
is what ships. The Top-Win harvest started at 22.2 MB and finished at 2.30 MB: six files had been
downloaded twice under different names, and the game tile arrived as a 2.7 MB animated GIF behind a
`.png` URL for a card drawn at 114x148.

`clean-svg.mjs`'s `FURNITURE_SCALE` was calibrated on a different export. Run `--dry` and re-measure
before trusting it on new assets.

## Language

Conversation with the owner is in Romanian. Everything that lands in a file — code, comments,
commit messages, docs, this file — is English. UI copy is Ukrainian, copied character for character
from the design, never translated and never invented.

## caveman and explica run together

`.caveman/config.json` sets `defaultMode: lite` and is committed. **It did not win.** The per-user
state file `~/.claude/.caveman-active` holds the level that is actually in force, and the owner has
accepted `full`. Do not "fix" it back to lite on the strength of the committed value; check
`~/.claude/.caveman-active` instead.

Per-session override: `/caveman:caveman full`, `/caveman:caveman ultra`, `/caveman:caveman off`.
Plugin skills are always namespaced — a bare `/caveman` does not resolve, and neither does a bare
`ponytail`.
