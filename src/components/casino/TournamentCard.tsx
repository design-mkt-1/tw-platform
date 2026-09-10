'use client'

import { useEffect, useState } from 'react'
import { Button, INERT } from '@/components/primitives/Button'
import { Icon } from '@/components/primitives/Icon'
import { TOURNAMENT_ART } from '@/lib/assets'
import { countdownEndIso, formatCountdown, formatUahWhole } from '@/lib/format'
import type { Tournament } from '@/lib/types'

interface TournamentCardProps {
  tournament: Tournament
  /**
   * The clock the FIRST paint is formatted against, supplied by the caller.
   *
   * It is a prop rather than a `Date.now()` inside this component because both the export and the
   * browser render this markup: a clock read in two places is read at two instants, the two
   * strings differ, and React throws a hydration mismatch on a card that looked fine locally.
   * One value in, one string out, on both sides. The live clock takes over after mount.
   */
  from: number
}

/**
 * Node `1:5227` — 358 × 220, radius 24, `--bg-card-dark` behind a full-bleed banner,
 * 1px `--border-on-dark-08`, 20px padding. Its twin `1:4701` is the same component.
 *
 * The banner is the FULL-BLEED source (1573 × 478), not the cropped view Figma draws, so CSS
 * re-crops it. The percentages are Figma's own fill transform and are deliberately not derived
 * from the file's pixel size: the file's aspect is 3.474 against the card's real 3.291, and
 * recomputing the crop from the bitmap reframes the artwork.
 *
 * The countdown ticks. The design's deadlines are already past and a static export freezes any
 * build-time clock, so `nextCountdownEnd` rolls a past deadline forward in 24h periods — without
 * it every card reads `00:00:00` forever, which is exactly what shipped in the predecessor
 * project. `<time dateTime>` carries the rolled-forward instant, so the machine-readable value is
 * never a date in the past either.
 */
export function TournamentCard({ tournament, from }: TournamentCardProps) {
  const [now, setNow] = useState(from)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const { hours, minutes, seconds } = formatCountdown(tournament.endsAt, now)

  return (
    <article className="relative h-[220px] w-full overflow-hidden rounded-xl border border-on-dark-08 bg-card-dark">
      <Icon
        src={TOURNAMENT_ART[tournament.art]}
        alt=""
        width={1573}
        height={478}
        className="absolute left-[-102.53%] top-[-28.18%] h-[128.21%] w-[273.72%] max-w-none"
      />

      <div className="absolute inset-0 p-[20px]">
        <div className="flex h-full w-[303px] flex-col justify-between">
          <div className="flex w-[190px] flex-col gap-[6px]">
            {/*
              One Figma text node holds two paragraphs — the name and the prize figure — at the
              same 28px Inter Bold. They are two elements here because they are two pieces of
              data; the shared type lives on the wrapper so they still render as one block.
              The string is stored mixed-case and capitalised in CSS, so a locale that does not
              uppercase the same way is not baked into the data.

              `title` therefore holds the NAME ONLY. It used to be the raw Figma string,
              `"СПІН-ЧЕЛЕНДЖ\n2000"`, with the prize left inside it — so the same 2000 was
              printed twice, once from the title and once from `prizeMinor`. At 190px that is
              `СПІН-` / `ЧЕЛЕНДЖ` / `2000` from the h3 plus a fourth line from the prize: 136px
              of type where 1:5232 measures 102 (04-casino-rows-c.md §3.1), which pushed the join
              pill to y 2801 against a card bottom of 2796 and clipped it off under
              `overflow-hidden`. Do not put a figure back into `title`.
            */}
            <div className="text-4xl font-bold uppercase tracking-title text-tournament-title">
              <h3>{tournament.title}</h3>
              <p>{formatUahWhole(tournament.prizeMinor)}</p>
            </div>
            <p className="text-sm font-medium text-on-dark">{tournament.subtitle}</p>
          </div>

          {/*
            The pill declares `padding: 6px 10px 6px 2px` but is 34 tall around a 30px button at
            y=2 — 6 + 30 + 6 = 42, so the declared block padding is not what the file draws.
            Centring a 30px button in a 34px pill reproduces the measured y=2 exactly.
          */}
          <div className="flex h-[34px] items-center gap-[8px] rounded-sm bg-join-pill pl-[2px] pr-[10px] backdrop-blur-[2px]">
            {/*
              30px is under the 44px target and the pill has no room to grow, so the hit area is
              extended with a transparent pseudo-element instead: 30 + 7 + 7 = 44, and not one
              drawn pixel moves.

              It has no target — the demo has no tournament flow — so it says so: `aria-disabled`
              and INERT, the same as the header's login buttons (Header.tsx:47). Until 2026-09-10
              it was the only Button in src with neither an onClick nor aria-disabled.
            */}
            <Button
              aria-disabled="true"
              className={`relative h-[30px] px-[16px] text-sm after:absolute after:inset-x-0 after:inset-y-[-7px] after:content-[''] ${INERT}`}
            >
              {/*
                The label's tracking is -0.26px (`tracking-join`), the shared cta skin carries
                -0.2px (`tracking-outfit`). A className override cannot win that: Tailwind emits
                utilities in alphabetical order, so `.tracking-outfit` is defined after
                `.tracking-join` and beats it at equal specificity no matter which order the two
                appear in the class attribute. Verified by compiling the sheet, not assumed. On a
                child element the measured value simply inherits down and applies.
              */}
              <span className="tracking-join">Приєднатися</span>
            </Button>
            <span aria-hidden className="h-[16px] border-l border-on-dark-10" />
            <span className="flex items-center gap-[4px]">
              <span className="text-6xs text-white/80">Залишилось часу</span>
              {/* `tabular-nums`: with proportional digits the pill's right edge moved every
                  second as a 1 replaced a 0. */}
              <time
                dateTime={countdownEndIso(tournament.endsAt, now)}
                className="text-5xs font-extrabold tabular-nums text-on-dark"
              >
                {hours}:{minutes}:{seconds}
              </time>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
