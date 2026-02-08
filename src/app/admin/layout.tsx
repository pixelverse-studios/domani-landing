'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdminAuth()

  // Don't apply authentication check on login page
  const isLoginPage = pathname === '/admin/login'
  const isUnauthorizedPage = pathname === '/admin/unauthorized'

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage && !isUnauthorizedPage) {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, isLoginPage, isUnauthorizedPage, router])

  // Show loading state while checking authentication
  if (isLoading && !isLoginPage && !isUnauthorizedPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // For login and unauthorized pages, render without sidebar
  if (isLoginPage || isUnauthorizedPage || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Main admin layout with sidebar
  return (
    <div className="h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main content area - offset for sidebar */}
      <div className="lg:pl-64 flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}