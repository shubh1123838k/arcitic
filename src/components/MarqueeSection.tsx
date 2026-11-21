import {MARQUEE_ITEMS} from '../data/agencyData';

function MarqueeHalf() {
  return (
    <div className="flex shrink-0 items-center">
      {[0, 1].map((copyIndex) => (
        <div key={copyIndex} className="flex shrink-0 items-center gap-10 pr-10">
          {MARQUEE_ITEMS.map((item) => (
            <div key={`${copyIndex}-${item}`} className="flex items-center gap-10">
              <span className="font-display text-xl font-normal uppercase tracking-[0.02em] text-foreground opacity-55 transition-opacity duration-300 group-hover:opacity-100 md:text-2xl">
                {item}
              </span>
              <span className="text-base font-bold text-primary-text" aria-hidden="true">
                ·
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function MarqueeSection() {
  return (
    <section
      aria-label="Agency capabilities ticker"
      className="marquee-wrapper group relative w-full overflow-hidden border-b border-border bg-secondary py-5"
    >
      <div className="animate-arctic-marquee flex w-max items-center">
        <MarqueeHalf />
        <MarqueeHalf />
      </div>
    </section>
  );
}
