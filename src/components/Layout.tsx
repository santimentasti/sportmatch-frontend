import { ReactNode, useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, User, LogOut, MessageCircle, MapPin, Bell, Settings, TrendingUp, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/useStore'
import InstallPWA from './ui/InstallPWA'
import toast from 'react-hot-toast'
import { MOTIVATIONAL_TEXTS } from '@/constants/motivationalTexts'
import { apiService } from '@/services/api'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, currentUser, token } = useStore()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [notificationCount] = useState(3) // TODO: Conectar con backend
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Navegación principal (sin Notificaciones y sin Perfil completo)
  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Sedes', href: '/venues', icon: MapPin },
    { name: 'Deportes', href: '/sports', icon: Users },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Mi Perfil', href: '/profile/stats', icon: User },
  ]

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsProfileMenuOpen(false)
    try {
      // Llamar al endpoint de logout para blacklistear el token
      if (token) {
        await apiService.logout()
      }
    } catch (error) {
      console.error('Error during logout:', error)
      // Continuar con el logout local incluso si falla el backend
    } finally {
      // Limpiar estado local
      logout()
      toast.success(MOTIVATIONAL_TEXTS.auth.logoutSuccess)
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PWA Install Banner */}
      <InstallPWA />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SM</span>
                </div>
                <span className="text-xl font-bold text-gray-900">SportMatch</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.slice(0, 4).map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications Bell */}
              <Link
                to="/notifications"
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>

              {/* Profile Dropdown (Desktop) */}
              {currentUser && (
                <div className="hidden md:block relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentUser.firstName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile/stats"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>Mis Estadísticas</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configuración</span>
                      </Link>
                      <Link
                        to="/matches"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        <span>Mis Matches</span>
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-40">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 active:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-[10px]">{item.name === 'Mi Perfil' ? 'Perfil' : item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default Layout 