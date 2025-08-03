import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Sport, User, Match, MatchResult } from '@/types'

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

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
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
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
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

  async processLike(userId: number, targetUserId: number, sportId: number): Promise<MatchResult> {
    const response: AxiosResponse<MatchResult> = await this.api.post('/matching/like', null, {
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
}

  // Auth API
  async login(request: AuthRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', request)
    return response.data
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', request)
    return response.data
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/refresh', null, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    })
    return response.data
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout')
  }
}

export const apiService = new ApiService()
export default apiService 