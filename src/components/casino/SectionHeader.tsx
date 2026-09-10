import { CHEVRON_RIGHT, SECTION_ICONS, type SectionIconName } from '@/lib/assets'
import { Icon } from '@/components/primitives/Icon'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  /** Stored as the design writes it. Any capitalisation is CSS, never baked into the string. */
  title: string
  icon?: SectionIconName
  /** The design's literal `Всі (120) `, trailing space included. Omit to draw no pill. */
  seeAllLabel?: string
  /**
   * Replaces the see-all pill. The provider row (1:3762) puts a 40x40 search button here and is
   * measured at `gap: 4px` rather than 8 — that caller passes `className="gap-1"`.
   */
  children?: ReactNode
  className?: string
}

/**
 * The row header, shared by every content section — 1:3414, 1:3588, 1:3762, 1:3964, 1:4140,
 * 1:4340, 1:4545, 1:4714, 1:4888, 1:5072, 1:5240, 1:5417.
 *
 * Height is content-driven on purpose. The title group is 24 tall, the see-all pill 30, the
 * provider row's search button 40 — and the design's three measured header heights are exactly
 * 24, 30 and 40. Nothing here hard-codes them.
 *
 * The rule between title and control is a 1px `#DCEBFF` dash, `stroke-dasharray: 2 2` in the
 * exported `Vector 100` asset. `border-top: 1px dashed` reproduces it, so no asset ships
 * (docs/tokens.md §3.4).
 */
export function SectionHeader({
  title,
  icon,
  seeAllLabel,
  children,
  className,
}: SectionHeaderProps) {
  return (
    <div className={['flex w-full items-center gap-2', className].filter(Boolean).join(' ')}>
      <div className="flex h-6 items-center gap-2">
        {icon ? (
          // The #92BDF3 (icon-section) is baked into every exported SVG's own `fill`, so the
          // glyph needs no colour class. Icons are 20 tall and 14.032-21 wide; `w-auto` keeps
          // each one's aspect, which matters because the exports carry
          // preserveAspectRatio="none" and would stretch inside a forced square.
          <Icon src={SECTION_ICONS[icon]} alt="" width={20} height={20} className="h-5 w-auto" />
        ) : null}
        <h2 className="whitespace-nowrap font-roboto text-section-title font-medium text-title">
          {title}
        </h2>
      </div>

      <span aria-hidden="true" className="h-0 min-w-px flex-1 border-t border-dashed border-divider" />

      {children ??
        (seeAllLabel ? (
          /*
           * The pill has no href and no handler anywhere in the design — not on any of the five
           * instances. `aria-disabled` says so out loud rather than drawing a live-looking
           * control that swallows a tap. It stays focusable so the state is discoverable.
           *
           * Deliberately not the Button primitive: Button carries the invented `active:scale`
           * pressed state, and a pressed animation on a control that does nothing is exactly the
           * affordance-without-behaviour this is avoiding. The four skin classes are the ghost
           * variant's, copied rather than inherited for that one reason.
           */
          <button
            type="button"
            aria-disabled="true"
            className="inline-flex h-[30px] w-[90px] shrink-0 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-chip border border-chip bg-chip-link px-1 font-roboto text-xs text-link"
          >
            {seeAllLabel}
            <Icon src={CHEVRON_RIGHT} alt="" width={14} height={14} className="h-3.5 w-3.5" />
          </button>
        ) : null)}
    </div>
  )
}
