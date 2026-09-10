# Manifest — area `games`

File key `s2CqwGqe0O0FcALhBNlTRe`. Parent frame `1:3289` ("Pre log", 390 × 5628.7).
Download target: `C:\Users\grosu.b\orca\workspaces\tw-platform\main\public\images\games\`

Figma MCP calls spent: **1 of 6** (`download_assets` on `1:3289`). No quota error was hit.
Everything else came from URLs recorded in `02-casino-rows-a.md`, `03-casino-rows-b.md`,
`04-casino-rows-c.md`, fetched with `curl`.

---

## 1. Downloaded (7 files, all verified by magic bytes)

| File | Node id | Figma layer name | Format | Bytes | Source |
| --- | --- | --- | --- | --- | --- |
| `public/images/games/gates-of-olympus-1000.gif` | `1:3576` + 5 siblings (row `1:3414`); same bitmap in `1:4328…1:4339`, `1:4876`, `1:5060…1:5071`, `1:5405…1:5416` | `Gates of Olympus 1000` | **gif** (animated, 480 × 640) | 2 724 532 | recorded URL (`452c0ce3…`) |
| `public/images/games/gates-of-olympus-1000-still.png` | not resolved — see §4 | not resolved | png 240 × 320 | 124 791 | fresh call (`download_assets` raw #14) |
| `public/images/games/yeti-quest.png` | not resolved — see §4 | not resolved | png 256 × 345 | 169 981 | fresh call (raw #4) |
| `public/images/games/big-bass-amazon-extreme.png` | not resolved — see §4 | not resolved | png 256 × 385 | 230 857 | fresh call (raw #5) |
| `public/images/games/tournament-zeus-trophy.png` | `1:4702` | `image` (tournament card bg, section `1:4545` `Поточні Турніри`) | png 2066 × 570 | 589 785 | recorded URL (`494d1aea…`) |
| `public/images/games/tournament-big-bass-trophy.png` | `1:5228` | `image` (tournament card bg, section `1:5072` `Лотерея`) | png 2066 × 570 | 1 055 954 | recorded URL (`9012f749…`) |
| `public/images/games/tournament-spin-wheel.png` | `1:5417` subtree — **inferred, see §4** | not resolved | png 2066 × 570 | 1 335 113 | fresh call (raw #3) |

Magic bytes checked on every file: `89 50 4E 47` for the six PNGs, `47 49 46 38` (`GIF8`) for
the GIF. No 0-byte and no HTML-error bodies. All seven sha256 prefixes are distinct.

---

## 2. Which row each grid image came from — and the correction

The brief said "roughly one image per row, and `1:4888` vs `1:5240` were confirmed different".
**That is wrong, and this is the main measured result of this pass.**

Five separate recorded URLs, one per grid row, were fetched:

| Row | Title | Recorded URL | sha256 (first 12) |
| --- | --- | --- | --- |
| `1:3414` | `Популярне` | `452c0ce3-7377-409e-9396-608133375458.png` | `ac3d90da264c` |
| `1:4140` | `Краш Ігри` | `984b82ee-7986-4c19-b3e4-422d184dfbdc.png` | `ac3d90da264c` |
| `1:4714` | `Megaways` | `37b95c3e-6394-4241-9037-93d8f92523f3.png` | `ac3d90da264c` |
| `1:4888` | `Джекпоти` | `e5f918f8-c2d5-4ee4-a80f-d5a0aacaa47c.png` | `ac3d90da264c` |
| `1:5240` | `Drop & Wins` | `b1f9ce5e-d32f-448f-816b-cd0787195b64.png` | `ac3d90da264c` |

**All five are byte-identical** (2 724 532 bytes, same sha256). Five different asset URLs,
one underlying bitmap. Figma mints a fresh per-instance URL on every export, so *different URL*
never meant *different artwork* — the earlier "confirmed different" conclusion was drawn from
the URLs, not from the bytes. Measured: the hashes match. Four duplicate downloads were deleted.

Two further corrections, both measured:

1. **The game tile is not a PNG.** The URLs end in `.png`, but the server answers
   `Content-Type: image/gif` and the body starts `GIF89a`, 480 × 640. It is an **animated GIF** —
   the Gates of Olympus 1000 tile is a moving thumbnail. Saved with the `.gif` extension it
   actually is. Anything that trusts the `.png` in the URL will mislabel it.
2. The three grid rows with no recorded URL (`1:3588` `Нові Ігри`, `1:3964` `Рекомендовані`,
   `1:4340` `Варто спробувати`) were not probed individually. The page-wide `download_assets`
   sweep returned exactly **one** GIF across the whole subtree, and the grid rows are the only
   place the GIF is used, so those three rows carry the same tile. That is reasoning from the
   sweep, not a per-row measurement.

---

## 3. Distinct artwork actually recovered — the varied-content ceiling

The owner's question was how varied the built page can look without new artwork.

**Distinct game-tile artwork: 4.** Distinct content-row banners: 3. Total distinct files: 7.

| # | Artwork | Game / subject | Where it is used in the design |
| --- | --- | --- | --- |
| 1 | `gates-of-olympus-1000.gif` | Gates of Olympus 1000 — Pragmatic Play | **All 48 tiles** of all 8 grid rows |
| 2 | `gates-of-olympus-1000-still.png` | same game, static still, 3:4 | not a grid row — see §4 |
| 3 | `yeti-quest.png` | Yeti Quest — Pragmatic Play (carries a `DROPS & WINS` corner badge) | not a grid row — see §4 |
| 4 | `big-bass-amazon-extreme.png` | Big Bass Amazon Extreme — Pragmatic Play | not a grid row — see §4 |
| 5 | `tournament-zeus-trophy.png` | Zeus holding a silver trophy of coins | tournament card, `1:4545` `Поточні Турніри` |
| 6 | `tournament-big-bass-trophy.png` | Big Bass fisherman with a gold trophy | tournament card, `1:5072` `Лотерея` |
| 7 | `tournament-spin-wheel.png` | prize wheel with a `SPIN` hub and a `500x` badge | tournament card, `1:5417` `Колесо` (inferred) |

So the design itself offers **one** game tile repeated 48 times. Three more portrait game tiles
exist elsewhere in the same page and are recovered here, which lifts the ceiling from 1 to **4**
distinct tiles — enough for a 3-across row to show three different games, but **not** enough to
fill a 6-card row without repeating, and not enough to make two rows look unrelated.

Anything more varied than 4 needs artwork the Figma file does not contain.

---

## 4. UNKNOWN / not measured

1. **Node ids for assets 2, 3, 4 and 7 were never resolved.** `download_assets` returns raw
   source bitmaps for a whole subtree with **no node id attached** — the response is a flat list
   of URLs. I know these four bitmaps are in the `1:3289` subtree and I know what they depict,
   but not which layer holds them. Resolving them costs one `get_design_context` per candidate
   node; I did not spend it.
2. **Where `yeti-quest`, `big-bass-amazon-extreme` and the Gates still actually sit.** Three
   portrait game bitmaps that are not the grid GIF, and `1:3391` `Recent wins - Ticker (iOS)` has
   exactly three `Entry` rows with a 46 px thumbnail each. Three and three is a good fit and it is
   the only place in the page that wants three small portrait game images — but this is
   **reasoning, not measurement**. The ticker is another agent's area (`21-gap-catnav-ticker.md`);
   whoever owns it should confirm before these are reused as grid tiles.
3. **`tournament-spin-wheel.png` is assigned to `1:5417` by elimination.** Three tournament-card
   sections exist (`1:4545`, `1:5072`, `1:5417`); two of them have node-confirmed recorded URLs
   that I matched by hash, and the section left over is named `Колесо` ("wheel"), which is what
   the artwork shows. Not measured.
4. **The sweep was truncated.** `download_assets` on `1:3289` reported
   `rawImagesTruncated: true` and `svgAssetsTruncated: true` — the page has more than 20 source
   images and more than 20 SVGs, and only the first 20 of each came back. A fifth distinct game
   tile could exist past the cut. Ten of the twenty raw images were classified as non-game by
   aspect ratio (hero/footer/provider/background shapes) and were not opened; the one I did open,
   a 1901 × 931 casino-hall interior, is a background, not game art.
5. **No image pipeline was run.** `CLAUDE.md` requires `node scripts/to-webp.mjs` on exported
   PNGs. It was not run: this worktree has no `node_modules`, and `to-webp` on an **animated**
   GIF would flatten it to a single frame. The 2.7 MB GIF and the three 2066 × 570 banners ship
   as-is and are the heaviest assets in the demo — someone must decide, in `D:\tw-platform`,
   whether the tile keeps its animation (and its 2.7 MB) or becomes a still.
6. **Whether the repetition is deliberate.** One tile across 48 cards reads as mock filler, but
   the file never says so. Unchanged from `04-casino-rows-c.md` UNKNOWN 4.

---

## 5. Nothing is missing in the "could not download" sense

Every asset that had a recorded URL in my three inventory files downloaded and verified. The only
gaps are the three grid rows that never had a URL recorded (`1:3588`, `1:3964`, `1:4340`) — and
those need no export, because the sweep shows they use the tile already saved here. No asset is
listed for manual export by a human.
