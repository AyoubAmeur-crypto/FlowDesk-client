import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Trash2 } from 'lucide-react'
import SortableTaskCard from './SortableTaskCard'

function DroppableColumn({
  column,
  tasks,
  onDeleteTask,
  onOpenAddTask,
  onDeleteColumn,
  canDeleteColumn,
  onOpenTask,
  isNew,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      className="flex-1 min-w-[280px] max-w-[280px] flex flex-col h-full"
      style={isNew ? { animation: 'column-pop 260ms cubic-bezier(0.16, 1, 0.3, 1)' } : undefined}
    >
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{column.title}</h3>
          <span className="text-xs text-gray-400">{tasks.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenAddTask(column.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Add task"
          >
            <Plus size={14} className="text-gray-400" />
          </button>
          {canDeleteColumn && (
            <button
              onClick={() => onDeleteColumn(column.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Delete column"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl border ${isOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-gray-50/50'} p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar min-h-[400px]`}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onOpen={onOpenTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-24 text-gray-400 rounded-xl border border-dashed border-gray-300">
              <Plus size={20} className="mb-1" />
              <span className="text-xs">Drop tasks here</span>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}

export default DroppableColumn
