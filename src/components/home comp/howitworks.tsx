"use client";

import { useEffect, useRef } from "react";
import { UserPlus, FolderKanban, Activity, Award } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      num: "01",
      title: "Create or Apply for a Project",
      icon: UserPlus,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      num: "02",
      title: "Get a Dedicated Project Workspace",
      icon: FolderKanban,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    },
    {
      num: "03",
      title: "Communicate, Collaborate, and Track Progress",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      num: "04",
      title: "Complete Projects with Transparency and Trust",
      icon: Award,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".anim-title > *", 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".anim-title",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(".anim-step", 
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".anim-step",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pt-12 md:pt-16 pb-24 md:pb-32 bg-surface-dark text-on-dark relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="anim-title text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h2 className="text-display-sm md:text-display-md font-display leading-tight">
            How It <span className="text-primary italic">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-on-dark-soft max-w-2xl mx-auto">
            A seamless four-step workflow designed to eliminate chaos and guarantee high-quality project delivery.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connector Line (Desktop only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 pointer-events-none z-0"></div>

          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="anim-step bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 relative z-10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-surface-dark border-2 border-white/10 rounded-2xl flex items-center justify-center font-display font-bold text-xl text-on-dark-soft group-hover:text-primary group-hover:border-primary/50 transition-colors shadow-xl">
                {step.num}
              </div>

              <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center mb-6 mt-2`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              
              <h3 className="text-title-sm font-bold text-on-dark leading-snug">
                {step.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
