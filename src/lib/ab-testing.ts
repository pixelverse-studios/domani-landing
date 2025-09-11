export interface ABTestVariant {
  headline: string
  subheadline: string
  ctaText: string
  secondaryCtaText: string
  variant: 'A' | 'B' | 'C'
}

export const testVariants: Record<string, ABTestVariant> = {
  A: {
    headline: "Plan Tomorrow Tonight, Wake Up Ready",
    subheadline: "Transform your productivity with evening planning psychology. Add tomorrow's tasks when you're calm, execute when you're focused.",
    ctaText: "Join Waitlist",
    secondaryCtaText: "See How It Works",
    variant: 'A'
  },
  B: {
    headline: "Evening Planning, Morning Focus",
    subheadline: "The productivity app that works with your natural rhythms. Plan when calm, execute when energized.",
    ctaText: "Get Early Access",
    secondaryCtaText: "Watch Demo",
    variant: 'B'
  },
  C: {
    headline: "Calm Planning Beats Rushed Mornings",
    subheadline: "Join thousands who plan their perfect day the night before. Wake up with clarity, not chaos.",
    ctaText: "Start Planning Better",
    secondaryCtaText: "Learn More",
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
  if ((window as any).gtag) {
    (window as any).gtag('event', 'ab_test_assignment', {
      event_category: 'experiment',
      event_label: 'hero_section',
      variant: randomVariant
    })
  }

  return testVariants[randomVariant as keyof typeof testVariants]
}