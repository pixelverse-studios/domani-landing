/**
 * SEO Metadata Configuration and Helpers
 * Centralized metadata management for consistent SEO across all pages
 */

import { Metadata } from 'next'
import { PAGE_KEYWORDS, META_TEMPLATES, TITLE_TEMPLATES } from './keywords'
import { SITE_URL, SITE_NAME, TWITTER_HANDLE } from '@/lib/config/site'

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
  manifest: '/site.webmanifest',
}

/**
 * Homepage metadata
 */
export const homepageMetadata: Metadata = {
  title: { absolute: TITLE_TEMPLATES.homepage },
  description: META_TEMPLATES.homepage,
  keywords: [...PAGE_KEYWORDS.homepage],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_TEMPLATES.homepage,
    description: META_TEMPLATES.homepage,
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: TITLE_TEMPLATES.homepage,
    description: META_TEMPLATES.homepage,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

/**
 * Pricing page metadata
 */
export const pricingMetadata: Metadata = {
  title: { absolute: TITLE_TEMPLATES.pricing },
  description: META_TEMPLATES.pricing,
  keywords: [...PAGE_KEYWORDS.pricing],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/pricing`,
    siteName: SITE_NAME,
    title: 'Domani Pricing - Free 14-Day Trial, Then Lifetime Access',
    description: META_TEMPLATES.pricing,
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'Domani Pricing - Free 14-Day Trial, Then Lifetime Access',
    description: META_TEMPLATES.pricing,
  },
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
}

/**
 * About page metadata
 */
export const aboutMetadata: Metadata = {
  title: { absolute: TITLE_TEMPLATES.about },
  description: META_TEMPLATES.about,
  keywords: [...PAGE_KEYWORDS.about],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    title: 'About Domani - Why Evening Planning Works Better For You',
    description: META_TEMPLATES.about,
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'About Domani - Why Evening Planning Works Better For You',
    description: META_TEMPLATES.about,
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
}

/**
 * FAQ page metadata
 */
export const faqMetadata: Metadata = {
  title: { absolute: TITLE_TEMPLATES.faq },
  description: META_TEMPLATES.faq,
  keywords: [...PAGE_KEYWORDS.faq],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}/faq`,
    siteName: SITE_NAME,
    title: 'Evening Planning FAQ - Common Questions About Domani',
    description: META_TEMPLATES.faq,
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'Evening Planning FAQ - Common Questions About Domani',
    description: META_TEMPLATES.faq,
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
  const fullTitle = title.includes('|') ? title : TITLE_TEMPLATES.default(title)
  const imageConfig = image
    ? {
        openGraphImages: [{ url: image, width: 1200, height: 630, alt: title }],
        twitterImages: [image],
      }
    : { openGraphImages: undefined, twitterImages: undefined }

  return {
    title: { absolute: fullTitle },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      ...(imageConfig.openGraphImages && { images: imageConfig.openGraphImages }),
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: fullTitle,
      description,
      ...(imageConfig.twitterImages && { images: imageConfig.twitterImages }),
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
