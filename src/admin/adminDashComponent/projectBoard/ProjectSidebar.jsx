import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import { Calendar, Check, ChevronDown, Plus, Save, Trash2, UserPlus, Users, X } from 'lucide-react'
import { DatePicker } from '@heroui/date-picker'
import { parseDate } from '@internationalized/date'
import AvatarGroup from './AvatarGroup'
import CommentsPanel from './CommentsPanel'
import DragOverlayTaskCard from './kanban/DragOverlayTaskCard'
import AddColumnModal from './modals/AddColumnModal'
import AddTaskModal from './modals/AddTaskModal'
import TaskDetailsModal from './modals/TaskDetailsModal'
import UnsavedChangesModal from './modals/UnsavedChangesModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done', 'Blocked']
const MEMBER_COLOR_PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6']

const getInitials = (fullName) => {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProjectSidebar({ isOpen, onClose, project, onUpdateProject }) {
  // --- FETCHING PREPARATION ---
  // const queryClient = useQueryClient();
  // const { data: kanbanData, isLoading: isLoadingKanban } = useQuery({
  //   queryKey: ['projectKanban', project?.id],
  //   queryFn: () => fetchKanbanData(project.id), // Fetch { columns: [], tasks: [] }
  //   enabled: !!project?.id
  // })

  // Initialize with empty arrays instead of hardcoded data
  const [columns, setColumns] = useState([]) 
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedColumnForTask, setSelectedColumnForTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newColumnId, setNewColumnId] = useState(null)
  const [taskComments, setTaskComments] = useState({}) // Alternatively, fetch comments per task
  const [draftProject, setDraftProject] = useState(project)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [titleDraft, setTitleDraft] = useState(project?.name || '')
  const [descriptionDraft, setDescriptionDraft] = useState(project?.description || '')
  const [showMembersPopover, setShowMembersPopover] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [newMemberInput, setNewMemberInput] = useState('')
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [pendingClose, setPendingClose] = useState(false)
  const [activeTab, setActiveTab] = useState('board')
  const [projectComments, setProjectComments] = useState([])

  const membersPopoverRef = useRef(null)
  const statusMenuRef = useRef(null)

  const hasChanges = useMemo(() => {
    if (!project) return false
    return (
      JSON.stringify(draftProject) !== JSON.stringify(project)
    )
  }, [draftProject, project])

  useEffect(() => {
    setDraftProject(project)
    setTitleDraft(project?.name || '')
    setDescriptionDraft(project?.description || '')
    setIsEditingTitle(false)
    setIsEditingDescription(false)
    setShowMembersPopover(false)
    setShowStatusMenu(false)
  }, [project])

  // Sync fetched data to state when available
  // useEffect(() => {
  //   if (kanbanData) {
  //     setColumns(kanbanData.columns || [])
  //     setTasks(kanbanData.tasks || [])
  //   }
  // }, [kanbanData])

  const handleClose = () => {
    if (hasChanges) {
      setPendingClose(true)
      setShowUnsavedModal(true)
    } else {
      onClose()
    }
  }

  const handleDiscard = () => {
    setShowUnsavedModal(false)
    setPendingClose(false)
    setDraftProject(project)
    onClose()
  }

  const handleSaveAndClose = () => {
    applyProjectUpdate({})
    setShowUnsavedModal(false)
    setPendingClose(false)
    onClose()
  }

  const handleSave = () => {
    applyProjectUpdate({})
  }

  const applyProjectUpdate = (patch) => {
    if (!draftProject) return

    const nextProject = { ...draftProject, ...patch }
    setDraftProject(nextProject)
    if (typeof onUpdateProject === 'function') {
      onUpdateProject(nextProject)
    }
  }

  const availableMemberCandidates = useMemo(() => {
    const seeded = ['AL', 'MS', 'RN', 'KT', 'FA', 'NM', 'YU', 'PS']
    const current = draftProject?.avatarNames || []
    return seeded.filter((seed) => !current.includes(seed))
  }, [draftProject?.avatarNames])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (membersPopoverRef.current && !membersPopoverRef.current.contains(event.target)) {
        setShowMembersPopover(false)
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
        setShowStatusMenu(false)
      }
    }

    if (showMembersPopover || showStatusMenu) {
      document.addEventListener('mousedown', onPointerDown)
    }

    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [showMembersPopover, showStatusMenu])

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

    // TODO: Backend Sync
    // Trigger mutation to update task's column ID in database
    // updateTaskColumnMutation.mutate({ taskId: activeId, newColumnId: overColumnId });
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

      // TODO: Backend Sync
      // Sync the new sorting order to the backend
      // updateTaskOrderMutation.mutate({ 
      //   columnId: draggedTask.columnId, 
      //   orderedTaskIds: reordered.map(t => t.id) 
      // });
    }

    setActiveTask(null)
  }

  const handleAddColumn = (title) => {
    const id = `col-${Date.now()}` // Temporary ID for optimistic UI
    const newColumn = {
      id,
      title,
      color: '#6B7280',
    }

    setColumns((prev) => [...prev, newColumn])
    setNewColumnId(id)
    window.setTimeout(() => setNewColumnId(null), 280)

    // TODO: Backend Sync
    // createColumnMutation.mutate({ projectId: project.id, title, color: newColumn.color })
  }

  const handleDeleteColumn = (columnId) => {
    setColumns((prev) => prev.filter((column) => column.id !== columnId))
    setTasks((prev) => prev.filter((task) => task.columnId !== columnId))
    
    // TODO: Backend Sync
    // deleteColumnMutation.mutate(columnId)
  }

  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`, // Temporary ID
      ...taskData,
      avatarColors: ['#6B7280'],
      avatarNames: ['ME'],
    }
    setTasks((prev) => [...prev, newTask])
    
    // TODO: Backend Sync
    // createTaskMutation.mutate({ projectId: project.id, ...newTask })
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

    // TODO: Backend Sync
    // deleteTaskMutation.mutate(taskId)
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

    // TODO: Backend Sync
    // addTaskCommentMutation.mutate({ taskId, text })
  }

  const handleAddProjectComment = (commentData) => {
    setProjectComments((prev) => [...prev, commentData])
  }

  const getTasksForColumn = (columnId) => tasks.filter((task) => task.columnId === columnId)

  const commitTitle = () => {
    const value = titleDraft.trim()
    if (value && value !== draftProject?.name) {
      applyProjectUpdate({ name: value })
    }
    setTitleDraft((draftProject?.name || value || '').trim())
    setIsEditingTitle(false)
  }

  const commitDescription = () => {
    const value = descriptionDraft.trim()
    if (value && value !== draftProject?.description) {
      applyProjectUpdate({ description: value })
    }
    setDescriptionDraft((draftProject?.description || value || '').trim())
    setIsEditingDescription(false)
  }

  const addMember = (rawValue) => {
    const fullName = rawValue.trim()
    if (!fullName) return

    const initials = getInitials(fullName)
    const currentNames = draftProject?.avatarNames || []
    
    if (currentNames.includes(fullName)) {
      setNewMemberInput('')
      return
    }

    const nextIndex = currentNames.length % MEMBER_COLOR_PALETTE.length
    const nextColor = MEMBER_COLOR_PALETTE[nextIndex]
    applyProjectUpdate({
      avatarNames: [...currentNames, fullName],
      avatarColors: [...(draftProject?.avatarColors || []), nextColor],
    })
    setNewMemberInput('')
  }

  const removeMemberAt = (memberIndex) => {
    const nextNames = (draftProject?.avatarNames || []).filter((_, index) => index !== memberIndex)
    const nextColors = (draftProject?.avatarColors || []).filter((_, index) => index !== memberIndex)
    applyProjectUpdate({ avatarNames: nextNames, avatarColors: nextColors })
  }

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

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleClose} />
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[85%] md:w-3/4 lg:w-4/5 bg-white shadow-2xl flex flex-col animate-slide-in-right">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white font-semibold text-sm">
                {draftProject?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                {isEditingTitle ? (
                  <input
                    value={titleDraft}
                    onChange={(event) => setTitleDraft(event.target.value)}
                    onBlur={commitTitle}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitTitle()
                      if (event.key === 'Escape') {
                        setTitleDraft(draftProject?.name || '')
                        setIsEditingTitle(false)
                      }
                    }}
                    autoFocus
                    className="w-full text-base font-semibold text-gray-900 border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                ) : (
                  <h2
                    className="text-base font-semibold text-gray-900 cursor-text rounded px-1 -mx-1 hover:bg-gray-100 transition-colors"
                    title="Click to edit"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {draftProject?.name}
                  </h2>
                )}

                {isEditingDescription ? (
                  <textarea
                    value={descriptionDraft}
                    onChange={(event) => setDescriptionDraft(event.target.value)}
                    onBlur={commitDescription}
                    rows={2}
                    autoFocus
                    className="mt-1 w-full text-xs text-gray-600 border border-gray-300 rounded-md px-2 py-1 outline-none resize-none focus:ring-2 focus:ring-gray-900/10"
                  />
                ) : (
                  <p
                    className="text-xs text-gray-500 cursor-text rounded px-1 -mx-1 hover:bg-gray-100 transition-colors truncate"
                    title="Click to edit"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {draftProject?.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm hover:bg-black transition-colors flex items-center gap-1.5"
                  title="Save changes"
                >
                  <Save size={16} />
                  Save
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative" ref={membersPopoverRef}>
                  <button
                    type="button"
                    onClick={() => setShowMembersPopover((prev) => !prev)}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors"
                  >
                    <Users size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600">{draftProject?.avatarNames?.length || 0} members</span>
                  </button>

                  {showMembersPopover && (
                    <div className="absolute top-full mt-2 left-0 w-[280px] rounded-xl border border-gray-200 bg-white shadow-2xl p-3 z-20 thin-scrollbar">
                      <p className="text-xs font-medium text-gray-700 mb-2">Project Members</p>

                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1 thin-scrollbar">
                        {(draftProject?.avatarNames || []).length === 0 ? (
                          <p className="text-xs text-gray-400">No members assigned</p>
                        ) : (
                          (draftProject?.avatarNames || []).map((memberFullName, index) => (
                            <div key={`${memberFullName}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-100 px-2 py-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[10px] font-bold text-white"
                                  style={{ backgroundColor: draftProject?.avatarColors?.[index] || '#6B7280' }}
                                  title={memberFullName}
                                >
                                  {getInitials(memberFullName)}
                                </span>
                                <span className="text-xs text-gray-700 font-medium">{memberFullName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeMemberAt(index)}
                                className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Remove member"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <input
                            value={newMemberInput}
                            onChange={(event) => setNewMemberInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') addMember(newMemberInput)
                            }}
                            placeholder="Add member (e.g. John Doe)"
                            className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-gray-900/10"
                          />
                          <button
                            type="button"
                            onClick={() => addMember(newMemberInput)}
                            className="h-[30px] px-2 rounded-md bg-gray-900 text-white text-xs hover:bg-black transition-colors"
                          >
                            <UserPlus size={12} />
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <button
                            key="john-doe"
                            type="button"
                            onClick={() => addMember('John Doe')}
                            className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          >
                            + John Doe
                          </button>
                          <button
                            key="jane-smith"
                            type="button"
                            onClick={() => addMember('Jane Smith')}
                            className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          >
                            + Jane Smith
                          </button>
                          <button
                            key="alex-johnson"
                            type="button"
                            onClick={() => addMember('Alex Johnson')}
                            className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          >
                            + Alex Johnson
                          </button>
                          <button
                            key="maria-garcia"
                            type="button"
                            onClick={() => addMember('Maria Garcia')}
                            className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          >
                            + Maria Garcia
                          </button>
                          <button
                            key="robert-wilson"
                            type="button"
                            onClick={() => addMember('Robert Wilson')}
                            className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          >
                            + Robert Wilson
                          </button>
                          <button
                            key="sara-williams"
                            type="button"
                            onClick={() => addMember('Sara Williams')}
                            className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          >
                            + Sara Williams
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors group relative">
                  <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 min-w-[60px]">
                    {draftProject?.dueDate
                      ? new Date(draftProject.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Due date'}
                  </span>
                  <DatePicker
                    value={draftProject?.dueDate ? parseDate(draftProject.dueDate) : null}
                    onChange={(date) => {
                      if (date) {
                        applyProjectUpdate({ dueDate: date.toString() })
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    size="sm"
                    variant="bordered"
                    placeholder="Select due date"
                  />
                </div>

                <div className="relative" ref={statusMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowStatusMenu((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    {draftProject?.status || 'Todo'}
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showStatusMenu && (
                    <div className="absolute top-full left-0 mt-2 w-[170px] rounded-xl border border-gray-200 bg-white shadow-2xl p-1.5 z-20">
                      {STATUS_OPTIONS.map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => {
                            applyProjectUpdate({ status: statusOption })
                            setShowStatusMenu(false)
                          }}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md hover:bg-gray-50 text-gray-700"
                        >
                          <span>{statusOption}</span>
                          {draftProject?.status === statusOption && <Check size={12} className="text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <AvatarGroup 
                avatars={draftProject?.avatarColors || []} 
                names={(draftProject?.avatarNames || []).map(name => getInitials(name))} 
                max={4} 
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {/* Tab Bar */}
            <div className="border-b border-gray-200 flex px-6">
              <button
                onClick={() => setActiveTab('board')}
                className={`py-3 px-1 text-sm font-medium transition-all border-b-2 ${
                  activeTab === 'board'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-700'
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-3 px-1 text-sm font-medium transition-all border-b-2 ml-6 ${
                  activeTab === 'comments'
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-600 border-transparent hover:text-gray-700'
                }`}
              >
                Comments
              </button>
            </div>

            {/* Content Area */}
            {activeTab === 'board' ? (
              <div className="flex-1 overflow-x-auto p-4 bg-white">
                {/* 
                // Enable this loading spinner when fetching is implemented
                {isLoadingKanban ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : ( 
                */}
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
                {/* )} */}
              </div>
            ) : (
              <CommentsPanel
                project={draftProject}
                comments={projectComments}
                onAddComment={handleAddProjectComment}
                currentUser={draftProject?.avatarNames?.[0] || null}
              />
            )}
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

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        onDiscard={handleDiscard}
        onSaveAndClose={handleSaveAndClose}
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

        .thin-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .thin-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .thin-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  )
}

export default ProjectSidebar
