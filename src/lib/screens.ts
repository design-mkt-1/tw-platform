import screensJson from '@/data/screens.json'

/**
 * The eleven 390-wide frames of the design, and the built state that reaches each one.
 *
 * The point of this file is not to list what was built. It is to make visible what was not: the
 * design draws eleven frames and the capture scripts drive ten, so without a row per frame the
 * one nobody built is invisible. `path: null` says so out loud — see `search-popular`, which
 * needs an interaction no URL can perform.
 *
 * It is also the single source for both capture scripts. Until 2026-09-10 the state list existed
 * twice — ten `shot()` calls in scripts/review.mjs and a `STATES` array in scripts/a11y.mjs — and
 * the two could disagree without anything failing. They now read src/data/screens.json with
 * `readFileSync`, which is why the data is JSON and not a lone `.ts`: a `.mjs` script cannot
 * import a TypeScript module, and stdlib JSON needs no build step.
 *
 * Why the states are what they are:
 *
 *  - Every frame is 390 wide. The Figma file contains no desktop frame, no tablet frame and no
 *    breakpoint, so a 1440 row here would be testing a layout that does not exist.
 *  - States are reached by URL rather than by clicking, through the contract in
 *    src/components/UrlStateBridge.tsx: `auth`, `panel` and `q`. A state nobody can link to is a
 *    state nobody can review — before those parameters existed, a capture called "the balance
 *    panel" was only ever a capture of the default page.
 *  - The four search frames are one component whose state is derived from the query, so the query
 *    is what selects them. `bon` is Latin because the catalogue is Latin; probing with `бон`
 *    matches nothing and silently captures the empty state under the suggestions name. `ксзщ` is
 *    Cyrillic on purpose. Both are spelled out in the `note` of their row.
 *
 * `id` is the slug, the screenshot filename and the `state` key in a11y.json, all three at once.
 * Renaming one renames the artifact CI uploads.
 */
export interface Screen {
  /** Slug, screenshot filename and a11y.json `state` key. */
  id: string
  /** English, for the team and the designer. This registry is not product copy. */
  name: string
  /** The layer name exactly as Figma holds it, trailing spaces and wrong labels included. */
  figmaName: string
  /** Figma's `1:7363` form. */
  nodeId: string
  /** Frame height in Figma. The casino frames are 5628.7001953125; stored rounded to 5628.7. */
  figmaHeight: number
  /** App path with its query, percent-encoded as it goes on the wire. `null` = no built state. */
  path: string | null
  /** Page frames are captured full-page; panel frames are not. */
  fullPage: boolean
  /**
   * The row this one is a variant of, when the design draws no separate frame for it.
   *
   * The three category chips are the case: `src/lib/data.ts:49-56` records that the Figma file
   * contains exactly one casino frame, with the `popular` chip selected, so `casino-slots` and its
   * two siblings reuse `nodeId: "1:581"` and point back at `casino-home`. Without this field the
   * uniqueness check on `nodeId` would be the thing that stopped three reviewable states from ever
   * being captured — a guard enforcing a rule the design does not have.
   */
  variantOf?: string
  /**
   * A string the frame must render, and one that would mean a neighbour drew instead.
   *
   * Both have been in `screens.json` since 2026-09-11 and neither was declared here; the rows
   * survived only on the `as Screen[]` cast below, which asserts rather than checks. A misspelled
   * `expectTest` would have been silently ignored by the interface and silently unused by
   * `scripts/review.mjs`, and the row would have read as guarded.
   */
  expectText?: string[]
  rejectText?: string[]
  /** Mandatory where `path` is null: what is missing, and why. */
  note?: string
}

export const SCREENS = screensJson as Screen[]

const FIGMA_FILE = 's2CqwGqe0O0FcALhBNlTRe'

/** Figma addresses a node as `1-7363` in a URL and as `1:7363` everywhere else. */
export function figmaUrl(nodeId: string): string {
  return `https://www.figma.com/design/${FIGMA_FILE}/?node-id=${nodeId.replace(':', '-')}`
}
