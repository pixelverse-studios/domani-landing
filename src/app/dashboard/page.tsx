import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock, CheckSquare, LogOut } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard - Domani',
  description: 'Your personal productivity dashboard',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Domani Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <form action="/api/admin/auth/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Tasks Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Today&apos;s Tasks
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Plan for tomorrow
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No tasks scheduled yet
              </p>
            </div>
          </div>

          {/* Planning Time Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Planning Time
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Best time to plan
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8:00 PM</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Evening planning mode
              </p>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <CheckSquare className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Completion Rate
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This week
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">--</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start planning to track
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Full Dashboard Coming Soon!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            We&apos;re building an amazing productivity dashboard for you.
            In the meantime, check out our vision for the future of evening planning.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}