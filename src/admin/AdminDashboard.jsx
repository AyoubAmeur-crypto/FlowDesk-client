import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './adminDashComponent/SideBar'
import ChatComponent from '../chatSection/ChatComponent' // adjust path as needed

function AdminDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Replace with real target user from your app (e.g. selected patient/user)
  const otherUser = {
    id: "support-1",
    name: "Support",
    email: "support@example.com",
    role: "default"
  }

  return (
    <>
      <div className="w-full flex pt-[88px]">
        
        {/* Sidebar */}
        <div className="w-64 ml-34 lg:block hidden flex-shrink-0">
          <SideBar />
        </div>

        {/* Main Content — shrinks when chat opens */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300`}>
          <Outlet context={{ openChat: () => setIsChatOpen(true) }} />
        </div>

        {/* Chat Panel — slides in from the right */}
        <div className={`
          transition-all duration-300 overflow-hidden flex-shrink-0
          ${isChatOpen ? 'w-[420px] border-l border-gray-200' : 'w-0'}
        `}>
          {isChatOpen && (
            <div className="flex flex-col h-full">
              {/* Chat header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white sticky top-0">
                <span className="font-medium text-gray-700">💬 Chat</span>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatComponent otherUser={otherUser} />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Floating chat toggle button */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center text-2xl
          transition-all duration-200
          ${isChatOpen
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
      >
        {isChatOpen ? '×' : '💬'}
      </button>

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