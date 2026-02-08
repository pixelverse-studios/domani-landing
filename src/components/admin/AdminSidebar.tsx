'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Activity,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  UserPlus,
  Mail,
  FileText
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Waitlist', href: '/admin/waitlist', icon: UserPlus },
  { name: 'Campaigns', href: '/admin/campaigns', icon: Mail },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Audit Logs', href: '/admin/audit', icon: Activity },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAdminAuth({ requireAuth: false })

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Logo href="/admin" />
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100:bg-gray-700/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary-100 text-primary-600 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <UserCircle className="h-8 w-8 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.user?.email || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom controls */}
          <div className="border-t border-gray-200 p-4">
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100:bg-gray-700/50 transition-colors text-sm text-gray-700"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}