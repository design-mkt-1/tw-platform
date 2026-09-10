# Manifest — area `casino-icons`

Figma file `s2CqwGqe0O0FcALhBNlTRe`, mobile frame `1:3289`.
Target directory: `C:/Users/grosu.b/orca/workspaces/tw-platform/main/public/images/icons/`

Figma MCP calls spent: **6 of 6** (budget exhausted, no quota refusal seen).

| # | Call | Node | Why |
| --- | --- | --- | --- |
| 1 | `download_assets` | `1:4340` | probe the shared 15-icon group |
| 2 | `download_assets` | `1:4545` | same group, confirm it repeats |
| 3 | `download_assets` | `1:4714` | same group, confirm it repeats |
| 4 | `get_metadata` | `1:4546` | get the icon-frame node ids + names |
| 5 | `download_assets` | `1:3345` `defaultFormat: svg` | flatten the Must-play-slots chip |
| 6 | `download_assets` | `1:4695` `defaultFormat: svg` | flatten the current-tournaments icon |

Everything else came from URLs already recorded in `02-casino-rows-a.md`,
`03-casino-rows-b.md`, `04-casino-rows-c.md` and `21-gap-catnav-ticker.md`.
Those recorded URLs were still live — **13 of 14 files cost zero Figma quota.**

---

## Downloaded — 14 files, all verified (`<svg` first bytes, non-zero, no HTML error body)

| File | Node id | Figma layer name | Format | Bytes | Source |
| --- | --- | --- | --- | --- | --- |
| `icons/section-popular.svg` | `1:3426` | `Popular` | svg | 1501 | recorded URL (02) |
| `icons/section-new-games.svg` | `1:3738` | `new 2` | svg | 2856 | recorded URL (02) |
| `icons/section-recommended.svg` | `1:4115` | `Group` in `Recomended` | svg | 2521 | recorded URL (02) |
| `icons/section-crash-games.svg` | `1:4292` | `crash-games` `Group 1/13` | svg | 819 | recorded URL (03) |
| `icons/section-current-tournaments.svg` | `1:4695` | `current tournaments` | svg | 2554 | **fresh call 6** |
| `icons/section-jackpots.svg` | `1:5039` | `jackpots` `Group` | svg | 4205 | recorded URL (04) |
| `icons/section-lottery.svg` | `1:5223` | `Lottery` `layer2` | svg | 9522 | recorded URL (04) |
| `icons/section-drops-and-wins.svg` | `1:5390` | `Drops&wins` | svg | 3856 | recorded URL (04) |
| `icons/chip-popular.svg` | `1:3340` | `Popular` (chip, active) | svg | 1503 | recorded URL (21) |
| `icons/chip-must-play-slots.svg` | `1:3345` | `Must-play slots` (chip) | svg | 4085 | **fresh call 5** |
| `icons/chip-live-casino.svg` | `1:3381` + `1:3387` | `live-streaming_13013279 1` | svg | 3472 | recorded URL (21) |
| `icons/chevron-right.svg` | `1:3570` | `chevron-right` | svg | 309 | recorded URL (02) |
| `icons/section-divider.svg` | `1:3567` | `Vector 100` | svg | 264 | recorded URL (02) |
| `icons/search-header.svg` | `1:3781` | `search_header.svg` | svg | 1638 | recorded URL (02) |

### Name mapping (machine name → what it depicts)

| Figma layer | File | Depicts |
| --- | --- | --- |
| `Popular` | `section-popular.svg` / `chip-popular.svg` | flame |
| `new 2` / `new 1` | `section-new-games.svg` | "new" burst |
| `Group` in `Recomended` | `section-recommended.svg` | recommended mark |
| `crash-games` `Group 1/13` | `section-crash-games.svg` | crash-games mark |
| `current tournaments` | `section-current-tournaments.svg` | trophy (`_x32_0_Trophy`) |
| `Lottery` `layer2` | `section-lottery.svg` | lottery mark |
| `Drops&wins` | `section-drops-and-wins.svg` | drops-and-wins mark |
| `live-streaming_13013279 1` | `chip-live-casino.svg` | live-casino mark |
| `search_header.svg` | `search-header.svg` | 40x40 round search button glyph |
| `Vector 100` | `section-divider.svg` | dashed rule, `#DCEBFF`, `stroke-dasharray 2 2` |

---

## Colour / size audit (measured from the downloaded files)

Every **section** icon is `fill="#92BDF3"`, single flat colour, no exception.
Every **chip** icon is `fill="#71809A"` (inactive) except `chip-popular.svg`, which is
`#102A67` (active). That matches the active/inactive ink recorded in `21-gap-catnav-ticker.md`
and is a consistency check the harvest passed.

`chevron-right.svg` is a stroked path, `stroke #1E40AF`, `stroke-width 2`,
`stroke-linecap round` — byte-identical to the scratchpad `chevron.svg`.
`section-divider.svg` is byte-identical to the scratchpad `divider.svg`.
`section-popular.svg` is byte-identical to the scratchpad `popular.svg`
(so the scratchpad copy was the **section** flame, not the chip flame — the chip is
a different export at 11.2258x16 and a different colour).

