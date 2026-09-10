import { SPORT_ICONS } from '@/lib/assets'
import { Icon } from '@/components/primitives/Icon'
import { MatchRow } from './MatchRow'
import type { League } from '@/lib/types'

/**
 * One league card — node 1:6383 (and its byte-identical twin 1:6433).
 *
 * 358 wide, white, radius 20, `0 6px 18px rgba(23,69,143,.08)`, `flex-direction: column`,
 * `gap: 2px`, `overflow: clip`. The design's 196px height is 32 + 2 + 80 + 2 + 80, i.e. exactly
 * two match rows — so it is not set here. `1:6383` and `1:6433` are the same fixture twice
 * (07-sport.md UNKNOWN #11), which is what placeholder content looks like, not evidence that a
 * league card holds two matches.
 *
 * The header band's five slots sit on one uniform 8px gap, confirmed against the measured x's:
 * 12 (padding) + 16 + 8 = 36 for the sport name, + 48 + 8 = 92 for the dash, + 6 + 8 = 106 for the
 * emblem, + 12 + 8 = 126 for the league name.
 *
 * Server component: it holds nothing and does nothing. Only MatchRow crosses into the browser.
 */
export function LeagueCard({ league }: { league: League }) {
  return (
    <article className="flex flex-col gap-0.5 overflow-hidden rounded-league-card bg-surface shadow-card">
      {/* 1:6384 — 32 tall, #E8F1FC, padding 8px 12px, gap 8. */}
      <div className="flex items-center gap-2 bg-tint px-3 py-2">
        <Icon
          src={SPORT_ICONS[league.sport]}
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 shrink-0"
        />

        {/* 1:6387 — Roboto 14, #191970. The one place on this page besides the balance chip where
            the named Navy variable actually paints something. */}
        <span className="shrink-0 whitespace-nowrap font-roboto text-base text-navy">
          {league.sportLabel}
        </span>

        {/* 1:6388 `–` U+2013 EN DASH and 1:6389 `♕` U+2655, both Inter 12 #758098. The crown is a
            text glyph, not an icon — there is nothing to export and nothing to colour. */}
        <span aria-hidden="true" className="shrink-0 font-sans text-xs text-meta">
          –
        </span>
        <span aria-hidden="true" className="shrink-0 font-sans text-xs text-meta">
          ♕
        </span>

        {/* 1:6390 — Roboto 14, #758098, flex: 1 0 0. Different colour from the sport name beside
            it, in the same row, on purpose. */}
        <h3 className="min-w-0 flex-1 truncate font-roboto text-base font-normal text-meta">
          {league.name}
        </h3>
      </div>

      {/* A real list: a screen reader then says how many fixtures this card holds before reading
          any of them. The card's own 2px gap is what separates the rows, so it lives here too. */}
      <ul className="flex flex-col gap-0.5">
        {league.matches.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </ul>
    </article>
  )
}
