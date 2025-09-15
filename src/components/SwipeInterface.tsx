import React, { useState, useEffect } from 'react'
import { User, Sport, MatchResult } from '@/types'
import { SwipeCard } from './SwipeCard'
import { useStore } from '@/store/useStore'
import { usePotentialMatches, useProcessLike, useProcessDislike } from '@/hooks/useApi'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { Heart, RotateCcw, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

interface SwipeInterfaceProps {
  sport: Sport
  onMatchCreated?: (matchResult: MatchResult) => void
}

export const SwipeInterface: React.FC<SwipeInterfaceProps> = ({ 
  sport, 
  onMatchCreated 
}) => {
  const { currentUser } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Get user's location for matching
  const userLat = currentUser?.latitude
  const userLng = currentUser?.longitude
  const maxDistance = currentUser?.maxDistanceKm || 10

  // Fetch potential matches
  const { 
    data: potentialMatches = [], 
    isLoading, 
    refetch,
    error 
  } = usePotentialMatches(
    currentUser?.id || 0,
    sport.id,
    userLat,
    userLng,
    maxDistance
  )

  // Mutations for like/dislike
  const likeMutation = useProcessLike()
  const dislikeMutation = useProcessDislike()

  const currentUser_card = potentialMatches[currentIndex]
  const nextUser = potentialMatches[currentIndex + 1]

  useEffect(() => {
    // Reset index when sport changes
    setCurrentIndex(0)
  }, [sport.id])

  const handleSwipeLeft = async () => {
    if (!currentUser_card || isAnimating) return
    
    setIsAnimating(true)
    
    try {
      await dislikeMutation.mutateAsync({
        userId: currentUser!.id,
        targetUserId: currentUser_card.id,
        sportId: sport.id
      })
      
      toast.success('Usuario descartado')
      moveToNext()
    } catch (error) {
      toast.error('Error al procesar dislike')
      console.error('Error processing dislike:', error)
    } finally {
      setIsAnimating(false)
    }
  }

  const handleSwipeRight = async () => {
    if (!currentUser_card || isAnimating) return
    
    setIsAnimating(true)
    
    try {
      const result = await likeMutation.mutateAsync({
        userId: currentUser!.id,
        targetUserId: currentUser_card.id,
        sportId: sport.id
      })
      
      if (result === 'MATCH_CREATED') {
        toast.success('¡Es un match! 🎉')
        onMatchCreated?.({
          isMatch: true,
          targetUserId: currentUser_card.id,
          message: '¡Hicieron match!',
          status: 'MATCH_CREATED'
        })
      } else {
        toast.success('Like enviado ❤️')
      }
      
      moveToNext()
    } catch (error) {
      toast.error('Error al procesar like')
      console.error('Error processing like:', error)
    } finally {
      setIsAnimating(false)
    }
  }

  const handleSuperLike = async () => {
    if (!currentUser_card || isAnimating) return
    
    // For now, treat super like as regular like
    // You can implement super like logic later
    toast.info('Super Like! ⭐')
    await handleSwipeRight()
  }

  const moveToNext = () => {
    setCurrentIndex(prev => prev + 1)
  }

  const handleRefresh = () => {
    setCurrentIndex(0)
    refetch()
    toast.success('Actualizando matches...')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-red-500 mb-4">
          <Heart className="w-12 h-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error al cargar matches</p>
          <p className="text-sm text-gray-600 mt-1">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (potentialMatches.length === 0 || currentIndex >= potentialMatches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-gray-500 mb-6">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No hay más usuarios</h3>
          <p className="text-gray-600 max-w-md">
            Has visto todos los usuarios disponibles para {sport.name} en tu área.
            Prueba expandir tu distancia de búsqueda o vuelve más tarde.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleRefresh}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          
          <button
            onClick={() => {/* Navigate to settings */}}
            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-96 w-full max-w-sm mx-auto">
      {/* Card Stack */}
      <div className="relative h-full">
        {/* Next card (background) */}
        {nextUser && (
          <SwipeCard
            key={`${nextUser.id}-next`}
            user={nextUser}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
            isActive={false}
          />
        )}
        
        {/* Current card (foreground) */}
        {currentUser_card && (
          <SwipeCard
            key={`${currentUser_card.id}-current`}
            user={currentUser_card}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSuperLike={handleSuperLike}
            isActive={!isAnimating}
          />
        )}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {currentIndex + 1} de {potentialMatches.length} usuarios
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / potentialMatches.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Sport info */}
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold text-gray-800">
          Buscando compañeros para {sport.name}
        </p>
        <p className="text-sm text-gray-600">
          {sport.isTeamSport ? 'Deporte grupal' : 'Deporte individual'} • 
          {sport.minPlayers === sport.maxPlayers 
            ? ` ${sport.minPlayers} jugadores`
            : ` ${sport.minPlayers}-${sport.maxPlayers} jugadores`
          }
        </p>
      </div>
    </div>
  )
}