| File | Intrinsic w x h |
| --- | --- |
| `section-popular.svg` | 14.0322 x 20 |
| `section-new-games.svg` | 21 x 20 |
| `section-recommended.svg` | 18.75 x 18.75 |
| `section-crash-games.svg` | 14.4289 x 14.455 |
| `section-current-tournaments.svg` | 20 x 20 |
| `section-jackpots.svg` | 20 x 17.8906 |
| `section-lottery.svg` | 17.5 x 16.6665 |
| `section-drops-and-wins.svg` | 20 x 20 |
| `chip-popular.svg` | 11.2258 x 16 |
| `chip-must-play-slots.svg` | 16 x 16 |
| `chip-live-casino.svg` | 12.8069 x 9.03685 |
| `chevron-right.svg` | 14 x 14 |
| `search-header.svg` | 40 x 40 |
| `section-divider.svg` | 136.968 x 1 |

The section icon frame in Figma is always 20x20; the SVGs are the inner artwork, so most
are smaller than 20 on one axis. Centre them in a 20x20 box, do not stretch.

---

## Two things worth the owner's attention

**1. The providers section header uses the *new-games* icon.**
`1:3776` (visible icon in `1:3762` `Провідні провайдери`) is named `new 1` and its export is
byte-identical to `1:3738` `new 2` from `1:3588` `Нові Ігри` — I diffed the two files with the
`id=` attribute normalised and they matched exactly. I therefore deleted the duplicate
`section-providers.svg` and `section-new-games.svg` serves both. **Measured:** same artwork.
**Not measured:** whether that is intended or a designer picked the wrong hidden frame.

**2. The two files that came from a fresh export carried the Figma canvas frame.**
`1:3345` and `1:4695` exported with the `#1E1E1E` page rect plus a `390 x 5628.7` page-background
rect — exactly the trap `CLAUDE.md` documents. Both were run through
`node scripts/clean-svg.mjs public/images/icons` before this manifest was written
(4291 -> 4085 and 2763 -> 2554 bytes). The 12 files that came from recorded URLs were already
clean and the script left them alone.

---

## MISSING — could not be downloaded, needs a hand export

Node ids below are read from `get_metadata` on `1:4546` (section `1:4545`'s header group
`1:4548`). **The same 15-frame icon group is duplicated into every section header with
different ids**, so a human exporting these can use any section's copy; the ids given are
the `1:4545` copy.

Why they failed: `download_assets` caps `svgAssets` at 20 per subtree. The group contains
15 icon frames, several of which (`crash games` ~28 sub-nodes, `Must-play slots` ~33,
`Bonus buy` ~36) are mask/clip stacks that emit one SVG *fragment* per sub-layer. The cap is
consumed by fragments before the whole set is reached, and the returned URLs carry no node id,
so a fragment cannot be attributed to an icon without guessing. Three separate
`download_assets` calls (`1:4340`, `1:4545`, `1:4714`) returned the identical truncated
fragment list, confirming the group repeats verbatim — they did not add coverage.
The fix is one `download_assets ... defaultFormat: svg` per icon frame, which flattens it;
that costs one Figma call each and the budget ran out after two.

| Node id | Layer name | Why missing |
| --- | --- | --- |
| `1:4660` | `megaways` | section 11 `Megaways` header icon. Single-vector frame, almost certainly present unnamed in the truncated fragment list, but not attributable. Export node directly as SVG. |
| `1:4679` | `wheel-fortune_18604065 1` | section 15 `Колесо` header icon. Same reason. |
| `1:4591` | `Must-play slots` | section 9 `Варто спробувати` header icon, 20x20 `#92BDF3`. The 16x16 chip version WAS harvested (`chip-must-play-slots.svg`, `#71809A`). Same layer name, but the chip flattened to 9 sub-paths while `1:4591` spans ~32 node ids — **I did not render both and compare, so treat them as possibly different glyphs.** Not a drop-in: the colour differs too. |
| `1:4624` | `Bonus buy` | hidden in every section header on this page — never visible, so no rendered reference exists. 36-node mask stack. |
| `1:4688` | `instant games` | hidden in every section header on this page. |
| `1:4691` | `egypt` | hidden in every section header on this page. |
| `1:4549` | `activity_8138338 1` | hidden in every section header on this page. |

Note the `Popular` icon is **not** in the `1:4548` group listing, yet `1:3426` `Popular` is the
visible icon of section `1:3414`. So the 15-frame group is not byte-identical across sections
after all — at least one section swaps a member. Only `1:4546` was read with `get_metadata`;
the other sections' groups were not enumerated. **Unknown, flagged, not resolved.**

## Evidence kept

20 unattributable SVG fragments from the `1:4340` probe are in
`scratchpad/icons-4340/a1.svg` ... `a20.svg`. They are fragments, not assets, and were
deliberately NOT written into the repo. `a4.svg` (2421 bytes, 13.4361 x 18.0503) is confirmed
to be the `current tournaments` artwork — the `1:4695` flat export returned exactly one
child asset at the same 2421 bytes. That is the only fragment that could be attributed.
