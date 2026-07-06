import React, { useEffect, useState, memo, useCallback } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {getCategoryQueryOption} from '../queries/projectQuerry'

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
import { Loader, Search, X } from 'lucide-react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SlideInModal from './AddUpdateModal';
import { useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';

const workspacesColumns = [
  {
    header: 'Name',
    accessorKey: 'categoryName',
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

const MemoizedTableRow = memo(function MemoizedTableRow({ row, isHovered, onHover, onEdit, onDelete }) {
  return (
    <TableRow
      key={row.id}
      onMouseEnter={() => onHover(row.id)}
      onMouseLeave={() => onHover(null)}
      className="transition-colors hover:bg-gray-50"
    >
      {row.getVisibleCells().map((cell, index) => {
        const isLastColumn = index === row.getVisibleCells().length - 1

        return (
          <TableCell
            key={cell.id}
            className={clsx(cell.column.columnDef.meta?.align, "relative")}
          >
            {isLastColumn ? (
              <div className="flex items-center justify-end min-w-[120px]">
                {isHovered ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(row.original)}
                      className="rounded text-gray-600 hover:text-blue-600 transition-all cursor-pointer"
                      title="Edit row"
                    >
                      <RiEditLine className="w-5 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(row.original)}
                      className="rounded text-gray-600 hover:text-red-600 transition-all cursor-pointer"
                      title="Delete row"
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
        )
      })}
    </TableRow>
  )
})

function TableDemo() {
  const pageSize = 6;

  const [sure,setSure]=useState(false)
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


  

  const [page, setPage] = useState(0);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRowHover = useCallback((rowId) => setHoveredRowId(rowId), [])
  const handleEdit = useCallback((category) => {
    setUpdatedCategory(category)
    setUpdatedModal(true)
  }, [])
  const handleDelete = useCallback((category) => {
    setDeletedCategory(category)
    setSure(true)
  }, [])


  const [{data,error,isPending,refetch}] = useSuspenseQueries({
    queries:[getCategoryQueryOption(page)]
  })

  
const queryClient = useQueryClient()

  const editMutationCategory = useMutation({
  mutationFn: ({ categoryId, updateData }) => updateCategory(categoryId, updateData),
  onSuccess: () => { queryClient.invalidateQueries(["categories", page]),setUpdatedModal(prev=>!prev) }
});

const deleteMutationCategory = useMutation({

  mutationFn:(categoryId)=>deleteCategory(categoryId),
  onSuccess:()=>{queryClient.invalidateQueries(["categories",page]),setSure(prev=>!prev)}
})




  




  const categories = data.data.allCategories || [];
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const table = useReactTable({
    data: filteredCategories,
    columns: workspacesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: data.data.pageNumber || 0,
        pageSize: data.data.pageSize || pageSize,
      },
    },
  });

  // Calculate the range for the last page
  const totalRows = data.data.totalElements || 0;
  const lastPageStartIndex = Math.floor(totalRows / pageSize) * pageSize + 1;
  const lastPageEndIndex = Math.min(
    totalRows,
    lastPageStartIndex + pageSize - 1,
  );

  if (isPending) return (
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

  if(page === 0 && categories.length===0) return (

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
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="w-full pl-9 pr-9 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
    <div className="overflow-x-auto pb-5">
      {filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 text-sm">No categories found</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>
        </div>
      ) : (
      <>
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
              <MemoizedTableRow
                key={row.id}
                row={row}
                isHovered={hoveredRowId === row.id}
                onHover={handleRowHover}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableRoot>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3">
        <p className="text-sm tabular-nums text-black">
  Showing{' '}
  <span className="font-medium text-gray-900">
    {data.data.totalElements === 0
      ? '0'
      : `${data.data.pageNumber * data.data.pageSize + 1}-${Math.min((data.data.pageNumber + 1) * data.data.pageSize, data.data.totalElements)}`}
  </span>{' '}
  of
  <span className="font-medium text-gray-900">
    {' '}
    {data.data.totalElements}
  </span>
</p>
        <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
          <Button
            onClick={() => { setPage(prev => prev - 1) }}
            disabled={data.data.pageNumber === 0}
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
            disabled={data.data.lastPage}
          >
            <span className="sr-only">Next</span>
            <RiArrowRightSLine
              className="size-5 text-gray-700 group-hover:text-gray-900 cursor-pointer"
              aria-hidden={true}
            />
          </Button>
        </div>
      </div>
      </>
      )}
    </div>

     <DeleteConfirmationModal
        isOpen={sure}
        onClose={() => setSure(false)}
       onConfirm={() => {
  deleteMutationCategory.mutate(deletedCategory.categoryId)
}}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone and will remove all associated services."
        itemName={deletedCategory?.categoryName}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutationCategory.isPending}
      />

        <SlideInModal
  isOpen={updateModal}
  onClose={() => { setUpdatedModal(false) }}
  onSubmit={(formData) => {
    editMutationCategory.mutate({
      categoryId: updatedCategory.categoryId,
      updateData: formData
    });
  }}
  initialData={updatedCategory}
  fields={categoryFields}
  title='Update Category'
  errors={editMutationCategory.error}
  isLoading={editMutationCategory.isPending}
  submitText='update'
/>
     
    </>

    
  );
}

export default TableDemo;
