import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Palette,
  Layout,
  Code,
  Rocket,
  Megaphone,
  BarChart3,
  Smartphone,
  Globe,
  Zap
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Palette,
    title: 'Brand Design',
    description: 'Create memorable brand identities that resonate with your audience and stand out in crowded markets.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Layout,
    title: 'UI/UX Design',
    description: 'Craft intuitive and beautiful user experiences that delight users and drive engagement.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Code,
    title: 'Web Development',
    description: 'Build fast, scalable, and secure web applications using cutting-edge technologies.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Develop native and cross-platform mobile applications that deliver exceptional performance.',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Drive growth with data-driven marketing strategies that reach and convert your ideal customers.',
    color: 'from-red-500 to-rose-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Transform data into actionable insights that inform strategic business decisions.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Globe,
    title: 'SEO & Content',
    description: 'Boost your online visibility with optimized content and proven SEO strategies.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: Rocket,
    title: 'Growth Strategy',
    description: 'Accelerate your business growth with comprehensive strategic planning and execution.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Maximize speed and efficiency to ensure your digital products perform at their best.',
    color: 'from-yellow-500 to-orange-500'
  }
]

function ServicesShowcase() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const gridRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    const grid = gridRef.current

    if (!section || !grid) return

    const ctx = gsap.context(() => {
      // Animate title and subtitle
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { y: 60, opacity: 0 },
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

      // Animate grid items with stagger
      gsap.fromTo(
        grid.children,
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
          ease: 'power2.out',
          stagger: {
            each: 0.08,
            from: 'center',
          },
          scrollTrigger: {
            trigger: grid,
            start: 'top 75%',
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
            Our Services
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
          >
            Comprehensive digital solutions tailored to elevate your business and drive meaningful results
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className="group relative rounded-2xl p-8 transition-all duration-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Hover Effect Overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                  }}
                />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${service.color}`}>
                  <Icon size={28} className="text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Decorative Border Effect on Hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    border: '1px solid rgba(200, 255, 0, 0.2)',
                    boxShadow: '0 0 30px rgba(200, 255, 0, 0.1)',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesShowcase