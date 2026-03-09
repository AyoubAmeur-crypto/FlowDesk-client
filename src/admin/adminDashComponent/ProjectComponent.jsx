import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Search, X, Calendar, MoreHorizontal, Plus, LayoutDashboard, FolderKanban, Users, GripVertical, Trash2, Edit2 } from 'lucide-react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

// Mock data for projects
const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    status: 'In Progress',
    dueDate: '2026-03-15',
    avatarColors: ['#3B82F6', '#10B981'],
    avatarNames: ['JD', 'SM'],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android application',
    status: 'Todo',
    dueDate: '2026-04-01',
    avatarColors: ['#F59E0B', '#EF4444', '#8B5CF6'],
    avatarNames: ['AK', 'BP', 'CW'],
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Third-party service integration',
    status: 'Done',
    dueDate: '2026-02-28',
    avatarColors: ['#06B6D4'],
    avatarNames: ['RT'],
  },
  {
    id: '4',
    name: 'Dashboard Analytics',
    description: 'Real-time analytics dashboard',
    status: 'In Progress',
    dueDate: '2026-03-20',
    avatarColors: ['#EC4899', '#14B8A6'],
    avatarNames: ['ML', 'NK'],
  },
  {
    id: '5',
    name: 'Email Campaign',
    description: 'Marketing email automation',
    status: 'Todo',
    dueDate: '2026-03-25',
    avatarColors: ['#F97316'],
    avatarNames: ['DG'],
  },
];

// Initial columns data
const initialColumns = [
  { id: 'todo', title: 'To Do', color: '#6B7280' },
  { id: 'inprogress', title: 'In Progress', color: '#3B82F6' },
  { id: 'done', title: 'Done', color: '#10B981' },
];

// Initial tasks for kanban
const initialTasks = [
  { id: 't1', columnId: 'todo', title: 'Design mockups', description: 'Create initial wireframes', dueDate: '2026-03-10', avatarColors: ['#3B82F6'], avatarNames: ['JD'] },
  { id: 't2', columnId: 'todo', title: 'Setup project structure', description: 'Initialize repository', dueDate: '2026-03-08', avatarColors: ['#10B981'], avatarNames: ['SM'] },
  { id: 't3', columnId: 'inprogress', title: 'Implement authentication', description: 'Add OAuth2 support', dueDate: '2026-03-12', avatarColors: ['#F59E0B'], avatarNames: ['AK'] },
  { id: 't4', columnId: 'inprogress', title: 'Database schema design', description: 'Design tables and relationships', dueDate: '2026-03-09', avatarColors: ['#EF4444'], avatarNames: ['BP'] },
  { id: 't5', columnId: 'done', title: 'Initial planning', description: 'Project kickoff meeting', dueDate: '2026-03-01', avatarColors: ['#8B5CF6'], avatarNames: ['CW'] },
  { id: 't6', columnId: 'done', title: 'Requirements gathering', description: 'Document all features', dueDate: '2026-03-03', avatarColors: ['#EC4899'], avatarNames: ['ML'] },
];

// Button Component
const Button = ({ onClick, disabled, children }) => {
  return (
    <button
      type="button"
      className="px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Avatar Component
const Avatar = ({ color, name, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
  };
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium border-2 border-white`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {name}
    </div>
  );
};

// Avatar Group Component
const AvatarGroup = ({ avatars, names, max = 3 }) => {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleAvatars.map((color, index) => (
          <Avatar key={index} color={color} name={names[index]} />
        ))}
        {remaining > 0 && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-gray-200 text-gray-600 border-2 border-white">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick }) => {
  const statusColors = {
    Todo: 'bg-gray-100 text-gray-700 border-gray-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    Done: 'bg-green-50 text-green-700 border-green-200',
  };

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
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${statusColors[project.status]}`}>
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
  );
};

// Sortable Task Card Component
const SortableTaskCard = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-md border border-gray-200 p-3 shadow-sm hover:border-gray-300 transition-colors group relative"
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
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
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
      >
        <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
      </button>
    </div>
  );
};

