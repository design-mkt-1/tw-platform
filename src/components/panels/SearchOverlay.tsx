'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { ProviderRow } from '@/components/casino/ProviderRow'
import { Icon } from '@/components/primitives/Icon'
import { SearchField, SearchGlyph } from '@/components/primitives/SearchField'
import { Sheet } from '@/components/primitives/Sheet'
import { PROVIDER_LOGOS } from '@/lib/assets'
import { GAMES, PROVIDERS } from '@/lib/data'
import { rankByName } from '@/lib/search'
import { useAppStore } from '@/store/useAppStore'
import type { CategoryId, Provider, ProviderId, SearchState } from '@/lib/types'

/**
 * The search panel — frames 1:7363, 1:7595, 1:7806 and 1:7214.
 *
 * Those are four frames of one component, and the thing that differs between them is derived,
 * never stored: an empty field with history draws `popular`, an empty field without it draws
 * `empty`, a query with matches draws `suggestions`, one without draws `no-results`. A
 * `searchState` field in the store would be a second source of truth for something the query
 * already answers, and the two would drift the first time a query changed without going
 * through whatever setter kept them in step.
 *
 * It renders inside the shared Sheet **without** `clearsNavBar`, so it covers the bottom
 * navigation. That is a decision, not a measurement: the design contains no frame showing the
 * search panel's relationship to the nav bar at all (the four frames are 336–571 tall and were
 * drawn free of any screen). Recorded here so it reads as chosen rather than overlooked.
 */

/**
 * Ukrainian copy, character for character from the frames (09-search-states.md §2). The four
 * section labels are stored mixed-case and uppercased in CSS; the two badges are stored
 * uppercase in the file and carry no transform. Shipping the rendered casing would break every
 * other locale, which is why the distinction is preserved rather than tidied.
 */
const COPY = {
  header: 'Провідні провайдери',
  placeholder: 'Пошук провайдерів...',
  popular: 'Популярні запити',
  recent: 'Нещодавні запити',
  suggestions: 'Відповідні пропозиції',
  topProviders: 'Топ провайдерів',
  notFoundTitle: 'Провайдерів не знайдено',
  notFoundBody: 'Спробуйте інший пошуковий запит',
  allProviders: 'Усі провайдери',
} as const

/** Nodes 1:7397–1:7405, in order. `Play'n GO` carries a straight apostrophe, U+0027. */
const POPULAR_QUERIES = ['Pragmatic', 'Evolution', 'NetEnt', 'Microgaming', "Play'n GO"] as const

/**
 * The two badge strings the design actually contains (1:7847, 1:7856). A `crash` or `popular`
 * game gets no badge rather than a translated one — inventing Ukrainian copy to fill a slot is
 * the one thing this project does not do. The gap is real: the design's two rows happen to be a
 * slots product and a live product, so nothing in the file says what a crash game would show.
 */
const BADGE: Partial<Record<CategoryId, string>> = {
  slots: 'СЛОТИ',
  'live-casino': 'ЛАЙВ',
}

/**
 * Which games each provider supplies, and which category it mostly supplies them in.
 *
 * Computed once at module scope over a 53-game array. The count is what the row's subtitle
 * shows and the category is what picking a row switches the page to, so both come from the same
 * data the grids are filtered from — a provider cannot advertise a count the catalogue does not
 * contain.
 */
const BY_PROVIDER = new Map<ProviderId, typeof GAMES>()
for (const game of GAMES) {
  const list = BY_PROVIDER.get(game.provider)
  if (list) list.push(game)
  else BY_PROVIDER.set(game.provider, [game])
}

function gamesByProvider(id: ProviderId) {
  return BY_PROVIDER.get(id) ?? []
}

/**
 * The category this provider supplies most, ignoring `popular` — every game in the catalogue
 * carries `popular` and it is already the default tab, so switching to it would look like
 * nothing happened.
 */
function dominantCategory(id: ProviderId): CategoryId {
  const counts = new Map<CategoryId, number>()
  for (const game of gamesByProvider(id)) {
    for (const category of game.categories) {
      if (category === 'popular') continue
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
  }
  let best: CategoryId = 'slots'
  let bestCount = -1
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category
      bestCount = count
    }
  }
  return best
}

