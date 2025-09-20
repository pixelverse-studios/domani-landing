'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we have auth tokens in the URL hash (for email invites/magic links)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      if (accessToken && refreshToken) {
        try {
          const supabase = createClient()

          // Set the session using the tokens from the URL
          const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('Error setting session:', error)
            router.push('/admin/login?error=session_error')
            return
          }

          if (session) {
            // Clear the hash from the URL
            window.history.replaceState(null, '', window.location.pathname)

            // Check if user is an admin
            const { data: adminUser } = await supabase
              .from('admin_users')
              .select('id, is_active')
              .eq('user_id', session.user.id)
              .single()

            if (adminUser && adminUser.is_active) {
              // Admin user - redirect to admin panel
              router.push('/admin')
            } else {
              // Regular user or invite acceptance
              if (type === 'invite') {
                // User accepted an invite - might want to show a welcome page
                router.push('/welcome')
              } else if (type === 'recovery') {
                // Password recovery - redirect to password reset
                router.push('/reset-password')
              } else {
                // Regular sign in - redirect to user dashboard or home
                router.push('/dashboard')
              }
            }
          }
        } catch (error) {
          console.error('Auth handler error:', error)
          router.push('/admin/login?error=auth_failed')
        }
      }
    }

    handleAuthCallback()
  }, [router])

  return null
}