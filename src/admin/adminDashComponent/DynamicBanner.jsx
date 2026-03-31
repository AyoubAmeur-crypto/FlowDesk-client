import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, ArrowRight, Megaphone, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import logow from '../../assets/logow.svg';
import logob from '../../assets/logob.svg';

export default function DynamicBanner({ 
  tips = null,
  type = 'info', 
  title, 
  message, 
  actionLabel, 
  actionPath = '#',
  onClose,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!tips || tips.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 7000); // cycle every 7 seconds
    return () => clearInterval(interval);
  }, [tips]);

  const handleClose = () => {
    setIsVisible(false);
    if(onClose) onClose();
  };

  const activeData = tips ? tips[currentIndex] : { type, title, message, actionLabel, actionPath };

  const config = {
    tip: {
      bg: 'bg-black text-white',
      border: 'border border-gray-800 shadow-lg',
      icon: null,
      btn: 'bg-white text-black hover:bg-gray-200',
      closeBtn: 'text-gray-500 hover:text-white hover:bg-gray-800'
    },
    promo: {
      bg: 'bg-black text-white',
      border: 'border border-gray-800',
      icon: <Megaphone className="text-gray-300" size={24} />,
      btn: 'bg-white text-black hover:bg-gray-200',
      closeBtn: 'text-gray-400 hover:text-white hover:bg-gray-800'
    },
    warning: {
      bg: 'bg-white text-black',
      border: 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      icon: <AlertTriangle className="text-black" size={24} />,
      btn: 'bg-black text-white hover:bg-gray-800',
      closeBtn: 'text-gray-500 hover:text-black hover:bg-gray-100'
    },
    success: {
      bg: 'bg-white text-gray-900',
      border: 'border border-gray-200 shadow-sm',
      icon: <CheckCircle2 className="text-black" size={24} />,
      btn: 'bg-black text-white hover:bg-gray-800',
      closeBtn: 'text-gray-400 hover:text-black hover:bg-gray-100'
    },
    info: {
      bg: 'bg-gray-50 text-gray-900',
      border: 'border-l-4 border-black shadow-sm',
      icon: <Lightbulb className="text-black" size={24} />,
      btn: 'bg-black text-white hover:bg-gray-800',
      closeBtn: 'text-gray-400 hover:text-black hover:bg-gray-200'
    }
  };

  const currentConfig = config[activeData.type] || config.info;
  const isTipCard = activeData.type === 'tip';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`relative mb-4 rounded-xl flex items-start sm:items-center justify-between py-3 px-4 sm:px-5 sm:py-3.5 gap-3 transition-colors duration-500 ${currentConfig.bg} ${currentConfig.border} ${className} overflow-hidden`}
        >
          {/* Branded watermark background for tips */}
          {isTipCard && (
             <img 
               src={logow} 
               alt="" 
               className="absolute -right-20 sm:-right-20 top-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] max-w-none opacity-[0.04] pointer-events-none select-none" 
             />
          )}

          <div className="flex-1 overflow-visible relative z-10 px-2 sm:px-4 py-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full"
              >
                {/* Icon Engine */}
                <div className="shrink-0 mt-1 sm:mt-0">
                   {!isTipCard && currentConfig.icon}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1 w-full relative z-10">
                  <div className="flex flex-col flex-1">
                    <h4 className={`font-bold leading-tight flex items-center gap-2 ${isTipCard ? 'text-[10px] sm:text-xs tracking-widest uppercase text-gray-400 mb-0.5' : 'text-sm'}`}>
                       {isTipCard && (
                         <img src={logow} alt="Flowdesk" className="h-[12px] sm:h-[14px] object-contain mr-1 opacity-90" />
                       )}
                       <span>{activeData.title}</span>
                       
                       {tips && isTipCard && (
                         <span className="ml-2 text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
                           {currentIndex + 1}/{tips.length}
                         </span>
                       )}
                    </h4>
                    <p className={`mt-0.5 sm:mt-0 leading-relaxed ${isTipCard ? 'text-xs sm:text-sm font-medium text-white/95' : currentConfig.type === 'promo' ? 'text-gray-300 text-xs sm:text-sm' : 'text-gray-600 text-xs sm:text-sm'}`}>
                      {activeData.message}
                    </p>
                  </div>

                  {activeData.actionLabel && (
                    <div className="mt-2 sm:mt-0 sm:ml-auto shrink-0 relative z-20">
                      <Link to={activeData.actionPath} className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold transition-all duration-300 ${currentConfig.btn}`}>
                        {activeData.actionLabel}
                        <ArrowRight size={14} className={isTipCard ? "transition-transform group-hover:translate-x-1" : ""} />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleClose}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${currentConfig.closeBtn} relative z-20 self-start sm:self-start opacity-70 hover:opacity-100 backdrop-blur-sm`}
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
