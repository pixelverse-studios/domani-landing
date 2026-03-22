import Link from 'next/link'
import { SITE_URL } from '@/lib/config/site'
import { stringifyJsonLd } from '@/lib/seo/structured-data'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  const allItems = [{ label: 'Home', href: '/' }, ...items]
  return {
    '@type': 'BreadcrumbList' as const,
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.label,
      ...(item.href
        ? { item: `${SITE_URL}${item.href}` }
        : {}),
    })),
  }
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items]
  const schema = createBreadcrumbSchema(items)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            ...schema,
          }).replace(/</g, '\\u003c'),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-gray-300" aria-hidden>/</span>
                )}
                {isLast || !item.href ? (
                  <span className="text-gray-500">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-600"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
