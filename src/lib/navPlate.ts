/**
 * The bottom nav plate, drawn for the width it is shown at. Owner's decision of 2026-09-10,
 * option A in docs/mockups/nav-notch: above and below 390 only the flat runs of the plate change
 * length. The notch keeps the design's shape, so the ring round the Меню button stays
 * 7.7 + 6.7px at every width instead of opening to 16.8 + 15.6 at 480.
 *
 * FILL and RIM are the two paths of public/images/nav/nav-bar-plate.svg (1:6490) verbatim, in its
 * 391x69 box with 0.5px of stroke bleed, so at 390 the result is the export. Every x falls in one
 * of three runs, and each run has one rule:
 * - x < 100, the left corners and the start of the left flat: unchanged;
 * - 100..300, the notch: moves by 48.169% of the extra width, the same line BottomNavBar's centre
 *   button rides (`left: calc(48.169% - 31.859px)`), so the button stays centred in it;
 * - x > 300, the right corners: move with the right edge.
 * The flat runs between them are single `H` segments, so they simply get longer.
 */
const FILL =
  'M378 0.5C384.903 0.500086 390.5 6.09649 390.5 13V56.5C390.5 63.1274 385.127 68.5 378.5 68.5H12.5C5.87258 68.5 0.5 63.1274 0.5 56.5V13C0.5 6.09644 6.09644 0.5 13 0.5H148.809C151.759 0.5 154.606 1.58671 156.805 3.55258L177.243 21.8184C183.055 27.0128 192.024 27.0576 197.893 21.9219L218.977 3.46981C221.164 1.5553 223.973 0.5 226.88 0.5H378Z'
const RIM =
  'M378 0.5V0V0V0.5ZM177.243 21.8184L176.91 22.1912V22.1912L177.243 21.8184ZM197.893 21.9219L197.563 21.5456V21.5456L197.893 21.9219ZM218.977 3.46981L219.306 3.84607L218.977 3.46981ZM156.805 3.55258L157.138 3.17977L156.805 3.55258ZM378 0.5V1C384.627 1.00008 390 6.37264 390 13H390.5H391C391 5.82035 385.18 8.93474e-05 378 0V0.5ZM390.5 13H390V56.5H390.5H391V13H390.5ZM378.5 68.5V68H12.5V68.5V69H378.5V68.5ZM0.5 56.5H1V13H0.5H0V56.5H0.5ZM0.5 13H1C1 6.37258 6.37258 1 13 1V0.5V0C5.8203 0 0 5.8203 0 13H0.5ZM13 0.5V1H148.809V0.5V0H13V0.5ZM156.805 3.55258L156.472 3.92539L176.91 22.1912L177.243 21.8184L177.576 21.4456L157.138 3.17977L156.805 3.55258ZM177.243 21.8184L176.91 22.1912C182.911 27.554 192.164 27.6 198.222 22.2981L197.893 21.9219L197.563 21.5456C191.885 26.5151 183.2 26.4717 177.576 21.4456L177.243 21.8184ZM197.893 21.9219L198.222 22.2981L219.306 3.84607L218.977 3.46981L218.647 3.09356L197.563 21.5456L197.893 21.9219ZM226.88 0.5V1H378V0.5V0H226.88V0.5ZM218.977 3.46981L219.306 3.84607C221.402 2.01133 224.094 1 226.88 1V0.5V0C223.851 0 220.926 1.09927 218.647 3.09356L218.977 3.46981ZM148.809 0.5V1C151.636 1 154.364 2.04143 156.472 3.92539L156.805 3.55258L157.138 3.17977C154.847 1.13199 151.882 0 148.809 0V0.5ZM12.5 68.5V68C6.14873 68 1 62.8513 1 56.5H0.5H0C0 63.4036 5.59644 69 12.5 69V68.5ZM390.5 56.5H390C390 62.8513 384.851 68 378.5 68V68.5V69C385.404 69 391 63.4036 391 56.5H390.5Z'

/** Moves every x coordinate of an absolute-command path by its run. */
function fit(d: string, frameWidth: number): string {
  const extra = frameWidth - 390
  const x = (v: number) => (v < 100 ? v : +(v + (v <= 300 ? 0.48169 * extra : extra)).toFixed(4))
  return d.replace(/([MLCHVZ])([^MLCHVZ]*)/g, (_, cmd: string, args: string) => {
    if (cmd === 'V' || cmd === 'Z') return cmd + args
    const n = args.trim().split(/[\s,]+/).map(Number)
    return cmd + n.map((v, i) => (cmd === 'H' || i % 2 === 0 ? x(v) : v)).join(' ')
  })
}

export const platePath = (frameWidth: number) => fit(FILL, frameWidth)

/** The plate as an image URL, `frameWidth + 1` wide so it drops in where the 391px export sat. */
export function plateImage(frameWidth: number): string {
  const w = frameWidth + 1
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="69" viewBox="0 0 ${w} 69" fill="none">` +
    `<path d="${platePath(frameWidth)}" fill="#191970" fill-opacity="0.8"/>` +
    `<path d="${fit(RIM, frameWidth)}" fill="url(#s)"/>` +
    `<defs><linearGradient id="s" x1="0" y1="68.5" x2="0" y2="0.5" gradientUnits="userSpaceOnUse">` +
    `<stop stop-opacity="0"/><stop offset="1" stop-color="white"/></linearGradient></defs></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
