import React, { useState, useRef } from 'react'
import logow from '../../assets/logow.svg'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AuthModal from '../../modals/AuthModal'

gsap.registerPlugin(ScrollTrigger)

function NavBar() {
  const [loginModal, setLoginModal] = useState(false)
  const [signUpModal, setSignUpModal] = useState(false)
  const navRef = useRef(null)

  useGSAP(() => {
    if (loginModal || signUpModal) {
      // Animate backdrop
      gsap.fromTo(
        '.modal-backdrop',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      // Animate modal content
      gsap.fromTo(
        '.modal-content',
        { opacity: 0, scale: 0.8, y: -30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.2)',
          clearProps: 'transform'
        }
      )
    }
  }, [loginModal, signUpModal])

  useGSAP(() => {
    const nav = navRef.current

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -10px',
      end: 'bottom top',
      onEnter: () => {
        gsap.to(nav, {
          backgroundColor: 'rgba(179, 179, 179, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          paddingLeft: '32px',
          paddingRight: '32px',
          paddingTop: '16px',
          paddingBottom: '16px',
          marginTop: '12px',
          marginBottom: '12px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '95%',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          duration: 0.2,
          ease: 'power2.out'
        })
      },
      onLeaveBack: () => {
        gsap.to(nav, {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          borderRadius: '20px',
          paddingLeft: '32px',
          paddingRight: '32px',
          paddingTop: '16px',
          paddingBottom: '16px',
          marginTop: '0px',
          marginBottom: '0px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          boxShadow: 'none',
          border: 'none',
          duration: 0.2,
          ease: 'power2.out'
        })
      }
    })
  }, [])

  const features = [
    { label: 'home', destination: '/' },
    { label: 'services', destination: '/services' },
    { label: 'career', destination: '/career' },
    { label: 'pricing', destination: '/pricing' }
  ]

  return (
    <>
      <nav
        ref={navRef}
        className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 transition-all duration-300 rounded-[20px] mx-auto'
        style={{ willChange: 'transform, background-color' }}
      >
        <img src={logow} className='h-5' alt='logo' />
        
        <ul className='hidden md:flex gap-8 capitalize text-white/50 font-medium'>
          {features.map((item) => (
            <li
              key={item.label}
              className='cursor-pointer hover:text-white transition-all duration-300 ease-in-out'
            >
              {item.label}
            </li>
          ))}
        </ul>
        
        <div className='flex gap-3 md:gap-6 items-center text-white/50 font-light text-sm md:text-base'>
          <button
            onClick={() => {
              setLoginModal(true)
            }}
            className='cursor-pointer hover:text-white/70 transition-all duration-300 ease-in-out'
          >
            Login
          </button>
          <button
            onClick={() => {
              setSignUpModal(true)
            }}
            className='text-black bg-white font-light py-0.5 px-2 rounded-md text-xs md:text-[16px] hover:bg-white/80 transition-all duration-300 ease-in-out'
          >
            Get Started
          </button>
        </div>
      </nav>

      {loginModal && (
        <>
          <div
            className='modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
            onClick={() => setLoginModal(false)}
          />
          <div className='modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50'>
            <AuthModal initialMode='login' />
          </div>
        </>
      )}
      
      {signUpModal && (
        <>
          <div
            className='modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm z-40'
            onClick={() => setSignUpModal(false)}
          />
          <div className='modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50'>
            <AuthModal initialMode='signup' />
          </div>
        </>
      )}
    </>
  )
}

export default NavBar