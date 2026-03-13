import React from 'react'
import { Calendar, MoreHorizontal } from 'lucide-react'
import AvatarGroup from './AvatarGroup'

const statusColors = {
  Todo: 'bg-gray-100 text-gray-700 border-gray-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Done: 'bg-green-50 text-green-700 border-green-200',
}

function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border border-gray-200 overflow-hidden bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
            {project.name}
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal size={14} className="text-gray-400" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${statusColors[project.status] || statusColors.Todo}`}>
            {project.status}
          </span>
          <AvatarGroup avatars={project.avatarColors} names={project.avatarNames} />
        </div>
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
