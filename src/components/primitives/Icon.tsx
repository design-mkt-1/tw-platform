import Image from 'next/image'

/**
 * Every glyph in the design is an exported SVG, so they all render through one wrapper.
 *
 * `unoptimized` is not a choice: the site is a static export with no server, so next/image has
 * nothing to resize with. Setting it here rather than at each call site means a new icon cannot
 * silently ask for an optimiser that does not exist.
 */
interface IconProps {
  src: string
  /** Empty string marks the icon as decorative, which is right when a label sits beside it. */
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function Icon({ src, alt, width, height, className, priority }: IconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      aria-hidden={alt === '' || undefined}
    />
  )
}
