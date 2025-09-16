'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SocialProof() {
  const [userCount, setUserCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(0)

  // Fetch the actual user count from the API
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/users/count', {
          next: { revalidate: 60 } // Cache for 1 minute
        })
        const data = await response.json()
        setUserCount(data.count || 1000)
      } catch (error) {
        console.error('Error fetching user count:', error)
        setUserCount(1000) // Fallback count
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCount()

    // Refresh count every minute
    const interval = setInterval(fetchUserCount, 60000)

    return () => clearInterval(interval)
  }, [])

  // Animate the count when it changes
  useEffect(() => {
    if (userCount === null) return

    const duration = 1500 // Animation duration in ms
    const steps = 60
    const stepDuration = duration / steps
    const increment = (userCount - displayCount) / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep === steps) {
        setDisplayCount(userCount)
        clearInterval(timer)
      } else {
        setDisplayCount(prev => Math.floor(prev + increment))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [userCount])

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-3"
    >
      {/* Main text with number */}
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Join</span>
        <motion.span
          key={displayCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-evening-600 dark:from-primary-500 dark:to-evening-500 bg-clip-text text-transparent"
        >
          {displayCount.toLocaleString()}
        </motion.span>
        <span className="text-sm text-gray-600 dark:text-gray-400">early adopters</span>
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