// Drag Overlay Task Card
const DragOverlayTaskCard = ({ task }) => {
  return (
    <div className="bg-white rounded-md border border-gray-300 p-3 shadow-xl rotate-2">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 text-gray-400 p-0.5">
          <GripVertical size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">{task?.title}</h4>
          {task?.description && (
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
  );
};

// Droppable Column Component
const DroppableColumn = ({ column, tasks, onDeleteTask, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-1 min-w-[280px] max-w-[280px] flex flex-col h-full">
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{column.title}</h3>
          <span className="text-xs text-gray-400">{tasks.length}</span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <Plus size={14} className="text-gray-400" />
        </button>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 bg-gray-50/50 rounded-lg border ${isOver ? 'border-gray-400 bg-gray-50' : 'border-gray-200'} p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar min-h-[400px]`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

// Add Column Modal
const AddColumnModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Add New Column</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Column Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter column name"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (title.trim()) {
                  onAdd(title.trim());
                  setTitle('');
                  onClose();
                }
              }}
              disabled={!title.trim()}
              className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Column
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Add Task Modal
const AddTaskModal = ({ isOpen, onClose, onAdd, columnId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Add New Task</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
              />
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (title.trim()) {
                  onAdd({
                    title: title.trim(),
                    description: description.trim(),
                    dueDate: dueDate || new Date().toISOString().split('T')[0],
                    columnId,
                  });
                  setTitle('');
                  setDescription('');
                  setDueDate('');
                  onClose();
                }
              }}
              disabled={!title.trim()}
              className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Project Sidebar with Kanban Board
const ProjectSidebar = ({ isOpen, onClose, project }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedColumnForTask, setSelectedColumnForTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnId = tasks.find(t => t.id === activeId)?.columnId;
    let overColumnId = overId;

    // Check if over is a task or column
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      overColumnId = overTask.columnId;
    } else if (columns.find(c => c.id === overId)) {
      overColumnId = overId;
    }

    if (activeColumnId !== overColumnId) {
      setTasks((items) => {
        return items.map((task) =>
          task.id === activeId
            ? { ...task, columnId: overColumnId }
            : task
        );
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = tasks.find(t => t.id === overId);

    if (activeTask && overTask && activeTask.columnId === overTask.columnId && activeId !== overId) {
      const oldIndex = tasks
        .filter(t => t.columnId === activeTask.columnId)
        .findIndex(t => t.id === activeId);
      const newIndex = tasks
        .filter(t => t.columnId === activeTask.columnId)
        .findIndex(t => t.id === overId);

      const columnTasks = tasks.filter(t => t.columnId === activeTask.columnId);
      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);

      setTasks((items) => {
        const otherTasks = items.filter(t => t.columnId !== activeTask.columnId);
        return [...otherTasks, ...reorderedTasks];
      });
    }

    setActiveTask(null);
  };

  const handleAddColumn = (title) => {
    const newColumn = {
      id: `col-${Date.now()}`,
      title,
      color: '#6B7280',
    };
    setColumns(prev => [...prev, newColumn]);
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(prev => prev.filter(c => c.id !== columnId));
    setTasks(prev => prev.filter(t => t.columnId !== columnId));
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      avatarColors: ['#6B7280'],
      avatarNames: ['ME'],
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const getTasksForColumn = (columnId) => {
    return tasks.filter(t => t.columnId === columnId);
  };

  if (!isOpen) return null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay>
          {activeTask ? <DragOverlayTaskCard task={activeTask} /> : null}
        </DragOverlay>

        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[85%] md:w-3/4 lg:w-4/5 bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
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

          {/* Project Info Bar */}
          <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {project?.avatarNames?.length || 0} members
                  </span>
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
              <div className="flex items-center gap-2">
                <AvatarGroup avatars={project?.avatarColors || []} names={project?.avatarNames || []} max={4} />
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto p-4 bg-white">
            <div className="flex gap-3 h-full min-w-max">
              {columns.map((column) => (
                <div key={column.id} className="flex-1 min-w-[280px] max-w-[280px] flex flex-col h-full">
                  <div className="flex items-center justify-between px-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{column.title}</h3>
                      <span className="text-xs text-gray-400">{getTasksForColumn(column.id).length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedColumnForTask(column.id);
                          setShowAddTask(true);
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Add task"
                      >
                        <Plus size={14} className="text-gray-400" />
                      </button>
                      {columns.length > 1 && (
                        <button
                          onClick={() => handleDeleteColumn(column.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Delete column"
                        >
                          <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  <SortableContext
                    id={column.id}
                    items={getTasksForColumn(column.id).map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex-1 bg-gray-50/50 rounded-lg border border-gray-200 p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar min-h-[400px]">
                      {getTasksForColumn(column.id).map((task) => (
                        <SortableTaskCard
                          key={task.id}
                          task={task}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                      {getTasksForColumn(column.id).length === 0 && (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                          <Plus size={20} className="mb-1" />
                          <span className="text-xs">Drop tasks here</span>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              ))}

              {/* Add Column Button */}
              <div className="min-w-[280px] max-w-[280px] flex flex-col">
                <button
                  onClick={() => setShowAddColumn(true)}
                  className="flex-1 min-h-[400px] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50/50 transition-all group"
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

      {/* Add Column Modal */}
      <AddColumnModal
        isOpen={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAdd={handleAddColumn}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => {
          setShowAddTask(false);
          setSelectedColumnForTask(null);
        }}
        onAdd={handleAddTask}
        columnId={selectedColumnForTask}
      />
    </>
  );
};

function ProjectComponent() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(mockProjects);
    } else {
      const filtered = mockProjects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-w-full px-4">
      {/* Header */}
      <div className="flex flex-row items-center justify-between px-10 pt-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
          </div>
          <h1 className="text-xl text-black">Projects</h1>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-white bg-black text-sm rounded-md hover:text-white/90 cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {/* Search */}
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
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Project Cards Grid */}
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

      {/* Pagination */}
      {filteredProjects.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 pb-6 px-4">
          <p className="text-xs text-gray-600">
            Showing{' '}
            <span className="font-medium text-gray-900">
              {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-900">{filteredProjects.length}</span>
          </p>
          <div className="inline-flex items-center rounded-full shadow-sm ring-1 ring-inset ring-gray-300">
            <Button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <span className="sr-only">Previous</span>
              <RiArrowLeftSLine
                className="size-4 text-gray-700 hover:text-gray-900 cursor-pointer"
              />
            </Button>
            <span className="h-4 border-r border-gray-300" aria-hidden={true} />
            <Button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <span className="sr-only">Next</span>
              <RiArrowRightSLine
                className="size-4 text-gray-700 group-hover:text-gray-900 cursor-pointer"
              />
            </Button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {selectedProject && (
        <ProjectSidebar
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
        />
      )}
    </div>
  );
}

export default ProjectComponent;