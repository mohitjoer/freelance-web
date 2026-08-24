"use client";

import { useEffect, useRef } from "react";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// <!-- mock --> Jobs, budgets, proposal counts and ratings are illustrative sample data.

const jobs = [
  {
    title: "Landing page redesign in Figma",
    category: "Design",
    budget: "$450",
    rate: "fixed price",
    level: "Intermediate",
    proposals: 8,
    skills: ["Figma", "UI/UX"],
    client: { initials: "DO", name: "Daniel O.", rating: "4.9" },
    seed: "freelancebase-job-figma",
  },
  {
    title: "React + Tailwind developer for SaaS app",
    category: "Development",
    budget: "$25–40/hr",
    rate: "hourly",
    level: "Expert",
    proposals: 15,
    skills: ["React", "TailwindCSS"],
    client: { initials: "MS", name: "Maya S.", rating: "5.0" },
    seed: "freelancebase-job-react",
  },
  {
    title: "Product demo video edit (2 min)",
    category: "Video",
    budget: "$300",
    rate: "fixed price",
    level: "Intermediate",
    proposals: 6,
    skills: ["Premiere Pro", "Motion"],
    client: { initials: "TK", name: "Tomas K.", rating: "4.8" },
    seed: "freelancebase-job-video",
  },
  {
    title: "4 blog articles for B2B SaaS",
    category: "Writing",
    budget: "$200",
    rate: "fixed price",
    level: "Beginner",
    proposals: 11,
    skills: ["SEO", "Copywriting"],
    client: { initials: "RB", name: "Rhea B.", rating: "4.7" },
    seed: "freelancebase-job-writing",
  },
];

const freelancers = [
  { initials: "JM", name: "James Miller", role: "Brand designer", rate: "$38/hr", rating: 4.8 },
  { initials: "LC", name: "Lucía Costa", role: "Video editor", rate: "$30/hr", rating: 5.0 },
  { initials: "KP", name: "Karan Patel", role: "Content writer", rate: "$22/hr", rating: 4.7 },
];

export default function HomeJobs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-job",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".anim-job-list", start: "top 85%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-surface-soft border-y border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-display-sm md:text-display-md font-display text-ink tracking-tight mb-2">
              Fresh jobs, posted today
            </h2>
            <p className="text-lg text-muted-foreground">
              Real briefs with real budgets. Apply directly from your dashboard.
            </p>
          </div>
          <Link href="/jobs/open" className="hidden sm:inline-flex items-center gap-1.5 text-primary font-bold hover:gap-2.5 transition">
            Browse open jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* Gig-style job cards */}
          <div className="anim-job-list grid sm:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <Link
                key={job.title}
                href="/jobs/open"
                className="anim-job group bg-background border border-hairline rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-ink/10 active:scale-[0.99] transition flex flex-col"
              >
                {/* Cover image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-surface-soft">
                  <Image
                    src={`https://picsum.photos/seed/${job.seed}/640/360`}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-white text-xs font-bold">
                    {job.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-title-sm font-bold text-ink leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>

                  {/* Client row */}
                  <div className="flex items-center gap-2 mt-auto pt-3 mb-3 text-sm">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                      {job.client.initials}
                    </span>
                    <span className="font-semibold text-muted-foreground truncate">{job.client.name}</span>
                    <span className="flex items-center gap-1 ml-auto shrink-0 font-semibold text-ink">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {job.client.rating}
                    </span>
                  </div>

                  {/* Price row */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-hairline">
                    <span className="text-xs text-muted-foreground">{job.proposals} proposals</span>
                    <span className="text-right">
                      <span className="block font-bold text-primary leading-tight">{job.budget}</span>
                      <span className="block text-[11px] text-muted-foreground">{job.rate}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Top talent rail */}
          <aside className="bg-background border border-hairline rounded-2xl p-6">
            <h3 className="text-title-sm font-bold text-ink mb-1">Top rated freelancers</h3>
            <p className="text-xs text-muted-foreground mb-5">By completed projects this month</p>

            <ul className="divide-y divide-hairline">
              {freelancers.map((f) => (
                <li key={f.name} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {f.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink truncate">{f.name}</span>
                    <span className="block text-xs text-muted-foreground truncate">{f.role} · {f.rate}</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-ink whitespace-nowrap">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {f.rating}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/sign-up" className="block mt-5">
              <Button variant="outline" className="w-full rounded-full border-hairline font-bold text-ink hover:bg-surface-soft hover:text-ink">
                Join to hire them
              </Button>
            </Link>
          </aside>
        </div>

        <Link href="/jobs/open" className="sm:hidden inline-flex items-center gap-1.5 text-primary font-bold mt-8">
          Browse open jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
