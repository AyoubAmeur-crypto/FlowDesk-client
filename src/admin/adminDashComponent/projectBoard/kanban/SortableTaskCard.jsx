import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, GripVertical, Trash2 } from 'lucide-react'
import AvatarGroup from '../AvatarGroup'

function SortableTaskCard({ task, onDelete, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:border-gray-300 transition-colors group relative"
      onClick={() => onOpen(task)}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 mt-0.5"
        >
          <GripVertical size={14} />
        </button>
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
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
      >
        <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
      </button>
    </div>
  )
}

export default SortableTaskCard
