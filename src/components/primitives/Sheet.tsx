'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * The full-screen panel both the menu and the search use.
 *
 * Three behaviours, each of them a bug this project has already shipped once.
 *
 * 1. **Focus is trapped inside.** Without it, Tab walks out of the dialog and onto the page
 *    underneath, which is still there, still focusable, and invisible behind the scrim.
 *
 * 2. **Escape closes, and focus goes back to whatever opened it.** A keyboard user who opens
 *    the menu and closes it should be standing where they started, not at the top of the
 *    document.
 *
 * 3. **The page behind does not scroll.** Otherwise a finger dragging over the scrim scrolls
 *    the catalogue underneath, and closing the sheet leaves the page somewhere else.
 *
 * ## There is no tap-outside dismissal, because there is no outside
 *
 * This used to carry a fourth behaviour: an `onMouseDown` on the wrapper, guarded by
 * `target === currentTarget`, that closed the sheet on a backdrop tap. It was removed on
 * 2026-09-10 after being measured rather than read. Sampling every 2px over the whole wrapper
 * with `document.elementFromPoint` at 390x844:
 *
 *   menu   — 0 points out of 390 x 776 where the wrapper is the top element
 *   search — 105 points, every one of them inside the four 24px rounded corners
 *
 * The menu could not be dismissed that way at all, and the search only by an accidental tap on
 * a corner sliver. Neither is an affordance. The design draws no scrim, no dimming and no
 * exposed page for either panel (MenuPanel's own note records this for the menu; the search has
 * no frame relating it to anything), so a backdrop dismissal would be inventing a region, and
 * making it visible would mean inventing a scrim colour. Both panels have an explicit close
 * control and both answer Escape, and a route change now closes them via UrlStateBridge.
 *
 * The one thing worth keeping from that code, because it cost a debugging session: a handler on
 * `mousedown` that closes a dialog must `preventDefault()`, or the browser's uncancelled default
 * action focuses the nearest focusable ancestor of the press target — the detached backdrop, so
 * <body> — and overwrites a focus restoration that had already succeeded. `keydown` has no such
 * default action, which is the entire difference between the Escape path and the click path.
 */
interface SheetProps {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. Screen readers announce it on open. */
  label: string
  children: ReactNode
  /**
   * Stop the sheet above the bottom navigation instead of covering it.
   *
   * Opt-in, because only the menu wants it. The design draws the menu with the nav bar lit and
   * on top of the panel (BottomNavBar lifts itself above this sheet while the menu is open), and
   * the panel filling everything above it. The
   * search has no design at all for its relationship to the nav, so it covers it.
   */
  clearsNavBar?: boolean
  className?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Sheet({ open, onClose, label, children, clearsNavBar, className }: SheetProps) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    openerRef.current = document.activeElement as HTMLElement | null

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus in. Without this the first Tab press would start from wherever the trigger
    // was, which is outside the dialog and behind the scrim. The dialog itself is the fallback
    // (it carries tabIndex={-1}), for a sheet whose content is not focusable yet.
    const surface = surfaceRef.current
    const firstFocusable = surface?.querySelector<HTMLElement>(FOCUSABLE)
    if (firstFocusable) firstFocusable.focus()
    else surface?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const nodes = surfaceRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!nodes || nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      openerRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  if (typeof document === 'undefined') return null

  // `mx-auto max-w-[390px]`: the page is a centred 390 column above 390 (globals.css, body), and
  // a fixed box escapes that column, so the sheet centres itself the same way the nav does.
  return createPortal(
    <div
      className={`fixed inset-x-0 top-0 z-50 mx-auto max-w-[390px] ${clearsNavBar ? 'bottom-[calc(var(--nav-bar-h)+env(safe-area-inset-bottom))]' : 'bottom-0'}`}
    >
      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`h-full w-full overflow-y-auto ${className ?? ''}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
