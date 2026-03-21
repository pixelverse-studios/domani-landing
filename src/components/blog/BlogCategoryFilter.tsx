'use client'

import { useState } from 'react'
import type { BlogPost, BlogCategory } from '@/lib/blog/posts'
import { BlogCard } from './BlogCard'

interface BlogCategoryFilterProps {
  categories: readonly BlogCategory[]
  posts: BlogPost[]
}

export function BlogCategoryFilter({ categories, posts }: BlogCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All')

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((post) => post.categories.includes(activeCategory))

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveCategory('All')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === 'All'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white/70 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white/70 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-500">No posts in this category yet.</p>
        )}
      </div>
    </div>
  )
}
