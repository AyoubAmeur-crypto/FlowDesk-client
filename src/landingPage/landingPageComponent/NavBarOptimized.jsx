import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import logow from '../../assets/logow.svg'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Lazy load AuthModal - not needed for initial paint
const AuthModal = lazy(() => import('../../modals/AuthModal'))

/**
 * Optimized NavBar Component
 * - Deferred GSAP loading
 * - ScrollTrigger only initialized when needed
 * - Reduced motion support
 * - Minimal initial bundle impact
 */
function NavBar() {
  const [loginModal, setLoginModal] = useState(false)
  const [signUpModal, setSignUpModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef(null)
  const reducedMotion = useReducedMotion()

  // Use native scroll handling for better performance
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled)
      }
    }

    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolled])

  // Modal animations - only load GSAP when needed
  useEffect(() => {
    if ((!loginModal && !signUpModal) || reducedMotion) return

    let ctx = null

    const animateModal = async () => {
      const [{ default: gsap }] = await Promise.all([
        import('gsap'),
      ])

      ctx = gsap.context(() => {
        gsap.fromTo(
          '.modal-backdrop',
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
        gsap.fromTo(
          '.modal-content',
          { opacity: 0, scale: 0.95, y: -20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          }
        )
      })
    }

    animateModal()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [loginModal, signUpModal, reducedMotion])

  const features = [
    { label: 'home', destination: '/' },
    { label: 'services', destination: '/services' },
    { label: 'career', destination: '/career' },
    { label: 'pricing', destination: '/pricing' },
  ]

  // Dynamic styles based on scroll state
  const navStyles = isScrolled
    ? {
        backgroundColor: 'rgba(179, 179, 179, 0.2)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '16px 32px',
        margin: '12px auto',
        width: '95%',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }
    : {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        borderRadius: '20px',
        padding: '16px 32px',
        margin: '0 auto',
        width: '100%',
        boxShadow: 'none',
        border: 'none',
      }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 transition-all duration-300 rounded-[20px] mx-auto"
        style={navStyles}
      >
        <img src={logow} className="h-5" alt="FlowDesk logo" />

        <ul className="hidden md:flex gap-8 capitalize text-white/50 font-medium">
          {features.map((item) => (
            <li
              key={item.label}
              className="cursor-pointer hover:text-white transition-all duration-300 ease-in-out"
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="flex gap-3 md:gap-6 items-center text-white/50 font-light text-sm md:text-base">
          <button
            onClick={() => setLoginModal(true)}
            className="cursor-pointer hover:text-white/70 transition-all duration-300 ease-in-out"
          >
            Login
          </button>
          <button
            onClick={() => setSignUpModal(true)}
            className="text-black bg-white font-light py-0.5 px-2 rounded-md text-xs md:text-[16px] hover:bg-white/80 transition-all duration-300 ease-in-out"
          >
            Get Started
          </button>
        </div>
      </nav>

      {loginModal && (
        <>
          <div
            className="modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setLoginModal(false)}
          />
          <div className="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50">
            <Suspense fallback={<div className="bg-gray-900/90 rounded-lg p-8">Loading...</div>}>
              <AuthModal initialMode="login" />
            </Suspense>
          </div>
        </>
      )}

      {signUpModal && (
        <>
          <div
            className="modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setSignUpModal(false)}
          />
          <div className="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50">
            <Suspense fallback={<div className="bg-gray-900/90 rounded-lg p-8">Loading...</div>}>
              <AuthModal initialMode="signup" />
            </Suspense>
          </div>
        </>
      )}
    </>
  )
}

export default NavBar
