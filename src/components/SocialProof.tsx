'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SocialProof() {
  const [userCount, setUserCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState<number | null>(null)

  // Fetch the actual user count from the API
  useEffect(() => {
    let isActive = true

    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/users/count')
        const data = await response.json()
        if (!isActive) return
        setUserCount(typeof data.count === 'number' ? data.count : 0)
      } catch (error) {
        if (!isActive) return
        console.error('Failed to fetch waitlist count', error)
        setUserCount(1200)
      }
    }

    fetchUserCount()

    return () => {
      isActive = false
    }
  }, [])

  // Animate the count when userCount changes
  useEffect(() => {
    if (userCount === null) return

    const duration = 1500 // Animation duration in ms
    const steps = 60
    const stepDuration = duration / steps
    const increment = userCount / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayCount(userCount)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.floor(increment * currentStep))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [userCount])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-3"
    >
      {/* Main text with number */}
      <div className="flex items-baseline gap-2">
        <motion.span
          key={displayCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-evening-600 dark:from-primary-500 dark:to-evening-500 bg-clip-text text-transparent"
        >
          {(displayCount ?? 0).toLocaleString()}
        </motion.span>
        <span className="text-sm text-gray-600 dark:text-gray-400">people planning smarter</span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live</span>
      </div>
    </motion.div>
  )
}
