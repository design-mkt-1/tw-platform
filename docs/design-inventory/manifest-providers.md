# Top-Win — Asset manifest: `providers`

File key `s2CqwGqe0O0FcALhBNlTRe`. Source track `1:3785` (`Row-1`) inside `1:3784`.
Downloaded into `C:/Users/grosu.b/orca/workspaces/tw-platform/main/public/images/providers/`.

**Figma MCP calls spent: 5 of 6.** Quota was NOT hit — no rate-limit message at any point.
**5 of 5 provider logos downloaded and visually confirmed. 0 missing.**

---

## 1. The five files

| File | Node id | Figma layer name | Format | Bytes | Source |
| --- | --- | --- | --- | --- | --- |
| `public/images/providers/pragmatic.svg` | `1:3788` | `Frame` (badge `1:3786` `Badge-Pragmatic`) | svg | 6434 | fresh call |
| `public/images/providers/3-oaks.svg` | `1:3799` | `3-OAKS 1` | svg | 9612 | fresh call |
| `public/images/providers/bgaming.svg` | `1:3820` | `BGAMING 1` | svg | 5965 | fresh call |
| `public/images/providers/nolimit-city.svg` | `1:3843` | `NOLIMIT-CITY 1` | svg | 7326 | fresh call |
| `public/images/providers/spribe.svg` | `1:3871` | `Frame` (badge `1:3869` `Badge-Spribe`) | svg | 1483 | **recorded URL** |

All five are 44x44 except `3-oaks.svg`, which is **45x44** — the one authored exception, and it
matches the metadata (`x=13.5` instead of `14` inside the circle).

### Name mapping, where the layer name is not the brand

| File | Layer name | Why this name |
| --- | --- | --- |
| `pragmatic.svg` | `Frame` | Badge wrapper is `Badge-Pragmatic`; artwork wordmark reads `PRAGMATIC` |
| `spribe.svg` | `Frame` | Badge wrapper is `Badge-Spribe`; artwork is the Spribe `S` mark |
| `3-oaks.svg` | `3-OAKS 1` | trailing ` 1` is a Figma instance counter, not part of the brand |
| `bgaming.svg` | `BGAMING 1` | same |
| `nolimit-city.svg` | `NOLIMIT-CITY 1` | same |

**On `pragmatic.svg` and not `pragmatic-play.svg`.** The real-world provider is Pragmatic Play,
but neither source says "Play": the rendered wordmark is `PRAGMATIC` + a small amber mark
(zoomed and read at 120x120), and the Figma layer is `Badge-Pragmatic`. Named after what the
artwork and the file actually contain. If the demo needs the full brand string, that is a label
in code, not a rename of the asset.

---

## 2. Was `1:3874` anything different? No.

Measured with one `get_metadata` call on `1:3874`. It is a structural clone of `1:3784`:

| | `1:3784` / `1:3785` | `1:3874` / `1:3875` |
| --- | --- | --- |
| Track width | 420 | 420 |
| Badge count / order | Pragmatic, 3 Oaks, BGaming, Nolimit, Spribe | identical |
| Badge x | 0 / 80 / 160 / 240 / 320 | identical |
| Circle | `x=4 y=12 72x72` | identical |
| Logo leaf | 44x44, 3 Oaks `45x44 @ x=13.5` | identical, same 3 Oaks exception |

Second-track node ids: `1:3878`, `1:3889`, `1:3910`, `1:3933`, `1:3961`.

**Measured:** every name, position and size in the two subtrees matches, including the 45x44
oddity. **Reasoning, not measured:** that the *artwork* is byte-identical. `get_metadata` returns
geometry and names only, never fills or image refs, and I did not spend a call on design context
for the second track. So: nothing distinct was harvested from `1:3874`, and the duplicate reading
is strongly supported — but "same geometry" is what I proved, not "same pixels".

This resolves UNKNOWN #6 of `02-casino-rows-a.md` and UNKNOWN #1 of `22-gap-gamecard-providers.md`
as far as structure goes.

---

## 3. Two corrections to `22-gap-gamecard-providers.md`

### 3.1 The mask/fill warning was overcautious — the masks are no-ops

That file warned that only Spribe exports as one self-contained SVG and that the other four are
"clip-path decompositions ... fragile ... re-export by hand". I fetched all 11 recorded URLs
(plain HTTP, zero quota) and read them. **Every `mask` file is a single black rect covering its
entire viewBox:**

```svg
<!-- pragmatic-mask.svg, 256 bytes, in full -->
<path id="Vector" d="M44 0H0V10.56H44V0Z" fill="black"/>   <!-- viewBox is 0 0 44 10.56 -->
```

A mask that covers the whole box masks nothing. So the `fill` file alone is the complete artwork
for Pragmatic, 3 Oaks and Nolimit. No compositing was ever required. BGaming is the genuine
exception: four pieces (icon outer `1:3821`, inner `B` `1:3822`, wordmark fill, mask).

### 3.2 All 11 recorded URLs were still alive

Every URL in that file's asset table downloaded with `curl --fail`. None had expired.

---

## 4. Why I still spent 4 calls after the recorded URLs worked

The recorded `fill` SVGs carry the artwork but **not its position inside the 44x44 leaf**: the
Pragmatic wordmark is `44 x 10.5479`, Nolimit `44 x 11.8345`, BGaming's wordmark `43.9 x 7.6`.
Dropping those into a 44x44 box needs a y-offset that is nowhere in the recorded files, and
guessing "vertically centred" would have been inventing design data.

