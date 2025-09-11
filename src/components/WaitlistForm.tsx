'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { validateEmail, validateName } from '@/utils/validation'

interface WaitlistFormProps {
  variant?: 'modal' | 'inline'
  onClose?: () => void
  onSuccess?: () => void
}

export default function WaitlistForm({ variant = 'modal', onClose, onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; name?: string; general?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; name?: boolean }>({})
  const [fieldStatus, setFieldStatus] = useState<{ email?: 'valid' | 'invalid'; name?: 'valid' | 'invalid' }>({})

  // Validate email on blur
  const validateEmailField = useCallback((value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      setFieldStatus(prev => ({ ...prev, email: 'invalid' }))
      return false
    }
    if (!validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      setFieldStatus(prev => ({ ...prev, email: 'invalid' }))
      return false
    }
    setErrors(prev => ({ ...prev, email: undefined }))
    setFieldStatus(prev => ({ ...prev, email: 'valid' }))
    return true
  }, [])

  // Validate name on blur
  const validateNameField = useCallback((value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }))
      setFieldStatus(prev => ({ ...prev, name: 'invalid' }))
      return false
    }
    if (!validateName(value)) {
      setErrors(prev => ({ ...prev, name: 'Please enter a valid name (letters only)' }))
      setFieldStatus(prev => ({ ...prev, name: 'invalid' }))
      return false
    }
    setErrors(prev => ({ ...prev, name: undefined }))
    setFieldStatus(prev => ({ ...prev, name: 'valid' }))
    return true
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear general errors
    setErrors(prev => ({ ...prev, general: undefined }))
    
    // Validate all fields
    const isEmailValid = validateEmailField(email)
    const isNameValid = validateNameField(name)
    
    if (!isEmailValid || !isNameValid) {
      setTouched({ email: true, name: true })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many attempts. Please try again later.')
        }
        throw new Error(data.error || 'Something went wrong')
      }

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'waitlist_signup', {
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
      setErrors({ 
        general: err instanceof Error ? err.message : 'Something went wrong. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }))
    validateEmailField(email)
  }

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }))
    validateNameField(name)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (touched.email) {
      validateEmailField(e.target.value)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (touched.name) {
      validateNameField(e.target.value)
    }
  }

  const formContent = (
    <>
      {!isSuccess ? (
        <>
          {variant === 'modal' && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Join the Waitlist
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Be among the first to experience evening planning that works.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name Field */}
            <div className="relative">
              <label 
                htmlFor="waitlist-name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="waitlist-name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  required
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={touched.name && errors.name ? 'true' : 'false'}
                  aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                  className={`
                    w-full px-4 py-3 pr-10 border rounded-lg outline-none transition-all duration-200 bg-white dark:bg-dark-card text-gray-900 dark:text-white
                    ${touched.name && errors.name 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : fieldStatus.name === 'valid'
                      ? 'border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                    }
                  `}
                  placeholder="John Doe"
                />
                {/* Success checkmark */}
                {fieldStatus.name === 'valid' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
              {touched.name && errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="name-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <label 
                htmlFor="waitlist-email" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  required
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                  aria-describedby={
                    touched.email && errors.email 
                      ? 'email-error' 
                      : 'email-description'
                  }
                  className={`
                    w-full px-4 py-3 pr-10 border rounded-lg outline-none transition-all duration-200 bg-white dark:bg-dark-card text-gray-900 dark:text-white
                    ${touched.email && errors.email 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : fieldStatus.email === 'valid'
                      ? 'border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                    }
                  `}
                  placeholder="john@example.com"
                />
                {/* Success checkmark */}
                {fieldStatus.email === 'valid' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
              {!touched.email || !errors.email ? (
                <p id="email-description" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  We'll never share your email or spam you.
                </p>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="email-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                role="alert"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform
                ${isSubmitting 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-evening-600 hover:from-primary-700 hover:to-evening-700 hover:-translate-y-0.5 hover:shadow-lg text-white'
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
                'Get Early Access'
              )}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By joining, you agree to our{' '}
              <a href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-200">
                Privacy Policy
              </a>
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're on the list!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Check your email for a confirmation message.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Confirmation sent to {email}
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
            className="bg-white dark:bg-dark-elevated rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSuccess && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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