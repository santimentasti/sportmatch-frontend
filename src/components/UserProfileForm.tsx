import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, User, Save, Loader2 } from 'lucide-react'
import { useUpdateUserLocation, useUpdateUserMaxDistance } from '@/hooks/useApi'
import { toast } from 'react-hot-toast'

interface UserProfileFormProps {
  userId: number
  currentLatitude?: number
  currentLongitude?: number
  currentMaxDistance?: number
}

const UserProfileForm = ({ 
  userId, 
  currentLatitude, 
  currentLongitude, 
  currentMaxDistance = 10 
}: UserProfileFormProps) => {
  const [latitude, setLatitude] = useState(currentLatitude || 0)
  const [longitude, setLongitude] = useState(currentLongitude || 0)
  const [maxDistance, setMaxDistance] = useState(currentMaxDistance)

  // React Query mutations
  const updateLocationMutation = useUpdateUserLocation()
  const updateDistanceMutation = useUpdateUserMaxDistance()

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          toast.success('Ubicación obtenida correctamente')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('No se pudo obtener tu ubicación')
        }
      )
    } else {
      toast.error('Tu navegador no soporta geolocalización')
    }
  }

  const handleUpdateLocation = async () => {
    if (latitude === 0 && longitude === 0) {
      toast.error('Por favor, obtén tu ubicación actual primero')
      return
    }

    try {
      await updateLocationMutation.mutateAsync({ 
        id: userId, 
        latitude, 
        longitude 
      })
      toast.success('Ubicación actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la ubicación')
    }
  }

  const handleUpdateDistance = async () => {
    try {
      await updateDistanceMutation.mutateAsync({ 
        id: userId, 
        maxDistanceKm: maxDistance 
      })
      toast.success('Distancia máxima actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la distancia máxima')
    }
  }

  const isLocationLoading = updateLocationMutation.isPending
  const isDistanceLoading = updateDistanceMutation.isPending

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary-600" />
          Ubicación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitud
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitud
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.000000"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGetCurrentLocation}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Obtener ubicación actual
          </button>
          
          <button
            onClick={handleUpdateLocation}
            disabled={isLocationLoading}
            className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocationLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLocationLoading ? 'Actualizando...' : 'Actualizar ubicación'}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" />
          Preferencias de búsqueda
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distancia máxima de búsqueda (km)
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1 km</span>
            <span className="font-medium text-primary-600">{maxDistance} km</span>
            <span>50 km</span>
          </div>
        </div>

        <button
          onClick={handleUpdateDistance}
          disabled={isDistanceLoading}
          className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDistanceLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isDistanceLoading ? 'Actualizando...' : 'Actualizar distancia'}
        </button>
      </motion.div>

      {/* Status indicators */}
      {(updateLocationMutation.isSuccess || updateDistanceMutation.isSuccess) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-md p-4"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Perfil actualizado correctamente
              </p>
              <p className="text-sm text-green-700">
                Los cambios se han guardado y se aplicarán en tu próxima búsqueda
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default UserProfileForm
