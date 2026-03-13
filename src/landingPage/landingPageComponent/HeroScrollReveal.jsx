import React, { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logob from '../../assets/logob.svg'

gsap.registerPlugin(ScrollTrigger)

function HeroScrollReveal() {
  const overlayRef = useRef(null)
  const logoRef = useRef(null)
  const contentRef = useRef(null)
  const containerRef = useRef(null)

  useGSAP(() => {
    const overlay = overlayRef.current
    const logo = logoRef.current
    const content = contentRef.current

    if (!overlay || !logo || !content) return

    const ctx = gsap.context(() => {
      // Timeline for the scroll reveal sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      })

      // Phase 1: Overlay zooms and fades out
      tl.fromTo(overlay,
        {
          scale: 1,
          opacity: 1,
        },
        {
          scale: 1.5,
          opacity: 0,
          ease: 'none',
          duration: 1,
        }
      )

      // Phase 2: Logo fades in at start of scroll
      tl.fromTo(logo,
        {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(10px)',
        },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 0.4,
        },
        0
      )

      // Phase 3: Logo fades out as content appears
      tl.to(logo,
        {
          opacity: 0,
          scale: 1.2,
          ease: 'none',
          duration: 0.4,
        },
        0.6
      )

      // Phase 4: Content fades in after overlay and logo transition
      tl.fromTo(content.children,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          stagger: 0.15,
          duration: 0.5,
        },
        0.5
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Overlay - covers and reveals */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
        }}
      />

      {/* Project Logo - appears first */}
      <div
        ref={logoRef}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none opacity-0"
      >
        <img src={logob} alt="FlowDesk Logo" className="w-32 h-32 md:w-48 md:h-48" />
      </div>

      {/* Main Hero Content - fades in after overlay */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4"
      >
        <div className="text-center max-w-4xl">
          <h2 className="text-xl md:text-2xl text-white/60 mb-4 tracking-wide">
            Discover
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Premium Digital
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#c8ff00] mb-8 leading-tight">
            Solutions
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Transform your business with cutting-edge design and technology. We craft experiences that captivate and convert.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeroScrollReveal