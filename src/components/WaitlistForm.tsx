'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { validateEmail } from '@/utils/validation'

const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? '/privacy'
const TERMS_URL = process.env.NEXT_PUBLIC_TERMS_URL ?? '/terms'

const legalLinkProps = (url: string) =>
  url.startsWith('http')
    ? { target: '_blank', rel: 'noreferrer' as const }
    : {}

interface WaitlistFormProps {
  variant?: 'modal' | 'inline'
  onClose?: () => void
  onSuccess?: () => void
}

export default function WaitlistForm({ variant = 'modal', onClose, onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLegalLinks = Boolean(PRIVACY_URL || TERMS_URL)

  // Simple validation - just check if email is valid format
  const isValidEmail = email.length > 0 && validateEmail(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Don't submit if email isn't valid
    if (!isValidEmail) return

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many attempts. Please try again later.')
        }
        throw new Error(data.error || 'Something went wrong')
      }

      // Track conversion
      if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: variant === 'modal' ? 'modal_form' : 'inline_form',
        })
      }

      setIsSuccess(true)

      if (onSuccess) {
        onSuccess()
      }

      // Close modal after success
      if (variant === 'modal' && onClose) {
        setTimeout(() => {
          onClose()
        }, 2500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear any server error when user starts typing again
    if (error) setError(null)
  }

  const formContent = (
    <>
      {!isSuccess ? (
        <>
          {variant === 'modal' && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Join the Waitlist
              </h2>
              <p className="text-gray-600">
                Be among the first to experience evening planning that works.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="waitlist-email"
                className="sr-only"
              >
                Email Address
              </label>
              <input
                type="email"
                id="waitlist-email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                aria-required="true"
                aria-describedby="email-description"
                className="w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200 bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500:border-primary-400"
                placeholder="Enter your email"
              />
              <p id="email-description" className="mt-1 text-xs text-gray-500">
                We&apos;ll never share your email or spam you.
              </p>
            </div>

            {/* Server Error Message (only shown for API errors) */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                >
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons Row */}
            <div className={`flex gap-3 ${variant === 'inline' ? 'flex-row' : 'flex-col'}`}>
              {/* Submit Button - disabled until valid email */}
              <button
                type="submit"
                disabled={!isValidEmail || isSubmitting}
                className={`
                  flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform
                  ${!isValidEmail || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:-translate-y-0.5 hover:shadow-lg text-white'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Join Waitlist'
                )}
              </button>

              {/* Secondary CTA - Learn More (inline variant only) */}
              {variant === 'inline' && (
                <button
                  type="button"
                  onClick={() => {
                    const element = document.getElementById('features')
                    if (element) {
                      const offset = 80
                      const elementRect = element.getBoundingClientRect()
                      const absoluteElementTop = elementRect.top + window.scrollY
                      const targetScrollPosition = Math.max(0, absoluteElementTop - offset)
                      window.scrollTo({
                        top: targetScrollPosition,
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                      })
                    }
                  }}
                  className="py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50:bg-gray-800 transition-all duration-200"
                >
                  Learn More
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500">
              By joining, you agree to our{' '}
              {hasLegalLinks ? (
                <>
                  {PRIVACY_URL && (
                    <Link
                      href={PRIVACY_URL}
                      className="underline hover:text-gray-700:text-gray-200"
                      {...legalLinkProps(PRIVACY_URL)}
                    >
                      Privacy Policy
                    </Link>
                  )}
                  {PRIVACY_URL && TERMS_URL && ' and '}
                  {TERMS_URL && (
                    <Link
                      href={TERMS_URL}
                      className="underline hover:text-gray-700:text-gray-200"
                      {...legalLinkProps(TERMS_URL)}
                    >
                      Terms of Service
                    </Link>
                  )}
                </>
              ) : (
                <span className="font-medium text-gray-600">
                  privacy commitments (publishing soon)
                </span>
              )}
              . Unsubscribe anytime.
            </p>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-gray-600 mb-4">
            We&apos;ll let you know when Domani is ready.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {email}
          </div>
        </motion.div>
      )}
    </>
  )

  if (variant === 'modal') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSuccess && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {formContent}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return <div className="w-full max-w-md">{formContent}</div>
}
