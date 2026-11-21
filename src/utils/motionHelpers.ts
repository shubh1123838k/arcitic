export const EDITORIAL_EASE = [0.22, 1, 0.36, 1] as const;

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PointOffset {
  x: number;
  y: number;
}

export function calculateMagneticOffset(
  pointerX: number,
  pointerY: number,
  rect: RectLike,
  enabled: boolean,
  strength = 0.28,
  maxOffset = 10
): PointOffset {
  if (!enabled || rect.width <= 0 || rect.height <= 0) {
    return {x: 0, y: 0};
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const rawX = (pointerX - centerX) * strength;
  const rawY = (pointerY - centerY) * strength;

  const clamp = (value: number) => Math.max(-maxOffset, Math.min(maxOffset, value));

  return {
    x: Number(clamp(rawX).toFixed(2)),
    y: Number(clamp(rawY).toFixed(2)),
  };
}

export function getStaggerDelay(index: number, stepSeconds = 0.12, baseDelay = 0): number {
  if (index < 0) {
    return baseDelay;
  }
  return Number((baseDelay + index * stepSeconds).toFixed(3));
}

export function getMarqueeDurationSeconds(viewportWidth: number): number {
  return viewportWidth < 768 ? 24 : 30;
}
