import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Trophy, Check, ChevronRight, 
  MapPin, Navigation, Save, Loader2, ArrowRight 
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface UserSport {
  sportId: number
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  preferredTime?: string
  preferredDays?: string
}

const SportProfile = () => {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, setUserLocation } = useStore()
  const [step, setStep] = useState(1)
  const [selectedSports, setSelectedSports] = useState<UserSport[]>([])
  const [currentSport, setCurrentSport] = useState<number | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Fetch sports
  const { data: sports, isLoading: sportsLoading } = useQuery({
    queryKey: ['sports'],
    queryFn: () => apiService.getSports(),
  })

  useEffect(() => {
    if (currentUser?.latitude && currentUser?.longitude) {
      setLocation({
        latitude: currentUser.latitude,
        longitude: currentUser.longitude
      })
    }
  }, [currentUser])

  const skillLevels = [
    { value: 'BEGINNER', label: 'Principiante', icon: '🌱', description: 'Recién empezando' },
    { value: 'INTERMEDIATE', label: 'Intermedio', icon: '⚡', description: 'Juego regularmente' },
    { value: 'ADVANCED', label: 'Avanzado', icon: '🔥', description: 'Nivel competitivo' },
    { value: 'EXPERT', label: 'Experto', icon: '👑', description: 'Nivel profesional' },
  ]

  // TODO: These will be used for scheduling preferences in future iterations
  // const timePreferences = [
  //   { value: 'morning', label: 'Mañana (6-12)' },
  //   { value: 'afternoon', label: 'Tarde (12-18)' },
  //   { value: 'evening', label: 'Noche (18-00)' },
  //   { value: 'night', label: 'Madrugada (00-6)' },
  // ]

  // const dayPreferences = [
  //   { value: 'monday', label: 'Lun' },
  //   { value: 'tuesday', label: 'Mar' },
  //   { value: 'wednesday', label: 'Mié' },
  //   { value: 'thursday', label: 'Jue' },
  //   { value: 'friday', label: 'Vie' },
  //   { value: 'saturday', label: 'Sáb' },
  //   { value: 'sunday', label: 'Dom' },
  // ]

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Tu navegador no soporta geolocalización')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setIsGettingLocation(false)
        toast.success('Ubicación obtenida')
      },
      (error) => {
        console.error('Error getting location:', error)
        setIsGettingLocation(false)
        
        let errorMessage = 'No se pudo obtener la ubicación'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Por favor, actívalo en tu navegador.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.'
            break
        }
        toast.error(errorMessage, { duration: 5000 })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const toggleSport = (sportId: number) => {
    const exists = selectedSports.find(s => s.sportId === sportId)
    if (exists) {
      setSelectedSports(selectedSports.filter(s => s.sportId !== sportId))
    } else {
      setCurrentSport(sportId)
      setStep(2)
    }
  }

  const handleSkillSelect = (level: string) => {
    if (!currentSport) return
    
    const newSport: UserSport = {
      sportId: currentSport,
      skillLevel: level as UserSport['skillLevel'],
    }
    
    setSelectedSports([...selectedSports.filter(s => s.sportId !== currentSport), newSport])
    setCurrentSport(null)
    setStep(1)
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error('No user')
      
      // Update location
      if (location && location.latitude !== 0 && location.longitude !== 0) {
        await apiService.updateUserLocation(currentUser.id, location.latitude, location.longitude)
        setUserLocation(location)
      }
      
      // Save user sports with skill levels
      if (selectedSports.length > 0) {
        await apiService.saveUserSports(currentUser.id, selectedSports)
      }
      
      // Update current user with new location
      const updatedUser = {
        ...currentUser,
        latitude: location?.latitude,
        longitude: location?.longitude
      }
      setCurrentUser(updatedUser)
      
      return true
    },
    onSuccess: () => {
      toast.success('¡Perfil deportivo guardado exitosamente!')
      // Don't navigate away, allow user to keep editing
    },
    onError: (error: any) => {
      console.error('Error saving sport profile:', error)
      toast.error(error.response?.data?.message || 'Error al guardar el perfil')
    }
  })

  const handleSave = () => {
    if (selectedSports.length === 0) {
      toast.error('Selecciona al menos un deporte')
      return
    }
    if (!location || location.latitude === 0 || location.longitude === 0) {
      toast.error('Por favor, configura tu ubicación')
      return
    }
    saveMutation.mutate()
  }

  const handleSaveAndContinue = () => {
    if (selectedSports.length === 0) {
      toast.error('Selecciona al menos un deporte')
      return
    }
    if (!location || location.latitude === 0 || location.longitude === 0) {
      toast.error('Por favor, configura tu ubicación')
      return
    }
    
    saveMutation.mutate()
    // Navigate after successful save
    setTimeout(() => {
      if (!saveMutation.isError) {
        navigate('/')
      }
    }, 1000)
  }

  if (sportsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Trophy className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 1 ? 'Crea tu Perfil Deportivo' : 'Selecciona tu Nivel'}
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 1 
              ? 'Selecciona los deportes que practicas'
              : 'Indica tu nivel de habilidad'
            }
          </p>
        </motion.div>

        {/* Step 1: Select Sports */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Location Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Ubicación</h3>
                </div>
                <button
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="btn-secondary text-sm"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Obtener automática
                    </>
                  )}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={location?.latitude || ''}
                      onChange={(e) => setLocation({
                        latitude: parseFloat(e.target.value) || 0,
                        longitude: location?.longitude || 0
                      })}
                      className="input-field"
                      placeholder="Ej: -34.6037"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={location?.longitude || ''}
                      onChange={(e) => setLocation({
                        latitude: location?.latitude || 0,
                        longitude: parseFloat(e.target.value) || 0
                      })}
                      className="input-field"
                      placeholder="Ej: -58.3816"
                    />
                  </div>
                </div>
                
                {location && location.latitude !== 0 && location.longitude !== 0 ? (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Ubicación configurada: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Ingresa tus coordenadas manualmente o usa el botón automático
                  </p>
                )}
                
                <p className="text-xs text-gray-400">
                  💡 Tip: Busca tu ciudad en Google Maps, click derecho y copia las coordenadas
                </p>
              </div>
            </div>

            {/* Sports Grid */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Deportes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sports?.map((sport) => {
                  const isSelected = selectedSports.some(s => s.sportId === sport.id)
                  
                  return (
                    <button
                      key={sport.id}
                      onClick={() => toggleSport(sport.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {sport.imageUrl && (
                        <img
                          src={sport.imageUrl}
                          alt={sport.name}
                          className="w-12 h-12 mx-auto mb-2 rounded-full object-cover"
                        />
                      )}
                      <p className="font-medium text-gray-900">{sport.name}</p>
                      {isSelected && (
                        <>
                          <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                          </div>
                          <p className="text-xs text-primary-600 mt-1">
                            {selectedSports.find(s => s.sportId === sport.id)?.skillLevel}
                          </p>
                        </>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedSports.length > 0 && location && location.latitude !== 0 && location.longitude !== 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="btn-secondary flex-1"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveAndContinue}
                  disabled={saveMutation.isPending}
                  className="btn-primary flex-1"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Guardar y Continuar
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Select Skill Level */}
        {step === 2 && currentSport && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => {
                setStep(1)
                setCurrentSport(null)
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Volver
            </button>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                {sports?.find(s => s.id === currentSport)?.name}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Selecciona tu nivel de habilidad
              </p>

              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleSkillSelect(level.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-300 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">{level.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-primary-600">
                            {level.label}
                          </p>
                          <p className="text-sm text-gray-500">{level.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SportProfile

