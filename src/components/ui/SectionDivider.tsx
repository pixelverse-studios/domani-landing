'use client'

import { cn } from '@/lib/utils'

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'tilt' | 'mountain'
  className?: string
  flip?: boolean
  height?: number
}

export function SectionDivider({
  variant = 'wave',
  className,
  flip = false,
  height = 100
}: SectionDividerProps) {

  const getPath = () => {
    switch (variant) {
      case 'wave':
        return "M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z"
      case 'curve':
        return "M0,80 Q250,20 500,40 T1000,80 L1000,100 L0,100 Z"
      case 'tilt':
        return "M0,100 L1000,40 L1000,100 L0,100 Z"
      case 'mountain':
        return "M0,100 L250,30 L500,60 L750,20 L1000,100 Z"
      default:
        return "M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z"
    }
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        flip && "rotate-180",
        className
      )}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="divider-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-primary-50/30 dark:text-primary-900/20" stopColor="currentColor" />
            <stop offset="50%" className="text-primary-100/50 dark:text-primary-800/30" stopColor="currentColor" />
            <stop offset="100%" className="text-primary-50/30 dark:text-primary-900/20" stopColor="currentColor" />
          </linearGradient>
        </defs>
        <path
          d={getPath()}
          fill="url(#divider-gradient)"
          className="transition-all duration-500"
        />
        {/* Subtle secondary wave for depth */}
        <path
          d={getPath()}
          fill="currentColor"
          className="text-white/50 dark:text-dark-gradient-from/50 opacity-60"
          transform="translate(0, 5)"
        />
      </svg>
    </div>
  )
}