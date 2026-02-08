'use client'

import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, BarChart3, Signal, Target, Brain, Sparkles, type LucideIcon } from 'lucide-react'
import domaniApp from '@/media/Domani-app.png'
import analyticsMockup from '@/media/Analytics.png'
import { cn } from '@/lib/utils'
import DynamicCTA from '@/components/DynamicCTA'

interface ScreenFeature {
  icon: LucideIcon
  title: string
  description: string
}

interface ScreenData {
  id: string
  title: string
  subtitle: string
  image: StaticImageData
  features: ScreenFeature[]
}

const screens: ScreenData[] = [
  {
    id: 'today',
    title: 'Today View',
    subtitle: 'Your command center for focused execution',
    image: domaniApp,
    features: [
      { icon: Target, title: 'Priority Focus', description: 'See your most important task front and center' },
      { icon: Signal, title: 'Priority Signals', description: 'Importance is obvious at a glance' },
      { icon: Sparkles, title: 'Morning Momentum', description: 'Start executing immediately, no decision fatigue' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    subtitle: 'Track your productivity patterns and improve',
    image: analyticsMockup,
    features: [
      { icon: BarChart3, title: 'Completion Rates', description: 'See your task completion trends over time' },
      { icon: Brain, title: 'Productivity Insights', description: 'Discover your peak performance patterns' },
      { icon: Calendar, title: 'Streak Tracking', description: 'Build momentum with consistent planning habits' },
    ],
  },
]

export function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState<string>(screens[0].id)
  const activeScreenData = screens.find((screen) => screen.id === activeScreen) ?? screens[0]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/5 via-white to-white px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-primary-100/30 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">See Domani in Action</h2>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
          Experience the interface everyone is using to transform their chaotic mornings into productive powerhouses.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-4xl">
        <div
          className="inline-flex w-full justify-center rounded-xl bg-white p-1 shadow-lg"
          role="tablist"
          aria-label="App showcase panels"
        >
          {screens.map((screen) => {
            const isActive = activeScreen === screen.id
            return (
            <button
              key={screen.id}
              type="button"
              onClick={() => setActiveScreen(screen.id)}
              aria-pressed={isActive}
              aria-controls={`showcase-panel-${screen.id}`}
              className={cn(
                'flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {screen.title}
            </button>
            )
          })}
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col gap-10">
        <AnimatePresence mode="wait">
          <motion.article
            key={activeScreenData.id}
            id={`showcase-panel-${activeScreenData.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div className="relative">
              <div className="absolute inset-0 rotate-6 scale-105 rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 opacity-10 blur-xl" />
              <div className="relative mx-auto max-w-[320px] rounded-3xl p-4 shadow-xl">
                <Image
                  src={activeScreenData.image}
                  alt={`${activeScreenData.title} Screenshot`}
                  className="h-auto w-full rounded-2xl"
                  sizes="(min-width: 1024px) 320px, 260px"
                  priority={activeScreenData.id === screens[0].id}
                />
                <div className="pointer-events-none absolute -right-4 -top-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  Live Preview
                </div>
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-3xl font-bold text-gray-900">{activeScreenData.title}</h3>
              <p className="mt-4 text-lg text-gray-600">{activeScreenData.subtitle}</p>

              <div className="mt-8 space-y-6">
                {activeScreenData.features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div key={feature.title} className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8">
                <DynamicCTA
                  analyticsLocation="app-showcase"
                  scrollToId="waitlist-form"
                  scrollButtonText="Get Early Access"
                  align="start"
                />
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}
