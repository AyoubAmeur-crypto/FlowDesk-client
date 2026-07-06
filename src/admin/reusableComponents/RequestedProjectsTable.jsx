import React, { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {Check, X} from 'lucide-react'
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
import {getProjectQuerryOption} from '../queries/projectQuerry'
import { RiCheckLine, RiCloseLine } from '@remixicon/react';


// You must implement this API call
import { getDataResponse,updateRequestStatus } from '../../api/projects';
import { QueryClient, useMutation, useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { ProjectStatus } from '../../validationClass/ProjectStatus';


const Button = ({ onClick, disabled, children }) => (
  <button
    type="button"
    className="group px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);


function RequestedProjectsTable() {

  


  const pageSize = 5;

  

  const [page, setPage] = useState(0);
  const queryClient = useQueryClient()
  // Status filter state and list
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const projectStatusList = [
    'PENDING',
    'ACCEPTED',
    'IN_PROGRESS',
    'REJECTED',
    'COMPLETED'
  ];

  function handleAccept(row) {


  acceptProject.mutate(row)
  
}

function handleRefuse(row) {
  
  refuseProject.mutate(row)
}

const projectColumns = [
  {
    header: 'Project Name',
    accessorKey: 'projectName',
    meta: { align: 'text-left' },
  },
  {
    header: 'Service',
    accessorKey: 'serviceName',
    meta: { align: 'text-left' },
  },
  {
    header: 'Client',
    accessorKey: 'userEmail',
    cell: info => (
      <span>
        {info.row.original.userFirstName} {info.row.original.userLastName} <br />
        <span className="text-xs text-gray-500">{info.row.original.userEmail}</span>
      </span>
    ),
    meta: { align: 'text-left' },
  },
  {
    header: 'Status',
    accessorKey: 'projectStatus',
    meta: { align: 'text-left' },
    cell: info => (
      <span
        className={clsx(
          "px-2 py-1 rounded text-xs font-semibold",
           info.getValue() === "PENDING" && "bg-yellow-100 text-yellow-800",
      info.getValue() === "ACCEPTED" && "bg-blue-100 text-blue-800",
      info.getValue() === "IN_PROGRESS" && "bg-purple-100 text-purple-800",
      info.getValue() === "REJECTED" && "bg-red-100 text-red-800",
      info.getValue() === "COMPLETED" && "bg-green-100 text-green-800"
        )}
      >
        {info.getValue()}
      </span>
    ),
  },
  {
    header: 'Price',
    accessorKey: 'price',
    meta: { align: 'text-right' },
    cell: info => <span>${info.getValue()}</span>,
  },
  {
    header: 'Actions',
    id: 'actions',
    meta: { align: 'text-right' },
    cell: info => {
      const row = info.row.original;
      const isDisabled = row.projectStatus === "ACCEPTED" || row.projectStatus === "REJECTED";
      return (
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={isDisabled}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium text-white transition",
              isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-700"
            )}
            title="Accept"
            onClick={isDisabled ? undefined : () => {
              handleAccept(row)
            }}
          >
            {acceptProject.isPending ? (
              <svg className="animate-spin h-4 w-4 text-white inline-block" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : <Check size={14} /> }
          </button>
          <button
            disabled={isDisabled}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium text-white transition",
              isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-700"
            )}
            title="Refuse"
            onClick={isDisabled ? undefined : () => {
              handleRefuse(row)
            }}
          >
             {acceptProject.isPending ? (
              <svg className="animate-spin h-4 w-4 text-white inline-block" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : <X size={14}/> }
          </button>
        </div>
      );
    }

   }
];

  const [{data,isPending,refetch,error}] = useSuspenseQueries({
    queries:[getProjectQuerryOption(page,selectedStatus)]
  })




  const acceptProject = useMutation({

    mutationFn:(selectedRow)=>updateRequestStatus(selectedRow.projectId,ProjectStatus.ACCEPTED),
    onSuccess:()=>{queryClient.invalidateQueries(["pendingProjects",page,selectedStatus])}
    
  })


  const refuseProject = useMutation({
    mutationFn:(row)=>updateRequestStatus(row.projectId,ProjectStatus.REJECTED),
    onSuccess:()=>{queryClient.invalidateQueries(["pendingProjects",page,selectedStatus])}
  })

  

 

  const table = useReactTable({
    data: data.allRequestedProject,
    columns: projectColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: data.pageNumber || 0,
        pageSize: data.pageSize || pageSize,
      },
    },
  });

  // Calculate the range for the last page
  const totalRows = data.totalElements || 0;
  const lastPageStartIndex = Math.floor(totalRows / pageSize) * pageSize + 1;
  const lastPageEndIndex = Math.min(
    totalRows,
    lastPageStartIndex + pageSize - 1,
  );

  if (isPending)
    return (
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-5 gap-4 px-6 py-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
            ))}
          </div>
        </div>
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

 

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          className={`px-3 py-1 rounded-md text-xs transition-colors ${
            selectedStatus === 'ALL'
              ? 'bg-black text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedStatus('ALL')}
        >
          All
        </button>
        {projectStatusList.map((status) => (
          <button
            key={status}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              selectedStatus === status
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => {setSelectedStatus(status),setPage(0) , refetch()}}
          >
            {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto pb-5">
        {data.allRequestedProject.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5H4.5" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No Requested Projects yet</p>
            <p className="text-gray-400 text-xs mt-1">No project service requests found.</p>
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
                    <TableRow key={row.id} className="transition-colors hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={clsx(cell.column.columnDef.meta?.align, "relative")}
                        >
                          {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableRoot>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3">
             <p className="text-sm tabular-nums text-black">
  Showing{' '}
  <span className="font-medium text-gray-900">
    {(() => {
      const start = data.pageNumber * data.pageSize + 1;
      const end = Math.min((data.pageNumber + 1) * data.pageSize, data.totalElements);
      return `${start}-${end}`;
    })()}
  </span>{' '}
  of
  <span className="font-medium text-gray-900">
    {' '}
    {data.totalElements}
  </span>
</p>
              <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
                <Button
                  onClick={() => setPage(prev => prev - 1)}
                  disabled={data.pageNumber === 0}
                >
                  <span className="sr-only">Previous</span>
                  <RiArrowLeftSLine
                    className="size-5 text-gray-700 hover:text-gray-900 cursor-pointer"
                    aria-hidden={true}
                  />
                </Button>
                <span className="h-5 border-r border-gray-300" aria-hidden={true} />
                <Button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={data.lastPage}
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
    </>
  );
}

export default RequestedProjectsTable;