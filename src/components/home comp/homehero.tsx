"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, BadgeCheck } from "lucide-react";
import { gsap } from "gsap";

// <!-- mock --> All jobs, freelancers, ratings and earnings on this page are illustrative sample data.

const rotatingWords = ["websites", "logo design", "video editing", "copywriting", "mobile apps"];
const popularSearches = ["Web development", "Logo design", "Video editing", "SEO", "Copywriting"];

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-hero-text > *",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo(
        ".anim-card",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "back.out(1.2)", delay: 0.4 }
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
    <main ref={containerRef} className="pt-[120px] md:pt-[140px] pb-16 md:pb-24 bg-canvas overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-10 items-center">

          {/* Left Column */}
          <div className="anim-hero-text max-w-xl">
            <h1 className="text-display-lg md:text-display-xl font-display text-ink leading-[1.08] tracking-tight mb-5 min-h-[2.2em]">
              Hire expert freelancers
              <br />
              for{" "}
              <span key={wordIndex} className="hero-word inline-block text-primary underline decoration-primary/30 decoration-4 underline-offset-8">
                {rotatingWords[wordIndex]}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Post a job free, compare proposals, and get work done in one shared workspace.
            </p>

            {/* Search bar is the primary CTA */}
            <form onSubmit={handleSearch} role="search" className="flex flex-col sm:flex-row gap-3 mb-4 max-w-lg">
              <label htmlFor="hero-search" className="sr-only">Search open jobs</label>
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What work do you need done?"
                  className="w-full h-14 pl-13 pr-4 rounded-full bg-background border border-hairline text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-9 rounded-full bg-primary text-on-dark font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground mr-1">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/jobs/open?search=${encodeURIComponent(term)}`)}
                  className="px-4 py-1.5 rounded-full border border-hairline bg-background text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/40 active:scale-[0.98] transition cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: live marketplace preview */}
          <div className="w-full max-w-md mx-auto lg:max-w-md lg:mx-0">

            {/* Job card */}
            <div className="anim-card relative z-10 bg-background border border-hairline rounded-2xl p-6 shadow-xl shadow-ink/5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-caption-strong text-muted-foreground uppercase tracking-wider mb-1">Posted 2h ago</p>
                  <h2 className="text-title-md font-bold text-ink leading-snug">
                    Build a responsive admin dashboard in React
                  </h2>
                </div>
                <span className="shrink-0 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold whitespace-nowrap flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Open
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {["React", "TailwindCSS", "Charts"].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-surface-soft border border-hairline text-xs font-medium text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-hairline text-sm">
                <span className="font-bold text-ink">$800 fixed</span>
                <span className="text-muted-foreground">Intermediate · 12 proposals</span>
              </div>
            </div>

            {/* Proposal notification chip — overlaps both cards */}
            <div className="anim-card relative z-30 -mt-5 flex justify-center px-2">
              <div className="flex items-center gap-3 bg-ink text-on-dark rounded-full pl-2 pr-5 py-2 shadow-2xl">
                <span className="w-8 h-8 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                  ✓
                </span>
                <span className="text-sm font-medium text-on-dark whitespace-nowrap">New proposal received</span>
              </div>
            </div>

            {/* Freelancer card with proof stats */}
            <div className="anim-card relative z-20 -mt-1 ml-auto w-full sm:w-[88%] bg-background border border-hairline rounded-2xl p-6 shadow-xl shadow-ink/5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                  AR
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink truncate flex items-center gap-1.5">
                    Aisha Rahman
                    <BadgeCheck className="w-4 h-4 text-primary shrink-0" aria-label="Verified" />
                  </p>
                  <p className="text-xs text-muted-foreground truncate">Full-stack developer</p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-hairline border-y border-hairline py-3 mb-4 text-center">
                <div>
                  <p className="text-sm font-bold text-ink">$85k+</p>
                  <p className="text-[11px] text-muted-foreground">Earned</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">31×</p>
                  <p className="text-[11px] text-muted-foreground">Hired</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm font-bold text-ink flex items-center gap-1">
                    4.9
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </p>
                  <p className="text-[11px] text-muted-foreground">Rating</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  Available now
                </span>
                <span className="font-bold text-ink">$45/hr</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Rotating word animation */}
      <style jsx>{`
        .hero-word {
          animation: heroWordIn 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes heroWordIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-word {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
