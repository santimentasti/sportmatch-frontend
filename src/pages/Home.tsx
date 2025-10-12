import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, MapPin, Heart, Trophy } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { MOTIVATIONAL_TEXTS } from '@/constants/motivationalTexts'

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
      title: 'Crece con tu Comunidad',
      description: 'Encuentra aliados que te impulsan a ser mejor cada día'
    },
    {
      icon: MapPin,
      title: 'Oportunidades Cerca de Ti',
      description: 'Tu próximo desafío está a la vuelta de la esquina'
    },
    {
      icon: Heart,
      title: 'Conexiones Perfectas',
      description: 'Encuentra tu match deportivo ideal al instante'
    },
    {
      icon: Trophy,
      title: 'Sin Límites',
      description: 'Desafíate en cualquier deporte, expande tus horizontes'
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
            Cada día es una{' '}
            <span className="text-primary-600">oportunidad</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Supérate, conecta con tu comunidad y vive el deporte como nunca antes. 
            Tu mejor versión te está esperando.
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
              {MOTIVATIONAL_TEXTS.home.cta}
            </Link>
          <Link
            to="/sport-profile"
            className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Configurar Perfil Deportivo
          </Link>
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
      
    </div>
  )
}

export default Home 