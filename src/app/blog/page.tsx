import type { Metadata } from 'next'
import Link from 'next/link'
import { BlogCard } from '@/components/blog/BlogCard'
import { blogPosts } from '@/lib/blog/posts'

export const metadata: Metadata = {
  title: 'Domani Blog – Evening Planning, Decision Fatigue, Sunsama Alternatives',
  description:
    'Friendly guides on evening planning, beating decision fatigue, and choosing the right daily planning tools so you can plan tomorrow tonight.',
}

const featuredClusters = [
  {
    title: 'Evening Planning Routine',
    description: 'Turn a 15-minute nightly wind-down into calm, focused mornings.',
    slug: 'evening-planning-routine',
  },
  {
    title: 'Decision Fatigue App Framework',
    description: 'Pre-commit to tomorrow so you never spiral through another morning.',
    slug: 'decision-fatigue-app',
  },
  {
    title: 'Sunsama Alternative',
    description: 'Compare Sunsama with an evening-first flow and pick what feels lighter.',
    slug: 'sunsama-alternative',
  },
]

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-primary-50/5 pb-24 pt-32 dark:from-dark-gradient-from dark:via-dark-gradient-via/40 dark:to-dark-gradient-to">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Domani Blog</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl text-balance">
            Plan Tomorrow Tonight, Learn the Why
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            Friendly explainers on evening planning, calmer mornings, beating decision fatigue, and choosing the right tools.
            Every post ends with simple steps you can try tonight.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {featuredClusters.map((cluster) => (
            <Link
              key={cluster.slug}
              href={`/blog/${cluster.slug}`}
              className="rounded-3xl border border-primary-100/70 bg-white/70 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-primary-500/20 dark:border-white/10 dark:bg-dark-card/60"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{cluster.title}</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{cluster.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-300">
                Explore guide
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-20 space-y-10">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}
