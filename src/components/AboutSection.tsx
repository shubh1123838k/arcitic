import {motion, useReducedMotion} from 'motion/react';
import {EDITORIAL_EASE} from '../utils/motionHelpers';
import {CursorRobotCanvas} from './CursorRobotCanvas';
import {ClipReveal, MaskedHeadline} from './MotionPrimitives';

export function AboutSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-[76px] border-b border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left: Interactive 3D cursor-following robot */}
          <div className="overflow-hidden border border-border bg-card lg:col-span-6">
            <ClipReveal className="h-full min-h-[380px] w-full lg:min-h-[520px]" duration={1.0}>
              <CursorRobotCanvas />
            </ClipReveal>
          </div>

          {/* Right: About narrative + brand statement */}
          <div className="flex flex-col justify-between py-2 lg:col-span-6">
            <div>
              <motion.p
                initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: false, amount: 0.2}}
                transition={{duration: prefersReducedMotion ? 0 : 0.65, ease: EDITORIAL_EASE}}
                className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text"
              >
                A LITTLE ABOUT US
              </motion.p>

              <MaskedHeadline
                id="about-heading"
                className="font-display text-[clamp(36px,4.6vw,60px)] font-normal leading-[0.95] tracking-[-0.025em] text-foreground"
                lines={[
                  {content: <>Technology meets</>},
                  {
                    content: (
                      <>
                        thoughtful <span className="italic text-primary-text">creativity.</span>
                      </>
                    ),
                  },
                ]}
              />

              <motion.div
                initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: false, amount: 0.2}}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  delay: prefersReducedMotion ? 0 : 0.16,
                  ease: EDITORIAL_EASE,
                }}
                className="mt-8 space-y-5 font-sans text-[16px] font-light leading-[1.7] text-foreground/85 md:text-[17px]"
              >
                <p>
                  ARCITIC is an independent AI-powered digital agency focused on building meaningful
                  digital experiences.
                </p>
                <p>
                  We believe a website should do more than simply exist. It should communicate your
                  identity, establish trust, and create opportunities.
                </p>
                <p className="text-muted-foreground">
                  By combining modern design, intelligent technology, and thoughtful development, we
                  help individuals and businesses build a stronger presence online.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 14}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false, amount: 0.2}}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.7,
                delay: prefersReducedMotion ? 0 : 0.24,
                ease: EDITORIAL_EASE,
              }}
              className="mt-10 border-t border-border pt-6"
            >
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text">
                STUDIO PRINCIPLE
              </p>
              <p className="mt-2 font-display text-2xl font-normal tracking-[-0.015em] text-foreground md:text-[26px]">
                Clarity over noise. Engineering paired with{' '}
                <span className="italic text-primary-text">editorial restraint.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
