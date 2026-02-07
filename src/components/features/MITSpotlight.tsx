'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Crown } from 'lucide-react'
import { SectionDivider } from '@/components/ui/SectionDivider'

export function MITSpotlight() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const prefersReducedMotion = useReducedMotion()

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [40, -40]
  )
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-clip bg-gradient-to-b from-white via-primary-50/30 to-white px-4 py-24 dark:from-dark-gradient-from dark:via-dark-elevated dark:to-dark-gradient-from sm:px-6 lg:px-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: translateY }}
          className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-[#F4C7BE] to-[#EFBDB3] opacity-20 blur-3xl dark:from-[#D77A61]/20 dark:to-[#C76B56]/20"
        />
        <motion.div
          style={{ y: translateY }}
          className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 opacity-20 blur-3xl dark:from-primary-500/20 dark:to-primary-600/20"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16"
        >
          {/* Icon/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#E5967F] to-[#D77A61] opacity-20 blur-2xl" />

              {/* Main icon container */}
              <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-[#D77A61] to-[#C76B56] shadow-2xl shadow-[#D77A61]/30 sm:h-40 sm:w-40">
                <Crown className="h-16 w-16 text-white sm:h-20 sm:w-20" />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute -bottom-3 -right-3 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-[#C05A43] shadow-lg dark:bg-dark-card dark:text-[#E5967F]"
              >
                #1 Priority
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C05A43] dark:text-[#E5967F]"
            >
              Most Important Task
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
            >
              One Task. Total Focus.{' '}
              <span className="bg-gradient-to-r from-[#D77A61] to-[#C76B56] bg-clip-text text-transparent">
                Maximum Impact.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 text-lg text-gray-600 dark:text-gray-300"
            >
              Domani gives you a simple way to elevate one task above the rest. By marking a task as
              high priority, your focus becomes unmistakable. When tomorrow begins, you&apos;re not
              deciding what matters — you&apos;re executing what you already chose. Less hesitation.
              More momentum.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Clarity over chaos
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Progress over perfection
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Action over anxiety
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-px">
        <SectionDivider variant="curve" className="text-white dark:text-dark-gradient-from" />
      </div>
    </section>
  )
}
