# Meta Campaign Launch QA

This checklist is the launch guide for Domani Meta and Instagram paid campaigns.
Reddit Pixel and Google Ads/app-install conversion setup are intentionally
deferred backlog work for this launch.

## Current Scope

Active launch channel:

- Meta Ads for Facebook and Instagram placements.

Deferred channels:

- Reddit Ads and Reddit Pixel.
- Google Ads, YouTube, Google Play install attribution, Firebase, and iOS app
  attribution setup.

Required production environment variables:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=3256266928097871
```

## Canonical UTM Matrix

Use lowercase values, hyphenated campaign/content names, and no spaces.

| Field          | Required | Canonical values                                                          | Notes                                                                                                              |
| -------------- | -------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `utm_source`   | Yes      | `meta`, `facebook`, `instagram`                                           | Use `meta` for blended placements; use platform-specific source only when the campaign is isolated to one surface. |
| `utm_medium`   | Yes      | `paid_social`                                                             | Keep this stable for all Meta paid campaigns.                                                                      |
| `utm_campaign` | Yes      | `ios-android-launch`, `beta-waitlist`, `evening-planning-test`            | Match the Meta campaign name in lowercase/kebab form.                                                              |
| `utm_content`  | Yes      | `video-01-hook-clarity`, `reel-02-chaos-morning`, `story-01-evening-plan` | Use creative, hook, or placement labels that distinguish ads.                                                      |
| `utm_term`     | Optional | `busy-professionals`, `founders`, `productivity-app`                      | Use for audience, interest, or test cell when useful.                                                              |
| `utm_id`       | Optional | `meta-2026-06-001`                                                        | Use for campaign/ad set IDs when reconciling exported reports.                                                     |

## Example URLs

Blended Meta placements:

```text
https://www.domani-app.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=ios-android-launch&utm_content=video-01-hook-clarity&utm_term=busy-professionals&utm_id=meta-2026-06-001
```

Instagram-only creative:

```text
https://www.domani-app.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=ios-android-launch&utm_content=reel-02-chaos-morning&utm_term=creators&utm_id=meta-2026-06-002
```

Facebook-only creative:

```text
https://www.domani-app.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=ios-android-launch&utm_content=feed-01-evening-plan&utm_term=managers&utm_id=meta-2026-06-003
```

Internal smoke-test URL:

```text
https://www.domani-app.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=test&utm_content=test-creative
```

## Events To Verify

GA4 events:

- `page_view`: fires on eligible marketing route load/navigation.
- `ad_landing`: fires once per page path and session when the URL has UTM or
  paid click ID signals.
- `cta_conversion`: fires when App Store or Google Play buttons are clicked,
  with `cta_type=download`.
- `app_store_click`: fires on App Store and Google Play clicks.
- `download_button_click`: legacy download click event retained during the
  migration.
- `generate_lead`: fires on successful waitlist submission if the waitlist flow
  is enabled.
- `waitlist_signup`: product-specific successful waitlist event if the waitlist
  flow is enabled.

Meta events:

- `PageView`: fires on eligible marketing route load/navigation.
- `ViewContent`: fires once per page path and session when the URL has UTM or
  paid click ID signals.
- `DownloadIntent`: fires on App Store and Google Play clicks.
- `Lead`: fires on successful waitlist submission if the waitlist flow is
  enabled.

Excluded routes:

- `/admin`
- `/dashboard`
- `/auth`
- `/oauth-redirect`

## Pre-Launch Account Checks

Complete these before spending:

- PixelVerse Studios business portfolio is approved for advertising.
- Two-factor authentication is enabled for business admins.
- Trusted domains include `domani-app.com` and `www.domani-app.com`.
- Domani Website Pixel exists in Meta Events Manager.
- Pixel ID is `3256266928097871`.
- Production hosting has `NEXT_PUBLIC_META_PIXEL_ID=3256266928097871`.
- Production has been redeployed after adding the env var.
- Privacy policy describes analytics and advertising measurement providers.

## GA4 Verification

Use GA4 Realtime or DebugView.

1. Open the smoke-test URL in a clean browser session.
2. Confirm `page_view` appears with the expected page path.
3. Confirm attribution fields include the active Meta UTM values when available.
4. Confirm `ad_landing` appears once for the tested page path/session.
5. Click the App Store button.
6. Confirm `cta_conversion`, `app_store_click`, and `download_button_click`.
7. Repeat for the Google Play button.
8. Confirm `cta_conversion` uses `cta_type=download`.
9. Navigate to an excluded route such as `/admin`.
10. Confirm marketing analytics do not fire there.

## Meta Events Manager Verification

Use Meta Events Manager > Domani Website Pixel > Test events.

1. Start a test event session for `https://www.domani-app.com`.
2. Open the smoke-test URL.
3. Confirm `PageView`.
4. Confirm `ViewContent`.
5. Click the App Store button.
6. Confirm `DownloadIntent`.
7. Click the Google Play button.
8. Confirm another `DownloadIntent`.
9. Navigate to `/admin`.
10. Confirm no Meta event fires for the excluded route.

