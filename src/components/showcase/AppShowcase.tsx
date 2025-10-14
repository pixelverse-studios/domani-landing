'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import domaniApp from '/public/Domani-app.png'
import { scrollToEmailSignup } from '@/lib/scroll-utils'
import analyticsMockup from '@/media/Analytics.png'
import { Calendar, BarChart3, Clock, Target, Brain, Sparkles } from 'lucide-react'

interface ScreenData {
  id: string
  title: string
  subtitle: string
  image: any
  features: Array<{
    icon: React.ReactNode
    title: string
    description: string
  }>
}

const screens: ScreenData[] = [
  {
    id: 'today',
    title: 'Today View',
    subtitle: 'Your command center for focused execution',
    image: domaniApp,
    features: [
      {
        icon: <Target className="w-5 h-5" />,
        title: 'Priority Focus',
        description: 'See your most important task front and center'
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: 'Time Blocks',
        description: 'Tasks organized by optimal completion time'
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: 'Morning Momentum',
        description: 'Start executing immediately, no decision fatigue'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    subtitle: 'Track your productivity patterns and improve',
    image: analyticsMockup,
    features: [
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: 'Completion Rates',
        description: 'See your task completion trends over time'
      },
      {
        icon: <Brain className="w-5 h-5" />,
        title: 'Productivity Insights',
        description: 'Discover your peak performance patterns'
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        title: 'Streak Tracking',
        description: 'Build momentum with consistent planning habits'
      }
    ]
  }
]

export function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState<string>('today')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const currentScreen = screens.find(s => s.id === activeScreen) || screens[0]

  return (
    <section
      ref={ref}
      className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-primary-50/5 via-white to-white dark:from-dark-gradient-to/95 dark:via-dark-gradient-via dark:to-dark-gradient-from"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-100/30 to-transparent dark:from-primary-500/10 dark:to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            See Domani in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the interface that thousands use to transform their chaotic mornings into
            productive powerhouses.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-white dark:bg-dark-elevated rounded-xl shadow-lg p-1">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  activeScreen === screen.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {screen.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Floating app screenshot */}
          <div className="relative">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative mx-auto max-w-[320px]"
            >
              {/* Floating screenshot with multi-layer shadows */}
              <motion.div
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden duration-300">
                  <Image
                    src={currentScreen.image}
                    alt={`${currentScreen.title} Screenshot`}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-primary-500 to-evening-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-10"
              >
                Live Preview
              </motion.div>
            </motion.div>
          </div>

          {/* Features list */}
          <div>
            <motion.h3
              key={`${activeScreen}-title`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {currentScreen.title}
            </motion.h3>
            <motion.p
              key={`${activeScreen}-subtitle`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              {currentScreen.subtitle}
            </motion.p>

            <div className="space-y-6">
              {currentScreen.features.map((feature, index) => (
                <motion.div
                  key={`${activeScreen}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8"
            >
              <button
                onClick={() => scrollToEmailSignup()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-evening-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Get Early Access - Scroll to email signup"
              >
                Get Early Access
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}