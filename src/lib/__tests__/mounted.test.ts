import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A component that nobody mounts.
 *
 * This is a guard for a defect that is invisible to every other check in this repo. A component
 * that is written, exported, styled and never rendered typechecks, lints, tests green, and is
 * absent from every screenshot — because it is absent from the page. Nothing distinguishes
 * "renders correctly" from "does not render at all" in an artifact that only shows what did paint.
 *
 * It has now shipped twice. On 2026-09-10 `MenuPanel` and `SearchOverlay` existed, were complete,
 * and were mounted by no file, so the header's menu button opened nothing; the cause was found by
 * grepping for who mounts them, not by any script. On 2026-09-11 `BetSlipFab` was exported from
 * `src/components/sport/BetSlipFab.tsx` and rendered nowhere, so the sportsbook's bet-slip button
 * did not exist on the page at all.
 *
 * The rule: every exported component under `src/components/` must be named by at least one other
 * file under `src/`. A file that only names itself is a file nothing reaches.
 *
 * **The sibling case this cannot catch, stated rather than attempted.** `activeCategory` was a
 * *store field* — `src/store/useAppStore.ts` held it, `CategoryBar` wrote it on every tap, and no
 * component read it, so the chips changed paint and filtered nothing. A walk over component
 * exports does not see that: the component was mounted, the store was mounted, and only the
 * read side was missing. Catching it needs a per-field read/write walk over the store, which is a
 * different guard over a different file, and `src/store/` is not this test's subject. Naming it
 * here so the gap is recorded rather than mistaken for coverage.
 */

const SRC = join(process.cwd(), 'src')
const COMPONENTS = join(SRC, 'components')

/**
 * Deliberately-unmounted components, each with the decision behind it.
 *
 * Empty on purpose. An entry here is a recorded decision — "this exists and is not rendered, and
 * that is intended, because …" — which is exactly the sentence nobody wrote for `BetSlipFab`. The
 * test failing until somebody writes it is the point; a component quietly dropping off the page
 * should cost a conversation.
 */
const ALLOWED = new Map<string, string>()

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.tsx?$/.test(entry.name) ? [full] : []
  })
}

/**
 * Exported component names in one file.
 *
 * A regex over the file text, not a TypeScript AST. The whole question is "does this identifier
 * appear in another file", which is a text question; parsing the module graph properly would mean
 * a parser dependency and a resolver for the `@/` alias, to answer something `grep` answers.
 *
 * Uppercase-initial only, which is the React component convention and is also what makes JSX treat
 * a tag as a component rather than an HTML element. It is why `useBetSlip` — a zustand store
 * exported from the same file as `BetSlipFab` — is not a subject here: a hook that nothing calls
 * is dead code, but it is not an invisible hole in a page.
 */
function exportedComponents(source: string): string[] {
  return [...source.matchAll(/^export\s+(?:async\s+)?(?:function|const|class)\s+([A-Z]\w*)/gm)].map(
    (match) => match[1],
  )
}

const FILES = walk(SRC)
const SUBJECTS = walk(COMPONENTS).flatMap((file) =>
  exportedComponents(readFileSync(file, 'utf8')).map((name) => ({ name, file })),
)

describe('every exported component is mounted somewhere', () => {
  it('found components to check', () => {
    // A guard on the guard: the it.each below passes vacuously if the walk returns nothing, which
    // is precisely what a moved directory or a changed extension would do.
    expect(SUBJECTS.length).toBeGreaterThan(20)
  })

  it.each(SUBJECTS.map((s) => [s.name, s.file] as const))(
    '%s is referenced outside its own file',
    (name, file) => {
      if (ALLOWED.has(name)) return

      // Word boundaries, so `Icon` is not matched by `IconProps` and `Button` is not matched by
      // `ButtonLink`. Without them every component would pass on its own props interface.
      const used = new RegExp(`\\b${name}\\b`)
      const referrers = FILES.filter((f) => f !== file && used.test(readFileSync(f, 'utf8'))).map(
        (f) => relative(process.cwd(), f).split(sep).join('/'),
      )

      expect(
        referrers,
        `${name} is exported from ${relative(process.cwd(), file).split(sep).join('/')} and named by no other file under src/. ` +
          `Either mount it, delete it, or add it to ALLOWED in this test with the reason it stays unrendered.`,
      ).not.toHaveLength(0)
    },
  )
})
