import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * A `<Button>` that does nothing and does not say so.
 *
 * The primitive in src/components/primitives/Button.tsx squashes under a finger
 * (`active:scale-[0.97]`) and reads as a live control to a screen reader. A caller that gives it
 * no `onClick` has built a control that presses and then does nothing — the class the
 * predecessor project's audit found most of. The honest inert form is already the house pattern:
 * `aria-disabled="true"` plus `INERT` (Header.tsx, MenuPanel.tsx).
 *
 * Found on 2026-09-10: `Приєднатися` in TournamentCard.tsx, three instances on `/`, carried
 * neither. It was the only such Button in `src`.
 *
 * The rule: every `<Button` opening tag under `src/` carries `onClick` or `aria-disabled`.
 * `<ButtonLink` is not a subject — a link has an href, which is its behaviour.
 */

const SRC = join(process.cwd(), 'src')

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith('.tsx') ? [full] : []
  })
}

/**
 * Every `<Button …>` opening tag in a file, attributes included.
 *
 * A scanner rather than a regex, because attribute values carry `>` — `onClick={() => …}` is the
 * very attribute this looks for, and a `[^>]*` pattern would stop at its arrow.
 */
function buttonTags(source: string): { line: number; tag: string }[] {
  const tags: { line: number; tag: string }[] = []
  const opener = /<Button(?![\w])/g
  for (let match = opener.exec(source); match; match = opener.exec(source)) {
    let depth = 0
    let quote: string | null = null
    let end = match.index + match[0].length
    for (; end < source.length; end++) {
      const ch = source[end]
      if (quote) {
        if (ch === quote) quote = null
      } else if (ch === '"' || ch === "'" || ch === '`') quote = ch
      else if (ch === '{') depth++
      else if (ch === '}') depth--
      else if (ch === '>' && depth === 0) break
    }
    tags.push({
      line: source.slice(0, match.index).split('\n').length,
      tag: source.slice(match.index, end + 1),
    })
  }
  return tags
}

const SUBJECTS = walk(SRC).flatMap((file) =>
  buttonTags(readFileSync(file, 'utf8')).map((t) => ({
    where: `${relative(process.cwd(), file).split(sep).join('/')}:${t.line}`,
    tag: t.tag,
  })),
)

describe('every <Button> either acts or says it is inert', () => {
  it('found buttons to check', () => {
    // A guard on the guard: a renamed primitive would make the it.each pass on nothing.
    expect(SUBJECTS.length).toBeGreaterThan(3)
  })

  it.each(SUBJECTS.map((s) => [s.where, s.tag] as const))('%s', (where, tag) => {
    expect(
      /\bonClick\b|\baria-disabled\b/.test(tag),
      `${where}: <Button> with neither onClick nor aria-disabled. Give it a handler, or mark it ` +
        `inert with aria-disabled="true" and INERT from primitives/Button.tsx.`,
    ).toBe(true)
  })
})
