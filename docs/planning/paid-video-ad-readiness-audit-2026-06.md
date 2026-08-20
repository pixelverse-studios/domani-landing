# Paid Video Ad Readiness Audit

Date: 2026-06-09

Scope: Reddit, Instagram/Meta, and YouTube short-form video ads driving traffic to the Domani landing site and app-store downloads.

## Executive Summary

Domani has a solid GA4 foundation in code: page views, first/current-touch attribution, ad landing events, app-store click events, CTA events, waitlist signup events, FAQ expansion, outbound links, and Web Vitals are implemented. The site is currently configured to show download CTAs by date, because the beta window ended on 2026-04-01 and today is 2026-06-09.

The site is not fully ready for paid short-form campaigns if the goal is platform optimization and confident install attribution. The main gaps are platform pixels/conversion APIs, GA4 recommended/key event naming, ad-platform install tracking, and server-side persistence of attribution data for lead/download reporting outside GA.

## What We Should Track

### Acquisition

- Landing page visits by platform, campaign, creative, placement, and video concept.
- First-touch and current-touch attribution.
- Ad-specific landing events for Reddit, Meta/Instagram, YouTube/Google, and organic/manual social.
- Paid click IDs when available: `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, plus UTM fields.
- Platform pixel page events so ad platforms can build audiences and optimize.

### Funnel Intent

- CTA impressions by page and section.
- Header CTA clicks.
- Scroll-to-download or scroll-to-signup actions.
- App Store and Google Play clicks by CTA location and platform.
- External/contact clicks.
- FAQ expansions and pricing/compare page engagement.

### Conversions

- GA4 key event for app-store click intent.
- GA4 recommended `generate_lead` for waitlist/lead submissions.
- GA4 `sign_up` only when a real account signup happens, not a waitlist entry.
- Reddit Pixel `PageVisit` and `Lead` or equivalent event for lead/download intent.
- Meta Pixel/CAPI `PageView`, `ViewContent`, and `Lead` or app-download intent.
- Google Ads app conversions for Android/iOS installs and first opens through Google Play, Firebase/GA4, or an app attribution provider.

### App Install And Post-Install

- Android installs from Google Play.
- iOS first opens/install attribution through Firebase/GA4, SKAdNetwork/App AdAttributionKit, or an MMP.
- First open, account creation, onboarding started/completed, first plan created, first evening plan locked, and trial/lifetime purchase.
- Campaign-derived attribution attached to in-app events where privacy rules and platform APIs allow it.

### Operational Readiness

- Realtime/debug verification for all campaign UTMs before launch.
- Conversion/key-event configuration in GA4 and ad platforms.
- Privacy/consent copy aligned with advertising and analytics tools.
- Load handling for landing page, API routes, Supabase, and email sending.
- Dashboard/export view for campaign leads and store-click intent.

## Current Implementation

### Present

- `src/components/Analytics.tsx` loads GA4 when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured and valid.
- GA4 auto page views are disabled; manual `page_view` events are sent on client-side navigation.
- `src/lib/analytics/attribution.ts` captures first-touch and current-touch attribution in `localStorage`.
- UTM support includes `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `utm_id`.
- Click ID support includes `gclid`, `gbraid`, `wbraid`, `fbclid`, `ttclid`, `msclkid`, and `li_fat_id`.
- Admin, dashboard, auth, and OAuth redirect paths are excluded from marketing analytics.
- `ad_landing` fires once per ad/campaign landing page path per session.
- `DownloadButtons` fires both `download_button_click` and `app_store_click`.
- App Store and Google Play URLs are live in `src/lib/config/appStores.ts`.
- `WaitlistForm` and `WaitlistInline` fire `waitlist_signup` after successful API responses.
- `DynamicCTA` fires `cta_view`, `cta_scroll`, and `cta_conversion` in waitlist mode.
- `Header` fires `header_cta_click` and mobile menu events.
- `FAQAccordion` fires `faq_expand`.
- `WebVitals` sends Next.js Web Vitals to GA.
- `docs/technical/google-analytics-attribution.md` documents the GA4 attribution implementation and UTM conventions.

### Environment Evidence

- `.env.local` contains `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-MHXLBR73YH`, so local GA is configured.
- `.env.local.example` includes `NEXT_PUBLIC_GA_MEASUREMENT_ID=`.
- `docs/NETLIFY_ENV_SETUP.md` still lists GA as optional placeholder `G-XXXXXXXXXX`; production needs confirmation in Netlify.

## Gaps And Risks

### High Priority

- No Meta Pixel or Meta Conversions API implementation was found. Meta/Instagram campaigns will have weak platform-side optimization and retargeting.
- No Reddit Pixel or Reddit CAPI implementation was found. Reddit campaigns will not have native `PageVisit` or `Lead`/conversion signals.
- No Google Ads conversion tag, Firebase app conversion integration, or Google Play conversion setup is visible in the landing repo. YouTube app-install campaigns should not rely on landing-page store clicks alone.
- GA4 uses custom `waitlist_signup` instead of also sending the recommended `generate_lead` event. Google recommends `generate_lead` for submitted lead forms and key-event reporting.
- Waitlist API records do not persist captured UTM/click-id attribution. The client attaches attribution to GA events, but `/api/waitlist` stores only `referer`, IP, and user agent in `metadata`.
- App-store clicks are tracked as website events only. They are useful intent signals, but they are not equivalent to installs, first opens, or paying users.

### Medium Priority

