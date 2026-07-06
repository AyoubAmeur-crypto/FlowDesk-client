import React from 'react'
import worksapce from '../../assets/workspace.svg'
import useAuthStore from '../../globalState/zustand'
import {Clipboard,FileDiff,Users,BriefcaseBusiness,FolderDot,Settings,DollarSign,FolderGit2} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

function SideBar() {
    const userData = useAuthStore((state)=>state.userData)
    const navigate = useNavigate()
    const location = useLocation()

    const data = [
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

    return (
        <div className="hidden lg:block fixed  left-30 h-screen w-64 bg-white z-30">
            <div className="px-[13px] py-[27px] flex flex-col items-start gap-[18px]">
                <div className="flex flex-row items-center gap-[6px] text-black">
                    <img src={worksapce} className='w-10' alt="" />
                    <h1 className="text-sm md:text-base font-medium">
                        {userData?.firstName?.charAt(0).toUpperCase() + userData?.firstName?.slice(1)}'s Workspace
                    </h1>
                </div>
                <div className="flex flex-col gap-1 items-start w-full">
                    {data.map((item, index)=>(
                        <button 
                            key={index} 
                            onClick={() => navigate(item.pathurl)}
                            className={`flex flex-row items-center gap-[5px] px-3 py-2 rounded transition-colors w-full text-left ${
                                location.pathname === item.pathurl 
                                ? 'bg-gray-200 text-black font-medium' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700 cursor-pointer'
                            }`}
                        >
                            {item.icon}
                            <h3 className="capitalize text-sm">{item.name}</h3>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SideBar