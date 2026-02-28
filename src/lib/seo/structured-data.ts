/**
 * Structured Data (Schema.org JSON-LD) for Domani
 * Optimized for search engine rich results and visibility
 */

import { Organization, WebSite, SoftwareApplication, FAQPage, BlogPosting } from 'schema-dts'
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '@/lib/config/site'
import { getAppStoreUrl, getPlayStoreUrl } from '@/lib/config/appStores'
import type { BlogPost } from '@/lib/blog/posts'

/**
 * Organization schema - Used in root layout
 * Establishes brand identity and trust signals
 */
export function createOrganizationSchema(): Organization {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: '512',
      height: '512',
    },
    description: 'Transform chaotic mornings into focused execution with evening planning psychology. Plan tomorrow tonight, wake up ready to execute.',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'Domani Team',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://twitter.com/domaniapp',
      'https://www.linkedin.com/company/domaniapp',
      'https://github.com/domaniapp',
    ],
  }
}

/**
 * WebSite schema - Used in root layout
 * Basic site identity (search action removed until on-site search ships)
 */
export function createWebsiteSchema(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Evening planning app that transforms chaotic mornings into focused execution',
  }
}

/**
 * SoftwareApplication schema - Used on homepage and features pages
 * Critical for app visibility in search results
 */
export function createSoftwareApplicationSchema(): SoftwareApplication {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}#softwareapplication`,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'ProductivityApplication',
    applicationSubCategory: 'Task Management',
    operatingSystem: 'iOS, Android',
    installUrl: [getAppStoreUrl(), getPlayStoreUrl()],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    description: 'Plan tomorrow tonight when you\'re calm, wake up ready to execute. The evening planning app that reduces morning decision fatigue.',
    screenshot: `${SITE_URL}/images/app-screenshot.png`,
    featureList: [
      'Evening Planning Mode',
      'MIT (Most Important Task) Focus',
      'Plan Lock Feature',
      'Morning Execution View',
      'Progress Tracking',
      'Multi-device Sync',
    ],
  }
}

/**
 * BlogPosting schema - Used on individual blog post pages
 * Enables article rich results in Google search
 */
export function createBlogPostingSchema(post: BlogPost): BlogPosting {
  return {
    '@type': 'BlogPosting',
    '@id': `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
  }
}

/**
 * FAQ Page schema - Used on FAQ page
 * Enables FAQ rich results in Google search
 */
export function createFAQPageSchema(faqs: Array<{ question: string; answer: string }>): FAQPage {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faqpage`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Helper function to safely stringify JSON-LD for script tags
 * Prevents XSS by escaping dangerous characters
 */
export function stringifyJsonLd(data: Organization | WebSite | SoftwareApplication | FAQPage | BlogPosting): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      ...(data as unknown as Record<string, unknown>),
    },
    null,
    2
  ).replace(/</g, '\\u003c')
}
