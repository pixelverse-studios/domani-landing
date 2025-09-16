'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { BenefitCard } from './BenefitCard'
import { benefitsData } from './benefitsData'
import { SectionDivider } from '@/components/ui/SectionDivider'

interface BenefitsSectionProps {
  className?: string
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  return (
    <section
      ref={ref}
      className={cn(
        'relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/10 via-white to-white dark:from-dark-gradient-to/95 dark:via-dark-gradient-via dark:to-dark-gradient-from overflow-clip',
        className
      )}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Science-Backed Benefits
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Domani leverages cognitive psychology research to transform how your brain processes tasks, 
            reducing mental fatigue while amplifying your natural productivity rhythms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <BenefitCard benefit={benefit} className="h-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Pattern - Connected flow from hero with parallax */}
      <motion.div className="absolute inset-0 -z-10 overflow-hidden" style={{ opacity }}>
        {/* Continuation from hero section with parallax */}
        <motion.div
          className="absolute -top-32 left-40 w-96 h-96 bg-primary-200/50 dark:bg-primary-600/10 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-3xl opacity-15 dark:opacity-20"
          style={{ y }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 right-0 w-80 h-80 bg-evening-200 dark:bg-evening-600/15 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-2xl opacity-15 dark:opacity-20"
          style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-primary-100 dark:bg-primary-500/10 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-20 dark:opacity-25 animate-float animate-float-delay-2"></div>
        {/* New connecting element */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-100/20 to-transparent dark:from-primary-500/5 dark:to-transparent rounded-full opacity-50 dark:opacity-30"
          style={{ scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]) }}
        />
      </motion.div>

      {/* Section Divider - Smooth transition to showcase section */}
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-px">
        <SectionDivider variant="curve" className="text-white dark:text-dark-gradient-from" />
      </div>
    </section>
  )
}