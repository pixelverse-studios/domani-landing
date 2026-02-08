'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function BenefitsMotionLayer() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const translatePrimary = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const translateSecondary = useTransform(scrollYProgress, [0, 1], [30, -30])
  const scalePulse = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-32 left-40 h-96 w-96 rounded-full bg-primary-200/50 blur-3xl mix-blend-multiply dark:bg-primary-600/10"
        style={{ y: translatePrimary }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-20 right-0 h-80 w-80 rounded-full bg-primary-300 blur-2xl mix-blend-multiply dark:bg-primary-600/15"
        style={{ y: translateSecondary, scale: scalePulse }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      <motion.div
        className="absolute inset-0 mx-auto my-auto h-[600px] w-[600px] rounded-full bg-gradient-radial from-primary-100/20 to-transparent opacity-50 dark:from-primary-500/10"
        style={{ scale: scalePulse }}
      />
    </div>
  )
}
