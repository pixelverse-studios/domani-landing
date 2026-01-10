'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Target, Wallet, Zap, Shield } from 'lucide-react'
import DynamicCTA from '@/components/DynamicCTA'

export type IconName = 'heart' | 'target' | 'zap' | 'wallet' | 'shield'

const ICONS: Record<IconName, typeof Heart> = {
  heart: Heart,
  target: Target,
  zap: Zap,
  wallet: Wallet,
  shield: Shield,
}

export interface AboutValue {
  icon: IconName
  title: string
  description: string
}

interface AboutContentProps {
  values: AboutValue[]
}

// Custom easing curve for smooth animations
const smoothEase = [0.25, 0.1, 0.25, 1] as const

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: smoothEase },
  },
}

// Scroll-triggered section wrapper
function AnimatedSection({
  children,
  className = '',
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: smoothEase,
            delay
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Glassmorphism card component
function GlassCard({
  children,
  className = '',
  hover = true
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/70 dark:bg-white/[0.04]
        backdrop-blur-xl
        border border-white/50 dark:border-white/[0.08]
        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:shadow-[0_20px_48px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_20px_48px_rgba(99,102,241,0.15)]' : ''}
        ${hover ? 'hover:border-primary-200/50 dark:hover:border-primary-500/20' : ''}
        transition-shadow duration-300
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/[0.02] pointer-events-none" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export function AboutContent({ values }: AboutContentProps) {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  const sections: Array<{
    heading: string
    content: ReactNode
    accent?: 'problem' | 'solution'
  }> = [
    {
      heading: 'The Morning Problem',
      accent: 'problem',
      content: (
        <>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Research shows that decision fatigue peaks in the morning. Your brain is bombarded with
            choices: What should I work on first? What&apos;s actually important? Should I respond to
            this email or start that project?
          </p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            By the time you&apos;ve made these decisions, you&apos;ve already burned through precious mental
            energy. The best hours of your day—gone, spent on planning instead of doing.
          </p>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border border-red-100 dark:border-red-900/30">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-red-500/25">
              73%
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Studies show planning the night before reduces morning decision fatigue by 73% and
              increases task completion rates by 42%.
            </p>
          </div>
        </>
      ),
    },
    {
      heading: 'The Evening Solution',
      accent: 'solution',
      content: (
        <>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Evening planning flips the script. At the end of your day, you&apos;re reflective, not
            reactive. You can see what worked, what didn&apos;t, and what truly matters for tomorrow.
          </p>
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary-50 to-evening-50 dark:from-primary-900/60 dark:to-evening-900/60 border border-primary-100 dark:border-primary-600/40 mb-6">
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-50 text-center">
              Plan when you&apos;re calm, execute when you&apos;re focused.
            </p>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Domani helps you trust the decisions you made while calm and clear-headed.
            No morning overthinking. No second-guessing. Just wake up and execute.
          </p>
        </>
      ),
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 via-white to-blue-50/50 dark:from-[#0A0A0F] dark:via-[#0F0F18] dark:to-[#0A0A0F]" />

        {/* Floating gradient orbs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-300/30 to-transparent blur-[100px] dark:from-primary-600/20 animate-blob" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-evening-300/25 to-transparent blur-[80px] dark:from-evening-600/15 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-blue-300/20 to-transparent blur-[90px] dark:from-blue-600/10 animate-blob animation-delay-4000" />

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      </div>

      <div className="container mx-auto px-4 pt-8 pb-24">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center mb-32"
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium backdrop-blur-sm border border-primary-200/50 dark:border-primary-800/50">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Our Philosophy
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95] tracking-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              The Science of
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-evening-500 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_8s_ease-in-out_infinite]">
              Evening Planning
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto"
          >
            We built Domani because we were tired of waking up stressed, scrambling to figure out what
            mattered. There had to be a better way.
          </motion.p>
        </motion.div>

        {/* Problem/Solution Sections */}
        <div className="space-y-24 mb-32">
          {sections.map((section, index) => (
            <AnimatedSection
              key={section.heading}
              className="max-w-4xl mx-auto"
              delay={index * 0.1}
            >
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Section number/icon */}
                <div className="flex-shrink-0">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold
                    ${section.accent === 'problem'
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'bg-gradient-to-br from-primary-500 to-evening-500 text-white shadow-lg shadow-primary-500/25'
                    }
                  `}>
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className={`
                    text-3xl md:text-4xl font-bold mb-8
                    ${section.accent === 'problem'
                      ? 'text-gray-900 dark:text-white'
                      : 'bg-gradient-to-r from-primary-600 to-evening-600 dark:from-primary-400 dark:to-evening-400 bg-clip-text text-transparent'
                    }
                  `}>
                    {section.heading}
                  </h2>

                  <GlassCard className="p-8 md:p-10" hover={false}>
                    {section.content}
                  </GlassCard>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Values Section - Bento Grid */}
        <AnimatedSection className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-evening-100/80 dark:bg-evening-900/30 text-evening-700 dark:text-evening-300 text-sm font-medium backdrop-blur-sm border border-evening-200/50 dark:border-evening-800/50 mb-6"
            >
              Our Core Values
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              What We Believe
            </h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {values.map((value, index) => {
              const Icon = ICONS[value.icon]
              const isFeature = index === 0 // First item gets featured treatment

              return (
                <motion.div
                  key={value.title}
                  variants={scaleIn}
                  className={isFeature ? 'md:col-span-2' : ''}
                >
                  <GlassCard className={`p-8 h-full ${isFeature ? 'md:p-10' : ''}`}>
                    <div className={`flex ${isFeature ? 'flex-col md:flex-row md:items-center' : 'flex-col'} gap-6`}>
                      <div className={`
                        flex-shrink-0 rounded-2xl flex items-center justify-center
                        bg-gradient-to-br from-primary-100 to-evening-100
                        dark:from-primary-900/50 dark:to-evening-900/50
                        ${isFeature ? 'w-20 h-20' : 'w-14 h-14'}
                      `}>
                        <Icon className={`${isFeature ? 'w-10 h-10' : 'w-7 h-7'} text-primary-600 dark:text-primary-400`} />
                      </div>

                      <div className="flex-1">
                        <h3 className={`font-bold text-gray-900 dark:text-white mb-3 ${isFeature ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                          {value.title}
                        </h3>
                        <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${isFeature ? 'text-lg' : ''}`}>
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatedSection>

        {/* Team Section */}
        <AnimatedSection className="max-w-4xl mx-auto mb-32">
          <GlassCard className="p-10 md:p-14 text-center" hover={false}>
            <div className="mb-8">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-evening-500 text-white text-2xl shadow-lg shadow-primary-500/25">
                <Heart className="w-8 h-8" />
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Built by People Who Get It
            </h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                We&apos;re not a massive productivity company trying to do everything. We&apos;re a small team
                obsessed with solving one problem extremely well: chaotic mornings.
              </p>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Every feature in Domani exists because we needed it ourselves. The evening planning
                mode? We use it every night. The 3-6 task limit? Based on years of trial and error.
              </p>
              <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary-600 to-evening-600 dark:from-primary-400 dark:to-evening-400 bg-clip-text text-transparent">
                This isn&apos;t just an app. It&apos;s how we run our lives.
              </p>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <div className="relative">
            {/* Glow effect behind CTA */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-evening-500/20 to-primary-500/20 blur-3xl rounded-full scale-150 -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 dark:from-white dark:via-primary-200 dark:to-white bg-clip-text text-transparent">
                Ready to Transform Your Mornings?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto">
                Download Domani and start planning tonight. Your future self will thank you.
              </p>
              <DynamicCTA size="large" analyticsLocation="about" />
            </motion.div>
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0A0A0F] to-transparent pointer-events-none" />

      {/* CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
