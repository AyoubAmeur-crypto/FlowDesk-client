import React, { useRef, useEffect, useState } from 'react'
import { useReducedMotion, useInView } from '../hooks/useReducedMotion'

/**
 * Optimized CTASection
 * - Deferred GSAP loading
 * - Optimized timeline animations
 * - Reduced motion support
 * - GPU-accelerated properties only
 */
function CTASection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const reducedMotion = useReducedMotion()
  const isInView = useInView(sectionRef, { rootMargin: '100px' })

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
        const elements = contentRef.current?.querySelectorAll('.cta-animate')
        if (!elements) return

        gsap.fromTo(
          elements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              once: true,
              onEnter: () => setIsVisible(true),
            }
          }
        )
      }, sectionRef.current)
    }

    runAnimation()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [isInView, reducedMotion])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[60vh] w-full py-20 md:py-32 overflow-hidden bg-black"
    >
      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center">
          {/* Badge */}
          <div
            className={`cta-animate inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10 ${
              isVisible || reducedMotion ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-[#c8ff00]">✨</span>
            <span className="text-white/45 text-sm font-medium">
              Ready to transform your business?
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`cta-animate text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight ${
              isVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="block">Let&apos;s Build Something</span>
            <span className="block text-[#c8ff00]">Extraordinary Together</span>
          </h2>

          {/* Paragraph */}
          <p
            className={`cta-animate text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed ${
              isVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Join hundreds of successful businesses that have elevated their digital presence
            with our premium solutions. Your success story starts here.
          </p>

          {/* Buttons */}
          <div
            className={`cta-animate flex flex-col sm:flex-row items-center justify-center gap-4 ${
              isVisible || reducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <button className="group relative px-8 py-4 text-black font-semibold bg-[#c8ff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project →
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>

            <button className="px-8 py-4 text-white/60 font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-full transition-all duration-300">
              Schedule a Call
            </button>
          </div>

          {/* Feature tags */}
          <div
            className={`cta-animate mt-12 flex flex-wrap items-center justify-center gap-8 text-white ${
              isVisible || reducedMotion ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#c8ff00]">⚡</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8ff00]">✦</span>
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c8ff00]">✓</span>
              <span>100% Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
