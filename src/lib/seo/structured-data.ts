/**
 * Structured Data (Schema.org JSON-LD) for Domani
 * Optimized for search engine rich results and visibility
 */

import { Organization, WebSite, SoftwareApplication, FAQPage } from 'schema-dts'
import { testimonials, averageRating } from '@/data/testimonials'

const SITE_URL = 'https://domani.app'
const SITE_NAME = 'Domani'

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
      email: 'support@domani-app.com',
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
  const reviewEntries = testimonials.map((testimonial) => ({
    '@type': 'Review' as const,
    author: {
      '@type': 'Person' as const,
      name: testimonial.name,
      jobTitle: testimonial.role,
      worksFor: {
        '@type': 'Organization' as const,
        name: testimonial.company,
      },
    },
    datePublished: testimonial.date,
    reviewBody: testimonial.quote,
    name: `${testimonial.company} review`,
    reviewRating: {
      '@type': 'Rating' as const,
      ratingValue: testimonial.rating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
    },
  }))

  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}#softwareapplication`,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: 'ProductivityApplication',
    applicationSubCategory: 'Task Management',
    operatingSystem: 'Web, iOS, Android',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(2),
      reviewCount: testimonials.length,
      ratingCount: testimonials.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviewEntries,
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
export function stringifyJsonLd(data: Organization | WebSite | SoftwareApplication | FAQPage): string {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      ...(data as unknown as Record<string, unknown>),
    },
    null,
    2
  ).replace(/</g, '\\u003c')
}
