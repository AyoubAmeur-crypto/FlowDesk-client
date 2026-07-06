// ServiceComponent.jsx
import React, { useState, useEffect } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiMoreFill } from '@remixicon/react';
import { Search, X } from 'lucide-react';
import ServiceSlideInModal from '../reusableComponents/SlideInServiceModal'
import {getAvialableCategoires} from '../../api/category'
import {createService,getAllServices,updateService,deleteService} from '../../api/service'
import DeleteConfirmationModal from '../reusableComponents/DeleteConfirmationModal';
import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import {getServicesQueryOption,getCategoryQueryOptionList} from '../queries/projectQuerry'

const Button = ({ onClick, disabled, children }) => {
  return (
    <button
      type="button"
      className="group px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Dropdown = ({ service, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="dropdown-container relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <RiMoreFill size={16} className="text-gray-600" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-28 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(service);
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(service);
              setIsOpen(false);
            }}
            className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-gray-50 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

function ServiceComponent() {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [formError, setFormError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deleteModal,setDeleteModal]=useState(false)
  const [pagignation,setPagignation]=useState({
    pageNumber:0,
    pageSize:8,
    sortMethod:'desc',
    sortBy:'serviceId'
  })


 





  const [{data,isPending,error,refetch},categoryResponse] = useSuspenseQueries({
    queries:[getServicesQueryOption(pagignation.pageNumber,
          pagignation.pageSize,
          pagignation.sortMethod,
          pagignation.sortBy,
          searchQuery,
          selectedCategory),getCategoryQueryOptionList()]
  })
  const queryClient = useQueryClient()

  const queryKey = [
  "services",
  {
    pageNumber: pagignation.pageNumber,
    pageSize: pagignation.pageSize,
    sortMethod: pagignation.sortMethod,
    sortBy: pagignation.sortBy,
    searchQuery: pagignation.searchQuery,
    selectedCategory,
  }
];

  const handleCreateServiceMutation = useMutation({
    mutationFn:(formData)=>createService(formData),
    onSuccess:()=>{queryClient.invalidateQueries({ queryKey: ["services"] }),setAddModalOpen(prev=>!prev)}
    
  })


    const handleUpdateMutation = useMutation({
    mutationFn:({serviceId,formData})=>updateService(serviceId, formData),
   onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })  
      setUpdateModalOpen(false)
           }    
  })


  const handleDeleteMutation = useMutation({
    mutationFn:(serviceId)=>deleteService(serviceId),
   onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })  
      setDeleteModal(false)
           }    
  })


 





  const handleEditClick = (service) => {
    setSelectedService(service)
    setFormError('')
    setUpdateModalOpen(true)
  }


    const handleDeleteService = (service) =>{

      setSelectedService(service)
      setDeleteModal(true)
    }


 

  const handleCardClick = (service) => {
    handleEditClick(service);
  }

  const handleCreateService = (formData) => {
    const duplicateService = data.services?.some(
      (service) =>
        service.serviceName.trim().toLowerCase() ===
        formData.serviceName?.trim().toLowerCase()
    );

    if (duplicateService) {
      setFormError(`Service name "${formData.serviceName}" already exists.`);
      return;
    }

    setFormError('');
    handleCreateServiceMutation.mutate(formData);
  }

  const clearSearch = () => {
    setSearchQuery('');
  }

  return (
    <>
      <div className="flex flex-col min-w-full overflow-x-auto ">
        <div className="flex flex-row items-center justify-between px-10 custom-scrollbar">
          <h1 className="text-2xl text-black">Services</h1>
          <button
            className="px-2 py-1 text-white bg-black text-sm rounded-lg hover:text-white/90 cursor-pointer"
            onClick={() => {
              setFormError('')
              setAddModalOpen(true)
            }}
          >
            Add Service
          </button>
        </div>

        {/* Search and Filter */}
        <div className="px-10 pt-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                selectedCategory === ''
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categoryResponse.data.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategory(category.categoryId)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  selectedCategory === category.categoryId
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 lg:px-10 pt-3 custom-scrollbar">
          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-md shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="w-full h-40 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data.services?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5H4.5" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No services found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.services.map((service) => (
                <div
                  key={service.serviceId}
                  onClick={() => handleCardClick(service)}
                  className="rounded-md shadow-sm border border-gray-100 overflow-hidden bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer relative"
                >
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-black text-white px-2 py-0.5 rounded-md text-xs">
                      {service.category.categoryName}
                    </span>
                  </div>

                  {/* Three Dots Menu */}
                  <div className="absolute top-2 right-2 z-10">
                    <Dropdown
                      service={service}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteService}
                    />
                  </div>

                  <div className="w-full h-40 bg-gray-100 overflow-hidden">
                    {service.serviceImage ? (
                      <img
                        src={service.serviceImage}
                        alt={service.serviceName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 text-start truncate">
                      {service.serviceName}
                    </h3>
                    <p className="text-xs text-gray-500 text-start mt-1 line-clamp-2 leading-relaxed">
                      {service.serviceDescription}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-gray-900">
                        ${Number(service.servicePrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 pb-3 px-4">
          <p className="text-sm tabular-nums text-black">
            Showing{' '}
  {data.pageNumber * data.pageSize + 1}-{Math.min((data.pageNumber + 1) * data.pageSize, data.totalElements)}
            {' '}
            of
            {' '}
            {data.totalElements}
         <span className="font-medium text-gray-900">
    {' '}
    (Page {data.pageNumber + 1} of {data.totalPage})
  </span>
          </p>
          <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
            <Button
              disabled={data.pageNumber===0}
            >
              <span className="sr-only">Previous</span>
              <RiArrowLeftSLine
                className="size-5 text-gray-700 hover:text-gray-900 cursor-pointer"
                aria-hidden={true}
                onClick={()=>{setPagignation(prev=>({...prev,pageNumber:prev.pageNumber-1}))}}
              />
            </Button>
            <span className="h-5 border-r border-gray-300" aria-hidden={true} />
            <Button
              disabled={data.lastPage}
              onClick={()=>{setPagignation(prev=>({...prev,pageNumber:prev.pageNumber+1}))}}
            >
              <span className="sr-only">Next</span>
              <RiArrowRightSLine
                className="size-5 text-gray-700 group-hover:text-gray-900 cursor-pointer"
                aria-hidden={true}
              />
            </Button>
          </div>
        </div>
      </div>

      <ServiceSlideInModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false)
          setFormError('')
        }}
        onSubmit={(formData)=>{
          handleCreateService(formData)
        }}
        isLoading={handleCreateServiceMutation.isPending}
        title="Add Service"
        submitText="Save"
        errors={formError || handleCreateServiceMutation.error?.message || ''}
        categories={categoryResponse.data}
      />

      <ServiceSlideInModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false)
          setSelectedService(null)
          setFormError('')
        }}
        onSubmit={(formData)=>{handleUpdateMutation.mutate({
         
          serviceId:selectedService.serviceId,
          formData:formData
        })}}
        isLoading={handleUpdateMutation.isPending}
        title="Update Service"
        submitText="Update"
        initialData={selectedService || {}}
        errors={handleUpdateMutation.error?.message || ''}
        categories={categoryResponse.data}
      />

      <DeleteConfirmationModal
      
      isOpen={deleteModal}
      onClose={()=>{
        setSelectedService(null)

        setDeleteModal(false)}}
      itemName={selectedService?.serviceName}
      onConfirm={()=>{handleDeleteMutation.mutate(selectedService?.serviceId)}}
      isLoading={handleDeleteMutation.isPending}
      
      cancelText='cancel'
      confirmText='Delete'
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone and will remove all associated services."

      />
    </>
  )
}

export default ServiceComponent
