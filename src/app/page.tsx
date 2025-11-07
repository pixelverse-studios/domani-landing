import { Suspense } from 'react'
import HeroSection from '@/components/HeroSection'
import { BenefitsSection } from '@/components/benefits/BenefitsSection'
import { AppShowcase } from '@/components/showcase/AppShowcase'
import { HomePageClient } from '@/components/home/HomePageClient'
import Analytics from '@/components/Analytics'
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection'

function LandingFallback() {
  return (
    <>
      <Analytics />
      <main className="min-h-screen overflow-x-clip bg-white pt-16 dark:bg-dark-gradient-from">
        <div className="overflow-x-clip">
          <HeroSection />
          <BenefitsSection />
          <AppShowcase />
          <TestimonialsSection />
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
        <BenefitsSection />
        <AppShowcase />
        <TestimonialsSection />
      </HomePageClient>
    </Suspense>
  )
}
