import React, { useRef, useEffect, useState } from 'react'
import {
  Target,
  Clock,
  Shield,
  Users,
  TrendingUp,
  Award
} from 'lucide-react'
import { useReducedMotion, useInView } from '../hooks/useReducedMotion'

const features = [
  {
    icon: Target,
    title: 'Precision Targeted',
    description: 'Every pixel serves a purpose. Our designs are meticulously crafted to achieve your specific business objectives.',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Clock,
    title: 'Lightning Fast',
    description: 'Optimized performance that loads in milliseconds. Speed is not a feature, it\'s a fundamental requirement.',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security protocols protect your data and your customers. Trust is built into every layer.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Designed for humans. Every interaction is tested and refined for optimal user experience and accessibility.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: TrendingUp,
    title: 'Growth Focused',
    description: 'Built to scale. Our solutions grow with your business, supporting expansion without compromising quality.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized excellence. Our work has been honored by leading design and technology organizations.',
    color: 'from-indigo-500 to-violet-500'
  }
]

/**
 * Optimized FeatureHighlights
 * - Lazy-loaded GSAP only when in view
 * - Staggered animations with cleanup
 * - Reduced motion: no parallax
 * - GPU-accelerated transforms only
 */
function FeatureHighlights() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const featuresRef = useRef(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)

  const reducedMotion = useReducedMotion()
  const isInView = useInView(sectionRef, { rootMargin: '50px' })

  useEffect(() => {
    if (!isInView) return

    if (reducedMotion) {
      setHeaderVisible(true)
      setFeaturesVisible(true)
      return
    }

    let ctx = null

    const runAnimation = async () => {
      // Use requestIdleCallback for non-critical animations
      const scheduleWork = 'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 1)

      scheduleWork(async () => {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])

        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          // Header animation
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
                trigger: sectionRef.current,
                start: 'top 80%',
                once: true,
                onEnter: () => setHeaderVisible(true),
              }
            }
          )

          // Feature cards animation
          if (featuresRef.current) {
            gsap.fromTo(
              featuresRef.current.children,
              {
                y: 80,
                opacity: 0,
                scale: 0.95,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: {
                  trigger: featuresRef.current,
                  start: 'top 75%',
                  once: true,
                  onEnter: () => setFeaturesVisible(true),
                }
              }
            )
          }
        }, sectionRef.current)
      })
    }

    runAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [isInView, reducedMotion])

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
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-700 ${
              headerVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            Why Choose FlowDesk
          </h2>
          <p
            ref={subtitleRef}
            className={`text-lg md:text-xl text-white/60 max-w-2xl mx-auto transition-all duration-700 delay-150 ${
              headerVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            We combine cutting-edge technology with creative excellence to deliver results that matter
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] ${
                  featuresVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transitionDelay: reducedMotion ? '0ms' : `${index * 100}ms`,
                }}
              >
                {/* Hover glow effect - CSS only for performance */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, rgba(${index % 2 === 0 ? '200,255,0' : '0,204,255'}, 0.1) 0%, transparent 50%)`,
                  }}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Number indicator */}
                <div className="absolute top-6 right-6 text-4xl md:text-5xl font-bold text-white/5">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeatureHighlights
