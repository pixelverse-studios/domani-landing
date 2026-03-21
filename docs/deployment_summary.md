# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed blog sidebar not scrolling when content exceeds viewport height
- Updated blog sidebar CTA from waitlist language to open beta messaging
- Removed redundant "Keep exploring" section from blog posts (sidebar covers related reading)
- Fixed markdown tables not rendering in blog posts (added remark-gfm)

## Notes for internal team
- FloatingSidebar.tsx: added max-height and overflow-y-auto
- Blog post page: removed "Keep exploring" section and unused BlogCard import
- next.config.js: added remark-gfm plugin for GFM table support
- 3 blog posts affected by table fix: sunsama-alternative, why-planning-at-night-is-better, evening-planning-routine

## Changed URLs
- https://www.domani-app.com/blog/sunsama-alternative
- https://www.domani-app.com/blog/why-planning-at-night-is-better
- https://www.domani-app.com/blog/evening-planning-routine
- https://www.domani-app.com/blog/decision-fatigue-app
- https://www.domani-app.com/blog/overwhelmed-every-morning
