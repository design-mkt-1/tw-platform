'use client'

import { Button, INERT } from '@/components/primitives/Button'
import { Icon } from '@/components/primitives/Icon'
import { DEPOSIT_PLUS, LOGO, SEARCH_ICON } from '@/lib/assets'
import { USER } from '@/lib/data'
import { formatUah } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'

/**
 * The app header, nodes `1:3290` (pre-login) and `1:582` (post-login).
 *
 * Both are 390 x 60 on `--bg-header` with a 16px gutter, and the whole auth delta lives inside
 * them: a 666-node diff of the two frames found the header subtree and nothing else. So this is
 * one component with two right-hand clusters, not two headers.
 *
 * Two measured oddities are reproduced rather than smoothed:
 *
 *  - The inner row is 36 tall pre-login and 40 post-login inside a fixed 60. `items-center`
 *    reproduces the measured y of 12 and 10 exactly. The `py-[14px]` Figma declares would give
 *    68 and contradicts the frame, so it is ignored (docs/tokens.md §4.4).
 *  - The search control is 36 x 36 pre-login and 40 x 40 post-login, right edges flush at 374.
 *    Pre-login its 40 x 40 glyph is *cropped* by the 36px box at (-2, -2), not scaled down —
 *    centring a 40px child in a 36px clip is that offset, which is why the icon carries
 *    `max-w-none`: Tailwind's preflight would otherwise shrink it to 36 and lose the crop.
 */
export function Header() {
  const auth = useAppStore((s) => s.auth)
  const isPrelogin = auth === 'prelogin'

  return (
    <header className="flex h-[60px] items-center bg-header px-gutter">
      {/* 1:3291 / 1:583 — 358 wide, symmetric 16px gutters. */}
      <div className={`flex w-full items-center justify-between ${isPrelogin ? 'h-9' : 'h-10'}`}>
        <Icon src={LOGO} alt="Top-Win" width={111} height={20} priority />
        {isPrelogin ? <AuthButtons /> : <BalanceChip />}
      </div>
    </header>
  )
}

/** 1:3294 "btns" — login, register, search, gap 8. */
function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      {/* 1:3295 / 1:3296 */}
      <Button variant="muted" aria-disabled="true" className={`h-9 w-[60px] text-sm capitalize ${INERT}`}>
        Увійти
      </Button>
      {/* 1:3297 / 1:3298. The design writes `Реєстарція` (а and р transposed); the owner's
          decision is that the typo is corrected on the way in. */}
      <Button variant="cta" aria-disabled="true" className={`h-9 w-[86px] text-sm capitalize ${INERT}`}>
        Реєстрація
      </Button>
      <SearchButton className="h-9 w-9" />
    </div>
  )
}

/** 1:585 — the balance pill and the search button, gap 8. */
function BalanceChip() {
  return (
    <div className="flex items-center gap-2">
      {/* 1:586 — 99 x 40, px 8, radius 8. Its width is the sum of its contents: 8 + 55 + 4 + 24 + 8. */}
      <div className="flex h-10 items-center gap-1 rounded-md bg-balance-pill px-2">
        {/* 1:588 prints `$ 140.00`; the whole app formats hryvnia in uk-UA instead — the
            design's own hero two rows below prices the same bonus in ₴. */}
        <span className="whitespace-nowrap font-roboto text-base font-semibold leading-[18px] text-navy">
          {formatUah(USER.balanceMinor)}
        </span>
        {/* 1:589 — a 24 x 24 layer holding a 23.2507 x 23.25 glyph, so the box is drawn here and
            the glyph keeps its own size rather than being rounded up into it. It is a picture,
            not a control: Figma names the search node `Button` and does not name this one, and
            the file contains no deposit flow to open. */}
        <span className="flex h-6 w-6 items-center justify-center">
          <Icon src={DEPOSIT_PLUS} alt="" width={23.2507} height={23.25} />
        </span>
      </div>
      <SearchButton className="h-10 w-10" />
    </div>
  )
}

/**
 * 1:3299 / 1:593. The only header control that does anything: it opens the search sheet.
 *
 * `Пошук` is the design's own word, taken off the search field placeholder `Пошук провайдерів...`
 * (1:7388) — the button itself carries no label anywhere in the file.
 */
function SearchButton({ className }: { className: string }) {
  const openPanel = useAppStore((s) => s.openPanel)
  const panel = useAppStore((s) => s.panel)

  return (
    <button
      type="button"
      aria-label="Пошук"
      // Both buttons in this build open a `role="dialog"` sheet, and until 2026-09-10 only the
      // Menu button said so. A screen reader announced this one as a plain button, so nothing
      // warned that pressing it would move focus into an overlay. Kept identical to
      // BottomNavBar's raised button rather than invented here.
      aria-haspopup="dialog"
      aria-expanded={panel === 'search'}
      onClick={() => openPanel('search')}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ${className}`}
    >
      <Icon src={SEARCH_ICON} alt="" width={40} height={40} className="max-w-none shrink-0" />
    </button>
  )
}
