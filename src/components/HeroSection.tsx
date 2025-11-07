import dynamic from 'next/dynamic'
import WaitlistInline from './WaitlistInline'
import SocialProof from './SocialProof'
import { SectionDivider } from '@/components/ui/SectionDivider'

const HeroMotionLayer = dynamic(() => import('./hero/HeroMotionLayer').then((mod) => mod.HeroMotionLayer), {
  loading: () => null,
})
const HeroCopyLayer = dynamic(() => import('./hero/HeroCopyLayer').then((mod) => mod.HeroCopyLayer), {
  loading: () => null,
})

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  ctaText?: string
  secondaryCtaText?: string
  variant?: 'A' | 'B' | 'C'
}

export default function HeroSection({
  subheadline = "Transform your productivity with evening planning psychology. Add tomorrow's tasks when you're calm, execute when you're focused.",
}: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-clip bg-gradient-to-b from-white via-primary-50/30 to-primary-50/10 dark:from-dark-gradient-from dark:via-dark-gradient-via dark:to-dark-gradient-to/95"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-evening-300 opacity-20 blur-xl mix-blend-multiply dark:bg-evening-600/20 dark:mix-blend-color-dodge dark:opacity-30" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary-300 opacity-20 blur-xl mix-blend-multiply dark:bg-primary-600/20 dark:mix-blend-color-dodge dark:opacity-30" />
        <div className="absolute -bottom-32 left-20 h-96 w-96 rounded-full bg-primary-200 opacity-15 blur-2xl mix-blend-multiply dark:bg-primary-500/20 dark:mix-blend-color-dodge dark:opacity-20" />
        <div className="absolute -bottom-48 right-32 h-80 w-80 rounded-full bg-evening-200 opacity-10 blur-2xl mix-blend-multiply dark:bg-evening-500/15 dark:mix-blend-color-dodge dark:opacity-15" />
        <HeroMotionLayer />
      </div>

      <div className="container mx-auto px-4 pb-16 pt-20 sm:px-6 md:pb-20 md:pt-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span
              data-hero-motion
              className="inline-block rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
            >
              ✨ Early Access Available
            </span>

            <h1
              data-hero-motion
              data-hero-copy="headline"
              className="mt-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
            >
              Plan Tomorrow Tonight, Wake Up Ready
            </h1>

            <p data-hero-motion className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl lg:max-w-2xl">
              <span data-hero-copy="subheadline">{subheadline}</span>
            </p>

            <div data-hero-motion className="mt-8">
              <WaitlistInline />
            </div>

            <div
              data-hero-motion
              className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                3 tasks daily forever
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </span>
            </div>

            <div data-hero-motion className="mt-8">
              <SocialProof />
            </div>
          </div>

          <div data-hero-motion className="relative lg:pl-8">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 rotate-6 scale-105 rounded-3xl bg-gradient-to-r from-primary-500 to-evening-500 opacity-10 blur-xl" />

              <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_8px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1),0_24px_56px_rgba(0,0,0,0.05)] dark:bg-gray-900 dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25),0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.35),0_16px_32px_rgba(0,0,0,0.3),0_24px_56px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <span>8:00 PM</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
                    <div className="h-2 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
                    <div className="h-2 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
                  </div>
                </div>

                <div className="min-h-[500px] bg-gradient-to-b from-primary-50 to-white p-6 dark:from-dark-elevated dark:to-dark-surface">
                  <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Tomorrow&apos;s Plan</h3>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Morning team standup</p>
                          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">💼 Work</span>
                        </div>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-green-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">30 min morning run</p>
                          <span className="mt-1 inline-block rounded-full bg-red-50 px-2 py-1 text-xs text-red-600">❤️ Health</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-purple-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Grocery shopping</p>
                          <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">🏠 Personal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary-600 to-evening-600 py-3 font-semibold text-white shadow-lg">
                    Lock Tonight&apos;s Plan
                  </button>
                </div>
              </div>

              <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <span className="font-bold text-green-600">3</span>
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tasks Set</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 -translate-x-2 translate-y-2 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">🔥</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">7 Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-px">
        <SectionDivider variant="wave" className="text-white dark:text-dark-gradient-from" />
      </div>
      <HeroCopyLayer />
    </section>
  )
}
