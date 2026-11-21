import {useEffect, useState} from 'react';
import {motion, useMotionValue, useReducedMotion, useSpring} from 'motion/react';
import {getCursorMode} from '../utils/agencyHelpers';

export function CustomCursor() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringProject, setIsHoveringProject] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = {stiffness: 460, damping: 34, mass: 0.45};
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const updatePointerType = () => {
      setIsFinePointer(mediaQuery.matches);
    };
    updatePointerType();
    mediaQuery.addEventListener('change', updatePointerType);
    return () => mediaQuery.removeEventListener('change', updatePointerType);
  }, []);

  const mode = getCursorMode(isFinePointer, prefersReducedMotion, isHoveringProject);

  useEffect(() => {
    if (mode === 'hidden') {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      if (!isVisible) {
        setIsVisible(true);
      }

      const target = event.target as HTMLElement | null;
      const projectTarget = target?.closest('[data-cursor="view"]');
      setIsHoveringProject(Boolean(projectTarget));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHoveringProject(false);
    };

    window.addEventListener('mousemove', handleMouseMove, {passive: true});
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mode, cursorX, cursorY, isVisible]);

  if (mode === 'hidden' || !isVisible) {
    return null;
  }

  const size = mode === 'view' ? 64 : 10;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full bg-primary text-primary-foreground"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: size,
        height: size,
      }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 30,
      }}
    >
      {mode === 'view' ? (
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
          VIEW
        </span>
      ) : null}
    </motion.div>
  );
}