`download_assets` per node returns an `export` — the node flattened, in absolute 44x44
coordinates. That is the offset, measured. Confirmed by the result: the Nolimit wordmark lands at
`y=15.7..28.0`, i.e. `(44 - 11.83) / 2 = 16.08`. Centred, as guessed — but now known.

Spribe needed no call: its recorded URL is already a complete 44x44 SVG.

---

## 5. The export carries the whole page — and `clean-svg.mjs` does not catch it

Recording this because it will bite the next person exporting from this file.

`download_assets` renders the node **in page context**, cropped to the node box. The raw
`1:3820` export was 7345 bytes and its ancestor chain was:

```
<rect 44x44 fill="#1E1E1E">                    <- canvas grey
<g id="Pre log">
  <rect 390x5628.7 transform="translate(-194 -1252)" fill="#F7FAFF">   <- the whole page
  <g id="Frame 2135557701"> <rect 390x264 ...>
    <g id="new-games-section"> <g id="Frame 2135557702">
      <g id="Slider-Track-Wrapper"> <g id="Row-1"> <g id="Badge-BGaming">
        <g id="Circle"> <rect x="-14" y="-14" width="72" height="72" rx="36" fill="white">
          <g id="BGAMING 1">   <- the only part that is the logo
```

**`node scripts/clean-svg.mjs` on these files removed 211 bytes of 7345 — 2%.** It stripped the
`#1E1E1E` rect (rule 1) and nothing else. Rule 3 should have caught the `390x5628.7` rect on
width alone, and did not. I did not chase why, and I did not touch the script: it is outside my
area and the repo's rule is to fix the class, not patch around it.

**Open question for whoever owns `clean-svg.mjs`: rule 3 (`FURNITURE_SCALE`) does not fire on the
`390`-wide page rect inside a `0 0 44 44` viewBox in these exports. Worth a look before the next
Figma export pass, because the file renders correctly either way — the cost stays invisible,
which is exactly the failure mode the script was written for.**

What I did instead: lifted the `<g id="...">` logo subtree out. It is already in absolute node
coordinates, so no transform maths — the extractor is
`scratchpad/extract.py`. Result 7345 -> 5965 bytes for BGaming, and a re-run of
`clean-svg.mjs --dry` over the finished directory now reports **0 files changed**, independently
confirming no page furniture survived.

### The bug that check caught

My first extract dropped `<defs>`. `3-OAKS 1` fills three paths with
`url(#paint0_linear_0_1)` .. `paint2_linear_0_1` — linear gradients defined at page level. Lifting
the subtree alone left three dangling references, and those paths (the three gold crowns) would
have rendered as nothing. The extractor now walks `url(#...)` transitively and carries the needed
defs; `3-oaks.svg` grew 8837 -> 9612 bytes, and the crowns render gold in the screenshot.
It hard-fails on any remaining dangling ref rather than writing a quietly broken file.

---

## 6. Verification

1. **Byte check** — every file starts `<svg`, parses as XML (`ElementTree`), no `#1E1E1E`,
   no rect wider than 3x the viewBox, zero dangling `url(#...)` references.
2. **`clean-svg.mjs --dry`** over the finished directory: 0 files changed.
3. **Rendered in Chrome** at real badge geometry (72px white circle, `rounded-1000px`,
   `drop-shadow 0 6px 9px rgba(23,69,143,0.08)`, `#F7FAFF` page) and read visually. All five
   show the brand their filename claims:

   | File | What is actually drawn |
   | --- | --- |
   | `pragmatic.svg` | `PRAGMATIC` wordmark, amber mark at right |
   | `3-oaks.svg` | three gold crowns over `3 OAKS` / `GAMING` |
   | `bgaming.svg` | yellow `#FFCC29` square with `B`, `BGAMING` beneath |
   | `nolimit-city.svg` | `NOLIMIT` over spaced `CITY` |
   | `spribe.svg` | the Spribe `S` monogram with underbar |

Point 3 is the one that matters: the layer names were *not* trusted on their own, because this
file is already known to lie about them (`02-casino-rows-a.md` §4 — a node named `Recent games`
renders `Популярне`).

### Brand colours, now measured

| Hex | Where |
| --- | --- |
| `#FFCC29` | BGaming square + wordmark rules |
| `#F19021` | Pragmatic accent mark |
| 3 gradients | 3 Oaks crowns (`paint0/1/2_linear`, carried into `3-oaks.svg`) |

Resolves UNKNOWN #2 of `22-gap-gamecard-providers.md` for Pragmatic and BGaming. Nolimit and
Spribe are pure `black` — no brand colour in the artwork.

---

## MISSING

None. All five distinct provider logos were downloaded and verified.

## UNKNOWN

1. **Whether `1:3874`'s artwork is byte-identical to `1:3785`'s.** Geometry and names match
   exactly; pixels not compared. One `get_design_context` on `1:3874` would settle it.
2. **Why `clean-svg.mjs` rule 3 misses the `390x5628.7` page rect** in these exports. Observed,
   not diagnosed — see §5.
3. **Whether `3-oaks.svg` should be normalised to 44x44.** It is authored 45x44 and I kept it as
   authored. Squashing it to 44 would distort by ~2%; the badge centres it either way.
