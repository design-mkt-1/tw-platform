import { GAME_ART } from '@/lib/assets'
import { Icon } from '@/components/primitives/Icon'
import type { Game } from '@/lib/types'

/**
 * Three navy gradients for games with no artwork. Deliberately all dark: the title is drawn on
 * top in white, and this tile is invented — it has no design to defer to, so it gets to be
 * readable. Every stop is a token from tailwind.config.ts; nothing here is a colour decision
 * about the design itself.
 */
const FALLBACK_GRADIENTS = [
  'from-title to-dot-1',
  'from-footer to-navy',
  'from-card-dark to-title',
] as const

/** Stable across server and client, and stable across builds — it is only the slug's bytes. */
function gradientFor(slug: string): string {
  let sum = 0
  for (let i = 0; i < slug.length; i += 1) sum += slug.charCodeAt(i)
  return FALLBACK_GRADIENTS[sum % FALLBACK_GRADIENTS.length]
}

/**
 * One game tile — 1:3575 and its 47 siblings. 114x148, radius 15.
 *
 * **The card is flat.** No shadow, no overlay, background `rgba(240,243,255,0)`. The wrapper is
 * named `Overlay+Shadow` in Figma and the name is stale intent: a 157px column scan down the 8px
 * gutter between two cards returned one unbroken run of the page colour, and the same tool call
 * *did* emit a `drop-shadow` for the provider circle. Do not add one.
 *
 * The radius is 15, not the 11 a first-non-background-pixel trace suggests — near the top of the
 * arc the curve is nearly tangent, so one row shows a long coverage ramp. See docs/tokens.md §5.1.
 *
 * It is an `<article>`, not a link. This demo has no game pages, and a link to nowhere is worse
 * than no link at all. So it has no pressed state either: until 2026-09-10 it squashed on press
 * like a Button and did nothing, 48 times on the page, which reads as a control that failed.
 *
 * **Width is the grid track's, not a constant.** GameGrid sizes its columns as a third of the
 * content column and the 114:148 aspect gives the height. At 390 the column is 358, so the card
 * is exactly 114 x 148 as drawn; at 375 it is 109 wide instead of cutting the third card 15px
 * short, and at 480 it is 144 x 187 instead of leaving a 90px strip (all measured).
 */
export function GameCard({ game }: { game: Game }) {
  return (
    <article className="aspect-[114/148] w-full overflow-hidden rounded-card bg-game-card">
      {game.art ? (
        // Icon is the project's single next/image wrapper — it is where `unoptimized` lives, and
        // the static export has no optimiser. Reused here rather than adding a second call site
        // that could quietly ask for one. The design fits the bitmap at height 100.75% with a
        // -0.37% top offset, which is `object-cover`, centred.
        <Icon
          src={GAME_ART[game.art]}
          alt={game.title}
          width={114}
          height={148}
          className="h-full w-full object-cover"
        />
      ) : (
        /*
         * Only three games in the catalogue carry artwork. In the design the title is baked into
         * the bitmap and the card has no text node at all, so a card with neither art nor text
         * would ship as a blank rectangle. This draws the title instead.
         */
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br p-3 ${gradientFor(game.slug)}`}
        >
          <p className="text-balance break-words text-center font-roboto text-base font-medium leading-tight text-on-dark">
            {game.title}
          </p>
        </div>
      )}
    </article>
  )
}
