import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Banner2() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const containerRef = useRef(null)

  useGSAP(() => {
    // Animate the first heading
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 50,
      },
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
        },
      }
    )

    // Animate the large subtitle with split effect
    const subtitle = subtitleRef.current
    const text = subtitle.textContent
    subtitle.innerHTML = text
      .split('')
      .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')

    gsap.fromTo(
      subtitle.children,
      {
        opacity: 0,
        y: 100,
        rotateX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
        stagger: 0.03,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <div className="px-4 md:px-12 lg:px-[90px] pt-[80px] md:pt-[120px]  pb-[80px] md:pb-[120px]">
      <div ref={containerRef} className="text-black overflow-hidden">
        <h1
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-[64px] m-0 font-light"
        >
          An unmatched attendee
        </h1>
        <h2
          ref={subtitleRef}
          className="text-[clamp(3rem,15vw,15rem)] sm:text-6xl md:text-8xl lg:text-[240px] p-0 leading-none font-bold break-words"
          style={{ perspective: '1000px' }}
        >
          Experience
        </h2>
      </div>
      
    </div>
  )
}

export default Banner2