# Domani Landing Page - Hero Section

## Overview

A high-converting hero section for the Domani landing page, featuring evening planning psychology messaging, A/B testing capabilities, and mobile-first responsive design.

## Features Implemented

### Design
- **Split-screen asymmetric layout** with content on the left and iPhone mockup on the right
- **Evening-inspired color palette** using indigo/purple gradients
- **Mobile-first responsive design** that stacks beautifully on smaller screens
- **Animated floating elements** with performance-conscious CSS animations
- **Custom iPhone mockup** showing the dual-mode interface (evening planning + morning execution)

### Functionality
- **A/B Testing Framework**: Cookie-based variant assignment with 3 test variations
- **Waitlist Form**: Modal-based email capture with success animations
- **Social Proof Component**: Dynamic user counter with avatar stack
- **Analytics Integration**: GA4 event tracking for all interactions
- **Performance Optimized**: Lazy loading, optimized images, and critical CSS

### Components
- `HeroSection.tsx` - Main hero component with variant support
- `WaitlistForm.tsx` - Email capture modal with form handling
- `SocialProof.tsx` - Dynamic social proof with avatar stack
- `Analytics.tsx` - Google Analytics integration

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
# Clean npm cache if needed
npm cache clean --force

# Install dependencies
npm install

# If you encounter Tailwind CSS issues, install the stable version:
npm install tailwindcss@3.4.0
```

2. Set up environment variables:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX" > .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the site

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx          # Home page with A/B testing
├── components/
│   ├── HeroSection.tsx   # Main hero component
│   ├── WaitlistForm.tsx  # Email capture modal
│   ├── SocialProof.tsx   # Social proof component
│   └── Analytics.tsx     # GA4 integration
├── hooks/
│   └── useABTest.ts      # A/B testing hook
├── lib/
│   └── ab-testing.ts     # A/B test variants and logic
└── styles/
    └── globals.css       # Global styles and Tailwind
```

## A/B Testing

The hero section includes three test variants:

### Variant A (Control)
- Headline: "Plan Tomorrow Tonight, Wake Up Ready"
- CTA: "Join Waitlist"

### Variant B
- Headline: "Evening Planning, Morning Focus"
- CTA: "Get Early Access"

### Variant C
- Headline: "Calm Planning Beats Rushed Mornings"
- CTA: "Start Planning Better"

Variants are assigned randomly and persisted via cookies for 30 days.

## Analytics Events

The following events are tracked:

- `hero_cta_click` - Primary CTA button clicks
- `hero_secondary_cta_click` - Secondary CTA clicks
- `waitlist_signup` - Successful waitlist submissions
- `ab_test_assignment` - A/B test variant assignments

## Performance Optimizations

- **Mobile-first CSS** with progressive enhancement
- **Lazy loading** for below-fold content
- **Optimized fonts** with font-display: swap
- **Minimal JavaScript** bundle with code splitting
- **Image optimization** with Next.js Image component
- **Critical CSS** inlined for faster initial paint

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Customization

### Changing Colors

Edit the Tailwind config in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Update primary color shades
  },
  evening: {
    // Update evening color shades
  }
}
```

### Modifying Copy

Update the test variants in `src/lib/ab-testing.ts`:

```typescript
export const testVariants = {
  A: {
    headline: "Your new headline",
    // ...
  }
}
```

### Adding New Analytics Events

Use the `trackEvent` function in components:

```javascript
trackEvent('your_event_name', {
  category: 'engagement',
  label: 'specific_action'
})
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set environment variables on your hosting platform:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Troubleshooting

### Tailwind CSS Issues

If you encounter PostCSS plugin errors:

1. Ensure you're using Tailwind CSS v3.4.0 or compatible version
2. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

1. Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

2. Check Node.js version (should be 18+):
```bash
node --version
```

## Future Enhancements

- Add more A/B test variants
- Implement server-side variant assignment
- Add Hotjar or similar for heatmap tracking
- Create additional hero visual variations
- Add video demo option
- Implement progressive web app features

## License

Private - Domani App