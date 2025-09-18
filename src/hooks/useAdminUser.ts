'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminUserWithDetails } from '@/types/admin'
import { toast } from 'sonner'

/**
 * Fetches the current admin user from the API
 */
async function fetchAdminUser(): Promise<AdminUserWithDetails | null> {
  try {
    const response = await fetch('/api/admin/auth/verify', {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        // User is not authenticated
        return null
      }

      throw new Error(`Failed to verify admin user: ${response.statusText}`)
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error fetching admin user:', error)
    throw error
  }
}

/**
 * Hook to get the current authenticated admin user
 *
 * @example
 * ```tsx
 * function AdminProfile() {
 *   const { user, isLoading, isAuthenticated } = useAdminUser()
 *
 *   if (isLoading) return <LoadingSpinner />
 *   if (!isAuthenticated) return <LoginForm />
 *
 *   return <div>Welcome, {user.email}</div>
 * }
 * ```
 */
export function useAdminUser() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['adminUser'],
    queryFn: fetchAdminUser,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: Infinity, // Keep in cache forever (was cacheTime in v4)
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.response?.status === 401) {
        return false
      }
      // Retry up to 3 times for other errors
      return failureCount < 3
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  // Computed values
  const isAuthenticated = !!user && !isError
  const isUnauthenticated = !isLoading && !user
  const isSuperAdmin = user?.role === 'super_admin'
  const isAdmin = user?.role === 'admin' || isSuperAdmin
  const canEdit = user?.role === 'editor' || isAdmin
  const canView = !!user // Any authenticated user can view

  // Helper functions
  const hasRole = (requiredRole: string): boolean => {
    if (!user) return false

    const roleHierarchy: Record<string, number> = {
      'super_admin': 100,
      'admin': 75,
      'editor': 50,
      'viewer': 25,
    }

    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 100

    return userLevel >= requiredLevel
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false
    if (isSuperAdmin) return true // Super admins have all permissions

    // Check user's permissions object
    if (user.permissions && user.permissions[resource]) {
      const resourcePerms = user.permissions[resource]
      if (Array.isArray(resourcePerms)) {
        return resourcePerms.includes(action)
      }
      if (typeof resourcePerms === 'object') {
        return resourcePerms[action] === true
      }
    }

    // Default role-based permissions
    const rolePermissions: Record<string, { resources: string[], actions: string[] }> = {
      admin: {
        resources: ['waitlist', 'campaigns', 'templates', 'users', 'analytics'],
        actions: ['create', 'read', 'update', 'delete', 'export'],
      },
      editor: {
        resources: ['waitlist', 'campaigns', 'templates', 'analytics'],
        actions: ['create', 'read', 'update', 'export'],
      },
      viewer: {
        resources: ['waitlist', 'campaigns', 'templates', 'analytics'],
        actions: ['read', 'export'],
      },
    }

    const rolePerms = rolePermissions[user.role]
    if (!rolePerms) return false

    return rolePerms.resources.includes(resource) && rolePerms.actions.includes(action)
  }

  // Force refresh user data
  const refreshUser = async () => {
    try {
      await refetch()
    } catch (error) {
      toast.error('Failed to refresh user data')
      console.error('Failed to refresh user:', error)
    }
  }

  // Clear user from cache (useful for logout)
  const clearUser = () => {
    queryClient.setQueryData(['adminUser'], null)
    queryClient.removeQueries({ queryKey: ['adminUser'] })
  }

  return {
    // User data
    user,

    // Loading states
    isLoading,
    isRefetching,
    isError,
    error,

    // Authentication states
    isAuthenticated,
    isUnauthenticated,

    // Role checks
    isSuperAdmin,
    isAdmin,
    canEdit,
    canView,
    hasRole,
    hasPermission,

    // Actions
    refreshUser,
    clearUser,
  }
}

/**
 * Hook to prefetch admin user data
 * Useful for prefetching on app load or route changes
 */
export function usePrefetchAdminUser() {
  const queryClient = useQueryClient()

  const prefetchUser = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['adminUser'],
      queryFn: fetchAdminUser,
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetchUser }
}