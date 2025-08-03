import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { Heart, X, MapPin, Users, MessageCircle, ArrowLeft } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import { User, Sport } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const Matching = () => {
  const { sportId } = useParams<{ sportId: string }>()
  const navigate = useNavigate()
  const { 
    selectedSport, 
    potentialMatches, 
    setPotentialMatches, 
    currentMatchIndex, 
    setCurrentMatchIndex,
    userLocation,
    maxDistance,
    isLoading,
    setIsLoading 
  } = useStore()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [sport, setSport] = useState<Sport | null>(null)

  // Motion values for swipe animation
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  useEffect(() => {
    const fetchData = async () => {
      if (!sportId) return

      setIsLoading(true)
      try {
        // Fetch sport details
        const sportData = await apiService.getSportById(parseInt(sportId))
        setSport(sportData)

        // Fetch potential matches
        const matches = await apiService.getPotentialMatches(
          1, // TODO: Get current user ID from auth
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
  }, [sportId, userLocation, maxDistance, setPotentialMatches, setIsLoading])

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentUser) return

    try {
      if (direction === 'right') {
        // Like
        await apiService.processLike(1, currentUser.id, parseInt(sportId!))
        toast.success('¡Like enviado!')
      } else {
        // Dislike
        await apiService.processDislike(1, currentUser.id, parseInt(sportId!))
      }
    } catch (error) {
      console.error('Error processing swipe:', error)
      toast.error('Error al procesar la acción')
    }

    // Move to next user
    setCurrentMatchIndex(currentMatchIndex + 1)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      handleSwipe('right')
    } else if (info.offset.x < -threshold) {
      handleSwipe('left')
    }
  }

  // Update current user when index changes
  useEffect(() => {
    if (potentialMatches.length > 0 && currentMatchIndex < potentialMatches.length) {
      setCurrentUser(potentialMatches[currentMatchIndex])
    } else {
      setCurrentUser(null)
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

  if (!currentUser) {
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
            {currentUser.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
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
                {currentUser.firstName} {currentUser.lastName}
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
      <div className="text-center text-sm text-gray-500">
        <p>Desliza a la derecha para dar like, a la izquierda para pasar</p>
      </div>
    </div>
  )
}

export default Matching 