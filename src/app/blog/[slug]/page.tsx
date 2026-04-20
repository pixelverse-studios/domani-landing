import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getPostBySlug, mdxModules } from '@/lib/blog/posts'
import { PRIMARY_CTA_LABEL } from '@/lib/config/cta'
import { SITE_URL } from '@/lib/config/site'
import { createBlogPostingSchema, createFAQPageSchema, stringifyJsonLd } from '@/lib/seo/structured-data'
import { FloatingSidebar } from '@/components/blog/FloatingSidebar'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

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

  const canonical = `${SITE_URL}/blog/${post.slug}`

  return {
    title: `${post.title} | Domani Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: 'article',
      tags: post.keywords,
      authors: [post.author.name],
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
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

  const blogPostingSchema = createBlogPostingSchema(post)
  const faqSchema = post.faqs?.length ? createFAQPageSchema(post.faqs) : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-primary-50/5 pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(blogPostingSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqSchema) }}
        />
      )}
      <div className="mx-auto flex flex-col gap-12 px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16 lg:px-8">
        <article className="w-full" data-blog-article>
          <Breadcrumb items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]} />

          <h1 className="mt-6 text-4xl font-bold text-gray-900">{post.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{post.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full" />
              <span className="font-medium text-gray-700">{post.author.name}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
            <span>{post.readingTime}</span>
          </div>
          {post.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <span key={cat} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-lg mt-10 max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-em:text-gray-900 prose-li:text-gray-700 prose-a:text-primary-600">
            <MDXContent />
          </div>
        </article>

        <aside className="w-full space-y-5 lg:hidden">
          <div className="rounded-2xl border border-gray-100/80 bg-white/95 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600">
              Related reading
            </p>
            <div className="mt-4 space-y-1">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group -mx-2 block rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary-50/60">
                  <p className="text-[13px] font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary-700">{related.title}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-400 transition-colors group-hover:text-gray-500">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-5 shadow-[0_4px_16px_rgba(90,119,101,0.3)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">Ready to plan tonight?</p>
              <p className="mt-2.5 text-[17px] font-bold leading-tight text-white">{PRIMARY_CTA_LABEL}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">The evening planning app behind this article. Start free with 3 intentional tasks per day.</p>
              <Link
                href="/"
                className="group mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5"
              >
                Get started
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </aside>
        <FloatingSidebar relatedPosts={relatedPosts} />
      </div>

    </main>
  )
}
