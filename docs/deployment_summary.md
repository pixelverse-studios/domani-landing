# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Updated "people planning smarter" count to include both waitlist signups and active users
- Count now deduplicates by email to avoid double-counting users who signed up for waitlist and later became active

## Notes for internal team
- Modified src/app/api/users/count/route.ts to query both waitlist and profiles tables
- Uses Set to deduplicate emails (case-insensitive)

## Changed URLs
- https://www.domani-app.com/
