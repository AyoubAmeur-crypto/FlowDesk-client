import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroVideo from '../../assets/scrolling1Df.mp4'
import cursorImage from '../../assets/cursor.png'

gsap.registerPlugin(ScrollTrigger)

function Banner4() {
  const videoRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorInnerRef = useRef(null)
  const containerRef = useRef(null)
  const contentRef = useRef(null)
  const buttonRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef(null)

  // Ultra-smooth cursor - RAF approach (what agencies use)
  useEffect(() => {
    const cursor = cursorRef.current
    const cursorInner = cursorInnerRef.current
    const container = containerRef.current
    if (!cursor || !cursorInner || !container) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0
    let currentInnerX = 0
    let currentInnerY = 0
    let isInside = false

    const handleMouseMove = (e) => {
      if (!isInside) return
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseEnter = () => {
      isInside = true
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      isInside = false
      setIsHovered(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Buttery smooth 60fps cursor animation
    const animateCursor = () => {
      if (!isInside) {
        rafRef.current = requestAnimationFrame(animateCursor)
        return
      }

      // Outer cursor - slower, elegant trail
      const speed = 0.12
      currentX += (mouseX - currentX) * speed
      currentY += (mouseY - currentY) * speed
      
      gsap.set(cursor, {
        x: currentX,
        y: currentY,
      })

      // Inner cursor - snappier, more responsive
      const innerSpeed = 0.3
      currentInnerX += (mouseX - currentInnerX) * innerSpeed
      currentInnerY += (mouseY - currentInnerY) * innerSpeed
      
      gsap.set(cursorInner, {
        x: currentInnerX,
        y: currentInnerY,
      })

      rafRef.current = requestAnimationFrame(animateCursor)
    }

    rafRef.current = requestAnimationFrame(animateCursor)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Video optimization with slower playback
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Cinematic slow-motion
    video.playbackRate = 0.65

    const playVideo = async () => {
      try {
        await video.play()
      } catch (error) {
        console.log("Video autoplay prevented:", error)
      }
    }

    playVideo()

    // Performance: pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play()
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)

    return () => observer.disconnect()
  }, [])

  // Premium GSAP animations - Agency style
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth reveal animation when scrolled into view
      const tl = gsap.timeline({ 
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        }
      })

      // Staggered entrance with subtle slide + fade
      tl.from(contentRef.current?.children, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
      })

      // Subtle parallax scroll effect on video
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5, // Smoother scrubbing
        onUpdate: (self) => {
          gsap.to(videoRef.current, {
            y: self.progress * 60,
            ease: 'none',
          })
        },
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Magnetic button + cursor scale effect
  useEffect(() => {
    const button = buttonRef.current
    const container = containerRef.current
    if (!button || !container) return

    let isInContainer = false
    let buttonRect = button.getBoundingClientRect()
    let buttonCenterX = buttonRect.left + buttonRect.width / 2
    let buttonCenterY = buttonRect.top + buttonRect.height / 2

    const handleContainerEnter = () => {
      isInContainer = true
    }

    const handleContainerLeave = () => {
      isInContainer = false
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      })
      gsap.to([cursorRef.current, cursorInnerRef.current], {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseMove = (e) => {
      if (!isInContainer) return

      const distance = Math.hypot(
        e.clientX - buttonCenterX,
        e.clientY - buttonCenterY
      )

      // Magnetic pull effect (150px activation radius)
      if (distance < 150) {
        const angle = Math.atan2(
          e.clientY - buttonCenterY,
          e.clientX - buttonCenterX
        )
        const pullStrength = Math.max(0, 1 - distance / 150) * 35

        gsap.to(button, {
          x: Math.cos(angle) * pullStrength,
          y: Math.sin(angle) * pullStrength,
          duration: 0.4,
          ease: 'power2.out',
        })

        // Cursor grows on button proximity
        gsap.to([cursorRef.current, cursorInnerRef.current], {
          scale: 1.6,
          duration: 0.3,
          ease: 'power2.out',
        })
      } else {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        })

        gsap.to([cursorRef.current, cursorInnerRef.current], {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const updateButtonPosition = () => {
      buttonRect = button.getBoundingClientRect()
      buttonCenterX = buttonRect.left + buttonRect.width / 2
      buttonCenterY = buttonRect.top + buttonRect.height / 2
    }

    container.addEventListener('mouseenter', handleContainerEnter)
    container.addEventListener('mouseleave', handleContainerLeave)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', updateButtonPosition)
    window.addEventListener('scroll', updateButtonPosition)

    return () => {
      container.removeEventListener('mouseenter', handleContainerEnter)
      container.removeEventListener('mouseleave', handleContainerLeave)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateButtonPosition)
      window.removeEventListener('scroll', updateButtonPosition)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-black "
      style={{ cursor: isHovered ? 'none' : 'auto' }}
    >
      {/* Premium dual cursor - SCOPED to this component only */}
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed z-[9999] mix-blend-difference transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img 
          src={cursorImage} 
          alt="" 
          className="w-12 h-12 opacity-80"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(0, 204, 255, 0.9))',
          }}
        />
      </div>

      <div
        ref={cursorInnerRef}
        className={`pointer-events-none fixed z-[9999] transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className="w-2 h-2 bg-cyan-400 rounded-full"
          style={{
            boxShadow: '0 0 20px rgba(0, 204, 255, 1)',
          }}
        />
      </div>

      {/* Video Hero Section */}
           {/* Video Hero Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        {/* Background Video */}
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}

        {/* Content - SIMPLE & VISIBLE */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 max-w-3xl leading-tight">
            Ready for an exceptional web solution? - Just Hit Start
          </h1>
          
          <button 
            ref={buttonRef}
            
            onClick={()=>{window.alert("cliked")}}
            className="px-8 py-4 text-white text-lg font-semibold rounded-full hover:scale-105 transition-all"
            style={{
              background: 'linear-gradient(135deg, #00CCFF 0%, #0099FF 100%)',
              boxShadow: '0 10px 40px rgba(0, 204, 255, 0.4)',
            }}
          >
            <span  className="text-2xl font-extrabold">Start Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner4