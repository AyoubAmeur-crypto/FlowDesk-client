import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import cover1 from '../../assets/div.png'
import div1 from '../../assets/div1.png'
import div2 from '../../assets/div2.png'
import div3 from '../../assets/div3.png'
import div4 from '../../assets/div4.png'
import div5 from '../../assets/div5.png'
import div6 from '../../assets/div6.png'
import div7 from '../../assets/div7.png'
import div8 from '../../assets/div8.png'
import div10 from '../../assets/div10.png'


gsap.registerPlugin(ScrollTrigger)

function Banner3() {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const heroContainerRef = useRef(null)
  const overlayRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const heroContainer = heroContainerRef.current
    const overlay = overlayRef.current
    const logo = logoRef.current
    
    if (!hero || !heroContainer || !overlay || !logo) return

    const ctx = gsap.context(() => {
      // Smooth parallax scroll effect with brand identity pause
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainer,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
        }
      })

      // Phase 1: Image moves down and logo comes up to center (50% of animation)
      tl.fromTo(hero,
        {
          scale: 1,
          borderRadius: '0px',
          y: 0,
        },
        {
          scale: 0.85,
          borderRadius: '32px',
          y: 100,
          ease: 'none',
          duration: 0.5,
        }
      )
      
      .fromTo(overlay,
        {
          opacity: 0,
        },
        {
          opacity: 0.75,
          ease: 'none',
          duration: 0.5,
        },
        0
      )
      
      .fromTo(logo,
        {
          opacity: 0,
          scale: 0.9,
          y: 150,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0, // Logo centered
          ease: 'none',
          duration: 0.5,
        },
        0
      )
      
      // Phase 2: Hold/pause when logo is perfectly centered (30% for brand identity)
      .to({}, { 
        duration: 0.3,
      })
      
      // Phase 3: Small final adjustments (20% of animation) - optional polish
      .to(hero, {
        scale: 0.82,
        ease: 'none',
        duration: 0.2,
      })
      .to(overlay, {
        opacity: 0.8,
        ease: 'none',
        duration: 0.2,
      }, '<')
      .to(logo, {
        scale: 1.05,
        ease: 'none',
        duration: 0.2,
      }, '<')

    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full bg-black">
      
      {/* Hero Image with Scroll Mask Effect */}
      <div 
        ref={heroContainerRef} 
        className="relative w-full h-[250vh] bg-black" // Long scroll distance
      >
        <div className="sticky top-0 w-full h-screen overflow-hidden"> {/* Sticky instead of pin */}
          {/* Background Image */}
          <img 
            ref={heroRef}
            src={cover1}  
            className='absolute inset-0 w-full h-full object-cover'
            alt="Hero gallery image"
            loading="eager"
            style={{ transformOrigin: 'center center' }}
          />
          
          {/* Dark Overlay */}
          <div 
            ref={overlayRef}
            className="absolute inset-0 bg-black opacity-0 pointer-events-none"
            style={{ transformOrigin: 'center center' }}
          />
          
          {/* Logo in Center */}
          <div 
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-10"
          >
            <h1 className="text-white text-6xl md:text-8xl lg:text-9xl font-extralight tracking-wide">
              FlowDesk
            </h1>
          </div>
        </div>
      </div>

      {/* Content below */}
      <div className="relative z-20  min-h-screen">
        <div className="max-w-[1280px] bg-black mx-auto px-4 md:px-8 lg:px-12 py-20">
         <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Elevate Your Brand with Strategic Excellence</h2>
  <p className="text-lg md:text-xl text-white/80 mb max-w-3xl leading-relaxed">
    We're a full-service digital agency that transforms ambitious visions into remarkable realities. From compelling brand narratives to data-driven marketing campaigns, we craft experiences that resonate, engage, and convert. Our integrated approach combines creative brilliance with strategic insights to help your business thrive in the digital landscape.
  </p>
        </div>
        
        {/* Image Gallery */}
         <div className="px-4 md:px-8 lg:px-12 pb-20 pt-10">
       
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex flex-col gap-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <img src={div2} alt="Gallery 1" className="w-full h-full object-cover" />
                
                {/* Text overlay */}
                <div className="absolute inset-0 flex items-start  justify-center bg-black/30">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4 pt-10 max-w-140">
                    Turning Ideas Into Impact
                  </h3>
                </div>
              </div>
            </div>            
            <div className="flex flex-col gap-4">
              <img src={div3} alt="Gallery 2" className="w-full h-full object-cover rounded-2xl flex-1" />
              <img src={div4} alt="Gallery 3" className="w-full h-full object-cover rounded-2xl flex-1" />
            </div>

          
         
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Banner3