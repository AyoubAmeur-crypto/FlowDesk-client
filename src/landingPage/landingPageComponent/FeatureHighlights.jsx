import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Target,
  Clock,
  Shield,
  Users,
  TrendingUp,
  Award
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

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

function FeatureHighlights() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const featuresRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    const features = featuresRef.current

    if (!section || !features) return

    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { y: 50, opacity: 0, immediateRender: false },
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

      // Animate feature items with progressive reveal
      gsap.fromTo(
        features.children,
        {
          y: 100,
          opacity: 0,
          rotateX: -15,
          immediateRender: false,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: {
            each: 0.12,
            from: 'start',
          },
          scrollTrigger: {
            trigger: features,
            start: 'top 75%',
          }
        }
      )

      // Parallax effect on feature items as you scroll
      Array.from(features.children).forEach((item, index) => {
        gsap.to(item, {
          y: (index % 2) * -20,
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        })
      })

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-32 bg-black px-4 md:px-8 lg:px-16"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Why Choose FlowDesk
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
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
                className="group relative rounded-2xl p-8 transition-all duration-500 transform-gpu"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Animated Border Glow on Hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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

                {/* Number Indicator */}
                <div className="absolute top-6 right-6 text-4xl md:text-5xl font-bold text-white/5">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Hover Arrow Indicator */}
                <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <div className="w-1 h-1 rounded-full bg-white/60" />
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