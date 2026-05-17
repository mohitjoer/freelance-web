"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck, MessageSquare, LayoutDashboard } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeTrust() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content entrance
      gsap.fromTo(".anim-content > *", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".anim-content",
            start: "top 80%",
          },
        }
      );

      // Cards entrance
      gsap.fromTo(".anim-card", 
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".anim-card",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pt-24 md:pt-32 pb-12 md:pb-16 bg-surface-dark text-on-dark overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] opacity-60"></div>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="anim-content space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-caption-strong font-bold">
              <ShieldCheck className="w-4 h-4 fill-current/20" />
              TRUSTED COLLABORATION
            </div>
            
            <h2 className="text-display-md md:text-display-lg font-display leading-[1.1] tracking-tight">
              Built for <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Better Freelance</span> Collaboration
            </h2>
            
            <p className="text-lg md:text-xl text-on-dark-soft leading-relaxed max-w-lg">
              Freelancers and clients often struggle with scattered communication, unclear project tracking, and trust issues. Our platform brings everything into one place with dedicated job-based workspaces, secure messaging, and structured collaboration tools.
            </p>
          </div>

          {/* Right Column: Visual Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6 relative">
            <div 
              className="anim-card bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                <LayoutDashboard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-title-sm font-bold mb-2">Dedicated Workspaces</h3>
              <p className="text-body-sm text-on-dark-soft">Organize assets, milestones, and tasks centrally.</p>
            </div>

            <div 
              className="anim-card bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 hover:bg-white/10 transition-colors duration-300 sm:translate-y-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-title-sm font-bold mb-2">Secure Messaging</h3>
              <p className="text-body-sm text-on-dark-soft">Real-time chat with persistent history.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
