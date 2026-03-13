import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP Scroll Animation System
 * Reusable animation functions for consistent scroll effects across sections
 */

/**
 * Smooth reveal animation - elements fade and slide up into view
 * @param {Object} options - Animation options
 * @param {Element|NodeList} options.elements - Target element(s)
 * @param {string} options.trigger - Trigger element selector
 * @param {number} options.start - Start position (default: 'top 85%')
 * @param {boolean} options.once - Play only once (default: true)
 * @param {number} options.stagger - Stagger delay for multiple elements
 */
export function smoothReveal({
  elements,
  trigger = elements,
  start = 'top 85%',
  once = true,
  stagger = 0.1,
  duration = 1,
  ease = 'power3.out'
}) {
  const targets = elements instanceof NodeList ? Array.from(elements) : [elements]

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
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
}

/**
 * Staggered text reveal - animates children of a container with staggered delay
 * @param {Object} options - Animation options
 * @param {Element} options.container - Container element
 * @param {string} options.trigger - Trigger element selector
 * @param {number} options.start - Start position
 * @param {number} options.stagger - Stagger delay
 */
export function staggeredText({
  container,
  trigger = container,
  start = 'top 80%',
  stagger = 0.05,
  duration = 0.8,
  ease = 'power2.out'
}) {
  gsap.fromTo(
    container.children,
    {
      y: 30,
      opacity: 0,
    },
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
}

/**
 * Parallax effect - creates depth by moving elements at different speeds
 * @param {Object} options - Parallax options
 * @param {Element} options.element - Target element
 * @param {string} options.trigger - Trigger element selector
 * @param {number} options.speed - Parallax speed multiplier
 * @param {number} options.scrub - Scrub smoothness
 */
export function parallax({
  element,
  trigger = element,
  speed = 0.5,
  scrub = 1.5
}) {
  ScrollTrigger.create({
    trigger: typeof trigger === 'string' ? trigger : element,
    start: 'top bottom',
    end: 'bottom top',
    scrub,
    onUpdate: (self) => {
      gsap.to(element, {
        y: self.progress * speed * 100,
        ease: 'none',
      })
    },
  })
}

/**
 * Subtle scale animation - elements scale up slightly as they come into view
 * @param {Object} options - Animation options
 * @param {Element|NodeList} options.elements - Target element(s)
 * @param {string} options.trigger - Trigger element selector
 * @param {number} options.fromScale - Starting scale (default: 0.95)
 * @param {number} options.toScale - Ending scale (default: 1)
 */
export function subtleScale({
  elements,
  trigger = elements,
  start = 'top 85%',
  once = true,
  fromScale = 0.95,
  toScale = 1,
  duration = 0.8,
  ease = 'power2.out'
}) {
  const targets = elements instanceof NodeList ? Array.from(elements) : [elements]

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      {
        scale: fromScale,
        opacity: 0,
      },
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
}

/**
 * Opacity transition - smooth fade in/out
 * @param {Object} options - Animation options
 * @param {Element} options.element - Target element
 * @param {string} options.trigger - Trigger element selector
 * @param {number} options.fromOpacity - Starting opacity
 * @param {number} options.toOpacity - Ending opacity
 */
export function opacityTransition({
  element,
  trigger = element,
  start = 'top 80%',
  end = 'bottom 20%',
  fromOpacity = 0,
  toOpacity = 1,
  scrub = true
}) {
  gsap.fromTo(
    element,
    { opacity: fromOpacity },
    {
      opacity: toOpacity,
      scrollTrigger: {
        trigger: typeof trigger === 'string' ? trigger : element,
        start,
        end,
        scrub: scrub ? 1 : false,
      },
    }
  )
}

/**
 * Pin and reveal - pins section and reveals content progressively
 * @param {Object} options - Animation options
 * @param {Element} options.container - Container to pin
 * @param {Element[]} options.elements - Elements to animate
 * @param {number} options.duration - Scroll duration
 */
export function pinAndReveal({
  container,
  elements = [],
  duration = 1,
  start = 'top top',
  end = '+=100%',
  scrub = 1
}) {
  ScrollTrigger.create({
    trigger: container,
    pin: true,
    start,
    end,
    scrub,
  })

  elements.forEach((el, index) => {
    const progress = index / elements.length
    gsap.fromTo(
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
}

/**
 * Horizontal scroll - transforms vertical scroll into horizontal movement
 * @param {Object} options - Animation options
 * @param {Element} options.container - Container to pin
 * @param {Element} options.content - Moving content element
 * @param {number} options.width - Width to scroll
 */
export function horizontalScroll({
  container,
  content,
  width,
  start = 'top top',
  end = '+=300%',
  scrub = 1.5
}) {
  ScrollTrigger.create({
    trigger: container,
    pin: true,
    start,
    end,
    scrub,
  })

  gsap.fromTo(
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
}

/**
 * Cleanup - remove all ScrollTriggers in a scope
 * @param {Element} scope - Scope element
 */
export function cleanup(scope) {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (scope.contains(trigger.trigger)) {
      trigger.kill()
    }
  })
}