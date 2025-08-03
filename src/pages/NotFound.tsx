import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, Users } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="text-8xl font-bold text-primary-600">404</div>
          <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Página no encontrada
          </h1>
          <p className="text-gray-600 text-lg">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir al Inicio
          </Link>
          
          <Link
            to="/sports"
            className="btn-secondary inline-flex items-center justify-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Explorar Deportes
          </Link>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Páginas populares
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/sports"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Deportes</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Mi Perfil</span>
            </Link>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver atrás
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound 