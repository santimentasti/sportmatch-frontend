import React, { useState, useRef } from 'react'
import { User } from '@/types'
import { Heart, X, Star, MapPin } from 'lucide-react'

interface SwipeCardProps {
  user: User
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSuperLike?: () => void
  isActive: boolean
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  isActive
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isActive) return
    
    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y
    
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging || !isActive) return
    
    const threshold = 100
    const { x, y } = dragOffset
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        onSwipeRight()
      } else {
        onSwipeLeft()
      }
    } else if (y < -threshold && onSuperLike) {
      onSuperLike()
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 })
    }
    
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return
    const touch = e.touches[0]
    setIsDragging(true)
    setStartPos({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isActive) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y
    
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  const getCardStyle = () => {
    const { x, y } = dragOffset
    const rotation = x * 0.1 // Slight rotation based on horizontal drag
    
    return {
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      opacity: isActive ? 1 : 0.8,
      zIndex: isActive ? 10 : 1,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
    }
  }

  const getOverlayOpacity = () => {
    const { x, y } = dragOffset
    const maxOpacity = 0.8
    
    if (x > 50) return { like: Math.min(x / 150, maxOpacity), dislike: 0, superlike: 0 }
    if (x < -50) return { like: 0, dislike: Math.min(Math.abs(x) / 150, maxOpacity), superlike: 0 }
    if (y < -50) return { like: 0, dislike: 0, superlike: Math.min(Math.abs(y) / 150, maxOpacity) }
    
    return { like: 0, dislike: 0, superlike: 0 }
  }

  const overlayOpacity = getOverlayOpacity()

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const age = calculateAge(user.dateOfBirth)

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={getCardStyle()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Profile Image */}
      <div className="relative h-3/4 bg-gradient-to-br from-blue-400 to-purple-500">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
        )}
        
        {/* Overlays */}
        {overlayOpacity.like > 0 && (
          <div 
            className="absolute inset-0 bg-green-500 flex items-center justify-center"
            style={{ opacity: overlayOpacity.like }}
          >
            <div className="bg-white rounded-full p-4">
              <Heart className="w-16 h-16 text-green-500 fill-current" />
            </div>
          </div>
        )}
        
        {overlayOpacity.dislike > 0 && (
          <div 
            className="absolute inset-0 bg-red-500 flex items-center justify-center"
            style={{ opacity: overlayOpacity.dislike }}
          >
            <div className="bg-white rounded-full p-4">
              <X className="w-16 h-16 text-red-500" />
            </div>
          </div>
        )}
        
        {overlayOpacity.superlike > 0 && (
          <div 
            className="absolute inset-0 bg-blue-500 flex items-center justify-center"
            style={{ opacity: overlayOpacity.superlike }}
          >
            <div className="bg-white rounded-full p-4">
              <Star className="w-16 h-16 text-blue-500 fill-current" />
            </div>
          </div>
        )}
      </div>
      
      {/* User Info */}
      <div className="p-6 h-1/4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
            {age && <span className="text-gray-600 font-normal">, {age}</span>}
          </h2>
          
          {user.latitude && user.longitude && (
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">A {user.maxDistanceKm}km de distancia</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={onSwipeLeft}
            className="bg-white border-2 border-red-500 rounded-full p-3 shadow-lg hover:bg-red-50 transition-colors"
            disabled={!isActive}
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
          
          {onSuperLike && (
            <button
              onClick={onSuperLike}
              className="bg-white border-2 border-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-50 transition-colors"
              disabled={!isActive}
            >
              <Star className="w-6 h-6 text-blue-500" />
            </button>
          )}
          
          <button
            onClick={onSwipeRight}
            className="bg-white border-2 border-green-500 rounded-full p-3 shadow-lg hover:bg-green-50 transition-colors"
            disabled={!isActive}
          >
            <Heart className="w-6 h-6 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
