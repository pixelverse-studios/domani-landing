'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  className?: string
  href?: string
}

export function Logo({ className, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center transition-all duration-300',
        className
      )}
      aria-label="Domani - Home"
    >
      {/* Full logo for desktop/tablet */}
      <span
        className={cn(
          'hidden md:inline-block font-abril text-3xl lg:text-4xl font-bold',
          'bg-gradient-to-r from-primary-600 to-evening-600',
          'dark:from-primary-500 dark:to-evening-500',
          'bg-clip-text text-transparent',
          'transition-all duration-300',
          'group-hover:from-primary-500 group-hover:to-evening-500',
          'dark:group-hover:from-primary-400 dark:group-hover:to-evening-400',
          'select-none'
        )}
      >
        Domani
      </span>

      {/* Abbreviated logo for mobile */}
      <span
        className={cn(
          'inline-block md:hidden font-abril text-4xl font-bold',
          'bg-gradient-to-r from-primary-600 to-evening-600',
          'dark:from-primary-500 dark:to-evening-500',
          'bg-clip-text text-transparent',
          'transition-all duration-300',
          'group-hover:from-primary-500 group-hover:to-evening-500',
          'dark:group-hover:from-primary-400 dark:group-hover:to-evening-400',
          'select-none'
        )}
      >
        D
      </span>
    </Link>
  )
}