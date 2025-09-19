'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAdminUser } from '@/hooks/useAdminUser'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import {
  Shield,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Sparkles,
  Lock,
  CheckCircle
} from 'lucide-react'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('from') || '/admin'
  const error = searchParams.get('error')

  const { user, isLoading: isCheckingAuth } = useAdminUser()
  const { signInWithGoogle, isLoading: isSigningIn, error: authError } = useGoogleAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!isCheckingAuth && user) {
      router.push(returnUrl)
    }
  }, [user, isCheckingAuth, router, returnUrl])

  // Handle error messages from URL params
  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        no_code: 'Authentication was cancelled or failed. Please try again.',
        auth_failed: 'Authentication failed. Please try again.',
        no_email: 'Could not retrieve your email address. Please try again.',
        not_admin: 'Your account does not have admin privileges.',
        admin_not_found: 'Admin account not found. Please contact support.',
        callback_error: 'An error occurred during authentication. Please try again.',
        access_denied: 'Access was denied. Please try again or contact support.',
        email_not_confirmed: 'Your email address needs to be confirmed. Please check your inbox.',
        email_not_allowed: 'Your email is not authorized for admin access. Please contact support.',
      }

      const message = errorMessages[error] || 'An error occurred. Please try again.'
      toast.error('Authentication Error', {
        description: message,
      })
    }
  }, [error])

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      toast.error('Sign-in Failed', {
        description: authError.message,
      })
    }
  }, [authError])

  const handleGoogleSignIn = async () => {
    await signInWithGoogle({
      redirectTo: returnUrl,
      onSuccess: () => {
        toast.success('Redirecting to Google...', {
          description: 'Please complete authentication in the popup window.',
        })
      },
      onError: (error) => {
        console.error('Google sign-in error:', error)
      },
    })
  }

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Don't render if user is already logged in
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back to Site Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Domani
            </Link>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-purple-900/10 p-10 border border-gray-100 dark:border-gray-800"
          >
            {/* Logo and Title */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg mb-6"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
              >
                Admin Portal
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Sign in with your Google account to continue
              </motion.p>
            </div>

            {/* Session Expired Message */}
            {searchParams.get('session') === 'expired' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
              >
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Your session has expired. Please sign in again.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Unauthorized Message */}
            {searchParams.get('reason') === 'not_admin' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
              >
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Your account doesn't have admin privileges. Please contact support if you believe this is an error.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Google Sign-In Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                loading={isSigningIn}
                variant="light"
                size="large"
                className="shadow-lg hover:shadow-xl transition-shadow"
              />
            </motion.div>

            {/* Security Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Secure authentication with Google OAuth 2.0</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>Admin access restricted to authorized accounts</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span>All actions logged for security audit</span>
                </div>
              </div>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Having trouble signing in?{' '}
                <a
                  href="mailto:support@domani.app"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  Contact support
                </a>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} Domani. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-20 right-20 pointer-events-none"
      >
        <Sparkles className="w-24 h-24 text-purple-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-20 left-20 pointer-events-none"
      >
        <Lock className="w-20 h-20 text-blue-500" />
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}