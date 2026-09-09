# tw-platform — working rules

Next.js 15 + Tailwind jackpot/casino platform, built against Figma. Static export (`out/`), Vitest for tests.

## Skills are in this repo — use them, don't improvise

Project skills live in `.claude/skills/` and are committed, so every clone has them.

Plugins need two things in `.claude/settings.json`, and both are committed: `extraKnownMarketplaces`
says where each catalogue lives, `enabledPlugins` says which plugin to turn on. `claude-plugins-official`
is absent from the first block on purpose — Claude Code registers it for every user by itself.

**A clone is not finished until you run the installs.** Since Claude Code v2.1.195, `enabledPlugins`
alone does not fetch anything; a plugin from a GitHub marketplace stays dormant until somebody runs
`claude plugin install <name>@<marketplace> --scope project` in that checkout. Install records are
keyed on the absolute project path, so a second worktree needs its own run even though it shares
`.git`. This repo shipped for weeks with `ui-ux-pro-max`, `ponytail` and `caveman` enabled and none of
them loaded, which made every rule in this section unenforceable. Verify with `claude plugin list`,
not by reading this file.

```
claude plugin install superpowers@claude-plugins-official --scope project
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill  --scope project
claude plugin install ponytail@ponytail                  --scope project
claude plugin install caveman@caveman                    --scope project
```

The rules below are not suggestions. Invoke the named skill before doing the work, not after.

### Always, before touching UI

| Trigger | Skill |
| --- | --- |
| Any new page, component, colour, type scale, or layout | `ui-ux-pro-max:design`, then `ui-ux-pro-max:ui-styling` |
| Changing shared tokens or `tailwind.config.ts` | `design-system` |
| Spacing, borders, shadows, hit areas, hover/focus states | `make-interfaces-feel-better` |
| Anything animated | `motion-foundations` first, then `motion-ui` |
| Any interactive control | `accessibility` and `frontend-a11y` |

### Always, before saying a UI change is done

| Trigger | Skill |
| --- | --- |
| Visual change of any kind | `browser-qa` — confirm it in a real browser, don't reason about it |
| Buttons, menus, tabs, drawers | `click-path-audit` — trace the whole state sequence, not just the click handler |
| Closing out a task | `verification-loop` |

Do not report a UI change as working on the strength of the diff alone. This repo has a
history of that failing: the mobile jackpot menu and the tab bar were each "fixed" and had
to be fixed again once someone actually pressed the buttons.

### Always, when answering questions about the codebase

- Architecture, file relationships, "where does X live", "how does Y work" → `graphify` first.
- Explaining a bug, a decision, or why something behaves as it does → `explica`.
  Plain words, at least one concrete named example from this project, and an explicit line
  between what was measured and what is reasoning.
- Never fill a gap with a plausible guess. Name what you don't know and ask.

### Always, when writing code

- `superpowers:brainstorming` before designing anything non-trivial — settle the shape before
  writing the first line.
- `superpowers:writing-plans` when the work spans more than one file or one sitting.
- `ponytail:ponytail` — simplest thing that works. YAGNI, stdlib first, no unrequested
  abstractions. Plugin skills are always namespaced; a bare `ponytail` does not resolve.
- `react-patterns` / `react-performance` for component work, `react-testing` for tests, with
  `superpowers:test-driven-development` for the RED-GREEN-REFACTOR order.
- `no-ai-slop` and `taste` before shipping copy or visual design.

### Always, when reporting work back

| Trigger | Skill |
| --- | --- |
| A plan, comparison, table, diff, report, or review that reads better as a page than as prose | `lavish` — invokes `npx -y lavish-axi`, nothing to install globally |

### Bug fixes

`superpowers:systematic-debugging` whenever the cause is not already known — do not start
patching before it is.

Understand why the bug exists and where it came from, then grep for every other place the
same pattern appears. The same bug has been fixed repeatedly in different files here — fix
the class, not the instance. This paragraph is the house rule and it wins over
`systematic-debugging` on any conflict, the same way `explica` wins over `caveman` below.

Two superpowers skills overlap with skills this repo already has, and the repo's own win:
`superpowers:verification-before-completion` does not replace `verification-loop`, and
`superpowers:using-git-worktrees` does not override the checkout rules in the next section.

## Where commands run

Run everything in `D:\tw-platform`. It is the only checkout with `node_modules`.

The predecessor repo was checked out twice, and it cost a whole afternoon. Only one copy had
`node_modules`, and in the other `npx tsc --noEmit` did not fail — it downloaded an unrelated
`tsc@2.0.4` from npm, printed "This is not the tsc command you are looking for", and **exited
0**. A typecheck that never ran was indistinguishable from one that passed.

There is now a second working tree, `C:\Users\grosu.b\orca\workspaces\tw-platform\main`, created by
the orca tooling and sharing this repo's `.git`. It has no `node_modules`, so the `tsc@2.0.4` trap is
live there: `npx tsc --noEmit`, `npm test` and `npm run build:check` will appear to pass without
running. Do not run checks from it. `git worktree list` shows every tree if you are unsure which one
you are in.

Before any push, check whether the remote has moved: `git fetch` then
`git log --oneline HEAD..origin/main`. If that prints anything, merge it in first. Never
force-push. In the old repo `main` was once two commits ahead without anyone noticing, and a
force push would have deleted both of them.

## Build and the dev server

