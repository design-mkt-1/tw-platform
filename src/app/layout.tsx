import type { Metadata, Viewport } from 'next'
import { Inter, Roboto } from 'next/font/google'
import './globals.css'

/**
 * Two families, both carrying Cyrillic — see docs/tokens.md §4.1.
 *
 * The design names six. Three of them cannot render this design's own copy, which was
 * measured against Next's Google Fonts data rather than assumed:
 *
 *   Outfit                 ["latin", "latin-ext"]        — no cyrillic
 *   Archivo Narrow         ["latin", "latin-ext", ...]   — no cyrillic
 *   Big Shoulders Display  not in the catalogue at all
 *
 * Outfit is used in the file for exactly four strings — Увійти, Реєстрація, Депозит and the
 * hero CTA — and every one of them is Cyrillic. Archivo Narrow carries one string,
 * вітальний бонус, also Cyrillic. So Figma itself was already falling back when it rendered
 * those frames: what the design *looks like* is not Outfit either. Substituting Inter matches
 * the render rather than departing from it, and it is recorded in docs/tokens.md.
 *
 * Roboto Flex appears on the footer headings, the balance figure and the ticker, carrying a
 * ten-axis fontVariationSettings string. Every axis in it is the axis default, so static
 * Roboto at the same weight renders identically and is one font fewer to download.
 */
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'], // 1:6395 "● EP" is Bold italic
  variable: '--font-roboto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Top-Win',
  description: 'Мобільна демонстрація платформи Top-Win',
  // An unreleased client design carrying other companies' marks. The URL is shareable; it
  // must not be indexed. Pairs with public/robots.txt.
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The bottom nav sits against the home indicator; without this the safe-area insets read 0.
  viewportFit: 'cover',
  themeColor: '#e8f1fc', // --bg-header, so the browser chrome matches the app header
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${inter.variable} ${roboto.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