Expected Meta event parameters include, when available:

- `page_path`
- `first_source`, `first_medium`, `first_campaign`, `first_content`
- `current_source`, `current_medium`, `current_campaign`, `current_content`
- `ad_platform`
- `ad_source`
- `ad_medium`
- `ad_campaign`
- `ad_content`
- `ad_term`
- `ad_id`
- `ad_click_id`
- `cta_type`
- `cta_location`
- `platform`
- `store_name`
- `destination_url`

## Meta Custom Conversion Setup

Create one custom conversion for app-store intent:

- Source: Domani Website Pixel.
- Event: `DownloadIntent`.
- Rule: event contains `cta_type` equals `download`.
- Name: `Domani Download Intent`.
- Category: Lead or Submit application, depending on the campaign objective.

Optional diagnostic custom conversions:

- `Domani iOS Download Intent`: `DownloadIntent` where `platform` equals `ios`.
- `Domani Android Download Intent`: `DownloadIntent` where `platform` equals
  `android`.

Do not optimize on both platform-specific and combined custom conversions in the
same campaign unless the reporting goal explicitly requires split counting.

## Paid Smoke Test

Run this before normal campaign budget:

1. Create a low-budget Meta campaign or unpublished ad preview using the
   smoke-test URL.
2. Click through from Meta's preview/test flow.
3. Confirm landing page loads without redirects removing UTMs.
4. Confirm GA4 `page_view` and `ad_landing`.
5. Confirm Meta `PageView` and `ViewContent`.
6. Click both store buttons.
7. Confirm GA4 download events and Meta `DownloadIntent`.
8. Wait at least 30 minutes, then compare Meta Events Manager activity to GA4
   Realtime/DebugView observations.
9. Record any blocker before increasing spend.

## Reporting Reconciliation

Expect platform numbers not to match exactly. Use this hierarchy:

| Metric                          | Primary source                                                   | Notes                                                                                |
| ------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Meta ad clicks                  | Meta Ads Manager                                                 | Includes clicks before site load and may include repeated clicks.                    |
| GA4 sessions/users              | GA4                                                              | Lower than Meta clicks when users bounce before scripts load or tracking is blocked. |
| Meta `PageView` / `ViewContent` | Meta Events Manager                                              | Useful for pixel health and campaign diagnostics.                                    |
| Store click intent              | GA4 `cta_conversion` and Meta `DownloadIntent`                   | Treat as website conversion intent, not confirmed install.                           |
| App installs / first opens      | App Store Connect / Google Play Console / future app attribution | Not covered by this Meta launch checklist.                                           |

For this launch, optimize initial learning around `DownloadIntent` and GA4
`cta_conversion` while treating confirmed installs and first opens as external
store/app metrics.

## Launch Decision Checklist

- [ ] Production deploy includes the Meta Pixel branch.
- [ ] `NEXT_PUBLIC_META_PIXEL_ID=3256266928097871` is present in production.
- [ ] Smoke-test URL preserves all UTM parameters after page load.
- [ ] GA4 `page_view` appears.
- [ ] GA4 `ad_landing` appears once per page path/session.
- [ ] Meta `PageView` appears.
- [ ] Meta `ViewContent` appears.
- [ ] App Store click sends GA4 `cta_conversion`.
- [ ] App Store click sends Meta `DownloadIntent`.
- [ ] Google Play click sends GA4 `cta_conversion`.
- [ ] Google Play click sends Meta `DownloadIntent`.
- [ ] `/admin`, `/dashboard`, `/auth`, and `/oauth-redirect` remain excluded.
- [ ] `Domani Download Intent` custom conversion exists in Meta.
- [ ] Initial test budget is capped until the first smoke test passes.
