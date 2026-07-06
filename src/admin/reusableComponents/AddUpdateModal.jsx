// SlideInModal.jsx
import React, { useEffect, useState } from 'react';
import { X, AlertCircle,Image } from 'lucide-react';

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
  errors = ''
}) => {
  const [formData, setFormData] = useState({});
  const [initialized, setInitialized] = useState(false);

  const isGeneralError = typeof errors === 'string' && errors.length > 0;
  const fieldErrors = typeof errors === 'object' ? errors : {};

  useEffect(() => {
    if (isOpen && !initialized) {
      const initialFormData = {};
      fields.forEach(field => {
        initialFormData[field.name] = initialData[field.name] || (field.type === 'image' ? null : '');
      });
      setFormData(initialFormData);
      setInitialized(true);
    }
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
        data-testid="modal"
      />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 animate-slide-in">
        <div className="h-full bg-white shadow-2xl flex flex-col">
          {/* Header */}
          {/* Header */}
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {fields.map((field) => {
                  const hasFieldError = fieldErrors && fieldErrors[field.name];
                  const hasError = hasFieldError || isGeneralError;

                  return (
                    <div key={field.name}>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {/* ─── IMAGE FIELD ─── */}
                      {field.type === 'image' ? (
                        <ImageUploader
                          value={formData[field.name]}
                          onChange={(val) => handleChange(field.name, val)}
                          disabled={isLoading}
                          hasError={hasError}
                        />
                      ) : field.type === 'textarea' ? (
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
                            <option key={option.value} value={option.value}>{option.label}</option>
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

                      {/* Field error */}
                      {hasFieldError && (
                        <div className="flex items-start gap-1.5 mt-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600">{fieldErrors[field.name]}</p>
                        </div>
                      )}

                      {/* General error (once, under first field only) */}
                      {!hasFieldError && isGeneralError && field === fields[0] && (
                        <div className="flex items-start gap-1.5 mt-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-600">{errors}</p>
                        </div>
                      )}

                      {/* Helper text */}
                      {!hasError && field.helperText && (
                        <p className="mt-1.5 text-xs text-gray-500">{field.helperText}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
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
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-in { animation: slide-in 0.15s ease-out; }
      `}</style>
    </>
  );
};

// ─── Reusable image uploader block ───────────────────────────────────────────

function ImageUploader({ value, onChange, disabled, hasError }) {
  const inputRef = React.useRef(null)

  const previewSrc =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === 'string' && value.length > 0
        ? value
        : null

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    onChange(file)
  }

  const remove = (e) => {
    e.stopPropagation()
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={disabled}
        className="sr-only"
      />

      {/* ─── Has preview ─── */}
      {previewSrc ? (
        <div className={`relative rounded-xl border overflow-hidden ${hasError ? 'border-red-500' : 'border-gray-200'}`}>
          <img src={previewSrc} alt="Preview" className="w-full h-48 object-cover" />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity bg-black/50">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={disabled}
              className="px-3.5 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // ─── Empty drop zone ───
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            hasError
              ? 'border-red-400 bg-red-50/40 hover:border-red-500'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          {/* Lucide Image icon inside a soft circle */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasError ? 'bg-red-100' : 'bg-white shadow-sm border border-gray-200'}`}>
            <Image className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-medium text-gray-700">Click to upload image</span>
            <span className="text-xs text-gray-400">PNG, JPG, or WEBP</span>
          </div>
        </button>
      )}
    </div>
  )
}

export default SlideInModal;