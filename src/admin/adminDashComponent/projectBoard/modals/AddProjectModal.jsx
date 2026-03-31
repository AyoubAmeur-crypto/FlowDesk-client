import React, { useState } from 'react'
import { X, Check, ChevronDown } from 'lucide-react'
import { DatePicker } from '@heroui/date-picker'
import { parseDate } from '@internationalized/date'

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done', 'Blocked']
const MEMBER_COLOR_PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6']
const SUGGESTED_MEMBERS = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Maria Garcia', 'Robert Wilson', 'Sara Williams']

const getInitials = (fullName) => {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('Todo')
  const [dueDate, setDueDate] = useState(null)
  const [members, setMembers] = useState([])
  const [memberColors, setMemberColors] = useState([])
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [newMemberInput, setNewMemberInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddMember = (fullName) => {
    const trimmed = fullName.trim()
    if (!trimmed || members.includes(trimmed)) {
      setNewMemberInput('')
      return
    }

    const nextIndex = members.length % MEMBER_COLOR_PALETTE.length
    const nextColor = MEMBER_COLOR_PALETTE[nextIndex]

    setMembers([...members, trimmed])
    setMemberColors([...memberColors, nextColor])
    setNewMemberInput('')
  }

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index))
    setMemberColors(memberColors.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)
    try {
      await onAdd({
        name: projectName.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate ? dueDate.toString() : null,
        avatarNames: members,
        avatarColors: memberColors,
      })

      // Reset form
      setProjectName('')
      setDescription('')
      setStatus('Todo')
      setDueDate(null)
      setMembers([])
      setMemberColors([])
      setNewMemberInput('')
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-up thin-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Create Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add project details..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-all duration-150"
                >
                  {status}
                  <ChevronDown size={12} className={`text-gray-400 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} />
                </button>

                {showStatusMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg p-1 z-10">
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setStatus(option)
                          setShowStatusMenu(false)
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md hover:bg-gray-50 text-gray-700"
                      >
                        <span>{option}</span>
                        {status === option && <Check size={12} className="text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Due Date</label>
              <DatePicker
                value={dueDate}
                onChange={setDueDate}
                className="w-full text-xs"
                size="sm"
                variant="bordered"
                placeholder="Select due date"
              />
            </div>

            {/* Members */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Team Members</label>
              <div className="space-y-2">
                {members.length > 0 && (
                  <div className="space-y-1.5">
                    {members.map((member, index) => (
                      <div key={`${member}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-100 px-2 py-1.5 bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ backgroundColor: memberColors[index] }}
                          >
                            {getInitials(member)}
                          </span>
                          <span className="text-xs text-gray-700 font-medium">{member}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMemberInput}
                    onChange={(e) => setNewMemberInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddMember(newMemberInput)
                    }}
                    placeholder="Add team member..."
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddMember(newMemberInput)}
                    className="px-2 py-1.5 rounded-lg bg-gray-900 text-white text-xs hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Suggested members */}
                {members.length < 6 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUGGESTED_MEMBERS.filter((m) => !members.includes(m))
                      .slice(0, 3)
                      .map((member) => (
                        <button
                          key={member}
                          type="button"
                          onClick={() => handleAddMember(member)}
                          className="px-2 py-1 text-[11px] rounded-md border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          + {member}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!projectName.trim() || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }

        .thin-scrollbar::-webkit-scrollbar {
          width: 4px;
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

export default AddProjectModal
