import React, { useRef } from 'react'
import { MoveUpRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import brand1 from '../../assets/brand1.png'
import brand2 from '../../assets/brand2.png'
import brand3 from '../../assets/brand3.png'
import brand4 from '../../assets/brand4.png'
import brand5 from '../../assets/brand5.png'
import brand6 from '../../assets/brand6.png'
import brand7 from '../../assets/brand7.png'
import brand8 from '../../assets/brand8.png'
import brand9 from '../../assets/brand9.png'
import brand10 from '../../assets/brand10.png'
import brand11 from '../../assets/brand11.png'

function Banner1() {
  const column1Ref = useRef(null)
  const column2Ref = useRef(null)

  const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7, brand8, brand9, brand10, brand11]
  
  // Duplicate brands multiple times for seamless infinite scroll
  const column1Brands = [...brands, ...brands]
  const column2Brands = [...brands, ...brands]

  useGSAP(() => {
    // Animate column 1 - scrolling down
    gsap.fromTo(
      column1Ref.current,
      { y: '0%' },
      {
        y: '-50%', // Move by half since we doubled the array
        duration: 15,
        ease: 'none',
        repeat: -1,
      }
    )

    // Animate column 2 - scrolling up (opposite direction)
    gsap.fromTo(
      column2Ref.current,
      { y: '-50%' },
      {
        y: '0%',
        duration: 15,
        ease: 'none',
        repeat: -1,
      }
    )
  }, [])

  return (
    <div className='w-full px-4 md:px-12 lg:px-[80px] pt-[110px] md:pt-[130px] text-white bg-black'>
      <div className='flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4'>
        {/* Left Content */}
        <div className='flex flex-col items-start text-start max-w-full lg:max-w-[416px]'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-light'>
            World-class teams are upgrading to Welcome
          </h1>
          <p className='text-xs md:text-sm pt-3 text-white/70'>
            Companies are ditching legacy platforms for the ability to deliver an engaging experience at every level.
          </p>
          <div className='pt-8 md:pt-12'>
            <p className='flex flex-row gap-2 text-lg md:text-xl text-white/60'>
              <span className='flex flex-row items-center text-white'>
                <MoveUpRight className='w-[30px] md:w-[40px] text-green-400' />
                90%
              </span>
              positive rate
            </p>
            <p className='text-[11px] md:text-[12px] mt-1.5 text-white/60'>
              avg rate for Welcome customers
            </p>
          </div>
        </div>

        {/* Right Scrolling Logos */}
        <div className='flex gap-4 md:gap-6 h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden'>
          {/* Column 1 - Scrolling Down */}
          <div ref={column1Ref} className='flex flex-col gap-4 md:gap-6'>
            {column1Brands.map((brand, index) => (
              <div
                key={`col1-${index}`}
                className='w-[120px] h-[80px] md:w-[150px] md:h-[100px] lg:w-[180px] lg:h-[120px] rounded-xl flex items-center justify-center p-4'
              >
                <img
                  src={brand}
                  alt={`brand-${index + 1}`}
                  className='w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300'
                />
              </div>
            ))}
          </div>

          {/* Column 2 - Scrolling Up */}
          <div ref={column2Ref} className='flex flex-col gap-4 md:gap-6'>
            {column2Brands.map((brand, index) => (
              <div
                key={`col2-${index}`}
                className='w-[120px] h-[80px] md:w-[150px] md:h-[100px] lg:w-[180px] lg:h-[120px] rounded-xl flex items-center justify-center p-4'
              >
                <img
                  src={brand}
                  alt={`brand-${index + 1}`}
                  className='w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner1