import React from 'react'
import { AlertCircle, X } from 'lucide-react'

const UnsavedChangesModal = ({ isOpen, onClose, onDiscard, onSaveAndClose }) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 pointer-events-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Unsaved Changes
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            You have unsaved changes to this project. What would you like to do?
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onSaveAndClose}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all duration-200 hover:shadow-lg active:scale-95"
            >
              Save and Close
            </button>
            <button
              onClick={onDiscard}
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
            >
              Discard Changes
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 bg-transparent rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Continue Editing
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default UnsavedChangesModal
