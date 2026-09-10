'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { AuthMode, CategoryId, PanelId } from '@/lib/types'

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
 *   ?category=slots | live-casino | crash   which category chip narrows the game grids
 *
 * scripts/review.mjs and scripts/a11y.mjs deep-link against exactly these four names.
 *
 * `category` was added on 2026-09-12 for the same reason as the other three, and it is tooling
 * rather than design: the Figma file draws no second frame with a different chip selected
 * (src/lib/data.ts:49-56), so three of the four chips had no address and neither capture script
 * had ever rendered them. The default `popular` is omitted from the URL exactly as `postlogin`
 * is, so the plain `/` stays plain.
 *
 * Two rules that keep it from fighting the app:
 *  - the URL is a mirror, never a source. It is read once, on mount, and after that only
 *    written. A component that read it continuously would re-render on its own writes.
 *  - `history.replaceState`, not the router. Pushing would put every panel open/close into the
 *    back stack, so leaving the site would take eleven presses of Back. The ONE entry a panel
 *    does push, so that Back closes it, is the store's, not this mirror's (useAppStore.ts).
 *
 * ## Why the write carries `window.history.state` — the bug that made every menu link dead
 *
 * Measured on 2026-09-10: all eleven links in the menu panel closed the panel and navigated
 * nowhere. No `pushState` was ever issued; `history.length` did not grow. The route was fine, the
 * href was fine, and intercepting the click before React saw it navigated correctly.
 *
 * The cause is here. The App Router replaces `window.history.replaceState` with its own function
 * (`next/dist/client/components/app-router.js`), and that function dispatches `ACTION_RESTORE`
 * for any call whose state object is not Next's own — restoring the router to the tree currently
 * in `window.history.state`, i.e. the page you are standing on. Next's queue then does exactly
 * what it says in its own comment: "Navigations (including back/forward) take priority over any
 * pending actions. Mark the pending action as discarded (so the state is never applied)".
 *
 * So tapping SPORT ran, in one React batch: `closePanel()` → `<Link>` hands `ACTION_NAVIGATE` to
 * the router and awaits `/sport` → this effect sees `panel: null`, writes `/` → patched
 * `replaceState` dispatches `ACTION_RESTORE` → the pending navigation is discarded. The panel
 * closed, `panel=` left the URL, and the page never moved. Every navigation that coincided with
 * a store change died the same way; that is why it was all eleven rows rather than one.
 *
 * Passing the CURRENT state object instead of `null` fixes the class. Next's patch begins
 * "Avoid a loop when Next.js internals trigger pushState/replaceState" and short-circuits to the
 * unpatched `replaceState` whenever the state carries `__NA`, which the router's own entries
 * always do. The URL still changes; the router is simply not told, which is the whole intent of
 * a mirror. It is also the more honest call: `null` was discarding Next's internal history state
 * on every panel toggle, and only Next's patch was quietly putting it back.
 *
 * Settled by experiment, not by reading: with this effect disabled and `onClick={closePanel}`
 * left in place — so the `<Link>` still unmounts in the same batch — SPORT navigates and pushes
 * `/sport`. The unmount was innocent.
 */
/*
 * Exported, and that is the point of them being here rather than in three places.
 *
 * src/lib/__tests__/screens.test.ts restated all three as its own `as const` arrays and said so in
 * its own comment: `satisfies` catches a value that leaves the union in src/lib/types.ts, but it
 * cannot catch this file drifting away from the copy. The union is the type; these arrays are the
 * values the bridge will actually accept, and a registry row that uses a value this file rejects
 * is a row that renders the default page under another name.
 */
export const AUTH_MODES: AuthMode[] = ['prelogin', 'postlogin', 'vip']
export const PANELS: PanelId[] = ['menu', 'search']
export const CATEGORY_IDS: CategoryId[] = ['popular', 'slots', 'live-casino', 'crash']

