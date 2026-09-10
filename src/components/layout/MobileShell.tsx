import type { ReactNode } from 'react'
import { MenuPanel } from '@/components/panels/MenuPanel'
import { SearchOverlay } from '@/components/panels/SearchOverlay'
import { BottomNavBar } from './BottomNavBar'

/**
 * Wraps a page with the bottom navigation and the two full-screen panels.
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
      {/*
       * Both panels live here rather than in each page, because both pages need both and the
       * store is what opens them. They were written before anything rendered them, and for a
       * while the raised Menu button set `panel: 'menu'` in the store while nothing on screen
       * drew it — a control that looks pressable and does nothing, which the predecessor
       * project's audit found to be its single largest class of defect. Mounting them once,
       * where the nav that opens them already lives, is what stops that recurring per page.
       */}
      <MenuPanel />
      <SearchOverlay />
    </>
  )
}
