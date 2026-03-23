import type { ComponentType } from 'react'

export interface BlogFAQ {
  question: string
  answer: string
}

export interface BlogAuthor {
  name: string
  bio: string
  avatar: string
}

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
  domani: {
    name: 'Domani Team',
    bio: 'The team behind the evening planning app that transforms your mornings.',
    avatar: '/images/domani-avatar.png',
  },
}

export type BlogCategory = 'Evening Planning' | 'Productivity Science' | 'App Comparisons' | 'For Your Schedule'

export const BLOG_CATEGORIES: BlogCategory[] = ['Evening Planning', 'Productivity Science', 'App Comparisons', 'For Your Schedule']

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  modifiedAt?: string
  author: BlogAuthor
  readingTime: string
  keywords: string[]
  accent: string
  categories: BlogCategory[]
  faqs?: BlogFAQ[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'evening-planning-routine',
    title: 'Evening Planning Routine: The Science of Waking Up Ready',
    description: 'A relaxed 15-minute nightly routine backed by decision fatigue research. Plan tomorrow tonight and wake up with clarity instead of chaos.',
    publishedAt: '2025-01-11',
    modifiedAt: '2026-03-21',
    author: BLOG_AUTHORS.domani,
    readingTime: '8 min read',
    keywords: ['evening planning routine', 'plan tomorrow tonight', 'calm mornings', 'night before planning', 'evening routine for productivity', 'reduce morning decision fatigue'],
    accent: 'from-primary-500/10 via-primary-400/10 to-white',
    categories: ['Evening Planning'],
    faqs: [
      {
        question: 'How long does an evening planning routine take?',
        answer: 'Most people spend 10 to 15 minutes on their evening planning routine. The key is consistency, not duration. A short nightly check-in where you review the day, pick your top priorities for tomorrow, and lock your plan is more effective than an elaborate hour-long session.',
      },
      {
        question: 'What is the best time to do evening planning?',
        answer: 'The ideal time is 30 to 60 minutes before you want to wind down for sleep. This gives your brain time to offload open loops without the planning session itself keeping you awake. Many people pair it with an existing habit like making tea or journaling.',
      },
      {
        question: 'Does planning at night actually help you sleep better?',
        answer: 'Research published in the Journal of Experimental Psychology found that writing a specific to-do list for the next day helped participants fall asleep significantly faster than journaling about completed tasks. Offloading tomorrow\'s plan reduces the cognitive load that keeps your mind racing at bedtime.',
      },
    ],
  },
  {
    slug: 'decision-fatigue-app',
    title: 'Decision Fatigue App Playbook: Remove Morning Overwhelm',
    description: 'Decision fatigue drains your willpower before lunch. Learn the psychology behind it and how shifting decisions to the evening can transform your mornings.',
    publishedAt: '2025-01-12',
    modifiedAt: '2026-03-21',
    author: BLOG_AUTHORS.domani,
    readingTime: '8 min read',
    keywords: ['decision fatigue app', 'most important task', 'productivity psychology', 'morning decision fatigue', 'reduce morning overwhelm', 'willpower depletion'],
    accent: 'from-amber-500/10 via-primary-500/10 to-white',
    categories: ['Productivity Science', 'Evening Planning'],
    faqs: [
      {
        question: 'What is decision fatigue and how does it affect productivity?',
        answer: 'Decision fatigue is the deteriorating quality of decisions after a long session of decision-making. Research by social psychologist Roy Baumeister showed that willpower draws from a finite daily reserve. Each decision you make in the morning — what to wear, what to eat, what to work on first — depletes that reserve, leaving less mental energy for the work that actually matters.',
      },
      {
        question: 'How many decisions does the average person make per day?',
        answer: 'Various studies estimate that adults make around 35,000 decisions per day, though many are unconscious. The problem is that your most important work decisions compete with trivial ones for the same cognitive resources. By pre-deciding your top priorities the night before, you remove dozens of morning decisions and preserve willpower for execution.',
      },
      {
        question: 'Can an app really help with decision fatigue?',
        answer: 'An app cannot eliminate decision fatigue, but it can reduce the number of decisions you face each morning. Apps like Domani use structured evening planning — a 3 to 6 task limit, custom categories, and task rollover — to move planning decisions to the evening when you are calm, so mornings become about execution rather than deliberation.',
      },
    ],
  },
  {
    slug: 'sunsama-alternative',
    title: 'Sunsama Alternative: Domani for Evening-First Planning',
    description: 'Comparing Sunsama and Domani side by side — pricing, planning philosophy, and features. See why evening-first planning delivers calmer mornings.',
    publishedAt: '2025-01-13',
    modifiedAt: '2026-03-21',
    author: BLOG_AUTHORS.domani,
    readingTime: '9 min read',
    keywords: ['sunsama alternative', 'evening planning app', 'daily planner app', 'sunsama vs domani', 'sunsama pricing', 'best daily planner 2026'],
    accent: 'from-primary-600/10 via-primary-500/10 to-white',
    categories: ['App Comparisons'],
    faqs: [
      {
        question: 'How much does Sunsama cost compared to Domani?',
        answer: 'Sunsama costs $20 per month ($240 per year) with no free tier — only a 14-day trial. Domani offers a 14-day free trial followed by a one-time lifetime payment of $34.99 (currently $9.99 during the early adopter period). Over one year, Sunsama costs roughly 7 times more than Domani\'s lifetime price.',
      },
      {
        question: 'What is the main difference between Sunsama and Domani?',
        answer: 'The core difference is when you plan. Sunsama is built around morning planning — you start each day by pulling tasks and time-blocking your calendar. Domani is built around evening planning — you plan tomorrow tonight when you are calm, lock your plan, and wake up ready to execute. This means Domani preserves your morning mental energy for doing the work rather than deciding what to do.',
      },
      {
        question: 'Can I switch from Sunsama to Domani easily?',
        answer: 'Yes. Since Domani focuses on just three to six daily tasks, you can recreate your key commitments in a few minutes. The bigger shift is the habit change: instead of planning at 8am, you plan at 9pm. Most people find the transition takes about a week. Start by doing both in parallel — your Sunsama morning routine plus a quick Domani evening plan — then drop the morning session once the evening habit sticks.',
      },
    ],
  },
  {
    slug: 'overwhelmed-every-morning',
    title: 'How to Stop Feeling Overwhelmed Every Morning',
    description: 'Morning overwhelm is not a character flaw — it is a planning problem. Learn why mornings feel so stressful and how a simple evening routine can fix it.',
    publishedAt: '2026-03-21',
    author: BLOG_AUTHORS.domani,
    readingTime: '10 min read',
    keywords: ['overwhelmed every morning', 'morning anxiety', 'stressed in the morning', 'too many things to do in the morning', 'reduce morning stress', 'morning overwhelm'],
    accent: 'from-amber-400/10 via-primary-500/10 to-white',
    categories: ['Evening Planning', 'Productivity Science'],
    faqs: [
      {
        question: 'Why do I feel so overwhelmed every morning?',
        answer: 'Morning overwhelm typically stems from three factors: elevated cortisol upon waking, decision fatigue from an unstructured day, and attentional competition where every undone task fights for your attention simultaneously. Without a pre-made plan, your brain interprets the ambiguity as a threat, triggering stress instead of motivation.',
      },
      {
        question: 'How do I stop being stressed in the morning?',
        answer: 'The most effective single change is to plan your day the night before. A 10 to 15 minute evening routine where you pick your top priorities and commit to them eliminates the morning scramble to figure out what to do. You wake up with a clear plan instead of an open question.',
      },
      {
        question: 'Does morning anxiety go away on its own?',
        answer: 'Occasional morning stress is normal, but chronic morning overwhelm usually does not resolve without changing the underlying pattern. If you are waking up anxious because you do not know what your day holds, the fix is structural: create a plan the night before so your mornings start with clarity instead of uncertainty.',
      },
      {
        question: 'How many tasks should I plan for each day?',
        answer: 'Research on cognitive load suggests three to six tasks is the sweet spot for most people. Fewer than three and you may not feel productive. More than six and the list itself becomes overwhelming. Start with three — your Most Important Task plus two supporting tasks — and adjust based on your capacity and schedule.',
      },
    ],
  },
  {
    slug: 'why-planning-at-night-is-better',
    title: 'Why Planning at Night Is Better Than Planning in the Morning',
    description: 'Evening planning outperforms morning planning according to decision fatigue research. Here are five science-backed reasons to plan your day the night before.',
    publishedAt: '2026-03-21',
    author: BLOG_AUTHORS.domani,
    readingTime: '10 min read',
    keywords: ['why planning at night is better', 'evening planning routine', 'plan your day the night before', 'night before planning benefits', 'morning vs evening planning', 'decision fatigue'],
    accent: 'from-primary-500/10 via-amber-400/10 to-white',
    categories: ['Evening Planning', 'Productivity Science'],
    faqs: [
      {
        question: 'Is planning at night better than planning in the morning?',
        answer: 'Research on decision fatigue and circadian rhythms suggests yes for most people. Evening planning moves decisions to a reflective period when cognitive costs are lower, and preserves your peak morning brainpower for execution. A 2018 study also found that writing a to-do list before bed helps you fall asleep faster.',
      },
      {
        question: 'How long should evening planning take?',
        answer: 'Ten to fifteen minutes is the sweet spot. Review what happened today, pick three to six priorities for tomorrow, and lock the plan. The routine should feel effortless, not like an extra chore. If it takes longer than 15 minutes, you are probably overcomplicating it.',
      },
      {
        question: 'What if I forget to plan the night before?',
        answer: 'It happens. When it does, spend five minutes doing a quick morning plan, but keep it minimal: pick your MIT and two supporting tasks. The goal is to get back to evening planning that night rather than letting the morning habit take over permanently.',
      },
      {
        question: 'Can I combine evening and morning planning?',
        answer: 'You can, but most people find it redundant. If you planned well last night, the morning session becomes unnecessary. Some people use a 60-second morning check-in to glance at the plan and mentally commit, but the actual decision-making stays in the evening.',
      },
    ],
  },
  {
    slug: 'planner-app-for-teachers',
    title: 'Planner App for Teachers: How Evening Planning Saves Your Mornings',
    description: 'Teachers juggle lesson plans, grading, meetings, and personal life before 8 AM. Learn how a simple evening planning habit can transform your teaching day.',
    publishedAt: '2026-03-23',
    author: BLOG_AUTHORS.domani,
    readingTime: '7 min read',
    keywords: ['planner app for teachers', 'teacher daily planner', 'planning app for educators', 'teacher morning routine', 'evening planning for teachers'],
    accent: 'from-amber-400/10 via-primary-400/10 to-white',
    categories: ['Evening Planning', 'For Your Schedule'],
    faqs: [
      {
        question: 'What is the best planner app for teachers?',
        answer: 'The best planner app for teachers is one that fits your workflow without adding complexity. If your mornings are chaotic and you spend the first hour reacting instead of teaching, look for an app built around evening planning — where you decide tomorrow\'s priorities the night before while you are calm.',
      },
      {
        question: 'How do teachers plan their day effectively?',
        answer: 'The most effective approach is evening planning: spend ten minutes each night reviewing your day, choosing tomorrow\'s top priority, and adding two to four supporting tasks. This eliminates morning scrambling and ensures your prep periods have a purpose.',
      },
      {
        question: 'Is Domani free for teachers?',
        answer: 'Domani is free for everyone during the public beta period with full access to all features. After the beta, it will be a one-time lifetime purchase — no monthly subscription.',
      },
      {
        question: 'How long does evening planning take?',
        answer: 'Ten minutes is the sweet spot. Review what happened today, pick your Most Important Task for tomorrow, add a few supporting tasks, and lock the plan. If it takes longer than fifteen minutes, you are probably overcomplicating it.',
      },
    ],
  },
  {
    slug: 'ticktick-alternative',
    title: 'TickTick Alternative: Why Evening-First Planning Beats Feature Overload',
    description: 'TickTick does everything. Domani does one thing better. Compare features, pricing, and planning philosophy to find the right daily planner for you.',
    publishedAt: '2026-03-23',
    author: BLOG_AUTHORS.domani,
    readingTime: '9 min read',
    keywords: ['ticktick alternative', 'ticktick vs domani', 'simple task app', 'ticktick too complicated', 'minimalist planner app', 'best daily planner app 2026'],
    accent: 'from-primary-600/10 via-emerald-400/10 to-white',
    categories: ['App Comparisons'],
    faqs: [
      {
        question: 'Is Domani a good TickTick alternative?',
        answer: 'If you are looking for a simpler, more focused daily planner with evening-first planning philosophy, yes. Domani does not try to replace TickTick\'s full feature set — it replaces the specific workflow of deciding what to do each day.',
      },
      {
        question: 'Is Domani simpler than TickTick?',
        answer: 'Yes, by design. TickTick offers tasks, habits, calendar, Pomodoro, Kanban boards, and more. Domani focuses exclusively on evening planning and morning execution. Fewer features means fewer decisions.',
      },
      {
        question: 'How does Domani pricing compare to TickTick?',
        answer: 'TickTick Premium costs $35.99 per year as a recurring subscription. Domani is a one-time payment of $34.99 (currently $9.99 for early adopters) with lifetime access and all future updates.',
      },
      {
        question: 'Can I use Domani and TickTick together?',
        answer: 'Yes. Some people use TickTick as their master task inbox and project manager, then use Domani each evening to pull their top three to six priorities for the next day.',
      },
      {
        question: 'What does Domani have that TickTick does not?',
        answer: 'Domani offers evening-first planning with built-in reminders, task rollover, task limit guardrails (the 3-6 rule), and custom categories with smart sorting — features designed to reduce morning decision fatigue.',
      },
    ],
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
  'overwhelmed-every-morning': () => import('../../../content/blog/overwhelmed-every-morning.mdx'),
  'why-planning-at-night-is-better': () => import('../../../content/blog/why-planning-at-night-is-better.mdx'),
  'planner-app-for-teachers': () => import('../../../content/blog/planner-app-for-teachers.mdx'),
  'ticktick-alternative': () => import('../../../content/blog/ticktick-alternative.mdx'),
}
