import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './adminDashComponent/SideBar'
import ChatComponent from '../chatSection/ChatComponent' // adjust path as needed
import AdminChatPopup from './adminDashComponent/AdminChatPopup'
import DynamicBanner from './adminDashComponent/DynamicBanner'

function AdminDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)



  const FLOWDESK_TIPS = [
    {
      type: "tip",
      title: "MONITOR / REVENUE",
      message: "Check the Earnings tab regularly to track platform commissions and payout pending freelancer balances.",
      actionLabel: "View Earnings",
      actionPath: "/admin/dashboard/earnings"
    },
    {
      type: "tip",
      title: "ACTION / NEW TALENT",
      message: "Swiftly review pending freelancer applications in the Freelancers tab to keep the talent pool growing.",
      actionLabel: "Manage Freelancers",
      actionPath: "/admin/dashboard/freelancers"
    },
    {
      type: "tip",
      title: "ACTION / DISPUTES",
      message: "Open requests and active disputes can stall projects. Check the Requests tab to moderate and resolve issues.",
      actionLabel: "View Requests",
      actionPath: "/admin/dashboard/requests"
    },
    {
      type: "tip",
      title: "AUDIT / CATEGORIES",
      message: "Ensure sellers are listing their services in the correct categories to help clients find them faster.",
      actionLabel: "Review Categories",
      actionPath: "/admin/dashboard/categories"
    }
  ];

  return (
    <>
      <div className="w-full flex pt-[76px]">
        
        <div className="w-64 ml-34 lg:block hidden flex-shrink-0">
          <SideBar />
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 relative`}>
          <div className="px-6 pt-6 pb-0 w-full">
            <DynamicBanner tips={FLOWDESK_TIPS} />
          </div>
          <Outlet context={{ openChat: () => setIsChatOpen(true) }} />
        </div>

        <AdminChatPopup />
      </div>


      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-in { animation: slide-in 0.15s ease-out; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #d1d5db #f3f4f6; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f3f4f6; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </>
  )
}

export default AdminDashboard