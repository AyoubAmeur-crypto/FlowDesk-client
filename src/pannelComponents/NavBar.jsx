import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Avatar from 'react-avatar';
import useAuthStore from '../globalState/zustand';
import logo from '../assets/logob.svg'
import bell from '../assets/Bell.svg'
import { Link, useLocation } from 'react-router-dom';
import {Clipboard,FileDiff,Users,BriefcaseBusiness,FolderDot,Settings,DollarSign,FolderGit2} from 'lucide-react'
import {   DropdownMenuItems } from './DropMenu';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuTrigger } from './DropMenuUtils';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [drawer,setDrawer]=useState(false)
    const location = useLocation();

    const isActive = (path) => path === location.pathname

    const userData = useAuthStore((state)=>state.userData)

    // Dashboard menu items
    const dashboardItems = [
        {
            name:'categories',
            icon:<Clipboard size={16} />,
            pathurl:'/admin/dashboard/categories'
        },
        {
            name:'services',
            icon:<FileDiff  size={16}/>,
            pathurl:'/admin/dashboard/services'
        },
        {
            name:'users',
            icon:<Users  size={16}/>,
            pathurl:'/admin/dashboard/users'
        },
        {
            name:'freelancers',
            icon:<BriefcaseBusiness  size={16}/>,
            pathurl:'/admin/dashboard/freelancers'
        },
        {
            name:'projects',
            icon:<FolderDot  size={16}/>,
            pathurl:'/admin/dashboard/projects'
        },
        {
            name:'settings',
            icon:<Settings  size={16}/>,
            pathurl:'/admin/dashboard/settings'
        },
        {
            name:'earnings',
            icon:<DollarSign  size={16}/>,
            pathurl:'/admin/dashboard/earnings'
        },
        {
            name:'requests',
            icon:<FolderGit2   size={16}/>,
            pathurl:'/admin/dashboard/requests'
        }
    ]

    // Check if current page is dashboard-related
    const isDashboardPage = location.pathname.startsWith('/admin/dashboard')

    // Auto-open dashboard section if on dashboard page
    useEffect(() => {
        if (isDashboardPage && isMenuOpen) {
            setIsDashboardOpen(true)
        }
    }, [isDashboardPage, isMenuOpen])

    return (
        <div className="w-screen fixed top-0 left-0 z-50 flex justify-center border-b border-gray-300/40 bg-white backdrop-blur-sm">
            <div className="w-full max-w-[1362px] flex-between px-6 lg:px-30">
                {/* Left section */}
                <div className="flex-between gap-[34px] p-[29px]">
                    <img src={logo} className='w-[110px] h-[30px]' alt="Logo" />
                    
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex gap-[34px]">
                        <Link to='/admin/dashboard/categories' className={`cursor-pointer pb-[33px] -mb-[31px] border-b-2 transition-colors ${isDashboardPage ? 'border-black/70 text-black/70' : 'border-transparent hover:text-black/70 hover:border-black/70'}`}>
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
                          <DropdownMenu>
                                <DropdownMenuTrigger>
                                     <button  className='flex items-center gap-2 py-2 hover:text-black/70 transition-colors w-full text-left'>
                                Account <ChevronDown size={16} />
                            </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuItems/>
                            </DropdownMenu>
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
                <div className="absolute top-[88px] left-0 w-full bg-white border-b border-gray-300/40 md:hidden shadow-sm max-h-[calc(100vh-88px)] overflow-y-auto">
                    <div className="flex flex-col p-6 gap-4">
                        {/* Dashboard with collapsible submenu */}
                        <div>
                            <button 
                                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                                className={`flex items-center justify-between w-full text-left py-2 transition-colors ${isDashboardPage ? 'text-black/70 font-medium' : 'hover:text-black/70'}`}
                            >
                                <span>Dashboard</span>
                                {isDashboardOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            {/* Dashboard Sub-menu - Collapsible */}
                            <div className={`overflow-hidden transition-all duration-300 ${isDashboardOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pl-4 border-l-2 border-gray-200 flex flex-col gap-2 mt-2">
                                    {dashboardItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            onClick={() => setIsMenuOpen(false)}
                                            to={item.pathurl}
                                            className={`flex items-center gap-2 py-2 text-sm transition-colors ${
                                                location.pathname === item.pathurl 
                                                ? 'text-black font-medium bg-gray-100 px-3 rounded' 
                                                : 'text-gray-600 hover:text-black/70 px-3'
                                            }`}
                                        >
                                            {item.icon}
                                            <span className="capitalize">{item.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <Link 
                            onClick={()=>{setIsMenuOpen(false)}} 
                            to='/admin/marketplace' 
                            className={`text-left py-2 transition-colors ${isActive('/admin/marketplace') ? 'text-black/70 font-medium' : 'hover:text-black/70'}`}
                        >
                            Marketplace
                        </Link>
                        <Link 
                            onClick={()=>{setIsMenuOpen(false)}} 
                            to='/admin/blog' 
                            className={`text-left py-2 transition-colors ${isActive('/admin/blog') ? 'text-black/70 font-medium' : 'hover:text-black/70'}`}
                        >
                            Blog
                        </Link>
                        
                        <div className="border-t border-gray-300/40 pt-4 mt-2">
                            <button className='flex items-center gap-2 py-2 hover:text-black/70 transition-colors w-full text-left'>
                                <img src={bell} className='h-[20px]' alt="Notifications" />
                                Notifications
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                     <button  className='flex items-center gap-2 py-2 hover:text-black/70 transition-colors w-full text-left'>
                                Account <ChevronDown size={16} />
                            </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuItems/>
                            </DropdownMenu>
                           
                        </div>
                    </div>
                </div>
            )}

          
        </div>
    );
}

export default Navbar;