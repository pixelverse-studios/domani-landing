# Running TODO

Persistent list of outstanding work for Domani landing SEO / growth.

## Technical SEO
- [x] Add the missing static assets referenced in metadata/schema (`public/favicon.ico`, `public/site.webmanifest`, `public/logo.png`, `public/images/app-screenshot.png`, `public/og-image.png`, `public/og-pricing.png`, `public/og-about.png`, `public/og-faq.png`, `public/twitter-image.png`) so crawlers and social scrapers stop 404’ing.
- [x] Update `src/app/robots.ts` to stop blocking `/_next/` assets; only private areas (`/api`, `/admin`, `/private`, etc.) should remain disallowed.
- [x] Either ship actual `/privacy` and `/terms` routes (and link them from the UI) or remove those URLs from `src/app/sitemap.ts` until the pages exist.
- [x] Align JSON-LD in `src/lib/seo/structured-data.ts` with reality: point `logo`/`screenshot` at real files, drop the `aggregateRating` stub unless we have documented reviews, and delete the `/search` `potentialAction` or build the search endpoint it points to.
- [x] Replace the placeholder Google Search Console meta tag in `src/app/layout.tsx` with the live verification code and update the GA4 measurement ID (`src/components/Analytics.tsx`) so tracking actually flows.
- [x] Once legal pages exist, link the waitlist privacy blurb in `src/components/WaitlistInline.tsx` to them to stay CAN-SPAM/GDPR compliant.

## Performance / UX
- [x] Re-enable Next.js image optimization in `next.config.js` (or export optimized WebP/AVIF assets) so large hero/showcase PNGs stop tanking LCP.
- [x] Break the hero, benefits, and showcase sections into server components with optional client-side motion layers to shrink the initial JS bundle and improve INP.
- [x] Gate the SiteBehaviour tracking script in `src/app/layout.tsx` behind a consent banner so it only loads after opt-in, reducing TBT and meeting privacy requirements.
- [x] Add automated Core Web Vitals monitoring by wiring Next's `reportWebVitals` hook into GA event tracking so CLS/LCP/INP data is captured for alerting.

## Content / Authority
- [x] Stand up a `/blog` (MDX) plus landing pages for the evening planning routine, decision fatigue app, and Sunsama alternative keyword clusters.
- [x] Collect real testimonials/ratings, surface them on `/`, `/about`, and `/pricing`, and add real `Review` schema for Domani.
- [x] Produce the OpenGraph/Twitter creative outlined in `docs/technical/opengraph-images-guide.md` so every key page has share-ready artwork.
- [x] Publish the promised privacy/terms/security content and reuse it across footer, waitlist copy, and app onboarding.
