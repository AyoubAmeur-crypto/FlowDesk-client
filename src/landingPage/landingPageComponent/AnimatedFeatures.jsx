import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Target,
  Layers,
  Rocket,
  Shield,
  Zap,
  Cpu,
  Globe,
  Users,
  Sparkles
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    id: 1,
    icon: Target,
    title: 'Precision Engineering',
    description: 'Every pixel, every interaction crafted with meticulous attention to detail for flawless execution.',
    highlight: 'Pixel-Perfect'
  },
  {
    id: 2,
    icon: Layers,
    title: 'Scalable Architecture',
    description: 'Built for growth, our solutions scale seamlessly with your business needs.',
    highlight: 'Future-Ready'
  },
  {
    id: 3,
    icon: Rocket,
    title: 'Lightning Performance',
    description: 'Optimized for speed, delivering instant load times and smooth interactions.',
    highlight: 'Blazing Fast'
  },
  {
    id: 4,
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security protocols protect your data and your customers.',
    highlight: 'Secure by Default'
  },
  {
    id: 5,
    icon: Zap,
    title: 'Smart Automation',
    description: 'Intelligent workflows that save time and reduce manual overhead.',
    highlight: 'AI-Powered'
  },
  {
    id: 6,
    icon: Cpu,
    title: 'Cutting-Edge Tech',
    description: 'Leveraging the latest technologies for modern, robust solutions.',
    highlight: 'Latest Stack'
  }
]

function AnimatedFeatures() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const containerRef = useRef(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const progressRef = useRef(0)

  useGSAP(() => {
    const section = sectionRef.current
    const container = containerRef.current

    if (!section || !container) return

    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      )

      // Create scroll-triggered feature animation
      const features = Array.from(container.querySelectorAll('.feature-item'))

      // Animate features as they enter viewport
      gsap.fromTo(
        features,
        {
          x: -50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: container,
            start: 'top 70%',
          }
        }
      )

      // Highlight active feature on scroll
      features.forEach((feature, index) => {
        ScrollTrigger.create({
          trigger: feature,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveFeature(index),
          onEnterBack: () => setActiveFeature(index),
        })
      })

      // Animate highlight badge
      gsap.fromTo(
        container.querySelectorAll('.highlight-badge'),
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.2)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
          }
        }
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-32 bg-black px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Why Choose Us
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Experience the difference that precision, innovation, and dedication make
          </p>
        </div>

        {/* Features Container */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isActive = activeFeature === index

              return (
                <div
                  key={feature.id}
                  className={`feature-item group relative p-6 md:p-8 rounded-2xl transition-all duration-500 ${
                    isActive
                      ? 'bg-white/10 scale-[1.02] border border-[#c8ff00]/30'
                      : 'bg-white/5 hover:bg-white/8 border border-transparent'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Highlight Badge */}
                  {isActive && (
                    <div className="highlight-badge absolute -top-3 -right-3 px-3 py-1 bg-[#c8ff00] text-black text-xs font-semibold rounded-full shadow-[0_0_20px_rgba(200,255,0,0.4)]">
                      {feature.highlight}
                    </div>
                  )}

                  <div className="flex gap-5">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'bg-[#c8ff00] text-black'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <Icon size={28} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/60 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Animated Border */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl pointer-events-none">
                      <div
                        className="absolute inset-0 rounded-2xl animate-pulse"
                        style={{
                          border: '1px solid rgba(200, 255, 0, 0.3)',
                          boxShadow: '0 0 30px rgba(200, 255, 0, 0.1)',
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Visual Display */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square">
              {/* Animated Circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-white/10 rounded-full"
                    style={{
                      width: `${(i + 1) * 100}%`,
                      height: `${(i + 1) * 100}%`,
                      animation: `pulse-ring 3s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              {/* Central Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#c8ff00] to-[#00CCFF] flex items-center justify-center shadow-[0_0_60px_rgba(200,255,0,0.3)] animate-float"
                >
                  <Sparkles size={48} className="text-black" />
                </div>
              </div>

              {/* Floating Feature Icons */}
              {features.slice(0, 4).map((feature, index) => {
                const Icon = feature.icon
                const angle = (index * 90) * (Math.PI / 180)
                const radius = 140
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <div
                    key={feature.id}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      animation: `float-icon 4s ease-in-out infinite`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        activeFeature === index
                          ? 'bg-[#c8ff00] text-black scale-110 shadow-[0_0_30px_rgba(200,255,0,0.5)]'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <Icon size={28} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Decorative Particles */}
            <div className="absolute top-10 right-10 w-3 h-3 bg-[#c8ff00] rounded-full animate-pulse" />
            <div className="absolute bottom-20 left-10 w-2 h-2 bg-[#00CCFF] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.5;
          }
        }

        @keyframes float-icon {
          0%, 100% {
            transform: translate(calc(-50% + ${Math.cos(0) * 140}px), calc(-50% + ${Math.sin(0) * 140}px)) translateY(0);
          }
          50% {
            transform: translate(calc(-50% + ${Math.cos(0) * 140}px), calc(-50% + ${Math.sin(0) * 140}px)) translateY(-10px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default AnimatedFeatures