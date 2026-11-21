import {useEffect, useState} from 'react';
import {motion, useMotionValue, useReducedMotion} from 'motion/react';
import {
  getMacCursorHotspot,
  isInteractiveTarget,
  type MacCursorVariant,
  resolveMacCursorVariant,
} from '../utils/appleCursorHelpers';

const MAC_ARROW_PATH = 'M5 3 L5 21.5 L9.6 17.2 L12.6 23.6 L15.2 22.3 L12.1 15.9 L18.6 15.4 Z';

const MAC_HAND_PATH =
  'M10.2 3.2 C9.2 3.2 8.5 3.9 8.5 4.9 V13.1 L6.6 11.4 C5.9 10.7 4.7 10.8 4.1 11.6 C3.5 12.3 3.6 13.4 4.3 14.1 L9.2 19.3 C10.1 20.3 11.3 20.8 12.6 20.8 H17.2 C19.4 20.8 21.1 19.1 21.1 16.9 V11.4 C21.1 10.4 20.4 9.7 19.5 9.7 C19.0 9.7 18.6 9.9 18.3 10.2 C18.1 9.4 17.4 8.9 16.6 8.9 C16.0 8.9 15.5 9.2 15.2 9.6 C14.9 8.8 14.2 8.3 13.4 8.3 C12.8 8.3 12.2 8.6 11.9 9.0 V4.9 C11.9 3.9 11.2 3.2 10.2 3.2 Z';

const MAC_IBEAM_PATH = 'M10.5 6 H17.5 M14 6 V22 M10.5 22 H17.5';

export function ApplePointerCursor() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [variant, setVariant] = useState<MacCursorVariant>('arrow');

  // Direct 1:1 hardware pointer motion values (zero spring lag or stretch distortion)
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const syncPointerSupport = () => {
      setIsFinePointer(mediaQuery.matches);
    };
    syncPointerSupport();
    mediaQuery.addEventListener('change', syncPointerSupport);
    return () => mediaQuery.removeEventListener('change', syncPointerSupport);
  }, []);

  useEffect(() => {
    if (!isFinePointer) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const syncFromPointer = (clientX: number, clientY: number, eventTarget: EventTarget | null) => {
      const targetEl = eventTarget instanceof Element ? eventTarget : null;
      const interactive = isInteractiveTarget(targetEl);
      const computedCursor =
        targetEl instanceof HTMLElement ? window.getComputedStyle(targetEl).cursor : undefined;

      const nextVariant = resolveMacCursorVariant({
        isInteractive: interactive,
        tagName: targetEl?.tagName,
        computedCursor,
      });

      const hotspot = getMacCursorHotspot(nextVariant);
      rawX.set(clientX + hotspot.offsetX);
      rawY.set(clientY + hotspot.offsetY);
      setVariant(nextVariant);
      setIsVisible(true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      syncFromPointer(event.clientX, event.clientY, event.target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsPressed(false);
    };

    window.addEventListener('pointermove', handlePointerMove, {passive: true});
    window.addEventListener('pointerdown', handlePointerDown, {passive: true});
    window.addEventListener('pointerup', handlePointerUp, {passive: true});
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isFinePointer, rawX, rawY]);

  if (!isFinePointer || !isVisible) {
    return null;
  }

  const origin =
    variant === 'pointer' ? '10px 3px' : variant === 'text' ? '14px 14px' : '5px 3px';

  return (
    <motion.div
      data-testid="apple-pointer-cursor"
      data-variant={variant}
      data-pressed={String(isPressed)}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x: rawX,
        y: rawY,
        transformOrigin: origin,
      }}
      animate={{
        scale: isPressed && !prefersReducedMotion ? 0.91 : 1,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.08,
        ease: 'easeOut',
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
      >
        {variant === 'arrow' && (
          <>
            {/* Outer dark hairline matching classic macOS silhouette on bright & dark surfaces */}
            <path
              d={MAC_ARROW_PATH}
              stroke="#000000"
              strokeWidth="4.4"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
            />
            <path
              d={MAC_ARROW_PATH}
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
            />
            <path d={MAC_ARROW_PATH} fill="#000000" />
          </>
        )}

        {variant === 'pointer' && (
          <>
            <path
              d={MAC_HAND_PATH}
              stroke="#000000"
              strokeWidth="3.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d={MAC_HAND_PATH}
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d={MAC_HAND_PATH} fill="#000000" />
          </>
        )}

        {variant === 'text' && (
          <>
            <path
              d={MAC_IBEAM_PATH}
              stroke="#000000"
              strokeWidth="3.8"
              strokeLinecap="square"
            />
            <path
              d={MAC_IBEAM_PATH}
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="square"
            />
            <path
              d={MAC_IBEAM_PATH}
              stroke="#000000"
              strokeWidth="1.1"
              strokeLinecap="square"
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
