import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { CircleCheck } from 'lucide-react'
import { useReducedMotion, useIsTouchDevice } from '../hooks/useReducedMotion'

// Lazy load heavy assets
const avatars = lazy(() => import('../../assets/avatars.png'))
const star = lazy(() => import('../../assets/review.png'))

const WORDS = ['grow', 'scale', 'thrive', 'expand', 'evolve']

/**
 * Optimized Hero Component
 * - GSAP loaded lazily only after LCP
 * - Minimal initial bundle size
 * - Respects prefers-reduced-motion
 * - Touch-optimized for mobile
 */
function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [maxWidth, setMaxWidth] = useState(0)
  const [gsapLoaded, setGsapLoaded] = useState(false)

  const wordIndexRef = useRef(0)
  const intervalRef = useRef(null)
  const measureRef = useRef(null)
  const logoRef = useRef(null)
  const simplestTextRef = useRef(null)
  const currentWordRef = useRef(null)
  const nextWordRef = useRef(null)

  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()

  // Calculate max width for word slot machine
  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    let max = 0
    WORDS.forEach((w) => {
      el.textContent = w
      if (el.scrollWidth > max) max = el.scrollWidth
    })
    setMaxWidth(max)
  }, [])

  // Lazy load GSAP after initial render (post-LCP)
  useEffect(() => {
    // Delay GSAP loading to not block LCP
    const timer = setTimeout(() => {
      if (reducedMotion) return // Skip GSAP if reduced motion preferred

      import('gsap').then(({ default: gsap }) => {
        setGsapLoaded(true)

        // Run non-critical animations
        requestAnimationFrame(() => {
          // Logo blur-to-clear animation (subtle, non-blocking)
          if (logoRef.current) {
            gsap.fromTo(
              logoRef.current,
              { opacity: 0, filter: 'blur(10px)' },
              { opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
            )
          }

          // Simplest text rotation
          if (simplestTextRef.current) {
            gsap.to(simplestTextRef.current, {
              rotation: -4,
              duration: 0.8,
              ease: 'power1.inOut',
              delay: 0.3,
            })
          }
        })
      })
    }, 100) // Small delay to prioritize LCP

    return () => clearTimeout(timer)
  }, [reducedMotion])

  // Word slot machine effect
  useEffect(() => {
    if (reducedMotion) return // Skip animation if reduced motion

    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(rollNext, 2000)
    }, 500)

    return () => {
      clearTimeout(startDelay)
      clearInterval(intervalRef.current)
    }
  }, [reducedMotion])

  const rollNext = async () => {
    if (isAnimating || !gsapLoaded || reducedMotion) {
      // Simple state-based fallback
      wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length
      setWordIndex(wordIndexRef.current)
      return
    }

    setIsAnimating(true)

    const { default: gsap } = await import('gsap')
    const current = currentWordRef.current
    const next = nextWordRef.current

    if (!current || !next) {
      setIsAnimating(false)
      return
    }

    wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length
    const nextIndex = (wordIndexRef.current + 1) % WORDS.length
    next.textContent = WORDS[nextIndex]

    const tl = gsap.timeline({
      onComplete: () => {
        current.textContent = WORDS[wordIndexRef.current]
        gsap.set(current, { y: 0 })
        gsap.set(next, { y: '-100%' })
        setIsAnimating(false)
      },
    })

    tl.to(current, {
      y: '100%',
      duration: 0.55,
      ease: 'power2.in',
    }, 0)

    tl.fromTo(
      next,
      { y: '-100%' },
      { y: '0%', duration: 0.55, ease: 'power2.out' },
      0
    )
  }

  return (
    <section className="relative w-full">
      <div
        ref={logoRef}
        className="col-center gap-4 lg:gap-8 mt-35 px-4 sm:px-6"
        style={{ opacity: reducedMotion ? 1 : 0 }} // Start visible if reduced motion
      >
        {/* Pills */}
        <div className="md:flex md:flex-row hidden md:gap-2 md:text-white md:text-sm md:text-center">
          <div className="flex flex-row items-center justify-center gap-[8px]">
            <CircleCheck size={16} />
            <p>12,625 Satisfied Client</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-[8px]">
            <CircleCheck size={16} />
            <p>More than 20+ Service</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-[8px]">
            <CircleCheck size={16} />
            <p>Work With Experts</p>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold w-full max-w-[760px] text-center text-white leading-tight">
          The{' '}
          <span
            ref={simplestTextRef}
            className="simplest-text text-black bg-white rounded-md px-2 py-1 inline-block"
          >
            simplest
          </span>{' '}
          way to{' '}

          {/* Hidden measure element */}
          <span
            ref={measureRef}
            className="text-[#c8ff00] font-extrabold absolute opacity-0 pointer-events-none whitespace-nowrap"
            style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
            aria-hidden="true"
          />

          {/* Word slot machine */}
          <span
            className="slot-container relative inline-flex justify-center overflow-hidden"
            style={{ width: maxWidth || 'auto', verticalAlign: 'bottom' }}
          >
            <span
              ref={currentWordRef}
              className="slot-current text-center text-[#c8ff00]"
              style={{ display: 'inline-block', width: '100%' }}
            >
              {WORDS[wordIndex]}
            </span>
            {!reducedMotion && (
              <span
                ref={nextWordRef}
                className="slot-next text-center text-[#c8ff00]"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: 'translateY(-100%)',
                }}
              >
                {WORDS[(wordIndex + 1) % WORDS.length]}
              </span>
            )}
          </span>{' '}

          your business across all services.
        </h1>

        <p className="w-full max-w-[640px] text-center text-lg sm:text-xl lg:text-2xl text-gray-300">
          The best B2B network for brands, startups, founders, and growing businesses. Just for you
        </p>

        <div className="flex-col items-start gap-[15px] w-full max-w-[440px]">
          <div className="flex flex-col sm:flex-row items-center gap-[10px]">
            <input
              type="email"
              placeholder="sam@gmail.com"
              className="w-full bg-black text-gray-400 rounded-md ring-1 ring-gray-600 px-[15px] py-[8px] text-sm outline-none focus:ring-gray-400 transition-colors"
            />
            <button className="w-full sm:w-auto bg-white rounded-md text-black font-semibold cursor-pointer px-4 py-[8px] text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
              Get Sample
            </button>
          </div>
          <p className="text-xs pt-2">Get sample right in your inbox, No need to Login</p>
        </div>

        {/* Review section - lazy loaded images */}
        <div className="flex flex-row items-center gap-[12px]">
          <Suspense fallback={<div className="w-[140px] sm:w-[210px] h-8 bg-gray-800/50 rounded animate-pulse" />}>
            <img
              src={avatars}
              className="w-[140px] sm:w-[210px]"
              alt="Satisfied customers"
              loading="lazy"
            />
          </Suspense>
          <div className="flex-col">
            <div className="flex flex-row gap-2">
              {[...Array(5)].map((_, i) => (
                <Suspense key={i} fallback={<div className="w-5 h-5 bg-gray-800/50 rounded" />}>
                  <img src={star} className="w-[20px]" alt="" loading="lazy" />
                </Suspense>
              ))}
            </div>
            <p>Loved By 100+ users</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
