'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import WaitlistInline from './WaitlistInline'
import SocialProof from './SocialProof'
import { SectionDivider } from '@/components/ui/SectionDivider'

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
}

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  ctaText?: string
  secondaryCtaText?: string
  variant?: 'A' | 'B' | 'C'
}

export default function HeroSection({
  headline = "Plan Tomorrow Tonight, Wake Up Ready",
  subheadline = "Transform your productivity with evening planning psychology. Add tomorrow's tasks when you're calm, execute when you're focused.",
  ctaText = "Join Waitlist",
  secondaryCtaText = "See How It Works",
  variant = 'A'
}: HeroSectionProps) {
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [earlyAdopters, setEarlyAdopters] = useState(1042)

  useEffect(() => {
    const interval = setInterval(() => {
      setEarlyAdopters(prev => prev + Math.floor(Math.random() * 3))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleCTAClick = () => {
    setWaitlistOpen(true)
    trackEvent('hero_cta_click', { variant, text: ctaText })
  }

  const handleSecondaryCTA = () => {
    trackEvent('hero_secondary_cta_click', { variant, text: secondaryCtaText })
    const demoSection = document.getElementById('demo')
    demoSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const trackEvent = (eventName: string, data: any) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data)
    }
  }

  return (
    <>
      <section
        className="relative min-h-screen flex items-center justify-center overflow-clip bg-gradient-to-b from-white via-primary-50/30 to-primary-50/10 dark:from-dark-gradient-from dark:via-dark-gradient-via dark:to-dark-gradient-to/95"
        aria-label="Hero section"
      >
        {/* Background Pattern - Enhanced with better flow */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-evening-300 dark:bg-evening-600/20 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-20 dark:opacity-30 animate-float"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-300 dark:bg-primary-600/20 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-20 dark:opacity-30 animate-float animate-float-delay-1"></div>
          {/* Extended blob that flows into next section */}
          <div className="absolute -bottom-32 left-20 w-96 h-96 bg-primary-200 dark:bg-primary-500/20 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-2xl opacity-15 dark:opacity-20 animate-float animate-float-delay-2"></div>
          {/* Additional connector blob */}
          <div className="absolute -bottom-48 right-32 w-80 h-80 bg-evening-200 dark:bg-evening-500/15 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-2xl opacity-10 dark:opacity-15 animate-float"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Content Column */}
            <div className="text-center lg:text-left">
              <motion.div variants={itemVariants}>
                <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                  ✨ Early Access Available
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
              >
                <span className="block">Plan Tomorrow Tonight</span>
                <span className="block gradient-text">Wake Up Ready</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                {subheadline}
              </motion.p>

              {/* Inline Waitlist Form */}
              <motion.div 
                variants={itemVariants}
                className="mb-8"
              >
                <WaitlistInline />
              </motion.div>

              {/* Trust Signals */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 tasks daily forever
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cancel anytime
                </span>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={itemVariants} className="mt-8">
                <SocialProof count={earlyAdopters} />
              </motion.div>
            </div>

            {/* Visual Column */}
            <motion.div 
              variants={itemVariants}
              className="relative lg:pl-8"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating App Screenshot Container */}
                <div className="relative">
                  {/* Gradient Background Blur */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-evening-500 rounded-3xl transform rotate-6 scale-105 opacity-10 blur-xl"></div>

                  {/* Floating App Interface */}
                  <motion.div
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    className="relative"
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.25),0_16px_48px_rgba(0,0,0,0.15)] transition-shadow duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.15),0_16px_32px_rgba(0,0,0,0.1),0_24px_56px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_16px_rgba(0,0,0,0.35),0_16px_32px_rgba(0,0,0,0.3),0_24px_56px_rgba(0,0,0,0.2)] bg-white dark:bg-gray-900">
                      {/* Status Bar */}
                      <div className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-2 text-xs flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                        <span>8:00 PM</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                          <div className="w-4 h-2 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                          <div className="w-4 h-2 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="p-6 bg-gradient-to-b from-primary-50 to-white dark:from-dark-elevated dark:to-dark-surface min-h-[500px]">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tomorrow's Plan</h3>

                        {/* Task Cards */}
                        <div className="space-y-3">
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-blue-500 mt-0.5"></div>
                              <div className="flex-1">
                                <p className="text-gray-900 dark:text-white font-medium">Morning team standup</p>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">💼 Work</span>
                              </div>
                              <span className="text-yellow-500">⭐</span>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-green-500 mt-0.5"></div>
                              <div className="flex-1">
                                <p className="text-gray-900 dark:text-white font-medium">30 min morning run</p>
                                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full inline-block mt-1">❤️ Health</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-purple-500 mt-0.5"></div>
                              <div className="flex-1">
                                <p className="text-gray-900 dark:text-white font-medium">Grocery shopping</p>
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block mt-1">🏠 Personal</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lock Button */}
                        <button className="w-full mt-6 py-3 bg-gradient-to-r from-primary-600 to-evening-600 text-white font-semibold rounded-xl shadow-lg">
                          Lock Tonight's Plan
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Floating Elements - Fixed positioning */}
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Tasks Set</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 transform -translate-x-2 translate-y-2 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl">🔥</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">7 Day Streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Section Divider - Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-px">
          <SectionDivider variant="wave" className="text-white dark:text-dark-gradient-from" />
        </div>
      </section>

      {/* Waitlist Modal */}
      {waitlistOpen && (
        <WaitlistForm onClose={() => setWaitlistOpen(false)} />
      )}
    </>
  )
}