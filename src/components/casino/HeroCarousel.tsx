'use client'

import Image from 'next/image'
import { useState, type UIEvent } from 'react'

import { ButtonLink } from '@/components/primitives/Button'
import { HERO_CASINO } from '@/lib/assets'

/**
 * The casino hero — node 1:3302.
 *
 * It is a carousel, not a banner: slides 340x170 at 390 with a 4px gap and a 16px left inset, so
 * the next slide peeks in by exactly 30px (390 − 360).
 *
 * **Fluid past 390, exact at 390.** A slide is the scroller's content box — the section less the
 * 16px inset and the 34px trailing pad, 340 at 390 — at the drawn 340/170 aspect. Each slide is
 * an inline-size container, `--dp` is one design px of it (`100cqw / 340`), and every drawn px
 * inside is `calc(var(--dp) * <px>)` — the design's own number at 390 and the same proportion at
 * every other width. It is the pattern BonusCarousel uses. The artwork was already placed in
 * percentages, so it scales by itself.
 *
 * The variable is not style: `calc(100cqw * 178 / 340)` written out gets folded to `52.3529cqw`,
 * which is 177.99999 at 390 and floors to 177.984 — measured here on the badge, and the same fold
 * made the title's 15px shape 3/64px narrow. `var(--dp)` resolves to exactly 1px at 390.
 * `leading-[normal]` is what the replaced `text-6xs` / `text-md` / `text-xs` tokens set; an
 * arbitrary size sets no line-height, and Tailwind's `leading-normal` is 1.5, not `normal`.
 *
 * **Scrolling is CSS.** `scroll-snap` on a native overflow scroller works with a finger on the
 * first paint and degrades to a plain scroller under `prefers-reduced-motion`. The only
 * JavaScript is one passive scroll listener that tells the indicator which slide is at rest.
 *
 * **All five slides are built from slide A.** The design authors two (`1:3306`, `1:3318`)
 * carrying byte-identical copy at slightly different metrics — B's CTA is 123x28 at 10px
 * uppercase where A's is 130x28 at 12px capitalize, B's badge is 189.906 wide against A's 178,
 * B's title sits at y 64 against A's 58. B reads as an un-normalised duplicate of A rather than a
 * second offer, so A is canonical. The owner asked for five slides on 2026-09-10 and accepted the
 * one offer repeated — inventing a second Ukrainian offer is not something this build does.
 */

/**
 * Indicator `1:3330` — bars, not dots: 4px tall, radius 2, 4px gap, right-aligned, drawn as
 * widths 40/24/16/8 in `--dot-1`..`--dot-4`.
 *
 * The file draws four static bars over two slides and says nothing about which is "current". The
 * owner's rule of 2026-09-10: one bar per slide, the active one takes the design's bar 1 and the
 * others step down through bars 2–4 by distance from it, 3 or more away taking bar 4. So at rest
 * on slide one the row reads exactly as drawn, plus a fifth bar-4.
 *
 * Still `aria-hidden`: the bars are not controls, and the slide a reader is on is already what
 * the scroller's own position says.
 */
const BAR_STYLES = ['w-10 bg-dot-1', 'w-6 bg-dot-2', 'w-4 bg-dot-3', 'w-2 bg-dot-4']
const SLIDES = [0, 1, 2, 3, 4]

