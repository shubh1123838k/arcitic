import {motion, useReducedMotion} from 'motion/react';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  AGENCY_EMAIL,
  FOUNDER_LINKEDIN_URL,
} from '../data/agencyData';
import {EDITORIAL_EASE} from '../utils/motionHelpers';
import {MaskedHeadline} from './MotionPrimitives';

export function ContactSection() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-[76px] w-full bg-primary py-24 text-primary-foreground md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <motion.p
              initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false, amount: 0.2}}
              transition={{duration: prefersReducedMotion ? 0 : 0.65, ease: EDITORIAL_EASE}}
              className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-foreground/80"
            >
              HAVE A PROJECT IN MIND?
            </motion.p>

            <MaskedHeadline
              id="contact-heading"
              className="font-display text-[clamp(38px,5.6vw,74px)] font-normal leading-[0.94] tracking-[-0.025em] text-primary-foreground"
              lines={[
                {content: <>Let&apos;s build</>},
                {
                  content: (
                    <>
                      something <span className="italic">meaningful.</span>
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
                duration: prefersReducedMotion ? 0 : 0.75,
                delay: prefersReducedMotion ? 0 : 0.16,
                ease: EDITORIAL_EASE,
              }}
            >
              <p className="mt-8 max-w-2xl font-sans text-lg font-normal leading-[1.65] text-primary-foreground/90 md:text-xl">
                Whether you&apos;re building a business, launching an idea, or creating your
                personal brand, we&apos;d love to help bring your vision to life.
              </p>
              <p className="mt-4 max-w-xl font-sans text-[15px] font-normal leading-[1.7] text-primary-foreground/80 md:text-base">
                Tell us a little about your project, what you&apos;re looking to achieve, and how we
                can help.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 16}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false, amount: 0.2}}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.7,
              delay: prefersReducedMotion ? 0 : 0.22,
              ease: EDITORIAL_EASE,
            }}
            className="flex flex-col items-start gap-5 lg:items-end shrink-0"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/85">
              Talk to founder to start project
            </p>

            <Button
              render={<a href={FOUNDER_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" />}
              variant="secondary"
              size="xl"
              data-magnetic
              className="border-[#090909]/20 bg-[#090909] px-7 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#F1EFEB] shadow-[0_8px_28px_rgba(9,9,9,0.28)] hover:bg-[#161616] focus-visible:ring-[#090909] focus-visible:ring-offset-primary"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4 text-[#F1EFEB]" aria-hidden="true" />
            </Button>

            <a
              href={`mailto:${AGENCY_EMAIL}`}
              className="font-display text-xl font-normal tracking-[-0.015em] text-primary-foreground underline decoration-primary-foreground/45 underline-offset-4 transition-colors hover:decoration-primary-foreground md:text-2xl"
            >
              {AGENCY_EMAIL}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
