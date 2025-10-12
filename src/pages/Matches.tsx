import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Trophy, Users, Calendar, MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Match {
  id: number
  sport: {
    id: number
    name: string
    imageUrl?: string
  }
  venue?: {
    id: number
    name: string
    address: string
  }
  matchDate?: string
  status: string
  isTeamMatch: boolean
  participants: Array<{
    id: number
    firstName: string
    lastName: string
    profileImage?: string
  }>
  createdAt: string
}

export default function Matches() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const data = await apiService.get<Match[]>('/matching/my-matches')
      setMatches(data)
    } catch (error) {
      console.error('Error loading matches:', error)
      toast.error('Error al cargar tus matches')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    }

    const labels = {
      CONFIRMED: 'Confirmado',
      PENDING: 'Pendiente',
      CANCELLED: 'Cancelado',
      COMPLETED: 'Completado',
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  const handleMatchClick = (match: Match) => {
    // Navigate to chat with the other participant
    // In a real app, you'd find the conversation ID for this match
    navigate(`/chat`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Matches</h1>
        <p className="text-gray-600">
          Tienes {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </p>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aún no tienes matches
          </h3>
          <p className="text-gray-600 mb-6">
            Empieza a explorar deportistas y haz tu primer match
          </p>
          <button
            onClick={() => navigate('/sports')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar deportistas
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleMatchClick(match)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Sport & Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        {match.sport.name}
                      </h3>
                    </div>
                    {getStatusBadge(match.status)}
                  </div>

                  {/* Participants */}
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {match.participants.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                    </span>
                  </div>

                  {/* Date */}
                  {match.matchDate && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(match.matchDate).toLocaleString('es-AR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Venue */}
                  {match.venue && (
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {match.venue.name}
                      </span>
                    </div>
                  )}

                  {/* Created At */}
                  <p className="text-xs text-gray-500">
                    Creado el {new Date(match.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Abrir chat"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

