'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { BenefitCard } from './BenefitCard'
import { benefitsData } from './benefitsData'

interface BenefitsSectionProps {
  className?: string
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section 
      ref={ref}
      className={cn(
        'relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-primary-50/20 to-white dark:from-dark-gradient-from dark:via-dark-gradient-via dark:to-dark-gradient-to',
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
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <BenefitCard benefit={benefit} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Pattern - matching Hero section */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-evening-300 dark:bg-evening-600/20 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-20 dark:opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-300 dark:bg-primary-600/20 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-20 dark:opacity-30 animate-float animate-float-delay-1"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent dark:bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-xl opacity-20 dark:opacity-30 animate-float animate-float-delay-2"></div>
      </div>
    </section>
  )
}