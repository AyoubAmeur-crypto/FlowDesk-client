import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './adminDashComponent/SideBar'
import WelcomeCard from '../pannelComponents/WelcomeCard'

function AdminDashboard() {
  return (

    <>
    <div className="w-full flex pt-[88px] ">
      {/* Sidebar Container - maintains layout space */}
      <div className="w-64 ml-34  lg:block hidden">
        <SideBar/>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto  custom-scrollbar">
       
        <Outlet/>
      </div>
    </div>

       <style jsx>{`
              @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
              .animate-fade-in { animation: fade-in 0.2s ease-out; }
              .animate-slide-in { animation: slide-in 0.15s ease-out; }
              
              /* Scrollbar styling */
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #d1d5db #f3f4f6;
              }
              
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f3f4f6;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 3px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
              }
            `}</style>
    </>
  
  )
}

export default AdminDashboard