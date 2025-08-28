import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import { User, MatchResult } from '@/types'

// Types for the infinite query data structure
interface PotentialMatchesPage {
  users: User[]
  hasNextPage: boolean
  nextPage: number | null
}

interface PotentialMatchesData {
  pages: PotentialMatchesPage[]
  pageParams: number[]
}

// Custom hook for matching system with advanced React Query features
export const useMatching = (userId: number, sportId: number) => {
  const queryClient = useQueryClient()

  // Get potential matches with infinite scrolling capability
  const potentialMatchesQuery = useInfiniteQuery({
    queryKey: ['potential-matches', userId, sportId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<PotentialMatchesPage> => {
      const users = await apiService.getPotentialMatches(
        userId, 
        sportId, 
        undefined, 
        undefined, 
        10
      )
      
      // For now, we'll simulate pagination since the API might not support it yet
      return {
        users,
        hasNextPage: users.length === 10,
        nextPage: users.length === 10 ? (pageParam as number) + 1 : null
      }
    },
    getNextPageParam: (lastPage: PotentialMatchesPage) => lastPage.nextPage,
    enabled: !!userId && !!sportId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: ({ targetUserId }: { targetUserId: number }) =>
      apiService.processLike(userId, targetUserId, sportId),
    onSuccess: (data: MatchResult) => {
      // If it's a match, show celebration and invalidate queries
      if (data.isMatch) {
        // You could trigger a celebration animation here
        console.log('¡Es un match! 🎉', data.message)
      }
      
      // Remove the liked user from potential matches
      queryClient.setQueryData<PotentialMatchesData>(
        ['potential-matches', userId, sportId],
        (oldData) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              users: page.users.filter(user => user.id !== data.targetUserId)
            }))
          }
        }
      )
    },
    onError: (error) => {
      console.error('Error processing like:', error)
    }
  })

  // Dislike mutation
  const dislikeMutation = useMutation({
    mutationFn: ({ targetUserId }: { targetUserId: number }) =>
      apiService.processDislike(userId, targetUserId, sportId),
    onSuccess: (_, variables) => {
      // Remove the disliked user from potential matches
      queryClient.setQueryData<PotentialMatchesData>(
        ['potential-matches', userId, sportId],
        (oldData) => {
          if (!oldData) return oldData
          
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              users: page.users.filter(user => user.id !== variables.targetUserId)
            }))
          }
        }
      )
    },
    onError: (error) => {
      console.error('Error processing dislike:', error)
    }
  })

  // Get current user's location for distance calculations
  const userLocationQuery = useQuery({
    queryKey: ['user-location', userId],
    queryFn: async () => {
      // This would typically come from your user profile
      // For now, we'll return a default location
      return { latitude: 0, longitude: 0 }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get current user's max distance preference
  const userMaxDistanceQuery = useQuery({
    queryKey: ['user-max-distance', userId],
    queryFn: async () => {
      // This would typically come from your user profile
      // For now, we'll return a default value
      return 10
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Process like with optimistic update
  const processLike = async (targetUserId: number) => {
    // Optimistic update - remove user immediately from UI
    queryClient.setQueryData<PotentialMatchesData>(
      ['potential-matches', userId, sportId],
      (oldData) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            users: page.users.filter(user => user.id !== targetUserId)
          }))
        }
      }
    )

    try {
      await likeMutation.mutateAsync({ targetUserId })
    } catch (error) {
      // If the mutation fails, revert the optimistic update
      queryClient.invalidateQueries({ 
        queryKey: ['potential-matches', userId, sportId] 
      })
      throw error
    }
  }

  // Process dislike with optimistic update
  const processDislike = async (targetUserId: number) => {
    // Optimistic update - remove user immediately from UI
    queryClient.setQueryData<PotentialMatchesData>(
      ['potential-matches', userId, sportId],
      (oldData) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            users: page.users.filter(user => user.id !== targetUserId)
          }))
        }
      }
    )

    try {
      await dislikeMutation.mutateAsync({ targetUserId })
    } catch (error) {
      // If the mutation fails, revert the optimistic update
      queryClient.invalidateQueries({ 
        queryKey: ['potential-matches', userId, sportId] 
      })
      throw error
    }
  }

  // Get all potential matches as a flat array
  const allPotentialMatches = potentialMatchesQuery.data?.pages.flatMap((page: PotentialMatchesPage) => page.users) || []

  // Check if we're loading more data
  const isLoadingMore = potentialMatchesQuery.isFetchingNextPage

  // Check if there are more pages to load
  const hasNextPage = potentialMatchesQuery.hasNextPage

  // Load next page
  const loadNextPage = () => {
    if (hasNextPage && !isLoadingMore) {
      potentialMatchesQuery.fetchNextPage()
    }
  }

  return {
    // Data
    potentialMatches: allPotentialMatches,
    userLocation: userLocationQuery.data,
    userMaxDistance: userMaxDistanceQuery.data,
    
    // Loading states
    isLoading: potentialMatchesQuery.isLoading,
    isLoadingMore,
    isRefetching: potentialMatchesQuery.isRefetching,
    
    // Error states
    error: potentialMatchesQuery.error,
    
    // Pagination
    hasNextPage,
    loadNextPage,
    
    // Mutations
    processLike,
    processDislike,
    
    // Mutation states
    isProcessingLike: likeMutation.isPending,
    isProcessingDislike: dislikeMutation.isPending,
    
    // Refetch function
    refetch: potentialMatchesQuery.refetch,
    
    // Query client for manual cache manipulation
    queryClient,
  }
}
