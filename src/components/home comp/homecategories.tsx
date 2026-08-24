"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  { name: "Web Development", seed: "freelancebase-webdev-code" },
  { name: "Graphic Design", seed: "freelancebase-graphic-design" },
  { name: "Writing", seed: "freelancebase-writing-desk" },
  { name: "Video Editing", seed: "freelancebase-video-studio" },
  { name: "Digital Marketing", seed: "freelancebase-marketing-team" },
  { name: "Data & Analytics", seed: "freelancebase-data-charts" },
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
        <p className="text-lg text-muted-foreground mb-10 max-w-xl">
          Whatever the work, there is a freelancer ready to take it on.
        </p>

        <div className="anim-cat-grid grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/jobs/open"
              className="anim-cat group relative overflow-hidden rounded-2xl aspect-[4/3] active:scale-[0.99] transition-transform"
            >
              <Image
                src={`https://picsum.photos/seed/${cat.seed}/640/480`}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover brightness-[0.72] group-hover:brightness-[0.62] group-hover:scale-105 transition duration-500"
              />
              <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <span className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between gap-2">
                <span>
                  <span className="block text-white font-bold text-base md:text-lg leading-tight">{cat.name}</span>
                  <span className="hidden sm:block text-white/70 text-xs mt-1">Explore open jobs</span>
                </span>
                <span className="w-8 h-8 shrink-0 rounded-full bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
