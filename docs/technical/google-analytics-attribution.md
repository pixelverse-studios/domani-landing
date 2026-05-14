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
- external referrer host

Attribution is stored in `localStorage` and attached to page views and key conversion events, including download button clicks.

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
