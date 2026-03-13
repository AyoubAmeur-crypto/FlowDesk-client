import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { Calendar, Plus, Users, X } from 'lucide-react'
import AvatarGroup from './AvatarGroup'
import { initialColumns, initialTasks } from './data'
import DroppableColumn from './kanban/DroppableColumn'
import DragOverlayTaskCard from './kanban/DragOverlayTaskCard'
import AddColumnModal from './modals/AddColumnModal'
import AddTaskModal from './modals/AddTaskModal'
import TaskDetailsModal from './modals/TaskDetailsModal'

function ProjectSidebar({ isOpen, onClose, project }) {
  const [columns, setColumns] = useState(initialColumns)
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedColumnForTask, setSelectedColumnForTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newColumnId, setNewColumnId] = useState(null)
  const [taskComments, setTaskComments] = useState({})

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event) => {
    const { active } = event
    const task = tasks.find((item) => item.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeColumnId = tasks.find((item) => item.id === activeId)?.columnId
    if (!activeColumnId) return

    const overTask = tasks.find((item) => item.id === overId)
    const overColumn = columns.find((column) => column.id === overId)
    const overColumnId = overTask ? overTask.columnId : overColumn ? overColumn.id : null

    if (!overColumnId || activeColumnId === overColumnId) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === activeId
          ? { ...task, columnId: overColumnId }
          : task
      )
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) {
      setActiveTask(null)
      return
    }

    const activeId = active.id
    const overId = over.id

    const draggedTask = tasks.find((task) => task.id === activeId)
    const overTask = tasks.find((task) => task.id === overId)

    if (draggedTask && overTask && draggedTask.columnId === overTask.columnId && activeId !== overId) {
      const columnTasks = tasks.filter((task) => task.columnId === draggedTask.columnId)
      const oldIndex = columnTasks.findIndex((task) => task.id === activeId)
      const newIndex = columnTasks.findIndex((task) => task.id === overId)
      const reordered = arrayMove(columnTasks, oldIndex, newIndex)

      setTasks((prev) => {
        const nonColumnTasks = prev.filter((task) => task.columnId !== draggedTask.columnId)
        return [...nonColumnTasks, ...reordered]
      })
    }

    setActiveTask(null)
  }

  const handleAddColumn = (title) => {
    const id = `col-${Date.now()}`
    const newColumn = {
      id,
      title,
      color: '#6B7280',
    }

    setColumns((prev) => [...prev, newColumn])
    setNewColumnId(id)
    window.setTimeout(() => setNewColumnId(null), 280)
  }

  const handleDeleteColumn = (columnId) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId))
    setTasks((prev) => prev.filter((task) => task.columnId !== columnId))
  }

  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      avatarColors: ['#6B7280'],
      avatarNames: ['ME'],
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    setTaskComments((prev) => {
      const next = { ...prev }
      delete next[taskId]
      return next
    })
    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }
  }

  const handleAddComment = (taskId, text) => {
    const comment = {
      id: `comment-${Date.now()}`,
      text,
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setTaskComments((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), comment],
    }))
  }

  const getTasksForColumn = (columnId) => tasks.filter((task) => task.columnId === columnId)

  if (!isOpen) return null

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>{activeTask ? <DragOverlayTaskCard task={activeTask} /> : null}</DragOverlay>

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[85%] md:w-3/4 lg:w-4/5 bg-white shadow-2xl flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white font-semibold text-sm">
                {project?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{project?.name}</h2>
                <p className="text-xs text-gray-500">{project?.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">{project?.avatarNames?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">
                    Due {new Date(project?.dueDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
                    {project?.status}
                  </span>
                </div>
              </div>
              <AvatarGroup avatars={project?.avatarColors || []} names={project?.avatarNames || []} max={4} />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto p-4 bg-white">
            <div className="flex gap-3 h-full min-w-max">
              {columns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  tasks={getTasksForColumn(column.id)}
                  onDeleteTask={handleDeleteTask}
                  onOpenAddTask={(columnId) => {
                    setSelectedColumnForTask(columnId)
                    setShowAddTask(true)
                  }}
                  onDeleteColumn={handleDeleteColumn}
                  canDeleteColumn={columns.length > 1}
                  onOpenTask={setSelectedTask}
                  isNew={newColumnId === column.id}
                />
              ))}

              <div className="min-w-[280px] max-w-[280px] flex flex-col">
                <button
                  onClick={() => setShowAddColumn(true)}
                  className="flex-1 min-h-[400px] rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <Plus size={18} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">Add Column</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DndContext>

      <AddColumnModal
        isOpen={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
      />

      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => {
          setShowAddTask(false)
          setSelectedColumnForTask(null)
        }}
        onAdd={handleAddTask}
        columnId={selectedColumnForTask}
      />

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        comments={selectedTask ? taskComments[selectedTask.id] || [] : []}
        onAddComment={handleAddComment}
      />

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes column-pop {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default ProjectSidebar
