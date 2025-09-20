'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function OAuthRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (code || error) {
      // Redirect to the callback route with all params
      const params = new URLSearchParams(searchParams.toString())
      router.push(`/api/admin/auth/google/callback?${params.toString()}`)
    } else {
      // No OAuth params, redirect to login
      router.push('/admin/login')
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing authentication...</h2>
        <p className="text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
}

export default function OAuthRedirect() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we prepare authentication.</p>
        </div>
      </div>
    }>
      <OAuthRedirectContent />
    </Suspense>
  )
}