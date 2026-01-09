/**
 * CTA (Call-to-Action) Configuration
 *
 * Centralized configuration for managing CTA behavior based on beta phase.
 * Controls whether to show waitlist signup or download buttons.
 *
 * Phase Logic:
 * - pre-beta: Before startDate → Show waitlist form
 * - beta: Between startDate and endDate → Show download buttons
 * - post-beta: After endDate → Show download buttons (general availability)
 *
 * Environment Override:
 * Set NEXT_PUBLIC_CTA_PHASE_OVERRIDE to 'pre-beta', 'beta', or 'post-beta'
 * to force a specific phase (useful for testing).
 */

// =============================================================================
// Types
// =============================================================================

export type BetaPhase = 'pre-beta' | 'beta' | 'post-beta'

export type CTAType = 'waitlist' | 'download'

export interface PhaseConfig {
  /** Primary CTA type for this phase */
  ctaType: CTAType
  /** Headline text for the CTA section */
  headline: string
  /** Subtext displayed below the CTA */
  subtext: string
  /** Badge text (e.g., "Coming Soon", "Public Beta Now Live") */
  badge: string
}

export interface BetaDates {
  /** ISO date string for beta start (YYYY-MM-DD) */
  startDate: string
  /** ISO date string for beta end (YYYY-MM-DD), null for indefinite */
  endDate: string | null
}

export interface CTAConfig {
  /** Beta phase date boundaries */
  betaDates: BetaDates
  /** Configuration for pre-beta phase */
  preBeta: PhaseConfig
  /** Configuration for beta phase */
  beta: PhaseConfig
  /** Configuration for post-beta phase */
  postBeta: PhaseConfig
}

// =============================================================================
// Configuration
// =============================================================================

export const CTA_CONFIG: CTAConfig = {
  betaDates: {
    startDate: '2026-01-08', // Public beta launch date (temporary for testing)
    endDate: '2026-03-01', // Beta end date
  },

  preBeta: {
    ctaType: 'waitlist',
    headline: 'Join the Waitlist',
    subtext: 'Be the first to know when we launch.',
    badge: 'Coming Soon',
  },

  beta: {
    ctaType: 'download',
    headline: 'Download Now',
    subtext: '14-day free trial. Full premium access.',
    badge: 'Public Beta Now Live',
  },

  postBeta: {
    ctaType: 'download',
    headline: 'Get Started',
    subtext: '14-day free trial. Full premium access.',
    badge: 'Now Available',
  },
} as const

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Parse a date string to a Date object at midnight UTC
 */
function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

/**
 * Get today's date at midnight UTC for consistent comparisons
 */
function getTodayUTC(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

/**
 * Get the current beta phase based on date or environment override
 */
export function getCurrentPhase(): BetaPhase {
  // Check for environment override first
  const override = process.env.NEXT_PUBLIC_CTA_PHASE_OVERRIDE as BetaPhase | undefined
  if (override && ['pre-beta', 'beta', 'post-beta'].includes(override)) {
    return override
  }

  const today = getTodayUTC()
  const startDate = parseDate(CTA_CONFIG.betaDates.startDate)

  // Before beta start
  if (today < startDate) {
    return 'pre-beta'
  }

  // Check end date if set
  if (CTA_CONFIG.betaDates.endDate) {
    const endDate = parseDate(CTA_CONFIG.betaDates.endDate)
    if (today > endDate) {
      return 'post-beta'
    }
  }

  // During beta (or indefinitely if no end date)
  return 'beta'
}

/**
 * Get the configuration for the current phase
 */
export function getCurrentPhaseConfig(): PhaseConfig {
  const phase = getCurrentPhase()
  switch (phase) {
    case 'pre-beta':
      return CTA_CONFIG.preBeta
    case 'beta':
      return CTA_CONFIG.beta
    case 'post-beta':
      return CTA_CONFIG.postBeta
  }
}

/**
 * Get the CTA type for the current phase
 */
export function getCurrentCTAType(): CTAType {
  return getCurrentPhaseConfig().ctaType
}

/**
 * Check if the current phase should show waitlist
 */
export function shouldShowWaitlist(): boolean {
  return getCurrentCTAType() === 'waitlist'
}

/**
 * Check if the current phase should show download buttons
 */
export function shouldShowDownload(): boolean {
  return getCurrentCTAType() === 'download'
}

/**
 * Get the badge text for the current phase
 */
export function getCurrentBadgeText(): string {
  return getCurrentPhaseConfig().badge
}

/**
 * Get the headline for the current phase
 */
export function getCurrentHeadline(): string {
  return getCurrentPhaseConfig().headline
}

/**
 * Get the subtext for the current phase
 */
export function getCurrentSubtext(): string {
  return getCurrentPhaseConfig().subtext
}

/**
 * Get beta phase dates for display or debugging
 */
export function getBetaDates(): BetaDates {
  return CTA_CONFIG.betaDates
}

/**
 * Check if we're currently in beta (not pre or post)
 */
export function isInBeta(): boolean {
  return getCurrentPhase() === 'beta'
}

/**
 * Check if beta has ended
 */
export function hasBetaEnded(): boolean {
  return getCurrentPhase() === 'post-beta'
}
