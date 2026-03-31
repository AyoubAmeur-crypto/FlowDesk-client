/**
 * Optimized GSAP Scroll Animation Utilities
 *
 * Improvements:
 * - Lazy GSAP loading
 * - Reduced motion support
 * - Cleanup utilities
 * - Mobile optimization
 */

let gsapInstance = null
let scrollTriggerInstance = null

/**
 * Lazy load GSAP and ScrollTrigger
 */
async function ensureGSAP() {
  if (gsapInstance) return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance }

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])

  gsap.registerPlugin(ScrollTrigger)
  gsapInstance = gsap
  scrollTriggerInstance = ScrollTrigger

  return { gsap, ScrollTrigger }
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if device is touch/mobile
 */
function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

/**
 * Smooth reveal animation with lazy loading
 * @param {Object} options - Animation options
 */
export async function smoothReveal({
  elements,
  trigger = elements,
  start = 'top 85%',
  once = true,
  stagger = 0.1,
  duration = 1,
  ease = 'power3.out',
  onEnter,
}) {
  if (prefersReducedMotion()) {
    // Instant reveal
    const targets = elements instanceof NodeList ? Array.from(elements) : [elements]
    targets.forEach((el) => {
      if (el) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }
    })
    return () => {}
  }

  const { gsap, ScrollTrigger } = await ensureGSAP()
  const targets = elements instanceof NodeList ? Array.from(elements) : [elements]

  const animations = targets.map((el) => {
    if (!el) return null

    return gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        ease,
        scrollTrigger: {
          trigger: typeof trigger === 'string' ? trigger : el,
          start,
          once,
          onEnter: onEnter ? () => onEnter(el) : undefined,
        },
      }
    )
  })

  // Return cleanup function
  return () => {
    animations.forEach((anim) => {
      if (anim?.scrollTrigger) anim.scrollTrigger.kill()
      anim?.kill()
    })
  }
}

/**
 * Staggered text reveal
 */
export async function staggeredText({
  container,
  trigger = container,
  start = 'top 80%',
  stagger = 0.05,
  duration = 0.8,
  ease = 'power2.out',
}) {
  if (prefersReducedMotion() || !container) {
    return () => {}
  }

  const { gsap, ScrollTrigger } = await ensureGSAP()

  const anim = gsap.fromTo(
    container.children,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
      scrollTrigger: {
        trigger: typeof trigger === 'string' ? trigger : container,
        start,
      },
    }
  )

  return () => {
    if (anim?.scrollTrigger) anim.scrollTrigger.kill()
    anim?.kill()
  }
}

/**
 * Parallax effect - simplified for performance
 */
export async function parallax({
  element,
  trigger = element,
  speed = 0.5,
  scrub = true,
}) {
  if (prefersReducedMotion() || isTouchDevice() || !element) {
    return () => {}
  }

  const { gsap, ScrollTrigger } = await ensureGSAP()

  const anim = gsap.fromTo(
    element,
    { y: -50 * speed },
    {
      y: 50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: typeof trigger === 'string' ? trigger : element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: scrub ? 1.5 : false,
      },
    }
  )

  return () => {
    if (anim?.scrollTrigger) anim.scrollTrigger.kill()
    anim?.kill()
  }
}

/**
 * Scale animation on scroll
 */
export async function subtleScale({
  elements,
  trigger = elements,
  start = 'top 85%',
  once = true,
  fromScale = 0.95,
  toScale = 1,
  duration = 0.8,
  ease = 'power2.out',
}) {
  if (prefersReducedMotion()) {
    const targets = elements instanceof NodeList ? Array.from(elements) : [elements]
    targets.forEach((el) => {
      if (el) {
        el.style.opacity = '1'
        el.style.transform = 'scale(1)'
      }
    })
    return () => {}
  }

  const { gsap, ScrollTrigger } = await ensureGSAP()
  const targets = elements instanceof NodeList ? Array.from(elements) : [elements]

  const animations = targets.map((el) => {
    if (!el) return null

    return gsap.fromTo(
      el,
      { scale: fromScale, opacity: 0 },
      {
        scale: toScale,
        opacity: 1,
        duration,
        ease,
        scrollTrigger: {
          trigger: typeof trigger === 'string' ? trigger : el,
          start,
          once,
        },
      }
    )
  })

  return () => {
    animations.forEach((anim) => {
      if (anim?.scrollTrigger) anim.scrollTrigger.kill()
      anim?.kill()
    })
  }
}

/**
 * Horizontal scroll effect
 */
export async function horizontalScroll({
  container,
  content,
  width,
  start = 'top top',
  end = '+=300%',
  scrub = 1.5,
}) {
  if (prefersReducedMotion() || isTouchDevice() || !container || !content) {
    return () => {}
  }

  const { gsap, ScrollTrigger } = await ensureGSAP()

  const st = ScrollTrigger.create({
    trigger: container,
    pin: true,
    start,
    end,
    scrub,
  })

  const anim = gsap.fromTo(
    content,
    { x: 0 },
    {
      x: -width,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub,
      },
    }
  )

  return () => {
    st.kill()
    if (anim?.scrollTrigger) anim.scrollTrigger.kill()
    anim?.kill()
  }
}

/**
 * Pin and reveal effect
 */
export async function pinAndReveal({
  container,
  elements = [],
  duration = 1,
  start = 'top top',
  end = '+=100%',
  scrub = 1,
}) {
  if (prefersReducedMotion() || !container) {
    return () => {}
  }

  const { gsap, ScrollTrigger } = await ensureGSAP()

  const st = ScrollTrigger.create({
    trigger: container,
    pin: true,
    start,
    end,
    scrub,
  })

  const animations = elements.map((el) => {
    if (!el) return null
    return gsap.fromTo(
      el,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
        },
      }
    )
  })

  return () => {
    st.kill()
    animations.forEach((anim) => {
      if (anim?.scrollTrigger) anim.scrollTrigger.kill()
      anim?.kill()
    })
  }
}

/**
 * Global cleanup utility
 */
export function cleanup() {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.getAll().forEach((st) => st.kill())
  }
  if (gsapInstance) {
    gsapInstance.globalTimeline.clear()
  }
}

/**
 * Refresh ScrollTrigger positions
 */
export function refreshScrollTrigger() {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.refresh()
  }
}
