import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const InfoCard = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const variants = {
    success: {
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-200',
      iconColor: 'text-green-400',
      closeColor: 'text-green-300 hover:text-white',
      Icon: CheckCircle
    },
    error: {
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-400/30',
      textColor: 'text-red-100',
      iconColor: 'text-red-400',
      closeColor: 'text-red-300 hover:text-white',
      Icon: AlertCircle
    },
    info: {
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-400',
      closeColor: 'text-blue-300 hover:text-white',
      Icon: Info
    },
    neutral: {
      bgColor: 'bg-white/5',
      borderColor: 'border-white/20',
      textColor: 'text-white/90',
      iconColor: 'text-white/60',
      closeColor: 'text-white/60 hover:text-white',
      Icon: Info
    }
  };

  const config = variants[type] || variants.neutral;
  const IconComponent = config.Icon;

  return (
    <div className={`flex items-start gap-3 rounded-lg ${config.bgColor} border ${config.borderColor} p-4 backdrop-blur-md transition-all duration-300`}>
      <IconComponent className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${config.textColor}`}>
          {message}
        </p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.closeColor} transition-colors`}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default InfoCard;