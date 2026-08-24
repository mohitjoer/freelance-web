"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, FileSearch, MessagesSquare, BadgeCheck, UserRoundPlus, Send, FolderKanban, Repeat } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const flows = {
  clients: {
    label: "For clients",
    steps: [
      { icon: BriefcaseBusiness, title: "Post a job", text: "Describe the work, set your budget, and publish in minutes." },
      { icon: FileSearch, title: "Compare proposals", text: "Review offers, portfolios, and ratings side by side." },
      { icon: MessagesSquare, title: "Collaborate in one place", text: "Every hired project gets a dedicated workspace with real-time chat." },
      { icon: BadgeCheck, title: "Approve and close", text: "Track milestones and confirm completion when you are satisfied." },
    ],
  },
  freelancers: {
    label: "For freelancers",
    steps: [
      { icon: UserRoundPlus, title: "Create your profile", text: "Show your skills, experience level, and best portfolio work." },
      { icon: Send, title: "Submit proposals", text: "Apply to open jobs with your rate and a short pitch." },
      { icon: FolderKanban, title: "Work in a dedicated space", text: "Chat with your client and track progress inside the job workspace." },
      { icon: Repeat, title: "Grow your reputation", text: "Finish projects, collect reviews, and win bigger jobs." },
    ],
  },
} as const;

type FlowKey = keyof typeof flows;

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flow, setFlow] = useState<FlowKey>("clients");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".anim-step",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".anim-steps", start: "top 85%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = flows[flow].steps;

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h2 className="text-display-sm md:text-display-md font-display text-ink tracking-tight">
            How it works
          </h2>

          {/* Audience toggle */}
          <div className="inline-flex self-start md:self-auto bg-surface-soft border border-hairline rounded-xl p-1">
            {(Object.keys(flows) as FlowKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setFlow(key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition active:scale-[0.98] ${
                  flow === key
                    ? "bg-ink text-on-dark shadow-md"
                    : "text-muted-foreground hover:text-ink"
                }`}
              >
                {flows[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="anim-steps grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" key={flow}>
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="anim-step relative bg-background border border-hairline rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition"
            >
              <span className="absolute top-6 right-6 font-display text-3xl font-bold text-ink/5 select-none">
                0{idx + 1}
              </span>

              <span className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-8">
                <step.icon className="w-5 h-5 text-primary" />
              </span>

              <h3 className="text-title-sm font-bold text-ink mb-2 leading-snug">{step.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
