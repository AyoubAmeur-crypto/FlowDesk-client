import React, { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {getDataResponse} from '../../api/projects'

import { clsx } from 'clsx';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '../reusableComponents/ComponenetTable';
import { deleteCategory, getAllCategories, updateCategory } from '../../api/category';
import { Loader } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SlideInModal from './AddUpdateModal';


const workspacesColumns = [
  {
    header: 'Name',
    accessorKey: 'projectName',
    meta: {
      align: 'text-left',
    },
  },
  {
    header: 'Services',
    accessorKey: 'services.length',
    meta: {
      align: 'text-left',
    },
  },
  {
    header: 'Last edited',
    accessorKey: 'lastEdited',
    meta: {
      align: 'text-right',
    },
  },
];

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

function RequestTable() {
  
   const pageSize = 6;

  const [sure,setSure]=useState(false)
  const [loadingUpdate,setLoadingUpdate]=useState(false)
  const [laodingDelete,setLoadingDelete]=useState(false)
  const [deletedCategory,setDeletedCategory]=useState({
    
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

  const [updatedCategory,setUpdatedCategory]=useState({
   
  })

  const [updateModal,setUpdatedModal]=useState(false)
  const [updateError,setUpdateError]=useState('')


  const [categoryPage, setCategoryPage] = useState({
    allCategories: [],
    pageNumber: 0,
    pageSize: pageSize,
    totalPage: 0,
    totalElements: 0,
    lastPage: true
  });

  const [page, setPage] = useState(0);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const getCategoriyData = async () => {
    setLoadingCategory(true);

    try {


      
      const serverResponse = await getAllCategories(page);

      if (serverResponse.sucess) {
        console.log("Category page data ", serverResponse.data);
        setCategoryPage(serverResponse.data);
      }
    } catch (error) {
      console.log("can't get category data due to this", error);
    } finally {
      setLoadingCategory(false);
    }
  };

  useEffect(() => {
    getCategoriyData();
  }, [page,refreshTriger]);

  const handleEdit = async (category) => {
    setLoadingUpdate(true)
    try {
      console.log("check what sent ",category);
       const updateData = {
            categoryName: category.categoryName
        }
      
      const res = await updateCategory(updatedCategory.categoryId,updateData)
      if(res.status){
        await getCategoriyData()
        setUpdatedModal(false)
        setUpdateError('')
      }else{

        setUpdateError(res.error)
      }
    } catch (error) {

      console.log("can't update due to this",error);
          setUpdateError("Failed to update category")

      
    }finally{
      setLoadingUpdate(false)
    }
  };

  const handleDelete = async (category) => {

    console.log("deleted category ",category);
    
    setLoadingDelete(true)
    try {

      const severResponse = await deleteCategory(category.categoryId)
      
  
      if (severResponse.status) {
      if (categoryPage.allCategories.length === 1 && page === 0) {
        setCategoryPage({
          allCategories: [],
          pageNumber: 0,
          pageSize: pageSize,
          totalPage: 0,
          totalElements: 0,
          lastPage: true
        });
       
      } else {
        await getCategoriyData();
      }

       if (categoryPage.allCategories.length === 1 && page > 0) {
        setPage(prev => prev - 1)
      }

    
    }

      setDeletedCategory({})
      setSure(false)
      
    } catch (error) {
      console.log("can't delete ",category.categoryName,", due to this",error);
      
      
    }finally{
      setLoadingDelete(false)
    }
  };

  const table = useReactTable({
    data: categoryPage.allCategories || [],
    columns: workspacesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: categoryPage.pageNumber || 0,
        pageSize: categoryPage.pageSize || pageSize,
      },
    },
  });

  // Calculate the range for the last page
  const totalRows = categoryPage.totalElements || 0;
  const lastPageStartIndex = Math.floor(totalRows / pageSize) * pageSize + 1;
  const lastPageEndIndex = Math.min(
    totalRows,
    lastPageStartIndex + pageSize - 1,
  );

  if (loadingCategory) return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden animate-pulse">
  {/* Table Header */}
  <div className="bg-gray-50 border-b border-gray-200">
    <div className="grid grid-cols-5 gap-4 px-6 py-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
      ))}
    </div>
  </div>
  
  {/* Table Body */}
  <div className="bg-white divide-y divide-gray-200">
    {[...Array(8)].map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-5 gap-4 px-6 py-4">
        {[...Array(5)].map((_, colIndex) => (
          <div key={colIndex} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    ))}
  </div>
</div>
  );

  if(page === 0 && categoryPage.allCategories.length===0) return (

     <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5H4.5" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No Categories yet</p>
              <p className="text-gray-400 text-xs mt-1">Click "Add Category" to create your first one</p>
      </div>
  )
 

  return (
    <>
    <div className="overflow-x-auto pb-5">
      <TableRoot>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    scope="col"
                    className={clsx(header.column.columnDef.meta?.align)}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                className="transition-colors hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell, index) => {
                  // Check if this is the last edited column (last cell)
                  const isLastColumn = index === row.getVisibleCells().length - 1;

                  return (
                    <TableCell
                      key={cell.id}
                      className={clsx(cell.column.columnDef.meta?.align, "relative")}
                    >
                      {isLastColumn ? (
                        <div className="flex items-center justify-end min-w-[120px]">
                          {hoveredRowId === row.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setUpdatedCategory(row.original)
                                  setUpdatedModal(true)
                                }}
                                className=" rounded text-gray-600 hover:text-blue-600  transition-all cursor-pointer"
                                title="Edit"
                              >
                                <RiEditLine className="w-5 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeletedCategory(row.original);
                                  setSure(true)


                                }}
                                className=" rounded text-gray-600 hover:text-red-600  transition-all cursor-pointer"
                                title="Delete"
                              >
                                <RiDeleteBinLine className="w-5 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-600">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </span>
                          )}
                        </div>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3">
        <p className="text-sm tabular-nums text-black">
          Showing{' '}
          <span className="font-medium text-gray-900">
            {table.getState().pagination.pageIndex ===
            Math.floor(totalRows / pageSize)
              ? lastPageStartIndex + '-' + lastPageEndIndex
              : table.getState().pagination.pageIndex * pageSize +
                1 +
                '-' +
                (table.getState().pagination.pageIndex + 1) * pageSize}
          </span>{' '}
          of
          <span className="font-medium text-gray-900">
            {' '}
            {table.getFilteredRowModel().rows.length}
          </span>
        </p>
        <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
          <Button
            onClick={() => { setPage(prev => prev - 1) }}
            disabled={categoryPage.pageNumber === 0}
          >
            <span className="sr-only">Previous</span>
            <RiArrowLeftSLine
              className="size-5 text-gray-700 hover:text-gray-900 cursor-pointer"
              aria-hidden={true}
            />
          </Button>
          <span className="h-5 border-r border-gray-300" aria-hidden={true} />
          <Button
            onClick={() => { setPage(prev => prev + 1) }}
            disabled={categoryPage.lastPage}
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

     <DeleteConfirmationModal
        isOpen={sure}
        onClose={() => setSure(false)}
        onConfirm={()=>{handleDelete(deletedCategory)}}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone and will remove all associated services."
        itemName={deletedCategory?.categoryName}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={laodingDelete}
      />

        <SlideInModal
      isOpen={updateModal}
      onClose={()=>{setUpdatedModal(false)}}
      onSubmit={handleEdit}
      initialData={updatedCategory}
    
      fields={categoryFields}
      title='Update Category'
      errors={updateError}
      isLoading={loadingUpdate}
      submitText='update'
      

      
      />
     
    </>

  )
}

export default RequestTable