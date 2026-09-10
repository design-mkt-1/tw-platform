import { CHEVRON_RIGHT, SPORT_ICONS } from '@/lib/assets'
import { Icon } from '@/components/primitives/Icon'

/**
 * The "Майбутні Події" section header — node 1:6367, 358x30 at (16,16).
 *
 * It is deliberately NOT `casino/SectionHeader`. That component draws a dashed `#DCEBFF` rule
 * between the title and its right-hand control, because every casino section header carries a
 * `Vector 100` child. `1:6367` has no such child: it is a plain `justify-content: space-between`
 * with the title group at x=0 (156 wide) and the chip at x=268 (90 wide), 358 total and nothing
 * painted in between. Adding the rule here would be a rule the design does not have.
 *
 * Font note, measured: this chip's label `1:6379` is **Roboto** 12, while the identical-looking
 * "Всі ліги" chip `1:6086` is **Inter** 12. Same fill, same border, same 90x30, same radius,
 * padding, gap and text colour — one component, two fonts. The design is reproduced as measured
 * (Roboto here), and the inconsistency is 07-sport.md UNKNOWN #8.
 *
 * The horizontal gutter is the caller's, exactly as with `SectionHeader`: every section in this
 * design starts at x=16 and the page applies it once.
 */
export function UpcomingHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      {/* 1:6368 — gap 8, icon 22x22 then the title at x=30 (22 + 8). */}
      <div className="flex items-center gap-2">
        <Icon
          src={SPORT_ICONS.calendar}
          alt=""
          width={22}
          height={22}
          className="h-[22px] w-[22px]"
        />
        {/* 1:6377 — Roboto Medium 18, #07134F. Stored as the design writes it; no transform. */}
        <h2 className="whitespace-nowrap font-roboto text-section-title font-medium text-title">
          Майбутні Події
        </h2>
      </div>

      {/*
       * 1:6378. The chip has no href and no handler anywhere in the design, and this demo has no
       * "all events" route, so it announces itself as disabled rather than looking live and
       * swallowing a tap. Same reasoning, same shape and same skin classes as the casino see-all
       * pill in SectionHeader — copied rather than shared because Button's invented `active:scale`
       * pressed state would be a pressed animation on a control that does nothing.
       */}
      <button
        type="button"
        aria-disabled="true"
        className="inline-flex h-[30px] w-[90px] shrink-0 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-chip border border-chip bg-chip-link px-1 font-roboto text-xs text-link"
      >
        Всі події
        <Icon src={CHEVRON_RIGHT} alt="" width={14} height={14} className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
