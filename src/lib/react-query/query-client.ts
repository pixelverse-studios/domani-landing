'use client'

import { isServer, QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Global error logging
        console.error(`Query ${query.queryKey} failed:`, error)

        // Send to error monitoring service in production
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
          // TODO: Add error service integration (e.g., Sentry)
          // errorService.captureException(error)
        }

        // Show toast for background refetches that fail
        if (query.state.dataUpdatedAt && typeof window !== 'undefined') {
          // Only show error if data was previously loaded successfully
          // This avoids showing errors on initial load
          import('sonner').then(({ toast }) => {
            toast.error('Failed to refresh data. Please check your connection.')
          })
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation failed:', error)

        // Show error toast for all mutation failures
        if (typeof window !== 'undefined') {
          import('sonner').then(({ toast }) => {
            const errorMessage = error instanceof Error
              ? error.message
              : 'An error occurred. Please try again.'
            toast.error(errorMessage)
          })
        }
      },
    }),
    defaultOptions: {
      queries: {
        // SSR-friendly stale time to prevent immediate refetch on hydration
        staleTime: 60 * 1000, // 1 minute default

        // Garbage collection time - how long to keep unused data in cache
        gcTime: 10 * 60 * 1000, // 10 minutes

        // Admin dashboard optimizations
        refetchOnWindowFocus: false, // Prevent excessive refetching in admin panels
        refetchOnMount: true, // Ensure fresh data when component mounts
        refetchOnReconnect: 'always', // Always refetch when connection is restored

        // Smart retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors except timeout (408) and rate limit (429)
          if (error?.status >= 400 && error?.status < 500) {
            if (error.status === 408 || error.status === 429) {
              return failureCount < 2 // Retry timeout and rate limit errors up to 2 times
            }
            return false // Don't retry other 4xx errors
          }

          // Retry up to 3 times for other errors (network, 5xx, etc.)
          return failureCount < 3
        },

        // Exponential backoff delay for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: false, // Don't retry mutations by default - let user explicitly retry
        onError: (error: any) => {
          // Centralized mutation error handling
          console.error('Mutation error:', error)
        },
      },
    },
  })
}

// Browser: reuse the same query client
let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client for each request
    // This ensures no data leakage between requests
    return makeQueryClient()
  } else {
    // Browser: create once and reuse the same client
    // This allows for persistent cache across navigation
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

// Custom query options for different data types
export const queryOptions = {
  // Real-time dashboard metrics - refresh frequently
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchIntervalInBackground: true, // Continue refetching in background
  },

  // Reference data - rarely changes (roles, permissions, etc.)
  reference: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },

  // User data - moderate caching
  user: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },

  // List data (waitlist, campaigns) - short caching
  list: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
}