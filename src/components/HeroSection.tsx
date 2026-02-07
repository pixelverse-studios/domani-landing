import dynamic from 'next/dynamic'
import DynamicCTA from './DynamicCTA'
import SocialProof from './SocialProof'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { getCurrentBadgeText } from '@/lib/config/cta'

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
  subheadline = "Make better decisions when you're calm, not rushed. Execute with clarity.",
}: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-clip bg-gradient-to-b from-white via-primary-50/30 to-primary-50/10 dark:from-dark-gradient-from dark:via-dark-gradient-via dark:to-dark-gradient-to/95"
      aria-label="Hero section"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-primary-300 opacity-20 blur-xl mix-blend-multiply dark:bg-primary-600/20 dark:mix-blend-color-dodge dark:opacity-30" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary-300 opacity-20 blur-xl mix-blend-multiply dark:bg-primary-600/20 dark:mix-blend-color-dodge dark:opacity-30" />
        <div className="absolute -bottom-32 left-20 h-96 w-96 rounded-full bg-primary-200 opacity-15 blur-2xl mix-blend-multiply dark:bg-primary-500/20 dark:mix-blend-color-dodge dark:opacity-20" />
        <div className="absolute -bottom-48 right-32 h-80 w-80 rounded-full bg-primary-200 opacity-10 blur-2xl mix-blend-multiply dark:bg-primary-500/15 dark:mix-blend-color-dodge dark:opacity-15" />
        <HeroMotionLayer />
      </div>

      <div className="container mx-auto px-4 pb-16 pt-20 sm:px-6 md:pb-20 md:pt-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="text-left">
            <span
              data-hero-motion
              className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/50 dark:text-green-300"
            >
              {getCurrentBadgeText()}
            </span>

            <h1
              data-hero-motion
              data-hero-copy="headline"
              className="mt-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
            >
              Plan Tomorrow, Tonight
            </h1>

            <p data-hero-motion className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl lg:max-w-2xl">
              <span data-hero-copy="subheadline">{subheadline}</span>
            </p>

            <div data-hero-motion className="mt-8" id="waitlist-form">
              <DynamicCTA size="large" analyticsLocation="hero" />
            </div>

            <div
              data-hero-motion
              className="mt-8 flex flex-col items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
            >
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% free during beta
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All premium features unlocked
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Help shape the product
              </span>
            </div>

            <div data-hero-motion className="mt-8 flex justify-start">
              <SocialProof />
            </div>
          </div>

          <div data-hero-motion className="relative lg:pl-8">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 rotate-6 scale-105 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700 opacity-10 blur-xl" />

              <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_8px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1),0_24px_56px_rgba(0,0,0,0.05)] dark:bg-gray-900 dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25),0_16px_48px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.35),0_16px_32px_rgba(0,0,0,0.3),0_24px_56px_rgba(0,0,0,0.2)]">
                {/* Phone status bar */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <span>9:00 PM</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
                    <div className="h-2 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
                    <div className="h-2 w-4 rounded-sm bg-gray-400 dark:bg-gray-500" />
                  </div>
                </div>

                <div className="min-h-[500px] bg-gradient-to-b from-primary-50 to-white p-5 dark:from-dark-elevated dark:to-dark-surface">
                  {/* Planning for header with toggle */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Planning for</span>
                    <div className="flex rounded-full bg-gray-100 p-1 dark:bg-gray-800">
                      <button className="rounded-full bg-primary-600 px-3 py-1 text-xs font-medium text-white">
                        Tomorrow
                      </button>
                      <button className="rounded-full px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Today
                      </button>
                    </div>
                  </div>

                  {/* Title with date */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tomorrow</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tuesday, January 6th</p>
                  </div>

                  {/* Stats card */}
                  <div className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tasks Planned</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 dark:bg-yellow-900/30">
                          <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">1</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 dark:bg-red-900/30">
                          <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-red-700 dark:text-red-300">1</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 dark:bg-blue-900/30">
                          <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">1</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 dark:bg-green-900/30">
                          <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">1</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add New Task button */}
                  <button className="mb-4 w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 py-3 font-semibold text-white shadow-lg">
                    + Add New Task
                  </button>

                  {/* Planned Tasks section header */}
                  <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Planned Tasks (4)</p>

                  {/* Task cards */}
                  <div className="space-y-3">
                    {/* Task 1: High priority, Work */}
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex">
                        <div className="w-1 bg-red-500" />
                        <div className="flex flex-1 items-start justify-between p-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">Review quarterly report</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300">
                                High
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>Work</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Task 2: Medium priority, Health */}
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex">
                        <div className="w-1 bg-orange-500" />
                        <div className="flex flex-1 items-start justify-between p-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">Morning yoga session</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                                Medium
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span>Wellness</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Task 3: Medium priority, Personal */}
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex">
                        <div className="w-1 bg-orange-500" />
                        <div className="flex flex-1 items-start justify-between p-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">Call mom</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                                Medium
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <svg className="h-3 w-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <span>Personal</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Task 4: Low priority, Education */}
                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex">
                        <div className="w-1 bg-green-500" />
                        <div className="flex flex-1 items-start justify-between p-3">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">Read productivity book</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                Low
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                              </svg>
                              <span>Education</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge: Tasks Set */}
              <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                    <span className="font-bold text-green-600 dark:text-green-400">4</span>
                  </div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tasks Set</span>
                </div>
              </div>

              {/* Floating badge: Streak */}
              <div className="absolute bottom-0 left-0 -translate-x-2 translate-y-2 rounded-xl bg-white p-3 shadow-lg dark:bg-gray-800">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl">7</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Day Streak</span>
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
