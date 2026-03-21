'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { BlogPost } from '@/lib/blog/posts'
import { cn } from '@/lib/utils'

interface FloatingSidebarProps {
  relatedPosts: BlogPost[]
}

export function FloatingSidebar({ relatedPosts }: FloatingSidebarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [offsetLeft, setOffsetLeft] = useState(0)

  useEffect(() => {
    const handlePosition = () => {
      const article = document.querySelector<HTMLElement>('[data-blog-article]')
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches

      if (!article || !isDesktop) {
        setIsVisible(false)
        return
      }

      const articleRect = article.getBoundingClientRect()
      const pageOffsetLeft = articleRect.right + 24 + window.scrollX
      setOffsetLeft(pageOffsetLeft)
      setIsVisible(true)
    }

    handlePosition()
    window.addEventListener('scroll', handlePosition)
    window.addEventListener('resize', handlePosition)
    return () => {
      window.removeEventListener('scroll', handlePosition)
      window.removeEventListener('resize', handlePosition)
    }
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-none fixed top-24 z-30 hidden w-[320px] max-h-[calc(100vh-6rem-2rem)] overflow-y-auto transition-all duration-500 lg:block',
        isVisible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'
      )}
      style={{ left: offsetLeft }}
    >
      <div className="pointer-events-auto space-y-5">
        {/* Related Reading Card */}
        <div className="rounded-2xl border border-gray-100/80 bg-white/95 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600">
            Related reading
          </p>
          <div className="mt-4 space-y-1">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group -mx-2 block rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary-50/60"
              >
                <p className="text-[13px] font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary-700">
                  {related.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-400 transition-colors group-hover:text-gray-500">
                  {related.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-5 shadow-[0_4px_16px_rgba(90,119,101,0.3)]">
          {/* Subtle decorative elements */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
              Ready to plan tonight?
            </p>
            <p className="mt-2.5 text-[17px] font-bold leading-tight text-white">
              Try Domani free
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
              The evening planning app behind this article. Free during public beta.
            </p>
            <Link
              href="/"
              className="group mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:shadow-md hover:gap-2.5"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
