import React, { useState } from 'react'

function AddColumnModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState('')

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!title.trim()) return
                onAdd(title.trim())
                setTitle('')
                onClose()
              }}
              disabled={!title.trim()}
              className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Column
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddColumnModal
