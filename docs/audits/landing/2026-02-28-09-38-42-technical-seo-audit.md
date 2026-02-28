# Audit Log - Landing Page - 2026-02-28 09:38:42

## Prompt Summary
Conduct a comprehensive technical SEO audit of the Domani landing page, covering domain/URL configuration, page-level SEO, structured data, technical performance, web manifest, and image SEO.

## Actions Taken
1. Read all SEO configuration files: metadata.ts, structured-data.ts, sitemap.ts, robots.ts, keywords.ts
2. Read root layout.tsx and all page-level files (homepage, pricing, about, faq, blog, blog/[slug], privacy, terms, security)
3. Checked web manifest (site.webmanifest) for branding alignment
4. Searched entire src/ for `domani.app` and `domani-app.com` references
5. Checked next.config.js for image optimization and performance settings
6. Verified OG image files exist in /public/
7. Checked font loading strategy in globals.css
8. Reviewed netlify.toml for security headers
9. Verified structured data component implementation
10. Checked alt text usage on all Image components
11. Reviewed testimonials data used in structured data

## Files Reviewed (Read-Only Audit -- No Changes Made)
- `src/lib/seo/metadata.ts` - Central SITE_URL is wrong domain (domani.app)
- `src/lib/seo/structured-data.ts` - Central SITE_URL is wrong domain (domani.app)
- `src/lib/seo/keywords.ts` - Pricing meta description references old $3.99/month model
- `src/app/sitemap.ts` - baseUrl is wrong domain
- `src/app/robots.ts` - sitemap and host are wrong domain
- `src/app/layout.tsx` - OG url is wrong domain
- `src/app/page.tsx` - Missing metadata export (homepageMetadata is dead code)
- `src/app/pricing/page.tsx` - Uses pricingMetadata correctly
- `src/app/about/page.tsx` - Uses aboutMetadata correctly
- `src/app/faq/page.tsx` - Uses faqMetadata correctly, has structured data
- `src/app/blog/page.tsx` - Missing canonical, OG image
- `src/app/blog/[slug]/page.tsx` - Hardcoded wrong domain in canonical, missing OG images
- `src/app/privacy/page.tsx` - Missing OG tags, canonical
- `src/app/terms/page.tsx` - Missing OG tags, canonical
- `src/app/security/page.tsx` - Wrong email domain (security@domani.app), missing canonical
- `src/emails/waitlist-welcome.tsx` - Multiple wrong domain references
- `src/data/testimonials.ts` - Fabricated reviews embedded in structured data
- `src/styles/globals.css` - Render-blocking font @import
- `src/components/showcase/AppShowcase.tsx` - Uses next/image with proper alt text
- `public/site.webmanifest` - Old purple branding colors
- `next.config.js` - No remote image patterns configured
- `netlify.toml` - Missing CSP and Permissions-Policy headers

## Components/Features Affected
- All page metadata (every page on the site)
- Sitemap generation
- Robots.txt configuration
- JSON-LD structured data (Organization, WebSite, SoftwareApplication, FAQPage)
- Web manifest / PWA configuration
- Font loading performance
- Blog SEO

## Testing Considerations
- After domain fix: verify sitemap.xml renders correct URLs
- After domain fix: verify robots.txt shows correct host and sitemap
- Validate structured data at https://search.google.com/test/rich-results
- Test OG tags with https://www.opengraph.xyz/ or Facebook Sharing Debugger
- Run Lighthouse audit to measure font loading improvement
- Check Google Search Console for indexing issues after domain correction

## Performance Impact
- Font loading fix (CSS @import to next/font) will improve LCP by 100-300ms
- Correct canonical URLs will prevent index bloat and consolidate ranking signals
- Correct structured data will improve chances of rich results in SERP

## Next Steps
- Fix all domani.app references to www.domani-app.com (16 instances in src/)
- Update site.webmanifest colors to sage green
- Fix pricing meta description to match lifetime model
- Add metadata export to homepage page.tsx
- Migrate font loading to next/font/google
- Add OG images and canonical URLs to blog and legal pages
- Add app store URLs to SoftwareApplication schema
- Address fabricated review data in structured data

## Notes
- The security page uses security@domani.app while the rest of the site uses support@domani-app.com -- need to decide on a consistent email domain
- The waitlist email template also references the wrong domain and email addresses
- homepageMetadata in metadata.ts is fully defined but never imported anywhere -- it is dead code
- All image components use next/image with proper alt attributes (good)
- No raw <img> tags found in component code (good)
- Netlify deployment confirmed via netlify.toml (not Vercel as CLAUDE.md states)

## Timestamp
Created: 2026-02-28 09:38:42
Page Section: site-wide / all pages
