'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Heart, Target, Wallet, Zap } from 'lucide-react'
import WaitlistInline from '@/components/WaitlistInline'

export type IconName = 'heart' | 'target' | 'zap' | 'wallet'

const ICONS: Record<IconName, typeof Heart> = {
  heart: Heart,
  target: Target,
  zap: Zap,
  wallet: Wallet,
}

export interface AboutValue {
  icon: IconName
  title: string
  description: string
}

interface AboutContentProps {
  values: AboutValue[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export function AboutContent({ values }: AboutContentProps) {
  const sections: Array<{
    heading: string
    content: ReactNode
  }> = [
    {
      heading: 'The Morning Problem',
      content: (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Research shows that decision fatigue peaks in the morning. Your brain is bombarded with
            choices: What should I work on first? What&apos;s actually important? Should I respond to
            this email or start that project?
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            By the time you&apos;ve made these decisions, you&apos;ve already burned through precious mental
            energy. The best hours of your day—gone, spent on planning instead of doing.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Studies show that planning the night before reduces morning decision fatigue by 73% and
            increases task completion rates by 42%.
          </p>
        </div>
      ),
    },
    {
      heading: 'The Evening Solution',
      content: (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Evening planning flips the script. At the end of your day, you&apos;re reflective, not
            reactive. You can see what worked, what didn&apos;t, and what truly matters for tomorrow.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Domani is built around this simple insight: <strong>Plan when you&apos;re calm, execute
            when you&apos;re focused.</strong>
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our &ldquo;Plan Lock&rdquo; feature prevents you from changing your plan after you&apos;ve set it.
            No morning overthinking. No second-guessing. Just wake up and execute.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 pt-8 pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            The Science of Evening Planning
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          We built Domani because we were tired of waking up stressed, scrambling to figure out what
          mattered. There had to be a better way.
        </motion.p>
      </motion.div>

      <div className="space-y-20">
        {sections.map((section) => (
          <motion.section
            key={section.heading}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 text-center">
              {section.heading}
            </motion.h2>
            {section.content}
          </motion.section>
        ))}
      </div>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-5xl mx-auto my-20"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">What We Believe</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = ICONS[value.icon]
            return (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                custom={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      <motion.section initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl mx-auto mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Built by People Who Get It</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            We&apos;re not a massive productivity company trying to do everything. We&apos;re a small team
            obsessed with solving one problem extremely well: chaotic mornings.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Every feature in Domani exists because we needed it ourselves. The evening planning
            mode? We use it every night. The 3-6 task limit? Based on years of trial and error.
          </p>
          <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            This isn&apos;t just an app. It&apos;s how we run our lives.
          </p>
        </div>
      </motion.section>

      <motion.section initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Be First on the Waitlist</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Domani is now in public beta. Drop your email to get updates and be first to know about new features.
        </p>
        <div className="max-w-xl mx-auto">
          <WaitlistInline />
        </div>
      </motion.section>
    </div>
  )
}
