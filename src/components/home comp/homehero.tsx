"use client";

import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Star, Users, CheckCircle, ArrowRight, Play } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const trustBadgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const popularSectionRef = useRef<HTMLDivElement>(null);
  const ctaButtonsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const floatingCard1Ref = useRef<HTMLDivElement>(null);
  const floatingCard2Ref = useRef<HTMLDivElement>(null);
  const floatingCard3Ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([
        trustBadgeRef.current,
        headlineRef.current,
        subtitleRef.current,
        popularSectionRef.current,
        ctaButtonsRef.current,
        visualRef.current,
        floatingCard1Ref.current,
        floatingCard2Ref.current,
        floatingCard3Ref.current
      ], {
        opacity: 0,
        y: 30
      });

      // Background animation
      gsap.fromTo(
        backgroundRef.current?.children || [],
        {
          scale: 0.8,
          opacity: 0.5
        },
        {
          scale: 1,
          opacity: 0.7,
          duration: 2,
          ease: "power2.out",
          stagger: 0.5
        }
      );

      // Main entrance animation timeline
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(trustBadgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      .to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(popularSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      .to(ctaButtonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      .to(visualRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6");

      // Floating cards animation with stagger
      gsap.to([
        floatingCard1Ref.current,
        floatingCard2Ref.current,
        floatingCard3Ref.current
      ], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 1.2,
        stagger: 0.2
      });

      // Continuous floating animation for cards
      const floatingCards = [
        floatingCard1Ref.current,
        floatingCard2Ref.current,
        floatingCard3Ref.current
      ];

      floatingCards.forEach((card, index) => {
        if (card) {
          gsap.to(card, {
            y: "+=10",
            duration: 2 + index * 0.3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.5
          });
        }
      });

      // Stats section scroll animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Gradient text animation
      const gradientTexts = headlineRef.current?.querySelectorAll('.bg-gradient-to-r');
      if (gradientTexts) {
        gradientTexts.forEach((text, index) => {
          gsap.fromTo(text, {
            backgroundPosition: "200% center"
          }, {
            backgroundPosition: "0% center",
            duration: 1.5,
            ease: "power2.out",
            delay: 1 + index * 0.2
          });
        });
      }

      // Button hover animations
      const buttons = ctaButtonsRef.current?.querySelectorAll('button');
      buttons?.forEach((button) => {
        const arrow = button.querySelector('[data-lucide="arrow-right"]');
        
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
          if (arrow) {
            gsap.to(arrow, {
              x: 5,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      });

      // Tag buttons animation
      const tagButtons = popularSectionRef.current?.querySelectorAll('button');
      tagButtons?.forEach((button, index) => {
        gsap.fromTo(button, {
          opacity: 0,
          scale: 0.8
        }, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          delay: 1.5 + index * 0.05
        });

        // Hover animation for tag buttons
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out"
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        });
      });

      // Parallax effect for background elements
      gsap.to(backgroundRef.current?.children || [], {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div ref={backgroundRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      <div ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div ref={trustBadgeRef} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 w-fit">
             <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
              <span className="text-sm font-medium text-gray-700">Trusted by clients & freelancers worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 ref={headlineRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Where
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent bg-[length:200%_100%]"> talent </span>
                meets
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%]"> opportunity</span>
              </h1>
              <p ref={subtitleRef} className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Whether you&apos;re hiring top talent or showcasing your skills, FreeLancBase connects the right people for every project. Join millions of freelancers and clients worldwide.
              </p>
            </div>

            {/* Popular Searches */}
            <div ref={popularSectionRef} className="space-y-3">
              <p className="text-sm text-gray-500 font-medium">Popular for clients:</p>
              <div className="flex flex-wrap gap-2">
                {["Web Development", "Logo Design", "Content Writing", "Mobile Apps", "SEO"].map((tag) => (
                  <button key={tag} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 text-blue-600 rounded-full text-sm font-medium transition-colors duration-200 border border-blue-200 hover:border-blue-300">
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-4">Popular for freelancers:</p>
              <div className="flex flex-wrap gap-2">
                {["Remote Jobs", "Part-time Work", "Project Based", "Long-term", "Entry Level"].map((tag) => (
                  <button key={tag} className="px-4 py-2 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 text-purple-600 rounded-full text-sm font-medium transition-colors duration-200 border border-purple-200 hover:border-purple-300">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div ref={ctaButtonsRef} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-lg group">
                Start as Client
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-lg group">
                Join as Freelancer
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-colors duration-200 text-lg group">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Image Container */}
            <div ref={visualRef} className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Connect & Collaborate</h3>
                  <p className="text-blue-100">Join thousands of successful projects</p>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div ref={floatingCard1Ref} className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Verified</p>
                  <p className="text-sm text-gray-600">Talent Profiles</p>
                </div>
              </div>
            </div>

            <div ref={floatingCard2Ref} className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Based on</p>
                  <p className="text-sm text-gray-600">Reviews & Ratings</p>
                </div>
              </div>
            </div>

            <div ref={floatingCard3Ref} className="absolute top-1/2 -left-8 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">2K+</p>
                  <p className="text-sm text-gray-600">Active Community Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { label: "Community User's", value: "2K+" },
              { label: "Active User's", value: "10K+" },
              { label: "Happy Clients", value: "50K+" },
              { label: "Countries", value: "150+" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeHero;