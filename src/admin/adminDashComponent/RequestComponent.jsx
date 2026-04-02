import React, { useState } from 'react'
import TableDemo from '../reusableComponents/Table'
import SlideInModal from '../reusableComponents/AddUpdateModal'
import { createCategory, getAllCategories } from '../../api/category'
import RequestedProjectsTable from '../reusableComponents/RequestedProjectsTable'
function RequestComponent() {

 

     
    
    
    
       
 
    
     
        
      return (
        <>
        
         <div className="flex flex-col min-w-full overflow-x-auto">
         <div className="flex flex-row items-center justify-between  px-10  ">
        <h1 className=' text-2xl  text-black'>Requested Projects</h1>
       
      </div>
          <div className="   px-3 lg:px-10 pt-5">
            <RequestedProjectsTable />
          </div>
        </div>
    
       
        </>
  )
}

export default RequestComponent