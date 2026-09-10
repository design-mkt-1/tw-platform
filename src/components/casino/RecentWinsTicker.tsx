import Image from 'next/image'
import { Fragment } from 'react'

import { GAME_ART } from '@/lib/assets'
import { formatUah, maskUsername } from '@/lib/format'
import type { RecentWin } from '@/lib/types'

/**
 * Recent wins — node 1:3391, 390x78 on `--bg-page`.
 *
 * Three entries 58 tall at y 16, so the vertical padding is 16 top and 4 bottom. The asymmetry is
 * in the file, not a transcription slip, and it is what places the divider correctly: a 44px rule
 * centred inside the 58px content box lands at y 23..67, which is exactly where 1:3399 is drawn.
 *
 * The row scrolls. Entry 3 ends 92px past the 390px frame with no wrap container, so the design
 * itself runs off the right edge. It carries no marquee spec, so this is a plain scroller.
 *
 * The amount colour is per entry — green on entry 1, orange on entries 2 and 3 — and the design
 * gives two samples with no legend, so the switch is carried as data (`RecentWin.tone`) rather
 * than derived from the amount. Guessing a threshold would invent a rule the design never states.
 */

/** `1:3396` is `--text-win-up`, `1:3404` / `1:3411` are `--text-win-alt`. */
const TONE_TEXT: Record<RecentWin['tone'], string> = {
  up: 'text-win-up',
  alt: 'text-win-alt',
}

export function RecentWinsTicker({ wins }: { wins: RecentWin[] }) {
  return (
    <section className="w-full bg-page">
      {/* Keyboard reach for the scroller, and a name for it — the design supplies neither. */}
      <ul
        tabIndex={0}
        aria-label="Останні виграші"
        className="scrollbar-none flex items-center gap-3 overflow-x-auto px-gutter pb-1 pt-4"
      >
        {wins.map((win, index) => (
          <Fragment key={win.id}>
            {/*
             * Exactly ONE divider exists — between entries 1 and 2 — and none between 2 and 3,
             * although both gaps are the same 12px. Drawn as drawn; whether the second one is
             * missing from the design is a question for the owner, not a gap to quietly fill.
             */}
            {index === 1 && (
              <li
                aria-hidden="true"
                className="h-[44px] shrink-0 border-l border-ticker-divider"
              />
            )}
            <li className="flex h-[58px] shrink-0 items-center gap-3 px-1">
              <span className="relative h-[46px] w-[46px] shrink-0 overflow-hidden rounded-md border border-on-dark-10 bg-ticker-thumb">
                <Image
                  src={GAME_ART[win.art]}
                  alt=""
                  fill
                  sizes="46px"
                  unoptimized
                  className="object-cover"
                />
              </span>

              {/* Content box 1:3395: 75 wide, three lines, 2px apart, none of them wrapping. */}
              <span className="flex w-[75px] flex-col gap-0.5 whitespace-nowrap">
                <span className={`font-roboto text-ticker-amount font-bold ${TONE_TEXT[win.tone]}`}>
                  {formatUah(win.amountMinor)}
                </span>
                <span className="font-roboto text-xs leading-[14px] text-body-muted">
                  {maskUsername(win.player)}
                </span>
                {/*
                 * 90px with an ellipsis, which is 15px wider than the 75px box it sits in — the
                 * overflow is measured on 1:3398 and the ellipsis is the design's own, so both
                 * are reproduced. The `у ` prefix is part of the drawn string.
                 */}
                <span className="w-[90px] overflow-hidden text-ellipsis font-roboto text-5xs font-semibold leading-[14px] text-placeholder">
                  {'у '}
                  {win.gameTitle}
                </span>
              </span>
            </li>
          </Fragment>
        ))}
      </ul>
    </section>
  )
}
