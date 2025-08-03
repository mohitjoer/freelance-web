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
  Star
} from "lucide-react";
import Image from "next/image";

function HomeFooter() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          
          {/* Logo and Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image 
                src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png" 
                alt="FreeLanceBase Logo" 
                className="w-10 h-10 rounded-lg"
                width={100}
                height={100}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FreeLanceBase
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed max-w-md">
              Connecting talented freelancers with amazing clients worldwide. 
              Build your career, grow your business, and achieve your goals with FreeLanceBase.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm">hello@freelancebase.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div 
              key={key} 
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const IconComponent = 'icon' in link ? link.icon : null;
                  return (
                    <li key={linkIndex}>
                      <a 
                        href={link.href}
                        className="footer-link text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span>{link.name}</span>
                        <ArrowRight className="link-arrow w-3 h-3 opacity-0 transition-all duration-200" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Newsletter Subscription */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Get the latest updates, tips, and opportunities delivered to your inbox.
              </p>
            </div>

            {/* Social Links */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span>© 2025 FreeLanceBase. All rights reserved.</span>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for freelancers worldwide</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-4">
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;