import {useEffect, useState} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {FOUNDER_LINKEDIN_URL, NAV_ITEMS} from '../data/agencyData';
import {BrandLogo} from './BrandLogo';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-[76px] w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-8 px-6 md:px-10">
          {/* Zone 1: Brand logo mark */}
          <a
            href="#top"
            data-magnetic
            aria-label="ARCITIC — Back to top"
            className="inline-flex shrink-0 items-center py-1 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <BrandLogo className="h-7" />
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-200 hover:text-foreground whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Mobile menu button */}
          <div className="flex items-center gap-3 shrink-0 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon-xl"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-overlay"
              className="hover:text-primary-text"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            id="mobile-navigation-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0}}
            animate={{opacity: 1}}
            exit={prefersReducedMotion ? {opacity: 0} : {opacity: 0}}
            transition={{duration: prefersReducedMotion ? 0 : 0.25}}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#090909] px-6 py-5 md:hidden"
          >
            <div className="flex h-[52px] items-center justify-between border-b border-border pb-4">
              <a
                href="#top"
                onClick={handleNavClick}
                aria-label="ARCITIC — Back to top"
                className="inline-flex shrink-0 items-center py-1"
              >
                <BrandLogo className="h-7" />
              </a>
              <Button
                type="button"
                variant="outline"
                size="icon-xl"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="hover:text-primary-text"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            <nav aria-label="Mobile navigation links" className="flex flex-col gap-5 py-8">
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="group flex items-baseline gap-4 border-b border-border/60 pb-4 font-display text-4xl font-normal tracking-tight text-foreground transition-colors hover:text-primary-text"
                >
                  <span className="font-sans text-[11px] font-medium tracking-[0.24em] text-primary-text tabular-nums">
                    0{idx + 1}
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="space-y-4 border-t border-border pt-6">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Talk to founder to start project
              </p>
              <Button
                render={
                  <a
                    href={FOUNDER_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleNavClick}
                  />
                }
                variant="default"
                size="xl"
                className="w-full font-sans text-xs font-semibold uppercase tracking-[0.16em] shadow-[0_0_24px_rgba(241,106,89,0.20)]"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
