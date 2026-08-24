"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// <!-- mock --> Quotes, names, and ratings are illustrative sample data.

const testimonials = [
  {
    quote: "I posted a job in the morning and had three solid proposals by lunch. The whole hire took under a day.",
    name: "Daniel Okafor",
    role: "Founder, Loopwork Studio",
    side: "Client",
    rating: 5,
  },
  {
    quote: "Every project has its own workspace, so nothing gets lost in email threads. My clients love it too.",
    name: "Aisha Rahman",
    role: "Full-stack developer",
    side: "Freelancer",
    rating: 5,
  },
  {
    quote: "Proposals, milestones, and chat in one place. It is the first platform that feels built for delivery.",
    name: "Marta Silva",
    role: "Brand designer",
    side: "Freelancer",
    rating: 5,
  },
];

export default function HomeTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-quote",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".anim-quotes", start: "top 85%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-surface-soft border-y border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-display-sm md:text-display-md font-display text-ink tracking-tight mb-10">
          Both sides of the marketplace agree
        </h2>

        <div className="anim-quotes grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="anim-quote flex flex-col bg-background border border-hairline rounded-2xl p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={`item-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                  {t.side}
                </span>
              </div>

              <blockquote className="text-body text-ink leading-relaxed mb-6">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 pt-4 border-t border-hairline">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
