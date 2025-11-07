import { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for Domani
 * Controls search engine crawler access
 *
 * Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/', // Prevent OpenAI from scraping content
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/', // Prevent ChatGPT browsing from accessing
      },
    ],
    sitemap: 'https://domani.app/sitemap.xml',
    host: 'https://domani.app',
  }
}
