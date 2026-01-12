# Deployment Summary

<!-- This file is automatically sent via email on successful deployment, then reset for the next cycle -->

## Latest deploy summary
- Fixed SiteBehaviour analytics not tracking - script now loads automatically for all visitors
- Removed analytics consent banner popup

## Notes for internal team
- Simplified SiteBehaviourConsentGate component to load script directly
- Removed consent state management and localStorage checks
- Component name unchanged to avoid breaking imports

## Changed URLs
- https://www.domani-app.com/
