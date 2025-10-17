import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Activity,
  ChevronRight,
  LogOut,
  Settings
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import { MOTIVATIONAL_TEXTS } from '@/constants/motivationalTexts'
import type { UserStats } from '@/types'

const ProfileEnhanced = () => {
  const { currentUser, logout, token } = useStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return

      setIsLoading(true)
      try {
        const userStats = await apiService.getMyStats()
        setStats(userStats)
      } catch (error) {
        console.error('Error fetching user stats:', error)
        toast.error('Error al cargar estadísticas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [currentUser])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!stats || !currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
      </div>
    )
  }

  const memberSince = new Date(stats.memberSince).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Tus estadísticas y logros</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              {stats.imageUrl ? (
                <img
                  src={stats.imageUrl}
                  alt={`${stats.firstName} ${stats.lastName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-16 h-16 text-primary-600" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {stats.firstName} {stats.lastName}
              </h2>
              <p className="text-gray-600">{stats.email}</p>
              <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                Miembro desde {memberSince}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-lg">
                <Trophy className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">
                  {stats.totalMatches} Matches
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-lg">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  {stats.averageRating.toFixed(1)} ⭐
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {stats.achievements.length} Logros
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to="/profile" className="btn-secondary text-sm">
                Editar Perfil
              </Link>
              <Link to="/sport-profile" className="btn-secondary text-sm">
                <Trophy className="w-4 h-4 mr-1" />
                Deportes
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center space-y-2"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalMatches}</p>
          <p className="text-sm text-gray-600">Total de Matches</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card text-center space-y-2"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completedMatches}</p>
          <p className="text-sm text-gray-600">Completados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center space-y-2"
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
          <p className="text-sm text-gray-600">Calificación Promedio</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card text-center space-y-2"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingMatches}</p>
          <p className="text-sm text-gray-600">Pendientes</p>
        </motion.div>
      </div>

      {/* Sport Stats */}
      {stats.sportStats && stats.sportStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Mis Deportes
          </h3>
          <div className="space-y-3">
            {stats.sportStats.map((sportStat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{sportStat.sportName}</p>
                    <p className="text-sm text-gray-600">Nivel: {sportStat.skillLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {sportStat.matchesPlayed} matches
                  </p>
                  {sportStat.averageRating > 0 && (
                    <p className="text-xs text-gray-600">
                      ⭐ {sportStat.averageRating.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      {stats.achievements && stats.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Logros Desbloqueados
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement, index) => {
              const [iconAndTitle, motivation] = achievement.split('|')
              const emoji = iconAndTitle.split(' ')[0]
              const title = iconAndTitle.split(' ').slice(1).join(' ')
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-primary-900 mb-1">
                        {title}
                      </p>
                      <p className="text-sm text-primary-700 leading-relaxed">
                        {motivation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card space-y-3"
      >
        <h3 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h3>
        <div className="space-y-2">
          <Link
            to="/matches"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900">Ver Mis Matches</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            to="/matching"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900">Buscar Jugadores</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            to="/chat"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900">Mis Conversaciones</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            to="/profile"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Configuración</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </motion.div>

      {/* Logout Section (Mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="md:hidden card"
      >
        <button
          onClick={async () => {
            try {
              if (token) {
                await apiService.logout()
              }
            } catch (error) {
              console.error('Error during logout:', error)
            } finally {
              logout()
              toast.success(MOTIVATIONAL_TEXTS.auth.logoutSuccess)
              navigate('/login', { replace: true })
            }
          }}
          className="flex items-center justify-center gap-2 w-full p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </motion.div>
    </div>
  )
}

export default ProfileEnhanced

