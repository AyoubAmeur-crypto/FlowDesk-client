import React, { useState } from 'react'
import logow from '../../assets/logow.svg'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import AuthModal from '../../modals/AuthModal'

function NavBar() {
    const [loginModal,setLoginModal]=useState(false)
    const [signUpModal,setSignUpModal]=useState(false)
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
    }, [loginModal,signUpModal])
    const features =  [{label:'home',destination:'/'},{label:'services',destination:'/services'},{label:'career',destination:'/career'},{label:'pricing',destination:'/pricing'}]  
  return (
    
   <>
    <header className=' text-white font-light'>
        <nav className=' my-[-80px] top-0 left-0'>
            <button>
               <img width={100} className='h-30 ' src={logow} alt="Logo" />
            </button>

            <ul>{features.map(item=>
                (<li key={item.label}>
                    <a href="" className='text-lg'>{item.label}</a>
                </li>)
            )}</ul>
            
            <div className="flex-center gap-3 text-lg"><button onClick={()=>{setLoginModal(true)}} className='cursor-pointer hover:text-white/70 transition-all duration-300 ease-in-out'>Login</button>
            <button className='text-black bg-white font-light py-0.5 px-2 rounded-md cursor-pointe text-sm lg:text-md hover:bg-white/80 transition-all duration-300 ease-in-out' onClick={()=>{setSignUpModal(true)}}>Get Started</button>
            </div>
        </nav>
    </header>

      {loginModal && (
 <>
    <div 
      className="modal-backdrop fixed inset-0 bg-gray-700/40 backdrop-blur-sm z-40"
      onClick={() => setLoginModal(false)}
    />
    <div className="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50">
      <AuthModal initialMode='login' />
    </div>
  </>
)}

  {signUpModal && (
 <>
    <div 
      className="modal-backdrop fixed inset-0 bg-gray-700/40 backdrop-blur-sm z-40"
      onClick={() => setSignUpModal(false)}
    />
    <div className="modal-content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4 z-50">
      <AuthModal initialMode='signup' />
    </div>
  </>
)}
   </>

    
  )
}

export default NavBar