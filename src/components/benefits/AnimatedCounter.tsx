'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

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
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      const startTime = Date.now()
      const endValue = value

      const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(endValue * easeOutQuart)

        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(endValue)
        }
      }

      animate()
    }
  }, [isInView, value, duration])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k'
    }
    return num.toString()
  }

  return (
    <span 
      ref={ref} 
      className={cn(className, colorClassName)}
    >
      {formatNumber(count)}{suffix}
    </span>
  )
}