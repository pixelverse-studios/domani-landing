'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
        'pointer-events-none fixed top-24 z-30 hidden w-[320px] transition-all duration-300 lg:block',
        isVisible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
      )}
      style={{ left: offsetLeft }}
    >
      <div className="pointer-events-auto space-y-8 rounded-3xl border border-white/40 bg-white/90 p-6 shadow-2xl">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Related reading</h2>
          <div className="mt-4 space-y-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="block rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:border-primary-200 hover:text-primary-600:border-primary-500/40"
              >
                <p className="font-semibold">{related.title}</p>
                <p className="mt-1 text-xs text-gray-500">{related.description}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-5 text-white shadow-lg">
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
      </div>
    </div>
  )
}
