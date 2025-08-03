import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, MapPin, Heart, Trophy } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const Home = () => {
  const { sports, setSports, isLoading, setIsLoading } = useStore()

  useEffect(() => {
    const fetchSports = async () => {
      if (sports.length === 0) {
        setIsLoading(true)
        try {
          const sportsData = await apiService.getSports()
          setSports(sportsData)
        } catch (error) {
          console.error('Error fetching sports:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchSports()
  }, [sports.length, setSports, setIsLoading])

  const features = [
    {
      icon: Users,
      title: 'Conecta con Jugadores',
      description: 'Encuentra personas que comparten tu pasión por el deporte'
    },
    {
      icon: MapPin,
      title: 'Ubicación Inteligente',
      description: 'Filtra por distancia y encuentra jugadores cerca de ti'
    },
    {
      icon: Heart,
      title: 'Matching Intuitivo',
      description: 'Sistema tipo Tinder para conectar fácilmente'
    },
    {
      icon: Trophy,
      title: 'Deportes Variados',
      description: 'Desde deportes individuales hasta deportes de equipo'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Conecta con{' '}
            <span className="text-primary-600">jugadores</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra personas que comparten tu pasión por el deporte. 
            Desde tenis hasta fútbol, conecta y juega.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/sports"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Explorar Deportes
          </Link>
          <button className="btn-secondary text-lg px-8 py-3">
            Ver Demo
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="card text-center space-y-4"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto">
              <feature.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Sports Preview */}
      {sports.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Deportes Disponibles
            </h2>
            <p className="text-gray-600">
              Explora los deportes que puedes practicar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sports.slice(0, 6).map((sport, index) => (
              <motion.div
                key={sport.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {sport.imageUrl ? (
                    <img
                      src={sport.imageUrl}
                      alt={sport.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Trophy className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {sport.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {sport.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {sport.isTeamSport ? 'Equipo' : 'Individual'}
                  </span>
                  <span>
                    {sport.minPlayers}-{sport.maxPlayers} jugadores
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/sports"
              className="btn-primary inline-flex items-center"
            >
              Ver Todos los Deportes
              <Users className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home 