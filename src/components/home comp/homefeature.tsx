"use client";

import { useEffect, useRef } from "react";
import { Clock, FileText, Shield, MessageCircle, Star, Zap, Users, DollarSign } from "lucide-react";
import { gsap } from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function HomeFeature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionHeaderRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const featureCardsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: Clock,
      title: "Post a Job in Minutes",
      description: "Clients can quickly create detailed job listings with budgets, deadlines, and specific requirements.",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Smart Proposal System",
      description: "Freelancers submit tailored proposals; clients can review, compare, and hire the best fit easily.",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      icon: Shield,
      title: "Verified Talent Profiles",
      description: "Freelancers have detailed profiles with portfolios, skills, ratings, and past projects — ensuring transparency.",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: DollarSign,
      title: "Transparent Budget Matching",
      description: "Freelancers see project budgets upfront and propose accordingly — enabling fair pricing and financial clarity for both sides.",
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      icon: MessageCircle,
      title: "Real-Time Messaging",
      description: "Secure and instant chat enables smooth collaboration between clients and freelancers.",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Star,
      title: "Built-in Reviews & Ratings",
      description: "Both clients and freelancers can share feedback, helping build a trusted and credible community.",
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([
        badgeRef.current,
        titleRef.current,
        subtitleRef.current
      ], {
        opacity: 0,
        y: 30
      });

      gsap.set(featureCardsRefs.current, {
        opacity: 0,
        y: 50,
        scale: 0.9
      });

      gsap.set(ctaSectionRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });

      // Header animation timeline
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionHeaderRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      headerTl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      })
      .to(titleRef.current, {
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
      }, "-=0.4");

      // Gradient text animation
      const gradientText = titleRef.current?.querySelector('.bg-gradient-to-r');
      if (gradientText) {
        gsap.fromTo(gradientText, {
          backgroundPosition: "200% center"
        }, {
          backgroundPosition: "0% center",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      }

      // Feature cards staggered animation
      gsap.to(featureCardsRefs.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: {
          amount: 0.6,
          from: "start"
        },
        scrollTrigger: {
          trigger: featuresGridRef.current,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Feature cards hover animations
      featureCardsRefs.current.forEach((card) => {
        if (card) {
          const icon = card.querySelector('.feature-icon');
          const hoverBorder = card.querySelector('.hover-border');
          const cardContent = card.querySelector('.card-content');

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -8,
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            });

            gsap.to(icon, {
              scale: 1.1,
              rotation: 5,
              duration: 0.3,
              ease: "back.out(1.7)"
            });

            if (hoverBorder) {
              gsap.to(hoverBorder, {
                opacity: 0.1,
                duration: 0.3,
                ease: "power2.out"
              });
            }

            gsap.to(cardContent, {
              y: -2,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });

            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            });

            if (hoverBorder) {
              gsap.to(hoverBorder, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
              });
            }

            gsap.to(cardContent, {
              y: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      });

      // CTA section animation
      gsap.to(ctaSectionRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // CTA background pattern animation
      const backgroundPatterns = ctaSectionRef.current?.querySelectorAll('.bg-pattern');
      if (backgroundPatterns) {
        backgroundPatterns.forEach((pattern, index) => {
          gsap.to(pattern, {
            rotation: index === 0 ? 360 : -360,
            duration: 20,
            ease: "none",
            repeat: -1
          });
        });
      }

      // CTA buttons animation
      const ctaButtons = ctaSectionRef.current?.querySelectorAll('a');
      ctaButtons?.forEach((button, index) => {
        gsap.fromTo(button, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.5 + index * 0.1,
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });

        // Button hover animations
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            y: -3,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Subtle floating animation for feature icons
      featureCardsRefs.current.forEach((card, index) => {
        if (card) {
          const icon = card.querySelector('.feature-icon');
          if (icon) {
            gsap.to(icon, {
              y: "+=3",
              duration: 2 + index * 0.2,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
              delay: index * 0.3
            });
          }
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 bg-background dark:bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={sectionHeaderRef} className="text-center mb-16">
          <div ref={badgeRef} className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Platform Features
          </div>
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%]"> succeed</span>
          </h2>
          <p ref={subtitleRef} className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform provides all the tools and features both clients and freelancers need for successful project collaboration.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresGridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index} 
                ref={el => { featureCardsRefs.current[index] = el; }}
                className="group relative"
              >
                <div className="card-content bg-card dark:bg-card/80 rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-border/80 transition-all duration-300 h-full relative overflow-hidden">
                  {/* Icon */}
                  <div className={`feature-icon w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 transition-transform duration-300`}>
                    <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-muted-foreground transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className={`hover-border absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
  <div ref={ctaSectionRef} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="bg-pattern absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="bg-pattern absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Join Our Community</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful projects happening on FreeLancBase every day.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/select" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl inline-block text-center">                
            Start as Client
              </Link>
              <Link href="/select" className="bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl inline-block text-center">
                Join as Freelancer
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HomeFeature;