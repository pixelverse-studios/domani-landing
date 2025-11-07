import type { ComponentType } from 'react'

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  readingTime: string
  keywords: string[]
  accent: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'evening-planning-routine',
    title: 'Evening Planning Routine: The Science of Waking Up Ready',
    description: 'A relaxed 15-minute nightly check-in that locks in tomorrow’s wins and lets you wake up ready.',
    publishedAt: '2025-01-11',
    readingTime: '7 min read',
    keywords: ['evening planning routine', 'plan tomorrow tonight', 'calm mornings'],
    accent: 'from-primary-500/10 via-evening-500/10 to-white',
  },
  {
    slug: 'decision-fatigue-app',
    title: 'Decision Fatigue App Playbook: Remove Morning Overwhelm',
    description: 'Tame morning thrash with simple nightly habits—capture, pick three tasks, lock the plan.',
    publishedAt: '2025-01-12',
    readingTime: '6 min read',
    keywords: ['decision fatigue app', 'most important task', 'productivity psychology'],
    accent: 'from-amber-500/10 via-primary-500/10 to-white',
  },
  {
    slug: 'sunsama-alternative',
    title: 'Sunsama Alternative: Domani for Evening-First Planning',
    description: 'See how an evening-first flow compares to Sunsama when you want calm, press-play mornings.',
    publishedAt: '2025-01-13',
    readingTime: '8 min read',
    keywords: ['sunsama alternative', 'evening planning app', 'daily planner app'],
    accent: 'from-purple-500/10 via-primary-500/10 to-white',
  },
]

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

type MDXModule = () => Promise<{ default: ComponentType }>

export const mdxModules: Record<string, MDXModule> = {
  'evening-planning-routine': () => import('../../../content/blog/evening-planning-routine.mdx'),
  'decision-fatigue-app': () => import('../../../content/blog/decision-fatigue-app.mdx'),
  'sunsama-alternative': () => import('../../../content/blog/sunsama-alternative.mdx'),
}
