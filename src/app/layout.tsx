import type { Metadata } from 'next'
import { Inter, Abril_Fatface } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeScript } from '@/components/ThemeScript'

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

export const metadata: Metadata = {
  title: 'Domani - Plan Tomorrow Tonight, Wake Up Ready',
  description: 'Transform your productivity with evening planning psychology. Add tomorrow\'s tasks when you\'re calm, execute when you\'re focused.',
  keywords: 'productivity app, evening planning, task management, morning routine, productivity psychology',
  authors: [{ name: 'Domani' }],
  openGraph: {
    title: 'Domani - Plan Tomorrow Tonight, Wake Up Ready',
    description: 'Transform your productivity with evening planning psychology.',
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
    title: 'Domani - Plan Tomorrow Tonight',
    description: 'Transform your productivity with evening planning psychology.',
    images: ['/twitter-image.png'],
  },
}

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
      </head>
      <body className="font-sans antialiased bg-white dark:bg-dark-gradient-from text-foreground transition-colors overflow-x-hidden">
        <ThemeProvider>
          <div className="min-h-screen overflow-x-clip">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}