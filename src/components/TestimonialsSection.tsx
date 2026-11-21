import {motion, useReducedMotion} from 'motion/react';
import {MarqueeCard} from '@/components/ui/marquee-card';
import {EDITORIAL_EASE} from '../utils/motionHelpers';
import {MaskedHeadline} from './MotionPrimitives';

export function TestimonialsSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-b border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 border-b border-border pb-10 md:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-5xl">
            <motion.p
              initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false, amount: 0.2}}
              transition={{duration: prefersReducedMotion ? 0 : 0.65, ease: EDITORIAL_EASE}}
              className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text"
            >
              CLIENT WORDS
            </motion.p>

            <MaskedHeadline
              id="testimonials-heading"
              className="font-display text-[clamp(34px,4.8vw,62px)] font-normal leading-[0.95] tracking-[-0.03em] text-foreground"
              lines={[
                {content: <>Don&apos;t just take</>},
                {
                  content: (
                    <>
                      our <span className="italic text-primary-text">word</span> for it.
                    </>
                  ),
                },
              ]}
            />
          </div>

          <p className="max-w-sm font-sans text-xs font-normal leading-relaxed text-muted-foreground">
            Client impressions from across the globe. Hover any card to pause the stream.
          </p>
        </div>

        <MarqueeCard />
      </div>
    </section>
  );
}
