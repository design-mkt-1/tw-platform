'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from '@/components/primitives/Icon'
import { SPORT_ICONS } from '@/lib/assets'

/**
 * The Прематч / Лайв segmented control and the rounded card it lives in — node 1:6007.
 *
 * `1:6007` is 390x152 and holds TWO things in Figma: the mode track (1:6008 → 1:6009) and the
 * sports navigation row (1:6016). That is why this component takes `children`: the caller
 * renders `<PrematchLiveToggle><SportNavRow /></PrematchLiveToggle>` so both sit inside the one
 * radius-24 / shadow-container plate the design draws. Rendering them as siblings still works —
 * the plate simply wraps the track alone — but it is not what 1:6007 is.
 *
 * Padding is doubled on purpose and both halves are measured: 1:6007 carries `padding-top: 12px`
 * and 1:6008 carries `padding: 12px 16px 0`. Track top lands at absolute y 84 = 60 + 12 + 12.
 * 1:6007 has no padding-bottom; the nav row's own 76px closes the 152.
 *
 * The container declares no background. The `--bg-page` seen inside it at y 60..83 and 136..151
 * is the page showing through (23-gap-sport-chrome.md §5), so nothing is painted here.
 */

const MODES = [
  /** 1:6011 — literal, character for character. */
  { id: 'prematch', label: 'Прематч' },
  /** 1:6015. The stream icon 1:6013 belongs to this tab in both states. */
  { id: 'live', label: 'Лайв' },
] as const

type ModeId = (typeof MODES)[number]['id']

export function PrematchLiveToggle({ children }: { children?: ReactNode }) {
  const [mode, setMode] = useState<ModeId>('prematch')

  return (
    <section className="w-full overflow-hidden rounded-xl pt-3 shadow-container">
      <div className="px-gutter pt-3">
        {/* 1:6009 — 358x52, radius 999, 4px padding and 4px gap. Children are flex:1 → 173x44. */}
        <div className="flex h-[52px] gap-1 rounded-full bg-track p-1">
          {MODES.map((item) => {
            const isActive = item.id === mode

            return (
              <button
                key={item.id}
                type="button"
                // Two mutually exclusive options with no tabpanel below them: `aria-pressed` on
                // a pair of toggle buttons says that without the roving tabindex a `tablist`
                // would require, and Tab still reaches both. CategoryBar uses `tab` because it
                // switches the grid under it; this switches nothing yet.
                aria-pressed={isActive}
                onClick={() => setMode(item.id)}
                className={[
                  'flex h-full flex-1 items-center justify-center gap-2 rounded-full',
                  // The label is #102A67 in BOTH tabs — pixel-confirmed on the 1:1 render, the
                  // selected state is fill plus one shadow and nothing else.
                  'text-md text-primary',
                  isActive ? 'bg-surface shadow-card' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.id === 'live' ? (
                  // 1:6013, 18x18. The exported file carries `--icon-live` (#FF7A45) in its own
                  // fill, so no colour class belongs here.
                  <Icon
                    src={SPORT_ICONS.liveStream}
                    alt=""
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px]"
                  />
                ) : null}
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {children}
    </section>
  )
}
