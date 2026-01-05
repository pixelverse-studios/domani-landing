import { Suspense } from 'react'
import HeroSection from '@/components/HeroSection'
import { MITSpotlight } from '@/components/features/MITSpotlight'
import { PlanLockSpotlight } from '@/components/features/PlanLockSpotlight'
import { BenefitsSection } from '@/components/benefits/BenefitsSection'
import { AppShowcase } from '@/components/showcase/AppShowcase'
import { HomePageClient } from '@/components/home/HomePageClient'
import Analytics from '@/components/Analytics'

function LandingFallback() {
  return (
    <>
      <Analytics />
      <main className="min-h-screen overflow-x-clip bg-white pt-16 dark:bg-dark-gradient-from">
        <div className="overflow-x-clip">
          <HeroSection />
          <MITSpotlight />
          <PlanLockSpotlight />
          <BenefitsSection />
          <AppShowcase />
          {/* Testimonials temporarily disabled until real quotes are ready */}
        </div>
      </main>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<LandingFallback />}>
      <HomePageClient>
        <HeroSection />
        <MITSpotlight />
        <PlanLockSpotlight />
        <BenefitsSection />
        <AppShowcase />
        {/* Testimonials temporarily disabled until real quotes are ready */}
      </HomePageClient>
    </Suspense>
  )
}
