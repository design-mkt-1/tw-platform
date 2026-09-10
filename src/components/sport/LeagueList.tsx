'use client'

import { LEAGUES } from '@/lib/data'
import { LeagueCard } from './LeagueCard'
import { useSportFilter } from './SportFilterRow'

/**
 * The card stack `1:6382` — the leagues of the sport selected in `SportFilterRow`. Owner's
 * decision of 2026-09-10: Футбол and Баскетбол filter by the `sport` field of `leagues.json`
 * (4 and 1 leagues); a pill with no league is inert, so this list is never empty.
 *
 * 20px between the cards — the gap `1:6382` carries (see sport/page.tsx).
 */
export function LeagueList() {
  const sport = useSportFilter((state) => state.sport)

  return (
    <div className="flex flex-col gap-5">
      {LEAGUES.filter((league) => league.sport === sport).map((league) => (
        <LeagueCard key={league.id} league={league} />
      ))}
    </div>
  )
}
