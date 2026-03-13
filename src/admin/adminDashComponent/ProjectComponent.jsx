import React, { useEffect, useMemo, useState } from 'react'
import { Search, X, LayoutDashboard, FolderKanban, Plus } from 'lucide-react'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import ProjectCard from './projectBoard/ProjectCard'
import ProjectSidebar from './projectBoard/ProjectSidebar'
import { mockProjects } from './projectBoard/data'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return mockProjects

    return mockProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  useEffect(() => {
    setPage(0)
  }, [searchQuery])

  const totalPages = Math.ceil(filteredProjects.length / pageSize)
  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col min-w-full px-4">
      <div className="flex flex-row items-center justify-between px-10 pt-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl text-black">Projects</h1>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-white bg-black text-sm rounded-md hover:text-white/90 cursor-pointer transition-all hover:scale-105 active:scale-95">
          <Plus size={14} />
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
        {currentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FolderKanban size={28} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No projects found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      {filteredProjects.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 pb-6 px-4">
          <p className="text-xs text-gray-600">
            Showing <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredProjects.length)}</span> of{' '}
            <span className="font-medium text-gray-900">{filteredProjects.length}</span>
          </p>
          <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
            <PagerButton disabled={page === 0} onClick={() => setPage((prev) => prev - 1)}>
              <span className="sr-only">Previous</span>
              <RiArrowLeftSLine className="size-4 text-gray-700 hover:text-gray-900 cursor-pointer" />
            </PagerButton>
            <span className="h-4 border-r border-gray-300" aria-hidden={true} />
            <PagerButton disabled={page === totalPages - 1} onClick={() => setPage((prev) => prev + 1)}>
              <span className="sr-only">Next</span>
              <RiArrowRightSLine className="size-4 text-gray-700 group-hover:text-gray-900 cursor-pointer" />
            </PagerButton>
          </div>
        </div>
      )}

      {selectedProject && (
        <ProjectSidebar
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </div>
  )
}

export default ProjectComponent
