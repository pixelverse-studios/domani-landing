export interface FeatureComparison {
  feature: string
  domani: string | boolean
  competitor: string | boolean
}

export interface FAQ {
  question: string
  answer: string
}

export interface Competitor {
  slug: string
  name: string
  tagline: string
  description: string
  pricing: string
  pricingDetail: string
  domaniAdvantage: string
  strengths: string[]
  weaknesses: string[]
  features: FeatureComparison[]
  faqs: FAQ[]
  blogSlug?: string
}

export const DOMANI_PRICING = {
  display: '$34.99 lifetime (currently $9.99 early adopter)',
  detail: 'One-time purchase. 14-day free trial. No subscription.',
}

export const competitors: Competitor[] = [
  {
    slug: 'sunsama',
    name: 'Sunsama',
    tagline: 'Sunsama is powerful — but it plans your mornings, not your evenings.',
    description:
      'Sunsama is a daily planner built around morning planning rituals and calendar time-blocking. It pulls tasks from multiple integrations and guides you through a structured start-of-day routine. At $20/month, it targets teams and professionals who live in their calendars.',
    pricing: '$20/month ($240/year)',
    pricingDetail: 'Subscription only. 14-day free trial.',
    domaniAdvantage:
      'Domani costs 85% less over a year and shifts planning to the evening — when research shows decisions are calmer and sleep improves.',
    strengths: [
      'Deep integrations (Asana, Trello, Gmail, Slack, Notion)',
      'Calendar time-blocking built in',
      'Team visibility features',
      'Guided daily planning ritual',
    ],
    weaknesses: [
      'Morning-first planning increases decision fatigue',
      '$240/year subscription cost',
      'Complex for people who just need a simple daily plan',
      'No evening planning mode',
    ],
    features: [
      { feature: 'Planning philosophy', domani: 'Evening-first', competitor: 'Morning-first' },
      { feature: 'Task limit guardrails', domani: true, competitor: false },
      { feature: 'Task rollover', domani: true, competitor: false },
      { feature: 'Custom categories', domani: true, competitor: false },
      { feature: 'Reminder shortcuts', domani: true, competitor: true },
      { feature: 'Calendar integrations', domani: false, competitor: true },
      { feature: 'Team features', domani: false, competitor: true },
      { feature: 'Third-party integrations', domani: false, competitor: 'Extensive' },
      { feature: 'Pricing model', domani: 'Lifetime ($34.99)', competitor: 'Subscription ($240/yr)' },
      { feature: 'Free trial', domani: '14 days', competitor: '14 days' },
    ],
    faqs: [
      {
        question: 'How much does Sunsama cost compared to Domani?',
        answer:
          'Sunsama costs $20 per month ($240 per year) with no free tier. Domani offers a 14-day free trial followed by a one-time lifetime payment of $34.99 (currently $9.99 during early adopter pricing). Over one year, Sunsama costs roughly 7 times more.',
      },
      {
        question: 'What is the main difference between Sunsama and Domani?',
        answer:
          'The core difference is when you plan. Sunsama is built around morning planning — you start each day by pulling tasks and time-blocking. Domani is built around evening planning — you plan tomorrow tonight when calm, lock your plan, and wake up ready.',
      },
      {
        question: 'Is Domani a good Sunsama alternative?',
        answer:
          'If you want a simpler, more affordable planner focused on evening planning and morning execution, Domani is an excellent Sunsama alternative. If you need deep integrations and team features, Sunsama may be the better fit.',
      },
    ],
    blogSlug: 'sunsama-alternative',
  },
  {
    slug: 'todoist',
    name: 'Todoist',
    tagline: 'Todoist organizes everything — Domani focuses on what matters tomorrow.',
    description:
      'Todoist is one of the most popular task management apps in the world, with projects, labels, filters, and natural language input. It excels at capturing and organizing large volumes of tasks across work and personal life.',
    pricing: 'Free / $5/month Pro / $8/month Business',
    pricingDetail: 'Freemium with subscription tiers.',
    domaniAdvantage:
      'Todoist is great for managing everything. Domani is great for deciding what matters tomorrow. They solve different problems — one organizes, the other focuses.',
    strengths: [
      'Handles large task volumes with projects and labels',
      'Natural language task input',
      'Generous free tier',
      'Available on every platform',
      'Robust API and integrations',
    ],
    weaknesses: [
      'No evening planning mode — planning is always reactive',
      'No task limit guardrails — lists grow endlessly',
      'No evening planning nudges — easy to second-guess and reshuffle',
      'Subscription pricing for full features',
    ],
    features: [
      { feature: 'Planning philosophy', domani: 'Evening-first', competitor: 'Anytime / reactive' },
      { feature: 'Task limit guardrails', domani: true, competitor: false },
      { feature: 'Task rollover', domani: true, competitor: false },
      { feature: 'Custom categories', domani: true, competitor: true },
      { feature: 'Project management', domani: 'Simple daily focus', competitor: 'Full projects, labels, filters' },
      { feature: 'Natural language input', domani: false, competitor: true },
      { feature: 'Free tier', domani: '14-day trial', competitor: 'Yes (limited)' },
      { feature: 'Pricing model', domani: 'Lifetime ($34.99)', competitor: 'Subscription ($5-8/mo)' },
    ],
    faqs: [
      {
        question: 'Is Domani better than Todoist?',
        answer:
          'They solve different problems. Todoist is a full task manager for organizing everything in your life. Domani is an evening planner for deciding what matters tomorrow. If your Todoist lists feel endless and overwhelming, Domani\'s focused approach may help.',
      },
      {
        question: 'Can I use Domani and Todoist together?',
        answer:
          'Yes. Many people use Todoist as their master task inbox and Domani for nightly planning — pulling their top 3-6 priorities from Todoist into Domani each evening.',
      },
      {
        question: 'Why switch from Todoist to Domani?',
        answer:
          'If you find yourself with 50+ tasks in Todoist and no idea what to do first each morning, Domani\'s evening planning approach forces you to make that decision the night before — when you\'re calm, not overwhelmed.',
      },
    ],
  },
  {
    slug: 'ticktick',
    name: 'TickTick',
    tagline: 'TickTick does everything — Domani does one thing better.',
    description:
      'TickTick is a feature-rich productivity app combining tasks, habits, calendar, Pomodoro timer, and more in a single application. It appeals to power users who want an all-in-one productivity suite.',
    pricing: 'Free / $35.99/year Premium',
    pricingDetail: 'Freemium with annual subscription.',
    domaniAdvantage:
      'TickTick is a Swiss Army knife. Domani is a scalpel. If you want one thing done exceptionally well — evening planning that transforms your mornings — Domani is the simpler, more focused choice.',
    strengths: [
      'All-in-one: tasks, habits, calendar, Pomodoro',
      'Competitive free tier',
      'Kanban board view',
      'Built-in habit tracker',
      'Natural language date parsing',
    ],
    weaknesses: [
      'Feature overload for daily planning',
      'No evening-first planning philosophy',
      'No task limit guardrails or evening planning workflow',
      'Complexity can increase decision fatigue',
    ],
    features: [
      { feature: 'Planning philosophy', domani: 'Evening-first', competitor: 'Anytime / feature-driven' },
      { feature: 'Task limit guardrails', domani: true, competitor: false },
      { feature: 'Task rollover', domani: true, competitor: false },
      { feature: 'Custom categories', domani: true, competitor: true },
      { feature: 'Habit tracking', domani: 'Streak tracking', competitor: 'Full habit tracker' },
      { feature: 'Pomodoro timer', domani: false, competitor: true },
      { feature: 'Kanban boards', domani: false, competitor: true },
      { feature: 'Pricing model', domani: 'Lifetime ($34.99)', competitor: 'Subscription ($35.99/yr)' },
    ],
    faqs: [
      {
        question: 'Is Domani simpler than TickTick?',
        answer:
          'Yes, by design. TickTick offers tasks, habits, calendar, Pomodoro, and more. Domani focuses exclusively on evening planning and morning execution. If TickTick feels like too much, Domani\'s focused approach may be what you need.',
      },
      {
        question: 'How does Domani pricing compare to TickTick?',
        answer:
          'TickTick Premium costs $35.99 per year as a recurring subscription. Domani is a one-time payment of $34.99 (currently $9.99 for early adopters) with lifetime access and all future updates included.',
      },
      {
        question: 'What does Domani have that TickTick doesn\'t?',
        answer:
          'Domani offers evening-first planning, built-in task limit guardrails (the 3-6 rule), task rollover, and custom categories with smart sorting. These features are designed to reduce morning decision fatigue.',
      },
    ],
    blogSlug: 'ticktick-alternative',
  },
  {
    slug: 'notion',
    name: 'Notion',
    tagline: 'Notion is a workspace. Domani is a daily planning habit.',
    description:
      'Notion is an all-in-one workspace for notes, docs, wikis, databases, and project management. Many people build custom daily planners in Notion using templates, but it requires significant setup and maintenance.',
    pricing: 'Free / $10/month Plus / $18/month Business',
    pricingDetail: 'Freemium with subscription tiers.',
    domaniAdvantage:
      'Building a daily planner in Notion takes hours of setup and constant maintenance. Domani gives you a purpose-built evening planning system in 30 seconds — no templates, no databases, no configuration.',
    strengths: [
      'Infinitely customizable workspace',
      'Notes, docs, and databases in one place',
      'Strong collaboration features',
      'Active template community',
      'Generous free tier for personal use',
    ],
    weaknesses: [
      'Requires significant setup for daily planning',
      'No built-in evening planning workflow',
      'Custom planners break easily and need maintenance',
      'Overwhelming for people who just need a daily plan',
    ],
    features: [
      { feature: 'Planning philosophy', domani: 'Evening-first (built-in)', competitor: 'DIY (build your own)' },
      { feature: 'Task limit guardrails', domani: true, competitor: false },
      { feature: 'Task rollover', domani: true, competitor: false },
      { feature: 'Custom categories', domani: true, competitor: true },
      { feature: 'Setup time', domani: '30 seconds', competitor: 'Hours (custom templates)' },
      { feature: 'Notes and docs', domani: false, competitor: true },
      { feature: 'Database views', domani: false, competitor: true },
      { feature: 'Team collaboration', domani: false, competitor: true },
      { feature: 'Pricing model', domani: 'Lifetime ($34.99)', competitor: 'Subscription ($10-18/mo)' },
    ],
    faqs: [
      {
        question: 'Can Domani replace my Notion daily planner?',
        answer:
          'If you use Notion primarily for daily task planning, yes. Domani provides a dedicated evening planning workflow that takes 30 seconds to set up versus hours of Notion template configuration. You can keep Notion for notes and docs while using Domani for daily planning.',
      },
      {
        question: 'Why use Domani instead of a Notion template?',
        answer:
          'Notion templates require maintenance, break when you update properties, and don\'t enforce planning habits. Domani has built-in evening reminders, task limit guardrails, task rollover, and streak tracking — features you can\'t replicate easily in Notion.',
      },
      {
        question: 'Is Domani cheaper than Notion?',
        answer:
          'For daily planning, yes. Notion Plus costs $10/month ($120/year). Domani is a one-time payment of $34.99. However, Notion does far more than planning — it\'s a full workspace. The comparison only applies if you\'re using Notion primarily as a daily planner.',
      },
    ],
  },
]

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug)
}

export function getAllCompetitorSlugs(): string[] {
  return competitors.map((c) => c.slug)
}