export function SearchOverlay() {
  const panel = useAppStore((s) => s.panel)
  const query = useAppStore((s) => s.query)
  const recent = useAppStore((s) => s.recent)
  const setQuery = useAppStore((s) => s.setQuery)
  const commitQuery = useAppStore((s) => s.commitQuery)
  const closePanel = useAppStore((s) => s.closePanel)
  const setCategory = useAppStore((s) => s.setCategory)
  const pathname = usePathname()
  const router = useRouter()

  const fieldRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  /*
   * Providers, not games. Every string in this panel says provider — the header, the
   * placeholder, the empty state and the call to action — so returning games would answer a
   * different question from the one the panel asks. Five providers and a linear scan; memoising
   * it would cost more to read than it saves to run.
   */
  const hits = rankByName(query, PROVIDERS, (provider) => provider.name)

  const state: SearchState = query.trim()
    ? hits.length > 0
      ? 'suggestions'
      : 'no-results'
    : recent.length > 0
      ? 'popular'
      : 'empty'

  /**
   * ArrowDown out of the field and into the results.
   *
   * The handler sits on the wrapper rather than inside SearchField because the field is a
   * primitive the sport page will reuse, and "move focus into my results list" is a fact about
   * this panel, not about the control. Keydown bubbles, so the wrapper sees it.
   *
   * "First result" is whatever the current state put first — a suggestion row, a popular chip
   * or a recent query. All three are buttons.
   *
   * `[tabindex="0"]` is the fourth case and it is the whole of the `empty` state. A first-time
   * player has no recent queries, so `popular` never draws, and the only thing under the field
   * is the provider carousel — which is a `<ul tabIndex={0}>` (ProviderRow makes it focusable
   * because a scroll container that answers only to touch is an axe `scrollable-region-focusable`
   * violation, and that fails the deploy). Without this, ArrowDown in the empty state matched
   * nothing and did nothing. The carousel is the right landing place rather than a fallback: the
   * panel's own header calls it Провідні провайдери, so the providers ARE this panel's results.
   * `querySelector` returns document order, so a chip or a suggestion still wins where one exists.
   */
  function onFieldKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown') return
    const first = resultsRef.current?.querySelector<HTMLElement>('button, a[href], [tabindex="0"]')
    if (!first) return
    event.preventDefault()
    first.focus()
  }

  /**
   * Running a query from a chip, a recent entry or the CTA, and putting focus back in the field.
   *
   * The focus move is not a nicety. Every one of those controls can remove itself by running:
   * committing `Pragmatic` switches the panel to `suggestions`, where the chip row does not
   * exist. A focused element that unmounts drops focus to `<body>`, and from `<body>` the next
   * Tab lands on the first focusable node in the document — which is the page behind the sheet,
   * straight through the focus trap Sheet exists to provide. The field never unmounts, so it is
   * the one safe place to land, and it is also where a player who just picked a chip would want
   * to be.
   */
  function runQuery(value: string) {
    commitQuery(value)
    fieldRef.current?.querySelector('input')?.focus()
  }

  /**
   * Picking a result has to change something the player can see, or the whole funnel ends in a
   * panel closing.
   *
   * This demo has no game route — there is nothing to navigate to — so the visible change is
   * the page behind: the query goes into the recent list, the casino category bar switches to
   * the game's own category, and the panel closes. The category chosen is the first one that is
   * not `popular`, because every game in the catalogue carries `popular` and `popular` is
   * already the default tab, so picking it would look like nothing happened.
   *
   * Invented behaviour. The design wires none of these frames to anything (09-search-states.md
   * Q1 and Q4).
   */
  function pickProvider(provider: Provider) {
    commitQuery(provider.name)
    // The visible change is the page behind: switch the category bar to whatever this provider
    // mostly supplies, so closing the panel does not look like nothing happened.
    setCategory(dominantCategory(provider.id))
    // setCategory closes the panel but leaves the query; clearing it is what closePanel would
    // have done, and it is what makes the next open start clean.
    setQuery('')
    // The category bar exists only on `/`. Picked anywhere else — measured on /sport, 2026-09-10 —
    // the panel closed, the URL became `/sport?category=slots`, and nothing on screen changed. So
    // the pick takes the player to the page it changes. The store survives client navigation, and
    // the bridge `/` mounts treats a path change as a navigation: it closes panels and leaves
    // `activeCategory` alone, then writes it back as `?category=`.
    if (pathname !== '/') router.push('/')
  }

  return (
    <Sheet
      open={panel === 'search'}
      onClose={closePanel}
      label="Пошук"
      // Radius 24 on all four corners of all four root frames, fitted against supersampled
      // quarter-disc coverage (25-gap-search-chrome.md §1.2). The page shows through the
      // corners, which is what a panel drawn at 24 over a screen does.
      className="rounded-xl bg-search-panel"
    >
      {/*
       * x 16, top 20, bottom 20 — measured identically in all four frames
       * (09-search-states.md §3). docs/tokens.md §5.3 records this frame as a flat 16; the
       * per-frame measurement is the more specific one, so the 20 ships. The safe-area term is
       * ours: this panel covers the nav bar, so nothing else is reserving the home indicator.
       */}
      <div className="flex min-h-full flex-col gap-4 px-gutter pt-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
        {/* Field block, 358 x 88: header 24, gap 16, field 48. */}
        <div className="flex flex-col gap-4">
          <div className="flex h-6 items-center justify-between">
            <h2 className="font-roboto text-section-title font-medium text-title">{COPY.header}</h2>
            {/* The four 3x3 squares at 1:7380 are not built — see the return notes. Square 2 is
                #93C5FD, which is in no token in docs/tokens.md, and adding one means editing
                globals.css and tailwind.config.ts, which this area does not own. */}
          </div>

          <div ref={fieldRef} onKeyDown={onFieldKeyDown}>
            <SearchField
              value={query}
              onChange={setQuery}
              onSubmit={commitQuery}
              placeholder={COPY.placeholder}
              onClose={closePanel}
            />
          </div>
        </div>

        <div ref={resultsRef} className="flex flex-col gap-4">
          {/*
           * The chips show in `popular` AND in `no-results`. That is measured, and it is worth
           * not tidying: one of them is `Pragmatic`, which does return results, so this row is
           * a list of popular queries that happens to sit under a failed one — never a "did you
           * mean" list, and it must not be relabelled as one.
           */}
          {(state === 'popular' || state === 'no-results') && (
            <Labelled label={COPY.popular}>
              {/* flex-wrap, gap 8 on both axes: chips 1–4 fit row 1, chip 5 wraps alone. */}
              <ul className="flex flex-wrap gap-2">
                {POPULAR_QUERIES.map((name, index) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => runQuery(name)}
                      className={[
                        'flex h-[27px] items-center rounded-pill border px-3 text-xs font-medium',
                        'transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100',
                        // Alternating, not semantic: positions 1/3/5 blue, 2/4 orange. Nothing
                        // about Evolution or Microgaming makes them warm.
                        index % 2 === 0
                          ? 'border-chip bg-chip-info text-accent'
                          : 'border-warn bg-chip-warn text-chip-warn-text',
                      ].join(' ')}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </Labelled>
          )}

          {state === 'popular' && (
            <Labelled label={COPY.recent}>
              <ul className="flex flex-col gap-2">
                {recent.map((entry) => (
                  <li key={entry}>
                    {/*
                     * 358 x 32 pill. The design puts a 14 x 14 clear-btn at its right edge
                     * (1:7412) and it is not built: removing one entry needs a store action
                     * that does not exist, and the store is another area's file. Flagged in the
                     * return notes rather than faked with a button that does nothing.
                     */}
                    <button
                      type="button"
                      onClick={() => runQuery(entry)}
                      className="flex h-8 w-full items-center rounded-pill border border-chip bg-chip-info px-3 text-sm font-medium text-primary transition-transform duration-100 active:scale-[0.99] motion-reduce:active:scale-100"
                    >
                      {entry}
                    </button>
                  </li>
                ))}
              </ul>
            </Labelled>
          )}

          {state === 'suggestions' && (
            <Labelled label={COPY.suggestions}>
              <ul className="flex flex-col gap-2">
                {hits.map(({ item: provider }) => (
                  <li key={provider.id}>
                    <SuggestionRow provider={provider} onPick={pickProvider} />
                  </li>
                ))}
              </ul>
            </Labelled>
          )}

          {state === 'no-results' && (
            /* 1:7257 — centred column, gap 12, py 8. */
            <div className="flex flex-col items-center gap-3 py-2">
              {/*
               * 56 x 56, radius 28, 1px #BFDBFE, fill #EFF6FF — the same #EFF6FF as the panel
               * behind it, so it reads as a bare ring rather than a tinted circle. Measured
               * twice (both hexes), kept as drawn; whether it was intended is open.
               */}
              <span className="grid size-14 place-items-center rounded-icon-chip border border-chip bg-chip-link">
                <SearchGlyph className="size-7 text-label" />
              </span>

              <h3 className="text-center text-lg font-extrabold text-accent">
                {COPY.notFoundTitle}
              </h3>
              {/*
               * This copy names nothing off-screen. It says "try another query" and points at
               * one button, and the thing that button names — the providers — is the carousel
               * directly below it. The predecessor project shipped a no-results message that
               * sent players to "the categories below" when there were no categories below;
               * this one was checked against what is actually rendered.
               */}
              <p className="text-center text-sm font-medium leading-[1.4] text-body-muted">
                {COPY.notFoundBody}
              </p>

              <button
                type="button"
                // Where this goes is not in the design (09-search-states.md Q4) and there is no
                // providers route to send it to. So it resets the search, which lands the
                // player on the provider carousel already on screen — the second of the two
                // readings the inventory offers, and the only one that exists here.
                onClick={() => {
                  setQuery('')
                  fieldRef.current?.querySelector('input')?.focus()
                }}
                className="flex h-8 items-center rounded-pill bg-cta-search px-4 text-sm font-bold text-on-dark shadow-search-cta transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100"
              >
                {COPY.allProviders}
              </button>
            </div>
          )}

          {/*
           * The carousel is in all four frames. Only `no-results` labels it, which is measured
           * and reproduced. The design stacks TWO identical rows in the other three states —
           * the same five providers in the same order, a duplicate rather than a continuation —
           * and one row ships instead, per the repeated-placeholder rule.
           */}
          <div className="flex flex-col gap-2.5">
            {state === 'no-results' && (
              <h3 className="text-5xs font-bold uppercase text-label">{COPY.topProviders}</h3>
            )}
            <ProviderRow providers={PROVIDERS} />
            <CarouselIndicator />
          </div>
        </div>
      </div>
    </Sheet>
  )
}

