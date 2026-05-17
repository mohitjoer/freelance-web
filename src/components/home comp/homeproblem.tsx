"use client";

import { useEffect, useRef } from "react";
import { Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeProblem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".anim-text > *", 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".anim-text",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(".anim-card", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".anim-card",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="anim-text text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-caption-strong font-bold">
            <Lightbulb className="w-4 h-4 fill-current/20" />
            THE MISSION
          </div>
          <h2 className="text-display-sm md:text-display-md font-display text-ink tracking-tight">
            Why We Built This Platform
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Most freelance platforms focus only on connecting people, not helping them collaborate effectively. Important discussions are often scattered across external apps, creating confusion and delays.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          
          {/* Problem Card */}
          <div className="anim-card bg-surface-soft border border-hairline rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-red-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-title-md font-bold text-ink mb-4">The Old Way</h3>
            <ul className="space-y-4">
              {["Scattered communication across apps", "Unclear project tracking & milestones", "Lack of accountability & trust issues"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Card */}
          <div className="anim-card bg-canvas border border-primary/20 shadow-xl rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-title-md font-bold text-ink mb-4">Our Solution</h3>
            <ul className="space-y-4">
              {["Structured project communication", "Clear accountability & tracking", "Secure collaboration inside one system"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
