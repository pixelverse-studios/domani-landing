'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import HeroSection from '@/components/HeroSection'
import Analytics from '@/components/Analytics'
import Header from '@/components/Header'
import { BenefitsSection } from '@/components/benefits/BenefitsSection'
import { AppShowcase } from '@/components/showcase/AppShowcase'
// import { AppPreviewSection } from '@/components/preview/AppPreviewSection'
import { useABTest } from '@/hooks/useABTest'

export default function HomePage() {
  const variant = useABTest()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if this is an OAuth callback
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (code || error) {
      console.log('OAuth callback detected on home page, redirecting...', { code: !!code, error })
      // This is an OAuth callback, redirect to the callback handler
      const params = new URLSearchParams(searchParams.toString())
      router.push(`/api/admin/auth/google/callback?${params.toString()}`)
    }
  }, [searchParams, router])

  // Show loading state if this is an OAuth callback
  const isOAuthCallback = searchParams.get('code') || searchParams.get('error')
  if (isOAuthCallback) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
          <p className="text-gray-600">Please wait while we authenticate you.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Analytics />
      <Header />
      <main className="min-h-screen pt-16 overflow-x-clip bg-white dark:bg-dark-gradient-from">
        <div className="overflow-x-clip">
          {variant ? (
            <HeroSection
              headline={variant.headline}
              subheadline={variant.subheadline}
              ctaText={variant.ctaText}
              secondaryCtaText={variant.secondaryCtaText}
              variant={variant.variant}
            />
          ) : (
            // Show default while variant loads
            <HeroSection />
          )}

          {/* Benefits Section */}
          <BenefitsSection />

          {/* App Showcase Section */}
          <AppShowcase />

          {/* App Preview Section */}
          {/* <AppPreviewSection /> */}
        </div>
      </main>
    </>
  )
}