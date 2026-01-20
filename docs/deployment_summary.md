# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Added waitlist unsubscribe page at /waitlist/unsubscribe for users to opt-out of waitlist emails
- Supports email pre-fill via URL query parameter for seamless unsubscribe links in emails
- Added account unsubscribe page at /account/unsubscribe for app users to disable all email notifications
- Account unsubscribe keeps user account active while stopping all email communications

## Notes for internal team
- Created src/components/UnsubscribeForm.tsx - client component with multi-step flow (input -> confirm -> success/error)
- Created src/app/waitlist/unsubscribe/page.tsx - server component page with metadata
- Form calls POST /api/domani/waitlist/unsubscribe endpoint
- Handles API responses: 200 OK, 400 Bad Request (validation), 404 Not Found (email not in list)
- Uses existing design patterns from WaitlistForm and delete-account page
- Dark mode fully supported
- Created src/components/AccountUnsubscribeForm.tsx - client component for app user email preferences
- Created src/app/account/unsubscribe/page.tsx - server component page with metadata
- Account form calls POST /api/domani/users/unsubscribe endpoint
- Page includes helpful links to delete-account and waitlist unsubscribe for users who land on wrong page

## Changed URLs
- https://www.domani-app.com/waitlist/unsubscribe
- https://www.domani-app.com/account/unsubscribe
