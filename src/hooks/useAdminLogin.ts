'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AdminLoginResponse, AdminUserWithDetails } from '@/types/admin'
import { z } from 'zod'

/**
 * Login credentials schema
 */
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

export type LoginCredentials = z.infer<typeof loginSchema>

/**
 * Login API call
 */
async function loginAdmin(credentials: LoginCredentials): Promise<AdminLoginResponse> {
  const response = await fetch('/api/admin/auth/login', {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    // Handle specific error codes
    if (response.status === 429) {
      // Rate limiting
      const retryAfter = data.retryAfter || 15
      throw new Error(`Too many login attempts. Please try again in ${retryAfter} minutes.`)
    }

    if (response.status === 403) {
      throw new Error('You do not have admin access.')
    }

    if (response.status === 401) {
      const remainingAttempts = data.remainingAttempts
      if (remainingAttempts !== undefined && remainingAttempts > 0) {
        throw new Error(`Invalid credentials. ${remainingAttempts} attempts remaining.`)
      }
      throw new Error('Invalid email or password.')
    }

    throw new Error(data.error || 'Failed to login. Please try again.')
  }

  return data
}

/**
 * Hook for admin login functionality
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { login, isLoading, error } = useAdminLogin()
 *
 *   const handleSubmit = async (data) => {
 *     await login(data, {
 *       redirectTo: '/admin/dashboard'
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <ErrorMessage>{error.message}</ErrorMessage>}
 *       <button disabled={isLoading}>
 *         {isLoading ? 'Logging in...' : 'Login'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useAdminLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: async (data: AdminLoginResponse) => {
      // Set the user in the cache
      queryClient.setQueryData(['adminUser'], data.user)

      // Invalidate and refetch all admin-related queries
      await queryClient.invalidateQueries({ queryKey: ['admin'] })

      // Show success toast
      toast.success(`Welcome back, ${data.user.user.email}!`, {
        description: 'You have successfully logged in.',
        duration: 3000,
      })

      // Track login event (if analytics are configured)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'admin_login', {
          method: 'email',
          role: data.user.role,
        })
      }
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error('Login failed', {
        description: error.message,
        duration: 5000,
      })

      // Track failed login (if analytics are configured)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'admin_login_failed', {
          error: error.message,
        })
      }
    },
  })

  /**
   * Login function with additional options
   */
  const login = async (
    credentials: LoginCredentials,
    options?: {
      redirectTo?: string
      onSuccess?: (user: AdminUserWithDetails) => void
      onError?: (error: Error) => void
    }
  ) => {
    try {
      // Validate credentials
      const validatedData = loginSchema.parse(credentials)

      // Perform login
      const result = await mutation.mutateAsync(validatedData)

      // Call custom success handler
      if (options?.onSuccess) {
        options.onSuccess(result.user)
      }

      // Redirect if specified
      if (options?.redirectTo) {
        router.push(options.redirectTo)
      } else {
        // Default redirect to admin dashboard
        router.push('/admin')
      }

      return result
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0]
        const errorMessage = firstError?.message || 'Invalid input'
        toast.error('Validation error', {
          description: errorMessage,
        })

        if (options?.onError) {
          options.onError(new Error(errorMessage))
        }

        throw error
      }

      // Handle other errors
      if (options?.onError && error instanceof Error) {
        options.onError(error)
      }

      throw error
    }
  }

  /**
   * Reset the login mutation state
   */
  const reset = () => {
    mutation.reset()
  }

  return {
    // Main login function
    login,

    // Mutation states
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Login response data
    data: mutation.data,

    // Reset function
    reset,

    // Direct access to mutation for advanced use cases
    mutation,
  }
}

/**
 * Hook for checking if login is required
 */
export function useRequireAuth(redirectTo: string = '/admin/login') {
  const queryClient = useQueryClient()
  const router = useRouter()

  const checkAuth = async () => {
    const user = queryClient.getQueryData(['adminUser'])

    if (!user) {
      // Try to fetch user data
      try {
        const response = await fetch('/api/admin/auth/verify', {
          credentials: 'include',
        })

        if (!response.ok) {
          router.push(`${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`)
          return false
        }

        const data = await response.json()
        queryClient.setQueryData(['adminUser'], data.user)
        return true
      } catch {
        router.push(`${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`)
        return false
      }
    }

    return true
  }

  return { checkAuth }
}