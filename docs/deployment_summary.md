# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Expanded GA4 analytics tracking for paid campaign attribution, app store clicks, outbound links, CTA activity, FAQ engagement, and Web Vitals.
- Added attribution support for UTMs and paid click IDs across Google, Meta, TikTok, LinkedIn, and Microsoft campaigns.
- Replaced legacy prompt audit-trail workflow with AGENTS.md guidance that uses git commits and pull requests for history.
- Added SEO keyword research, SEO competitor analysis, and keyword strategy docs.

## Notes for internal team
- Meta Pixel setup is intentionally deferred until ad launch prep; Meta traffic can still be attributed in GA4 through UTMs and fbclid.
- App Store / Google Play clicks now emit both download_button_click and app_store_click during the migration.
- Removed docs/audits and claude.md; AGENTS.md is now the canonical agent guide.

## Changed URLs
- https://www.domani-app.com/
- https://www.domani-app.com/pricing
- https://www.domani-app.com/about
- https://www.domani-app.com/compare
- https://www.domani-app.com/faq
- https://www.domani-app.com/blog
