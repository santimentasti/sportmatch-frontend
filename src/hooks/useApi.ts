import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { Sport, User, MatchResult } from '@/types'

// Query keys for better cache management
export const queryKeys = {
  sports: ['sports'] as const,
  sport: (id: number) => ['sport', id] as const,
  individualSports: ['sports', 'individual'] as const,
  teamSports: ['sports', 'team'] as const,
  users: ['users'] as const,
  user: (id: number) => ['user', id] as const,
  userProfile: (id: number) => ['user', id, 'profile'] as const,
  potentialMatches: (userId: number, sportId: number, params?: any) => 
    ['potential-matches', userId, sportId, params] as const,
}

// Sports hooks
export const useSports = () => {
  return useQuery({
    queryKey: queryKeys.sports,
    queryFn: () => apiService.getSports(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSport = (id: number) => {
  return useQuery({
    queryKey: queryKeys.sport(id),
    queryFn: () => apiService.getSportById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useIndividualSports = () => {
  return useQuery({
    queryKey: queryKeys.individualSports,
    queryFn: () => apiService.getIndividualSports(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useTeamSports = () => {
  return useQuery({
    queryKey: queryKeys.teamSports,
    queryFn: () => apiService.getTeamSports(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Users hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiService.getUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUser = (id: number) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useUserProfile = (id: number) => {
  return useQuery({
    queryKey: queryKeys.userProfile(id),
    queryFn: () => apiService.getUserProfile(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Matching hooks
export const usePotentialMatches = (
  userId: number,
  sportId: number,
  latitude?: number,
  longitude?: number,
  maxDistanceKm: number = 10
) => {
  const params = { latitude, longitude, maxDistanceKm }
  
  return useQuery({
    queryKey: queryKeys.potentialMatches(userId, sportId, params),
    queryFn: () => apiService.getPotentialMatches(userId, sportId, latitude, longitude, maxDistanceKm),
    enabled: !!userId && !!sportId,
    staleTime: 30 * 1000, // 30 seconds - matching data changes frequently
  })
}

// Mutation hooks
export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, latitude, longitude }: { id: number; latitude: number; longitude: number }) =>
      apiService.updateUserLocation(id, latitude, longitude),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(variables.id) })
    },
  })
}

export const useUpdateUserMaxDistance = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, maxDistanceKm }: { id: number; maxDistanceKm: number }) =>
      apiService.updateUserMaxDistance(id, maxDistanceKm),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(variables.id) })
    },
  })
}

export const useProcessLike = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, targetUserId, sportId }: { userId: number; targetUserId: number; sportId: number }) =>
      apiService.processLike(userId, targetUserId, sportId),
    onSuccess: (data, variables) => {
      // Invalidate potential matches to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.potentialMatches(variables.userId, variables.sportId) 
      })
    },
  })
}

export const useProcessDislike = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, targetUserId, sportId }: { userId: number; targetUserId: number; sportId: number }) =>
      apiService.processDislike(userId, targetUserId, sportId),
    onSuccess: (data, variables) => {
      // Invalidate potential matches to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.potentialMatches(variables.userId, variables.sportId) 
      })
    },
  })
}

// Auth hooks (these don't need caching as much)
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiService.login,
    onSuccess: () => {
      // Clear all queries when user logs in
      queryClient.clear()
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiService.register,
    onSuccess: () => {
      // Clear all queries when user registers
      queryClient.clear()
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: apiService.logout,
    onSuccess: () => {
      // Clear all queries when user logs out
      queryClient.clear()
    },
  })
}