Never run `next build` while `next dev` is up. Both own `.next`. Running them together
corrupts it: the dev server then returns 500 for every route with
`ENOENT ... _buildManifest.js.tmp.<random>` while the source is perfectly fine. It reads as a
code bug and is not one. This already happened here, which is why the guard exists.

Use `npm run build:check`. It points the build at its own directory through `NEXT_DIST_DIR`,
so it cannot touch a running server's. Plain `npm run build` is for CI.

## Before pushing to main

A push to `main` deploys. `.github/workflows/pages.yml` publishes to
`https://design-mkt-1.github.io/tw-platform/` — the link the client opens. Run its gate
locally first, in this order:

```
npx tsc --noEmit
npx eslint src --max-warnings=0
npm test
npm run build                 # CI sets GITHUB_PAGES=true
node scripts/a11y.mjs <outDir> [baseUrl]
```

`a11y.mjs` exits 1 on any critical or serious violation, which fails the job before the deploy
step. A red check on main means the client is looking at a broken page. Pair this with
`verification-loop`.

## Design review loop

`browser-qa` and `click-path-audit` are not satisfied by reading the diff. They are satisfied
by running these:

| Script | Usage | What it covers |
| --- | --- | --- |
| `scripts/review.mjs` | `node scripts/review.mjs <outDir> [baseUrl]` | The interactive states no static shot reaches: three search states, two header panels, three jackpot menus |
| `scripts/a11y.mjs` | `node scripts/a11y.mjs <outDir> [baseUrl]` | axe-core over the design's states, mobile first |
| `scripts/shot.mjs` | `node scripts/shot.mjs <url> <outPath> [w] [h] [full]` | A single screenshot |

`baseUrl` defaults to `http://localhost:3000`. All three drive the installed Chrome
(`channel: 'chrome'`), not Playwright's bundled Chromium, which fails to download here.

Run `review.mjs` before calling any interactive change done, and `a11y.mjs` whenever the
`accessibility` / `frontend-a11y` triggers fire.

## Figma assets

Exported SVGs go through `node scripts/clean-svg.mjs [root] [--dry]` before being committed.
Figma wraps a glyph in the geometry of the canvas it sat on — a `#1E1E1E` rect the size of the
page, plus outline paths for the whole 10259x7788 canvas. The root viewBox clips it, so the
icon renders correctly and the cost stays invisible: `bonus-buy.svg` carried 17.8 KB for a
20 px glyph.

Exported PNGs go through `node scripts/to-webp.mjs [root] [--dry]`. The static export sets
`images: { unoptimized: true }` — there is no server to resize anything, so whatever is
committed is what ships. The desktop hero alone was 575 KB.

Both default to `public/images`. **Never point either at `public/review`.** Those are the
design-vs-implementation screenshots — they are the report itself and must stay byte-for-byte
what the comparison was made from.

## Static export constraints

There is no server. Do not propose API routes, server actions, middleware, ISR, or
`next/image` optimisation — none of them can run.

`basePath` `/tw-platform` applies only when `GITHUB_PAGES=true`. Do not set it locally: it
moves the dev server to `localhost:3000/tw-platform` and breaks the screenshot scripts, which
address the root.

Asset URLs go through `src/lib/assets.ts`, which reads `NEXT_PUBLIC_BASE_PATH`. Next applies
`basePath` to links and to its own bundles, but not to an image `src` — that is why the helper
exists. Use it rather than writing `/images/...` directly.

## Mobile first

95%+ of the traffic is mobile. `scripts/a11y.mjs` lists mobile states first for that reason.
Start design and QA at mobile widths; a desktop-only check is not a check.

## Language

Conversation with the owner is in Romanian. Everything that lands in a file — code,
comments, commit messages, docs, this file — is English.

## caveman and explica run together

Both are on. They govern different things, and the order between them is fixed.

`.caveman/config.json` sets `defaultMode: lite` and is committed. **It did not win.** On the
first session after the plugin was installed, caveman came up in `full`, and
`~/.claude/.caveman-active` — a single-word file outside the repo, user-global — contained
`full`. Its log had exactly one entry, `{"mode":"full","prev":null}`. So the per-user state
file beats the committed project config, or the project config is not read at all; the
precedence has not been traced through caveman's source. Do not trust the committed value.
Check `~/.claude/.caveman-active` for the level that is actually in force.

At lite caveman drops filler and hedging but keeps articles and full sentences. It does not
shorten explanations; it removes the padding around them.

`explica` decides *what must be present*. `caveman` decides *how tightly it is written*.
On any conflict, `explica` wins:

- The concrete named example from this project is content, not filler. It is never cut.
- The line between what was measured and what is reasoning is content. Never cut.
- Naming what is unknown, instead of guessing, is content. Never cut.
- Cut instead: pleasantries, hedging, tool-call narration, restating the question,
  decorative tables, summaries of what was just said.

caveman's own rules already agree with this — its Auto-Clarity section drops compression
for security warnings, irreversible actions, multi-step sequences where order could be
misread, and any point where compressing creates ambiguity. Its Boundaries section keeps
normal prose in everything that outlives the chat: code, comments, commits, docs, PR text
and memory files. So this file, the commit messages and `docs/` stay in full English no
matter what mode the session is in.

Per-session override: `/caveman:caveman full`, `/caveman:caveman ultra`, `/caveman:caveman off`.
The skill is namespaced like every plugin skill — a bare `/caveman` does not resolve. Whether the
level resets between sessions depends on `~/.claude/.caveman-active`, not on this repo.
