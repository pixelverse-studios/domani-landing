import type { Metadata } from 'next'
import '@/styles/globals.css'
import QueryProvider from '@/providers/QueryProvider'
import { Toaster } from 'sonner'
import { AuthHandler } from '@/components/auth/AuthHandler'
import { StructuredData } from '@/components/seo/StructuredData'
import { mergeMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { SiteBehaviourConsentGate } from '@/components/privacy/SiteBehaviourConsentGate'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = mergeMetadata({
  title: {
    default: 'Domani - Plan Tomorrow Tonight, Wake Up Ready to Execute',
    template: '%s | Domani',
  },
  description: 'Transform chaotic mornings into focused execution. Plan tomorrow tonight when you\'re calm, wake up ready to execute. Free daily planner app.',
  keywords: [
    'daily planner app',
    'evening planning app',
    'morning routine app',
    'task management',
    'productivity app',
    'time blocking app',
    'decision fatigue',
    'plan tomorrow tonight',
  ],
  openGraph: {
    title: 'Domani - Plan Tomorrow Tonight, Wake Up Ready to Execute',
    description: 'Transform chaotic mornings into focused execution with evening planning psychology.',
    type: 'website',
    locale: 'en_US',
    url: 'https://domani.app',
    siteName: 'Domani',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Domani - Evening Planning App',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@domaniapp',
    creator: '@domaniapp',
    title: 'Domani - Plan Tomorrow Tonight',
    description: 'Transform chaotic mornings into focused execution with evening planning.',
    images: ['/twitter-image.png'],
  },
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7D9B8A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="software" />
      </head>
      <body className="font-sans antialiased bg-white text-foreground transition-colors overflow-x-hidden">
        <QueryProvider>
          <AuthHandler />
          <Header />
          <div className="min-h-screen overflow-x-clip">{children}</div>
          <Footer />
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              className: 'font-sans',
              style: {
                fontSize: '14px',
              },
            }}
          />
        </QueryProvider>
        <SiteBehaviourConsentGate />
      </body>
    </html>
  )
}
