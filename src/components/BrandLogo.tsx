import {cn} from '@/lib/utils';

export const BRAND_LOGO_SRC =
  '/assets/aistudio/Blue_and_Black_Minimalist_Brand_Logo__1__961cbb91.png';

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

/**
 * Global SVG filter converting pure #000000 pixels in the logo PNG to
 * transparent alpha while keeping brand orange and white at full opacity.
 */
export function BrandLogoFilterDefs() {
  return (
    <svg
      className="pointer-events-none fixed h-0 w-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <filter id="arcitic-logo-key" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.8 1.8 1.8 0 -0.03"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Renders the ARCITIC horizontal logo cropped tightly to its artwork bounds
 * (308x70 inside the 500x500 canvas) with SVG alpha-keying so the black
 * background disappears over any surface.
 */
export function BrandLogo({className, alt = 'ARCITIC'}: BrandLogoProps) {
  return (
    <span
      className={cn(
        'relative block aspect-[308/70] shrink-0 overflow-hidden select-none',
        className,
      )}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={alt}
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute -left-[23.701%] -top-[300%] h-[714.286%] w-[162.338%] max-w-none [filter:url(#arcitic-logo-key)]"
      />
    </span>
  );
}
