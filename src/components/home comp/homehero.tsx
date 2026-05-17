"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { gsap } from "gsap";

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline and text animations
      gsap.fromTo(".anim-hero-text > *", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          delay: 0.1
        }
      );

      // Visual side entrance
      gsap.fromTo(".anim-visual",
        { opacity: 0, x: 40, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
      );

      // Floating cards stagger
      gsap.fromTo(".anim-float",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 1, ease: "back.out(1.5)", delay: 0.8 }
      );

      // Continuous subtle float for cards
      gsap.to(".anim-float", {
        y: "+=12",
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          amount: 1.5,
          from: "random"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="pt-[140px] md:pt-[180px] pb-24 md:pb-32 bg-surface-dark text-on-dark overflow-hidden relative">
      
      {/* Immersive Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-60 mix-blend-screen"></div>
        <div className="absolute top-[30%] -left-[10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[140px] opacity-40 mix-blend-screen"></div>
        <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] opacity-30 mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTA */}
          <div className="anim-hero-text max-w-2xl lg:max-w-none">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xl mb-8">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-dark bg-primary/40 flex items-center justify-center text-[10px] font-bold text-on-dark">
                     {String.fromCharCode(64 + i)}
                   </div>
                 ))}
               </div>
               <span className="text-caption-strong text-on-dark-soft">Trusted by 10k+ businesses</span>
            </div>

            <h1 className="text-display-lg md:text-display-xl font-display text-on-dark leading-[1.05] tracking-tight mb-6">
              Work Together <span className="bg-gradient-to-r from-blue-400 via-primary to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">Without the Chaos</span>
            </h1>
            
            <p className="text-lg md:text-xl text-on-dark-soft leading-relaxed max-w-xl mb-10">
              A modern freelance collaboration platform where every project gets its own secure workspace, real-time communication, and transparent workflow management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/onboarding?role=client">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl text-title-sm font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all group">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/onboarding?role=freelancer">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl text-title-sm font-bold border border-white/10 bg-white/5 text-on-dark hover:bg-white/10 hover:text-white transition-all backdrop-blur-md">
                  Explore Projects
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Glass Mockup */}
          <div className="anim-visual relative mt-12 lg:mt-0">
            {/* Main Glass Panel */}
            <div className="relative z-10 bg-surface-dark/80 border border-white/10 backdrop-blur-2xl rounded-[40px] p-6 shadow-2xl shadow-black/50 aspect-square md:aspect-[4/3] flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-title-sm font-bold text-on-dark leading-tight">Project Horizon</h3>
                    <p className="text-xs text-on-dark-soft font-medium mt-1">Design & Development</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                  On Track
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Progress", val: "78%", color: "text-blue-400" },
                  { label: "Tasks", val: "24/32", color: "text-indigo-400" },
                  { label: "Budget", val: "$4.2k", color: "text-purple-400" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-on-dark-soft font-bold mb-1">{stat.label}</span>
                    <span className={`text-xl font-bold ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Task List */}
              <div className="flex-1 space-y-3 relative z-10">
                <p className="text-xs font-bold text-on-dark uppercase tracking-widest mb-2">Recent Activity</p>
                
                {[
                  { task: "Wireframe Approval", time: "2h ago", status: "bg-emerald-500" },
                  { task: "API Integration", time: "5h ago", status: "bg-amber-500" },
                  { task: "Database Schema", time: "1d ago", status: "bg-emerald-500" },
                ].map((item, i) => (
                  <div key={i} className="w-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-3 flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.status} shadow-[0_0_8px_currentColor] opacity-80`}></div>
                      <span className="text-sm font-medium text-on-dark group-hover:text-primary transition-colors">{item.task}</span>
                    </div>
                    <span className="text-xs text-on-dark-soft font-medium">{item.time}</span>
                  </div>
                ))}
              </div>
              
              {/* Bottom Gradient Fade */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#111115] to-transparent pointer-events-none z-20"></div>
            </div>

            {/* Floating Detail Card 1 */}
            <div className="anim-float absolute -left-8 md:-left-12 top-20 z-20 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl shadow-black/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-on-dark">Milestone Approved</p>
                <p className="text-xs text-on-dark-soft">Payment secured</p>
              </div>
            </div>

            {/* Floating Detail Card 2 */}
            <div className="anim-float absolute -right-6 md:-right-10 bottom-24 z-20 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl shadow-black/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm text-on-dark">Verified Expert</p>
                <p className="text-xs text-on-dark-soft">Top 1% Talent</p>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </main>
  );
}