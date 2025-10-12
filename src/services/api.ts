import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Sport, User, MatchResult, Conversation, Message, SendMessageRequest, Venue, UserStats } from '@/types'
import { useStore } from '@/store/useStore'

interface AuthRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

interface AuthResponse {
  token: string
  refreshToken: string
  user: User
  message: string
}

class ApiService {
  private api: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken()
        const headers = (config.headers || {}) as Record<string, any>
        if (token && !headers.Authorization) {
          config.headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          } as any
        } else if (Object.keys(headers).length) {
          config.headers = headers as any
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config || {}
        const status = error.response?.status
        const isAuthRefresh = (originalRequest.url || '').includes('/auth/refresh')

        if (status === 401 && !isAuthRefresh) {
          // Avoid infinite loops
          if (originalRequest._retry) {
            this.handleUnauthorized()
            return Promise.reject(error)
          }
          originalRequest._retry = true

          try {
            const newToken = await this.getRefreshedAccessToken()
            originalRequest.headers = {
              ...(originalRequest.headers as any),
              Authorization: `Bearer ${newToken}`,
            } as any
            return this.api(originalRequest)
          } catch (refreshError) {
            this.handleUnauthorized()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getAccessToken(): string | null {
    try {
      return useStore.getState().token
    } catch {
      return null
    }
  }

  private getRefreshToken(): string | null {
    try {
      return useStore.getState().refreshToken
    } catch {
      return null
    }
  }

  private setTokens(token: string, refreshToken: string) {
    try {
      useStore.getState().setToken(token)
      useStore.getState().setRefreshToken(refreshToken)
    } catch {}
  }

  private handleUnauthorized() {
    try {
      useStore.getState().logout()
    } catch {}
    window.location.href = '/login'
  }

  private async getRefreshedAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return Promise.reject(new Error('No refresh token'))

    this.refreshPromise = (async () => {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        '/auth/refresh',
        null,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      )
      this.setTokens(response.data.token, response.data.refreshToken)
      this.refreshPromise = null
      return response.data.token
    })()

    try {
      return await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  // Sports API
  async getSports(): Promise<Sport[]> {
    const response: AxiosResponse<Sport[]> = await this.api.get('/sports')
    return response.data
  }

  async getSportById(id: number): Promise<Sport> {
    const response: AxiosResponse<Sport> = await this.api.get(`/sports/${id}`)
    return response.data
  }

  async getIndividualSports(): Promise<Sport[]> {
    const response: AxiosResponse<Sport[]> = await this.api.get('/sports/individual')
    return response.data
  }

  async getTeamSports(): Promise<Sport[]> {
    const response: AxiosResponse<Sport[]> = await this.api.get('/sports/team')
    return response.data
  }

  // Users API
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users')
    return response.data
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`)
    return response.data
  }

  async getUserProfile(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}/profile`)
    return response.data
  }

  async updateUserLocation(id: number, latitude: number, longitude: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}/location`, null, {
      params: { latitude, longitude }
    })
    return response.data
  }

  async updateUserMaxDistance(id: number, maxDistanceKm: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}/distance`, null, {
      params: { maxDistanceKm }
    })
    return response.data
  }

  async saveUserSports(userId: number, sports: Array<{ sportId: number; skillLevel: string }>): Promise<void> {
    await this.api.post(`/users/${userId}/sports`, sports)
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const response: AxiosResponse<UserStats> = await this.api.get(`/users/${userId}/stats`)
    return response.data
  }

  async getMyStats(): Promise<UserStats> {
    const response: AxiosResponse<UserStats> = await this.api.get(`/users/me/stats`)
    return response.data
  }

  // Matching API
  async getPotentialMatches(
    userId: number,
    sportId: number,
    latitude?: number,
    longitude?: number,
    maxDistanceKm: number = 10
  ): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/matching/potential-matches', {
      params: {
        userId,
        sportId,
        latitude,
        longitude,
        maxDistanceKm
      }
    })
    return response.data
  }

  async processLike(userId: number, targetUserId: number, sportId: number): Promise<string> {
    const response: AxiosResponse<string> = await this.api.post('/matching/like', null, {
      params: {
        userId,
        targetUserId,
        sportId
      }
    })
    return response.data
  }

  async processDislike(userId: number, targetUserId: number, sportId: number): Promise<void> {
    await this.api.post('/matching/dislike', null, {
      params: {
        userId,
        targetUserId,
        sportId
      }
    })
  }
  // Auth API
  async login(request: AuthRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', request)
    // Sync tokens with store immediately
    this.setTokens(response.data.token, response.data.refreshToken)
    return response.data
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', request)
    this.setTokens(response.data.token, response.data.refreshToken)
    return response.data
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/refresh', null, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    })
    this.setTokens(response.data.token, response.data.refreshToken)
    return response.data
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout')
    try { useStore.getState().logout() } catch {}
  }

  // Generic HTTP methods (DRY principle)
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, { params })
    return response.data
  }

  async put<T>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, { params })
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url)
    return response.data
  }

  // Chat API
  async getConversations(): Promise<Conversation[]> {
    return this.get<Conversation[]>('/chat/conversations')
  }

  async getConversationMessages(
    conversationId: number,
    page: number = 0,
    size: number = 20
  ): Promise<{ content: Message[]; totalPages: number; totalElements: number }> {
    return this.get(`/chat/conversations/${conversationId}/messages`, { page, size })
  }

  async sendMessage(request: SendMessageRequest): Promise<Message> {
    return this.post<Message>('/chat/messages', request)
  }

  async getOrCreateConversation(otherUserId: number, matchId?: number): Promise<Conversation> {
    return this.post<Conversation>('/chat/conversations', null, { otherUserId, matchId })
  }

  async markMessagesAsRead(conversationId: number): Promise<void> {
    return this.put<void>(`/chat/conversations/${conversationId}/read`, null)
  }

  async getUnreadMessageCount(): Promise<number> {
    return this.get<number>('/chat/unread-count')
  }

  // Venue API
  async getAllVenues(): Promise<Venue[]> {
    return this.get<Venue[]>('/venues')
  }

  async getVenueById(id: number): Promise<Venue> {
    return this.get<Venue>(`/venues/${id}`)
  }

  async getVenuesBySport(sportId: number): Promise<Venue[]> {
    return this.get<Venue[]>(`/venues/sport/${sportId}`)
  }

  async getVenuesNearby(latitude: number, longitude: number, radius: number = 10): Promise<Venue[]> {
    return this.get<Venue[]>('/venues/nearby', { latitude, longitude, radius })
  }

  async searchVenues(sportId: number, latitude: number, longitude: number, radius: number = 10): Promise<Venue[]> {
    return this.get<Venue[]>('/venues/search', { sportId, latitude, longitude, radius })
  }
}

export const apiService = new ApiService()
export default apiService 