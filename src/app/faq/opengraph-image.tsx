import { ImageResponse } from 'next/og'

export const alt = 'Domani FAQ - Common Questions About Evening Planning'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
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
          background: 'linear-gradient(135deg, #F4F7F5 0%, #E8EDE9 50%, #D1DBD4 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#6A8577',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            FAQ
          </div>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#3D4A44',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            Common Questions About Domani
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#6A8577',
              lineHeight: 1.5,
              maxWidth: '800px',
            }}
          >
            Everything you need to know about evening planning and getting started.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#5A7765' }}>
              Domani
            </div>
            <div style={{ width: '2px', height: '24px', background: '#A3BFB0' }} />
            <div style={{ fontSize: '18px', color: '#7D9B8A' }}>
              Plan Tomorrow Tonight
            </div>
          </div>
          <div style={{ fontSize: '16px', color: '#7D9B8A' }}>
            domani-app.com/faq
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
