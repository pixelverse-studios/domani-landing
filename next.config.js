const createMDX = require('@next/mdx')

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@/mdx-components',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Explicitly disable trailing slash to prevent redirect loops
  trailingSlash: false,
  // Skip redirects for API routes
  skipTrailingSlashRedirect: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
  async rewrites() {
    const backendUrl = process.env.PVS_API_URL || 'http://localhost:5001'
    return [
      {
        source: '/api/domani/:path*',
        destination: `${backendUrl}/api/domani/:path*`,
      },
    ]
  },
}

module.exports = withMDX(nextConfig)
