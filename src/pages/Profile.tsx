import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Settings, MapPin, Edit, Save, X, Camera, Bell, Shield, Trophy } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { apiService } from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const Profile = () => {
  const { currentUser, setCurrentUser, userLocation, setUserLocation, maxDistance, setMaxDistance } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    maxDistanceKm: 10
  })

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber || '',
        maxDistanceKm: currentUser.maxDistanceKm
      })
    }
  }, [currentUser])

  const handleSave = async () => {
    if (!currentUser) return

    setIsLoading(true)
    try {
      // TODO: Implement user update API call
      // const updatedUser = await apiService.updateUser(currentUser.id, formData)
      // setCurrentUser(updatedUser)
      
      toast.success('Perfil actualizado correctamente')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber || '',
        maxDistanceKm: currentUser.maxDistanceKm
      })
    }
    setIsEditing(false)
  }

  const handleLocationUpdate = async () => {
    if ('geolocation' in navigator) {
      setIsLoading(true)
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          })
        })

        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        
        // TODO: Update user location in backend
        // await apiService.updateUserLocation(currentUser?.id || 1, latitude, longitude)
        
        toast.success('Ubicación actualizada')
      } catch (error) {
        console.error('Error getting location:', error)
        toast.error('Error al obtener la ubicación')
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error('Geolocalización no disponible')
    }
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Mi Perfil
        </motion.h1>
        <p className="text-gray-600">
          Gestiona tu información personal y preferencias
        </p>
        <Link
          to="/sport-profile"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Configurar Deportes
        </Link>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card space-y-6"
      >
        {/* Profile Image */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-16 h-16 text-primary-600" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary inline-flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </button>
          )}
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  placeholder="Tu nombre"
                />
              ) : (
                <p className="text-gray-900">{currentUser.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  placeholder="Tu apellido"
                />
              ) : (
                <p className="text-gray-900">{currentUser.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="tu@email.com"
              />
            ) : (
              <p className="text-gray-900">{currentUser.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="input-field"
                placeholder="+34 600 000 000"
              />
            ) : (
              <p className="text-gray-900">{currentUser.phoneNumber || 'No especificado'}</p>
            )}
          </div>

          {/* Location Section */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Ubicación</span>
              </div>
              <button
                onClick={handleLocationUpdate}
                disabled={isLoading}
                className="btn-secondary text-sm"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Actualizar'
                )}
              </button>
            </div>
            
            {userLocation ? (
              <p className="text-sm text-gray-600">
                Lat: {userLocation.latitude.toFixed(4)}, 
                Lng: {userLocation.longitude.toFixed(4)}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Ubicación no configurada
              </p>
            )}
          </div>

          {/* Distance Preference */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distancia máxima de búsqueda: {maxDistance}km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1km</span>
              <span>50km</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleCancel}
              className="btn-secondary"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Configuración
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Notificaciones</p>
                <p className="text-sm text-gray-600">Recibir alertas de nuevos matches</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Privacidad</p>
                <p className="text-sm text-gray-600">Mostrar mi ubicación a otros usuarios</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile 