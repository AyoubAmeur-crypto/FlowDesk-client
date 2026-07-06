import React, { useRef, useEffect, useState } from 'react'
import { Send, MessageSquare } from 'lucide-react'

const getInitials = (fullName) => {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const CommentsPanel = ({ project, comments = [], onAddComment, currentUser = null }) => {
  const [commentText, setCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollEndRef = useRef(null)
  const effectiveCurrentUser = currentUser || (project?.avatarNames?.[0] || null)
  const isCurrentUserMember = effectiveCurrentUser && (project?.avatarNames || []).includes(effectiveCurrentUser)

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments.length])

  const handlePostComment = async () => {
    if (!commentText.trim() || !isCurrentUserMember) return

    setIsLoading(true)
    try {
      const currentIndex = (project?.avatarNames || []).indexOf(effectiveCurrentUser)
      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      await onAddComment({
        id: `comment-${Date.now()}`,
        author: effectiveCurrentUser,
        authorColor: project?.avatarColors?.[currentIndex] || '#6B7280',
        text: commentText.trim(),
        timestamp,
      })

      setCommentText('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Empty State */}
      {comments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <MessageSquare size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">No comments yet</p>
          <p className="text-xs text-gray-500">Start the conversation...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 thin-scrollbar">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5">
              <span
                className="mt-0.5 w-6 h-6 rounded-full border border-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                style={{ backgroundColor: comment.authorColor }}
              >
                {getInitials(comment.author)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <p className="text-xs font-medium text-gray-900">{comment.author}</p>
                  <p className="text-[11px] text-gray-500">{comment.timestamp}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed break-words">{comment.text}</p>
              </div>
            </div>
          ))}
          <div ref={scrollEndRef} />
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 p-3 bg-white">
        {isCurrentUserMember ? (
          <div className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handlePostComment()
                }
              }}
              placeholder="Add a comment..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none resize-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] text-gray-500">Ctrl + Enter to send</p>
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() || isLoading}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-gray-900 text-white text-xs hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={12} />
                Post
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center py-2">You are not a member of this project</p>
        )}
      </div>

      <style jsx>{`
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
    </div>
  )
}

export default CommentsPanel
