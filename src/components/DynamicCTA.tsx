'use client'

import { useEffect } from 'react'
import DownloadButtons from './DownloadButtons'
import WaitlistForm from './WaitlistForm'
import {
  getCurrentPhase,
  shouldShowWaitlist,
  getCurrentSubtext,
  type BetaPhase,
} from '@/lib/config/cta'

interface DynamicCTAProps {
  /** Additional CSS classes */
  className?: string
  /** Size variant for download buttons */
  size?: 'default' | 'large'
  /** Whether to show subtext below the CTA */
  showSubtext?: boolean
  /** Variant for waitlist form (only applies in pre-beta phase) */
  waitlistVariant?: 'modal' | 'inline'
  /** Callback when waitlist modal is closed */
  onWaitlistClose?: () => void
  /** Callback when waitlist signup succeeds */
  onWaitlistSuccess?: () => void
  /** Location identifier for analytics (e.g., 'hero', 'about', 'footer') */
  analyticsLocation?: string
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
  waitlistVariant = 'inline',
  onWaitlistClose,
  onWaitlistSuccess,
  analyticsLocation = 'unknown',
}: DynamicCTAProps) {
  const phase = getCurrentPhase()
  const showWaitlist = shouldShowWaitlist()

  // Track CTA view with phase info
  useEffect(() => {
    trackCTAView(phase, analyticsLocation)
  }, [phase, analyticsLocation])

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
