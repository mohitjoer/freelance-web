"use client";

import { useEffect, useRef } from "react";
import { Layout, MessageCircle, Clock, Shield, Star, Zap, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeFeature() {
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Layout,
      title: "Dedicated Project Rooms",
      description: "Each project gets its own private communication space to keep discussions organized and easy to track.",
      gradient: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Real-Time Messaging",
      description: "Communicate instantly with clients and freelancers without switching between multiple apps.",
      gradient: "from-indigo-500 to-blue-500",
      iconColor: "text-indigo-500"
    },
    {
      icon: Clock,
      title: "Persistent Chat History",
      description: "All conversations and updates remain securely stored for future reference and transparency.",
      gradient: "from-purple-500 to-indigo-500",
      iconColor: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Reporting & Moderation",
      description: "Integrated reporting systems help maintain a safer and more professional working environment.",
      gradient: "from-emerald-500 to-teal-500",
      iconColor: "text-emerald-500"
    },
    {
      icon: Star,
      title: "Beginner Friendly",
      description: "Simple workflows and clean interfaces make it easier for new freelancers to get started confidently.",
      gradient: "from-amber-500 to-orange-500",
      iconColor: "text-amber-500"
    },
    {
      icon: Zap,
      title: "Transparent Collaboration",
      description: "Track discussions, updates, and project activity in one centralized workspace.",
      gradient: "from-rose-500 to-pink-500",
      iconColor: "text-rose-500"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(".anim-header > *", 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".anim-header",
            start: "top 80%",
          },
        }
      );

      // Feature cards stagger
      gsap.fromTo(".anim-feature", 
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".anim-grid",
            start: "top 75%",
          },
        }
      );

      // Logo cloud entrance
      gsap.fromTo(".anim-logo", 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".anim-logo-container",
            start: "top 90%",
          },
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-canvas overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="anim-header text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-caption-strong font-bold">
            <Zap className="w-4 h-4 fill-current/20" />
            ENGINEERED FOR SCALE
          </div>
          <h2 className="text-display-md md:text-display-lg font-display text-ink tracking-tight">
            Everything You Need to <span className="text-primary italic">Manage Freelance Projects</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            FreeLanceBase isn't just a marketplace. It's a sophisticated ecosystem designed to streamline high-stakes project delivery.
          </p>
        </div>

        {/* Features Grid */}
        <div className="anim-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                className="anim-feature group relative bg-surface-soft/40 backdrop-blur-md rounded-[32px] p-8 md:p-10 border border-hairline hover:bg-canvas hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-10 absolute`}></div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative border border-hairline group-hover:border-primary/20 transition-colors bg-canvas`}>
                  <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                
                <h3 className="text-title-sm font-bold text-ink mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-body-md text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-[32px] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}