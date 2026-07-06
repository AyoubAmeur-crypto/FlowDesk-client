import React, { useRef, useEffect, useState } from 'react'
import { Code2, Layout, Smartphone, Globe, Palette, Zap } from 'lucide-react'
import { useReducedMotion, useInView } from '../hooks/useReducedMotion'

const services = [
  {
    id: 1,
    icon: Layout,
    title: 'Web Design',
    description: 'Crafting stunning, responsive websites that captivate visitors and drive conversions.',
    features: ['UI/UX Design', 'Responsive Layouts', 'Accessibility']
  },
  {
    id: 2,
    icon: Code2,
    title: 'Development',
    description: 'Building robust, scalable applications using cutting-edge technologies and best practices.',
    features: ['React & Node.js', 'API Integration', 'Performance Optimization']
  },
  {
    id: 3,
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Creating seamless mobile experiences that work flawlessly across all devices.',
    features: ['iOS & Android', 'Cross-Platform', 'Native Performance']
  },
  {
    id: 4,
    icon: Globe,
    title: 'Digital Marketing',
    description: 'Data-driven strategies that increase visibility and drive qualified traffic to your business.',
    features: ['SEO', 'Content Strategy', 'Analytics']
  },
  {
    id: 5,
    icon: Palette,
    title: 'Brand Identity',
    description: 'Developing cohesive brand systems that communicate your unique value proposition.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity']
  },
  {
    id: 6,
    icon: Zap,
    title: 'Consulting',
    description: 'Strategic guidance to help you make informed decisions and achieve your business goals.',
    features: ['Tech Strategy', 'Process Optimization', 'Growth Planning']
  }
]

/**
 * Optimized ServicesSection
 * - Lazy GSAP loading
 * - Intersection Observer triggered animations
 * - Reduced motion support
 */
function ServicesSection() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const reducedMotion = useReducedMotion()
  const isInView = useInView(containerRef, { rootMargin: '100px' })

  useEffect(() => {
    if (!isInView) return

    if (reducedMotion) {
      setIsVisible(true)
      return
    }

    let ctx = null

    const runAnimation = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Title animation
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              once: true,
              onEnter: () => setIsVisible(true),
            }
          }
        )

        // Cards animation
        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.children,
            { y: 80, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 85%',
                once: true,
              }
            }
          )
        }
      }, containerRef.current)
    }

    runAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [isInView, reducedMotion])

  return (
    <div
      ref={containerRef}
      className="relative w-full py-24 md:py-32 lg:py-40 px-4 md:px-8 lg:px-16 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`text-center mb-16 md:mb-24 transition-all duration-700 ${
            isVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to elevate your business
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className={`group relative rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] ${
                  isVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transitionDelay: reducedMotion ? '0ms' : `${index * 100}ms`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(200, 255, 0, 0.05) 0%, transparent 70%)',
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-[#c8ff00]"
                    style={{ background: 'rgba(200, 255, 0, 0.1)' }}
                  >
                    <Icon size={32} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-white/50 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ServicesSection
