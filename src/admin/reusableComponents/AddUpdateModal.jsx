// SlideInModal.jsx
import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const SlideInModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Add Item",
  initialData = {},
  fields = [],
  submitText = "Save",
  cancelText = "Cancel",
  isLoading = false,
  errors = '' // Can be a string or object with field-level errors
}) => {
  const [formData, setFormData] = useState({});
  const [initialized, setInitialized] = useState(false);

  // Determine if errors is a string (general error) or object (field-specific errors)
  const isGeneralError = typeof errors === 'string' && errors.length > 0;
  const fieldErrors = typeof errors === 'object' ? errors : {};

  useEffect(() => {
    if (isOpen && !initialized) {
      // Initialize form data with initial values or empty strings
      const initialFormData = {};
      fields.forEach(field => {
        initialFormData[field.name] = initialData[field.name] || '';
      });
      setFormData(initialFormData);
      setInitialized(true);
    }
    
    // Reset when modal closes
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen]); 

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Slide-in Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 animate-slide-in">
        <div className="h-full bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* General Error Message (displayed at the top if error is a string) */}
              

              <div className="space-y-6">
                {fields.map((field) => {
                  const hasFieldError = fieldErrors && fieldErrors[field.name];
                  // Show error styling if there's either a field-specific error OR a general error
                  const hasError = hasFieldError || isGeneralError;
                  
                  return (
                    <div key={field.name}>
                      <label 
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={isLoading}
                          rows={field.rows || 4}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            hasError 
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-gray-900 focus:border-transparent'
                          }`}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          required={field.required}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            hasError 
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-gray-900 focus:border-transparent'
                          }`}
                        >
                          <option value="">{field.placeholder || 'Select an option'}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={isLoading}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            hasError 
                              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-gray-900 focus:border-transparent'
                          }`}
                        />
                      )}
                      
                      {/* Field-Specific Error Message */}
                      {hasFieldError && (
                        <div className="flex items-start gap-1.5 mt-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600">
                            {fieldErrors[field.name]}
                          </p>
                        </div>
                      )}
                      
                      {/* General Error Message (shown below the field) */}
                      {!hasFieldError && isGeneralError && (
                        <div className="flex items-start gap-1.5 mt-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600">
                            {errors}
                          </p>
                        </div>
                      )}
                      
                      {/* Helper Text (only show if no error) */}
                      {!hasError && field.helperText && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          {field.helperText}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer with Actions */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? 'Saving...' : submitText}
                </button>
              </div>
            </div>
          </form>
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

        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.15s ease-out;
        }
      `}</style>
    </>
  );
};

export default SlideInModal;