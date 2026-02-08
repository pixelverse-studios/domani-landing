'use client'

import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import DownloadButtons from './DownloadButtons'
import WaitlistForm from './WaitlistForm'
import {
  getCurrentPhase,
  shouldShowWaitlist,
  getCurrentSubtext,
  getCurrentHeadline,
  type BetaPhase,
} from '@/lib/config/cta'

interface DynamicCTAProps {
  /** Additional CSS classes */
  className?: string
  /** Size variant for download buttons */
  size?: 'default' | 'large'
  /** Whether to show subtext below the CTA */
  showSubtext?: boolean
  /** Alignment for download buttons */
  align?: 'start' | 'center'
  /** Variant for waitlist form (only applies in pre-beta phase) */
  waitlistVariant?: 'modal' | 'inline'
  /** Callback when waitlist modal is closed */
  onWaitlistClose?: () => void
  /** Callback when waitlist signup succeeds */
  onWaitlistSuccess?: () => void
  /** Location identifier for analytics (e.g., 'hero', 'about', 'footer') */
  analyticsLocation?: string
  /**
   * ID of element to scroll to instead of showing inline form.
   * When provided during pre-beta phase, shows a button that smooth scrolls
   * to the target element instead of rendering the form inline.
   */
  scrollToId?: string
  /** Custom button text for scroll-to button */
  scrollButtonText?: string
}

/**
 * DynamicCTA - Renders the appropriate CTA based on current beta phase
 *
 * - pre-beta: Shows WaitlistForm
 * - beta: Shows DownloadButtons
 * - post-beta: Shows DownloadButtons
 *
 * The phase is determined by dates in the CTA config or can be overridden
 * via NEXT_PUBLIC_CTA_PHASE_OVERRIDE environment variable.
 */
export default function DynamicCTA({
  className = '',
  size = 'default',
  showSubtext = true,
  align,
  waitlistVariant = 'inline',
  onWaitlistClose,
  onWaitlistSuccess,
  analyticsLocation = 'unknown',
  scrollToId,
  scrollButtonText,
}: DynamicCTAProps) {
  const phase = getCurrentPhase()
  const showWaitlist = shouldShowWaitlist()
  const headline = getCurrentHeadline()

  // Smooth scroll to target element
  const handleScrollToTarget = useCallback(() => {
    if (!scrollToId) return

    const element = document.getElementById(scrollToId)
    if (!element) {
      console.warn(`Scroll target "${scrollToId}" not found`)
      return
    }

    // Track scroll action
    if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'cta_scroll', {
        event_category: 'engagement',
        event_label: analyticsLocation,
        scroll_target: scrollToId,
      })
    }

    // Calculate position with offset for fixed header
    const offset = 100
    const elementRect = element.getBoundingClientRect()
    const absoluteElementTop = elementRect.top + window.scrollY
    const targetScrollPosition = Math.max(0, absoluteElementTop - offset)

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: targetScrollPosition,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })

    // Focus the target element after scroll completes
    if (!prefersReducedMotion) {
      setTimeout(() => {
        // Try to focus the first input in the target, or the target itself
        const input = element.querySelector('input')
        if (input) {
          input.focus()
        }
      }, 800)
    }
  }, [scrollToId, analyticsLocation])

  // Track CTA view with phase info
  useEffect(() => {
    trackCTAView(phase, analyticsLocation)
  }, [phase, analyticsLocation])

  // Show scroll button if scrollToId is provided during pre-beta phase
  if (showWaitlist && scrollToId) {
    const buttonText = scrollButtonText || headline || 'Join the Waitlist'
    const buttonPadding = size === 'large' ? 'px-8 py-4 text-lg' : 'px-6 py-3'

    return (
      <div className={className}>
        <motion.button
          onClick={handleScrollToTarget}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            ${buttonPadding} rounded-xl font-semibold
            bg-gradient-to-r from-primary-600 to-primary-700
            hover:from-primary-700 hover:to-primary-800
            text-white shadow-lg hover:shadow-xl
            transition-all duration-200 transform hover:-translate-y-0.5
          `}
        >
          {buttonText}
        </motion.button>
        {showSubtext && (
          <p className="mt-3 text-sm text-gray-500">
            {getCurrentSubtext()}
          </p>
        )}
      </div>
    )
  }

  if (showWaitlist) {
    return (
      <div className={className}>
        <WaitlistForm
          variant={waitlistVariant}
          onClose={onWaitlistClose}
          onSuccess={() => {
            trackCTAConversion(phase, analyticsLocation, 'waitlist')
            onWaitlistSuccess?.()
          }}
        />
      </div>
    )
  }

  return (
    <DownloadButtons
      className={className}
      size={size}
      showSubtext={showSubtext}
      align={align}
    />
  )
}

/**
 * Track CTA view event with phase information
 */
function trackCTAView(phase: BetaPhase, location: string) {
  if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'cta_view', {
      event_category: 'engagement',
      event_label: location,
      beta_phase: phase,
    })
  }
}

/**
 * Track CTA conversion event with phase information
 */
function trackCTAConversion(phase: BetaPhase, location: string, ctaType: 'waitlist' | 'download') {
  if (typeof window !== 'undefined' && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'cta_conversion', {
      event_category: 'conversion',
      event_label: location,
      beta_phase: phase,
      cta_type: ctaType,
    })
  }
}

/**
 * Utility hook to get current phase (for components that need phase info)
 */
export function useBetaPhase(): BetaPhase {
  return getCurrentPhase()
}

/**
 * Utility to get phase-appropriate subtext
 */
export function usePhaseSubtext(): string {
  return getCurrentSubtext()
}
