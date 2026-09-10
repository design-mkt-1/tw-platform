/**
 * The search field, node `1:7365` — byte-identical in all four search frames.
 *
 * It lives in primitives because it is not the search panel's field, it is *the* field: the
 * sportsbook needs the same control, and the design draws one box in both places. So this
 * component owns the paint and the keyboard, and nothing else. It reads no store, holds no
 * state and knows nothing about panels — the caller owns the value.
 *
 * Measured (09-search-states.md §3.1, 25-gap-search-chrome.md §2):
 * 358 x 48, `#FFFFFF`, radius 24, a **2px** `#BFDBFE` border (every other border in the design
 * is 1px), `0 4px 8px rgba(59,130,246,0.1)`, `px 12`, `gap 12`. Placeholder and typed value are
 * the same Inter Medium 14 and differ only in colour — `#94A3B8` against `#102A67`. The caret is
 * `#3B82F6`, which is `caret-label` rather than a drawn 2 x 16 rectangle: the design's caret is
 * a screenshot of a real one. The size ships at 16, not 14 — see the input's own note.
 *
 * The form wrapper is what makes Enter commit. A bare input would need a keydown handler and
 * would give a phone keyboard no search key; `<form>` plus `enterKeyHint` gets both for free.
 */
interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  /** Enter, or the phone keyboard's search key. Receives the current value. */
  onSubmit: (value: string) => void
  /**
   * Also the accessible name. The design draws no visible label anywhere near this field, and
   * inventing a second Ukrainian string to name a box that already says what it is would put
   * two different names on one control.
   */
  placeholder: string
  /**
   * Draws `btn-close` (1:7390, 28 x 28) at the right edge when supplied.
   *
   * It is a *close the panel* control, not a *clear the field* one. That is read off the file
   * rather than assumed: the button is present in all four frames including the two where the
   * field is empty, and a clear button on an empty field would be a no-op the design chose to
   * draw three times. Optional because the sport page's copy of this field has no panel to
   * close.
   */
  onClose?: () => void
}

/**
 * The magnifier, exported because the search panel's empty state draws the same glyph at 28.
 *
 * The path is the one already committed as `search-header.svg`, redrawn inline for one reason:
 * the panel's magnifier is `#3B82F6` (measured in pixels, 25-gap-search-chrome.md §2) and the
 * committed asset has `#102A67` baked into its `fill`. A `next/image` cannot be recoloured, so
 * the choice was the wrong colour or an inline path. `currentColor` also means the two sizes
 * cannot drift apart.
 */
export function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M11.0275 19.486C11.1433 20.8741 11.6273 22.2061 12.4296 23.3448C13.2318 24.4834 14.3233 25.3875 15.5913 25.9638C16.8594 26.5401 18.2583 26.7677 19.6437 26.6231C21.029 26.4786 22.3508 25.9672 23.4726 25.1416L27.0023 28.6596C27.1646 28.8221 27.3714 28.9327 27.5965 28.9775C27.8217 29.0224 28.0551 28.9994 28.2672 28.9115C28.4793 28.8236 28.6605 28.6748 28.788 28.4839C28.9155 28.2929 28.9834 28.0684 28.9832 27.8388C28.9833 27.6865 28.9534 27.5355 28.8952 27.3947C28.837 27.2539 28.7516 27.1259 28.6439 27.0181L25.1258 23.4884C25.8791 22.4704 26.3742 21.2849 26.5687 20.0335C26.7632 18.7821 26.6513 17.5023 26.2427 16.3036C25.834 15.105 25.1407 14.0234 24.2223 13.1515C23.3038 12.2796 22.1876 11.6434 20.9694 11.2976C19.7512 10.9517 18.4672 10.9065 17.2276 11.1657C15.9881 11.425 14.8299 11.981 13.8524 12.7861C12.8748 13.5912 12.1072 14.6214 11.6152 15.7883C11.1232 16.9552 10.9215 18.224 11.0275 19.486ZM18.8322 13.3374C19.9221 13.3374 20.9875 13.6605 21.8937 14.2661C22.7999 14.8716 23.5062 15.7322 23.9233 16.7391C24.3404 17.746 24.4495 18.854 24.2369 19.923C24.0242 20.9919 23.4994 21.9738 22.7287 22.7445C21.9581 23.5151 20.9762 24.04 19.9072 24.2526C18.8383 24.4652 17.7303 24.3561 16.7234 23.939C15.7164 23.5219 14.8558 22.8156 14.2503 21.9094C13.6448 21.0032 13.3216 19.9378 13.3216 18.8479C13.3216 17.3864 13.9022 15.9848 14.9356 14.9514C15.969 13.9179 17.3707 13.3374 18.8322 13.3374Z" />
    </svg>
  )
}

export function SearchField({ value, onChange, onSubmit, placeholder, onClose }: SearchFieldProps) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        // A static export has nowhere to submit to, and the default would reload the page and
        // drop the whole panel.
        event.preventDefault()
        onSubmit(value)
      }}
      // No focus border: Sheet focuses this input on open, so a focus colour would repaint the
      // field in every search frame, and the design's focused field (it draws the caret) keeps
      // #BFDBFE. The caret is the focus cue. Recorded as an owner question, ux-audit B4-11.
      className="flex h-12 items-center gap-3 rounded-xl border-2 border-chip bg-surface px-3 shadow-field"
    >
      <SearchGlyph className="size-5 shrink-0 text-label" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        enterKeyHint="search"
        autoComplete="off"
        // `type="search"` is deliberately not used: Chrome adds its own clear button, which
        // would sit next to the design's, and its Escape-clears behaviour would swallow the
        // Escape that closes the sheet.
        //
        // 16px, not the design's 14 (`text-base` in this theme): iOS Safari zooms the page on
        // focus into any input below 16px and does not zoom back. A deliberate departure from
        // 1:7388 — not observed on a device here, there is no iOS device in this setup.
        className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-primary caret-label outline-none placeholder:text-placeholder"
      />

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити пошук"
          // The painted box is the design's 28 and stays 28. The `after` is a transparent
          // 44 x 44 target over it — the design's own hit area is below the minimum, and
          // growing the paint to fix that would not fit inside a 48px field.
          className="relative grid size-7 shrink-0 place-items-center rounded-close border border-chip bg-chip-link text-label transition-transform duration-100 after:absolute after:-inset-2 after:content-[''] active:scale-[0.97] motion-reduce:active:scale-100"
        >
          <svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-3.5"
          >
            <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
          </svg>
        </button>
      ) : null}
    </form>
  )
}
