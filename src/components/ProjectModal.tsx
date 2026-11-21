import {useEffect} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {ArrowUpRight, ExternalLink, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {MAILTO_PROJECT_URL, type ProjectItem} from '../data/agencyData';
import {buildMailtoHref, isValidExternalUrl} from '../utils/agencyHelpers';
import {AGENCY_EMAIL} from '../data/agencyData';
import {ResilientImage} from './ResilientImage';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({project, onClose}: ProjectModalProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (!project) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const hasExternalUrl = project ? isValidExternalUrl(project.externalUrl) : false;
  const projectInquiryUrl = project
    ? buildMailtoHref(AGENCY_EMAIL, `Project Inquiry: ${project.title}`)
    : MAILTO_PROJECT_URL;

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: prefersReducedMotion ? 0 : 0.25}}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-8"
        >
          <motion.div
            initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
            animate={{opacity: 1, y: 0}}
            exit={prefersReducedMotion ? {opacity: 0} : {opacity: 0, y: 16}}
            transition={{duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1]}}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-border bg-card text-foreground"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-8">
              <div className="flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-primary-text tabular-nums">{project.number}</span>
                <span aria-hidden="true">·</span>
                <span>{project.category}</span>
                {project.isDemoConcept ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Studio Demo Concept</span>
                  </>
                ) : null}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                onClick={onClose}
                aria-label="Close project preview"
                className="hover:text-primary-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="aspect-[16/10] w-full overflow-hidden border-b border-border bg-background">
              <ResilientImage
                src={project.imageUrl}
                alt={project.imageAlt}
                fallbackTitle={project.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-12 md:p-8">
              <div className="md:col-span-7">
                <h3
                  id="project-modal-title"
                  className="font-display text-4xl font-normal tracking-[-0.02em] text-foreground md:text-5xl"
                >
                  {project.title}
                </h3>
                <p className="mt-4 font-sans text-base font-light leading-[1.7] text-foreground/90">
                  {project.overview}
                </p>
                <p className="mt-4 font-sans text-xs font-normal leading-relaxed text-muted-foreground">
                  Note: Presented as an ARCITIC studio demo concept to illustrate design direction
                  and technical execution without fabricated client metrics.
                </p>
              </div>

              <div className="flex flex-col justify-between gap-6 border-t border-border pt-6 md:col-span-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div>
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-primary-text">
                    CAPABILITIES DEMONSTRATED
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {project.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 font-sans text-sm text-foreground/85"
                      >
                        <span className="h-[1px] w-3 bg-primary shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  {hasExternalUrl && project.externalUrl ? (
                    <Button
                      render={
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                      variant="outline"
                      size="lg"
                      className="w-full font-sans text-xs font-medium uppercase tracking-[0.16em] hover:text-primary-text"
                    >
                      <span>Visit External Website</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  ) : null}

                  <Button
                    render={<a href={projectInquiryUrl} />}
                    variant="default"
                    size="xl"
                    className="w-full font-sans text-xs font-semibold uppercase tracking-[0.16em]"
                  >
                    <span>Build Something Similar</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
