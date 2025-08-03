import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface PWAState {
  isInstalled: boolean
  isOnline: boolean
  canInstall: boolean
  deferredPrompt: any
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    canInstall: false,
    deferredPrompt: null
  })

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Check if app is installed
    const checkIfInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      
      setPwaState(prev => ({ ...prev, isInstalled }))
    }

    // Handle online/offline status
    const handleOnlineStatus = () => {
      setPwaState(prev => ({ ...prev, isOnline: navigator.onLine }))
      
      if (navigator.onLine) {
        toast.success('Conexión restaurada')
      } else {
        toast.error('Sin conexión a internet')
      }
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaState(prev => ({ 
        ...prev, 
        canInstall: true, 
        deferredPrompt: e 
      }))
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false 
      }))
      toast.success('¡SportMatch instalado correctamente!')
    }

    // Event listeners
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Initial checks
    checkIfInstalled()

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Install app function
  const installApp = async () => {
    if (pwaState.deferredPrompt) {
      pwaState.deferredPrompt.prompt()
      const { outcome } = await pwaState.deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setPwaState(prev => ({ 
        ...prev, 
        deferredPrompt: null,
        canInstall: false 
      }))
    }
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        toast.success('Notificaciones activadas')
        return true
      } else {
        toast.error('Permisos de notificación denegados')
        return false
      }
    }
    return false
  }

  // Send test notification
  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SportMatch', {
        body: '¡Nuevo match disponible!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png'
      })
    }
  }

  return {
    ...pwaState,
    installApp,
    requestNotificationPermission,
    sendTestNotification
  }
} 