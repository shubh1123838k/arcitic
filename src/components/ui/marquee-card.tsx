import { Star } from "lucide-react";

import { LiquidCard, CardContent } from "@/components/ui/liquid-glass-card";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export const defaultTestimonials: TestimonialItem[] = [
  {
    name: "Arjun Kapoor",
    role: "India",
    content:
      "The website turned out better than I expected. The design feels premium, loads smoothly, and communicates everything clearly. Really impressed with the attention to detail.",
    avatar: "/src/assets/images/arjun_kapoor_portrait_1794888643633.jpg",
    rating: 5,
  },
  {
    name: "Emily Williams",
    role: "United Kingdom",
    content:
      "I wanted something clean and modern without making it look generic. The final result captured exactly the kind of professional image I was looking for.",
    avatar: "/src/assets/images/emily_williams_portrait_1794888644218.jpg",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    role: "India",
    content:
      "From the first discussion to the final delivery, everything was straightforward. The attention to detail and overall user experience were impressive.",
    avatar: "/src/assets/images/rohan_mehta_portrait_1794888645100.jpg",
    rating: 5,
  },
  {
    name: "James Sullivan",
    role: "United States",
    content:
      "What stood out was the balance between aesthetics and functionality. It feels like a professionally built digital product, not just another website.",
    avatar: "/src/assets/images/james_sullivan_portrait_1794888646040.jpg",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "India",
    content:
      "I loved how consistent the entire website feels. The layout, typography, and animations make the overall experience feel much more premium.",
    avatar: "/src/assets/images/sneha_patel_portrait_1794888645640.jpg",
    rating: 5,
  },
  {
    name: "Oliver Laurent",
    role: "France",
    content:
      "A smooth experience from start to finish. The website is elegant, responsive, and gives my business the online presence it needed.",
    avatar: "/src/assets/images/oliver_laurent_portrait_1794888646180.jpg",
    rating: 5,
  },
];

export interface MarqueeCardProps {
  items?: TestimonialItem[];
  className?: string;
  pauseOnHover?: boolean;
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
}

export const Component = ({
  items = defaultTestimonials,
  className,
  pauseOnHover = true,
  speed = "normal",
  reverse = false,
}: MarqueeCardProps) => {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-24"
      />

      <Marquee pauseOnHover={pauseOnHover} speed={speed} reverse={reverse} repeat={2} className="[--gap:1.25rem]">
        {items.map((testimonial, index) => (
          <LiquidCard
            key={`${testimonial.name}-${index}`}
            className="mx-1 h-full w-80 rounded-2xl border-border/80 bg-card/75 py-6 md:w-[22rem]"
          >
            <CardContent className="flex h-full flex-col justify-between p-6 py-0">
              <div>
                <div className="mb-5 flex items-center space-x-3.5">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name} portrait`}
                    width={44}
                    height={44}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 shrink-0 rounded-full border border-border object-cover object-center"
                  />
                  <div>
                    <h4 className="font-display text-xl font-normal leading-tight tracking-[-0.015em] text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="mt-0.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-primary-text">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="mb-5 font-sans text-sm font-light leading-[1.7] text-foreground/85">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>

              <div className="flex items-center space-x-1 border-t border-border/70 pt-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-primary-text text-primary-text"
                  />
                ))}
              </div>
            </CardContent>
          </LiquidCard>
        ))}
      </Marquee>
    </div>
  );
};

export { Component as MarqueeCard };
