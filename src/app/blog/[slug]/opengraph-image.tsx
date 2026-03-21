import { ImageResponse } from 'next/og'
import { blogPosts, getPostBySlug } from '@/lib/blog/posts'

export const alt = 'Domani Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const title = post?.title ?? 'Domani Blog'
  const description = post?.description ?? 'Evening planning tips and guides'
  const category = post?.categories?.[0] ?? 'Blog'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #f8faf9 0%, #eef3f0 50%, #e4ece7 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#6A8577',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: title.length > 50 ? '42px' : '52px',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#666666',
              lineHeight: 1.5,
              maxWidth: '800px',
            }}
          >
            {description.length > 120 ? description.slice(0, 117) + '...' : description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#5A7765',
              }}
            >
              Domani
            </div>
            <div
              style={{
                width: '2px',
                height: '24px',
                background: '#ccc',
              }}
            />
            <div
              style={{
                fontSize: '18px',
                color: '#888',
              }}
            >
              Plan Tomorrow Tonight
            </div>
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#999',
            }}
          >
            domani-app.com/blog
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
