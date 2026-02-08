import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BlogCard } from '@/components/blog/BlogCard'
import { blogPosts, getPostBySlug, mdxModules } from '@/lib/blog/posts'
import { FloatingSidebar } from '@/components/blog/FloatingSidebar'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    return {}
  }

  const canonical = `https://domani.app/blog/${post.slug}`

  return {
    title: `${post.title} | Domani Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: 'article',
      tags: post.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    notFound()
  }

  const loadModule = mdxModules[post.slug]
  if (!loadModule) {
    notFound()
  }

  const { default: MDXContent } = await loadModule()

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug)

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-primary-50/5 pb-24 pt-32">
      <div className="mx-auto flex flex-col gap-12 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16 lg:px-8">
        <article className="w-full" data-blog-article>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-primary-500"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to blog
          </Link>

          <h1 className="mt-6 text-4xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{post.description}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
            <span>{post.readingTime}</span>
          </div>

          <div className="prose prose-lg mt-10 max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-em:text-gray-900 prose-li:text-gray-700 prose-a:text-primary-600">
            <MDXContent />
          </div>
        </article>

        <aside className="w-full space-y-8 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur lg:hidden">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Related reading</h2>
            <div className="mt-4 space-y-4">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="block rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:border-primary-200 hover:text-primary-600">
                  <p className="font-semibold">{related.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-evening-600 p-5 text-white shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">Ready to plan tonight?</p>
            <p className="mt-3 text-lg font-semibold">Join the Domani waitlist</p>
            <p className="mt-1 text-sm text-white/80">Try the evening planning app that inspired this article. Now in public beta.</p>
            <Link
              href="/#inline-email"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Get notified
            </Link>
          </div>
        </aside>
        <FloatingSidebar relatedPosts={relatedPosts} />
      </div>

      <section className="container mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">Keep exploring</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {relatedPosts.slice(0, 2).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}
