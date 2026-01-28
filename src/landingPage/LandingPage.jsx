import React from 'react'
import NavBar from './landingPageComponent/NavBar'
import bgImage from '../assets/FirstBg.png'
import Hero from './landingPageComponent/Hero'

function LandingPage() {
  return (
     <main className="w-full h-screen bg-black bg-cover bg-center flex-layout" style={{ backgroundImage: `url(${bgImage})` }}>
        <NavBar/>
        <Hero/>
        
     </main>
  )
}

export default LandingPage