import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Avatar from 'react-avatar';
import useAuthStore from '../globalState/zustand';
import logo from '../assets/logob.svg'
import bell from '../assets/Bell.svg'
import { Link, useLocation } from 'react-router-dom';


function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

     const location = useLocation();

    const isActive = (path) => path === location.pathname


    const userData = useAuthStore((state)=>state.userData)

    return (
        <div className="w-screen flex justify-center border-b border-gray-300/40">
            <div className="w-full max-w-[1362px] flex-between px-6 lg:px-30">
                {/* Left section */}
                <div className="flex-between gap-[34px] p-[29px]">
                    <img src={logo} className='w-[110px] h-[30px]' alt="Logo" />
                    
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex gap-[34px]">
                        <Link to='/admin/dashboard' className={`cursor-pointer pb-[33px] -mb-[31px] border-b-2 transition-colors ${isActive('/admin/dashboard') ? 'border-black/70 text-black/70' : 'border-transparent hover:text-black/70 hover:border-black/70'}`}>
                            Dashboard
                        </Link>
                        <Link to='/admin/marketplace' className={`cursor-pointer pb-[33px] -mb-[31px] border-b-2 transition-colors ${isActive('/admin/marketplace') ? 'border-black/70 text-black/70' : 'border-transparent hover:text-black/70 hover:border-black/70'}`}>
                            Marketplace
                        </Link>
                        <Link to='/admin/blog' className={`cursor-pointer pb-[33px] -mb-[31px] border-b-2 transition-colors ${isActive('/admin/blog') ? 'border-black/70 text-black/70' : 'border-transparent hover:text-black/70 hover:border-black/70'}`}>
                            Blog
                        </Link>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex-between gap-[15px]">
                    {/* Desktop Right Menu */}
                    <div className="hidden md:flex items-center gap-[15px]">
                        <button className='p-1.75 rounded-lg cursor-pointer hover:bg-gray-300/40 transition-colors'>
                            <img src={bell} className='h-[24px]' alt="Notifications" />
                        </button>
                        <Avatar 
                            size="35" 
                            name={userData?.firstName + ' ' + userData?.lastName} 
                            round={true}
                        />   
                        <button className='flex-between gap-1 cursor-pointer hover:text-gray-400/80 transition-colors'>
                            Account <ChevronDown size={16} />
                        </button>     
                    </div>

                    {/* Mobile: Avatar + Burger */}
                    <div className="flex md:hidden items-center gap-3">
                        <Avatar 
                            size="35" 
                            name={userData?.firstName + ' ' + userData?.lastName} 
                            round={true}
                        />
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className='p-2 hover:bg-gray-300/40 rounded-lg transition-colors'
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-[88px] left-0 w-full bg-white border-b border-gray-300/40 md:hidden shadow-sm">
                    <div className="flex flex-col p-6 gap-4">
                        <Link onClick={()=>{setIsMenuOpen(false)}} to='/admin/dashboard' className='text-left py-2 hover:text-black/70 transition-colors'>
                            Dashboard
                        </Link>
                        <Link onClick={()=>{setIsMenuOpen(false)}} to='/admin/marketplace' className='text-left py-2 hover:text-black/70 transition-colors'>
                            Marketplace
                        </Link>
                        <Link onClick={()=>{setIsMenuOpen(false)}} to='/admin/blog' className='text-left py-2 hover:text-black/70 transition-colors'>
                            Blog
                        </Link>
                        
                        <div className="border-t border-gray-300/40 pt-4 mt-2">
                            <button className='flex items-center gap-2 py-2 hover:text-black/70 transition-colors'>
                                <img src={bell} className='h-[20px]' alt="Notifications" />
                                Notifications
                            </button>
                            <button className='flex items-center gap-2 py-2 hover:text-black/70 transition-colors'>
                                Account <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;