import Link from 'next/link'
import type { FooterLinkColumn as FooterLinkColumnData } from '@/lib/types'

/**
 * One headed column of footer links — nodes 1:5937 (`НАВІГАЦІЯ`) and 1:5952 (`ПОЛІТИКИ Й ПРАВО`).
 *
 * The two columns look like one component with one type recipe. They are not, and the difference
 * is measured, not stylistic drift: the navigation column is Figma's `Footnote_m` (Roboto Medium
 * 500, 14/16) at 158 wide, the policies column is `Capation1` (Figma's spelling — Roboto Regular
 * 400, 13/16) at 141 wide. Normalising them would change what the design renders, and the 141px
 * width in particular is load-bearing: it is what makes `Політика конфіденційності` wrap to two
 * lines inside its 44px row (1:5958). See 05-casino-footer.md §5.
 *
 * Past 390 both columns grow in proportion to the row, so the page does not end in a strip. The
 * row's content box is 354 at 390 (Footer's 374 less `px-2.5`), so `100% * 158 / 354` is exactly
 * 158 there and `max()` keeps it at 158 below — where both columns shrink as flex items, as they
 * always did, and the wrap above is untouched at 390.
 *
 * Row height is 44 — the only element in the whole Figma file that respects a 44px touch target.
 */

type Variant = 'nav' | 'policy'

const VARIANTS: Record<Variant, { column: string; link: string }> = {
  // Footnote_e heading + Footnote_m rows. Size and colour both arrive from `text-footer-link` on
  // the <nav>; this variant only has to say what differs.
  nav: { column: 'w-[max(158px,100%*158/354)]', link: 'font-medium' },
  // Capation1 — one step smaller than the column heading above it, and Regular rather than Medium.
  policy: { column: 'w-[max(141px,100%*141/354)]', link: 'text-footnote font-normal' },
}

/**
 * 1:5956 alone carries `text-transform: capitalize`, so it renders `Умови Використання` while its
 * five siblings render as stored. The asymmetry is in the source file and is reproduced rather
 * than tidied away — see 05-casino-footer.md §5.2 and its open question 4.
 *
 * Matched on the label instead of on the index so that reordering the data cannot silently move
 * the capitalisation to a different link.
 */
const CAPITALIZED_LABEL = 'Умови використання'

interface FooterLinkColumnProps extends FooterLinkColumnData {
  variant: Variant
}

export function FooterLinkColumn({ heading, links, variant }: FooterLinkColumnProps) {
  const { column, link } = VARIANTS[variant]
  const headingId = `footer-links-${variant}`

  return (
    <nav
      aria-labelledby={headingId}
      // `text-footer-link` resolves to both the 14/16 step and #AFC1E8 — the theme names the same
      // token in `fontSize` and in `colors`, and the design pairs them on exactly these nodes.
      className={`flex flex-col items-start gap-2 font-roboto text-footer-link ${column}`}
    >
      <h2 id={headingId} className="font-bold">
        {heading}
      </h2>

      {/* No gap between rows: each row is a fixed 44px hit area and they sit flush (1:5939). */}
      <ul className="w-full">
        {links.map(({ label, href }) => (
          <li key={`${href}|${label}`}>
            <FooterLink
              href={href}
              label={label}
              className={[
                // The 6px radius sits on a row with no fill in the design. It is a resting state
                // waiting for a background that was never drawn (docs/tokens.md §8), so the
                // hover/focus affordance here is invented: it brightens the text to an existing
                // footer token rather than inventing a fill colour that has no node.
                'flex h-11 w-full items-center rounded-sm transition-colors hover:text-on-dark',
                link,
                label === CAPITALIZED_LABEL ? 'capitalize' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Only `/` and `/sport` exist in this demo; every other href the design carries is dead, so no
 * <Link> here may prefetch — Next would fire a background request per row for pages that 404.
 * Anything that is not an app route (the `mailto:` on 1:5945, and any absolute URL) is not a route
 * at all and goes through a plain <a>, which is also why this branch exists rather than a
 * `<Link href="mailto:…">`.
 */
function FooterLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className: string
}) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} prefetch={false} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}
