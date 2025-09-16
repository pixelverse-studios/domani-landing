'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { isSafari, isMobileSafari, getTimestamp, hasReliableIntersectionObserver } from '@/utils/browser'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
  colorClassName?: string
}

export function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
  className,
  colorClassName
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const hasAnimated = useRef(false)

  // Use Framer Motion's useInView only if IntersectionObserver is reliable
  const shouldUseInView = hasReliableIntersectionObserver()
  const inView = useInView(ref, { once: true, margin: '-100px' })

  // Safari fallback: Check if element is in viewport using scroll events
  const checkIfInView = useCallback(() => {
    if (!ref.current || hasAnimated.current) return false

    const rect = ref.current.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth

    // Check if element is in viewport
    const verticalInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0)
    const horizontalInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)

    return verticalInView && horizontalInView
  }, [])

  // Setup scroll listener for Safari
  useEffect(() => {
    // Skip if we're using reliable IntersectionObserver
    if (shouldUseInView) return

    const handleScroll = () => {
      if (checkIfInView() && !hasAnimated.current) {
        setIsVisible(true)
      }
    }

    // Check immediately on mount (Safari might already have the element in view)
    if (checkIfInView()) {
      setIsVisible(true)
    }

    // Add scroll listener for Safari
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Also trigger on a slight delay for Safari mobile
    const timeoutId = setTimeout(() => {
      if (checkIfInView() && !hasAnimated.current) {
        setIsVisible(true)
      }
    }, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [checkIfInView, shouldUseInView])

  // Determine if we should animate based on detection method
  const shouldAnimate = shouldUseInView ? inView : isVisible

  useEffect(() => {
    if (shouldAnimate && !hasAnimated.current) {
      hasAnimated.current = true

      // Use performance.now() for better precision in Safari
      const startTime = getTimestamp()
      const endValue = value

      const animate = () => {
        const now = getTimestamp()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function: easeOutQuart
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(endValue * easeOutQuart)

        setCount(currentValue)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setCount(endValue)
        }
      }

      // Start animation immediately for Safari
      if (isSafari() || isMobileSafari()) {
        // Small delay to ensure Safari is ready
        setTimeout(() => {
          animate()
        }, 50)
      } else {
        animate()
      }
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [shouldAnimate, value, duration])

  // Format number with k suffix
  const formatNumber = (num: number) => {
    if (suffix === 'k' && value >= 1000) {
      return Math.floor(value / 1000).toString()
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k'
    }
    return num.toString()
  }

  // For debugging in Safari - can be removed in production
  useEffect(() => {
    if ((isSafari() || isMobileSafari()) && typeof window !== 'undefined') {
      console.log(`Safari detected. Counter for value ${value}: visible=${shouldAnimate}, count=${count}`)
    }
  }, [shouldAnimate, count, value])

  return (
    <span
      ref={ref}
      className={cn(className, colorClassName)}
      aria-label={`${value}${suffix}`}
      role="text"
    >
      {formatNumber(count)}{suffix}
    </span>
  )
}