/**
 * SEO Keywords Configuration for Domani
 * Based on comprehensive keyword research from October 2025
 *
 * Strategy: Own the "evening planning" category with problem-aware content
 */

export const SEO_KEYWORDS = {
  // Primary brand keywords
  brand: [
    'domani',
    'domani app',
    'plan tomorrow tonight',
  ],

  // Primary keywords (high value, foundation terms)
  primary: [
    'daily planner app',
    'time blocking app',
    'morning routine app',
    'evening planning app',
    'productivity app',
    'task management app',
  ],

  // Secondary keywords (sweet spot - medium competition, high intent)
  secondary: [
    'decision fatigue app',
    'ivy lee method app',
    'most important task app',
    'daily planning routine',
    'evening routine app',
    'morning productivity app',
    'focus app',
    'habit tracking app',
  ],

  // Long-tail keywords (quick wins, high conversion)
  longTail: [
    'how to plan your day the night before',
    'reduce morning decision fatigue',
    'best evening planning app',
    'evening planning routine',
    'plan tomorrow today',
    'morning anxiety productivity',
    'calm morning routine',
    'reduce morning overwhelm',
  ],

  // Problem-aware keywords (high intent)
  problemAware: [
    'morning decision fatigue',
    'overwhelmed every morning',
    'cant focus in morning',
    'morning brain fog',
    'reactive morning routine',
    'chaotic morning',
  ],

  // Solution-aware keywords
  solutionAware: [
    'evening planning benefits',
    'plan night before',
    'nighttime planning',
    'evening task planning',
    'prepare for tomorrow',
  ],

  // Methodology keywords (authority building)
  methodology: [
    'ivy lee method',
    'MIT method',
    'most important task',
    'time blocking method',
    'evening planning method',
  ],

  // Competitor comparison keywords
  comparison: [
    'sunsama alternative',
    'cheap sunsama alternative',
    'structured app alternative',
    'todoist alternative',
    'better than todoist',
  ],

  // ASO keywords (App Store Optimization)
  aso: {
    primary: [
      'daily planner',
      'evening planning',
      'task manager',
      'productivity',
      'morning routine',
    ],
    secondary: [
      'time blocking',
      'focus',
      'MIT',
      'habit',
      'clarity',
    ],
  },
} as const

/**
 * Page-specific keyword targeting
 */
export const PAGE_KEYWORDS = {
  homepage: [
    ...SEO_KEYWORDS.brand,
    ...SEO_KEYWORDS.primary.slice(0, 3),
    ...SEO_KEYWORDS.solutionAware.slice(0, 2),
  ],
  pricing: [
    'domani pricing',
    'daily planner app free',
    'cheap productivity app',
    'sunsama alternative cheaper',
    'affordable task management',
  ],
  about: [
    'domani story',
    'evening planning psychology',
    'productivity app founders',
    'why evening planning works',
  ],
  faq: [
    'how does evening planning work',
    'morning routine tips',
    'reduce decision fatigue',
    'ivy lee method tutorial',
  ],
} as const

/**
 * Meta description templates optimized for CTR
 */
export const META_TEMPLATES = {
  homepage: 'Transform chaotic mornings into focused execution. Plan tomorrow tonight when you\'re calm, wake up ready to execute. Free daily planner app.',
  pricing: 'Start free, upgrade when ready. Plans from $0 to $3.99/month. 80% cheaper than Sunsama. No credit card required.',
  about: 'Discover why planning the night before reduces morning anxiety by 73%. The science behind evening planning psychology.',
  faq: 'Get answers about evening planning, morning routines, and productivity methods. Learn how to reduce decision fatigue and start focused.',
} as const

/**
 * Title templates optimized for search
 */
export const TITLE_TEMPLATES = {
  homepage: 'Domani - Plan Tomorrow Tonight, Wake Up Ready to Execute',
  pricing: 'Pricing - Start Free | Domani Evening Planner',
  about: 'About Domani - The Science of Evening Planning',
  faq: 'Frequently Asked Questions - Evening Planning Guide | Domani',
  default: (pageTitle: string) => `${pageTitle} | Domani`,
} as const

/**
 * Get optimized keywords for a specific page
 */
export function getPageKeywords(page: keyof typeof PAGE_KEYWORDS): string[] {
  const keywords = PAGE_KEYWORDS[page]
  return keywords ? [...keywords] : []
}

/**
 * Get all keywords as a comma-separated string
 */
export function getAllKeywordsString(): string {
  const allKeywords = [
    ...SEO_KEYWORDS.brand,
    ...SEO_KEYWORDS.primary,
    ...SEO_KEYWORDS.secondary,
    ...SEO_KEYWORDS.longTail,
  ]
  return [...new Set(allKeywords)].join(', ')
}

/**
 * Get ASO keyword string (100 character limit for App Store)
 */
export function getASOKeywordString(): string {
  const keywords = [
    ...SEO_KEYWORDS.aso.primary,
    ...SEO_KEYWORDS.aso.secondary,
  ]
  return keywords.join(',').substring(0, 100)
}
