'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Logo } from './Logo'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
]

interface NavLinkProps {
  href: string
  label: string
  className?: string
  disableUnderline?: boolean
  onClick?: () => void
}

function NavLink({ href, label, className, disableUnderline = false, onClick }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900',
        !disableUnderline &&
          'after:absolute after:-bottom-2 after:left-1/2 after:h-0.5 after:w-8 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-primary-600 after:via-primary-500 after:to-primary-700 after:opacity-0 after:transition-all after:duration-200 hover:after:opacity-100 hover:after:scale-100 after:scale-0',
        !disableUnderline && isActive && 'text-gray-900 after:opacity-100 after:scale-100',
        disableUnderline && isActive && 'text-gray-900',
        className
      )}
    >
      {label}
    </Link>
  )
}

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-6 md:grid md:grid-cols-[auto_1fr_auto] relative">
        <Logo />

        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center justify-end gap-8 pr-2"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-3 md:justify-self-end">
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/70 text-gray-600 hover:text-gray-900 shadow-sm transition"
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.nav
              key="mobile-nav"
              id="mobile-navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full mt-3 px-4 md:hidden"
              aria-label="Mobile navigation"
            >
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-2 rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl p-4"
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    {...link}
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-base text-gray-700 after:hidden"
                  />
                ))}
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
