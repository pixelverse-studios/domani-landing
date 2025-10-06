import type { Metadata } from 'next'
import { Inter, Abril_Fatface } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeScript } from '@/components/ThemeScript'
import QueryProvider from '@/providers/QueryProvider'
import { Toaster } from 'sonner'
import { AuthHandler } from '@/components/auth/AuthHandler'
import { StructuredData } from '@/components/seo/StructuredData'
import { mergeMetadata } from '@/lib/seo/metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const abrilFatface = Abril_Fatface({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-abril',
  display: 'swap',
})

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
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${abrilFatface.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="software" />
        {/* Google Search Console Verification - Replace with your actual verification code */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-dark-gradient-from text-foreground transition-colors overflow-x-hidden">
        <ThemeProvider>
          <QueryProvider>
            <AuthHandler />
            <div className="min-h-screen overflow-x-clip">
              {children}
            </div>
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
        </ThemeProvider>

        {/* SiteBehaviour Analytics */}
        <Script
          id="sitebehaviour-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if(window.location && window.location.search && window.location.search.indexOf('capture-sitebehaviour-heatmap') !== -1) {
                    sessionStorage.setItem('capture-sitebehaviour-heatmap', '_');
                  }

                  var sbSiteSecret = '59dd84d0-342e-4caa-b723-040c094d92fa';
                  window.sitebehaviourTrackingSecret = sbSiteSecret;
                  var scriptElement = document.createElement('script');
                  scriptElement.defer = true;
                  scriptElement.id = 'site-behaviour-script-v2';
                  scriptElement.src = 'https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=' + sbSiteSecret;
                  document.head.appendChild(scriptElement);
                }
                catch (e) {console.error(e)}
              })()
            `,
          }}
        />
      </body>
    </html>
  )
}