'use client'

import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-surface/90 backdrop-blur-md border-b border-gray-200 dark:border-dark-elevated">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-evening-500 dark:from-primary-400 dark:to-primary-400 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Domani</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}