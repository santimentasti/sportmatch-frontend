import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { Message } from '@/types'
import { useStore } from '@/store/useStore'

export class WebSocketService {
  private client: Client | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    this.client = new Client({
      // Use SockJS for better browser compatibility
      webSocketFactory: () => new SockJS('/ws'),
      
      connectHeaders: {
        Authorization: `Bearer ${useStore.getState().token}`,
      },
      
      debug: (str) => {
        console.log('WebSocket Debug:', str)
      },
      
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: (frame) => {
        console.log('WebSocket connected:', frame)
        this.reconnectAttempts = 0
        this.subscribeToMessages()
      },
      
      onStompError: (frame) => {
        console.error('WebSocket STOMP error:', frame)
      },
      
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error)
      },
      
      onDisconnect: (frame) => {
        console.log('WebSocket disconnected:', frame)
        this.handleReconnect()
      }
    })
  }

  connect(): void {
    if (!this.client?.active) {
      // Update token before connecting
      this.client!.connectHeaders.Authorization = `Bearer ${useStore.getState().token}`
      this.client?.activate()
    }
  }

  disconnect(): void {
    this.client?.deactivate()
  }

  private subscribeToMessages(): void {
    const userId = useStore.getState().currentUser?.id
    if (!userId || !this.client?.connected) return

    // Subscribe to user-specific message queue
    this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
      try {
        const messageData: Message = JSON.parse(message.body)
        console.log('Received message via WebSocket:', messageData)
        
        // Update store with new message
        this.handleNewMessage(messageData)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    })

    // Subscribe to match notifications
    this.client.subscribe(`/user/${userId}/queue/matches`, (message) => {
      try {
        const matchData = JSON.parse(message.body)
        console.log('Received match notification:', matchData)
        
        // Handle match notification
        this.handleMatchNotification(matchData)
      } catch (error) {
        console.error('Error parsing match notification:', error)
      }
    })
  }

  private handleNewMessage(message: Message): void {
    // You can implement this to update your chat state
    // For now, we'll emit a custom event
    window.dispatchEvent(new CustomEvent('newMessage', { detail: message }))
  }

  private handleMatchNotification(matchData: any): void {
    // Handle match notifications
    window.dispatchEvent(new CustomEvent('newMatch', { detail: matchData }))
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  sendMessage(conversationId: number, content: string): void {
    if (!this.client?.connected) {
      console.error('WebSocket not connected')
      return
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        conversationId,
        content,
        messageType: 'TEXT'
      })
    })
  }

  joinConversation(conversationId: number): void {
    if (!this.client?.connected) {
      console.error('WebSocket not connected')
      return
    }

    this.client.publish({
      destination: '/app/chat.join',
      body: JSON.stringify(conversationId)
    })
  }

  isConnected(): boolean {
    return this.client?.connected || false
  }
}

// Singleton instance
export const webSocketService = new WebSocketService()
export default webSocketService
