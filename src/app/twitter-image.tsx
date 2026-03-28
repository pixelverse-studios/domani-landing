import { ImageResponse } from 'next/og'

export const alt = 'Domani - Plan Tomorrow Tonight, Wake Up Ready to Execute'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F4F7F5 0%, #E8EDE9 30%, #D1DBD4 60%, #E8EDE9 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle decorative circle */}
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(163,191,176,0.3) 0%, rgba(163,191,176,0) 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* App icon shape */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '140px',
            height: '140px',
            borderRadius: '32px',
            background: 'linear-gradient(145deg, #5A7765, #6A8577)',
            boxShadow: '0 8px 32px rgba(90,119,101,0.25)',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            D
          </div>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#3D4A44',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          Domani
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 500,
            color: '#6A8577',
            letterSpacing: '0.02em',
          }}
        >
          Plan Tomorrow Tonight, Wake Up Ready to Execute
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(90deg, #A3BFB0, #5A7765, #A3BFB0)',
          }}
        />

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            fontSize: '16px',
            color: '#7D9B8A',
            letterSpacing: '0.05em',
          }}
        >
          domani-app.com
        </div>
      </div>
    ),
    { ...size },
  )
}
