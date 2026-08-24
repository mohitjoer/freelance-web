"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck, MessagesSquare, Star, BadgeCheck } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// <!-- mock --> Platform stats are illustrative sample data.

const stats = [
  { value: "38k+", label: "Active freelancers" },
  { value: "12k+", label: "Projects delivered" },
  { value: "4.9/5", label: "Average rating" },
  { value: "96%", label: "Jobs completed on time" },
];

const pillars = [
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Every freelancer builds a profile with real skills, portfolio work, and a track record you can check before you hire.",
  },
  {
    icon: MessagesSquare,
    title: "Work stays on the platform",
    text: "Each project gets a dedicated workspace with secure, real-time chat — so agreements and updates live in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Clear scope, no surprises",
    text: "Budgets, deadlines, and milestones are agreed upfront. Payment is only confirmed when you approve the completed work.",
  },
];

export default function HomeTrust() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-stat",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".anim-stats", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".anim-pillar",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".anim-pillars", start: "top 85%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Proof stats */}
        <div className="anim-stats grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="anim-stat">
              <p className="text-display-sm font-display font-bold text-primary tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-display-sm md:text-display-md font-display text-ink tracking-tight mb-3 max-w-xl">
          A marketplace built on trust
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl">
          Hiring over the internet takes trust. We make it structural, not optional.
        </p>

        <div className="anim-pillars grid md:grid-cols-3 gap-4 md:gap-5">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="anim-pillar bg-background border border-hairline rounded-2xl p-7 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition">
              <span className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <pillar.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <h3 className="text-title-sm font-bold text-ink mb-2">{pillar.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
