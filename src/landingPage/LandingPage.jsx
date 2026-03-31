import React, { Suspense } from 'react'
import NavBar from './landingPageComponent/NavBar'
import Hero from './landingPageComponent/Hero'
import Banner1 from './landingPageComponent/Banner1'
import Banner2 from './landingPageComponent/Banner2'
import Banner3 from './landingPageComponent/Banner3'
import Banner4 from './landingPageComponent/Banner4'
import ServicesSection from './landingPageComponent/ServicesSection'
import CtaAction from './landingPageComponent/CTASection'
import TestimonialsSection from './landingPageComponent/TestimonialsSection'


function LandingPage() {

   const bgImage = "https://res.cloudinary.com/dt1yngqg0/image/upload/f_auto,q_auto:best,w_1440,h_430,c_fill,dpr_auto/v1774720197/section_wgl3sc.png"

  return (
     <main className="w-full h-screen bg-black bg-cover bg-center flex-layout" 
     style={{ 
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'auto 430px',
  backgroundPosition: 'top left',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'black'}}
     >
        <NavBar/>
        <Hero/>
   <Suspense fallback={null}>
        <Banner1 />
        <Banner2 />
        <Banner3 />
        <Banner4 />
        <ServicesSection />
      
        <CtaAction />

          <TestimonialsSection />
        
      </Suspense>
     </main>
  )
}

export default LandingPage