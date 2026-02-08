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
          'bg-gradient-to-r from-primary-600 to-primary-700',
          'bg-clip-text text-transparent',
          'transition-all duration-300',
          'group-hover:from-primary-500 group-hover:to-primary-600',
          'select-none'
        )}
      >
        Domani
      </span>

      {/* Abbreviated logo for mobile */}
      <span
        className={cn(
          'inline-block md:hidden font-abril text-4xl font-bold',
          'bg-gradient-to-r from-primary-600 to-primary-700',
          'bg-clip-text text-transparent',
          'transition-all duration-300',
          'group-hover:from-primary-500 group-hover:to-primary-600',
          'select-none'
        )}
      >
        D
      </span>
    </Link>
  )
}