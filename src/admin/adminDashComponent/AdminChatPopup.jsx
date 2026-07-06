import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smile, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

import logow from '../../assets/logow.svg';
import logob from '../../assets/logob.svg';

const DUMMY_CONTACTS = [
  { id: 'bot', name: "Flowdesk Assistant", role: "Support", avatar: "bot", status: "online", isBot: true },
  { id: 1, name: "Alice Freelancer", role: "Freelancer", avatar: "AF", status: "online" },
  { id: 2, name: "Bob Client", role: "Client", avatar: "BC", status: "offline" },
  { id: 3, name: "Charlie Dev", role: "Freelancer", avatar: "CD", status: "online" },
  { id: 4, name: "Diana Manager", role: "Client", avatar: "DM", status: "online" },
];

export default function AdminChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Dummy messages state
  const [messages, setMessages] = useState([
    { chatId: 'bot', sender: 'them', text: 'Hello! I am the Flowdesk automated assistant. How can I help you today?' },
    { chatId: 1, sender: 'them', text: 'Hi! Any updates on the project?' },
    { chatId: 2, sender: 'me', text: 'I just sent the invoice.' },
    { chatId: 3, sender: 'them', text: 'Can we schedule a call?' },
  ]);

  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveChat(null);
      setShowEmojiPicker(false);
    }
  };

  const currentMessages = messages.filter(m => m.chatId === activeChat?.id);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;
    
    setMessages([...messages, { chatId: activeChat.id, sender: 'me', text: messageInput }]);
    setMessageInput('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageInput(prev => prev + emojiObject.emoji);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-[4.5rem] bg-white w-[95vw] sm:w-[500px] shadow-2xl rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: 'min(550px, 75vh)' }}
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                {activeChat ? (
                  <>
                    <button 
                      onClick={() => setActiveChat(null)} 
                      className="hover:bg-gray-700 p-1.5 rounded-full transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeChat.isBot ? 'bg-white' : 'bg-gray-100 text-black'}`}>
                         {activeChat.isBot ? <img src={logob} className="w-5 h-5 object-contain" alt="bot" /> : activeChat.avatar}
                       </div>
                       <div>
                         <h3 className="font-semibold text-sm leading-tight">{activeChat.name}</h3>
                         <p className="text-[10px] text-gray-300 capitalize">{activeChat.status}</p>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 ml-2">
                    <img src={logow} alt="Flowdesk" className="h-[22px]" />
                    <span className="font-medium text-xs text-gray-400">| Support</span>
                  </div>
                )}
              </div>
              <button 
                onClick={togglePopup} 
                className="hover:bg-gray-700 p-1.5 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
              {!activeChat ? (
                // Contact List
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {DUMMY_CONTACTS.map((contact) => (
                    <div 
                      key={contact.id} 
                      onClick={() => setActiveChat(contact)}
                      className="p-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors bg-white"
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${contact.isBot ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
                          {contact.isBot ? <img src={logow} className="w-7 h-7 object-contain" alt="bot" /> : contact.avatar}
                        </div>
                        {contact.status === 'online' && (
                           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                           <p className="font-semibold text-gray-800">{contact.name}</p>
                        </div>
                        <p className={`text-xs font-medium ${contact.isBot ? 'text-gray-500' : 'text-gray-400'}`}>{contact.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Chat Room
                <>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                    {currentMessages.length === 0 ? (
                      <div className="mx-auto my-auto text-gray-400 text-sm text-center">
                        <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                        No messages yet.<br/>Start the conversation!
                      </div>
                    ) : (
                      currentMessages.map((m, i) => (
                        <div 
                          key={i} 
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            m.sender === 'me' 
                              ? 'bg-black text-white self-end rounded-tr-none shadow-md' 
                              : 'bg-white text-gray-800 self-start rounded-tl-none shadow-sm border border-gray-200'
                          }`}
                        >
                          {m.text}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-3 bg-white border-t border-gray-200">
                    {/* Emoji Picker Popup */}
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-[4.5rem] left-2 right-2 z-[100] shadow-[0_0_40px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden border border-gray-200 bg-white"
                          ref={emojiPickerRef}
                        >
                          <EmojiPicker 
                            onEmojiClick={handleEmojiClick}
                            width="100%"
                            height={350}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 px-3 py-2 pr-1.5 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Smile size={20} />
                      </button>
                      <input 
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm px-1 py-1"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="bg-black hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-md"
                      >
                        <Send size={16} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePopup}
        className="w-[60px] h-[60px] bg-black rounded-full flex items-center justify-center text-white shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all relative z-50 border-2 border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
