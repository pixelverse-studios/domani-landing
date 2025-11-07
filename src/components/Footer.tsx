import Link from 'next/link'
import { cn } from '@/lib/utils'

const footerLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Security', href: '/security' },
  { label: 'Blog', href: '/blog' },
]

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t border-gray-100 bg-white/80 py-10 text-sm text-gray-600 backdrop-blur dark:border-white/10 dark:bg-dark-surface/80 dark:text-gray-400',
        className
      )}
    >
      <div className="container mx-auto flex flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Domani</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Plan tomorrow tonight, wake up ready.</p>
          <p className="mt-2 text-xs">
            Need help? <a href="mailto:info@pixelversestudios.io" className="underline hover:text-primary-600 dark:hover:text-primary-300">info@pixelversestudios.io</a>
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary-600 dark:hover:text-primary-300">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-gray-500 dark:text-gray-500">&copy; {new Date().getFullYear()} Domani Labs. All rights reserved.</p>
      </div>
    </footer>
  )
}
