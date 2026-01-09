/**
 * Centralized Pricing Configuration
 *
 * Single source of truth for all pricing data across the website.
 * Update prices here and they will be reflected everywhere.
 */

// =============================================================================
// Types
// =============================================================================

export type PriceTier = 'friends_family' | 'early_adopter' | 'general'

export interface LifetimePricing {
  /** General retail price - always shown (crossed out during sales) */
  generalPrice: number
  /** Early adopter price - launch pricing */
  earlyAdopterPrice: number
  /** Friends & family price - lowest tier */
  friendsFamilyPrice: number
  /** Which price tier is currently active */
  activeTier: PriceTier
  /** Currency code */
  currency: string
}

export interface TrialConfig {
  /** Duration of free trial in days */
  durationDays: number
  /** Features included in trial */
  features: string[]
}

export interface PricingConfig {
  lifetime: LifetimePricing
  trial: TrialConfig
}

// =============================================================================
// Configuration
// =============================================================================

export const PRICING_CONFIG: PricingConfig = {
  lifetime: {
    generalPrice: 34.99,
    earlyAdopterPrice: 9.99,
    friendsFamilyPrice: 4.99,
    activeTier: 'early_adopter',
    currency: 'USD',
  },

  trial: {
    durationDays: 14,
    features: [
      'Unlimited tasks per day',
      'Custom categories',
      'Unlimited history',
      'Advanced analytics',
    ],
  },
} as const

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format a price for display with currency symbol
 */
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

/**
 * Get the current active price based on the active tier
 */
export function getCurrentPrice(): number {
  const { lifetime } = PRICING_CONFIG
  switch (lifetime.activeTier) {
    case 'general':
      return lifetime.generalPrice
    case 'early_adopter':
      return lifetime.earlyAdopterPrice
    case 'friends_family':
      return lifetime.friendsFamilyPrice
  }
}

/**
 * Get the current price formatted for display
 */
export function getCurrentPriceDisplay(): string {
  return formatPrice(getCurrentPrice(), PRICING_CONFIG.lifetime.currency)
}

/**
 * Get the general (full) price formatted for display (for strikethrough)
 */
export function getGeneralPriceDisplay(): string {
  return formatPrice(PRICING_CONFIG.lifetime.generalPrice, PRICING_CONFIG.lifetime.currency)
}

/**
 * Check if there's currently a discount active
 */
export function hasActiveDiscount(): boolean {
  return PRICING_CONFIG.lifetime.activeTier !== 'general'
}

/**
 * Get the current discount percentage
 */
export function getDiscountPercentage(): number {
  if (!hasActiveDiscount()) return 0
  const { generalPrice } = PRICING_CONFIG.lifetime
  const currentPrice = getCurrentPrice()
  return Math.round(((generalPrice - currentPrice) / generalPrice) * 100)
}

/**
 * Get a label for the current pricing tier
 */
export function getCurrentPricingLabel(): string {
  switch (PRICING_CONFIG.lifetime.activeTier) {
    case 'general':
      return 'Lifetime Access'
    case 'early_adopter':
      return 'Early Adopter Price'
    case 'friends_family':
      return 'Friends & Family Price'
  }
}

/**
 * Get the trial duration in days
 */
export function getTrialDuration(): number {
  return PRICING_CONFIG.trial.durationDays
}

/**
 * Get trial duration as a formatted string
 */
export function getTrialDurationDisplay(): string {
  const days = getTrialDuration()
  return `${days}-day`
}
