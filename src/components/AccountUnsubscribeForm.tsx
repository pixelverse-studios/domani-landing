'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, AlertCircle, CheckCircle, ArrowLeft, XCircle, BellOff } from 'lucide-react'
import { validateEmail } from '@/utils/validation'

type FormState = 'input' | 'confirm' | 'success' | 'error'

interface AccountUnsubscribeFormProps {
  initialEmail?: string
}

interface ApiError {
  errors?: { msg: string }[]
  error?: string
}

export default function AccountUnsubscribeForm({ initialEmail = '' }: AccountUnsubscribeFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [formState, setFormState] = useState<FormState>('input')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isValidEmail = email.length > 0 && validateEmail(email)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errorMessage) setErrorMessage(null)
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail) return
    setFormState('confirm')
  }

  const handleCancel = () => {
    setFormState('input')
    setErrorMessage(null)
  }

  const handleUnsubscribe = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/domani/users/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json() as ApiError & { message?: string }

      if (!response.ok) {
        if (response.status === 400 && data.errors && data.errors.length > 0) {
          throw new Error(data.errors[0].msg)
        }
        if (response.status === 404) {
          throw new Error(data.error || 'Email not found')
        }
        throw new Error('Something went wrong. Please try again.')
      }

      // Track unsubscribe event
      if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'account_email_unsubscribe', {
          event_category: 'engagement',
        })
      }

      setFormState('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setFormState('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* Input State */}
        {formState === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleContinue} className="space-y-4" noValidate>
              <div>
                <label htmlFor="account-unsubscribe-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="account-unsubscribe-email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    autoComplete="email"
                    aria-required="true"
                    aria-describedby="account-email-help"
                    className="w-full pl-10 px-4 py-3 border rounded-lg outline-none transition-all duration-200 bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500:border-primary-400"
                    placeholder="Enter your email"
                  />
                </div>
                <p id="account-email-help" className="mt-2 text-sm text-gray-500">
                  Enter the email address associated with your Domani account.
                </p>
              </div>

              <button
                type="submit"
                disabled={!isValidEmail}
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
                  ${!isValidEmail
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                  }
                `}
              >
                Continue
              </button>
            </form>
          </motion.div>
        )}

        {/* Confirm State */}
        {formState === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Confirm Email Preferences
            </h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to unsubscribe from all email notifications?
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6">
              <Mail className="w-4 h-4" />
              {email}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              You will no longer receive any email notifications from Domani, including task reminders, weekly summaries, and product updates.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50:bg-gray-800 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </span>
              </button>
              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Yes, Unsubscribe'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {formState === 'success' && (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <BellOff className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Email Notifications Disabled
            </h3>
            <p className="text-gray-600 mb-2">
              You&apos;ve been unsubscribed from all Domani email notifications.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6">
              <Mail className="w-4 h-4" />
              {email}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Your account is still active. You can manage notification preferences anytime in the app settings.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </Link>
          </motion.div>
        )}

        {/* Error State */}
        {formState === 'error' && (
          <motion.div
            key="error"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <XCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Unsubscribe
            </h3>
            <p className="text-gray-600 mb-4">
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setFormState('input')
                  setErrorMessage(null)
                }}
                className="py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50:bg-gray-800 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Try Again
                </span>
              </button>
              <Link
                href="/"
                className="py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transition-all duration-200"
              >
                Back to Homepage
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
