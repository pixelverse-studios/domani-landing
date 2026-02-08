'use client'

import { useEffect, Suspense, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Analytics from '@/components/Analytics'

interface HomePageClientProps {
  children: ReactNode
}

export function HomePageClient({ children }: HomePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (code || error) {
      const params = new URLSearchParams(searchParams.toString())
      router.push(`/api/admin/auth/google/callback?${params.toString()}`)
    }
  }, [router, searchParams])

  const isOAuthCallback = searchParams.get('code') || searchParams.get('error')

  if (isOAuthCallback) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Completing sign in...</h2>
          <p className="text-gray-600">Please wait while we authenticate you.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Analytics />
      <main className="min-h-screen overflow-x-clip bg-white pt-16">
        <div className="overflow-x-clip">
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </main>
    </>
  )
}
