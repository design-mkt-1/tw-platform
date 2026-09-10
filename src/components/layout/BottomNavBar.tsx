'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/primitives/Icon'
import { NAV_BURGER, NAV_CENTER_BUTTON, NAV_PLATE, NAV_TABS } from '@/lib/assets'
import { useAppStore } from '@/store/useAppStore'

/**
 * The bottom navigation, node 1:6489. Read docs/tokens.md §5.2 before changing any number here.
 *
 * The three things this component exists to get right, all of which a "bar with a button on
 * top" implementation loses:
 *
 * 1. It is a PLATE WITH A HOLE IN IT. The plate (1:6490) is 390x68 with a 78.07px notch cut
 *    25px into its top edge, and between that notch and the raised button there is a ~6px
 *    TRANSPARENT ring the page scrolls behind. It also carries a 1px rim that runs from opaque
 *    white at the bar's top edge to nothing at its bottom, following the notch. A rounded rect
 *    fills the ring in and loses the rim, so the plate ships as the exported SVG (NAV_PLATE).
 * 2. NO `overflow: hidden`, anywhere on this subtree. The raised button's glow is thrown
 *    41.67px straight down with a 30.12px blur — it needs ~72px of room below the button and
 *    ~30px each side, and it spills past the bottom of the 111-tall frame. The glow is baked
 *    into NAV_CENTER_BUTTON, whose SVG box (123.891 x 131.535) is deliberately larger than the
 *    63.653 x 58.917 button it draws.
 * 3. THE CENTRE CLUSTER SITS 7.17px LEFT OF CENTRE and that is not a bug. The button container
 *    is at x=156 (centre 187.83), the notch was cut at 187.84 in a separate exported vector,
 *    the burger sits at 187.72 and the Меню label at 188, while the four flanking tabs are
 *    symmetric about 195. Moving the button to 195 without re-cutting the notch by the same
 *    amount makes the ring lopsided by 7px on a 6px gap: the button would touch the notch on
 *    one side and show a 13px hole on the other.
 *
 * Every glyph in the design is a single flat fill — the Sport export just has #FFB095 baked in
 * where the other three have white — so the tabs draw their glyph as a CSS mask painted with
 * `currentColor`. One asset covers both states, and the active states of the other three tabs,
 * which do not exist anywhere in the Figma file, fall out for free.
 */

interface Tab {
  href: string
  label: string
  icon: string
  /** Live casino's glyph is 19 wide where the other three are 24. Measured, not a rounding. */
  iconWidth: number
}

const TABS: Tab[] = [
  { href: '/', label: 'Казіно', icon: NAV_TABS.casino, iconWidth: 24 },
  { href: '/sport', label: 'Спорт', icon: NAV_TABS.sport, iconWidth: 24 },
  { href: '/live-casino', label: 'Лайв казіно', icon: NAV_TABS.liveCasino, iconWidth: 19 },
  { href: '/promo', label: 'Промо', icon: NAV_TABS.promo, iconWidth: 24 },
]

/** The only two routes this demo has. A <Link> to any other href must not prefetch a 404. */
const REAL_ROUTES = new Set(['/', '/sport'])

