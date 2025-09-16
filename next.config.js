/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Explicitly disable trailing slash to prevent redirect loops
  trailingSlash: false,
  // Skip redirects for API routes
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig