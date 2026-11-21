import {useEffect, useRef, useState, type ReactNode} from 'react';
import {motion, useInView, useMotionValue, useReducedMotion, useSpring} from 'motion/react';
import {calculateMagneticOffset, EDITORIAL_EASE, getStaggerDelay} from '../utils/motionHelpers';

export interface EditorialLine {
  content: ReactNode;
}

interface MaskedHeadlineProps {
  id?: string;
  lines: EditorialLine[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  baseDelay?: number;
  stagger?: number;
  duration?: number;
  trigger?: 'mount' | 'inView';
}

export function MaskedHeadline({
  id,
  lines,
  className = '',
  as = 'h2',
  baseDelay = 0,
  stagger = 0.11,
  duration = 0.85,
  trigger = 'inView',
}: MaskedHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isInView = useInView(containerRef, {once: false, amount: 0.1});
  const shouldReveal = trigger === 'mount' || isInView || prefersReducedMotion;
  const Tag = as;

  return (
    <Tag id={id} ref={containerRef} className={className}>
      {lines.map((line, index) => {
        const delay = prefersReducedMotion ? 0 : getStaggerDelay(index, stagger, baseDelay);
        return (
          <span key={index} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              initial={prefersReducedMotion ? {y: '0%'} : {y: '112%'}}
              animate={shouldReveal ? {y: '0%'} : {y: '112%'}}
              transition={{
                duration: prefersReducedMotion ? 0 : shouldReveal ? duration : 0.2,
                delay: shouldReveal ? delay : 0,
                ease: EDITORIAL_EASE,
              }}
              className="block"
            >
              {line.content}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ClipReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.95,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isInView = useInView(ref, {once: false, amount: 0.1});
  const shouldReveal = isInView || prefersReducedMotion;

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReducedMotion
          ? {clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1}
          : {clipPath: 'inset(12% 0% 0% 0%)', opacity: 0.65, scale: 1.05}
      }
      animate={
        shouldReveal
          ? {clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1}
          : {clipPath: 'inset(12% 0% 0% 0%)', opacity: 0.65, scale: 1.05}
      }
      transition={{
        duration: prefersReducedMotion ? 0 : shouldReveal ? duration : 0.2,
        delay: prefersReducedMotion ? 0 : shouldReveal ? delay : 0,
        ease: EDITORIAL_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  maxOffset?: number;
}

export function MagneticWrapper({
  children,
  className = '',
  strength = 0.24,
  maxOffset = 8,
}: MagneticWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isFinePointer, setIsFinePointer] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = {stiffness: 320, damping: 24, mass: 0.5};
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)');
    const sync = () => setIsFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const enabled = isFinePointer && !prefersReducedMotion;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const offset = calculateMagneticOffset(
      event.clientX,
      event.clientY,
      rect,
      enabled,
      strength,
      maxOffset
    );
    rawX.set(offset.x);
    rawY.set(offset.y);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={enabled ? {x, y} : undefined}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
