'use client'

import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-surface/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-elevated">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
    </header>
  )
}