import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion, useIsTouchDevice } from './useReducedMotion'

/**
 * Performance-optimized GSAP hook with:
 * - Lazy loading of GSAP modules
 * - Reduced motion support
 * - Mobile optimization
 * - requestIdleCallback for non-critical animations
 * - Proper cleanup
 */
export function useOptimizedGSAP() {
  const gsapRef = useRef(null)
  const scrollTriggerRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()

  /**
   * Lazy load GSAP and ScrollTrigger
   */
  const loadGSAP = useCallback(async () => {
    if (gsapRef.current) return gsapRef.current

    const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])

    gsap.registerPlugin(ScrollTrigger)
    gsapRef.current = gsap
    scrollTriggerRef.current = ScrollTrigger

    return gsap
  }, [])

  /**
   * Run animation with requestIdleCallback fallback
   */
  const runWhenIdle = useCallback((callback, priority = 'low') => {
    if (priority === 'high') {
      callback()
      return
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => callback(), { timeout: 2000 })
    } else {
      // Fallback for Safari
      setTimeout(callback, 1)
    }
  }, [])

  /**
   * Create optimized animation context
   */
  const createAnimation = useCallback(
    async (animationFn, options = {}) => {
      const {
        priority = 'low', // 'high' | 'low'
        waitForVisible = false,
        skipOnReducedMotion = true,
        skipOnTouch = false,
      } = options

      // Skip if reduced motion is preferred
      if (skipOnReducedMotion && reducedMotion) {
        return () => {}
      }

      // Skip complex animations on touch devices if specified
      if (skipOnTouch && isTouch) {
        return () => {}
      }

      const executeAnimation = async () => {
        const gsap = await loadGSAP()
        if (!gsap) return

        return animationFn(gsap, scrollTriggerRef.current)
      }

      if (waitForVisible) {
        return executeAnimation
      }

      runWhenIdle(executeAnimation, priority)
      return () => {}
    },
    [loadGSAP, reducedMotion, isTouch, runWhenIdle]
  )

  /**
   * Cleanup all GSAP animations
   */
  const cleanup = useCallback(() => {
    if (gsapRef.current) {
      gsapRef.current.globalTimeline.clear()
    }
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.getAll().forEach((st) => st.kill())
    }
  }, [])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  return {
    loadGSAP,
    createAnimation,
    runWhenIdle,
    cleanup,
    reducedMotion,
    isTouch,
  }
}

/**
 * Hook for scroll-triggered animations with lazy loading
 */
export function useScrollAnimation(ref, animationConfig, options = {}) {
  const { loadGSAP, reducedMotion, isTouch } = useOptimizedGSAP()
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    if (reducedMotion && options.skipOnReducedMotion !== false) return

    let ctx = null
    let scrollTriggerInstance = null

    const setupAnimation = async () => {
      const gsap = await loadGSAP()
      if (!gsap) return

      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      ctx = gsap.context(() => {
        const config = typeof animationConfig === 'function'
          ? animationConfig(gsap)
          : animationConfig

        if (config.scrollTrigger) {
          scrollTriggerInstance = ScrollTrigger.create({
            trigger: ref.current,
            ...config.scrollTrigger,
            onEnter: (self) => {
              if (config.onEnter) config.onEnter(self, gsap)
            },
          })
        }
      }, ref.current)
    }

    // Use IntersectionObserver to trigger animation setup
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setupAnimation()
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
      if (scrollTriggerInstance) scrollTriggerInstance.kill()
      if (ctx) ctx.revert()
    }
  }, [ref, animationConfig, loadGSAP, reducedMotion, isTouch, options.skipOnReducedMotion])

  return triggerRef
}
