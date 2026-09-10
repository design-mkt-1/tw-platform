import type { ReactNode } from 'react'
import { BottomNavBar } from './BottomNavBar'

/**
 * Wraps a page with the bottom navigation.
 *
 * The nav is fixed — the plate is 80% opaque over a backdrop blur and its notch is a genuine
 * hole, both of which only mean anything with page content moving behind them — so the document
 * has to end with a spacer or its last row sits under the bar. The spacer is the PAINTED bar
 * height (68, the bottom of the 111-tall frame) plus the home-indicator inset, matching the
 * `bottom` the nav itself is pinned at. `--nav-bar-h` is read straight from the theme so the
 * number lives in exactly one place; `viewportFit: 'cover'` in layout.tsx is what makes the
 * env() read anything but zero.
 *
 * This stays a server component. Only the nav needs the store and the pathname.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <div
        aria-hidden
        style={{ height: 'calc(var(--nav-bar-h) + env(safe-area-inset-bottom))' }}
      />
      <BottomNavBar />
    </>
  )
}
