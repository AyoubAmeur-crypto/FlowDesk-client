import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './adminDashComponent/SideBar'
import WelcomeCard from '../pannelComponents/WelcomeCard'

function AdminDashboard() {
  return (
  <div className="w-full flex pt-[88px] ">
      {/* Sidebar Container - maintains layout space */}
      <div className="w-64 ml-34  lg:block hidden">
        <SideBar/>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
       
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard