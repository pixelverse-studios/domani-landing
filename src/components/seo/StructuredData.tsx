/**
 * Structured Data Component
 * Renders JSON-LD schema markup for SEO
 */

import {
  createOrganizationSchema,
  createWebsiteSchema,
  createSoftwareApplicationSchema,
  createFAQPageSchema,
  stringifyJsonLd,
} from '@/lib/seo/structured-data'

type StructuredDataType = 'organization' | 'website' | 'software' | 'faq'

interface StructuredDataProps {
  type: StructuredDataType
  faqs?: Array<{ question: string; answer: string }>
}

export function StructuredData({ type, faqs }: StructuredDataProps) {
  let schema

  switch (type) {
    case 'organization':
      schema = createOrganizationSchema()
      break
    case 'website':
      schema = createWebsiteSchema()
      break
    case 'software':
      schema = createSoftwareApplicationSchema()
      break
    case 'faq':
      if (!faqs || faqs.length === 0) {
        console.warn('FAQ structured data requires faqs prop')
        return null
      }
      schema = createFAQPageSchema(faqs)
      break
    default:
      return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: stringifyJsonLd(schema),
      }}
      suppressHydrationWarning
    />
  )
}
