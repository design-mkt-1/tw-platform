'use client'

import type { MouseEvent } from 'react'
import { create } from 'zustand'
import type { AuthMode, CategoryId, PanelId } from '@/lib/types'

/**
 * One store for everything the URL can address.
 *
 * The mutual-exclusion rule below is not tidiness. Both panels are full-screen sheets with a
 * focus trap; two open at once means two traps fighting, and the one underneath is unreachable
 * but still focusable. Opening either closes the other, always.
 */
interface AppState {
  auth: AuthMode
  panel: PanelId | null
  activeCategory: CategoryId
  /** What is in the search field right now. */
  query: string
  /** Recent searches, newest first. The design's list shows one entry; the frame caps at 32px. */
  recent: string[]

  setAuth: (auth: AuthMode) => void
  openPanel: (panel: PanelId) => void
  /** Close in place — the X, Escape, the Меню toggle. Steps back over the entry `openPanel` pushed. */
  closePanel: () => void
  /** Close because a link is navigating away. The link replaces the entry instead — see below. */
  leavePanel: () => void
  setCategory: (category: CategoryId) => void
  setQuery: (query: string) => void
  commitQuery: (query: string) => void
}

const RECENT_LIMIT = 4

/*
 * ## The phone's Back gesture closes a panel (owner's decision, 2026-09-10)
 *
 * Both panels are full-screen, so on a phone they read as a screen, and Back on a screen goes to
 * the one before. Until this, Back left the site with the menu still open. So opening a panel
 * pushes ONE history entry at the same URL, and a `popstate` while that entry is ours closes the
 * panel. UrlStateBridge still mirrors `?panel=` with `replaceState`, which rewrites whichever entry
 * is on top — ours, while a panel is open.
 *
 * `pushState(window.history.state, …)`, never `null`, for the reason UrlStateBridge.tsx:34-58
 * gives: the App Router patches `pushState` too, and only a state carrying its `__NA` passes
 * through untouched. It also means Back lands on an entry Next recognises, so its own `popstate`
 * handler restores the page we are already on instead of reloading.
 *
 * Closing by anything but Back must consume the entry, or the next Back does nothing visible:
 *  - closing in place (`closePanel`) calls `history.back()` itself. Our listener sees `pushed`
 *    already false and does nothing; Next restores the same page.
 *  - closing because a link navigates (`leavePanel`) must NOT go back — a `popstate` during a
 *    pending navigation makes Next discard the navigation, the exact bug UrlStateBridge records.
 *    Those links pass `replace` instead, so the new route takes our entry's place.
 *
 * ponytail: one flag, not a stack. A reload with `?panel=` in the URL re-opens and pushes again,
 * which leaves one extra Back on that entry; a history-state marker would catch it if it matters.
 */
let pushed = false

function forgetEntry() {
  const was = pushed
  pushed = false
  return was
}

export const useAppStore = create<AppState>((set, get) => ({
  auth: 'postlogin',
  panel: null,
  activeCategory: 'popular',
  query: '',
  recent: [],

  setAuth: (auth) => set({ auth }),

  openPanel: (panel) => {
    // One entry per open, not per panel: switching panels while one is open reuses it.
    if (!get().panel && typeof window !== 'undefined') {
      window.history.pushState(window.history.state, '', window.location.href)
      pushed = true
    }
    set({ panel })
  },

  // Clearing the query on close is what makes the search reopen in its resting state rather
  // than showing the previous player's search.
  closePanel: () => {
    set({ panel: null, query: '' })
    if (forgetEntry()) window.history.back()
  },

  leavePanel: () => {
    forgetEntry()
    set({ panel: null, query: '' })
  },

  // Picking a category closes the panel in place, so it consumes the entry the same way.
  setCategory: (activeCategory) => {
    set({ activeCategory, panel: null })
    if (forgetEntry()) window.history.back()
  },

  setQuery: (query) => set({ query }),

  commitQuery: (query) =>
    set((state) => {
      const trimmed = query.trim()
      if (!trimmed) return state
      const recent = [trimmed, ...state.recent.filter((r) => r !== trimmed)].slice(0, RECENT_LIMIT)
      return { ...state, query: trimmed, recent }
    }),
}))

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    if (forgetEntry()) useAppStore.setState({ panel: null, query: '' })
  })
}

/**
 * The click handler for a link pressed while a panel may be open — the menu's rows and the nav
 * tabs, which sit above the menu. Pair it with `replace={panelOpen}` on the `<Link>`.
 *
 * A link to the route already showing navigates nowhere (CASINO on `/`), so it is a close in
 * place: the default is cancelled — Next's `<Link>` honours `defaultPrevented` — and the panel
 * closes by stepping back. Any other link leaves, and its `replace` takes our entry's place.
 */
export function followLinkOutOfPanel(event: MouseEvent, sameRoute: boolean) {
  const { panel, closePanel, leavePanel } = useAppStore.getState()
  if (!panel) return
  if (sameRoute) {
    event.preventDefault()
    closePanel()
  } else {
    leavePanel()
    focusMainOnArrival = true
  }
}

/**
 * Where focus goes after a panel link changes route (ux-audit B1-18). The Sheet hands focus back
 * to its opener when it closes, and the opener is on the page being left, so without this focus
 * ended on <body> and the next Tab started from the top of the document. MenuPanel consumes the
 * flag when the new page mounts it; every page's `<main>` carries `tabIndex={-1}` to accept it.
 */
let focusMainOnArrival = false

export function takeFocusMainOnArrival() {
  const was = focusMainOnArrival
  focusMainOnArrival = false
  return was
}
