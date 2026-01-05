export interface ABTestVariant {
  headline: string
  subheadline: string
  ctaText: string
  secondaryCtaText: string
  variant: 'A' | 'B' | 'C'
}

// All variants now use the same copy for public beta launch
// A/B testing can be re-enabled later with different experiments
export const testVariants: Record<string, ABTestVariant> = {
  A: {
    headline: "Plan Tomorrow, Tonight",
    subheadline: "Make better decisions when you're calm, not rushed. Execute with clarity.",
    ctaText: "Download Free",
    secondaryCtaText: "See How It Works",
    variant: 'A'
  },
  B: {
    headline: "Plan Tomorrow, Tonight",
    subheadline: "Make better decisions when you're calm, not rushed. Execute with clarity.",
    ctaText: "Download Free",
    secondaryCtaText: "See How It Works",
    variant: 'B'
  },
  C: {
    headline: "Plan Tomorrow, Tonight",
    subheadline: "Make better decisions when you're calm, not rushed. Execute with clarity.",
    ctaText: "Download Free",
    secondaryCtaText: "See How It Works",
    variant: 'C'
  }
}

export function getABTestVariant(): ABTestVariant {
  // Check if we're on the server
  if (typeof window === 'undefined') {
    return testVariants.A
  }

  // Check for existing variant in cookie
  const cookies = document.cookie.split(';')
  const variantCookie = cookies.find(cookie => cookie.trim().startsWith('ab_variant='))

  if (variantCookie) {
    const variant = variantCookie.split('=')[1]
    if (variant in testVariants) {
      return testVariants[variant as keyof typeof testVariants]
    }
  }

  // Assign new variant
  const variants = Object.keys(testVariants)
  const randomVariant = variants[Math.floor(Math.random() * variants.length)]

  // Set cookie for 30 days
  const date = new Date()
  date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000))
  document.cookie = `ab_variant=${randomVariant}; expires=${date.toUTCString()}; path=/`

  // Track variant assignment
  if ((window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag('event', 'ab_test_assignment', {
      event_category: 'experiment',
      event_label: 'hero_section',
      variant: randomVariant
    })
  }

  return testVariants[randomVariant as keyof typeof testVariants]
}
