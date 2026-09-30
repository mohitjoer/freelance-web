"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Code2, PenTool, BookOpenText, Clapperboard, Megaphone, ChartNoAxesColumn } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Class names are literals, not template-built, so Tailwind can see them.
const categories = [
  { name: "Web Development", detail: "React, Next.js, APIs", term: "Development", Icon: Code2, tile: "bg-cat-dev/10", hue: "text-cat-dev" },
  { name: "Graphic Design", detail: "Brand, logo, illustration", term: "Design", Icon: PenTool, tile: "bg-cat-design/10", hue: "text-cat-design" },
  { name: "Writing", detail: "Copy, articles, SEO", term: "Writing", Icon: BookOpenText, tile: "bg-cat-writing/10", hue: "text-cat-writing" },
  { name: "Video Editing", detail: "Edits, motion, reels", term: "Video", Icon: Clapperboard, tile: "bg-cat-video/10", hue: "text-cat-video" },
  { name: "Digital Marketing", detail: "Ads, growth, social", term: "Marketing", Icon: Megaphone, tile: "bg-cat-marketing/10", hue: "text-cat-marketing" },
  { name: "Data & Analytics", detail: "Dashboards, BI, ML", term: "Data", Icon: ChartNoAxesColumn, tile: "bg-cat-data/10", hue: "text-cat-data" },
];
export default function HomeCategories() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-cat",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".anim-cat-grid", start: "top 85%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-display-sm md:text-display-md font-display text-ink tracking-tight mb-3">
          Browse by category
        </h2>
        <p className="text-lg text-muted-foreground mb-10 measure">
          Pick a discipline and see the open briefs waiting for someone who knows it.
        </p>

        <div className="anim-cat-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline rounded-2xl overflow-hidden border border-hairline">
          {categories.map(({ name, detail, term, Icon, tile, hue }) => (
            <Link
              key={name}
              href={`/jobs/open?category=${term}`}
              className="anim-cat group flex items-center gap-4 bg-card p-6 transition-colors hover:bg-surface-soft"
            >
              <span className={`size-11 shrink-0 rounded-xl ${tile} flex items-center justify-center`}>
                <Icon className={`size-5 ${hue}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink leading-tight">{name}</span>
                <span className="block text-sm text-muted-foreground mt-0.5 truncate">{detail}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
