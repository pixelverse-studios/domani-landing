import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Domani Admin',
    default: 'Admin Dashboard | Domani',
  },
  description: 'Domani admin dashboard for managing waitlist and campaigns',
  robots: {
    index: false,
    follow: false,
  },
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Minimal layout for admin pages
  // The actual dashboard layout with sidebar will be added in Phase 4
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}