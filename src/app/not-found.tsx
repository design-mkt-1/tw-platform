import { Header } from '@/components/layout/Header'
import { MobileShell } from '@/components/layout/MobileShell'
import { ButtonLink } from '@/components/primitives/Button'

/**
 * This demo has three routes: `/`, `/sport` and this page. Every other href in the design points
 * at a screen that was never designed — 20 distinct dead routes, rendered as 25 link instances:
 * 9 in the menu, 2 in the bottom nav and 14 on the two pages, the footer's among them (counted in
 * the browser on 2026-09-10). Rather than pretend, those links land here and say so.
 *
 * Inside the header and the bottom nav, by the owner's decision of 2026-09-10: until then this page
 * was a bare column whose only way out was one link, so a player who tapped `Промо` lost the
 * whole app chrome. The panels need no URL bridge here — both read the store, which is what opens
 * them — so `UrlStateBridge` stays with the two real pages and this route writes nothing to the URL.
 *
 * The heading is an `<h2>` because Header now carries the page's `<h1>` (the logo).
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <MobileShell>
        <main
          // A focus target for script only (MenuPanel.tsx, B1-18), not a Tab stop.
          tabIndex={-1}
          className="flex flex-col items-center justify-center gap-4 px-gutter text-center"
          // The screen minus the 60px header and the painted nav, so the message sits centred in
          // what is visible and the page does not scroll. `dvh` rather than `vh`: on a phone `vh`
          // is the height with the browser toolbar hidden, which pushed the button under it.
          style={{
            minHeight: 'calc(100dvh - 60px - var(--nav-bar-h) - env(safe-area-inset-bottom))',
          }}
        >
          <h2 className="font-roboto text-section-title text-title">Ця сторінка ще не готова</h2>
          <p className="max-w-[300px] text-sm text-body-muted">
            Це демонстрація дизайну. Побудовано лише головну сторінку казино та розділ спорту.
          </p>
          <ButtonLink href="/" className="h-11 px-5 text-sm">
            На головну
          </ButtonLink>
        </main>
      </MobileShell>
    </>
  )
}
