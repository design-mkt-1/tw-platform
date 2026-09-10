import { Icon } from '@/components/primitives/Icon'
import {
  LANGUAGE_FLAGS,
  PARTNER_LOGOS,
  PAYMENT_LOGOS,
  type LanguageFlagName,
  type PartnerLogoName,
  type PaymentLogoName,
} from '@/lib/assets'
import { FOOTER } from '@/lib/data'
import { FooterLinkColumn } from './FooterLinkColumn'

/**
 * The casino footer — node 1:5607, 390 × 1114.7, the largest single block on the page.
 *
 * Six blocks and nothing else, in this order: payment card, partner logos, dashed rule, two link
 * columns, dashed rule, language flags. Every gap between them is the one 32px flex gap.
 *
 * **What is deliberately absent.** No licence number, no regulator logo, no 18+ mark, no
 * responsible-gambling line, no copyright and no company name. That was measured across the whole
 * 1:5607 subtree — including hidden nodes — not inferred from a screenshot, and the owner has
 * decided it ships as drawn. `Support@jack-pot.com` (1:5945) likewise ships with its capital S and
 * the previous project's domain. See docs/tokens.md §9 and the note on `FooterData` in types.ts.
 * Do not "complete" any of this here; it has to come from the owner.
 */

/**
 * 1:5610 and 1:5698. Stored mixed-case and uppercased in CSS — shipping the rendered form would
 * bake Ukrainian casing into the markup and break every other locale (docs/tokens.md §4.4).
 */
const PAYMENTS_HEADING = 'Безпечні способи оплати'
const PARTNERS_HEADING = 'Наші партнери'

/**
 * Per-logo intrinsic size, read off each exported SVG's own viewBox — the assets were exported
 * trimmed to their ink, so a single global size would letterbox five of the eight. Tile 5
 * (ethereum) is the only square one and tile 7 (the lockup) the only 30-high one; that is in the
 * design, not an export accident. Alt text is the brand name: the design supplies none, and a
 * brand mark is not copy that can be translated.
 */
const PAYMENTS: Record<PaymentLogoName, { alt: string; width: number; height: number }> = {
  visa: { alt: 'Visa', width: 63, height: 20 },
  mastercard: { alt: 'Mastercard', width: 51, height: 32 },
  bitcoin: { alt: 'Bitcoin', width: 110, height: 32 },
  'bitcoin-cash': { alt: 'Bitcoin Cash', width: 110, height: 32 },
  ethereum: { alt: 'Ethereum', width: 32, height: 32 },
  tether: { alt: 'Tether', width: 110, height: 32 },
  // The word in this asset is outlined vector, not live text — it cannot be translated without a
  // re-export, so the alt repeats what the artwork literally says.
  cryptocurrencies: { alt: 'Cryptocurrencies', width: 89, height: 32 },
  'visa-mastercard': { alt: 'Visa / Mastercard', width: 120, height: 30 },
}

/**
 * `box` is the Figma link frame; `width`/`height` are the asset's own pixels.
 *
 * The five SVGs are drawn at their natural size and centred, which is what the design does. The
 * two rasters are not: both are scaled past their frame and cropped, and that crop is what the
 * logos look like. Letting them letterbox would change the artwork.
 *
 *   zamsino               165 × 44 natural in a 100 × 32 slot. The design fills 121.33% of the
 *                         width at a −10.66% offset, which is exactly centred cover for this
 *                         aspect pair — `object-cover object-center` reproduces it.
 *   deutschland-casinos   2048 × 2048 in a 90 × 40 slot, top offset −77.78%, showing the middle
 *                         horizontal band. 48% is that band's centre.
 */
const PARTNERS: Record<
  PartnerLogoName,
  { alt: string; box: string; width: number; height: number; image?: string }
> = {
  casinostest: { alt: 'CASINOSTEST.ORG', box: 'h-[30px] w-[110px]', width: 109, height: 24 },
  gamblersbet: { alt: 'GamblersBet', box: 'h-8 w-[100px]', width: 100, height: 31 },
  'casino-bonuses-now': {
    alt: 'Casino Bonuses Now',
    box: 'h-8 w-[100px]',
    width: 100,
    height: 25,
  },
  'no-deposit': { alt: 'no deposit', box: 'h-8 w-[100px]', width: 100, height: 22 },
  'casino-bonus-club': { alt: 'Casino Bonus Club', box: 'h-8 w-[100px]', width: 100, height: 26 },
  zamsino: {
    alt: 'Zamsino',
    box: 'h-8 w-[100px]',
    width: 165,
    height: 44,
    image: 'h-full w-full object-cover object-center',
  },
  'deutschland-casinos': {
    alt: 'Deutschland Casinos',
    box: 'h-10 w-[90px]',
    width: 2048,
    height: 2048,
    image: 'h-full w-full object-cover object-[50%_48%]',
  },
}

/**
 * All three flag layers are named `en` in Figma and carry no locale metadata, so assets.ts names
 * them for the artwork they draw and these alts do the same. Assigning `uk` / `en` / `ru` would be
 * a guess dressed up as data — it is an open question for the owner, not a gap to fill in here.
 */
