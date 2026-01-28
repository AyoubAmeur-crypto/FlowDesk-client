import React, { useState } from 'react'
import video from '../../assets/logow.webm'
import bigLogo from  '../../assets/logow.svg'
import { ChevronDown } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { Button, Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'

import gsap from 'gsap'
import clsx from 'clsx'
import AuthModal from '../../modals/AuthModal'
function Hero() {


  const [loginModal,setLoginModal]=useState(false)
 

    useGSAP(()=>{

         gsap.fromTo(
      '#logo',
      {
        opacity: 0,
        filter: 'blur(20px)',
        scale: 1.2,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2,
      })

    },[])
   useGSAP(() => {
  if (loginModal) {
    // Animate backdrop
    gsap.fromTo(
      '.modal-backdrop',
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    
    // Animate modal content
    gsap.fromTo(
      '.modal-content',
      { 
        opacity: 0,
        scale: 0.8,
        y: -30
      },
      { 
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.2)',
        // This prevents GSAP from adding inline transform that fights with Tailwind
        clearProps: 'transform'
      }
    )
  }
}, [loginModal])
  return (
    <>
  <section className="relative">
    <div className="col-center gap-4 lg:gap-8 mt-50" id='logo'>
      <img src={bigLogo} className='h-[50px] lg:h-[80px]' id='logo' alt="" />
      <div className="col-center gap-2 text-white font-light">
        <p className='text-white w-80 text-center lg:w-fit text-md lg:text-2xl'>
          Stay ahead of the curve with our forward-thinking
        </p>
        <button 
          onClick={() => {setLoginModal(true)}} 
          className='relative z-10 text-black bg-white font-light py-2 px-4 rounded-2xl cursor-pointer hover:bg-white/80 transition-all duration-300 ease-in-out'
        >
          Get Started Now
        </button>
      </div>
    </div>
  </section>

  {loginModal && (
  <>
    <div 
      className="modal-backdrop fixed inset-0 bg-gray-700/40 backdrop-blur-sm z-40"
      onClick={() => setLoginModal(false)}
    />
    <div className="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50">
      <AuthModal initialMode='signup' />
    </div>
  </>
)}
</>
   
  )
}

export default Hero