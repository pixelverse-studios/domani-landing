# DEV-812 Support Page

## Summary

Added a public `/support` page for App Store Connect and Google Play Console support URL requirements.

## Content Decisions

- Contact path: mailto link to the existing `CONTACT_EMAIL` value in `src/lib/config/site.ts`.
- Tone: calm, direct, and support-oriented to match Domani's planning product voice.
- Refund language: directs App Store purchases to Apple's official refund guidance and Google Play purchases to Google's official refund guidance.
- Form choice: mailto link instead of a support form, keeping the page static, crawlable, and review-ready.

## Scope

- User-facing help topics for account, billing, refunds, purchases, login, notifications, task data, and app behavior.
- Response guidance and safe-request instructions.
- Internal links to FAQ, Privacy Policy, Terms of Service, Delete Account, and Security.
- Sitemap inclusion for crawlability.
- Footer link under Resources.
