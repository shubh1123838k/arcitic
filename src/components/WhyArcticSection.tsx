import {motion, useReducedMotion} from 'motion/react';
import {WHY_ITEMS} from '../data/agencyData';
import {EDITORIAL_EASE, getStaggerDelay} from '../utils/motionHelpers';
import {MaskedHeadline} from './MotionPrimitives';

export function WhyArcticSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="why-arctic"
      aria-labelledby="why-arctic-heading"
      className="border-b border-border bg-secondary py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-14 max-w-5xl md:mb-16">
          <motion.p
            initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false, amount: 0.2}}
            transition={{duration: prefersReducedMotion ? 0 : 0.65, ease: EDITORIAL_EASE}}
            className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text"
          >
            THE ARCITIC DIFFERENCE
          </motion.p>

          <MaskedHeadline
            id="why-arctic-heading"
            className="font-display text-[clamp(36px,5.2vw,68px)] font-normal leading-[0.95] tracking-[-0.025em] text-foreground"
            lines={[
              {content: <>More than a website.</>},
              {
                content: (
                  <>
                    A digital <span className="italic text-primary-text">advantage.</span>
                  </>
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item, index) => (
            <motion.div
              key={item.number}
              initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false, amount: 0.15}}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.65,
                delay: prefersReducedMotion ? 0 : getStaggerDelay(index, 0.09),
                ease: EDITORIAL_EASE,
              }}
              className="flex flex-col justify-between border border-border bg-card p-6 transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_28px_rgba(241,106,89,0.18)] md:p-7"
            >
              <div>
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text tabular-nums">
                  {item.number}
                </span>
                <h3 className="mt-4 font-display text-2xl font-normal tracking-[-0.02em] text-foreground md:text-[26px]">
                  {item.title}
                </h3>
                <p className="mt-3 font-sans text-[15px] font-light leading-[1.7] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
