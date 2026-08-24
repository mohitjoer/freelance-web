"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Product: [
    { name: "How it Works", href: "/how-it-works" },
    { name: "Browse Talent", href: "/browse-talent" },
    { name: "Post a Job", href: "/post-job" },
    { name: "Pricing", href: "/pricing" }
  ],
  Resources: [
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
    { name: "Trust & Safety", href: "/trust-safety" },
    { name: "API Documentation", href: "/api-docs" }
  ],
  Legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" }
  ]
};

export default function HomeFooter() {
  return (
    <footer className="bg-surface-soft border-t border-hairline transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          
          {/* Logo and Tagline */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png" 
                alt="FreeLanceBase Logo" 
                className="w-10 h-10 rounded-lg shadow-sm"
                width={40}
                height={40}
              />
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FreeLanceBase
              </span>
            </Link>
            <p className="text-body-sm text-muted-foreground max-w-sm leading-relaxed">
              A modern freelance collaboration platform where every project gets its own secure workspace, real-time communication, and transparent workflow management.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-5">
              <h4 className="text-caption-strong text-ink">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-body-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} FreeLanceBase. All rights reserved.</span>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for freelancers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}