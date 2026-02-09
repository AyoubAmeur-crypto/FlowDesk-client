// ServiceSlideInModal.jsx
import React, { useEffect, useState } from 'react';
import { X, AlertCircle, Image, Search } from 'lucide-react';

const ServiceSlideInModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Add Service",
  initialData = {},
  submitText = "Save",
  cancelText = "Cancel",
  isLoading = false,
  errors = '',
  categories = []
}) => {
  const [formData, setFormData] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const isGeneralError = typeof errors === 'string' && errors.length > 0;
  const fieldErrors = typeof errors === 'object' ? errors : {};

  const filteredCategories = categories.filter(cat =>
    cat.categoryName.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && !initialized) {
      setFormData({
        serviceName: initialData.serviceName || '',
        serviceDescription: initialData.serviceDescription || '',
        servicePrice: initialData.servicePrice || '',
        categoryId: initialData.category?.categoryId || '',
        serviceImage: initialData.serviceImage || null
      });
      if (initialData.categoryId) {
        const selectedCat = categories.find(c => c.id === initialData.categoryId);
        if (selectedCat) setCategorySearch(selectedCat.name);
      }
      if (initialData.category?.categoryName) {
        setCategorySearch(initialData.category.categoryName);
      }
      setInitialized(true);
    }
    if (!isOpen) {
      setInitialized(false);
      setCategorySearch('');
      setShowCategoryDropdown(false);
    }
  }, [isOpen, initialData, categories, initialized]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    handleChange('categoryId', category.categoryId);
    setCategorySearch(category.categoryName);
    setShowCategoryDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const hasError = (fieldName) => {
    return (fieldErrors && fieldErrors[fieldName]) || isGeneralError;
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 animate-slide-in custom-scrollbar">
        <div className="h-full bg-white shadow-2xl flex flex-col">
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

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden ">
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="space-y-2">
                
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Service Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    name="serviceName"
                    value={formData.serviceName || ''}
                    onChange={(e) => handleChange('serviceName', e.target.value)}
                    placeholder="Enter service name"
                    required
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasError('serviceName')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900 focus:border-transparent'
                    }`}
                  />
                  {fieldErrors.serviceName && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{fieldErrors.serviceName}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className={`relative flex items-center border rounded-lg ${
                      hasError('categoryId')
                        ? 'border-red-500'
                        : 'border-gray-300 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent'
                    }`}>
                      <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="category"
                      
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        placeholder="Search categories..."
                        disabled={isLoading || submitText==='Update'}
                        className="w-full pl-10 pr-3 py-2 outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed bg-transparent rounded-lg"
                      />
                    </div>

                    {showCategoryDropdown && filteredCategories.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredCategories.map((category) => (
                          <button
                            key={category.categoryId}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {category.categoryName}
                          </button>
                        ))}
                      </div>
                    )}

                    {showCategoryDropdown && categorySearch && filteredCategories.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-center">
                        <p className="text-sm text-gray-500">No categories found</p>
                      </div>
                    )}
                  </div>
                  {fieldErrors.categoryId && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{fieldErrors.categoryId}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="serviceDescription"
                    name="serviceDescription"
                    value={formData.serviceDescription || ''}
                    onChange={(e) => handleChange('serviceDescription', e.target.value)}
                    placeholder="Enter service description"
                    required
                    disabled={isLoading}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasError('serviceDescription')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900 focus:border-transparent'
                    }`}
                  />
                  {fieldErrors.serviceDescription && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{fieldErrors.serviceDescription}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="servicePrice" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price ($)
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="servicePrice"
                    name="servicePrice"
                    value={formData.servicePrice || ''}
                    onChange={(e) => handleChange('servicePrice', e.target.value)}
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      hasError('servicePrice')
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-gray-900 focus:border-transparent'
                    }`}
                  />
                  {fieldErrors.servicePrice && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{fieldErrors.servicePrice}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Service Image
                  </label>
                  <ImageUploader
                    value={formData.serviceImage}
                    onChange={(val) => handleChange('serviceImage', val)}
                    disabled={isLoading}
                    hasError={hasError('serviceImage')}
                  />
                  {fieldErrors.serviceImage && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-600">{fieldErrors.serviceImage}</p>
                    </div>
                  )}
                </div>

                {isGeneralError && (
                  <div className="flex items-start gap-1.5 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600">{errors}</p>
                  </div>
                )}
              </div>
            </div>

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
                  disabled={isLoading || categories.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? 'Saving...' : submitText}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      
    </>
  );
};

function ImageUploader({ value, onChange, disabled, hasError }) {
  const inputRef = React.useRef(null);

  const previewSrc =
    value instanceof File
      ? URL.createObjectURL(value)
      : typeof value === 'string' && value.length > 0
        ? value
        : null;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onChange(file);
  };

  const remove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

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

      {previewSrc ? (
        <div className={`relative rounded-lg border overflow-hidden ${hasError ? 'border-red-500' : 'border-gray-200'}`}>
          <img src={previewSrc} alt="Preview" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity bg-black/50">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-gray-900 rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={disabled}
              className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded-md  disabled:opacity-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className={`w-full h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            hasError
              ? 'border-red-400 bg-red-50/40 hover:border-red-500'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasError ? 'bg-red-100' : 'bg-white shadow-sm border border-gray-200'}`}>
            <Image className={`w-4 h-4 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-700">Click to upload</span>
            <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
          </div>
        </button>
      )}
       
    </div>

    
  );
}

export default ServiceSlideInModal;