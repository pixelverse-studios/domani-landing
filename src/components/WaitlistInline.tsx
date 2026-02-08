'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import WaitlistForm from './WaitlistForm'

const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? '/privacy'
const TERMS_URL = process.env.NEXT_PUBLIC_TERMS_URL ?? '/terms'

const legalLinkProps = (url: string) =>
  url.startsWith('http')
    ? { target: '_blank', rel: 'noreferrer' as const }
    : {}

export default function WaitlistInline() {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const hasLegalLinks = Boolean(PRIVACY_URL || TERMS_URL)

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      // Try quick submission with just email
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          name: 'Early Adopter' // Default name for quick signup
        }),
      })

      await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          // Email already exists
          setError('You\'re already on the list!')
          setTimeout(() => setError(''), 3000)
          return
        }
        if (response.status === 429) {
          setError('Too many attempts. Please try again later.')
          return
        }
        // For other errors, show the modal for full form
        setShowModal(true)
        return
      }

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup', {
          event_category: 'engagement',
          event_label: 'inline_quick_form',
        })
      }

      setIsSuccess(true)
      setEmail('')
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md"
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-green-800 font-medium">You&apos;re on the list!</p>
            <p className="text-green-700 text-sm">Check your email for confirmation.</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <div className="max-w-md">
        <form onSubmit={handleQuickSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="inline-email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="inline-email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Enter your email"
                className={`
                  w-full px-5 py-3.5 text-base border rounded-xl
                  bg-white text-gray-900
                  ${error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-300 focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500'
                  }
                  placeholder:text-gray-400 outline-none transition-all duration-200
                  focus:scale-[1.02] focus:shadow-lg
                `}
                disabled={isSubmitting}
                autoComplete="email"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'inline-error' : undefined}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 transform
                whitespace-nowrap min-w-[140px]
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
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
                  <span className="hidden sm:inline">Joining...</span>
                </span>
              ) : (
                'Join Waitlist'
              )}
            </button>
          </div>
          
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                id="inline-error"
                className="absolute -bottom-6 left-0 text-sm text-red-600"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        {/* Privacy Note */}
        <p className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-gray-500">
          <span>No spam, ever. Unsubscribe anytime.</span>
          {hasLegalLinks ? (
            <span>
              Read our{' '}
              {PRIVACY_URL && (
                <Link
                  href={PRIVACY_URL}
                  className="underline hover:text-gray-700"
                  {...legalLinkProps(PRIVACY_URL)}
                >
                  Privacy Policy
                </Link>
              )}
              {PRIVACY_URL && TERMS_URL && ' and '}
              {TERMS_URL && (
                <Link
                  href={TERMS_URL}
                  className="underline hover:text-gray-700"
                  {...legalLinkProps(TERMS_URL)}
                >
                  Terms of Service
                </Link>
              )}
              .
            </span>
          ) : (
            <span>Privacy details coming soon.</span>
          )}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="underline hover:text-gray-700"
          >
            Want to tell us more?
          </button>
        </p>
      </div>

      {/* Full Form Modal */}
      {showModal && (
        <WaitlistForm 
          variant="modal"
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            setIsSuccess(true)
            setEmail('')
            setTimeout(() => setIsSuccess(false), 5000)
          }}
        />
      )}
    </>
  )
}
