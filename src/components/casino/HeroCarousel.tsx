import Image from 'next/image'

import { ButtonLink } from '@/components/primitives/Button'
import { HERO_CASINO } from '@/lib/assets'

/**
 * The casino hero — node 1:3302.
 *
 * It is a carousel, not a banner: a 718px track inside a 390px clip, slides 340x170 with a 4px
 * gap and a 16px left inset, so the next slide peeks in by exactly 30px (390 − 360).
 *
 * **Scrolling is CSS, not JavaScript.** `scroll-snap` on a native overflow scroller works with a
 * finger on the first paint, needs no state, no effect and no `'use client'`, and it degrades to
 * a plain scroller under `prefers-reduced-motion` instead of fighting it. A JS carousel here
 * would buy nothing the design asks for.
 *
 * **Both slides are built from slide A.** The design authors two (`1:3306`, `1:3318`) carrying
 * byte-identical copy at slightly different metrics — B's CTA is 123x28 at 10px uppercase where
 * A's is 130x28 at 12px capitalize, B's badge is 189.906 wide against A's 178, B's title sits at
 * y 64 against A's 58. B reads as an un-normalised duplicate of A rather than a second offer, so
 * A is treated as canonical and rendered twice. Whether slide B should carry a different promo is
 * a question for the owner — inventing a second Ukrainian offer is not something this build does.
 */

/**
 * Indicator `1:3330` — four bars, not dots: 4px tall, radius 2, 4px gap, right-aligned, widths
 * 40/24/16/8 in `--dot-1`..`--dot-4`.
 *
 * There are four bars over two slides and nothing in the file says which one means "current":
 * the widths shrink monotonically and every bar has a different colour, which is not how an
 * active/inactive pair reads. So this ships static, exactly as drawn, and is hidden from
 * assistive tech — an invented active-bar rule would be a guess painted onto a measurement.
 */
const INDICATOR_BARS = ['w-10 bg-dot-1', 'w-6 bg-dot-2', 'w-4 bg-dot-3', 'w-2 bg-dot-4']

/** Slide A, `1:3306`. Every string below is copied character for character from the design. */
function Slide() {
  return (
    <>
      {/*
       * The artwork is placed at 205.88% x 127.65% with offsets −75.88% / −20.59% against the
       * 340x170 slide — the measured framing (700x217 at −258,−35). `max-w-none` is required:
       * Tailwind's preflight caps every img at `max-width: 100%`, which would clamp the 205.88%
       * regardless of class order, since a max-width always beats a width.
       */}
      <Image
        src={HERO_CASINO}
        alt=""
        width={700}
        height={217}
        priority
        unoptimized
        className="pointer-events-none absolute left-[-75.88%] top-[-20.59%] h-[127.65%] w-[205.88%] max-w-none"
      />

      {/* Promo badge 1:3310. Stored lowercase, rendered uppercase — see docs/tokens.md §4.4. */}
      <p className="absolute left-[16.5px] top-[18px] w-[178px] rounded-full border-[0.553px] border-promo bg-promo-badge px-1 py-[4.424px] text-center font-outfit font-extrabold uppercase tracking-promo text-promo shadow-promo-badge">
        <span className="text-7xs">{'✦ '}</span>
        <span className="text-6xs">вітальний пакет казіно</span>
        <span className="text-7xs">{' ✦'}</span>
      </p>

      {/*
       * Title block 1:3312 — 8px column, so the wager badge lands at y 27 without a second offset.
       *
       * The node is 131px wide in Figma and the title is NOT constrained to it here, on purpose.
       * Figma draws "₴250.000 + 250 FS" on one line inside that 131 because it sets the string in
       * Outfit, which is narrower. Outfit has no Cyrillic subset, so this build renders Inter
       * (docs/tokens.md §4.1) — and the same string in Inter is about 159px, which wrapped and
       * dropped "+ 250 FS" on top of the gold coin in the artwork. `w-max` plus nowrap reproduces
       * what the design LOOKS like rather than the box it was authored in.
       */}
      <div className="absolute left-[16.5px] top-[58px] flex w-max flex-col items-start gap-2">
        <p className="flex gap-0.5 whitespace-nowrap font-outfit text-md font-bold uppercase text-on-dark">
          <span>₴250.000</span>
          <span>+ 250 fS</span>
        </p>
        <span className="rounded-wager bg-wager-badge px-[4.424px] py-[1.659px] font-sans text-6xs font-bold uppercase tracking-wager text-promo">
          20X WAGER
        </span>
      </div>

      {/*
       * CTA 1:3308 — 130x28. The design draws a 28px target, which is under the 44px minimum;
       * growing it would move the slide's whole layout, so it ships as drawn and the failure is
       * reported with the other accessibility findings rather than silently redesigned.
       *
       * `!font-bold` is not decoration. The `cta` variant sets `font-semibold` and this node is
       * Bold 700 (docs/tokens.md §4.3 step 44). Tailwind emits `.font-semibold` *after*
       * `.font-bold`, so a plain `font-bold` here loses the cascade no matter where it sits in
       * the class string — checked against the compiled stylesheet, not assumed.
       */}
      <ButtonLink
        href="/promo"
        className="absolute left-[17px] top-[121px] h-[28px] w-[130px] text-xs !font-bold capitalize"
      >
        отримати бонус
      </ButtonLink>
    </>
  )
}

export function HeroCarousel() {
  return (
    <section className="flex w-full flex-col gap-gutter pb-gutter pt-6">
      {/*
       * `tabIndex` is what makes a scroll container reachable without a pointer; a scroller that
       * only a finger can move is unusable from a keyboard. The label is not in the design — the
       * frame is named "Frame 2135557699" — so it is written here and flagged for the owner.
       *
       * The trailing 34px is derived, not measured: slide B starts at x 360 and its snap point is
       * scroll 344, which needs 734px of content to be reachable (16 + 340 + 4 + 340 + 34). With
       * only a 16px trailing pad the content is 716 and that snap point sits past the end of the
       * scroll range — a mandatory snap point the scroller cannot reach is how a carousel ends up
       * with an unreachable second slide. The design's own 718px track has the same shortfall and
       * would rest slide B at a 32px inset; this rests it at 16, matching slide A.
       */}
      <ul
        tabIndex={0}
        aria-label="Акційні пропозиції"
        className="scrollbar-none flex h-[172px] snap-x snap-mandatory items-center gap-1 overflow-x-auto scroll-pl-gutter pl-gutter pr-[34px]"
      >
        {[0, 1].map((index) => (
          <li
            key={index}
            className="relative h-[170px] w-[340px] shrink-0 snap-start overflow-hidden rounded-slide bg-slide"
          >
            <Slide />
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="mx-auto flex w-[358px] justify-end gap-1 px-gutter">
        {INDICATOR_BARS.map((bar) => (
          <span key={bar} className={`h-1 rounded-hairline ${bar}`} />
        ))}
      </div>
    </section>
  )
}
