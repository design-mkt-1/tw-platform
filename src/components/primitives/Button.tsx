import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Every pressable rectangle in the design, in four skins measured off real nodes.
 *
 * `prefetch={false}` is hard-coded in the link branch, before the spread. This demo has three
 * routes — `/`, `/sport` and not-found — and the design carries twenty-eight other hrefs, all
 * dead. Next prefetches every <Link> by default, so each dead href fires a background request
 * for a page that does not exist: the page looks perfect and 404s silently underneath. In the
 * predecessor project that bug was found and fixed three separate times, each time only where
 * it had been noticed. Putting it here fixes the class, and a caller that one day links
 * somewhere real can still override it because the spread comes after.
 */
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
