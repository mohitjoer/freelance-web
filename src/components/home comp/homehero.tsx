"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, BadgeCheck, Clock } from "lucide-react";
import { gsap } from "gsap";

// <!-- mock --> Jobs, freelancers, ratings and budgets on this page are illustrative sample data.

const popularSearches = ["Web development", "Logo design", "Video editing", "SEO", "Copywriting"];

const previewJobs = [
  { title: "Responsive admin dashboard in React", budget: "$800", meta: "Intermediate · 12 proposals", rating: "4.9" },
  { title: "Brand identity for a coffee roaster", budget: "$1,200", meta: "Expert · 6 proposals", rating: "5.0" },
  { title: "Edit a 2-minute product demo video", budget: "$300", meta: "Intermediate · 9 proposals", rating: "4.8" },
];

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-hero-text > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.05 }
      );

      gsap.fromTo(
        ".anim-panel",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/jobs/open?search=${encodeURIComponent(trimmed)}` : "/jobs/open");
  }

  return (
    <main ref={containerRef} className="relative pt-24 md:pt-28 pb-14 md:pb-20 bg-canvas overflow-hidden">
      {/* Page depth: hairline grid + broad brand wash, both decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-brand-wash" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Left: value prop + search */}
          <div className="anim-hero-text">
            <p className="text-caption-strong text-primary mb-4">
              Independent talent marketplace
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.08] mb-5">
              Hire expert freelancers for your next project
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 measure">
              Post a job free, compare proposals side by side, and work together in one shared workspace.
            </p>

            {/* Search is the primary action */}
            <form onSubmit={handleSearch} role="search" className="mb-5">
              <label htmlFor="hero-search" className="sr-only">Search open jobs</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <input
                    id="hero-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What work do you need done?"
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-card border border-hairline text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 px-7 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition cursor-pointer"
                >
                  Search jobs
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground mr-1">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/jobs/open?search=${encodeURIComponent(term)}`)}
                  className="px-3.5 py-1.5 rounded-full border border-hairline bg-card text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Right: product preview */}
          <div className="anim-panel">
            <div className="rounded-2xl border border-hairline bg-card elev-3 overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-hairline">
                <div>
                  <p className="text-sm font-bold text-ink">Open jobs</p>
                  <p className="text-xs text-muted-foreground">Posted in the last 24 hours</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  142 live
                </span>
              </div>

              <ul className="divide-y divide-hairline">
                {previewJobs.map((job) => (
                  <li key={job.title} className="px-5 py-4 flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink text-sm leading-snug mb-1.5">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.meta}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary text-sm">{job.budget}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-end gap-1">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {job.rating}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-5 py-4 border-t border-hairline flex items-center gap-3">
                <span className="size-9 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  AR
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink flex items-center gap-1.5">
                    Aisha Rahman
                    <BadgeCheck className="size-4 text-primary shrink-0" aria-label="Verified" />
                  </p>
                  <p className="text-xs text-muted-foreground">Available now · $45/hr</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Clock className="size-3.5" />
                  Replies fast
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
