'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Logout API call
 */
async function logoutAdmin(): Promise<void> {
  const response = await fetch('/api/admin/auth/logout', {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to logout')
  }
}

/**
 * Hook for admin logout functionality
 *
 * @example
 * ```tsx
 * function LogoutButton() {
 *   const { logout, isLoading } = useAdminLogout()
 *
 *   return (
 *     <button
 *       onClick={() => logout()}
 *       disabled={isLoading}
 *     >
 *       {isLoading ? 'Logging out...' : 'Logout'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useAdminLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: logoutAdmin,
    onMutate: async () => {
      // Show loading toast
      toast.loading('Logging out...', {
        id: 'logout-toast',
      })
    },
    onSuccess: async () => {
      // Clear all cached data
      queryClient.clear()

      // Remove specific user data
      queryClient.setQueryData(['adminUser'], null)
      queryClient.removeQueries({ queryKey: ['admin'] })

      // Dismiss loading toast and show success
      toast.dismiss('logout-toast')
      toast.success('Logged out successfully', {
        description: 'You have been securely logged out.',
        duration: 2000,
      })

      // Track logout event (if analytics are configured)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'admin_logout', {
          method: 'manual',
        })
      }

      // Small delay to show the success message
      await new Promise(resolve => setTimeout(resolve, 500))
    },
    onError: (error: Error) => {
      // Dismiss loading toast and show error
      toast.dismiss('logout-toast')
      toast.error('Logout failed', {
        description: error.message || 'An error occurred while logging out.',
        duration: 5000,
      })

      console.error('Logout error:', error)
    },
  })

  /**
   * Logout function with additional options
   */
  const logout = async (options?: {
    redirectTo?: string
    skipConfirmation?: boolean
    onSuccess?: () => void
    onError?: (error: Error) => void
  }) => {
    // Optional confirmation dialog
    if (!options?.skipConfirmation && typeof window !== 'undefined') {
      const confirmed = window.confirm('Are you sure you want to logout?')
      if (!confirmed) {
        return
      }
    }

    try {
      await mutation.mutateAsync()

      // Call custom success handler
      if (options?.onSuccess) {
        options.onSuccess()
      }

      // Redirect after logout
      const redirectTo = options?.redirectTo || '/admin/login'
      router.push(redirectTo)
    } catch (error) {
      if (options?.onError && error instanceof Error) {
        options.onError(error)
      }
      throw error
    }
  }

  /**
   * Logout all sessions (including other devices)
   */
  const logoutAllSessions = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout-all', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to logout all sessions')
      }

      // Clear cache and redirect
      queryClient.clear()
      queryClient.setQueryData(['adminUser'], null)

      toast.success('All sessions logged out', {
        description: 'You have been logged out from all devices.',
        duration: 3000,
      })

      router.push('/admin/login')
    } catch (error) {
      toast.error('Failed to logout all sessions', {
        description: 'Please try again or contact support.',
      })
      console.error('Logout all sessions error:', error)
    }
  }

  /**
   * Force logout (useful for session expiry)
   */
  const forceLogout = (reason?: string) => {
    // Clear cache immediately
    queryClient.clear()
    queryClient.setQueryData(['adminUser'], null)

    // Show reason if provided
    if (reason) {
      toast.error('Session ended', {
        description: reason,
        duration: 5000,
      })
    }

    // Redirect to login with return URL
    const currentPath = window.location.pathname
    const loginUrl = `/admin/login?from=${encodeURIComponent(currentPath)}`
    router.push(loginUrl)
  }

  return {
    // Main logout function
    logout,

    // Additional logout methods
    logoutAllSessions,
    forceLogout,

    // Mutation states
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Direct access to mutation for advanced use cases
    mutation,
  }
}