function TabGlyph({ src, width }: { src: string; width: number }) {
  return (
    <span
      aria-hidden
      className="block h-[24px] shrink-0"
      style={{
        width,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    />
  )
}

function TabItem({ tab, active }: { tab: Tab; active: boolean }) {
  return (
    <Link
      href={tab.href}
      prefetch={REAL_ROUTES.has(tab.href) ? undefined : false}
      aria-current={active ? 'page' : undefined}
      className={`relative flex h-[41px] w-[70px] flex-col items-center justify-start gap-[2px] ${
        active ? 'text-nav-active' : 'text-on-dark'
      }`}
    >
      <TabGlyph src={tab.icon} width={tab.iconWidth} />
      <span className="text-center font-roboto text-nav-label font-medium">{tab.label}</span>

      {/* The design's tab is 41 tall. This grows the pressable box to 44 without moving a
          pixel of the artwork — it is a transparent overlay, not a change of layout. */}
      <span aria-hidden className="absolute inset-x-0 bottom-[-1.5px] top-[-1.5px]" />

      {/* 1:6516 — a 4x4 dot, 3px under the label row, on the tab's own centre. */}
      {active ? (
        <span
          aria-hidden
          className="absolute left-[33px] top-[44px] h-1 w-1 rounded-full bg-hot"
        />
      ) : null}
    </Link>
  )
}

export function BottomNavBar() {
  const pathname = usePathname()
  const panel = useAppStore((state) => state.panel)
  const openPanel = useAppStore((state) => state.openPanel)

  return (
    // 111 tall: the bottom 68 are the painted plate, the top 43 exist only so the raised button
    // has somewhere to stick out. That upper band is transparent, so the frame passes pointer
    // events through and each interactive child takes them back.
    <nav
      className="pointer-events-none fixed inset-x-0 z-40 mx-auto h-nav-frame w-[390px]"
      style={{ bottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* The plate is glass: Navy at 80% over a 2.5px backdrop blur. The blur has to be a real
          element — a backdrop-filter inside an SVG loaded as an image never sees the page — and
          it is masked with the plate artwork so the notch cut-out stays sharp, as measured. */}
      <span
        aria-hidden
        className="absolute left-[-0.5px] top-[42.5px] h-[69px] w-[391px] backdrop-blur-[2.5px]"
        style={{
          WebkitMaskImage: `url(${NAV_PLATE})`,
          maskImage: `url(${NAV_PLATE})`,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      />
      {/* 391x69 at (-0.5, 42.5): the export carries 0.5px of stroke bleed on every side of the
          390x68 plate, so it is offset by half a pixel rather than scaled to fit.
          `max-w-none` is load-bearing, and its absence was a defect until 2026-09-12: Tailwind's
          preflight sets `img { max-width: 100% }`, so a 391px plate inside a 390px shell resolved
          to a computed width of exactly 390px — measured, not inferred. The left offset still
          took its half pixel and the right edge lost one, so the compensation only worked on one
          side. BonusCarousel.tsx:66 already carried this class for the same reason. */}
      <Icon
        src={NAV_PLATE}
        alt=""
        width={391}
        height={69}
        className="pointer-events-auto absolute left-[-0.5px] top-[42.5px] h-[69px] w-[391px] max-w-none"
        priority
      />

      {/* 1:6494 — x 7, y 55, 376x41, two groups of two 70px tabs with a 96px well between them
          for the raised button. */}
      <div className="pointer-events-auto absolute left-[7px] top-[55px] flex h-[41px] w-[376px] justify-between">
        <div className="flex w-[140px]">
          {TABS.slice(0, 2).map((tab) => (
            <TabItem key={tab.href} tab={tab} active={pathname === tab.href} />
          ))}
        </div>
        <div className="flex w-[140px] justify-end">
          {TABS.slice(2).map((tab) => (
            <TabItem key={tab.href} tab={tab} active={pathname === tab.href} />
          ))}
        </div>
      </div>

      {/* The centre cluster, nudged as one unit: x 156, button y 3..61.92, Меню label y 81..96.
          One control covers both, so the label is the button's accessible name and the pressable
          box is 63.65 x 93. */}
      <button
        type="button"
        onClick={() => openPanel('menu')}
        aria-haspopup="dialog"
        aria-expanded={panel === 'menu'}
        className="pointer-events-auto absolute left-[156px] top-[3px] h-[93px] w-[63.653px] transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100"
      >
        {/* The button artwork and its glow, one asset. Offset by the glow's own bleed:
            -30.12px each side, -0.83px on top, +71.79px below.

            `pointer-events-none` because this span is 123.891 x 131.535 inside a button that is
            63.653 x 93, and a child of a `pointer-events-auto` control inherits its events. Without
            it the glow presents a hit box nearly four times the control: it reached the top of the
            111px frame and swallowed the last odds cell on /sport at full scroll, plus four footer
            links and part of the provider scroller on /. Decorative artwork that overflows its box
            is a class — HeroCarousel.tsx:53 and BonusCarousel.tsx:50 / :66 are the same shape and
            all three already carry this. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-[-30.12px] top-[-0.83px] block h-[131.535px] w-[123.891px]"
          style={{
            backgroundImage: `url(${NAV_CENTER_BUTTON})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* 1:6520 — 20x18, three 20x2 bars on an 8px pitch, centred on (187.72, 32). */}
        <Icon
          src={NAV_BURGER}
          alt=""
          width={20}
          height={18}
          className="absolute left-[21.72px] top-[20px] h-[18px] w-[20px]"
        />
        <span className="absolute left-0 top-[78px] block w-full text-center font-roboto text-nav-label font-medium text-on-dark">
          Меню
        </span>
      </button>
    </nav>
  )
}
