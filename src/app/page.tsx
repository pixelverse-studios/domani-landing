'use client'

import HeroSection from '@/components/HeroSection'
import Analytics from '@/components/Analytics'
import Header from '@/components/Header'
import { BenefitsSection } from '@/components/benefits/BenefitsSection'
import { AppShowcase } from '@/components/showcase/AppShowcase'
// import { AppPreviewSection } from '@/components/preview/AppPreviewSection'
import { useABTest } from '@/hooks/useABTest'

export default function HomePage() {
  const variant = useABTest()

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