import Link from 'next/link'

/**
 * This demo has three routes: `/`, `/sport` and this page. Every other href in the design —
 * eleven in the menu, twelve in the footer, five in the bottom nav — points at a screen that
 * was never designed. Rather than pretend, those links land here and say so.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-gutter text-center">
      <h1 className="font-roboto text-section-title text-title">Ця сторінка ще не готова</h1>
      <p className="max-w-[300px] text-sm text-body-muted">
        Це демонстрація дизайну. Побудовано лише головну сторінку казино та розділ спорту.
      </p>
      <Link
        href="/"
        className="rounded-sm bg-cta px-5 py-2.5 font-outfit text-sm font-semibold tracking-outfit text-on-dark shadow-cta"
      >
        На головну
      </Link>
    </main>
  )
}
