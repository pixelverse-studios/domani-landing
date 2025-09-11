'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { AppPreview } from './AppPreview'
import { generateMockupScreenshot, generateComparisonImage } from '@/lib/mockupGenerator'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface FeatureCallout {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  position: {
    mobile: { top: string; left: string }
    desktop: { top: string; left: string }
  }
}

const features: FeatureCallout[] = [
  {
    id: 'evening-planning',
    title: 'Evening Planning',
    description: 'Plan tomorrow when your mind is calm and strategic',
    icon: <CalendarIcon className="w-5 h-5" />,
    position: {
      mobile: { top: '20%', left: '70%' },
      desktop: { top: '25%', left: '75%' },
    },
  },
  {
    id: 'ai-breakdown',
    title: 'AI Task Breakdown',
    description: 'Automatically breaks complex tasks into simple steps',
    icon: <SparklesIcon className="w-5 h-5" />,
    position: {
      mobile: { top: '40%', left: '-10%' },
      desktop: { top: '45%', left: '-5%' },
    },
  },
  {
    id: 'progress-tracking',
    title: 'Visual Progress',
    description: 'See your momentum build with beautiful visualizations',
    icon: <ChartBarIcon className="w-5 h-5" />,
    position: {
      mobile: { top: '60%', left: '70%' },
      desktop: { top: '65%', left: '75%' },
    },
  },
  {
    id: 'smart-reminders',
    title: 'Context-Aware Reminders',
    description: 'Get reminded at the perfect moment, not just time',
    icon: <BellIcon className="w-5 h-5" />,
    position: {
      mobile: { top: '80%', left: '-10%' },
      desktop: { top: '85%', left: '-5%' },
    },
  },
]

export function AppPreviewSection({ className }: { className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'features' | 'comparison'>('features')
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('mobile')

  // Create sample app screens
  const DomaniScreen = () => (
    <div className="bg-gradient-to-br from-primary-600 to-evening-600 h-full rounded-xl p-6">
      <div className="space-y-4">
        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Tomorrow&apos;s Focus</span>
            <CheckCircleIcon className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-white font-semibold">Complete project proposal</h4>
          <div className="mt-2 space-y-1">
            <div className="bg-white/10 rounded p-2">
              <span className="text-white/70 text-xs">Research competitors</span>
            </div>
            <div className="bg-white/10 rounded p-2">
              <span className="text-white/70 text-xs">Draft executive summary</span>
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-4 h-4 text-white/80" />
            <span className="text-white/80 text-sm">Planned at 9:47 PM</span>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/30 rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">3 tasks</span>
            </div>
            <div className="bg-white/30 rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">2h estimated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const TraditionalTodoScreen = () => (
    <div className="bg-gray-100 dark:bg-dark-elevated h-full rounded-xl p-6">
      <div className="space-y-3">
        <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <input type="checkbox" className="mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Buy groceries</span>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <input type="checkbox" className="mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Email client</span>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <input type="checkbox" className="mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Team meeting</span>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <input type="checkbox" className="mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Review documents</span>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <input type="checkbox" className="mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Call dentist</span>
        </div>
      </div>
    </div>
  )

  return (
    <section
      ref={ref}
      className={cn(
        'relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden',
        className
      )}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Experience the Difference
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            See how Domani transforms chaotic to-do lists into strategic daily plans 
            that actually get done.
          </p>

          {/* View Toggle */}
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('features')}
              className={cn(
                'px-6 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'features'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              Interactive Demo
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={cn(
                'px-6 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'comparison'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              Before & After
            </button>
          </div>

          {/* Device Toggle */}
          <div className="mt-4">
            <div className="inline-flex gap-2">
              <button
                onClick={() => setDeviceType('mobile')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  deviceType === 'mobile'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h10V4H7zm5 14a1 1 0 100-2 1 1 0 000 2z"/>
                </svg>
              </button>
              <button
                onClick={() => setDeviceType('desktop')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  deviceType === 'desktop'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4a2 2 0 00-2 2v11a2 2 0 002 2h6l-1 2H7v2h10v-2h-2l-1-2h6a2 2 0 002-2V5a2 2 0 00-2-2zm0 13H4V5h16v11z"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preview Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {viewMode === 'features' ? (
            <div className="relative">
              <AppPreview
                device={deviceType}
                className="mx-auto"
              >
                {generateMockupScreenshot(
                  <DomaniScreen />,
                  { device: deviceType }
                )}
              </AppPreview>

              {/* Feature Callouts */}
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  className="absolute"
                  style={{
                    top: feature.position[deviceType].top,
                    left: feature.position[deviceType].left,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <div
                    className="group cursor-pointer"
                    onMouseEnter={() => setActiveFeature(feature.id)}
                    onMouseLeave={() => setActiveFeature(null)}
                  >
                    {/* Pulse Animation */}
                    <div className="absolute inset-0 -m-2">
                      <div className="w-12 h-12 bg-primary-600 rounded-full animate-ping opacity-20" />
                    </div>

                    {/* Icon Button */}
                    <div className="relative w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border-2 border-primary-600 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>

                    {/* Tooltip */}
                    <div
                      className={cn(
                        'absolute z-20 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-200',
                        activeFeature === feature.id
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible translate-y-2',
                        parseInt(feature.position[deviceType].left) > 50
                          ? 'right-0'
                          : 'left-0',
                        'top-14'
                      )}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {generateComparisonImage({
                beforeContent: generateMockupScreenshot(
                  <TraditionalTodoScreen />,
                  { device: deviceType }
                ),
                afterContent: generateMockupScreenshot(
                  <DomaniScreen />,
                  { device: deviceType }
                ),
                beforeLabel: 'Traditional To-Do Apps',
                afterLabel: 'Domani',
                orientation: deviceType === 'mobile' ? 'horizontal' : 'horizontal',
              })}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Ready to transform your productivity?
          </p>
          <button className="btn-primary">
            Start Your Free Trial
          </button>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-dark-gradient-from dark:via-dark-gradient-via/50 dark:to-dark-surface" />
        <motion.div
          className="absolute top-1/4 -left-64 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-64 w-96 h-96 bg-evening-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>
    </section>
  )
}