/** Slide A, `1:3306`. Every string below is copied character for character from the design. */
function Slide({ first }: { first: boolean }) {
  return (
    <>
      {/*
       * Every `calc(var(--dp)*N)` below is the design's N px at 390 — see the file comment.
       *
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
        priority={first}
        unoptimized
        className="pointer-events-none absolute left-[-75.88%] top-[-20.59%] h-[127.65%] w-[205.88%] max-w-none"
      />

      {/*
       * Promo badge 1:3310. Stored lowercase, rendered uppercase — see docs/tokens.md §4.4.
       *
       * `whitespace-nowrap` is the same fix the title below carries, for the same reason. The
       * badge is authored 178 wide, which leaves a 168px content box after `px-1` and the
       * 0.553px border; the three spans need 169.98px on one line in Inter, measured with the
       * element forced to nowrap. Two pixels short, so it wrapped — and what wrapped was the
       * trailing `✦`, which landed at (102.06, 58.42), on top of the `250.000 + 250 FS`
       * headline, turning a 178x21.847 badge into 178x58.84.
       *
       * The 178 stays. Nothing here is `w-max`, because unlike the title this box is a drawn
       * surface: it has a fill, a border, a radius and a shadow, so its width is design and not
       * just a text bound. The 1.98px shortfall is absorbed by the padding instead — the text
       * is centred, so it takes 0.99px off each 4px pad and never reaches the border.
       *
       * `text-6xs` moved from the middle span onto the `<p>`, and that is the second half of the
       * same bug. The 10px is the node's own size and the two `✦` runs are the exception, so the
       * `<p>` carrying it is what the file says. It also matters to the box: with no size of its
       * own the paragraph inherited the page's 16px/24px, and a block's line box is at least as
       * tall as that strut whatever its inline children measure. So even unwrapped the badge came
       * out 34.84 tall against the drawn 21.847 — 24 for the strut instead of 12 for the text.
       *
       * Measured after the change: 178 x 22.84, one line box of 12. The remaining 0.89 against
       * Figma's 21.847 is not the type, it is the border — Chrome uses a whole pixel for a
       * declared 0.553px hairline, so the box carries 2px of border where the design counts
       * 1.106. Closing that gap would mean changing the border, which is drawn, so it stays.
       */}
      <p className="absolute left-[calc(var(--dp)*16.5)] top-[calc(var(--dp)*18)] w-[calc(var(--dp)*178)] whitespace-nowrap rounded-full border-[0.553px] border-promo bg-promo-badge px-[calc(var(--dp)*4)] py-[calc(var(--dp)*4.424)] text-center font-outfit text-[length:calc(var(--dp)*10)] font-extrabold uppercase leading-[normal] tracking-[calc(var(--dp)*0.5529)] text-promo shadow-promo-badge">
        <span className="text-[length:calc(var(--dp)*7.741)]">{'✦ '}</span>
        <span>вітальний пакет казіно</span>
        <span className="text-[length:calc(var(--dp)*7.741)]">{' ✦'}</span>
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
      <div className="absolute left-[calc(var(--dp)*16.5)] top-[calc(var(--dp)*58)] flex w-max flex-col items-start gap-[calc(var(--dp)*8)]">
        <p className="flex gap-[calc(var(--dp)*2)] whitespace-nowrap font-outfit text-[length:calc(var(--dp)*15)] font-bold uppercase leading-[normal] text-on-dark">
          <span>₴250.000</span>
          <span>+ 250 fS</span>
        </p>
        <span className="rounded-[calc(var(--dp)*3.318)] bg-wager-badge px-[calc(var(--dp)*4.424)] py-[calc(var(--dp)*1.659)] font-sans text-[length:calc(var(--dp)*10)] font-bold uppercase leading-[normal] tracking-[calc(var(--dp)*0.2765)] text-promo">
          20X WAGER
        </span>
      </div>

      {/*
       * CTA 1:3308 — 130x28. The design draws a 28px target, which is under the 44px minimum;
       * growing the paint would move the slide's whole layout, so the paint ships as drawn and
       * a transparent `after:` extends the target above and below by `22px − 14 design px`: 8 + 28
       * + 8 = 44 at 390, and still 44 at any width as the painted button scales — the pattern
       * TournamentCard's join button and BonusCarousel use. It spans y 113..157 of a 170 slide, so the
       * slide's `overflow-hidden` does not clip it.
       *
       * `!font-bold` is not decoration. The `cta` variant sets `font-semibold` and this node is
       * Bold 700 (docs/tokens.md §4.3 step 44). Tailwind emits `.font-semibold` *after*
       * `.font-bold`, so a plain `font-bold` here loses the cascade no matter where it sits in
       * the class string — checked against the compiled stylesheet, not assumed.
       */}
      <ButtonLink
        href="/promo"
        className="absolute left-[calc(var(--dp)*17)] top-[calc(var(--dp)*121)] h-[calc(var(--dp)*28)] w-[calc(var(--dp)*130)] text-[length:calc(var(--dp)*12)] !rounded-[calc(var(--dp)*6)] !font-bold capitalize leading-[normal] !-tracking-[calc(var(--dp)*0.2)] after:absolute after:inset-x-0 after:inset-y-[calc(var(--dp)*14-22px)] after:content-['']"
      >
        отримати бонус
      </ButtonLink>
    </>
  )
}

export function HeroCarousel() {
  const [active, setActive] = useState(0)

  // One scroll listener on the track. A scroll event cannot be cancelled, so it never holds the
  // scroll up. A slide's pitch is its own width plus the 4px gap, read at event time so it is
  // right at every width. Setting the same index again bails out in React, so a scroll that
  // stays on one slide re-renders nothing.
  const onScroll = (event: UIEvent<HTMLUListElement>) => {
    const track = event.currentTarget
    const slide = track.firstElementChild as HTMLElement | null
    if (!slide) return
    setActive(Math.round(track.scrollLeft / (slide.offsetWidth + 4)))
  }

  return (
    <section className="flex w-full flex-col gap-gutter pb-gutter pt-6">
      {/*
       * `tabIndex` is what makes a scroll container reachable without a pointer; a scroller that
       * only a finger can move is unusable from a keyboard. The label is not in the design — the
       * frame is named "Frame 2135557699" — so it is written here and flagged for the owner.
       *
       * The trailing 34px is derived, not measured: the last slide's snap point rests it at the
       * same 16px inset as the first, which needs the slide plus 34px after it (16 + 340 + 34 =
       * 390). With only a 16px trailing pad that snap point sits past the end of the scroll range
       * — a mandatory snap point the scroller cannot reach is how a carousel ends up with an
       * unreachable last slide. It also makes the content box exactly one slide wide, which is
       * what `w-full` on each slide relies on.
       *
       * `py-px` keeps the drawn 172 track around a 170 slide at 390.
       */}
      <ul
        tabIndex={0}
        aria-label="Акційні пропозиції"
        onScroll={onScroll}
        className="scrollbar-none flex snap-x snap-mandatory items-center gap-1 overflow-x-auto scroll-pl-gutter py-px pl-gutter pr-[34px]"
      >
        {SLIDES.map((index) => (
          <li
            key={index}
            className="relative aspect-[340/170] w-full shrink-0 snap-start overflow-hidden rounded-slide bg-slide [container-type:inline-size] [--dp:calc(100cqw/340)]"
          >
            <Slide first={index === 0} />
          </li>
        ))}
      </ul>

      {/*
       * The bars end 32px from the right at every width (`pr-8`) — x 358 in the 390 column, where
       * the design puts them. Width is the only thing that animates, 200ms, and not at all under
       * reduced motion.
       */}
      <div aria-hidden="true" className="flex w-full justify-end gap-1 pr-8">
        {SLIDES.map((index) => (
          <span
            key={index}
            className={`h-1 rounded-hairline transition-[width] duration-200 motion-reduce:transition-none ${
              BAR_STYLES[Math.min(Math.abs(index - active), BAR_STYLES.length - 1)]
            }`}
          />
        ))}
      </div>
    </section>
  )
}