/** Label 11px Inter Bold uppercase `#3B82F6`, 10px above its content. Four blocks use it. */
function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section aria-label={label} className="flex flex-col gap-2.5">
      <h3 className="text-5xs font-bold uppercase text-label">{label}</h3>
      {children}
    </section>
  )
}

/**
 * One suggestion row — 1:7843. Radius 12 on `#DBEAFE`, no border, padding 12, gap 12.
 *
 * **Both titles ship at 14.** The file has row 0 at 14 and row 1 at 15, confirmed in pixels by
 * cap-height (10px vs 11px of ink) and confirmed to be a hand-edited text node rather than a
 * variant — the subtitles, badges, padding and logos of the two rows are identical. 14 wins
 * three-to-one inside the frame and Inter Medium 15 appears nowhere else in the design. That is
 * a judgement, not something the file states, and it also removes the 56/57px row-height split.
 *
 * The row is a provider, as the design's is. Its subtitle is a game count computed from the
 * catalogue rather than the design's literal `245 ігор`, which is a placeholder over a
 * 53-game catalogue.
 */
function SuggestionRow({
  provider,
  onPick,
}: {
  provider: Provider
  onPick: (provider: Provider) => void
}) {
  const badge = BADGE[dominantCategory(provider.id)]
  const count = gamesByProvider(provider.id).length

  return (
    <button
      type="button"
      onClick={() => onPick(provider)}
      className="flex w-full items-center gap-3 rounded-slide bg-chip-info p-3 text-left transition-transform duration-100 active:scale-[0.99] motion-reduce:active:scale-100"
    >
      {/*
       * The design's 32px circle is named `circle-logo-placeholder`, declares no fill and holds
       * a plain ring. The real provider mark is already on disk, so it goes here instead — the
       * placeholder is the thing the design was waiting to replace.
       */}
      <Icon
        src={PROVIDER_LOGOS[provider.id]}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0"
      />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-base font-medium text-accent">{provider.name}</span>
        {/*
         * The design writes a game count here (`245 ігор`). An earlier pass recorded that as
         * having no source in this catalogue; it does — it is the number of games this provider
         * supplies, counted from the same data the grids are filtered from.
         */}
        <span className="truncate text-5xs font-medium text-subtle">{count} ігор</span>
      </span>

      {badge ? (
        <span className="flex h-[25px] shrink-0 items-center rounded-pill border border-warn bg-chip-warn px-3 text-5xs font-semibold text-badge-warn">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

/**
 * The four bars under the carousel — 1:7358. 40 / 24 / 16 / 8 wide, 4 tall, 4 apart, centred.
 *
 * It is the carousel's indicator, not part of the empty state: the casino hero's `1:3330` is
 * the same four widths, the same four fills and the same metrics, and both sit directly under a
 * row that overflows its 358px clip. So it renders wherever the carousel does, in all four
 * states, rather than only in the one frame that happens to draw it.
 *
 * `aria-hidden` because it is not operable and nothing in the file says which bar means
 * "current" — four bars over roughly 1.2 screens of scroll cannot be a page count.
 */
function CarouselIndicator() {
  return (
    <div aria-hidden="true" className="flex justify-center gap-1">
      <span className="h-1 w-10 rounded-hairline bg-dot-1" />
      <span className="h-1 w-6 rounded-hairline bg-dot-2" />
      <span className="h-1 w-4 rounded-hairline bg-dot-3" />
      <span className="h-1 w-2 rounded-hairline bg-dot-4" />
    </div>
  )
}
