# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Updated robots.txt to block non-content pages from search crawlers (OAuth, dashboard, alternate homepage)
- Added delete-account page to sitemap for search engine discovery

## Notes for internal team
- DEV-529: SEO audit found only 1/23 pages indexed in GSC. Root cause: crawlers wasting budget on non-content routes
- Files changed: src/app/robots.ts, src/app/sitemap.ts
- Manual step needed: request indexing for all priority pages via GSC URL Inspection

## Changed URLs
- https://www.domani-app.com/
- https://www.domani-app.com/pricing
- https://www.domani-app.com/about
- https://www.domani-app.com/faq
- https://www.domani-app.com/blog
- https://www.domani-app.com/blog/evening-planning-routine
- https://www.domani-app.com/blog/decision-fatigue-app
- https://www.domani-app.com/blog/sunsama-alternative
- https://www.domani-app.com/privacy
- https://www.domani-app.com/terms
- https://www.domani-app.com/security
- https://www.domani-app.com/delete-account
