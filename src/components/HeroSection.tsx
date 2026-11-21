import {ArrowUpRight} from 'lucide-react';
import ResponsiveHeroBanner from '@/components/ui/responsive-hero-banner';
import {FOUNDER_LINKEDIN_URL} from '../data/agencyData';

export function HeroSection() {
  return (
    <ResponsiveHeroBanner
      id="top"
      showHeader={false}
      className="min-h-[calc(100svh-76px)] border-b border-border"
      backgroundImageUrl="https://cdn.21st.dev/assets/mirror/a8/a8cf38f65f7315f95eba8c803c4a80a9d78cb2ea36fbfee49828396e4a0b9737.jpg"
      badgeLabel=""
      badgeText=""
      eyebrow={
        <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-primary-text">
          AI-POWERED DIGITAL AGENCY
        </p>
      }
      title="We build"
      titleLine2={
        <>
          what&apos;s <span className="italic text-primary-text">next.</span>
        </>
      }
      description="We design and develop intelligent digital experiences that help ambitious businesses stand out, move faster, and grow online."
      primaryButtonText="Explore Our Work"
      primaryButtonHref="#work"
      secondaryButtonText="Start a Project"
      secondaryButtonHref={FOUNDER_LINKEDIN_URL}
      secondaryButtonIcon={<ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />}
      ctaNote="Talk to founder to start project"
      partnersTitle=""
      partners={[]}
    />
  );
}
