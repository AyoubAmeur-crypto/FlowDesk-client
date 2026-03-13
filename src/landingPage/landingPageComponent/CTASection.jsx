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
  const sectionRef   = useRef(null)
  const bgLayerRef   = useRef(null)
  const glowRef      = useRef(null)
  const badgeRef     = useRef(null)
  const headingRef   = useRef(null)
  const paraRef      = useRef(null)
  const buttonsRef   = useRef(null)
  const featuresRef  = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => { ScrollTrigger.refresh() }, 100)
    return () => clearTimeout(timer)
  }, [])

  useGSAP(() => {
    const section = sectionRef.current
    const glow    = glowRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const bg       = bgLayerRef.current
      const words    = section.querySelectorAll('.cta-word')
      const badge    = badgeRef.current
      const para     = paraRef.current
      const buttons  = Array.from(buttonsRef.current?.children  || [])
      const features = Array.from(featuresRef.current?.children || [])

      // ── Initial states ───────────────────────────────────────
      // BG: clipped to a point + invisible — GSAP owns both
      gsap.set(bg,       { clipPath: 'circle(0% at 50% 50%)', opacity: 0 })
      gsap.set(glow,     { scale: 0.3,  opacity: 0 })
      gsap.set(badge,    { y: 40,  opacity: 0, scale: 0.85 })
      gsap.set(words,    { y: 90,  opacity: 0, rotationX: -45, transformOrigin: 'center bottom' })
      gsap.set(para,     { y: 30,  opacity: 0, filter: 'blur(12px)' })
      gsap.set(buttons,  { y: 50,  opacity: 0, scale: 0.88 })
      gsap.set(features, { y: 25,  opacity: 0, scale: 0.75 })

      // ── Main reveal timeline — scrubbed to scroll ────────────
      // FIX: start earlier ('top center') and end at 'center center'
      // so the full animation completes while the section is still
      // visible — nothing gets cut off mid-expand.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top center',    // animation begins when section top hits viewport center
          end:     'center center', // animation finishes when section center hits viewport center
          scrub:   1,
        },
      })

      // BG circle expands AND fades in together
      tl.to(bg, {
        clipPath: 'circle(150% at 50% 50%)',
        opacity:  0.4,
        duration: 1,
        ease:     'power2.out',
      }, 0)

      // Glow blooms with the BG
      tl.to(glow, {
        scale:    1.15,
        opacity:  0.4,
        duration: 1,
        ease:     'power2.out',
      }, 0)

      // Badge bounces in
      tl.to(badge, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.5, ease: 'back.out(1.5)',
      }, 0.4)

      // Words cascade with 3-D perspective
      tl.to(words, {
        y: 0, opacity: 1, rotationX: 0,
        duration: 0.5, ease: 'power3.out',
        stagger: { amount: 0.35, from: 'start' },
      }, 0.55)

      // Paragraph blur-dissolve
      tl.to(para, {
        y: 0, opacity: 0.5, filter: 'blur(0px)',
        duration: 0.45, ease: 'power2.out',
      }, 0.8)

      // Buttons bounce in
      tl.to(buttons, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.4, ease: 'back.out(1.3)',
        stagger: 0.1,
      }, 0.95)

      // Feature tags pop in
      tl.to(features, {
        y: 0, opacity: 0.4, scale: 1,
        duration: 0.35, ease: 'back.out(1.8)',
        stagger: 0.07,
      }, 1.15)

      // ── Ambient animations (independent of scroll) ───────────
      // Continuous glow float
      gsap.to(glow, {
        y:        -30,
        scale:    1.12,
        duration: 4.5,
        ease:     'sine.inOut',
        repeat:   -1,
        yoyo:     true,
        delay:    3,
      })

      // Subtle glow pulse
      gsap.to(glow, {
        opacity:  0.35,
        duration: 2.8,
        ease:     'sine.inOut',
        repeat:   -1,
        yoyo:     true,
        delay:    3.5,
      })

      // ── Parallax drift on scroll ─────────────────────────────
      // FIX: removed bg parallax — it was calling gsap.to(bg, …)
      // with overwrite:'auto' which stomped on the clipPath expansion
      // and froze the circle at whatever size it had reached.
      // Only glow gets the parallax drift now.
      ScrollTrigger.create({
        trigger: section,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   2.5,
        onUpdate: (self) => {
          gsap.to(glow, {
            y:         self.progress * 50,
            ease:      'none',
            overwrite: 'auto',
          })
        },
      })

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-20 md:py-32 overflow-hidden bg-black"
      style={{ perspective: '1200px' }}
    >
      {/* BG image layer — opacity and clipPath fully owned by GSAP */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          backgroundImage:    `url(${bg1})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundRepeat:   'no-repeat',
          transformOrigin:    'center center',
          // ✅ No inline opacity — GSAP controls it
        }}
      />

      {/* Ambient glow blob */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,255,0,0.18) 0%, rgba(200,255,0,0.04) 55%, transparent 75%)',
          filter:     'blur(72px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center">

          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-white/10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Sparkles size={16} className="text-[#c8ff00]" />
            <span className="text-white/45 text-sm font-medium">
              Ready to transform your business?
            </span>
          </div>

          {/* Heading — word-by-word reveal */}
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
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white"
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