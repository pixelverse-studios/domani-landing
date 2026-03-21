# SEO Implementation Checklist: Domani

> Progress: 27/54 Complete (50%) | Last Audit: 2026-03-21

## Technical SEO
- [x] SSL configured (Vercel HTTPS)
- [x] Mobile-friendly (responsive Tailwind)
- [x] sitemap.xml present (`src/app/sitemap.ts`)
- [x] robots.txt configured (`src/app/robots.ts`, blocks /api, /admin, GPTBot)
- [ ] Core Web Vitals audit (LCP, FID, CLS)
- [x] Structured data: Organization schema (`src/lib/seo/structured-data.ts`)
- [x] Structured data: WebSite schema
- [x] Structured data: SoftwareApplication schema
- [x] Structured data: BlogPosting schema (blog posts)
- [x] Structured data: FAQPage schema (`/faq` page)
- [x] Structured data: FAQPage schema on `/pricing` (DEV-531, 2026-03-21)
- [ ] Structured data: BreadcrumbList schema (inner pages)
- [ ] Structured data: Service schema (homepage features)
- [x] Canonical tags verified across all pages (audit 2026-03-20: confirmed)
- [ ] 404 page optimized
- [ ] Page speed optimization audit
- [x] Image optimization (next/image with AVIF/WebP, lazy loading, priority for ATF)
- [x] Font loading optimization (`font-display: swap` on Inter)
- [ ] Security headers (CSP, X-Frame-Options, HSTS) — not configured
- [ ] Crawl errors resolved (3 crawl errors in GSC as of 2026-03-20)
- [ ] Indexing issue: Only 1 page indexed in GSC out of 23+ pages — CRITICAL

## On-Page SEO
- [x] Title tags present on all pages (`src/lib/seo/metadata.ts`)
- [x] Title tags optimized (DEV-530, 2026-03-21: blog index, legal pages, FAQ all fixed)
- [x] Meta descriptions present on all pages
- [x] Meta descriptions optimized (DEV-530, 2026-03-21: all pages 120-160 chars)
- [x] H1 tags present and keyword-optimized (DEV-530, 2026-03-21: all pages verified)
- [ ] Heading hierarchy audit (H1 > H2 > H3 consistency)
- [x] Open Graph tags configured (per-page)
- [x] Twitter Card tags configured
- [x] OG images created (homepage, pricing, about, FAQ)
- [x] OG images for blog posts (DEV-393, 2026-03-21: dynamic OG image generation)
- [ ] Internal linking audit and optimization
- [ ] Image alt text audit
- [x] URL structure clean, descriptive, kebab-case (audit 2026-03-20: confirmed)

## Content SEO
- [x] Blog infrastructure set up (MDX/TypeScript)
- [x] 5 blog posts published (evening-planning-routine, decision-fatigue-app, sunsama-alternative, why-planning-at-night-is-better, overwhelmed-every-morning)
- [ ] Pillar content: "Complete Guide to Evening Planning"
- [ ] Content calendar created (4-month plan)
- [ ] 5+ supporting blog posts for evening planning cluster
- [ ] Comparison page: Domani vs Sunsama
- [ ] Comparison page: Domani vs Todoist
- [ ] "Best daily planner apps 2026" roundup post
- [ ] Ivy Lee method blog post
- [ ] Decision fatigue science blog post
- [ ] FAQ page content expansion
- [ ] Blog post interlinking strategy

## App Store Optimization (ASO)
- [x] App Store keywords defined (`src/lib/seo/keywords.ts`)
- [ ] App Store listing optimized
- [ ] Google Play listing optimized
- [ ] App Store screenshots with keyword-rich captions
- [ ] App preview video

## Off-Page SEO
- [ ] Google Business Profile (if applicable)
- [ ] Product Hunt launch planned
- [ ] Backlink outreach strategy
- [ ] Guest post targets identified
- [ ] Social media profiles linked in Organization schema
- [ ] Press/media outreach plan

## Analytics & Tracking
- [x] Google Search Console connected (confirmed: data available as of 2026-03-20)
- [x] Google Analytics organic tracking configured (confirmed: organic data available)
- [ ] Rank tracking tool set up
- [ ] Conversion tracking (organic -> download)
- [ ] Monthly SEO reporting cadence established

## Quick Wins Identified
- [ ] Claim "evening planning app" with homepage optimization
- [ ] Target "plan your day the night before" with existing blog post
- [ ] Target "Ivy Lee method app" with new blog post (zero competition)
- [ ] Target "reduce morning decision fatigue" with existing blog post
- [ ] Add BreadcrumbList schema to blog posts
- [ ] Create /compare/ pages for competitor keywords

---

> Last updated: 2026-03-21 | Next review: 2026-04-20 (30 days — score under 70)
