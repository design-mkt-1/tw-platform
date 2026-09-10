'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * The full-screen panel both the menu and the search use.
 *
 * Four behaviours, each of them a bug this project has already shipped once.
 *
 * 1. **Focus is trapped inside.** Without it, Tab walks out of the dialog and onto the page
 *    underneath, which is still there, still focusable, and invisible behind the scrim.
 *
 * 2. **Escape closes, and focus goes back to whatever opened it.** A keyboard user who opens
 *    the menu and closes it should be standing where they started, not at the top of the
 *    document.
 *
 * 3. **A backdrop click also restores focus — and that needs one extra line.** Both paths call
 *    opener.focus(). The click path used to fail anyway, and the cause was not a missed
 *    restoration: after the handler runs, the browser performs the uncancelled default action
 *    of `mousedown`, which is to focus the nearest focusable ancestor of whatever was pressed.
 *    That target is the backdrop — not focusable, and detached by then — so focus falls to
 *    <body> and overwrites a restoration that had already succeeded. `keydown` has no such
 *    default action, which is the entire difference between the two paths. Hence the
 *    preventDefault below, and it must stay inside the `target === currentTarget` guard, or
 *    clicking into a field inside the sheet would stop focusing it.
 *
 * 4. **The page behind does not scroll.** Otherwise a finger dragging over the scrim scrolls
 *    the catalogue underneath, and closing the sheet leaves the page somewhere else.
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
   * the Menu tab active beneath the panel, and the panel filling everything above it. The
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

  return createPortal(
    <div
      className={`fixed inset-x-0 top-0 z-50 ${clearsNavBar ? 'bottom-[calc(var(--nav-bar-h)+env(safe-area-inset-bottom))]' : 'bottom-0'}`}
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) return
        // See note 3 above. Without this the browser refocuses <body> after we restore.
        event.preventDefault()
        onClose()
      }}
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
