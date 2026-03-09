import React, { useState } from 'react'
import TableDemo from '../reusableComponents/Table'
import SlideInModal from '../reusableComponents/AddUpdateModal'
import { createCategory, getAllCategories } from '../../api/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CategoryCompnent() {


  const [addCategoryLoading,setAddCategoryLoading]=useState(false)
  const [refreshTriger,setRefreshTrigger]=useState(0)
  const [page,setPage]=useState(0)
  const [addCategoryError,setAddCategoryError]=useState('')


  const createCategoryClient = async (categoryDto)=>{


    setAddCategoryLoading(true)
    try {

      const serverRes = await createCategory(categoryDto)

      if(serverRes.status){

        setRefreshTrigger(prev=>prev+1)
        setAddCategory(false)
        setAddCategoryError('')  // Clear error on success

      }else{
        setAddCategoryError(serverRes.error)
        
      }
      
    } catch (error) {
      console.log("can't create category duee to this",error);
      
    }finally{

      setAddCategoryLoading(false)

    }
  }
  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
  mutationFn:({formData})=>createCategory(formData),
  onSuccess:()=>{queryClient.invalidateQueries(["categories",page]),setAddCategory(prev=>!prev)}
})
    const categoryFields = [
    {
      name: 'categoryName',
      label: 'Category Name',
      type: 'text',
      placeholder: 'Enter category name',
      required: true,
      helperText: 'Choose a unique name for your category'
    } ]

      const [addCategory,setAddCategory]=useState(false)
    
  return (
    <>
    
     <div className="flex flex-col min-w-full overflow-x-auto">
      <div className="flex flex-row items-center justify-between  px-10 pt-10 ">
        <h1 className=' text-2xl  text-black'>Categories</h1>
        <button className='px-2 py-1 text-white bg-black text-sm rounded-lg hover:text-white/90 cursor-pointer'
         onClick={()=>{setAddCategory(true)}}
        >Add Category</button>
      </div>
      <div className="   px-3 lg:px-10 pt-5">
        <TableDemo />
      </div>
    </div>

     <SlideInModal
      isOpen={addCategory}
      onClose={()=>{setAddCategory(false)}}
      onSubmit={(formData)=>{

        addCategoryMutation.mutate({
          formData:formData
        })
      }}
      isLoading={addCategoryMutation.isPending}
      fields={categoryFields}
      title='Add Category'
      errors={addCategoryMutation.error?.message}

      
      />
    </>
   
  )
}

export default CategoryCompnent