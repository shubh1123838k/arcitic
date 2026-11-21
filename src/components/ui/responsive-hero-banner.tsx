"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Menu,
  Orbit,
  Play,
  Rocket,
  Satellite,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Partner {
  logoUrl?: string;
  label?: string;
  icon?: React.ReactNode;
  href: string;
}

export interface ResponsiveHeroBannerProps {
  id?: string;
  className?: string;
  showHeader?: boolean;
  eyebrow?: React.ReactNode;
  logoUrl?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  badgeText?: string;
  badgeLabel?: string;
  title?: React.ReactNode;
  titleLine2?: React.ReactNode;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonIcon?: React.ReactNode;
  ctaNote?: string;
  partnersTitle?: string;
  partners?: Partner[];
}

const DEFAULT_PARTNERS: Partner[] = [
  { label: "Orbit Systems", icon: <Orbit className="h-4 w-4 text-primary" aria-hidden="true" />, href: "#work" },
  { label: "Aether Labs", icon: <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />, href: "#work" },
  { label: "Northstar UX", icon: <Compass className="h-4 w-4 text-primary" aria-hidden="true" />, href: "#work" },
  { label: "Apex Launch", icon: <Rocket className="h-4 w-4 text-primary" aria-hidden="true" />, href: "#work" },
  { label: "Vanguard AI", icon: <Satellite className="h-4 w-4 text-primary" aria-hidden="true" />, href: "#work" },
];

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  id,
  className,
  showHeader = true,
  eyebrow,
  logoUrl,
  backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
  navLinks = [
    { label: "Home", href: "#", isActive: true },
    { label: "Missions", href: "#" },
    { label: "Destinations", href: "#" },
    { label: "Technology", href: "#" },
    { label: "Book Flight", href: "#" },
  ],
  ctaButtonText = "Reserve Seat",
  ctaButtonHref = "#",
  badgeLabel = "New",
  badgeText = "First Commercial Flight to Mars 2026",
  title = "Journey Beyond Earth",
  titleLine2 = "Into the Cosmos",
  description = "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",
  primaryButtonText = "Book Your Journey",
  primaryButtonHref = "#",
  secondaryButtonText = "Watch Launch",
  secondaryButtonHref = "#",
  secondaryButtonIcon,
  ctaNote,
  partnersTitle = "Partnering with leading space agencies worldwide",
  partners = DEFAULT_PARTNERS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isHeroInView = useInView(heroSectionRef, { once: false, amount: 0.1 });
  const heroVisible = isHeroInView || prefersReducedMotion;
  const heroEase = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={heroSectionRef}
      id={id}
      className={cn(
        "relative isolate flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background",
        className,
      )}
    >
      <img
        src={backgroundImageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
      />

      {showHeader ? (
        <header className="relative z-20 xl:top-4">
          <div className="mx-auto max-w-[1280px] px-6 md:px-10">
            <div className="flex items-center justify-between pt-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 font-instrument-serif text-2xl tracking-tight text-foreground"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Brand mark"
                    className="h-9 w-auto rounded object-contain"
                  />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>ARCITIC</span>
                  </>
                )}
              </a>

              <nav className="hidden items-center gap-2 md:flex" aria-label="Hero navigation">
                <div className="flex items-center gap-1 rounded-full bg-white/5 px-1.5 py-1 ring-1 ring-white/10 backdrop-blur">
                  {navLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className={cn(
                        "px-3 py-2 font-sans text-sm font-medium transition-colors hover:text-foreground",
                        link.isActive ? "text-foreground" : "text-foreground/75",
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                  <Button
                    render={<a href={ctaButtonHref} />}
                    variant="default"
                    size="sm"
                    className="ml-1 rounded-full"
                  >
                    <span>{ctaButtonText}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </nav>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="rounded-full md:hidden"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>

            {mobileMenuOpen ? (
              <nav
                aria-label="Mobile hero navigation"
                className="mt-3 flex flex-col gap-2 rounded-2xl border border-border bg-background/95 p-4 backdrop-blur-md md:hidden"
              >
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg px-3 py-2 font-sans text-sm font-medium text-foreground/85 transition-colors hover:bg-card hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  render={<a href={ctaButtonHref} onClick={() => setMobileMenuOpen(false)} />}
                  variant="default"
                  size="lg"
                  className="mt-1 w-full rounded-full"
                >
                  <span>{ctaButtonText}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            ) : null}
          </div>
        </header>
      ) : null}

      <div className="relative z-10 flex flex-1 flex-col justify-between">
        <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-between px-6 pb-10 pt-10 md:px-10 md:pb-12 md:pt-14">
          <div className="mx-auto my-auto max-w-4xl text-center">
            {badgeLabel || badgeText ? (
              <div className="animate-fade-slide-in-1 mb-5 inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 backdrop-blur-md">
                {badgeLabel ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground sm:text-[11px]">
                    {badgeLabel}
                  </span>
                ) : null}
                {badgeText ? (
                  <span className="pr-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/90 sm:text-xs">
                    {badgeText}
                  </span>
                ) : null}
              </div>
            ) : null}

            {eyebrow ? (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : heroVisible ? 0.8 : 0.2,
                  delay: prefersReducedMotion ? 0 : heroVisible ? 0.08 : 0,
                  ease: heroEase,
                }}
                className="mb-2"
              >
                {eyebrow}
              </motion.div>
            ) : null}

            <motion.h1
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : heroVisible ? 0.85 : 0.2,
                delay: prefersReducedMotion ? 0 : heroVisible ? 0.2 : 0,
                ease: heroEase,
              }}
              className="font-instrument-serif text-[clamp(42px,6.4vw,88px)] font-normal leading-[0.95] tracking-[-0.025em] text-foreground"
            >
              {title}
              {titleLine2 ? (
                <>
                  <br />
                  {titleLine2}
                </>
              ) : null}
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : heroVisible ? 0.85 : 0.2,
                delay: prefersReducedMotion ? 0 : heroVisible ? 0.32 : 0,
                ease: heroEase,
              }}
              className="mx-auto mt-5 max-w-2xl font-sans text-base font-light leading-[1.65] text-foreground/80 sm:text-lg"
            >
              {description}
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : heroVisible ? 0.85 : 0.2,
                delay: prefersReducedMotion ? 0 : heroVisible ? 0.44 : 0,
                ease: heroEase,
              }}
              className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4"
            >
              <Button
                render={<a href={primaryButtonHref} />}
                variant="default"
                size="xl"
                data-magnetic
                className="px-7 font-sans text-xs font-semibold uppercase tracking-[0.16em]"
              >
                <span>{primaryButtonText}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                render={
                  /^https?:\/\//i.test(secondaryButtonHref) ? (
                    <a href={secondaryButtonHref} target="_blank" rel="noopener noreferrer" />
                  ) : (
                    <a href={secondaryButtonHref} />
                  )
                }
                variant="outline"
                size="xl"
                data-magnetic
                className="px-6 font-sans text-xs font-medium uppercase tracking-[0.16em] backdrop-blur-sm hover:border-primary/60 hover:text-primary-text"
              >
                <span>{secondaryButtonText}</span>
                {secondaryButtonIcon ?? (
                  <Play className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                )}
              </Button>
            </motion.div>

            {ctaNote ? (
              <motion.p
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : heroVisible ? 0.75 : 0.2,
                  delay: prefersReducedMotion ? 0 : heroVisible ? 0.52 : 0,
                  ease: heroEase,
                }}
                className="mt-4 font-sans text-xs font-normal tracking-[0.06em] text-muted-foreground"
              >
                {ctaNote}
              </motion.p>
            ) : null}
          </div>

          {partners.length > 0 ? (
            <div className="mx-auto mt-10 w-full max-w-5xl border-t border-border/70 pt-7">
              {partnersTitle ? (
                <motion.p
                  initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : heroVisible ? 0.75 : 0.2,
                    delay: prefersReducedMotion ? 0 : heroVisible ? 0.14 : 0,
                    ease: heroEase,
                  }}
                  className="text-center font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
                >
                  {partnersTitle}
                </motion.p>
              ) : null}
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : heroVisible ? 0.8 : 0.2,
                  delay: prefersReducedMotion ? 0 : heroVisible ? 0.24 : 0,
                  ease: heroEase,
                }}
                className="mt-5 grid grid-cols-2 items-center justify-items-center gap-3 sm:grid-cols-3 md:grid-cols-5"
              >
                {partners.map((partner, index) => (
                  <a
                    key={index}
                    href={partner.href}
                    data-magnetic
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-card/50 px-3.5 py-2 font-sans text-[11px] font-medium tracking-[0.04em] text-foreground/80 whitespace-nowrap transition-colors hover:border-primary/60 hover:text-foreground"
                  >
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.label ?? `Partner ${index + 1}`}
                        className="h-5 w-auto object-contain"
                      />
                    ) : (
                      <>
                        {partner.icon}
                        <span>{partner.label}</span>
                      </>
                    )}
                  </a>
                ))}
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
