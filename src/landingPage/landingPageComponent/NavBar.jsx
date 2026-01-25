import React from 'react'
import logow from '../../assets/logow.svg'

function NavBar() {
    const features =  [{label:'home',destination:'/'},{label:'services',destination:'/services'},{label:'career',destination:'/career'},{label:'pricing',destination:'/pricing'}]  
  return (
    
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
            
            <div className="flex-center gap-3 text-lg"><button className='cursor-pointer hover:text-white/70 transition-all duration-300 ease-in-out'>Login</button>
            <button className='text-black bg-white font-light py-0.5 px-2 rounded-md cursor-pointer hover:bg-white/80 transition-all duration-300 ease-in-out'>Get Started</button>
            </div>
        </nav>
    </header>
  )
}

export default NavBar