import Image from 'next/image'

import { ButtonLink } from '@/components/primitives/Button'
import { SPORT_HERO, SPORT_HERO_GLOW } from '@/lib/assets'

/**
 * The sport welcome-bonus carousel — node 1:6027, 390x193.
 *
 * **Two slides ship, not four.** The design's track 1:6029 carries four: two WELCOME slides
 * (1:6030 and its byte-identical clone 1:6038) and then 1:6046 / 1:6064, which are casino
 * artwork — layer names `зевс` and `Gates of Olympus_Game Art…`, English copy, £ prices — parked
 * at x 704 and x 1066 where a 390px viewport never reaches them. They are Figma leftovers on a
 * Ukrainian sportsbook page. Their assets are on disk as `UNUSED_SPORT_SLIDES` so the decision
 * is reversible without another Figma call, and deliberately unreferenced here.
 *
 * The two that do ship are identical clones and both render slide A. Varying them would mean
 * writing a second Ukrainian bonus offer, which is invention, not measurement — the same call
 * HeroCarousel makes on the casino page. It is a question for the owner.
 *
 * **Scrolling is CSS.** `scroll-snap` on a native overflow scroller works with a finger on the
 * first paint, needs no state, no effect and no `'use client'`. The design has no pagination
 * dots anywhere in the subtree, so none are drawn.
 *
 * Two font substitutions apply, both recorded in docs/tokens.md §4.1: the badge is Archivo
 * Narrow and the headline Big Shoulders Display in the design, and NEITHER has a Cyrillic
 * subset — Archivo Narrow ships latin only, Big Shoulders Display is not in Next's catalogue at
 * all. Both strings are Cyrillic, so Figma was already falling back when it rendered this frame.
 * The badge uses `font-sans` and the headline `font-outfit` (which resolves to Inter).
 */

function Slide() {
  return (
    <>
      {/*
       * Photo 1:6031. Figma reports the post-rotation bounding box (612.783x466.18 at
       * -184.5,-186.83) wrapping a 542.3x314.449 image turned 17.94deg. Rotation preserves the
       * centre, so the image is placed by its own box at the same centre: 612.783/2 - 184.5
       * = 121.8915 across, 466.18/2 - 186.83 = 46.26 down, minus half the un-rotated size.
       *
       * `max-w-none` is required — Tailwind's preflight caps every img at max-width:100%, and a
       * max-width beats a width regardless of class order.
       */}
      <Image
        src={SPORT_HERO}
        alt=""
        width={542}
        height={314}
        priority
        unoptimized
        className="pointer-events-none absolute -left-[calc(var(--dp)*149.259)] -top-[calc(var(--dp)*110.964)] h-[calc(var(--dp)*314.449)] w-[calc(var(--dp)*542.3)] max-w-none rotate-[17.94deg]"
      />

      {/*
       * Glow 1:6032 — a white ellipse under a 50px Gaussian blur, which is what lifts the left
       * third of the photo behind the copy. The exported SVG is 427x355: the ellipse's own
       * 227x155 box plus the blur's bleed (inset -44.05% -64.52%). Figma rotates it 90deg to
       * stand it upright, so the file is placed centred on the ellipse's centre — 12 + 155/2
       * = 89.5 across, and 50% + 8.5 = 93.5 down — and turned a quarter.
       */}
      <Image
        src={SPORT_HERO_GLOW}
        alt=""
        width={427}
        height={355}
        unoptimized
        className="pointer-events-none absolute -left-[calc(var(--dp)*124)] -top-[calc(var(--dp)*84)] h-[calc(var(--dp)*355)] w-[calc(var(--dp)*427)] max-w-none rotate-90"
      />

      {/*
       * Badge 1:6033. Stored lowercase, rendered uppercase — docs/tokens.md §4.4.
       *
       * The design's 124px width is not forced: Archivo Narrow is narrower than the Inter this
       * ships, so pinning 124 would clip the string. The measured height, padding, radius,
       * blur and hairline border are all reproduced exactly.
       */}
      <p className="absolute left-[calc(var(--dp)*20.5)] top-[calc(var(--dp)*18)] inline-flex h-[calc(var(--dp)*20.494)] items-center rounded-pill border-[length:calc(var(--dp)*0.854)] border-on-dark-09 bg-sport-badge px-[calc(var(--dp)*13.663)] font-sans text-[length:calc(var(--dp)*10)] font-semibold uppercase leading-[normal] text-banner-badge backdrop-blur-[calc(var(--dp)*8.539)]">
        вітальний бонус
      </p>

      {/*
       * Offer 1:6035 — one paragraph, four spans, three sizes, all Black 900 and uppercase.
       *
       * Span 2 in the design is a lone space set at 61.464px whose only job is to force the wrap
       * after `ДО `. A `<br>` does that job in a font whose metrics are not Big Shoulders
       * Display's; carrying the 61.464px spacer into Inter wraps in the wrong place. The three
       * real spans, their sizes and the literal strings (`ДО ` keeps its trailing space) are
       * unchanged, and the authored 98px box is dropped for the same reason HeroCarousel drops
       * its 131 — it describes a font this build cannot load.
       */}
      <p className="absolute left-[calc(var(--dp)*20.5)] top-[calc(var(--dp)*69)] w-max -translate-y-1/2 font-outfit font-black uppercase leading-none -tracking-[calc(var(--dp)*1.2293)] text-banner-offer">
        <span className="text-[length:calc(var(--dp)*29.4)]">225%</span>{' '}
        <span className="text-[length:calc(var(--dp)*14.7)]">{'ДО '}</span>
        <br />
        <span className="text-[length:calc(var(--dp)*29.4)]">15000 ₴</span>
      </p>

      {/*
       * CTA 1:6036 — 28 tall, the same primary-button recipe as the header register button, and
       * the only differences are Bold rather than SemiBold and `text-transform: uppercase`.
       *
       * `!font-bold` is not decoration: the `cta` variant sets `font-semibold`, Tailwind emits
       * `.font-semibold` after `.font-bold`, so a plain `font-bold` loses the cascade wherever
       * it sits in the class string. The 28px box ships as drawn; an invisible `after:` layer
       * extends it to 44 tall at every slide width — `inset-y: 14/340 of the slide − 22px` is
       * −8px at 340 (96.5 x 44 at 390) and −9.24px at 310 (360), where the drawn box is 25.5.
       * It stays inside the slide at both (127 − 8 = 119, 155 + 8 = 163 of 170). It does not
       * grow sideways: review.mjs Guard 2 counts a bleed past the right edge as horizontal
       * overflow.
       *
       * Radius and tracking override the `cta` recipe with `!` so they scale with the slide
       * like every other drawn px here; at 340 they resolve to the recipe's own 6px / -0.2px.
       */}
      <ButtonLink
        href="/deposit"
        className="absolute left-[calc(var(--dp)*20.5)] top-[calc(var(--dp)*127)] h-[calc(var(--dp)*28)] !rounded-[calc(var(--dp)*6)] px-[calc(var(--dp)*16)] text-[length:calc(var(--dp)*13)] uppercase leading-[normal] !font-bold !-tracking-[calc(var(--dp)*0.2)] after:absolute after:inset-x-0 after:inset-y-[calc(var(--dp)*14-22px)] after:content-['']"
      >
        Депозит
      </ButtonLink>
    </>
  )
}

