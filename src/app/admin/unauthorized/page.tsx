import { ShieldOff, ArrowLeft, Home, Lock } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unauthorized Access',
  description: 'You do not have permission to access this resource',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UnauthorizedPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldOff className="w-12 h-12 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Unauthorized Access
          </h1>
          <p className="text-lg text-gray-600">
            You don&apos;t have permission to access this resource.
          </p>
          <p className="text-sm text-gray-500">
            This incident has been logged for security purposes.
          </p>
        </div>

        {/* Error Code */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-mono text-gray-600">
              ERROR: 403 FORBIDDEN
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Lock className="w-4 h-4 mr-2" />
            Login Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </div>

        {/* Support Link */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please{' '}
            <a
              href="mailto:support@domani-app.com"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
