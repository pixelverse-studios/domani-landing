# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Updated favicon and app icons with new branded Domani icon
- Updated Open Graph and Twitter social sharing images with new branding
- Updated Apple touch icon and PWA icons for consistent branding across all platforms

## Notes for internal team
- Replaced all favicon sizes (16x16, 32x32, favicon.ico) with new icon-dark-512.png
- Updated apple-touch-icon.png (180x180), logo-192.png, logo.png (512x512)
- Created new OG images (og-image.png, og-pricing.png, og-about.png, og-faq.png, twitter-image.png) with icon centered on dark background
- Added src/app/icon.png and src/app/apple-icon.png (Next.js 14 convention for favicons)
- Removed manual icon paths from metadata.ts to use app directory icons
- site.webmanifest paths unchanged (already pointed to logo.png and logo-192.png)
- Header typography logo unchanged (uses CSS-based text rendering)
- Fixed syntax error in terms/page.tsx (curly apostrophe issue)
- Added sharp as devDependency for image generation script

## Changed URLs
- https://www.domani-app.com/
- https://www.domani-app.com/pricing
- https://www.domani-app.com/about
- https://www.domani-app.com/faq
- https://www.domani-app.com/terms
