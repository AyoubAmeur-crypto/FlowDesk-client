import React, { useState } from 'react'
import { Calendar, MessageSquare, X } from 'lucide-react'
import AvatarGroup from '../AvatarGroup'

function TaskDetailsModal({ isOpen, onClose, task, comments = [], onAddComment }) {
  const [commentText, setCommentText] = useState('')

  if (!isOpen || !task) return null

  const handleAddComment = () => {
    const value = commentText.trim()
    if (!value) return
    onAddComment(task.id, value)
    setCommentText('')
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[61] w-full sm:w-[85%] md:w-3/4 lg:w-1/2 bg-white shadow-2xl animate-slide-in-right">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Task Details</h2>
              <p className="text-xs text-gray-500">Manage task data and comments</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="rounded-2xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{task.description || 'No description provided.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Start Date</p>
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <Calendar size={14} className="text-gray-500" />
                  <span>{new Date(task.startDate || task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Due Date</p>
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <Calendar size={14} className="text-gray-500" />
                  <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-500 mb-3">Members</p>
              <AvatarGroup avatars={task.avatarColors || []} names={task.avatarNames || []} max={6} />
              {!!task.avatarNames?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.avatarNames.map((member, index) => (
                    <span key={`${member}-${index}`} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                      {member}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={15} className="text-gray-500" />
                <p className="text-xs font-medium text-gray-500">Comments</p>
              </div>

              <div className="space-y-2 mb-3 max-h-52 overflow-y-auto pr-1">
                {comments.length === 0 && (
                  <p className="text-xs text-gray-500">No comments yet.</p>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-gray-50 border border-gray-100 p-2.5">
                    <p className="text-sm text-gray-700">{comment.text}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{comment.createdAt}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none"
                />
                <button
                  onClick={handleAddComment}
                  className="px-3 py-2 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
      `}</style>
    </>
  )
}

export default TaskDetailsModal
