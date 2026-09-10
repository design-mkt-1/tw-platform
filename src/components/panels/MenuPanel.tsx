'use client'

import Link from 'next/link'
import { Button } from '@/components/primitives/Button'
import { Icon } from '@/components/primitives/Icon'
import { Sheet } from '@/components/primitives/Sheet'
import { LANGUAGE_FLAGS, LOGO, MENU_ICONS, type MenuIconName } from '@/lib/assets'
import { USER } from '@/lib/data'
import { useAppStore } from '@/store/useAppStore'

/**
 * The slide-in menu, the panel the raised centre button opens.
 *
 * Three frames, one component: `1:6641` (390x764), `1:6816` VIP (390x847), `1:7015` (390x847).
 * Everything from the menu body down is byte-identical across all three — same child names, same
 * offsets, same order — so the only real difference is the band under the header: two auth
 * buttons pre-login, an identity block post-login, and a VIP badge inside that block or not.
 * `1:6641` is named "postlog" in Figma and is the logged-OUT panel; the label lies, the content
 * does not.
 *
 * It renders inside Sheet with `clearsNavBar`, which is measured rather than chosen: the panel
 * stops at y 656 / 742 in a 764 / 847 frame and the navbar instance sits ON TOP of it, fully
 * lit, in its "Меню" active state. No scrim, no dimming, no overlay of any kind.
 *
 * Two things the design does NOT contain, recorded so nobody adds them back from memory:
 * there is no balance figure in any of the three panels (avatar, optional VIP pill, username
 * and numeric ID is the whole of it — Deposit is a button, not a number), and there is no
 * expanded state anywhere for the three chevron rows or for the "More" toggle.
 *
 * Colours are shipped as measured, including two that fail WCAG badly: the gold glow
 * `rgba(198,144,61,0.25)` on the GREEN deposit button (`--shadow-deposit`, node 1:6836) and the
 * `#10B981` contact pair at 2.35:1 and 2.54:1. Both are in docs/tokens.md §7.1.
 */

/* --- glyphs ---------------------------------------------------------------- *
 * STILL PLACEHOLDERS: the avatar user (1:6828), the copy icon (1:6844), the close x (1:6822),
 * the "More" arrow (1:6850) and the two contact icons. Those six were not exported — their
 * Figma URLs are listed in the inventory's 24-gap-menu-type.md §7 and expire 7 days from
 * 2026-09-10. They are drawn inline so the panel is not full of holes, and they take their
 * colour from `currentColor` so swapping in the real exports changes markup only, never a
 * colour.
 *
 * The eight row icons and the Terms document icon are NO LONGER placeholders — they are the
 * real exports, in MENU_ICONS, painted as masks (see `maskStyle`). The UK flag never was one:
 * it is the footer's own asset, reused.
 *
 * `profile` stays in this list because it draws the 24px AVATAR glyph, which is node 1:6828 and
 * a different asset from the 15px PROFILE row icon that now comes out of MENU_ICONS.
 */
const GLYPHS = {
  profile: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.5c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="2.5" y="12.5" width="4.5" height="6.5" rx="2.25" />
      <rect x="17" y="12.5" width="4.5" height="6.5" rx="2.25" />
    </>
  ),
  chat: <path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.3A9 9 0 1 0 12 3Z" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
} as const

type GlyphName = keyof typeof GLYPHS

