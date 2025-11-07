import Link from 'next/link'
import type { BlogPost } from '@/lib/blog/posts'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white/70 shadow-lg shadow-primary-500/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-primary-500/20 dark:border-white/10 dark:bg-dark-card/70">
      <div className={`h-2 w-full bg-gradient-to-r ${post.accent}`} aria-hidden />
      <div className="flex flex-col gap-5 p-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-300">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">{post.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{dateFormatter.format(new Date(post.publishedAt))}</span>
          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden />
          <span>{post.readingTime}</span>
        </div>
        <div className="mt-2">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-primary-500 dark:text-primary-300 dark:hover:text-primary-200"
            aria-label={`Read ${post.title}`}
          >
            Read article
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
