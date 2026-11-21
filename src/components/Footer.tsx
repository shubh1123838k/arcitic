import {ArrowUp} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {FOOTER_NAV_LINKS, FOOTER_SOCIAL_LINKS} from '../data/agencyData';
import {BrandLogo} from './BrandLogo';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <footer className="border-t border-border bg-background py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="flex flex-col justify-between gap-10 border-b border-border pb-12 md:flex-row md:items-start">
          <div>
            <a
              href="#top"
              data-magnetic
              aria-label="ARCITIC — Back to top"
              className="inline-flex items-center py-1 transition-opacity hover:opacity-85"
            >
              <BrandLogo className="h-8" />
            </a>
            <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              WE BUILD WHAT&apos;S NEXT.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <nav aria-label="Footer navigation" className="flex flex-col gap-3">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-primary-text">
                NAVIGATION
              </p>
              {FOOTER_NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm font-normal text-foreground/80 transition-colors hover:text-primary-text"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-primary-text">
                CONNECT
              </p>
              {FOOTER_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="font-sans text-sm font-normal text-foreground/80 transition-colors hover:text-primary-text"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-muted-foreground">
            © 2026 ARCITIC. All rights reserved.
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-magnetic
            onClick={scrollToTop}
            className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-primary-text"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
