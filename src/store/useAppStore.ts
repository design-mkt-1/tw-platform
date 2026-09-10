'use client'

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
  closePanel: () => void
  setCategory: (category: CategoryId) => void
  setQuery: (query: string) => void
  commitQuery: (query: string) => void
}

const RECENT_LIMIT = 4

export const useAppStore = create<AppState>((set) => ({
  auth: 'postlogin',
  panel: null,
  activeCategory: 'popular',
  query: '',
  recent: [],

  setAuth: (auth) => set({ auth }),

  openPanel: (panel) => set({ panel }),

  // Clearing the query on close is what makes the search reopen in its resting state rather
  // than showing the previous player's search.
  closePanel: () => set({ panel: null, query: '' }),

  setCategory: (activeCategory) => set({ activeCategory, panel: null }),

  setQuery: (query) => set({ query }),

  commitQuery: (query) =>
    set((state) => {
      const trimmed = query.trim()
      if (!trimmed) return state
      const recent = [trimmed, ...state.recent.filter((r) => r !== trimmed)].slice(0, RECENT_LIMIT)
      return { ...state, query: trimmed, recent }
    }),
}))
