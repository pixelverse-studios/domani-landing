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

  // Audience-specific keywords
  audienceSpecific: [
    'planner app for teachers',
    'planner app for nurses',
    'planner for busy parents',
    'planner app for students',
    'planner for shift workers',
    'planner app for ADHD',
    'planner for remote workers',
    'planner app for freelancers',
  ],

  // Expanded competitor keywords
  competitorExpanded: [
    'ticktick alternative',
    'notion daily planner alternative',
    'things 3 alternative',
    'any.do alternative',
    'fabulous app alternative',
    'routinery alternative',
    'best daily planner app 2026',
    'planner app no subscription',
    'one time purchase planner app',
    'free daily planner app',
  ],

  // Emotional/problem-aware expanded
  emotionalExpanded: [
    'morning anxiety before work',
    'sunday scaries',
    'cant sleep thinking about tomorrow',
    'too many things to do',
    'stressed about work tomorrow',
    'how to stop overthinking tasks',
    'always running late in the morning',
    'how to stop doom scrolling at night',
  ],

  // Seasonal keywords
  seasonal: [
    'new year productivity goals',
    'back to school planner app',
    'how to be more productive in 2026',
    'how to plan after vacation',
  ],

  // Expanded methodology keywords
  methodExpanded: [
    'eat the frog method',
    '1-3-5 rule productivity',
    'time blocking for beginners',
    'deep work planning',
    'getting things done app',
  ],

  // Expanded solution keywords
  solutionExpanded: [
    'evening routine for productivity',
    'nightly planning habit',
    'how to start your day with focus',
    'how to plan your day effectively',
    'wind down routine that helps productivity',
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
    ...SEO_KEYWORDS.primary,
    ...SEO_KEYWORDS.solutionAware.slice(0, 3),
    ...SEO_KEYWORDS.solutionExpanded.slice(0, 2),
    ...SEO_KEYWORDS.problemAware.slice(0, 3),
    ...SEO_KEYWORDS.audienceSpecific.slice(0, 3),
  ],
  pricing: [
    'domani pricing',
    'daily planner app free',
    'lifetime productivity app',
    'sunsama alternative cheaper',
    'affordable task management',
    'planner app no subscription',
    'one time purchase planner app',
    'free daily planner app',
  ],
  about: [
    'domani story',
    'evening planning psychology',
    'why evening planning works',
    'planner for busy parents',
    'planner app for teachers',
    'planner for shift workers',
  ],
  faq: [
    'how does evening planning work',
    'morning routine tips',
    'reduce decision fatigue',
    'ivy lee method tutorial',
    'how to plan your day effectively',
    'how to stop overthinking tasks',
  ],
} as const

/**
 * Meta description templates optimized for CTR
 */
export const META_TEMPLATES = {
  homepage: 'Plan tomorrow tonight and wake up ready to execute. Domani is the free evening planning app for iOS and Android that turns chaotic mornings into focused ones.',
  pricing: 'Start free with 3 intentional tasks per day, then upgrade for more flexibility when you need it. Domani is the evening planning app that helps you wake up clear.',
  about: 'Domani was built on one idea: planning at night beats planning in the morning. Discover the science behind evening planning and how it works on iOS and Android.',
  faq: 'Answers to common questions about evening planning, morning routines, decision fatigue, and how Domani helps you start each day with focus and clarity.',
} as const

/**
 * Title templates optimized for search
 */
export const TITLE_TEMPLATES = {
  homepage: 'Domani - Plan Tomorrow Tonight, Wake Up Ready to Execute',
  pricing: 'Domani Pricing - Start Free, Upgrade When You Need More',
  about: 'About Domani - Why Evening Planning Works Better For You',
  faq: 'Evening Planning FAQ - Common Questions About Domani',
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
