import {useState} from 'react';
import {motion, useReducedMotion} from 'motion/react';
import {ArrowUpRight, Clock, Code2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
  PROJECT_FILTERS,
  PROJECTS,
  type ProjectCategory,
  type ProjectItem,
} from '../data/agencyData';
import {filterProjectsByCategory, isValidExternalUrl} from '../utils/agencyHelpers';
import {EDITORIAL_EASE, getStaggerDelay} from '../utils/motionHelpers';
import {ClipReveal, MaskedHeadline} from './MotionPrimitives';
import {ResilientImage} from './ResilientImage';

interface WorkSectionProps {
  activeCategory: ProjectCategory;
  onSelectCategory: (category: ProjectCategory) => void;
  onSelectProject: (project: ProjectItem) => void;
}

interface FlipProjectCardProps {
  project: ProjectItem;
  index: number;
  prefersReducedMotion: boolean;
  onSelectProject: (project: ProjectItem) => void;
}

function FlipProjectCard({
  project,
  index,
  prefersReducedMotion,
  onSelectProject,
}: FlipProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasExternal = isValidExternalUrl(project.externalUrl);

  return (
    <motion.article
      initial={prefersReducedMotion ? {opacity: 1, y: 0} : {opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: false, amount: 0.15}}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.75,
        delay: prefersReducedMotion ? 0 : getStaggerDelay(index % 2, 0.1),
        ease: EDITORIAL_EASE,
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') {
          setIsFlipped(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') {
          setIsFlipped(false);
        }
      }}
      onClick={(event) => {
        // Allow touch users to flip on tap while keeping explicit button clicks scoped
        if (window.matchMedia('(pointer: coarse)').matches) {
          const target = event.target as HTMLElement;
          if (!target.closest('button, a')) {
            setIsFlipped((prev) => !prev);
          }
        }
      }}
      data-flipped={isFlipped ? 'true' : 'false'}
      className="group [perspective:1400px]"
    >
      <motion.div
        animate={{rotateY: prefersReducedMotion ? 0 : isFlipped ? 180 : 0}}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.7,
          ease: EDITORIAL_EASE,
        }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        {/* Front Face */}
        <div
          aria-hidden={isFlipped}
          className={`flex h-full flex-col border border-border bg-card transition-colors duration-300 [backface-visibility:hidden] group-hover:border-primary/60 ${
            isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
          } ${
            prefersReducedMotion && isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            data-cursor="view"
            tabIndex={isFlipped ? -1 : 0}
            onClick={() => onSelectProject(project)}
            aria-label={`Inspect ${project.title}`}
            className="relative block aspect-[4/3] w-full overflow-hidden border-b border-border bg-background text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ClipReveal className="h-full w-full" delay={getStaggerDelay(index % 2, 0.08)}>
              <ResilientImage
                src={project.imageUrl}
                alt={project.imageAlt}
                fallbackTitle={project.title}
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </ClipReveal>
          </button>

          <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-primary-text tabular-nums">{project.number}</span>
                <span aria-hidden="true">·</span>
                <span>{project.category}</span>
                {project.isDemoConcept ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Demo Concept</span>
                  </>
                ) : null}
              </div>

              <h3 className="mt-3 font-display text-2xl font-normal tracking-[-0.02em] text-foreground md:text-3xl">
                {project.title}
              </h3>

              <p className="mt-3 font-sans text-[15px] font-light leading-[1.7] text-muted-foreground md:text-base">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Back Face — Technical Stack & Delivery Timeline */}
        <div
          aria-hidden={!isFlipped}
          className={`absolute inset-0 flex h-full flex-col justify-between border border-primary/60 bg-[#111111] p-6 shadow-[0_0_32px_rgba(241,106,89,0.18)] [backface-visibility:hidden] md:p-8 ${
            prefersReducedMotion ? '' : '[transform:rotateY(180deg)]'
          } ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'} ${
            prefersReducedMotion && !isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Top bar with corner delivery estimate */}
          <div className="flex items-start justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex flex-wrap items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-primary-text tabular-nums">{project.number}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
            </div>

            <div
              data-testid={`delivery-badge-${project.id}`}
              className="flex shrink-0 flex-col items-end border border-primary/40 bg-background/80 px-3 py-1.5 text-right"
            >
              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                DELIVERY TIME
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-primary-text">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{project.deliveryTimeline}</span>
              </span>
            </div>
          </div>

          {/* Center: Title + Technical Stack & Languages */}
          <div className="my-auto py-5">
            <h3 className="font-display text-2xl font-normal tracking-[-0.02em] text-foreground md:text-3xl">
              {project.title}
            </h3>

            <div className="mt-5">
              <p className="mb-3 inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-primary-text">
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>TOOLS &amp; LANGUAGES REQUIRED</span>
              </p>

              <ul className="grid grid-cols-2 gap-2.5">
                {project.techStack.map((tech, techIdx) => (
                  <li
                    key={tech}
                    className="flex items-center gap-2.5 border border-border/80 bg-background/70 px-3 py-2 font-sans text-xs font-medium text-foreground/90"
                  >
                    <span className="font-sans text-[10px] tabular-nums text-primary-text">
                      0{techIdx + 1}
                    </span>
                    <span className="truncate">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer: Quick brief inspection & optional live link */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-4">
            <button
              type="button"
              tabIndex={isFlipped ? 0 : -1}
              onClick={() => onSelectProject(project)}
              className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>Inspect Brief</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-primary-text" aria-hidden="true" />
            </button>

            {hasExternal && project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isFlipped ? 0 : -1}
                className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap shrink-0"
              >
                <span>Live Site</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Production Ready Stack
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function WorkSection({
  activeCategory,
  onSelectCategory,
  onSelectProject,
}: WorkSectionProps) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const visibleProjects = filterProjectsByCategory(PROJECTS, activeCategory);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-[76px] border-b border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-8 border-b border-border pb-10 lg:mb-16">
          <div className="max-w-5xl">
            <motion.p
              initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0, y: 10}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false, amount: 0.15}}
              transition={{duration: prefersReducedMotion ? 0 : 0.65, ease: EDITORIAL_EASE}}
              className="mb-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-primary-text"
            >
              SELECTED PROJECTS
            </motion.p>

            <MaskedHeadline
              id="work-heading"
              className="font-display text-[clamp(36px,5.2vw,68px)] font-normal leading-[0.95] tracking-[-0.025em] text-foreground"
              lines={[
                {content: <>Ideas turned into</>},
                {
                  content: (
                    <>
                      digital <span className="italic text-primary-text">experiences.</span>
                    </>
                  ),
                },
              ]}
            />
          </div>

          {/* Interactive Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 self-start"
          >
            {PROJECT_FILTERS.map((category) => {
              const isActive = activeCategory === category;
              return (
                <Button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  data-magnetic
                  onClick={() => onSelectCategory(category)}
                  className={`font-sans text-[11px] font-medium uppercase tracking-[0.14em] ${
                    isActive ? '' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12">
          {visibleProjects.map((project, index) => (
            <FlipProjectCard
              key={project.id}
              project={project}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
