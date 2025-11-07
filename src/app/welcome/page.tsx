import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Welcome to Domani',
  description: 'Your account has been successfully created',
}

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to Domani!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your account has been successfully created.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 text-left shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            What&apos;s next?
          </h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Your account is now active</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>You can start planning your tasks for tomorrow</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>Download our mobile app for on-the-go planning</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By continuing you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
