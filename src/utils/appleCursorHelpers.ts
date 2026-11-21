export type MacCursorVariant = 'arrow' | 'pointer' | 'text';

export interface MacCursorHotspot {
  offsetX: number;
  offsetY: number;
}

const POINTER_SELECTOR =
  'a, button, [role="button"], [role="tab"], input[type="button"], input[type="submit"], summary, [data-magnetic], [data-testid="cursor-robot-canvas"], canvas';

const TEXT_TAGS = new Set([
  'P',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BLOCKQUOTE',
  'LABEL',
  'LI',
  'INPUT',
  'TEXTAREA',
]);

/**
 * Classifies hovered DOM elements into classic macOS pointer states:
 * - 'pointer': Links, buttons, tabs, clickable canvases -> macOS pointing hand
 * - 'text': Prose & inputs -> macOS vertical I-beam
 * - 'arrow': Classic macOS black-and-white arrow cursor
 */
export function resolveMacCursorVariant(options: {
  isInteractive: boolean;
  tagName?: string;
  computedCursor?: string;
}): MacCursorVariant {
  if (options.isInteractive) {
    return 'pointer';
  }
  const tag = (options.tagName ?? '').toUpperCase();
  if (options.computedCursor === 'text' || TEXT_TAGS.has(tag)) {
    return 'text';
  }
  return 'arrow';
}

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const match = target.closest(POINTER_SELECTOR);
  if (!match) return false;
  if (match.hasAttribute('disabled') || match.getAttribute('aria-disabled') === 'true') {
    return false;
  }
  return true;
}

/**
 * Pixel hotspot offsets inside the 28x28 SVG viewBox so the exact tip of the
 * macOS arrow, index fingertip, or center of the I-beam lands on (clientX, clientY).
 */
export function getMacCursorHotspot(variant: MacCursorVariant): MacCursorHotspot {
  if (variant === 'pointer') {
    return {offsetX: -10, offsetY: -3};
  }
  if (variant === 'text') {
    return {offsetX: -14, offsetY: -14};
  }
  return {offsetX: -5, offsetY: -3};
}
