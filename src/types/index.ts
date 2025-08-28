export interface Sport {
  id: number
  name: string
  description: string
  isTeamSport: boolean
  minPlayers: number
  maxPlayers: number
  imageUrl: string
  isActive: boolean
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  profileImage?: string
  phoneNumber?: string
  latitude?: number
  longitude?: number
  maxDistanceKm: number
  isActive: boolean
}

export interface UserSport {
  id: number
  user: User
  sport: Sport
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  isLookingForMatch: boolean
  preferredTime?: string
  preferredDays?: string
  createdAt: string
}

export interface Match {
  id: number
  sport: Sport
  venue?: Venue
  matchDate?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  isTeamMatch: boolean
  minPlayersRequired: number
  maxPlayersAllowed: number
  createdAt: string
  participants: MatchParticipant[]
}

export interface MatchParticipant {
  id: number
  match: Match
  user: User
  status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'CONFIRMED'
  joinedAt?: string
  createdAt: string
}

export interface Venue {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  phoneNumber?: string
  websiteUrl?: string
  isActive: boolean
  supportedSports: Sport[]
}

export interface MatchResult {
  isMatch: boolean
  targetUserId: number
  message: string
  matchId?: number
  status: 'LIKE_STORED' | 'MATCH_CREATED' | 'TEAM_MATCH_PENDING'
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
} 