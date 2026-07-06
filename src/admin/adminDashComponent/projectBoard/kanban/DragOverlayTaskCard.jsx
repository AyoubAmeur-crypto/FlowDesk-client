import React from 'react'
import { Calendar, GripVertical } from 'lucide-react'
import AvatarGroup from '../AvatarGroup'

function DragOverlayTaskCard({ task }) {
  if (!task) return null

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-3 shadow-xl rotate-2 w-[280px]">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 text-gray-400 p-0.5">
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <AvatarGroup avatars={task.avatarColors} names={task.avatarNames} max={2} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DragOverlayTaskCard
