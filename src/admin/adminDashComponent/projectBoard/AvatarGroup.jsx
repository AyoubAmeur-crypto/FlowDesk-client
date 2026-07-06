import React from 'react'

const Avatar = ({ color, name, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium border-2 border-white`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {name}
    </div>
  )
}

const AvatarGroup = ({ avatars = [], names = [], max = 3 }) => {
  const visibleAvatars = avatars.slice(0, max)
  const remaining = Math.max(0, avatars.length - max)

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
  )
}

export default AvatarGroup