const FLAG_ALTS: Record<LanguageFlagName, string> = {
  ukraine: 'Ukraine',
  'union-jack': 'Union Jack',
  'tricolour-white-blue-red': 'White, blue and red tricolour',
}

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-8 border-t border-footer bg-footer px-2 pb-11 pt-[54px]">
      {/* Block 1 — payment methods, 1:5608 */}
      <section
        aria-labelledby="footer-payments-heading"
        className="flex w-full flex-col items-start gap-4 rounded-lg border border-on-dark-06 bg-footer-card px-5 py-6"
      >
        <h2
          id="footer-payments-heading"
          className="w-full text-center font-roboto text-footer-heading font-bold uppercase"
        >
          {PAYMENTS_HEADING}
        </h2>

        {/* A wrapping flex row, not a grid: 160 + 12 + 160 fits the 332 content box exactly twice,
            so an odd last tile centres on its own row. That is a real layout state (1:5611).
            A fixed 160 fell to one tile per row below 390 (8 rows at 375 and 360, measured) and
            left a strip past it. `w-[calc(50%-6px)]` is half the box less half the 12px gap, so
            two tiles share a row at any width, grow with the box, and 390 is still 160. */}
        <ul className="flex w-full flex-wrap items-center justify-center gap-3">
          {FOOTER.payments.map((name) => {
            const logo = PAYMENTS[name]
            return (
              <li
                key={name}
                className="flex h-[52px] w-[calc(50%-6px)] items-center justify-center rounded-chip border border-on-dark-08 bg-footer-tile px-4 py-2"
              >
                <Icon
                  src={PAYMENT_LOGOS[name]}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                />
              </li>
            )
          })}
        </ul>
      </section>

      {/* Block 2 — partners, 1:5697. Three per row, the seventh centring alone on row three.
          `max-w-[400px]` holds that at every width: at 480 four logos fit on row two (438 wide) and
          the block regrouped as 3 + 4 (owner's decision of 2026-09-10, option A in
          docs/mockups/fluid-leftovers). Row one's three need 342. */}
      <section
        aria-labelledby="footer-partners-heading"
        className="flex w-full flex-col items-center gap-6 px-2"
      >
        <h2
          id="footer-partners-heading"
          className="text-center font-roboto text-footer-heading font-bold uppercase"
        >
          {PARTNERS_HEADING}
        </h2>

        <ul className="flex w-full max-w-[400px] flex-wrap items-center justify-center gap-4">
          {FOOTER.partners.map((name) => {
            const logo = PARTNERS[name]
            return (
              <li key={name} className={`flex items-center justify-center ${logo.box}`}>
                <Icon
                  src={PARTNER_LOGOS[name]}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={logo.image}
                />
              </li>
            )
          })}
        </ul>
      </section>

      {/* 1:5935 — a 374-wide dashed 4 4 path. One CSS line rather than a shipped asset. */}
      <hr className="w-full border-t border-dashed border-footer" />

      {/* Block 3 — the two link columns, 1:5936.
          Both columns come from `FOOTER.columns`, which already carries the policies column with
          its heading. `FOOTER.policies` holds the same six links a second time without a heading
          and is not rendered — see the note in the return value. */}
      <div className="flex w-full items-center justify-center gap-8 px-2.5">
        {FOOTER.columns.map((column, index) => (
          <FooterLinkColumn
            key={column.heading}
            heading={column.heading}
            links={column.links}
            // The design's own arrangement: navigation on the left at 14/500, policies on the
            // right at 13/400. Two columns, two recipes, in that order.
            variant={index === 0 ? 'nav' : 'policy'}
          />
        ))}
      </div>

      {/* 1:5967 — the same divider a second time. */}
      <hr className="w-full border-t border-dashed border-footer" />

      {/* Block 4 — language flags, 1:5968.
          Rendered as a list rather than as buttons or links on purpose. The design marks one flag
          selected with a gradient ring, but it carries no locale code, no href and no second
          screen to switch to, so a control here would be a switch that cannot switch. The state
          it does express is carried by aria-current. */}
      <ul className="flex w-full flex-wrap items-center justify-center gap-2 pb-[15px] pt-2.5">
        {FOOTER.flags.map(({ id, active }) => (
          <li
            key={id}
            aria-current={active || undefined}
            className={`flex h-[31.7px] w-[32.2px] items-center justify-center rounded-[15.98px] ${
              active ? 'bg-flag-active' : ''
            }`}
          >
            <span
              className={`flex h-[29.2px] w-[29.2px] items-center justify-center overflow-hidden rounded-full ${
                active ? 'border border-footer' : ''
              }`}
            >
              {/* Both inactive flags are drawn wider than their clip — the Union Jack's paths run
                  x −13.5 → 41.9 inside a 27.99 viewBox — so the round frame cover-crops them.
                  Ukraine alone was authored to fit, where cover is a no-op. */}
              <Icon
                src={LANGUAGE_FLAGS[id]}
                alt={FLAG_ALTS[id]}
                width={28}
                height={28}
                className="h-full w-full object-cover"
              />
            </span>
          </li>
        ))}
      </ul>
    </footer>
  )
}
