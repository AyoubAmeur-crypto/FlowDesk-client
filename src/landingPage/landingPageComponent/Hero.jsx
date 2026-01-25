import React from 'react'
import video from '../../assets/logow.webm'
import bigLogo from  '../../assets/logow.svg'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
function Hero() {

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
  return (
    <section id='hero'>
      <div className="col-center gap-8 " id='logo'>
          
         <img src={bigLogo} className='h-[80px]' id='logo' alt="" srcset="" /> 
        <div className="col-center gap-4 text-white font-light">
            <p className='text-white text-2xl'>Stay ahead of the curve with our forward-thinking </p>
        <button className='relative z-10 text-black bg-white font-light py-2 px-4 rounded-2xl cursor-pointer hover:bg-white/80 transition-all duration-300 ease-in-out'>Get Started Now</button>
        </div>
      </div>
        
    </section>
  )
}

export default Hero