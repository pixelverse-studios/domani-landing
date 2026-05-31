# Google Analytics Attribution

Domani uses GA4 through `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

## Required Environment Variable

Set this in production and local environments when GA should run:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The placeholder value is ignored so local/dev builds do not send invalid analytics traffic.

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
- `download_button_click`: legacy App Store and Google Play click event retained during the migration to `app_store_click`.
- `waitlist_signup`: successful waitlist submissions.
- `cta_view`, `cta_scroll`, `cta_conversion`, and `header_cta_click`: marketing CTA exposure and intent events.

Engagement and diagnostic events:

- `external_link_click`, `email_link_click`, and `phone_link_click`: delegated outbound/contact link tracking outside app store buttons.
- `faq_expand`: FAQ question expansion.
- `ab_test_assignment`: hero experiment assignment when experiments are enabled.
- `web_vitals`: Core Web Vitals metrics reported through Next.js.

Admin, dashboard, auth, and OAuth redirect paths are excluded from marketing analytics.

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
