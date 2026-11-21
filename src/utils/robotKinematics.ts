export interface PointerRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RobotLookTargets {
  headYaw: number;
  headPitch: number;
  torsoYaw: number;
  torsoPitch: number;
  eyeOffsetX: number;
  eyeOffsetY: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Normalizes pointer coordinates relative to the robot canvas center so the
 * character tracks the cursor seamlessly even when the pointer moves across
 * surrounding sections of the viewport.
 * Returns { nx: [-1, 1] left..right, ny: [-1, 1] bottom..top }.
 */
export function computeNormalizedPointer(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
  rect?: PointerRect | null,
): {nx: number; ny: number} {
  const safeVw = Math.max(1, viewportWidth);
  const safeVh = Math.max(1, viewportHeight);

  if (rect && rect.width > 0 && rect.height > 0) {
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.44;
    const spanX = Math.max(rect.width * 0.72, safeVw * 0.42);
    const spanY = Math.max(rect.height * 0.72, safeVh * 0.42);

    return {
      nx: clamp((clientX - centerX) / spanX, -1, 1),
      ny: clamp(-(clientY - centerY) / spanY, -1, 1),
    };
  }

  return {
    nx: clamp((clientX / safeVw) * 2 - 1, -1, 1),
    ny: clamp(-((clientY / safeVh) * 2 - 1), -1, 1),
  };
}

/**
 * Computes ergonomic rotation and eye-gaze targets from normalized pointer coordinates.
 * Right-handed Three.js axes (+X right, +Y up, +Z toward viewer):
 *   +rotation.y turns front (+Z) toward viewer's right (+X).
 *   -rotation.x tilts front (+Z) upward (+Y).
 */
export function computeRobotLookTargets(
  nx: number,
  ny: number,
  isHovered: boolean,
): RobotLookTargets {
  const cx = clamp(nx, -1, 1);
  const cy = clamp(ny, -1, 1);
  const reachBoost = isHovered ? 1.12 : 0.94;

  const maxHeadYaw = 0.58 * reachBoost;
  const maxHeadPitch = 0.36 * reachBoost;
  const maxTorsoYaw = 0.24 * reachBoost;
  const maxTorsoPitch = 0.14 * reachBoost;

  return {
    headYaw: cx * maxHeadYaw,
    headPitch: -cy * maxHeadPitch,
    torsoYaw: cx * maxTorsoYaw,
    torsoPitch: -cy * maxTorsoPitch,
    eyeOffsetX: cx * 0.085,
    eyeOffsetY: cy * 0.055,
  };
}

/**
 * Frame-rate independent exponential damping.
 */
export function dampValue(current: number, target: number, lambda: number, dt: number): number {
  const safeDt = clamp(dt, 0, 0.1);
  return current + (target - current) * (1 - Math.exp(-lambda * safeDt));
}

/**
 * Smooth natural blink envelope across normalized cycle [0, 1].
 * Blink occurs cleanly in the final 7% of the cycle.
 */
export function computeBlinkScaleY(cycleProgress: number): number {
  const t = ((cycleProgress % 1) + 1) % 1;
  const blinkStart = 0.93;
  if (t < blinkStart) return 1;

  const local = (t - blinkStart) / (1 - blinkStart); // 0..1
  const pulse = Math.sin(local * Math.PI); // 0 -> 1 -> 0
  return clamp(1 - pulse * 0.92, 0.08, 1);
}