export function BonusCarousel() {
  return (
    /*
     * 1:6027 is 193 tall around a 172-tall clip (1:6028) — 10.5 above and below — and the clip is
     * 1px taller than the slide on each side. Both are padding rather than fixed heights so the
     * band grows with the slide above 390 and still sums to 193 / 172 at 390.
     */
    <section className="flex w-full py-[10.5px]">
      {/*
       * `tabIndex` is what makes a scroll container reachable without a pointer. The label is
       * not in the design — the frame is named "Frame 2135557699" — so it is written here and
       * flagged for the owner; it reuses the casino hero's string rather than minting a second.
       *
       * The trailing 34px is derived: slide 2 starts at x 360 and its snap point is scroll 344,
       * which needs 734px of content to be reachable (16 + 340 + 4 + 340 + 34). A mandatory
       * snap point past the end of the scroll range is how a carousel ends up with an
       * unreachable second slide. It holds at every width: with the slide at `w`, the scroll
       * range is 16 + 2w + 4 + 34 − (w + 50) = w + 4, exactly slide 2's snap point.
       *
       * `w-full` is load-bearing: the slides are sized in % of this list's content box, so the
       * list must take the band's width rather than its own content's.
       */}
      <ul
        tabIndex={0}
        aria-label="Акційні пропозиції"
        className="scrollbar-none flex w-full snap-x snap-mandatory gap-1 overflow-x-auto scroll-pl-gutter py-px pl-gutter pr-[34px]"
      >
        {[0, 1].map((index) => (
          /*
           * 340x170 at 390, fluid above and below: the list's content box is the page minus 16 + 34,
           * so `100%` is 340 at 390 and every width keeps the 30px peek of slide 2. The slide is
           * the size container for its artwork, and `--dp` is one design px of it
           * (`100cqw / 340`): each drawn px inside is `calc(var(--dp) * px)`, exactly the design's
           * px at 340. It is a variable rather than a literal `calc(100cqw * px / 340)` because the
           * CSS minifier folds the literal to six digits (`20.5/340` → `6.02941cqw` = 20.49999px)
           * and layout floors that to the 1/64 grid: 20.484, a measured pixel diff at 390. The
           * corner radius stays 12: `cqw` on the container itself resolves against an ancestor.
           */
          <li
            key={index}
            className="relative aspect-[340/170] w-full shrink-0 snap-start overflow-hidden rounded-slide bg-slide [container-type:inline-size] [--dp:calc(100cqw/340)]"
          >
            <Slide />
          </li>
        ))}
      </ul>
    </section>
  )
}
