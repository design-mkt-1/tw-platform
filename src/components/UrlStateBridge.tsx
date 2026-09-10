'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { AuthMode, PanelId } from '@/lib/types'

/**
 * Mirrors store state into the query string, and reads it back once on mount.
 *
 * This exists so a state can be reviewed. A screenshot called "the menu, logged in as VIP" is
 * worthless if the only way to reach that state is to press four things in order — nobody can
 * check it, and the capture scripts cannot reach it at all. Every state the design draws gets
 * an address:
 *
 *   ?auth=prelogin | postlogin | vip     which header and menu variant
 *   ?panel=menu | search                 which full-screen sheet is open
 *   ?q=<text>                            the search query, which picks the search state
 *
 * scripts/review.mjs and scripts/a11y.mjs deep-link against exactly these three names.
 *
 * Two rules that keep it from fighting the app:
 *  - the URL is a mirror, never a source. It is read once, on mount, and after that only
 *    written. A component that read it continuously would re-render on its own writes.
 *  - `history.replaceState`, not the router. Pushing would put every panel open/close into the
 *    back stack, so leaving the site would take eleven presses of Back.
 */
const AUTH_MODES: AuthMode[] = ['prelogin', 'postlogin', 'vip']
const PANELS: PanelId[] = ['menu', 'search']

export function UrlStateBridge() {
  const auth = useAppStore((s) => s.auth)
  const panel = useAppStore((s) => s.panel)
  const query = useAppStore((s) => s.query)

  // Read once. The empty dependency list is deliberate: re-running this would overwrite the
  // user's interaction with whatever the URL said when the page loaded.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const store = useAppStore.getState()

    const urlAuth = params.get('auth')
    if (urlAuth && (AUTH_MODES as string[]).includes(urlAuth)) {
      store.setAuth(urlAuth as AuthMode)
    }

    const urlQuery = params.get('q')
    if (urlQuery) store.setQuery(urlQuery)

    // Panel last: setQuery does not open anything, and openPanel must not be undone by it.
    const urlPanel = params.get('panel')
    if (urlPanel && (PANELS as string[]).includes(urlPanel)) {
      store.openPanel(urlPanel as PanelId)
    }
  }, [])

  // Write on every change.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (auth === 'postlogin') params.delete('auth')
    else params.set('auth', auth)

    if (panel) params.set('panel', panel)
    else params.delete('panel')

    if (query) params.set('q', query)
    else params.delete('q')

    const search = params.toString()
    const next = `${window.location.pathname}${search ? `?${search}` : ''}`
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', next)
    }
  }, [auth, panel, query])

  return null
}
