import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Every pressable rectangle in the design, in four skins measured off real nodes.
 *
 * `prefetch={false}` is hard-coded in the link branch, before the spread. This demo has three
 * routes — `/`, `/sport` and not-found — and the design carries 20 other distinct hrefs, all
 * dead, rendered as 25 link instances (counted in the browser on 2026-09-10). Next prefetches every <Link> by default, so each dead href fires a background request
 * for a page that does not exist: the page looks perfect and 404s silently underneath. In the
 * predecessor project that bug was found and fixed three separate times, each time only where
 * it had been noticed. Putting it here fixes the class, and a caller that one day links
 * somewhere real can still override it because the spread comes after.
 */
/**
 * What a Button wears when the design gives it no flow to run.
 *
 * Pair it with `aria-disabled="true"`, never with `disabled`: `disabled` drops the control out of
 * the tab order, and the six equivalent inert controls elsewhere in this build — SectionHeader's
 * see-all pill, LeagueStrip's `Всі ліги` and its more-leagues arrow, UpcomingHeader's `Всі події`,
 * and SportNavRow's ★ and 🎁 — all chose the opposite, so the state stays discoverable.
 *
 * Those six write their skins by hand precisely to escape this primitive's baked-in
 * `active:scale-[0.97]`. A caller that keeps the primitive needs `!` to win instead: a control
 * that squashes under a finger and then does nothing is a lie told twice.
 *
 * How an inert control LOOKS (half opacity, `not-allowed` cursor) is not here: globals.css keys
 * it on `aria-disabled="true"`, so the hand-built six get it too.
 *
 * Lives here rather than in a panel because the same four buttons appear in two places —
 * `Увійти` and `Реєстрація` are drawn both in the header (1:3295, 1:3297) and in the menu
 * (1:6651, 1:6653), and a string copied into both files drifts.
 */
export const INERT = 'cursor-default active:!scale-100'

type Variant = 'cta' | 'muted' | 'deposit' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  // 1:3297 register, 1:3308 hero CTA, 1:5235 join, 1:6653 menu register — one recipe, seven nodes.
  cta: 'bg-cta text-on-dark shadow-cta rounded-sm font-outfit font-semibold tracking-outfit',
  // 1:3295 login, 1:6000, 1:6651.
  muted: 'bg-muted text-primary rounded-md font-outfit font-semibold tracking-outfit',
  // 1:6836 — a green button carrying a gold glow. Measured, not a mistake in transcription.
  deposit: 'bg-deposit text-on-dark shadow-deposit rounded-sm font-sans font-extrabold',
  // 1:6085 "Всі ліги", 1:5052 see-all.
  ghost: 'bg-chip-link text-link border border-chip rounded-chip',
}

interface BaseProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

type ButtonProps = BaseProps & Omit<ComponentProps<'button'>, 'className' | 'children'>
type AnchorProps = BaseProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    'className' | 'children' | 'href'
  >

function classesFor(variant: Variant, className?: string) {
  return [
    'inline-flex items-center justify-center whitespace-nowrap',
    // Nothing in the design draws a pressed state. This is the invented one — recorded in
    // docs/tokens.md §8. Scale rather than colour, so it survives on every one of the four skins.
    'transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100',
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({ variant = 'cta', children, className, ...rest }: ButtonProps) {
  return (
    <button type="button" className={classesFor(variant, className)} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'cta', children, className, href, ...rest }: AnchorProps) {
  return (
    <Link href={href} prefetch={false} className={classesFor(variant, className)} {...rest}>
      {children}
    </Link>
  )
}
