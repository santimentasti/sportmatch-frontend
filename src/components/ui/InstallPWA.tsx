import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

const InstallPWA = () => {
  const { canInstall, isInstalled, installApp } = usePWA()
  const [isVisible, setIsVisible] = useState(true)

  if (isInstalled || !canInstall || !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-primary-600 text-white p-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6" />
            <div>
              <p className="font-medium">Instalar SportMatch</p>
              <p className="text-sm text-primary-100">
                Accede más rápido desde tu pantalla de inicio
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={installApp}
              className="flex items-center space-x-2 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Instalar</span>
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InstallPWA 