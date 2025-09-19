'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface GoogleAuthOptions {
  redirectTo?: string
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

interface UseGoogleAuthReturn {
  signInWithGoogle: (options?: GoogleAuthOptions) => Promise<void>
  isLoading: boolean
  error: Error | null
}

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  const signInWithGoogle = useCallback(async (options: GoogleAuthOptions = {}) => {
    const { redirectTo = '/admin', onSuccess, onError } = options

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get the current URL for the OAuth callback
      // Important: In production, we must use the actual window.location.origin
      // because Supabase validates the redirect URL against the request origin
      const redirectUrl = `${window.location.origin}/api/admin/auth/google/callback`

      // Add next parameter to preserve intended redirect after auth
      const callbackUrl = new URL(redirectUrl)
      callbackUrl.searchParams.set('next', redirectTo)

      // Initiate Google OAuth flow
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        },
      })

      if (authError) {
        throw authError
      }

      // The user will be redirected to Google for authentication
      // After successful auth, they'll be redirected back to our callback URL
      // which will handle the admin verification and redirect

      // Store the intended redirect in session storage for after auth
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminRedirectTo', redirectTo)
      }

      // Success callback (though user will be redirected)
      onSuccess?.(data)

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sign in with Google')
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return {
    signInWithGoogle,
    isLoading,
    error,
  }
}