import type { Config } from 'tailwindcss'

/**
 * Top-Win theme. Every name here resolves to a CSS variable declared in src/app/globals.css,
 * and every one of those variables is recorded in docs/tokens.md with the Figma node it was
 * measured on. Components use these names; raw hex under src/components/ is rejected by eslint.
 *
 * There is no breakpoint. The Figma file contains no desktop frame, no tablet frame and no
 * media query — every one of its eleven screens is 390 wide. A `mobile:` variant would be a
 * lie, so the design ships as a single fixed layout.
 */
export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Page and surfaces
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        header: 'var(--bg-header)',
        'search-panel': 'var(--bg-search-panel)',
        'menu-panel': 'var(--bg-menu-panel)',
        footer: 'var(--bg-footer)',
        'card-dark': 'var(--bg-card-dark)',
        slide: 'var(--bg-slide)',
        'game-card': 'var(--bg-game-card)',
        tint: 'var(--surface-tint)',
        track: 'var(--surface-track)',
        muted: 'var(--surface-muted)',
        row: 'var(--surface-row)',
        'footer-card': 'var(--surface-footer-card)',
        'footer-tile': 'var(--surface-footer-tile)',

        // Controls
        'chip-link': 'var(--chip-link-bg)',
        'chip-active': 'var(--chip-active)',
        'chip-info': 'var(--chip-info-bg)',
        'chip-warn': 'var(--chip-warn-bg)',
        'balance-pill': 'var(--balance-pill-bg)',
        avatar: 'var(--avatar-bg)',
        'copy-btn': 'var(--copy-btn-bg)',
        deposit: 'var(--deposit-btn-bg)',
        contact: 'var(--contact-accent)',
        'cta-search': 'var(--cta-search-bg)',
        'join-pill': 'var(--join-pill-bg)',
        'wager-badge': 'var(--wager-badge-bg)',
        'sport-badge': 'var(--sport-badge-bg)',
        'ticker-thumb': 'var(--ticker-thumb-bg)',
        'flag-scrim': 'var(--lang-flag-scrim)',
        'nav-plate': 'var(--nav-plate)',

        // Text
        title: 'var(--text-title)',
        primary: 'var(--text-primary)',
        navy: 'var(--text-navy)',
        'widget-title': 'var(--text-widget-title)',
        'muted-text': 'var(--text-muted)',
        meta: 'var(--text-meta)',
        'body-muted': 'var(--text-body-muted)',
        placeholder: 'var(--text-placeholder)',
        subtle: 'var(--text-subtle)',
        link: 'var(--text-link)',
        accent: 'var(--text-accent)',
        label: 'var(--text-label)',
        'count-active': 'var(--text-count-active)',
        'on-dark': 'var(--text-on-dark)',
        'nav-active': 'var(--text-nav-active)',
        'footer-heading': 'var(--text-footer-heading)',
        'footer-link': 'var(--text-footer-link)',
        'win-up': 'var(--text-win-up)',
        'win-alt': 'var(--text-win-alt)',
        'badge-warn': 'var(--text-badge-warn)',
        'chip-warn-text': 'var(--text-chip-warn)',
        promo: 'var(--text-promo)',
        'tournament-title': 'var(--text-tournament-title)',
        'banner-offer': 'var(--text-banner-offer)',
        'banner-badge': 'var(--text-banner-badge)',
        more: 'var(--text-more)',

        // Icons and accents
        'icon-section': 'var(--icon-section)',
        'id-label': 'var(--text-id-label)',
        'icon-menu-row': 'var(--icon-menu-row)',
        'icon-chevron': 'var(--icon-chevron)',
        'star-active': 'var(--icon-star-active)',
        live: 'var(--icon-live)',
        hot: 'var(--accent-hot)',
        'dot-1': 'var(--dot-1)',
        'dot-2': 'var(--dot-2)',
        'dot-3': 'var(--dot-3)',
        'dot-4': 'var(--dot-4)',
      },

      borderColor: {
        chip: 'var(--border-chip)',
        warn: 'var(--border-warn)',
        divider: 'var(--border-divider)',
        'ticker-divider': 'var(--border-ticker-divider)',
        footer: 'var(--border-footer)',
        panel: 'var(--border-panel)',
        'on-dark-06': 'var(--border-on-dark-06)',
        'on-dark-08': 'var(--border-on-dark-08)',
        'on-dark-09': 'var(--border-on-dark-09)',
        'on-dark-10': 'var(--border-on-dark-10)',
        promo: 'var(--border-promo)',
      },

      backgroundImage: {
        cta: 'var(--grad-cta)',
        'nav-button': 'var(--grad-nav-button)',
        'promo-badge': 'var(--grad-promo-badge)',
        'flag-active': 'var(--grad-flag-active)',
        'nav-plate-stroke': 'var(--grad-nav-plate-stroke)',
      },

      boxShadow: {
        cta: 'var(--shadow-cta)',
        'vip-badge': 'var(--shadow-vip-badge)',
        card: 'var(--shadow-card)',
        'chip-active': 'var(--shadow-chip-active)',
        provider: 'var(--shadow-provider)',
        fab: 'var(--shadow-fab)',
        field: 'var(--shadow-field)',
        'search-cta': 'var(--shadow-search-cta)',
        deposit: 'var(--shadow-deposit)',
        container: 'var(--shadow-container)',
        'promo-badge': 'var(--shadow-promo-badge)',
      },

      /**
       * Two families ship: Inter and Roboto, both with the cyrillic subset.
       *
       * `outfit` is kept as a name and deliberately resolves to Inter. The design assigns
       * Outfit to four buttons, but Outfit has no Cyrillic subset and all four of its strings
       * are Cyrillic — so Figma was already falling back. Keeping the name marks every call
       * site the substitution touches, and makes swapping in a Cyrillic-capable face a
       * one-line change here rather than a hunt through components. See docs/tokens.md §4.1.
       */
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'var(--font-inter)', 'sans-serif'],
        outfit: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      /** Fixed geometry the design repeats. Every value has a node in docs/tokens.md §5.3. */
      spacing: {
        gutter: '16px', // every section starts at x 16 and is 358 wide
        'card-w': '114px', // game card, 1:3575
        'card-h': '148px',
        'nav-bar': 'var(--nav-bar-h)', // the painted plate, 68
        'nav-frame': 'var(--nav-frame-h)', // plate plus the raised button's overhang, 111
      },

      borderRadius: {
        hairline: '2px',
        wager: '3.318px', // 1:3316
        sm: '6px',
        md: '8px',
        chip: '10px',
        slide: '12px',
        track: '13px',
        close: '14px',
        card: '15px', // 1:3575 — looks like 11 if you trace first ink, it is not
        lg: '16px',
        'league-card': '20px',
        xl: '24px',
        'icon-chip': '28px',
        pill: '100px',
        full: '999px',
      },

      fontSize: {
        // Only the sizes the design actually uses, with their measured line-heights.
        '7xs': ['7.741px', { lineHeight: 'normal' }], // the ✦ spans in 1:3311
        '6xs': ['10px', { lineHeight: 'normal' }],
        '5xs': ['11px', { lineHeight: 'normal' }],
        'nav-label': ['12px', { lineHeight: '14.143px' }], // 1:6493 — literal, not a ratio
        xs: ['12px', { lineHeight: 'normal' }],
        'ticker-amount': ['12px', { lineHeight: '22px' }], // 1:3396
        sm: ['13px', { lineHeight: 'normal' }],
        chip: ['13px', { lineHeight: '1.35' }], // 1:3342
        'menu-row': ['13px', { lineHeight: '20px' }], // 1:6865
        footnote: ['13px', { lineHeight: '16px' }], // variable Capation1
        base: ['14px', { lineHeight: 'normal' }],
        'footer-link': ['14px', { lineHeight: '16px' }], // variables Footnote_e / Footnote_m
        md: ['15px', { lineHeight: 'normal' }],
        lg: ['16px', { lineHeight: '1.2' }],
        id: ['17px', { lineHeight: '22px' }], // 1:6841
        'section-title': ['18px', { lineHeight: 'normal' }], // 1:4318
        'footer-heading': ['18px', { lineHeight: '22px' }], // 1:5610
        '2xl': ['22px', { lineHeight: 'normal' }],
        '3xl': ['25px', { lineHeight: 'normal' }],
        '4xl': ['28px', { lineHeight: 'normal' }], // 1:5232
      },

      letterSpacing: {
        outfit: '-0.2px', // the live button tracking, 1:3296 — exactly -0.0154em at 13px
        title: '-0.5px', // 1:5232
        join: '-0.26px', // 1:5235
        wager: '0.2765px', // 1:3317
        promo: '0.5529px', // 1:3311
        vip: '1.5px', // 1:6834
      },
    },
  },
  plugins: [],
} satisfies Config
