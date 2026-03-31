import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import bg1 from '../../assets/newBg.png'

gsap.registerPlugin(ScrollTrigger)

const LINE1_WORDS = ["Let's", 'Build', 'Something']
const LINE2_WORDS = ['Extraordinary', 'Together']

function CTASection() {
  const sectionRef  = useRef(null)
  const bgLayerRef  = useRef(null)
  const glowRef     = useRef(null)
  const badgeRef    = useRef(null)
  const headingRef  = useRef(null)
  const paraRef     = useRef(null)
  const buttonsRef  = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => { ScrollTrigger.refresh() }, 100)
    return () => clearTimeout(timer)
  }, [])

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const bg       = bgLayerRef.current
      const glow     = glowRef.current
      const words    = section.querySelectorAll('.cta-word')
      const badge    = badgeRef.current
      const para     = paraRef.current
      const buttons  = Array.from(buttonsRef.current?.children  || [])
      const features = Array.from(featuresRef.current?.children || [])

      // ── Initial states ──────────────────────────────────────
      gsap.set(bg,       { clipPath: 'circle(0% at 50% 50%)', opacity: 0 })
      gsap.set(glow,     { scale: 0.2, opacity: 0 })
      gsap.set(badge,    { y: 30,  opacity: 0, scale: 0.9 })
      gsap.set(words,    { y: 80,  opacity: 0, rotationX: -40, transformOrigin: 'center bottom' })
      gsap.set(para,     { y: 25,  opacity: 0, filter: 'blur(10px)' })
      gsap.set(buttons,  { y: 40,  opacity: 0, scale: 0.9 })
      gsap.set(features, { y: 20,  opacity: 0, scale: 0.8 })

      // ── Single scroll-scrubbed timeline ────────────────────
      // Phase 1 (0 → 0.6):  text arrives
      // Phase 2 (0.6 → 1.0): bg explodes in behind it
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top center',
          end:     'center center',
          scrub:   2,
        },
      })

      // ── PHASE 1 — TEXT FIRST ────────────────────────────────

      // Badge
      tl.to(badge, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.4, ease: 'back.out(1.4)',
      }, 0)

      // Words cascade in — 3D flip
      tl.to(words, {
        y: 0, opacity: 1, rotationX: 0,
        duration: 0.45, ease: 'power3.out',
        stagger: { amount: 0.3, from: 'start' },
      }, 0.1)

      // Paragraph dissolve
      tl.to(para, {
        y: 0, opacity: 0.55, filter: 'blur(0px)',
        duration: 0.4, ease: 'power2.out',
      }, 0.38)

      // Buttons
      tl.to(buttons, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.35, ease: 'back.out(1.3)',
        stagger: 0.08,
      }, 0.5)

      // Feature tags
      tl.to(features, {
        y: 0, opacity: 0.45, scale: 1,
        duration: 0.3, ease: 'back.out(1.6)',
        stagger: 0.06,
      }, 0.62)

      // ── PHASE 2 — BG EXPLOSION AFTER TEXT ──────────────────

      // BG circle blasts open
      tl.to(bg, {
        clipPath: 'circle(150% at 50% 50%)',
        opacity:  0.45,
        duration: 0.6,
        ease:     'power4.out',
      }, 0.68)   // ← starts after text is settled

      // Glow blooms with the explosion
      tl.to(glow, {
        scale:   1.2,
        opacity: 0.5,
        duration: 0.6,
        ease:    'power3.out',
      }, 0.68)

      // ── AMBIENT — runs after scroll animation completes ─────

      // Glow float
      gsap.to(glow, {
        y:        -28,
        scale:    1.1,
        duration: 4.5,
        ease:     'sine.inOut',
        repeat:   -1,
        yoyo:     true,
        delay:    2.5,
      })

      // Glow pulse
      gsap.to(glow, {
        opacity:  0.28,
        duration: 3,
        ease:     'sine.inOut',
        repeat:   -1,
        yoyo:     true,
        delay:    3,
      })

      // ── PARALLAX — glow drifts on scroll ───────────────────
      gsap.to(glow, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start:   'top bottom',
          end:     'bottom top',
          scrub:   2.5,
        }
      })

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-cta-section
      className="relative min-h-screen w-full py-20 md:py-32 pb-32 md:pb-48 overflow-hidden bg-black"
      style={{ perspective: '1200px' }}
    >
      {/* BG image — explosion layer, starts invisible */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:    `url(${bg1})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundRepeat:   'no-repeat',
          willChange:         'clip-path, opacity',
        }}
      />

      {/* Bottom fade & blur mask to smooth transition into Testimonials */}
      <div 
        className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, #000)',
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-10"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
        }}
      />

      {/* Ambient glow blob */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,255,0,0.2) 0%, rgba(200,255,0,0.05) 55%, transparent 75%)',
          filter:     'blur(72px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center">


          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10"
          >
            <Sparkles size={16} className="text-[#c8ff00]" />
            <span className="text-white/45 text-sm font-medium">
              Ready to transform your business?
            </span>
          </div>

          {/* Heading */}
          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="block">
              {LINE1_WORDS.map((w, i) => (
                <span key={i} className="cta-word inline-block mr-[0.22em]">{w}</span>
              ))}
            </span>
            <span className="block">
              {LINE2_WORDS.map((w, i) => (
                <span key={i} className="cta-word inline-block mr-[0.22em] text-[#c8ff00]">{w}</span>
              ))}
            </span>
          </h2>

          {/* Paragraph */}
          <p
            ref={paraRef}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join hundreds of successful businesses that have elevated their digital presence
            with our premium solutions. Your success story starts here.
          </p>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative px-8 py-4 text-black font-semibold bg-[#c8ff00] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(200,255,0,0.45)]">
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project
                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>

            <button className="px-8 py-4 text-white/60 font-semibold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-full transition-all duration-300">
              Schedule a Call
            </button>
          </div>

          {/* Feature tags */}
          <div
            ref={featuresRef}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white pb-8"
          >
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#c8ff00]" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#c8ff00]" />
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