function Glyph({ name, size, className }: { name: GlyphName; size: number; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className ?? ''}`}
    >
      {GLYPHS[name]}
    </svg>
  )
}

/**
 * Only the shape comes from the file; `background-color` paints it.
 *
 * The exports have `#1677E8` baked in, so an `<img>` could never follow a token, a state or a
 * theme — and this panel needs it to, because the same blue is the row icons at 50% and the
 * Terms doc at 25%. SportFilterRow.tsx solves the identical problem the identical way for the
 * sport pills, where the icons ship pre-coloured for the state they were exported from. Two
 * copies of ten lines; worth lifting into src/lib the moment a third component needs it.
 */
function maskStyle(src: string) {
  return {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  } as const
}

/* --- rows ------------------------------------------------------------------ *
 * Source strings are the Figma layer names, character for character — `sport`, `Casino`,
 * `MY Bonuses`, `promotions`. Every row carries Figma text-case UPPER, i.e. a transform, while
 * the stored string is lower/mixed case; shipping the rendered form would break every other
 * locale (24-gap-menu-type.md §2). The uppercase happens in CSS, below.
 *
 * NO CHEVRON IS DRAWN, on any row. The design gives SPORT, CASINO and PAYMENTS a
 * `weui:arrow-filled` in `#626A7A`, all three in the collapsed orientation, and the file
 * contains no expanded state for any of them anywhere. Building an accordion would be
 * inventing three screens; drawing the chevron without one promises an expansion that never
 * arrives, on rows that in fact navigate. So the chevron is dropped and the rows are links.
 * Recorded here rather than in a commit message because it is a visible departure from Figma.
 */
interface MenuRow {
  label: string
  href: string
  icon: MenuIconName
}

const ROWS: MenuRow[] = [
  { label: 'sport', href: '/sport', icon: 'sport' },
  { label: 'Casino', href: '/', icon: 'casino' },
  { label: 'Referral program', href: '/referral', icon: 'referral' },
  { label: 'MY Bonuses', href: '/bonuses', icon: 'bonuses' },
  { label: 'promotions', href: '/promotions', icon: 'promotions' },
  { label: 'cashback', href: '/cashback', icon: 'cashback' },
  { label: 'payments', href: '/payments', icon: 'payments' },
  { label: 'Profile', href: '/profile', icon: 'profile' },
]

/** The only two routes this demo has; every other href in the design is dead by design. */
const REAL_ROUTES = new Set(['/', '/sport'])

export function MenuPanel() {
  const panel = useAppStore((s) => s.panel)
  const auth = useAppStore((s) => s.auth)
  const closePanel = useAppStore((s) => s.closePanel)

  return (
    <Sheet open={panel === 'menu'} onClose={closePanel} label="Меню" clearsNavBar>
      {/*
        `min-h-full` rather than `h-full`: the panel is 656 / 742 tall and the sheet is the
        viewport minus the painted nav bar, so on a tall phone the grey has to grow and on the
        design's own 764 frame the content has to scroll. Both fall out of this one class.
        `border-r` is 1:6817's declared `border-right: 1px solid #D8DDE7` — off-screen at 390,
        kept because it is the panel's own edge and a wider viewport shows it.
      */}
      <div className="flex min-h-full flex-col border-r border-panel bg-menu-panel">
        <PanelHeader onClose={closePanel} />
        {auth === 'prelogin' ? <AuthBand /> : <IdentityBand vip={auth === 'vip'} />}
        <MenuBody onNavigate={closePanel} prelogin={auth === 'prelogin'} />
      </div>
    </Sheet>
  )
}

/** 1:6643 — 390x60, white, 16px gutter, logo left and the close circle right. */
function PanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between bg-surface px-gutter">
      <Icon src={LOGO} alt="Top-Win" width={111} height={20} />
      {/* 1:6821 — 40x40, radius 100 (a circle at this size), fill #EFF6FF, 1px #BFDBFE border
          that no pixel pass could separate from the fill, 14x14 glyph in #3B82F6. */}
      <button
        type="button"
        aria-label="Закрити"
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-pill border border-chip bg-chip-link text-label transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100"
      >
        <Glyph name="close" size={14} />
      </button>
    </header>
  )
}

/**
 * 1:6649 — the pre-login band, 390x62 white: 12 top, a 38px button pair, 12 bottom.
 *
 * Neither button has a flow behind it, the same as the two in the app header, so neither
 * carries a handler. The design writes `Реєстарція` (а and р transposed) and the owner's
 * decision is that obvious typos are corrected on the way in, exactly as Header.tsx does.
 */
function AuthBand() {
  return (
    <div className="flex shrink-0 gap-2 bg-surface px-gutter py-3">
      {/* 1:6651 — radius 8, #EDF5FF. Its declared `py: 6.606` is a Figma centring artefact. */}
      <Button variant="muted" className="h-[38px] flex-1 text-sm capitalize">
        Увійти
      </Button>
      {/* 1:6653 — radius 6, the CTA gradient, drop-shadow rgba(255,69,0,0.33) + inset highlight. */}
      <Button variant="cta" className="h-[38px] flex-1 text-sm capitalize">
        Реєстрація
      </Button>
    </div>
  )
}

