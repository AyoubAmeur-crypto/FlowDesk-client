import React, { useEffect, useMemo, useState } from 'react'
import { Search, X, LayoutDashboard, FolderKanban, Plus } from 'lucide-react'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import ProjectCard from './projectBoard/ProjectCard'
import ProjectSidebar from './projectBoard/ProjectSidebar'
import { useSuspenseQueries } from '@tanstack/react-query'
import {getProjectAcceptedQueryOption} from '../queries/projectQuerry'

const pageSize = 8

function PagerButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      className="px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function ProjectComponent() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('') // Maintained for future backend searches
  const [page, setPage] = useState(0)

  const [{data,isPending,error,refetch}] = useSuspenseQueries({
    queries:[getProjectAcceptedQueryOption(page)]
  })

  const projectsData = data || { allRequestedProject: [], pageNumber: 0, pageSize: 6, totalElements: 0, totalPage: 1, lastPage: true };

  const mappedProjects = (projectsData.allRequestedProject || []).map(p => {
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 7);
    const fullName = p.userFirstName && p.userLastName ? `${p.userFirstName} ${p.userLastName}` : 'Unknown User';

    return {
      id: p.projectId,
      projectId: p.projectId,
      name: p.projectName || "Unnamed Project",
      description: p.projectDescription || "No description provided",
      status: p.projectStatus || 'Todo',
      userEmail: p.userEmail,
      userFirstName: p.userFirstName,
      userLastName: p.userLastName,
      serviceName: p.serviceName,
      price: p.price,
      // fallback ui properties
      progress: 0,
      dueDate: fallbackDate.toISOString().split('T')[0],
      priority: 'Medium',
      tasks: { total: 0, completed: 0 },
      team: [],
      avatarNames: [fullName],
      avatarColors: ['#3B82F6']
    };
  })

  const handleUpdateProject = (updatedProject) => {
    setSelectedProject((prev) => (prev?.id === updatedProject.id ? updatedProject : prev))
    refetch()
  }

  return (
    <div className="flex flex-col min-w-full ">
      <div className="flex flex-row items-center justify-between px-10">
        <div className="flex items-center gap-3">
          
          <h1 className="text-2xl text-black">Projects</h1>
        </div>
        <button className='px-2 py-1 text-white bg-black text-sm rounded-lg hover:text-white/90 cursor-pointer'>
          New Project
        </button>
      </div>

      <div className="px-10 pt-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 lg:px-10 pt-6">
        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-md shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 mt-2" />
                  <div className="h-8 bg-gray-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : mappedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FolderKanban size={28} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No projects found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mappedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 pb-6 px-10">
        <p className="text-sm tabular-nums text-black">
          Showing{' '}
          {projectsData.pageNumber * projectsData.pageSize + 1}-{Math.min((projectsData.pageNumber + 1) * projectsData.pageSize, projectsData.totalElements)}
          {' '}of{' '}{projectsData.totalElements}
          <span className="font-medium text-gray-900">
            {' '} (Page {projectsData.pageNumber + 1} of {projectsData.totalPage})
          </span>
        </p>
        <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
          <PagerButton disabled={projectsData.pageNumber === 0} onClick={() => setPage((prev) => prev - 1)}>
            <span className="sr-only">Previous</span>
            <RiArrowLeftSLine className="size-5 text-gray-700 hover:text-gray-900 cursor-pointer" />
          </PagerButton>
          <span className="h-5 border-r border-gray-300" aria-hidden={true} />
          <PagerButton disabled={projectsData.lastPage} onClick={() => setPage((prev) => prev + 1)}>
            <span className="sr-only">Next</span>
            <RiArrowRightSLine className="size-5 text-gray-700 group-hover:text-gray-900 cursor-pointer" />
          </PagerButton>
        </div>
      </div>

      {selectedProject && (
        <ProjectSidebar
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          onUpdateProject={handleUpdateProject}
        />
      )}
    </div>
  )
}

export default ProjectComponent
