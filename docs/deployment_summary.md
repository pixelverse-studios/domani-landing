# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed waitlist unsubscribe 404 error by adding API proxy to backend server

## Notes for internal team
- Added rewrite rule in next.config.js to proxy /api/domani/* requests to backend
- Development uses localhost:5001, production uses PVS_API_URL env variable

## Changed URLs
- https://www.domani-app.com/waitlist/unsubscribe
