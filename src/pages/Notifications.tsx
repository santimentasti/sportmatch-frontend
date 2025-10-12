import { useState, useEffect } from 'react'
import { apiService } from '@/services/api'
import { Bell, Check, Trash2, User, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: number
  title: string
  message: string
  notificationType: 'MATCH_FOUND' | 'MESSAGE_RECEIVED' | 'MATCH_REMINDER' | 'SYSTEM'
  isRead: boolean
  createdAt: string
  metadata?: Record<string, string>
}

export default function Notifications() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await apiService.getUserNotifications(0, 50)
      setNotifications(data.content)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Error al cargar notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast.success('Todas las notificaciones marcadas como leídas')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Error al marcar notificaciones')
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }

    // Navigate based on notification type
    if (notification.notificationType === 'MATCH_FOUND' && notification.metadata?.matchId) {
      const conversationId = notification.metadata.conversationId
      if (conversationId) {
        navigate(`/chat/${conversationId}`)
      }
    } else if (notification.notificationType === 'MESSAGE_RECEIVED' && notification.metadata?.conversationId) {
      navigate(`/chat/${notification.metadata.conversationId}`)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'MATCH_FOUND':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'MESSAGE_RECEIVED':
        return <Bell className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead)

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Tienes {unreadCount} {unreadCount === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            No leídas ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
          </h3>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? '¡Perfecto! Estás al día con todas tus notificaciones.'
              : 'Las notificaciones de matches y mensajes aparecerán aquí.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  notification.isRead
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.notificationType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold ${
                        notification.isRead ? 'text-gray-900' : 'text-blue-900'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>

                    <p className={`text-sm mt-1 ${
                      notification.isRead ? 'text-gray-600' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