- `cta_conversion` is only fired through `DynamicCTA` waitlist `onSuccess`; download-mode clicks fire `app_store_click` but not `cta_conversion`.
- `ad_landing` uses `pagePath` including full query string as the session key, which can fragment deduplication across equivalent campaign URLs with reordered or extra parameters.
- SiteBehaviour loads globally without a visible consent mode/gating implementation. This may need review before paid campaigns, especially if adding ad pixels.
- Rate limiting for `/api/waitlist` is in-memory and per runtime instance. That is acceptable for small bursts but weak under distributed or bot traffic.
- `docs/WAITLIST_SETUP.md` is stale: it describes name fields, mock mode, hourly rate limiting, and response shapes that no longer match `src/app/api/waitlist/route.ts`.
- `docs/NETLIFY_ENV_SETUP.md` contains real-looking Supabase service role and Resend credentials. That is a security risk and should be cleaned up immediately if those values are live.

### Lower Priority

- There is no explicit GTM layer. Direct GA is fine, but GTM can reduce deployment churn for paid-media tags if managed carefully.
- No campaign QA checklist exists for UTM naming, event verification, and platform-pixel diagnostics.
- No server-side event deduplication IDs exist for future browser pixel plus CAPI implementations.

## Recommended Tracking Plan

### GA4

- Keep existing manual `page_view`, attribution, `ad_landing`, and `app_store_click` events.
- Add `generate_lead` on successful waitlist submissions while keeping `waitlist_signup` for continuity.
- Mark `generate_lead`, `app_store_click`, and optionally `cta_conversion` as key events in GA4.
- Register useful custom dimensions: `ad_platform`, `ad_campaign`, `ad_content`, `cta_location`, `platform`, `store_name`, `first_source`, `current_source`.
- Link GA4 to Google Ads before YouTube spend.
- Use DebugView and Realtime to verify test campaign URLs.

### Meta / Instagram

- Add Meta Pixel base event on eligible marketing pages.
- Fire `ViewContent` or a named landing-page event on ad landing pages.
- Fire `Lead` on waitlist success and a download-intent event on App Store / Google Play click.
- Consider Meta Conversions API after browser pixel is verified, using event IDs for deduplication.

### Reddit

- Add Reddit Pixel on eligible marketing pages.
- Fire `PageVisit` on page view.
- Fire `Lead` on waitlist success.
- Fire a custom or standard conversion for store-click intent if supported by the chosen Reddit setup.
- Verify with Reddit Pixel Helper and Ads Manager event diagnostics before launch.

### YouTube / Google Ads

- For website traffic campaigns, import GA4 key events and use `generate_lead` / `app_store_click` as website conversion actions.
- For app-install campaigns, configure app conversion tracking through Google Ads with Google Play, Firebase/GA4, or a third-party app analytics provider.
- Track first open and meaningful post-install actions. Google Ads explicitly recommends tracking more than the primary goal so App campaigns have more signals.

## Campaign URL Convention

Use strict UTMs for every ad and organic test link:

```text
https://www.domani-app.com/?utm_source=reddit&utm_medium=paid_social&utm_campaign=short_video_launch_2026_06&utm_content=evening-plan-demo_v1
https://www.domani-app.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=short_video_launch_2026_06&utm_content=ig-reels_morning-chaos_v1
https://www.domani-app.com/?utm_source=youtube&utm_medium=paid_video&utm_campaign=short_video_launch_2026_06&utm_content=shorts_plan-tonight_v1
```

Recommended fields:

- `utm_source`: `reddit`, `meta`, `instagram`, `facebook`, `youtube`, `google`
- `utm_medium`: `paid_social`, `paid_video`, `organic_social`, `creator`
- `utm_campaign`: stable campaign name, such as `short_video_launch_2026_06`
- `utm_content`: creative and placement, such as `ig-reels_morning-chaos_v1`
- `utm_term`: audience, keyword, or subreddit only when useful
- `utm_id`: ad/campaign ID from the buying platform when available

## Pre-Launch Checklist

- Confirm production `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set to the real GA4 property.
- Verify GA4 Realtime for a test URL from each platform.
- Add/verify GA4 key events.
- Add Meta Pixel and verify `PageView`/`ViewContent` plus lead/download events.
- Add Reddit Pixel and verify `PageVisit` plus lead/download events.
- Link GA4 and Google Ads.
- Configure Google Ads app conversion tracking for Android and iOS.
- Confirm App Store Connect / Google Play Console reporting access.
- Persist attribution details in Supabase waitlist metadata.
- Decide whether store-click events should also fire `cta_conversion`.
- Review privacy policy and consent behavior for ad pixels.
- Remove secrets from documentation and rotate any exposed live credentials.
- Load-test or at least smoke-test `/api/waitlist` under burst traffic.
- Create a small paid test campaign before full spend and compare platform clicks, GA4 sessions, store clicks, and app-store installs.

## Suggested Implementation Sequence

1. Clean up/rotate exposed credentials in docs and confirm production env vars.
2. Add GA4 `generate_lead`, conversion/key event mapping docs, and Supabase attribution persistence.
3. Add Meta Pixel and Reddit Pixel behind explicit env vars.
4. Add event ID plumbing so CAPI can be added without duplicate conversions.
5. Configure Google Ads/Firebase/Google Play app conversion tracking outside this repo.
6. Run an end-to-end QA pass with test UTMs and platform diagnostic tools.

## Source References

- Google Analytics recommended events: https://support.google.com/analytics/answer/9267735
- Google Analytics key events tutorial: https://support.google.com/analytics/answer/12966437
- Google Ads mobile app conversion tracking: https://support.google.com/google-ads/answer/6100665
- Google Ads app conversion setup: https://support.google.com/google-ads/answer/16056245
- Google Ads conversion tracking guidance: https://support.google.com/google-ads/answer/6167168
- Reddit Ads learning hub on Reddit Pixel events: https://www.business.reddit.com/learning-hub/articles/how-reddit-ads-work-for-smbs
- Reddit Ads API conversion pixel requirement notice: https://ads-api.reddit.com/docs/v3/
