import { useState, useEffect, useMemo } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { apiService } from '@/services/api'
import { Venue, Sport } from '@/types'
import { useStore } from '@/store/useStore'
import { MapPin, Phone, Globe, Navigation, Filter, X } from 'lucide-react'
import toast from 'react-hot-toast'

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)', // Full height minus header
}

// Buenos Aires centro por defecto
const defaultCenter = {
  lat: -34.6037,
  lng: -58.3816,
}

export default function VenueMap() {
  const { currentUser } = useStore()
  const [venues, setVenues] = useState<Venue[]>([])
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState<number>(10)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Determinar el centro del mapa
  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation
    if (currentUser?.latitude && currentUser?.longitude) {
      return { lat: currentUser.latitude, lng: currentUser.longitude }
    }
    return defaultCenter
  }, [userLocation, currentUser])

  // Cargar deportes disponibles
  useEffect(() => {
    loadSports()
    loadUserLocation()
  }, [])

  // Cargar venues cuando cambian los filtros
  useEffect(() => {
    loadVenues()
  }, [selectedSportId, userLocation, radius])

  const loadSports = async () => {
    try {
      const data = await apiService.getAllSports()
      setSports(data)
    } catch (error) {
      console.error('Error loading sports:', error)
    }
  }

  const loadUserLocation = () => {
    // Primero intentar con la ubicación del usuario guardada
    if (currentUser?.latitude && currentUser?.longitude) {
      setUserLocation({ lat: currentUser.latitude, lng: currentUser.longitude })
      return
    }

    // Si no, intentar obtener ubicación del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('No se pudo obtener tu ubicación')
        }
      )
    }
  }

  const loadVenues = async () => {
    setIsLoading(true)
    try {
      let data: Venue[]

      const lat = userLocation?.lat || currentUser?.latitude || defaultCenter.lat
      const lng = userLocation?.lng || currentUser?.longitude || defaultCenter.lng

      if (selectedSportId) {
        // Búsqueda combinada: deporte + ubicación
        data = await apiService.searchVenues(selectedSportId, lat, lng, radius)
      } else {
        // Solo por ubicación
        data = await apiService.getVenuesNearby(lat, lng, radius)
      }

      setVenues(data)
    } catch (error) {
      console.error('Error loading venues:', error)
      toast.error('Error al cargar sedes deportivas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSportFilter = (sportId: number | null) => {
    setSelectedSportId(sportId)
    setShowFilters(false)
  }

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius)
  }

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue)
  }

  const handleInfoWindowClose = () => {
    setSelectedVenue(null)
  }

  const handleGetDirections = (venue: Venue) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`
    window.open(url, '_blank')
  }

  return (
    <div className="relative h-full">
      {/* Filters Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>

        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Sport Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deporte
            </label>
            <select
              value={selectedSportId || ''}
              onChange={(e) => handleSportFilter(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los deportes</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radio: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Results Count */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                'Cargando...'
              ) : (
                <>
                  <span className="font-semibold text-blue-600">{venues.length}</span>{' '}
                  {venues.length === 1 ? 'sede encontrada' : 'sedes encontradas'}
                </>
              )}
            </p>
          </div>

          {/* Refresh Location Button */}
          <button
            onClick={loadUserLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Actualizar mi ubicación
          </button>
        </div>
      </div>

      {/* Map */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={13}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
              title="Tu ubicación"
            />
          )}

          {/* Venue Markers */}
          {venues.map((venue) => (
            <Marker
              key={venue.id}
              position={{ lat: venue.latitude, lng: venue.longitude }}
              onClick={() => handleMarkerClick(venue)}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
              title={venue.name}
            />
          ))}

          {/* Info Window */}
          {selectedVenue && (
            <InfoWindow
              position={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-lg mb-2">{selectedVenue.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <p className="text-gray-700">{selectedVenue.address}</p>
                  </div>

                  {selectedVenue.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a
                        href={`tel:${selectedVenue.phoneNumber}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedVenue.phoneNumber}
                      </a>
                    </div>
                  )}

                  {selectedVenue.websiteUrl && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={selectedVenue.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Sitio web
                      </a>
                    </div>
                  )}

                  {selectedVenue.distanceKm !== undefined && (
                    <p className="text-gray-600">
                      A <span className="font-semibold">{selectedVenue.distanceKm} km</span> de ti
                    </p>
                  )}

                  {/* Supported Sports */}
                  {selectedVenue.supportedSports.length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Deportes disponibles:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedVenue.supportedSports.map((sport) => (
                          <span
                            key={sport.id}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {sport.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Get Directions Button */}
                  <button
                    onClick={() => handleGetDirections(selectedVenue)}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Cómo llegar
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Venues List (Mobile) */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl max-h-64 overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-3">
            Sedes cercanas ({venues.length})
          </h3>
          <div className="space-y-2">
            {venues.map((venue) => (
              <button
                key={venue.id}
                onClick={() => handleMarkerClick(venue)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium">{venue.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{venue.address}</p>
                {venue.distanceKm !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">{venue.distanceKm} km</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

