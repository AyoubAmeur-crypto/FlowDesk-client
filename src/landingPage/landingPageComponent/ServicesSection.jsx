import React, { useRef, useEffect } from 'react'
import { Code2, Layout, Smartphone, Globe, Palette, Zap } from 'lucide-react'

const services = [
  {
    id: 1,
    icon: <Layout size={20} />,
    title: 'Web Design',
    description: 'Crafting stunning, responsive websites that captivate visitors and drive conversions.',
    image: 'https://res.cloudinary.com/dt1yngqg0/image/upload/v1774725914/Studio_Shodwe_hohzds.png',
  },
  {
    id: 2,
    icon: <Code2 size={20} />,
    title: 'Development',
    description: 'Building robust, scalable applications using cutting-edge technologies and best practices.',
    image: 'https://res.cloudinary.com/dt1yngqg0/image/upload/v1774727006/Studio_Shodwe_1_fvww1m.png',
  },
  {
    id: 3,
    icon: <Smartphone size={20} />,
    title: 'Mobile Apps',
    description: 'Creating seamless mobile experiences that work flawlessly across all devices.',
    image: 'https://res.cloudinary.com/dt1yngqg0/image/upload/v1774727006/Studio_Shodwe_2_sdcrws.png',
  },
  {
    id: 4,
    icon: <Globe size={20} />,
    title: 'Digital Marketing',
    description: 'Data-driven strategies that increase visibility and drive qualified traffic to your business.',
    image: 'https://res.cloudinary.com/dt1yngqg0/image/upload/v1774727005/Studio_Shodwe_3_izfzzb.png',
  },
  {
    id: 5,
    icon: <Palette size={20} />,
    title: 'Brand Identity',
    description: 'Developing cohesive brand systems that communicate your unique value proposition.',
    image: 'https://res.cloudinary.com/dt1yngqg0/image/upload/v1774727004/Studio_Shodwe_4_bgxnwz.png',
  },
  {
    id: 6,
    icon: <Zap size={20} />,
    title: 'Consulting',
    description: 'Strategic guidance to help you make informed decisions and achieve your business goals.',
    image: 'https://res.cloudinary.com/dt1yngqg0/image/upload/v1774727005/Studio_Shodwe_5_nicrph.png',
  },
]

function ServiceRow({ service, gsapRef, isLast }) {
  const rowRef   = useRef(null)
  const imageRef = useRef(null)
  const arrowRef = useRef(null)
  const titleRef = useRef(null)
  const indexRef = useRef(null)
  const iconRef  = useRef(null)
  const descRef  = useRef(null)

  // ✅ No initial tilt — always starts at 0
  // Hover direction alternates: odd=right(+10), even=left(-10)
  const hoverRotation = service.id % 2 === 0 ? -6 : 6

  const handleMouseEnter = () => {
    const gsap = gsapRef.current
    if (!gsap) return

    // ✅ Kill ANY running animation on this image instantly — no bleed from previous hover
    gsap.killTweensOf(imageRef.current)

    const tl = gsap.timeline()

    // Opacity snaps in 1 frame
    tl.to(imageRef.current, {
      opacity:  1,
      duration: 0.06,
      ease:     'none',
    })

    // Rotation sweeps while visible
    tl.to(imageRef.current, {
      rotation: hoverRotation,
      y:        -40,
      duration: 0.35,
      ease:     'power3.out',
    }, 0.04)

    // Row + text
    gsap.killTweensOf([rowRef.current, titleRef.current, indexRef.current, iconRef.current, descRef.current, arrowRef.current])
    gsap.to(arrowRef.current, { x: 6, y: -6, color: '#000000', duration: 0.25, ease: 'power2.out' })
    gsap.to(titleRef.current, { color: '#000000', x: 6, duration: 0.25 })
    gsap.to(indexRef.current, { color: '#000000', duration: 0.25 })
    gsap.to(iconRef.current,  { color: '#000000', scale: 1.15, duration: 0.25 })
    gsap.to(descRef.current,  { color: '#333333', duration: 0.25 })
    gsap.to(rowRef.current,   { backgroundColor: '#d0f5a0', duration: 0.25 })
  }

  const handleMouseLeave = () => {
    const gsap = gsapRef.current
    if (!gsap) return

    // ✅ Kill immediately — if user enters a new row this leave won't fight the enter
    gsap.killTweensOf(imageRef.current)

    // Snap opacity off instantly — no leave animation, clean cut
    gsap.set(imageRef.current, {
      opacity:  0,
      rotation: 0,   // ✅ reset back to 0 for next hover
      y:        0,
    })

    gsap.killTweensOf([rowRef.current, titleRef.current, indexRef.current, iconRef.current, descRef.current, arrowRef.current])
    gsap.to(arrowRef.current, { x: 0, y: 0, color: 'rgba(255,255,255,0.25)', duration: 0.25 })
    gsap.to(titleRef.current, { color: 'rgba(255,255,255,0.7)', x: 0, duration: 0.25 })
    gsap.to(indexRef.current, { color: 'rgba(255,255,255,0.2)', duration: 0.25 })
    gsap.to(iconRef.current,  { color: 'rgba(255,255,255,0.35)', scale: 1, duration: 0.25 })
    gsap.to(descRef.current,  { color: 'rgba(255,255,255,0.3)', duration: 0.25 })
    gsap.to(rowRef.current,   { backgroundColor: 'transparent', duration: 0.25 })
  }

  return (
    <div
      ref={rowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-between w-full cursor-pointer"
      style={{
        backgroundColor: 'transparent',
        borderBottom:    isLast ? 'none' : '1px solid rgba(255,255,255,0.07)',
        padding:         '0.5rem 4vw',
        overflow:        'visible',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-8 md:gap-16 flex-1 min-w-0">
        <span
          ref={indexRef}
          className="text-xs font-mono shrink-0 tabular-nums"
          style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}
        >
          {String(service.id).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <span ref={iconRef} style={{ color: 'rgba(255,255,255,0.35)' }}>
              {service.icon}
            </span>
            <h3
              ref={titleRef}
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {service.title}
            </h3>
          </div>
          <p
            ref={descRef}
            className="text-sm md:text-base max-w-lg pl-10"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {service.description}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-36 shrink-0 ml-6">

        <div
          ref={imageRef}
          className="hidden lg:block rounded-2xl overflow-hidden shrink-0"
          style={{
            width:         '180px',
            height:        '180px',
            opacity:       0,
            scale:         1.8,
            transform:     'rotate(0deg)',   // ✅ always starts at 0
            position:      'relative',
            zIndex:        10,
            boxShadow:     '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
            pointerEvents: 'none',
            willChange:    'transform, opacity',
          }}
        >
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <svg
          ref={arrowRef}
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

function ServicesSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const rowsRef = useRef(null)
  const gsapRef = useRef(null)

  useEffect(() => {
    let ctx

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ])

        gsap.registerPlugin(ScrollTrigger)
        gsapRef.current = gsap

        ctx = gsap.context(() => {
          // Header
          gsap.fromTo(
            headerRef.current,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 88%',
                once: true,
              },
            }
          )

          // Rows stagger
          gsap.fromTo(
            Array.from(rowsRef.current.children),
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: rowsRef.current,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }, sectionRef.current)
      },
      { threshold: 0.05 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100vw',               // ✅ full screen width
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)', // ✅ break out of any parent padding
        backgroundColor: '#000',
        paddingTop: '8rem',
        paddingBottom: '8rem',
        overflow: 'visible',
      }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        style={{ opacity: 0, padding: '0 4vw', marginBottom: '4rem' }}
      >
        <p
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
           color: '#c8ff00',
            marginBottom: '1rem',
          }}
        >
          What we do
        </p>
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Our Services
        </h2>
      </div>

      {/* Top border */}
      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />

      {/* Rows — overflow visible so images cross borders */}
      <div ref={rowsRef} style={{ overflow: 'visible' }}>
        {services.map((service, index) => (
          <ServiceRow
            key={service.id}
            service={service}
            gsapRef={gsapRef}
            isLast={index === services.length - 1}
          />
        ))}
      </div>

      {/* Bottom border */}
      <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.07)' }} />
    </section>
  )
}

export default ServicesSection