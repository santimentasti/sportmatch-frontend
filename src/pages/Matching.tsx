import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Heart, X, MapPin, Users, MessageCircle, ArrowLeft, Star } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import { User, Sport, MatchResult } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const Matching = () => {
  const { sportId } = useParams<{ sportId: string }>()
  const navigate = useNavigate()
  const { 
    currentUser: loggedInUser,
    potentialMatches, 
    setPotentialMatches, 
    currentMatchIndex, 
    setCurrentMatchIndex,
    userLocation,
    maxDistance,
    isLoading,
    setIsLoading 
  } = useStore()

  const [currentCardUser, setCurrentCardUser] = useState<User | null>(null)
  const [sport, setSport] = useState<Sport | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null)

  // Motion values for swipe animation
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  useEffect(() => {
    const fetchData = async () => {
      if (!sportId || !loggedInUser) {
        if (!loggedInUser) {
          toast.error('Debes iniciar sesión')
          navigate('/login')
        }
        return
      }

      setIsLoading(true)
      try {
        // Fetch sport details
        const sportData = await apiService.getSportById(parseInt(sportId))
        setSport(sportData)

        // Fetch potential matches with current user ID
        const matches = await apiService.getPotentialMatches(
          loggedInUser.id,
          parseInt(sportId),
          userLocation?.latitude,
          userLocation?.longitude,
          maxDistance
        )
        setPotentialMatches(matches)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar los datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [sportId, loggedInUser, userLocation, maxDistance, setPotentialMatches, setIsLoading, navigate])

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (!currentCardUser || !loggedInUser) return

    try {
      if (direction === 'right') {
        // Like
        const result = await apiService.processLike(loggedInUser.id, currentCardUser.id, parseInt(sportId!))
        
        if (result === 'MATCH_CREATED') {
          // Show match modal
          setLastMatch({
            isMatch: true,
            targetUserId: currentCardUser.id,
            message: '¡Es un match!',
            status: 'MATCH_CREATED'
          })
          setShowMatchModal(true)
          toast.success('¡Es un match! 🎉')
        } else {
          toast.success('¡Like enviado! ❤️')
        }
      } else if (direction === 'up') {
        // Super Like (treat as regular like for now)
        const result = await apiService.processLike(loggedInUser.id, currentCardUser.id, parseInt(sportId!))
        toast.success('¡Super Like enviado! ⭐')
        
        if (result === 'MATCH_CREATED') {
          setLastMatch({
            isMatch: true,
            targetUserId: currentCardUser.id,
            message: '¡Es un match!',
            status: 'MATCH_CREATED'
          })
          setShowMatchModal(true)
        }
      } else {
        // Dislike
        await apiService.processDislike(loggedInUser.id, currentCardUser.id, parseInt(sportId!))
      }
    } catch (error) {
      console.error('Error processing swipe:', error)
      toast.error('Error al procesar la acción')
    }

    // Move to next user
    setCurrentMatchIndex(currentMatchIndex + 1)
  }

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      handleSwipe('right')
    } else if (info.offset.x < -threshold) {
      handleSwipe('left')
    } else if (info.offset.y < -threshold) {
      handleSwipe('up')
    }
  }

  const handleStartChat = async () => {
    if (!lastMatch) return
    
    try {
      // Create or get conversation
      const conversation = await apiService.getOrCreateConversation(lastMatch.targetUserId)
      
      // Navigate to chat (you'll need to implement chat page)
      navigate(`/chat/${conversation.id}`)
    } catch (error) {
      console.error('Error starting chat:', error)
      toast.error('Error al iniciar chat')
    }
    
    setShowMatchModal(false)
  }

  const handleKeepPlaying = () => {
    setShowMatchModal(false)
  }

  // Update current card user when index changes
  useEffect(() => {
    if (potentialMatches.length > 0 && currentMatchIndex < potentialMatches.length) {
      setCurrentCardUser(potentialMatches[currentMatchIndex])
    } else {
      setCurrentCardUser(null)
    }
  }, [currentMatchIndex, potentialMatches])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!sport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Deporte no encontrado</p>
      </div>
    )
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Users className="w-16 h-16 text-gray-400 mx-auto" />
        <h3 className="text-lg font-medium text-gray-900">
          No hay jugadores disponibles
        </h3>
        <p className="text-gray-600">
          No encontramos jugadores de {sport.name} en tu área
        </p>
        <button
          onClick={() => navigate('/sports')}
          className="btn-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a deportes
        </button>
      </div>
    )
  }

  if (!currentCardUser) {
    return (
      <div className="text-center py-12 space-y-4">
        <Heart className="w-16 h-16 text-primary-600 mx-auto" />
        <h3 className="text-lg font-medium text-gray-900">
          ¡No hay más jugadores!
        </h3>
        <p className="text-gray-600">
          Has visto todos los jugadores disponibles de {sport.name}
        </p>
        <button
          onClick={() => navigate('/sports')}
          className="btn-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Buscar otro deporte
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {sport.name}
        </h1>
        <p className="text-gray-600">
          {currentMatchIndex + 1} de {potentialMatches.length} jugadores
        </p>
      </div>

      {/* User Card */}
      <div className="relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity }}
          className="swipe-card aspect-[3/4] bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* User Image */}
          <div className="relative h-3/4 bg-gradient-to-br from-primary-100 to-primary-200">
            {currentCardUser.profileImage ? (
              <img
                src={currentCardUser.profileImage}
                alt={`${currentCardUser.firstName} ${currentCardUser.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-24 h-24 text-primary-600" />
              </div>
            )}
            
            {/* Like/Dislike Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: x.get() > 50 ? 1 : x.get() < -50 ? 1 : 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {x.get() > 50 && (
                <div className="bg-success-500 text-white px-8 py-4 rounded-lg transform -rotate-12">
                  <Heart className="w-12 h-12" />
                </div>
              )}
              {x.get() < -50 && (
                <div className="bg-error-500 text-white px-8 py-4 rounded-lg transform rotate-12">
                  <X className="w-12 h-12" />
                </div>
              )}
            </motion.div>
          </div>

          {/* User Info */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCardUser.firstName} {currentCardUser.lastName}
              </h2>
              <p className="text-gray-600">
                Jugador de {sport.name}
              </p>
            </div>

            {/* Location */}
            {userLocation && (
              <div className="flex items-center space-x-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>A {maxDistance}km de distancia</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={() => handleSwipe('left')}
                className="w-14 h-14 bg-error-500 text-white rounded-full flex items-center justify-center hover:bg-error-600 transition-colors shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => handleSwipe('up')}
                className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
              >
                <Star className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleSwipe('right')}
                className="w-14 h-14 bg-success-500 text-white rounded-full flex items-center justify-center hover:bg-success-600 transition-colors shadow-lg"
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Desliza a la derecha para dar like, a la izquierda para pasar</p>
        <p>Desliza hacia arriba para dar super like ⭐</p>
      </div>

      {/* Match Modal */}
      {showMatchModal && lastMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="mb-6">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 fill-current animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Es un Match! 🎉
              </h3>
              <p className="text-gray-600">
                A ambos les gusta {sport?.name}. ¡Ahora pueden chatear y coordinar su encuentro deportivo!
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleStartChat}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar mensaje
              </button>
              
              <button
                onClick={handleKeepPlaying}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Seguir jugando
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Matching 