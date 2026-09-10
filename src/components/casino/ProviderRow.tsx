import { Icon } from '@/components/primitives/Icon'
import { PROVIDER_LOGOS } from '@/lib/assets'
import type { Provider } from '@/lib/types'

/**
 * The provider strip, node `1:3762` → track `1:3785`.
 *
 * Geometry, all measured (docs/tokens.md §5.3, 22-gap-gamecard-providers.md §4):
 * an 80 × 96 cell holding a 72px white circle with `--shadow-provider`
 * (`0 6px 9px rgba(23,69,143,0.08)` — blue-tinted, not black) and no border.
 *
 * The circle is modelled as "72 centred in 80 × 96", not as the `x=4` the file reports. That 4 is
 * a consequence: the badge declares `p-12`, its content box is 56 wide, and the 72px circle
 * overflows it evenly (12 + 28 − 36 = 4). Centring reproduces the same pixels and survives a
 * change of cell width; hard-coding 4 does not.
 *
 * Five badges total 400 in a 358 wrapper, so the track overflows by 42 and scrolls. Figma
 * declares the track `w-[420px]` with five 80px children and no padding — an over-declared fixed
 * width, so the width here is content-driven and the 420 is dropped.
 *
 * `tabIndex={0}` is not decoration: a scroll container that only responds to touch and mouse is
 * an axe `scrollable-region-focusable` violation at serious level, which fails
 * `scripts/a11y.mjs` and therefore the deploy.
 */
export function ProviderRow({ providers }: { providers: Provider[] }) {
  return (
    <ul tabIndex={0} className="scrollbar-none flex overflow-x-auto">
      {providers.map((provider) => (
        <li
          key={provider.id}
          className="flex h-[96px] w-[80px] shrink-0 items-center justify-center"
        >
          <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-surface shadow-provider">
            {/* The logo is the brand name, so it carries it as text rather than being decorative. */}
            <Icon src={PROVIDER_LOGOS[provider.id]} alt={provider.name} width={44} height={44} />
          </span>
        </li>
      ))}
    </ul>
  )
}
