/**
 * SEO Metadata Configuration and Helpers
 * Centralized metadata management for consistent SEO across all pages
 */

import { Metadata } from 'next'
import { PAGE_KEYWORDS, META_TEMPLATES, TITLE_TEMPLATES } from './keywords'

const SITE_URL = 'https://domani.app'
const SITE_NAME = 'Domani'
const TWITTER_HANDLE = '@domaniapp'

/**
 * Base metadata configuration
 * Used as foundation for all pages
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: 'Domani Team', url: SITE_URL }],
  creator: 'Domani',
  publisher: 'Domani',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

/**
 * Homepage metadata
 */
export const homepageMetadata: Metadata = {
  title: TITLE_TEMPLATES.homepage,
  description: META_TEMPLATES.homepage,
  keywords: PAGE_KEYWORDS.homepage,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_TEMPLATES.homepage,
    description: META_TEMPLATES.homepage,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Domani - Plan Tomorrow Tonight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: TITLE_TEMPLATES.homepage,
    description: META_TEMPLATES.homepage,
    images: [`${SITE_URL}/twitter-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

/**
 * Pricing page metadata
 */
export const pricingMetadata: Metadata = {
  title: TITLE_TEMPLATES.pricing,
  description: META_TEMPLATES.pricing,
  keywords: PAGE_KEYWORDS.pricing,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/pricing`,
    siteName: SITE_NAME,
    title: 'Pricing - Start Free | Domani',
    description: META_TEMPLATES.pricing,
    images: [
      {
        url: `${SITE_URL}/og-pricing.png`,
        width: 1200,
        height: 630,
        alt: 'Domani Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'Pricing - Start Free | Domani',
    description: META_TEMPLATES.pricing,
    images: [`${SITE_URL}/og-pricing.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
}

/**
 * About page metadata
 */
export const aboutMetadata: Metadata = {
  title: TITLE_TEMPLATES.about,
  description: META_TEMPLATES.about,
  keywords: PAGE_KEYWORDS.about,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    title: 'About Domani - The Science of Evening Planning',
    description: META_TEMPLATES.about,
    images: [
      {
        url: `${SITE_URL}/og-about.png`,
        width: 1200,
        height: 630,
        alt: 'About Domani',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'About Domani - The Science of Evening Planning',
    description: META_TEMPLATES.about,
    images: [`${SITE_URL}/og-about.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

/**
 * FAQ page metadata
 */
export const faqMetadata: Metadata = {
  title: TITLE_TEMPLATES.faq,
  description: META_TEMPLATES.faq,
  keywords: PAGE_KEYWORDS.faq,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/faq`,
    siteName: SITE_NAME,
    title: 'Frequently Asked Questions - Evening Planning Guide | Domani',
    description: META_TEMPLATES.faq,
    images: [
      {
        url: `${SITE_URL}/og-faq.png`,
        width: 1200,
        height: 630,
        alt: 'Domani FAQ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'FAQ - Evening Planning Guide | Domani',
    description: META_TEMPLATES.faq,
    images: [`${SITE_URL}/og-faq.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
}

/**
 * Create dynamic page metadata
 */
export function createPageMetadata({
  title,
  description,
  keywords = [],
  path = '/',
  image,
  type = 'website',
}: {
  title: string
  description: string
  keywords?: string[]
  path?: string
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const fullUrl = `${SITE_URL}${path}`
  const ogImage = image || `${SITE_URL}/og-image.png`
  const fullTitle = title.includes('|') ? title : TITLE_TEMPLATES.default(title)

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

/**
 * Merge metadata with base configuration
 */
export function mergeMetadata(metadata: Metadata): Metadata {
  return {
    ...baseMetadata,
    ...metadata,
  }
}
