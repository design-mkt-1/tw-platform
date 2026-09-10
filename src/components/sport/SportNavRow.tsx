import { INERT } from '@/components/primitives/Button'

/**
 * The Спорт / Кіберспорт switcher plus the Favorites and Gifts buttons — node 1:6016, a child
 * of 1:6007 (see PrematchLiveToggle).
 *
 * Widths add up exactly at 390: 254 + 8 + 44 + 8 + 44 = 358, the page's content width. Below
 * 390 the switch is the part that gives (`flex-1 min-w-0`, chips `flex-1`), so the two 44px
 * buttons keep their size and the 16px gutter holds: at 375 a fixed 254 pushed 🎁 to x 374.
 *
 * **Кіберспорт is inert** (owner's decision of 2026-09-10): there is no e-sport list in the file
 * to switch to, so it is `aria-disabled` with `INERT` and Спорт stays pressed. No state is held.
 *
 * The active chip is the same recipe as the casino category bar — fill `--chip-active`, no
 * border, `--shadow-chip-active` — and the label is `--text-primary` in both states. That fill
 * is 1.23:1 against the track it sits on, so `aria-pressed` is carrying real weight here, not
 * decorating a visual that already works.
 *
 * The ★ and 🎁 are TEXT, not assets: U+2605 at Inter 25px and U+1F381 at Inter 22px. There is
 * no vector for either anywhere in the file.
 */

const SWITCHER = [
  /** 1:6020 / 1:6022 — literal strings. */
  { id: 'sport', label: 'Спорт' },
  { id: 'esport', label: 'Кіберспорт' },
] as const

/**
 * 1:6023 and 1:6025 have a resting state and nothing else — no target, no active variant, no
 * count or badge. `aria-disabled` says that out loud instead of drawing a control that swallows
 * a tap, the same call SectionHeader makes for the see-all pill. Both accessible names are
 * INVENTED: the design labels these with a glyph only.
 */
const ICON_BUTTON =
  'flex h-11 w-11 shrink-0 cursor-default items-center justify-center rounded-track bg-tint'

export function SportNavRow() {
  return (
    <div className="flex h-[76px] items-center overflow-hidden px-gutter py-2">
      <div className="flex flex-1 items-center gap-2">
        {/* 1:6018 — 254x44 at 390, radius 13, 4px padding, 4px gap. */}
        <div className="flex h-11 min-w-0 flex-1 gap-1 rounded-track bg-tint p-1">
          {SWITCHER.map((item) => {
            const isActive = item.id === 'sport'

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isActive}
                aria-disabled={isActive ? undefined : true}
                className={[
                  // 121 wide at 390 = (254 − 2×4 − 4) / 2.
                  'flex h-9 min-w-0 flex-1 items-center justify-center rounded-chip',
                  'text-chip text-primary',
                  isActive ? 'bg-chip-active shadow-chip-active' : INERT,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* 1:6023 — ★ U+2605, Inter Regular 25px, --icon-star-active. */}
        <button type="button" aria-disabled="true" aria-label="Обране" className={ICON_BUTTON}>
          <span aria-hidden="true" className="text-3xl leading-none text-star-active">
            ★
          </span>
        </button>

        {/* 1:6025 — 🎁 U+1F381, Inter Regular 22px. Its declared #000000 is moot: the emoji
            renders from the platform's colour font, which is what Figma drew too. */}
        <button type="button" aria-disabled="true" aria-label="Подарунки" className={ICON_BUTTON}>
          <span aria-hidden="true" className="text-2xl leading-none">
            🎁
          </span>
        </button>
      </div>
    </div>
  )
}
