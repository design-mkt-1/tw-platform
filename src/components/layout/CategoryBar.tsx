'use client'

import { useRef, type KeyboardEvent } from 'react'
import { Icon } from '@/components/primitives/Icon'
import { CHIP_ICONS, type ChipIconName } from '@/lib/assets'
import { CATEGORIES } from '@/lib/data'
import { useAppStore } from '@/store/useAppStore'

/**
 * The category switcher, node 1:3335 → 1:3337. 390 x 44, unchanged by auth state.
 *
 * It scrolls: the design's track is 502 wide inside a 390 frame, so ~112px of chips sit off the
 * right edge with no wrap container. `scrollbar-none` keeps the scroll and hides the bar.
 *
 * The active state is pure paint, measured on the 1:1 render: fill `--chip-active`, label and
 * icon `--text-primary`, `--shadow-chip-active`. Inactive chips have no fill at all — the
 * track's own `--surface-tint` shows through — and no border exists on either state.
 *
 * That fill is 1.23:1 against the track it sits on (docs/tokens.md §6), and the shadow carrying
 * the rest of the signal does not survive high-contrast mode or grayscale. What is left is the
 * label colour and `aria-selected`, so the tab semantics here are not decoration.
 *
 * Until 2026-09-10 that last sentence was false: `activeCategory` was read nowhere outside this
 * file, so all four chips drew the same 51 articles and `aria-selected` announced a switch that
 * never happened. The chip now narrows every game row on the page — see `gamesInCategory` in
 * src/lib/data.ts for the rule and why `Популярне` narrows nothing.
 *
 * The chips keep `role="tab"` because they now do what a tab does: exactly one is selected and
 * selecting another changes the content below. They control eight separate rows rather than one
 * swapped panel, so no `tabpanel` and no `aria-controls` exists to point at — recorded as a
 * deviation from the ARIA tabs pattern rather than papered over by labelling `<main>` a panel,
 * which would claim the hero, the ticker and the footer change too. They do not.
 */

/**
 * Each glyph is exported at its own bounding box, not at the size of the frame it sits in, so
 * the frame is drawn here and the glyph keeps its measured size inside it. Rendering the
 * 12.8069 x 9.03685 live-casino mark at 16 x 16 would stretch it — its SVG carries
 * `preserveAspectRatio="none"`.
 */
const CHIP_ICON: Record<ChipIconName, { frame: string; width: number; height: number }> = {
  popular: { frame: 'w-[11.226px]', width: 11.2258, height: 16 }, // 1:3340, frame is the glyph
  slots: { frame: 'w-4', width: 16, height: 16 }, // 1:3345
  liveCasino: { frame: 'w-4', width: 12.8069, height: 9.03685 }, // 1:3381
}

export function CategoryBar() {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const setCategory = useAppStore((s) => s.setCategory)
  const trackRef = useRef<HTMLDivElement>(null)

  // Left/Right move selection and focus together, which is the tab pattern users expect and is
  // also the only way to reach the chips that start off-screen without a pointer.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0) return
    event.preventDefault()

    const current = CATEGORIES.findIndex((category) => category.id === activeCategory)
    const next = (current + step + CATEGORIES.length) % CATEGORIES.length
    setCategory(CATEGORIES[next].id)

    // The track is 502 wide in a 390 frame, so chips 3 and 4 begin outside the viewport and
    // `focus()` alone left `scrollLeft` at 0 — a focused control the user cannot see, which is a
    // keyboard trap in practice. `preventScroll` keeps the browser's own scroll out of it and
    // `inline: 'nearest'` moves the track by the least amount that puts the chip on screen;
    // `block: 'nearest'` leaves the page's vertical position alone when the bar is already visible.
    //
    // Only when the chip is actually clipped, though: `nearest` aligns to the scroller's padding
    // box, so calling it on a chip that is already fully visible still slid the track by the
    // 20px gutter on the very first ArrowRight. Measured — a jump with nothing to fix.
    const chip = trackRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]
    chip?.focus({ preventScroll: true })
    const chipBox = chip?.getBoundingClientRect()
    const viewBox = trackRef.current?.parentElement?.getBoundingClientRect()
    if (chipBox && viewBox && (chipBox.left < viewBox.left || chipBox.right > viewBox.right)) {
      chip?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }

  return (
    <div className="flex overflow-x-auto px-gutter scrollbar-none">
      {/* 1:3337 — 44 tall, 4px padding all round, radius 13. Chips are flush, no gap. */}
      <div
        ref={trackRef}
        role="tablist"
        onKeyDown={onKeyDown}
        className="flex shrink-0 rounded-track bg-tint p-1"
      >
        {CATEGORIES.map((category) => {
          const isActive = category.id === activeCategory
          const icon = CHIP_ICON[category.icon]

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setCategory(category.id)}
              className={[
                // 121 x 36 with the row centred; the design's fourth chip hugs wider than 121
                // when its content demands it, which `min-w` reproduces.
                'flex h-9 min-w-[121px] shrink-0 items-center justify-center rounded-chip px-2',
                // The chip is 36 tall; the `after` grows the target to 44 into the track's own 4px
                // padding, so it stays inside the scroller and moves no pixel. Chips are flush, so
                // only the vertical axis has room to grow.
                "relative after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
                'text-chip font-medium capitalize',
                // The icon-to-label gap really is 8 on the active chip and 6 on the others.
                isActive
                  ? 'gap-2 bg-chip-active text-primary shadow-chip-active'
                  : 'gap-1.5 text-muted-text',
              ].join(' ')}
            >
              <span className={`flex h-4 shrink-0 items-center justify-center ${icon.frame}`}>
                <Icon
                  src={CHIP_ICONS[category.icon]}
                  alt=""
                  width={icon.width}
                  height={icon.height}
                />
              </span>
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