/**
 * 1:6824 / 1:7023 — 390x148, **white**, radius 10, px 16 / pt 12 / pb 8, gap 8.
 *
 * The band is `--bg-surface`, not `--surface-tint`: measured twice, as a flat #FFFFFF pixel run
 * from y 60 to 207 on the 1:6816 render and as a declared `bg-white` in the emitted code. The
 * tinted #E8F1FC rectangle inside it is the ID field 1:6838, which is a different node.
 *
 * `vip` is the whole of the 1:6816 / 1:7015 difference. The badge sits ON ITS OWN LINE above the
 * username, not beside it, and the non-VIP variant re-centres the username in the same 52px
 * profile-section rather than moving anything else.
 */
function IdentityBand({ vip }: { vip: boolean }) {
  return (
    <div className="shrink-0 rounded-chip bg-surface px-gutter pb-2 pt-3">
      {/* 1:6825 — 358x52, gap 12. The declared `py: 16` cannot be true of a 52px row holding a
          48px avatar; `items-center` reproduces the measured y of 74 in a section at 72. */}
      <div className="flex h-[52px] items-center gap-3">
        {/* 1:6826 — 48x48 wrapper, radius 24, #DDE2ED, holding a 24x24 user glyph. */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-avatar text-primary">
          <Glyph name="profile" size={24} />
        </div>

        {/* 1:6830 — flex column, gap 4. `min-w-0` is what lets the username's ellipsis fire. */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {vip ? <VipBadge /> : null}
          {/* 1:6835 — Inter Bold 14, #102A67, overflow hidden + ellipsis + nowrap, declared. */}
          <p className="truncate font-sans text-base font-bold text-primary">{USER.username}</p>
        </div>

        {/* 1:6836 — 113x38, radius 8, #00B579, px 24, and a GOLD glow: the measured shadow is
            drop-shadow(0 4px 6px rgba(198,144,61,0.25)), i.e. #C6903D at 25% on a green button.
            That is declared Figma data, not a transcription slip, and it ships as drawn. The
            `deposit` variant carries the glow; radius 8 overrides the variant's 6. */}
        <Button variant="deposit" className="h-[38px] w-[113px] shrink-0 rounded-md px-6 text-xs">
          DEPOSIT
        </Button>
      </div>

      <IdField />
      <MoreToggle />
    </div>
  )
}

/** 1:6832 — 59x23, radius 6, the CTA gradient, `--shadow-vip-badge`, a ★ text node and `VIP`. */
function VipBadge() {
  // 12 + 13 + 22 + 12 = 59: the two runs are flush, there is no gap between them.
  return (
    <span className="inline-flex h-[23px] w-fit items-center rounded-sm bg-cta px-3 text-on-dark shadow-vip-badge">
      {/* 1:6833 is a text node, not an asset: Inter Bold 12. 1:6834 is Inter Bold 11 / 1.5px. */}
      <span aria-hidden className="font-sans text-xs font-bold leading-none">
        ★
      </span>
      <span className="font-sans text-5xs font-bold leading-none tracking-vip">VIP</span>
    </span>
  )
}

/**
 * 1:6838 — 358x40, radius 8, #E8F1FC, px 8 / py 6, space-between.
 *
 * The copy button is 34x34, which is below the 44px hit target and is one of the four the
 * design draws that way (docs/tokens.md §8). It is left at its drawn size; the padding around
 * it is the field's, so growing the target would move the field.
 */
function IdField() {
  return (
    <div className="mt-2 flex h-10 items-center justify-between rounded-md bg-tint px-2">
      {/* 1:6840 — gap 6. Both runs are Inter Regular 17/22; only the colour differs. */}
      <p className="flex items-baseline gap-1.5 font-sans text-id">
        <span className="text-id-label">ID:</span>
        <span className="text-primary">{USER.id}</span>
      </p>
      {/*
        1:6843 — 34x34, radius 6, fill rgba(216,221,231,0.6), which composites over the field to
        the #DFE5F0 the pixel pass read. The design draws no "copied" confirmation, so this
        writes to the clipboard and says nothing — inventing a toast would be inventing a
        component. Recorded in the return value.
      */}
      <button
        type="button"
        aria-label={`Копіювати ID ${USER.id}`}
        onClick={() => navigator.clipboard?.writeText(USER.id)}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-sm bg-copy-btn text-navy transition-transform duration-100 active:scale-[0.97] motion-reduce:active:scale-100"
      >
        <Glyph name="copy" size={16} />
      </button>
    </div>
  )
}

/**
 * 1:6847 — a down-chevron and the word More, centred under the ID field, Roboto Bold 12/16.
 *
 * **It is not a control here.** It is the collapsed half of a two-state identity block whose
 * expanded half does not exist at any node in the file — no extra account fields, no second
 * frame, nothing. A button that opens nothing is worse than a label, so it ships as a label
 * until the expanded state is designed.
 *
 * The stored string is `Моre`, with CYRILLIC М (U+041C) and о (U+043E) — confirmed in the text
 * CONTENT, not only in the layer name, by a codepoint dump of the node. It renders identically
 * to `More` and breaks any exact-match i18n key, search or test that types Latin, so the Latin
 * form ships and the Figma node needs correcting.
 */
function MoreToggle() {
  return (
    <p className="mt-2 flex h-5 items-center justify-center gap-1 font-roboto text-xs font-bold leading-4 text-more">
      <Glyph name="chevronDown" size={20} />
      More
    </p>
  )
}

/** 1:6655 / 1:6854 — the grey body, 390 wide, px 16 / py 10. Its three blocks are contiguous. */
function MenuBody({ onNavigate, prelogin }: { onNavigate: () => void; prelogin: boolean }) {
  return (
    <div className="flex flex-1 flex-col px-gutter py-[10px]">
      {/*
        Two declared gaps, not one: 1:6856 holds SPORT and CASINO at gap 8 and nests 1:6908,
        which holds rows 3-8 at gap 6. The earlier pass read pitches of 52,52,50,50,50,50,50 and
        could not tell which were deliberate. They are.
      */}
      <nav aria-label="Меню">
        <ul className="flex flex-col gap-2">
          {ROWS.slice(0, 2).map((row) => (
            <li key={row.href}>
              <Row row={row} onNavigate={onNavigate} />
            </li>
          ))}
          <li>
            <ul className="flex flex-col gap-[6px]">
              {ROWS.slice(2).map((row) => (
                <li key={row.href}>
                  <Row row={row} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      <TermsAndLanguageRow onNavigate={onNavigate} />
      <ContactRow onNavigate={onNavigate} prelogin={prelogin} />
    </div>
  )
}

/**
 * One menu row — 1:6857 and its seven siblings. 44 tall, radius 8, #E8F1FC, px 12, gap 10,
 * a 15x15 icon and a Roboto Medium 13/20 label rendered ALL CAPS.
 *
 * **All eight icons are one colour at one opacity**, which the export pass settled and the
 * earlier inventory had wrong. Seven declare `fill="#1677E8"` inside a group at `opacity="0.5"`;
 * REFERRAL declares `fill="#7FB4F2"` with no opacity group, which is that same blue already
 * blended 50% into the row fill. There is no dim row and no bright row. `--icon-menu-row` is now
 * the paint `#1677E8` and the 0.5 lives here — see docs/tokens.md §3.3.
 *
 * All eight are built at 44. Rows 1, 2 and 7 declare a 46px child inside a 44px container that
 * Figma does not clip, so the child overflows by 2px — confirmed as a file bug, not a design.
 *
 * `onNavigate` is not decoration. Tapping CASINO while already on the casino page navigates
 * nowhere, and without this the panel stays open on top of the page it was meant to reveal.
 * That exact bug shipped in the predecessor project, which is why it is on every row rather
 * than on the two that change route.
 */
function Row({ row, onNavigate }: { row: MenuRow; onNavigate: () => void }) {
  return (
    <Link
      href={row.href}
      prefetch={REAL_ROUTES.has(row.href) ? undefined : false}
      onClick={onNavigate}
      className="flex h-11 items-center gap-[10px] rounded-md bg-tint px-3 transition-transform duration-100 active:scale-[0.99] motion-reduce:active:scale-100"
    >
      <span
        aria-hidden="true"
        style={maskStyle(MENU_ICONS[row.icon])}
        className="h-[15px] w-[15px] shrink-0 bg-icon-menu-row opacity-50"
      />
      <span className="font-roboto text-menu-row font-medium uppercase text-primary">
        {row.label}
      </span>
    </Link>
  )
}

/**
 * 1:6960 — 46 tall, no fill, the panel showing through. Terms left, language right.
 *
 * The two clusters are drawn at x 48..170 and x 237..325 in a 16..374 column. No single flex
 * rule reproduces both exactly; centring each in its own half lands within 2.5px on both, which
 * is the closest simple reading of a layout the file states only as absolute offsets.
 */
function TermsAndLanguageRow({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-[46px] items-center px-3">
      <Link
        href="/terms"
        prefetch={false}
        onClick={onNavigate}
        className="flex flex-1 items-center justify-center gap-[10px] text-primary"
      >
        {/*
          1:6962 is the row-icon blue through TWO 50% steps: `stroke="#7FB4F2"`, which is
          `--icon-menu-row` already blended 50% into the row fill, inside a group at
          `opacity="0.5"`. It has no token of its own, so it is drawn as the paint at 0.25.
          That lands on #BDD6F6 against the design's #BAD5F6 — 3/255 on one channel, the
          difference between the #E8F1FC the blend was baked against and the #F4F6FA behind
          this row. A dedicated token would be exact; one icon did not earn one.
        */}
        <span
          aria-hidden="true"
          style={maskStyle(MENU_ICONS.terms)}
          className="h-[22px] w-[22px] shrink-0 bg-icon-menu-row opacity-25"
        />
        <span className="font-roboto text-menu-row font-medium uppercase">Terms of Use</span>
      </Link>

      {/*
        1:6968 is a 24x24 circle carrying a dark scrim, rgba(17,20,24,0.2), under full-colour
        flag art. The flag itself is the footer's own union-jack export rather than a re-export
        of 1:6969, which Figma only emits as a circle plus two masks plus art.
        `ENGLISH` is stored uppercase AND carries the transform; both are reproduced.

        Not a control. The flag plus a language name implies a picker and the file contains no
        picker frame, the same reason Footer.tsx renders its three flags as a list rather than
        as buttons. One undesigned affordance, one decision, in both places.
      */}
      <div className="flex flex-1 items-center justify-center gap-[10px] text-primary">
        <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full bg-flag-scrim">
          <Icon
            src={LANGUAGE_FLAGS['union-jack']}
            alt=""
            width={24}
            height={24}
            className="h-full w-full object-cover"
          />
        </span>
        <span className="font-roboto text-menu-row font-medium uppercase">ENGLISH</span>
      </div>
    </div>
  )
}

/**
 * 1:6982 — the contact pair. Two 168x38 buttons, gap 8, inset 7 from the 358 column: Support is
 * the outlined variant and Vip Manager the filled one, both on `--contact-accent` #10B981.
 * `Vip Manager` is exactly that, not `VIP Manager`, and neither string is transformed.
 *
 * The 7px inset is arithmetic from the measured x of 23 and 199 (168 + 8 + 168 = 344 in 358).
 * The declared `px: 12` on this row cannot be true of buttons that measure 168 wide; the two
 * passes disagree and the geometry decides.
 *
 * Pre-login shows Support alone, at its drawn width rather than stretched — a lone full-bleed
 * button is a layout the design does not contain. The design itself draws Vip Manager in the
 * logged-out frame too; offering a VIP manager to a visitor with no account is the kind of
 * obvious slip the owner has said to fix.
 */
function ContactRow({ onNavigate, prelogin }: { onNavigate: () => void; prelogin: boolean }) {
  return (
    <div className={`flex gap-2 px-[7px] py-4 ${prelogin ? 'justify-center' : ''}`}>
      <Link
        href="/support"
        prefetch={false}
        onClick={onNavigate}
        className={`flex h-[38px] items-center justify-center gap-1.5 rounded-sm border border-contact px-5 font-roboto text-sm leading-[18px] text-contact ${
          prelogin ? 'w-[168px]' : 'flex-1'
        }`}
      >
        <Glyph name="headset" size={16} />
        Support
      </Link>

      {prelogin ? null : (
        <Link
          href="/vip-manager"
          prefetch={false}
          onClick={onNavigate}
          className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-sm bg-contact px-5 font-roboto text-sm leading-[18px] text-on-dark"
        >
          <Glyph name="chat" size={16} />
          Vip Manager
        </Link>
      )}
    </div>
  )
}
