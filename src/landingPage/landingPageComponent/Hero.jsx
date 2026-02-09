import React, { useState, useEffect, useRef } from 'react'
import { CircleCheck,Star } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import avatars from '../../assets/avatars.png'
import star from '../../assets/review.png'

const WORDS = ['grow', 'scale', 'thrive', 'expand', 'evolve']

function Hero() {
  const [loginModal, setLoginModal] = useState(false)
  const wordIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const intervalRef = useRef(null)
  const measureRef = useRef(null)
  const [maxWidth, setMaxWidth] = useState(0)

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

  useGSAP(() => {
    gsap.fromTo(
      '#logo',
      { opacity: 0, filter: 'blur(20px)', scale: 1.2 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.5, ease: 'power3.out', delay: 0.2 }
    )

    gsap.timeline({ delay: 0.7 }).to('.simplest-text', {
      rotation: -4,
      duration: 0.8,
      ease: 'power1.inOut',
    })
  }, [])

  useEffect(() => {
    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(rollNext, 2000)
    }, 0)

    return () => {
      clearTimeout(startDelay)
      clearInterval(intervalRef.current)
    }
  }, [])

  function rollNext() {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    const current = document.querySelector('.slot-current')
    const next = document.querySelector('.slot-next')

    wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length
    if (next) next.textContent = WORDS[wordIndexRef.current]

    const tl = gsap.timeline({
      onComplete: () => {
        if (current) current.textContent = WORDS[wordIndexRef.current]
        gsap.set(current, { y: 0 })
        gsap.set(next, { y: '-100%' })
        isAnimatingRef.current = false
      },
    })

    tl.to(current, {
      y: '100%',
      duration: 0.55,
      ease: 'cubic-bezier(0.4, 0, 1, 1)',
    }, 0)

    .fromTo(next,
      { y: '-100%' },
      {
        y: '0%',
        duration: 0.55,
        ease: 'cubic-bezier(0, 0, 0.2, 1)',
      }, 0
    )
  }

  return (
    <section className="relative w-full">
      <div className="col-center gap-4 lg:gap-8 mt-35 px-4 sm:px-6" id="logo">

        {/* Pills */}
        <div className="md:flex  md:flex-row hidden  md:gap-2  md:text-white md:text-sm md:text-center">
          <div className="flex flex-row items-center justify-center gap-[8px]">
            <CircleCheck size={16} />
            <p>12,625 Satisifed Client</p>
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
          <span className="simplest-text text-black bg-white rounded-md px-2 py-1 inline-block">
            simplest
          </span>{' '}
          way to{' '}

          <span
            ref={measureRef}
            className="text-[#c8ff00] font-extrabold absolute opacity-0 pointer-events-none whitespace-nowrap"
            style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
            aria-hidden="true"
          />

          <span
            className="slot-container relative inline-flex justify-center overflow-hidden"
            style={{ width: maxWidth || 'auto', verticalAlign: 'bottom' }}
          >
            <span
              className="slot-current text-center text-[#c8ff00]"
              style={{ display: 'inline-block', width: '100%', willChange: 'transform' }}
            >
              {WORDS[0]}
            </span>
            <span
              className="slot-next text-center text-[#c8ff00]"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: 'translateY(-100%)',
                willChange: 'transform',
              }}
            >
              {WORDS[1]}
            </span>
          </span>{' '}

          your business across all services.
        </h1>

        <p className="w-full max-w-[640px] text-center text-lg sm:text-xl lg:text-2xl text-gray-300">
          The best B2B network for brands, startups, founders, and growing businesses. Just for you
        </p>

        <div className="flex-col items-start gap-[15px]  w-full max-w-[440px]">
          <div className="flex flex-col sm:flex-row items-center gap-[10px] ">
          <input
            type="email"
            placeholder="sam@gmail.com"
            className="w-full bg-black text-gray-400 rounded-md ring-1 ring-gray-600 px-[15px] py-[8px] text-sm outline-none focus:ring-gray-400 transition-colors"
          />
          <button className="w-full sm:w-auto bg-white rounded-md text-black font-semibold cursor-pointer px-4 py-[8px] text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
            Get Sample
          </button>
          
        </div>
        <p className='text-xs pt-2'>Get sample right in your inbox, No need to Login</p>
        </div>
        <div className="flex flex-row items-center gap-[12px]">
          <img src={avatars} className='w-[140px] sm:w-[210px]' alt="" />
         <div className="flex-col">
           <div className="flex flex-row gap-2">
           <img src={star} className='w-[20px]' />
           <img src={star} className='w-[20px]'/>
           <img src={star} className='w-[20px]'/>
           <img src={star} className='w-[20px]'/>
           <img src={star} className='w-[20px]'/>
          </div>
          <p>Loved By 100+ users</p>
         </div>
        </div>
      </div>
    </section>
  )
}

export default Hero