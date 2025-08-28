import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Users, MapPin, ArrowRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Sport } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useSports, useIndividualSports, useTeamSports } from '@/hooks/useApi'

const SportSelection = () => {
  const navigate = useNavigate()
  const { selectedSport, setSelectedSport } = useStore()
  const [filter, setFilter] = useState<'all' | 'individual' | 'team'>('all')

  // React Query hooks
  const { data: allSports, isLoading: isLoadingAll, error: errorAll } = useSports()
  const { data: individualSports, isLoading: isLoadingIndividual } = useIndividualSports()
  const { data: teamSports, isLoading: isLoadingTeam } = useTeamSports()

  // Determine which data to use based on filter
  const getSportsData = () => {
    switch (filter) {
      case 'individual':
        return individualSports || []
      case 'team':
        return teamSports || []
      default:
        return allSports || []
    }
  }

  const getLoadingState = () => {
    switch (filter) {
      case 'individual':
        return isLoadingIndividual
      case 'team':
        return isLoadingTeam
      default:
        return isLoadingAll
    }
  }

  const sports = getSportsData()
  const isLoading = getLoadingState()

  const filteredSports = sports.filter(sport => {
    if (filter === 'individual') return !sport.isTeamSport
    if (filter === 'team') return sport.isTeamSport
    return true
  })

  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport)
    navigate(`/matching/${sport.id}`)
  }

  // Handle errors
  if (errorAll) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar los deportes
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar los deportes. Intenta de nuevo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          Selecciona tu Deporte
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Elige el deporte que quieres practicar y encuentra jugadores cerca de ti
        </motion.p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center space-x-4"
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('individual')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'individual'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Individuales
        </button>
        <button
          onClick={() => setFilter('team')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'team'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Equipo
        </button>
      </motion.div>

      {/* Sports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSports.map((sport, index) => (
          <motion.div
            key={sport.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSportSelect(sport)}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            {/* Sport Image */}
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              {sport.imageUrl ? (
                <img
                  src={sport.imageUrl}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <Trophy className="w-16 h-16 text-primary-600" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
            </div>

            {/* Sport Info */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {sport.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {sport.description}
              </p>

              {/* Sport Details */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {sport.minPlayers}-{sport.maxPlayers} jugadores
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sport.isTeamSport
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {sport.isTeamSport ? 'Equipo' : 'Individual'}
                </span>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-primary-600 font-medium text-sm">
                  Encontrar jugadores
                </span>
                <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay deportes disponibles
          </h3>
          <p className="text-gray-600">
            Intenta cambiar el filtro o vuelve más tarde
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default SportSelection;