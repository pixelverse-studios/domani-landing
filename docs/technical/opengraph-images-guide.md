# OpenGraph Images Guide

## Overview

OpenGraph (OG) images are the preview images that appear when you share links on social media platforms like Twitter, LinkedIn, Facebook, and Slack. High-quality OG images can increase click-through rates by up to 40%.

## Image Specifications

### Required Dimensions
- **Width**: 1200px
- **Height**: 630px
- **Aspect Ratio**: 1.91:1
- **Format**: PNG or JPG (PNG recommended for text)
- **File Size**: < 8MB (aim for < 300KB for fast loading)

### Recommended Design Elements
- **Title**: 48-60px font size, bold
- **Subtitle/Description**: 24-32px font size
- **Brand Logo**: Top-left or bottom-right corner
- **Background**: Gradient or solid color matching brand
- **Safe Zone**: Keep important content 100px from edges (mobile crop)

## Required OpenGraph Images for Domani

### 1. Homepage (`/public/og-image.png`)
- **Title**: "Plan Tomorrow Tonight, Wake Up Ready to Execute"
- **Subtitle**: "The evening planning app that transforms chaotic mornings"
- **Style**: Gradient from purple to blue
- **Call-out**: "Join 10,000+ productive professionals"

### 2. Pricing Page (`/public/og-pricing.png`)
- **Title**: "Start Free, Upgrade When Ready"
- **Price Points**: "$0 • $4.99/mo • $99 Lifetime"
- **Highlight**: "80% cheaper than Sunsama"
- **CTA**: "No credit card required"

### 3. About Page (`/public/og-about.png`)
- **Title**: "The Science of Evening Planning"
- **Stats**: "73% reduction in morning decision fatigue"
- **Tagline**: "Built by people who get it"

### 4. FAQ Page (`/public/og-faq.png`)
- **Title**: "Everything About Evening Planning"
- **Topics**: "Methods • Features • Pricing • Privacy"
- **CTA**: "Get your questions answered"

### 5. Twitter Card (`/public/twitter-image.png`)
- **Similar to og-image.png** but optimized for Twitter's dimensions
- **Can be same as OG image** (Twitter accepts 1200x630)

## Creating OpenGraph Images

### Option 1: Design Tools (Recommended)
- **Figma**: Use the Figma template (see `docs/design/og-template.fig`)
- **Canva**: 1200x630 custom dimensions
- **Adobe Photoshop/Illustrator**: Export at 2x for retina displays

### Option 2: Dynamic Generation with Next.js
For dynamic pages (future blog posts), use Next.js OG Image Generation:

```typescript
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Blog post preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #9333ea, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 36 }}>{post.excerpt}</p>
      </div>
    ),
    {
      ...size,
    }
  )
}
```

## Design Checklist

- [ ] All images are 1200x630px
- [ ] File sizes are < 300KB
- [ ] Text is readable at thumbnail size (test at 300px width)
- [ ] Brand colors are consistent across all images
- [ ] Logo/branding is present but not overwhelming
- [ ] Important content is within safe zone (100px from edges)
- [ ] Images have been tested on Twitter, LinkedIn, and Facebook
- [ ] Alt text is descriptive in metadata

## Testing Your OG Images

### Tools
1. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Social Share Preview**: https://socialsharepreview.com/

### Test Checklist
- [ ] Image loads on Twitter
- [ ] Image loads on Facebook
- [ ] Image loads on LinkedIn
- [ ] Image loads on Slack
- [ ] Text is readable
- [ ] No important content is cropped
- [ ] File loads quickly (< 2 seconds)

## Current Status

### Created
- ✅ Metadata configuration in all pages
- ✅ OG image references in meta tags
- ✅ `/public/og-image.png` (Homepage)
- ✅ `/public/og-pricing.png` (Pricing page)
- ✅ `/public/og-about.png` (About page)
- ✅ `/public/og-faq.png` (FAQ page)
- ✅ `/public/twitter-image.png` (Twitter card)

## Quick Command Reference

### Optimize existing images
```bash
# Install imagemagick (if needed)
brew install imagemagick

# Optimize PNG
convert input.png -strip -quality 85 -resize 1200x630 output.png

# Optimize JPG
convert input.jpg -strip -quality 85 -resize 1200x630 output.jpg
```

### Check file size
```bash
ls -lh public/og-*.png
```

## Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Social Sizes](https://socialsizes.io/) - Social media image size reference

## Notes

- OpenGraph images are cached by social platforms - use their debuggers to clear cache when updating
- Twitter supports OG images but prefers `twitter:image` tags
- LinkedIn has strict requirements - test thoroughly
- Slack shows OG images in link previews automatically
