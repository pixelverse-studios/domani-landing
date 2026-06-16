# Google Analytics Attribution

Domani uses GA4 through `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

This document also defines the current paid-media tracking loading standard for
Meta, Reddit, Google Ads, and app-store attribution work.

Current launch QA scope is Meta/Instagram only. See
`docs/planning/meta-campaign-launch-qa.md` for the active UTM matrix, smoke-test
procedure, and Meta Events Manager checklist. Reddit Pixel and Google Ads
app-install conversion setup remain deferred backlog work.

## Required Environment Variable

Set this in production and local environments when GA should run:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The placeholder value is ignored so local/dev builds do not send invalid analytics traffic.

For Meta Pixel browser tracking, set this only after the pixel is created in
Meta Events Manager:

```bash
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
```

The placeholder value is ignored. The value must be the numeric Meta Pixel ID.

## Source Tracking

Landing pages capture first-touch and current-touch attribution from:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `utm_id`
- paid click IDs: `gclid`, `fbclid`, `ttclid`, `li_fat_id`
- Google iOS/web-to-app click IDs: `gbraid`, `wbraid`
- Microsoft Ads click ID: `msclkid`
- external referrer host

Attribution is stored in `localStorage` and attached to page views and key conversion events.

## Tracked Events

Core acquisition and conversion events:

- `page_view`: manual GA4 page views for client-side navigation, with auto page views disabled.
- `ad_landing`: first ad/campaign landing event per page path and session.
- `app_store_click`: App Store and Google Play outbound clicks, including platform, store name, destination URL, CTA location, and attribution.
- `cta_conversion`: conversion-intent CTA interactions. Download clicks emit this with `cta_type: download`; pre-beta waitlist CTAs emit this with `cta_type: waitlist`.
- `download_button_click`: legacy App Store and Google Play click event retained during the migration to `app_store_click`.
- `generate_lead`: GA4-recommended lead event emitted after successful waitlist submissions, with the same form context and attribution as `waitlist_signup`.
- `waitlist_signup`: successful waitlist submissions, retained as Domani's product-specific waitlist event.
- `cta_view`, `cta_scroll`, and `header_cta_click`: marketing CTA exposure and intent events.

Engagement and diagnostic events:

- `external_link_click`, `email_link_click`, and `phone_link_click`: delegated outbound/contact link tracking outside app store buttons.
- `faq_expand`: FAQ question expansion.
- `ab_test_assignment`: hero experiment assignment when experiments are enabled.
- `web_vitals`: Core Web Vitals metrics reported through Next.js.

Admin, dashboard, auth, and OAuth redirect paths are excluded from marketing analytics.

## Meta Pixel Events

Meta Pixel loads through `NEXT_PUBLIC_META_PIXEL_ID` and reuses the same
marketing path exclusions as GA4. It is not loaded on admin, dashboard, auth, or
OAuth redirect routes.

Configured Meta browser events:

- `PageView`: fired manually on eligible route changes after attribution is captured.
- `ViewContent`: fired once per session and page path when the visitor lands with paid/campaign URL signals.
- `Lead`: fired after successful waitlist submissions if the dormant waitlist flow is enabled again.
- `DownloadIntent`: custom event fired once per App Store or Google Play click. Use this for Meta custom conversions tied to app-store intent.

All Meta events include the same first-touch/current-touch attribution fields
used by GA4 when available.

## Recommended GA4 Key Events

Mark these events as GA4 key events for paid campaign reporting:

- `generate_lead`: primary lead conversion for waitlist submissions.
- `cta_conversion` where `cta_type = download`: primary download-intent conversion.

Keep `waitlist_signup` available for product-specific funnel analysis, but use
`generate_lead` as the Google-recommended lead event for ad-platform reporting.
Keep `app_store_click` available for platform/store diagnostics, but do not mark
it as a key event when `cta_conversion` download events are marked as key events;
otherwise one store click will count as two conversions.

Recommended custom dimensions:

- Attribution: `first_source`, `first_medium`, `first_campaign`,
  `first_content`, `first_term`, `first_ad_id`, `first_click_id`,
  `current_source`, `current_medium`, `current_campaign`, `current_content`,
  `current_term`, `current_ad_id`, `current_click_id`, `ad_platform`,
  `ad_source`, `ad_medium`, `ad_campaign`, `ad_content`, `ad_term`, `ad_id`,
  and `ad_click_id`.
- Waitlist context: `form_variant` and `lead_source`.
- Download context: `cta_type`, `cta_location`, `platform`, `store_name`,
  `store_status`, `store_available`, and `destination_url`.

## Script Loading And Consent Decision

Current launch assumption: Domani is launching paid media primarily in the
United States. For this launch, marketing measurement scripts may load without a
separate in-app consent banner when they are documented in the privacy policy,
environment-gated where applicable, and excluded from non-marketing surfaces.

Required loading standard:

- Google Analytics loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured
  with a real `G-...` ID.
- SiteBehaviour loads only on marketing analytics paths.
- Meta Pixel loads only when `NEXT_PUBLIC_META_PIXEL_ID` is configured with a
  real numeric Pixel ID.
- Future Reddit pixels must load only when their public pixel ID
  environment variables are configured.
- Future Meta, Reddit, Google Ads, and app-store attribution integrations must
  reuse the same excluded path standard as GA4 and SiteBehaviour.
- Do not load marketing analytics on `/admin`, `/dashboard`, `/auth`, or
  `/oauth-redirect` and their child routes.
- Do not place marketing pixels in API routes, server-only admin flows, or
  authenticated dashboard surfaces.
- If Domani expands paid acquisition into regions that require prior opt-in
  consent, add a shared consent state before enabling advertising pixels there.

The privacy policy must name or describe the analytics and advertising
measurement providers currently in use or intentionally prepared for launch:
Google Analytics, SiteBehaviour, Meta, Reddit, Google Ads, and app-store
attribution providers.

## Link Conventions

Use UTMs on every paid ad and manual social push.

Examples:

```text
https://www.domani-app.com/?utm_source=instagram&utm_medium=social&utm_campaign=launch&utm_content=bio
https://www.domani-app.com/?utm_source=tiktok&utm_medium=social&utm_campaign=launch&utm_content=planner-demo
https://www.domani-app.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=ios_android_launch&utm_content=evening-planning
https://www.domani-app.com/?utm_source=google&utm_medium=paid_search&utm_campaign=planner_app&utm_term=daily%20planner%20app
```

Recommended values:

- `utm_source`: platform or partner, such as `instagram`, `tiktok`, `facebook`, `reddit`, `google`, `newsletter`
- `utm_medium`: channel type, such as `social`, `paid_social`, `paid_search`, `email`, `creator`, `referral`
- `utm_campaign`: campaign name, such as `ios_android_launch`
- `utm_content`: creative or placement, such as `bio`, `story`, `planner-demo`, `carousel-a`
- `utm_term`: keyword for paid search
