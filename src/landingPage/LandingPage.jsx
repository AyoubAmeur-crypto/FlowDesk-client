import React from 'react'
import NavBar from './landingPageComponent/NavBar'
import bgImage from '../assets/section.png'
import Hero from './landingPageComponent/Hero'
import Banner1 from './landingPageComponent/Banner1'
import Banner2 from './landingPageComponent/Banner2'
import Banner3 from './landingPageComponent/Banner3'

function LandingPage() {
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
        <Banner1/>
        <Banner2/>
        <Banner3/>
        
     </main>
  )
}

export default LandingPage