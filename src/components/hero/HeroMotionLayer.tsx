'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export function HeroMotionLayer() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('hero-motion-enabled')

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-motion]'))
    targets.forEach((element, index) => {
      element.style.setProperty('--hero-motion-delay', `${index * 80}ms`)
    })

    const raf = requestAnimationFrame(() => {
      targets.forEach((element) => element.classList.add('hero-motion-visible'))
    })

    return () => {
      root.classList.remove('hero-motion-enabled')
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white/0 via-white/10 to-white/0 dark:from-black/0 dark:via-white/5 dark:to-black/0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-primary-400/20 to-transparent dark:from-primary-500/10"
        animate={{ scale: [0.9, 1.05, 0.95], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}