/**
 * The path the last mount read its state from, for the whole document's lifetime.
 *
 * `src/app/page.tsx` and `src/app/sport/page.tsx` each mount their own bridge, so a client-side
 * route change unmounts one and mounts another — and the new one used to read `panel=menu` off a
 * URL that had not been cleaned yet, which re-opened the menu over the page it had just been
 * used to reach. Comparing paths tells the two cases apart: same path is a fresh load or React's
 * StrictMode double-mount and re-reads the URL, a different path is a navigation and the panel
 * belongs to the page we left.
 *
 * Module scope rather than a ref, because the whole point is to outlive the component.
 */
let lastReadPath: string | null = null

export function UrlStateBridge() {
  const auth = useAppStore((s) => s.auth)
  const panel = useAppStore((s) => s.panel)
  const query = useAppStore((s) => s.query)
  const category = useAppStore((s) => s.activeCategory)

  // Read once. The empty dependency list is deliberate: re-running this would overwrite the
  // user's interaction with whatever the URL said when the page loaded.
  useEffect(() => {
    const path = window.location.pathname
    const navigated = lastReadPath !== null && lastReadPath !== path
    lastReadPath = path

    const store = useAppStore.getState()
    // `leavePanel`, not `closePanel`: this is a navigation arriving, and closing in place would
    // step back through history in the middle of it (useAppStore.ts, the Back gesture note).
    if (navigated) {
      store.leavePanel()
      return
    }

    const params = new URLSearchParams(window.location.search)

    const urlAuth = params.get('auth')
    if (urlAuth && (AUTH_MODES as string[]).includes(urlAuth)) {
      store.setAuth(urlAuth as AuthMode)
    }

    const urlQuery = params.get('q')
    if (urlQuery) store.setQuery(urlQuery)

    // Before the panel and after the auth mode, because `setCategory` sets `panel: null` as a
    // side effect (src/store/useAppStore.ts:99) — the chip closes whatever sheet is open, which
    // is what a chip does. Read after `openPanel` it would close the panel the URL asked for.
    const urlCategory = params.get('category')
    if (urlCategory && (CATEGORY_IDS as string[]).includes(urlCategory)) {
      store.setCategory(urlCategory as CategoryId)
    }

    // Panel last: setQuery does not open anything, and openPanel must not be undone by it.
    const urlPanel = params.get('panel')
    if (urlPanel && (PANELS as string[]).includes(urlPanel)) {
      store.openPanel(urlPanel as PanelId)
    }
  }, [])

  // Write on every change — and after every step through history. A panel that closes in place
  // steps back over the entry it pushed (useAppStore.ts), landing on an entry written BEFORE the
  // change: picking a provider on `/` wrote `?category=slots` onto the panel's entry, stepped
  // back, and left the URL at a bare `/` while the page showed slots (measured on the dev server,
  // 2026-09-10). Reading the store rather than this render's values keeps the popstate write
  // current: the store's own popstate listener has already closed the panel by then.
  useEffect(() => {
    function write() {
      const { auth, panel, query, activeCategory: category } = useAppStore.getState()
      const params = new URLSearchParams(window.location.search)

      if (auth === 'postlogin') params.delete('auth')
      else params.set('auth', auth)

      if (panel) params.set('panel', panel)
      else params.delete('panel')

      if (query) params.set('q', query)
      else params.delete('q')

      // `popular` is omitted the way `postlogin` is: it is the page as drawn, and writing it
      // would put a parameter on every URL that says nothing.
      if (category === 'popular') params.delete('category')
      else params.set('category', category)

      const search = params.toString()
      const next = `${window.location.pathname}${search ? `?${search}` : ''}`
      if (next !== `${window.location.pathname}${window.location.search}`) {
        // The state object is what keeps this write invisible to the router — see the note at
        // the top. Passing `null` here is what made every menu link dead.
        window.history.replaceState(window.history.state, '', next)
      }
    }

    write()
    window.addEventListener('popstate', write)
    return () => window.removeEventListener('popstate', write)
  }, [auth, panel, query, category])

  return null
}
