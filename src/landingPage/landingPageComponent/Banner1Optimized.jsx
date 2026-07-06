import React, { useRef, useEffect, useState } from 'react'
import { MoveUpRight } from 'lucide-react'
import { useReducedMotion, useIsTouchDevice, useInView } from '../hooks/useReducedMotion'

// Lazy load brand images
const brandImages = import.meta.glob('../../assets/brand*.png', { eager: false })

/**
 * Optimized Banner1 - Infinite Marquee
 * - GSAP only loaded when component is in view
 * - Animation paused when out of viewport
 * - Reduced motion support
 * - Mobile: Reduced animation complexity
 */
function Banner1() {
  const column1Ref = useRef(null)
  const column2Ref = useRef(null)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [gsapInstance, setGsapInstance] = useState(null)

  const reducedMotion = useReducedMotion()
  const isTouch = useIsTouchDevice()
  const isInView = useInView(sectionRef, { rootMargin: '100px' })

  const brands = Object.keys(brandImages).map((_, i) => i + 1)
  const column1Brands = [...brands, ...brands]
  const column2Brands = [...brands, ...brands]

  // Load GSAP only when visible
  useEffect(() => {
    if (!isInView || reducedMotion || isTouch) return

    let gsap = null
    let animations = []

    const loadAndAnimate = async () => {
      const { default: gsapModule } = await import('gsap')
      gsap = gsapModule
      setGsapInstance(gsap)

      if (!column1Ref.current || !column2Ref.current) return

      // Column 1 - scrolling down
      const anim1 = gsap.fromTo(
        column1Ref.current,
        { y: '0%' },
        {
          y: '-50%',
          duration: 20,
          ease: 'none',
          repeat: -1,
        }
      )

      // Column 2 - scrolling up
      const anim2 = gsap.fromTo(
        column2Ref.current,
        { y: '-50%' },
        {
          y: '0%',
          duration: 20,
          ease: 'none',
          repeat: -1,
        }
      )

      animations = [anim1, anim2]
      setIsVisible(true)
    }

    loadAndAnimate()

    return () => {
      animations.forEach(anim => anim?.kill())
    }
  }, [isInView, reducedMotion, isTouch])

  // Pause/resume animation based on visibility
  useEffect(() => {
    if (!gsapInstance || !column1Ref.current) return

    const animations = gsapInstance.globalTimeline.getChildren()
    if (isInView) {
      gsapInstance.globalTimeline.resume()
    } else {
      gsapInstance.globalTimeline.pause()
    }
  }, [isInView, gsapInstance])

  // CSS animation fallback for mobile/reduced motion
  const shouldUseCSS = reducedMotion || isTouch

  return (
    <div ref={sectionRef} className="w-full px-4 md:px-12 lg:px-[80px] pt-[110px] md:pt-[130px] text-white bg-black">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
        {/* Left Content */}
        <div className="flex flex-col items-start text-start max-w-full lg:max-w-[416px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light">
            World-class teams are upgrading to Welcome
          </h1>
          <p className="text-xs md:text-sm pt-3 text-white/70">
            Companies are ditching legacy platforms for the ability to deliver an engaging experience at every level.
          </p>
          <div className="pt-8 md:pt-12">
            <p className="flex flex-row gap-2 text-lg md:text-xl text-white/60">
              <span className="flex flex-row items-center text-white">
                <MoveUpRight className="w-[30px] md:w-[40px] text-green-400" />
                90%
              </span>
              positive rate
            </p>
            <p className="text-[11px] md:text-[12px] mt-1.5 text-white/60">
              avg rate for Welcome customers
            </p>
          </div>
        </div>

        {/* Right Scrolling Logos */}
        <div className="flex gap-4 md:gap-6 h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          {/* Column 1 */}
          <div
            ref={column1Ref}
            className={`flex flex-col gap-4 md:gap-6 ${shouldUseCSS ? 'animate-scroll-down' : ''}`}
            style={{
              animation: shouldUseCSS ? 'scrollDown 20s linear infinite' : 'none',
            }}
          >
            {column1Brands.map((brandNum, index) => (
              <BrandLogo key={`col1-${index}`} brandNum={brandNum} index={index} />
            ))}
          </div>

          {/* Column 2 */}
          <div
            ref={column2Ref}
            className={`flex flex-col gap-4 md:gap-6 ${shouldUseCSS ? 'animate-scroll-up' : ''}`}
            style={{
              animation: shouldUseCSS ? 'scrollUp 20s linear infinite' : 'none',
            }}
          >
            {column2Brands.map((brandNum, index) => (
              <BrandLogo key={`col2-${index}`} brandNum={brandNum} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Separate component for lazy loading images
function BrandLogo({ brandNum, index }) {
  const [imageSrc, setImageSrc] = useState(null)
  const imgRef = useRef(null)
  const isInView = useInView(imgRef, { rootMargin: '50px' })

  useEffect(() => {
    if (!isInView) return

    const loadImage = async () => {
      const module = await import(`../../assets/brand${brandNum}.png`)
      setImageSrc(module.default)
    }

    loadImage()
  }, [isInView, brandNum])

  return (
    <div
      ref={imgRef}
      className="w-[120px] h-[80px] md:w-[150px] md:h-[100px] lg:w-[180px] lg:h-[120px] rounded-xl flex items-center justify-center p-4"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`brand-${brandNum}`}
          className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-800/30 rounded-lg animate-pulse" />
      )}
    </div>
  )
}

export default Banner1
