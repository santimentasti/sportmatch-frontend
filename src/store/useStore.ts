import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Sport, User } from '@/types'

interface AppState {
  // Auth state
  currentUser: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setCurrentUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  logout: () => void
  
  // Sports state
  sports: Sport[]
  selectedSport: Sport | null
  setSports: (sports: Sport[]) => void
  setSelectedSport: (sport: Sport | null) => void
  
  // Matching state
  potentialMatches: User[]
  currentMatchIndex: number
  setPotentialMatches: (matches: User[]) => void
  setCurrentMatchIndex: (index: number) => void
  nextMatch: () => void
  previousMatch: () => void
  
  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Location state
  userLocation: { latitude: number; longitude: number } | null
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void
  
  // Settings
  maxDistance: number
  setMaxDistance: (distance: number) => void
  
  // Reset state
  reset: () => void
}

const initialState = {
  currentUser: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  sports: [],
  selectedSport: null,
  potentialMatches: [],
  currentMatchIndex: 0,
  isLoading: false,
  userLocation: null,
  maxDistance: 10,
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentUser: (user) => set({ 
        currentUser: user, 
        isAuthenticated: !!user 
      }),
      
      setToken: (token) => set({ token }),
      
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      
      logout: () => set({ 
        currentUser: null, 
        token: null, 
        refreshToken: null, 
        isAuthenticated: false 
      }),
      
      setSports: (sports) => set({ sports }),
      setSelectedSport: (sport) => set({ selectedSport: sport }),
      
      setPotentialMatches: (matches) => set({ 
        potentialMatches: matches, 
        currentMatchIndex: 0 
      }),
      
      setCurrentMatchIndex: (index) => set({ currentMatchIndex: index }),
      
      nextMatch: () => {
        const { currentMatchIndex, potentialMatches } = get()
        if (currentMatchIndex < potentialMatches.length - 1) {
          set({ currentMatchIndex: currentMatchIndex + 1 })
        }
      },
      
      previousMatch: () => {
        const { currentMatchIndex } = get()
        if (currentMatchIndex > 0) {
          set({ currentMatchIndex: currentMatchIndex - 1 })
        }
      },
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setUserLocation: (location) => set({ userLocation: location }),
      
      setMaxDistance: (distance) => set({ maxDistance: distance }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'sportmatch-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        selectedSport: state.selectedSport,
        userLocation: state.userLocation,
        maxDistance: state.maxDistance,
      }),
    }
  )
) 