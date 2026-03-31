import React, { useRef, useEffect, useState } from 'react'
import { useReducedMotion, useInView } from '../hooks/useReducedMotion'

/**
 * Optimized Banner2 - Text Reveal Animation
 * - GSAP ScrollTrigger only loaded when in viewport
 * - Character split deferred until needed
 * - Reduced motion: instant reveal
 * - Cleanup on unmount
 */
function Banner2() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const containerRef = useRef(null)
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)

  const reducedMotion = useReducedMotion()
  const isInView = useInView(containerRef, { rootMargin: '50px' })

  // Split text into spans for animation
  useEffect(() => {
    if (!isInView || !subtitleRef.current || reducedMotion) return

    const subtitle = subtitleRef.current
    const text = subtitle.textContent
    subtitle.innerHTML = text
      .split('')
      .map((char) => `<span class="inline-block ${char === ' ' ? 'w-[0.3em]' : ''}">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')
  }, [isInView, reducedMotion])

  // Animate when in view
  useEffect(() => {
    if (!isInView) return

    if (reducedMotion) {
      // Instant reveal for reduced motion
      setTitleVisible(true)
      setSubtitleVisible(true)
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
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
              onEnter: () => setTitleVisible(true),
            },
          }
        )

        // Subtitle character animation
        if (subtitleRef.current?.children) {
          gsap.fromTo(
            subtitleRef.current.children,
            { opacity: 0, y: 50, rotateX: -45 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.02,
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
                end: 'top 40%',
                toggleActions: 'play none none reverse',
                onEnter: () => setSubtitleVisible(true),
              },
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
    <div className="px-4 md:px-12 lg:px-[90px] pt-[80px] md:pt-[120px] pb-[80px] md:pb-[120px]">
      <div ref={containerRef} className="text-black overflow-hidden">
        <h1
          ref={titleRef}
          className={`text-2xl sm:text-3xl md:text-5xl lg:text-[64px] m-0 font-light transition-opacity duration-500 ${
            titleVisible || reducedMotion ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: titleVisible || reducedMotion ? 'translateY(0)' : 'translateY(50px)' }}
        >
          An unmatched attendee
        </h1>
        <h2
          ref={subtitleRef}
          className={`text-[clamp(3rem,15vw,15rem)] sm:text-6xl md:text-8xl lg:text-[240px] p-0 leading-none font-bold break-words transition-opacity duration-500 ${
            subtitleVisible || reducedMotion ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ perspective: '1000px' }}
        >
          Experience
        </h2>
      </div>
    </div>
  )
}

export default Banner2
