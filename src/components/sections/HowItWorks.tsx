'use client'

import { motion } from 'framer-motion'
import { Moon, Sunrise, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Step {
  number: number
  icon: LucideIcon
  title: string
  description: string
  time: string
}

const steps: Step[] = [
  {
    number: 1,
    icon: Moon,
    title: 'Plan Tomorrow Tonight',
    description:
      'Spend 10 minutes each evening choosing your top priorities for tomorrow. When you\u2019re calm and reflective, decisions come easier.',
    time: '~9 PM',
  },
  {
    number: 2,
    icon: Sunrise,
    title: 'Wake Up With a Clear Plan',
    description:
      'No inbox triage. No scrambling. Open Domani and your priorities are already waiting — decided by your calm, clear-headed evening self.',
    time: '~7 AM',
  },
  {
    number: 3,
    icon: Zap,
    title: 'Execute With Focus',
    description:
      'Start your most important task right away. No planning overhead, no decision fatigue. Just momentum from minute one.',
    time: 'All day',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export function HowItWorks() {
  return (
    <section className="relative overflow-clip bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-600">
            Simple by design
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            How Evening Planning Works
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Three steps. Ten minutes. A completely different morning.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative mt-16"
        >
          {/* Connector line — desktop only */}
          <div className="absolute left-1/2 top-[52px] hidden h-0.5 w-[calc(100%-200px)] -translate-x-1/2 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 lg:block" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="relative text-center"
                >
                  {/* Step number + icon circle */}
                  <div className="relative mx-auto mb-6 flex h-[104px] w-[104px] items-center justify-center">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary-100" />
                    {/* Inner circle */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-700 shadow-md ring-2 ring-primary-100">
                      {step.number}
                    </div>
                  </div>

                  {/* Time tag */}
                  <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
                    {step.time}
                  </span>

                  <h3 className="mt-2 text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-[14px] leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
