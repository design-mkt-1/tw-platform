import Link from 'next/link'
import { SCREENS, figmaUrl } from '@/lib/screens'

/**
 * An internal index of every reviewable state, and the design frame each one belongs to.
 *
 * It was an index of the eleven frames until 2026-09-12, when the three category chips got an
 * address. Those three draw the same frame as `casino-home` with a different chip selected —
 * the Figma file contains no second casino frame — so they carry `variantOf` and are counted
 * separately below. A page that called fourteen rows "fourteen frames" would be inventing three.
 *
 * Copy on this page is English, against the Ukrainian-only rule. That rule exists so product copy
 * is never invented or translated away from the design; this page has no design and no player, its
 * readers are the team and the designer, and calling a row "the menu, logged in as VIP" in
 * Ukrainian would be inventing copy. Hence `lang="en"` against the layout's `<html lang="uk">`.
 *
 * It ships in the static export because a static export has no dev-only mode, and nothing in the
 * app links to it — the owner's decision. `robots: { index: false }` in layout.tsx and
 * public/robots.txt already cover it.
 *
 * Styled with plain Tailwind utilities and deliberately not the product tokens: painting an
 * internal harness in `--bg-page` would make it read as a designed screen.
 *
 * Skipped: per-row iframe previews and thumbnails. A screenshot of a state is what
 * scripts/review.mjs produces; this page's job is the index, not a second renderer.
 */

export const metadata = { title: 'Top-Win — screens' }

const built = SCREENS.filter((s) => s.path)
const frames = SCREENS.filter((s) => !s.variantOf)

export default function ScreensPage() {
  return (
    <main lang="en" className="mx-auto max-w-2xl px-4 py-8 font-sans text-slate-900">
      <h1 className="text-xl font-bold">Top-Win — screens</h1>
      <p className="mt-1 text-sm text-slate-500">
        {`${SCREENS.length} reviewable states across ${frames.length} frames, ${built.length} with a built state.`}
      </p>

      <ul className="mt-6 space-y-3">
        {SCREENS.map((screen) => (
          <li key={screen.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm font-semibold">{screen.id}</span>
              <span className="text-sm text-slate-600">{screen.name}</span>
            </div>

            <div className="mt-1 text-xs text-slate-500">
              <span className="font-mono">&quot;{screen.figmaName}&quot;</span>
              {' · '}
              <span className="font-mono">{screen.nodeId}</span>
              {' · '}
              <span>390 × {Math.round(screen.figmaHeight)}</span>
              {screen.variantOf && (
                <>
                  {' · '}
                  <span>variant of {screen.variantOf}, no frame of its own</span>
                </>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {screen.path ? (
                <Link prefetch={false} href={screen.path} className="font-medium underline">
                  Open state
                </Link>
              ) : (
                <span className="text-slate-400">no built state</span>
              )}
              <a
                href={figmaUrl(screen.nodeId)}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline"
              >
                Open in Figma
              </a>
            </div>

            {screen.note && <p className="mt-2 text-xs leading-relaxed text-slate-500">{screen.note}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}
