'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AnimatedCounter } from './AnimatedCounter'
import { PortalTooltip } from './PortalTooltip'
import type { Benefit } from './types'

interface BenefitCardProps {
  benefit: Benefit
  className?: string
}

export function BenefitCard({ benefit, className }: BenefitCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        'relative h-full bg-white dark:bg-dark-card rounded-2xl shadow-lg transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        'border border-gray-200 dark:border-gray-700',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-evening-600 dark:from-primary-500 dark:to-primary-500 p-0.5">
            <div className="w-full h-full rounded-xl bg-white dark:bg-dark-card flex items-center justify-center">
              {benefit.icon}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {benefit.title}
        </h3>

        <div className="mb-4">
          <AnimatedCounter
            value={benefit.statistic.value}
            suffix={benefit.statistic.suffix}
            className="text-3xl font-bold"
            colorClassName="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-evening-600 dark:from-primary-400 dark:to-primary-400"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {benefit.statistic.label}
          </p>
        </div>

        <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
          {benefit.description}
        </p>

        <div className="mt-auto">
          <PortalTooltip citation={benefit.citation}>
            <button className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-all duration-200 group">
              <svg 
                className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="underline decoration-dotted underline-offset-2">Research backed</span>
            </button>
          </PortalTooltip>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-evening-600/5 dark:from-primary-500/10 dark:to-primary-500/10 pointer-events-none rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}