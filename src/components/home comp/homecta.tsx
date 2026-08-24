import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeCta() {
  return (
    <section className="py-16 md:py-24 bg-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-surface-dark text-on-dark rounded-[2rem] px-6 py-14 md:px-16 md:py-20 text-center">
          <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[140px] opacity-50 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-display-sm md:text-display-lg font-display leading-tight tracking-tight mb-4">
              Your next project or your next job starts here
            </h2>
            <p className="text-lg text-on-dark-soft leading-relaxed mb-9">
              Create a free account and be working in minutes.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center h-13 py-3.5 px-8 rounded-full bg-primary text-on-dark font-bold text-base shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform group"
              >
                Create free account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs/open"
                className="inline-flex items-center justify-center h-13 py-3.5 px-8 rounded-full border border-white/15 bg-white/5 text-on-dark font-bold text-base hover:bg-white/10 transition-colors"
              >
                Browse open jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
