"use client";

import { 
  Mail,  
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  ArrowRight,
  Heart,
  Users,
  Briefcase,
  HelpCircle,
  FileText,
  Star,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

function HomeFooter() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: string) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  // Close accordion on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openSection) {
        setOpenSection(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openSection]);

  // Close accordion on click outside the category sections
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openSection && sectionsRef.current && !sectionsRef.current.contains(event.target as Node)) {
        setOpenSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openSection]);

  const footerLinks = {
    platform: {
      title: "Platform",
      links: [
        { name: "How it Works", href: "/how-it-works", icon: HelpCircle },
        { name: "Browse Talent", href: "/browse-talent", icon: Users },
        { name: "Post a Job", href: "/post-job", icon: Briefcase },
        { name: "Success Stories", href: "/success-stories", icon: Star },
        { name: "Pricing", href: "/pricing", icon: FileText }
      ]
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" }
      ]
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Community", href: "/community" },
        { name: "Trust & Safety", href: "/trust-safety" },
        { name: "Quality Guide", href: "/quality-guide" },
        { name: "API Documentation", href: "/api-docs" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Copyright Policy", href: "/copyright" },
        { name: "Accessibility", href: "/accessibility" }
      ]
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/freelancebase", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/freelancebase", color: "hover:text-sky-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/freelancebase", color: "hover:text-blue-700" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/freelancebase", color: "hover:text-pink-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/freelancebase", color: "hover:text-red-600" }
  ];
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-8">
          
          {/* Logo and Company Info - Compact on mobile */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image 
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png" 
                alt="FreeLanceBase Logo" 
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg"
                width={100}
                height={100}
              />
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FreeLanceBase
              </span>
            </div>

            {/* Description - Hidden on mobile */}
            <p className="text-gray-300 leading-relaxed max-w-md text-sm hidden md:block">
              Connecting talented freelancers with amazing clients worldwide. 
              Build your career, grow your business, and achieve your goals with FreeLanceBase.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center gap-2 lg:gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs lg:text-sm">hello@freelancebase.com</span>
              </div>
            </div>

            {/* Social Links - Mobile */}
            <div className="md:hidden">
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors duration-200`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Footer Links - 2 column grid on mobile, regular grid on desktop */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 lg:gap-8" ref={sectionsRef}>
            {Object.entries(footerLinks).map(([key, section]) => (
              <div 
                key={key} 
                className="border-b border-gray-800 lg:border-0 pb-3 lg:pb-0"
              >
                {/* Mobile: Collapsible Header */}
                <button
                  onClick={() => toggleSection(key)}
                  className="lg:hidden w-full flex items-center justify-between py-2 px-2 text-left rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 text-blue-400 ${openSection === key ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Desktop: Regular Header */}
                <h3 className="hidden lg:block text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-2">{section.title}</h3>

                {/* Links - 2 columns on mobile when expanded */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openSection === key ? 'max-h-96 mt-2' : 'max-h-0 lg:max-h-none lg:mt-0'
                }`}>
                  <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-2 gap-y-2 lg:gap-y-3 lg:space-y-0">
                    {section.links.map((link, linkIndex) => {
                      const IconComponent = 'icon' in link ? link.icon : null;
                      return (
                        <li key={linkIndex}>
                          <a 
                            href={link.href}
                            className="footer-link text-gray-300 hover:text-blue-400 hover:bg-gray-800/30 transition-all duration-200 text-sm flex items-center gap-1.5 group py-1.5 px-2 rounded-md"
                          >
                            {IconComponent && <IconComponent className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />}
                            <span className="text-xs lg:text-sm truncate">{link.name}</span>
                            <ArrowRight className="link-arrow w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 hidden lg:block" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Subscription - Desktop only */}
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Get the latest updates, tips, and opportunities delivered to your inbox.
              </p>
            </div>

            {/* Social Links - Desktop */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-colors duration-200`}
                      aria-label={social.name}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-400 text-xs lg:text-sm text-center md:text-left">
              <span>© 2025 FreeLanceBase. All rights reserved.</span>
              <div className="hidden md:flex items-center gap-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for freelancers worldwide</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 lg:gap-6 text-gray-400 text-xs lg:text-sm">
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;