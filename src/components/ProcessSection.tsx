import {motion, useReducedMotion} from 'motion/react';
import {PROCESS_STEPS} from '../data/agencyData';
import {EDITORIAL_EASE, getStaggerDelay} from '../utils/motionHelpers';
import {MaskedHeadline} from './MotionPrimitives';

export function ProcessSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-[76px] border-b border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-14 max-w-5xl md:mb-20">
          <motion.p
            initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false, amount: 0.2}}
            transition={{duration: prefersReducedMotion ? 0 : 0.65, ease: EDITORIAL_EASE}}
            className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text"
          >
            HOW WE WORK
          </motion.p>

          <MaskedHeadline
            id="process-heading"
            className="font-display text-[clamp(36px,5.2vw,68px)] font-normal leading-[0.95] tracking-[-0.025em] text-foreground"
            lines={[
              {content: <>From first idea</>},
              {
                content: (
                  <>
                    to final <span className="italic text-primary-text">launch.</span>
                  </>
                ),
              },
            ]}
          />
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false, amount: 0.15}}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.7,
                delay: prefersReducedMotion ? 0 : getStaggerDelay(index, 0.11),
                ease: EDITORIAL_EASE,
              }}
              className="relative flex flex-col"
            >
              {/* Numbered coral indicator + connecting horizontal hairline */}
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-primary/50 bg-card font-sans text-xs font-semibold tracking-[0.18em] text-primary-text tabular-nums">
                  {step.number}
                </span>
                <div className="h-[1px] w-full bg-border" aria-hidden="true" />
              </div>

              <h3 className="mt-7 font-display text-2xl font-normal tracking-[-0.02em] text-foreground md:text-[26px]">
                {step.title}
              </h3>

              <p className="mt-3 font-sans text-[15px] font-light leading-[1.7] text-muted-foreground md:text-base">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
