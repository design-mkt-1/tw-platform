# Design inventory — Top-Win, measured 2026-09-10

Every measurement behind this build, as it was taken.

Read [`../tokens.md`](../tokens.md) first. It is the distilled version — 84 colours and 59 type
steps, each with the Figma node it came from — and it is the file the code and the ESLint rule
point at. These files are the working notes underneath it: they answer questions `tokens.md` does
not, such as how tall a section is, what a match row is made of, or which asset came from which
node.

**This is a dated record, not a live reference.** Nothing here is updated when the code changes.
If a file disagrees with `tokens.md`, `tokens.md` wins; if it disagrees with the code, the code
wins and the file is history.

## Why they are in the repo at all

They were produced by 18 subagents against Figma file `s2CqwGqe0O0FcALhBNlTRe`, and reproducing
them is not free: the Figma MCP call quota ran out halfway through the first pass with
`You've reached the Figma MCP tool call limit for your Full seat on the Professional plan`. The
`20-` through `25-` files exist because of that — a second pass recovered 98 values the first pass
had recorded as unknown, largely by decoding 1:1 PNG renders pixel by pixel rather than spending
more calls.

They were also living in a session temp directory, which does not survive.

## What is in them

| File | What it measures |
| --- | --- |
| `00-tokens.md` | The first token sweep. **Partly wrong** — see the warning below. |
| `01-casino-top.md` | Casino header, hero carousel, category bar, recent-wins ticker |
| `02` – `04-casino-rows-*.md` | The fifteen content sections of frame `1:3289`, in vertical order |
| `05-casino-footer.md` | The footer, `1:5417` — the largest single block on the page |
| `06-casino-postlogin-delta.md` | What changes between `1:3289` and `1:581` |
| `07-sport.md` | The sportsbook, `1:5994`. The longest file, and the only source for the match row |
| `08-menus.md` | The three menu panels |
| `09-search-states.md` | The four search frames and the state machine they describe |
| `10-navbar-headers.md` | The bottom navigation and the headers |
| `11-repo-inventory.md` | **The repo as it was before the rewrite**, when it still held the Jackpot demo. Historical: it lists files that no longer exist. Kept because it records what was hard-coded inside each capture script, which is why those scripts survived the rewrite |
| `20` – `25-gap-*.md` | The second pass: the colours, type and effects the quota cut short |
| `manifest-*.md` | One row per downloaded asset — file path, node id, Figma layer name, format, size, and whether it came from a recorded URL or a fresh call |

## Two corrections to carry, because a file here is wrong

**`00-tokens.md` records `#080814` as "the app header background". It is not.** That value was
measured on nodes `1:6594` and `1:6617`, which are leftover JACKPOT headers pasted onto the
Top-Win canvas — dark, English, gold, standalone frames at canvas (2184, 633) that no screen
instantiates. The real headers are `1:3290`, `1:582` and `1:5995`, and all three are `#E8F1FC`.
Building from the first reading would have produced a black header on a white site.

**`24-gap-menu-type.md` §5 says only two menu row icons carry `opacity: 0.5`.** Seven of the
eight declare it and the eighth bakes it in by hand, which is why a pixel sample of that row read
`#7FB4F2` while the exported file declares `#1677E8` — `#1677E8` at 50% over the row fill
`#E8F1FC` is `#7FB4F2` exactly, on all three channels. The pixel pass had sampled a blend and
recorded it as the paint.

Both corrections are in `../tokens.md`. They are left standing in the files above rather than
edited out, because the point of a dated record is that it says what was known at the time.
