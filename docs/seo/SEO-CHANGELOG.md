# SEO Changelog: Domani

> Track all SEO changes and their impact

## How to Use
Record every SEO change with: Date, Category, Change, Rationale, Impact

---

## 2026 Changes

### 2026-03-21 - SEO Epic Batch (DEV-528)

**Type:** Implementation Sprint
**Tickets Completed:** DEV-530, DEV-531, DEV-393, DEV-394, DEV-396, DEV-384, DEV-398, DEV-387

**Changes:**
- **Title tags & meta descriptions optimized** (DEV-530) — All pages now within SERP character limits. Blog index reduced from 71→45 chars. Legal pages expanded to 120-160 char descriptions.
- **FAQPage schema added to pricing** (DEV-531) — 5 FAQ items now have structured data markup for rich results.
- **Blog author metadata & OG images** (DEV-393) — BlogAuthor interface, category taxonomy, dynamic OpenGraph image generation for all blog posts.
- **3 blog posts refreshed** (DEV-394) — Expanded word count, added FAQ schema, updated metadata for existing posts.
- **New blog post: "Why Planning at Night Is Better"** (DEV-396) — 2,000+ words, evening planning cluster.
- **Homepage copy broadened** (DEV-384) — Replaced corporate-focused language with inclusive copy targeting all audiences.
- **New blog post: "How to Stop Feeling Overwhelmed Every Morning"** (DEV-398) — 2,000+ words targeting "overwhelmed every morning" keyword.
- **Feature spotlight H3 expansion** (DEV-387) — Added keyword-rich H3 subheadings to MIT, Plan Lock, and Smart Rollover sections.

**Checklist Impact:** 37% → 50% complete (+13%)
**Expected Impact:** Significant improvement in on-page and content scores. Blog count 3→5, all with FAQ schema and OG images. Feature sections now have 2-3x more indexable content.

---

### 2026-03-20 - First SEO Audit

**Type:** Full
**Overall Score:** 59/100 (F)

**Scores by Category:**
| Category | Score | Grade |
|----------|-------|-------|
| Technical | 71/100 | C |
| On-Page | 70/100 | C |
| Content | 31/100 | F |

**Key Findings:**
- Only 1 page indexed in Google Search Console out of 23+ pages (CRITICAL)
- 3 crawl errors in GSC
- 47 impressions, 0 clicks, 0% CTR in last 28 days
- All target keywords not ranking (NR)
- Only 3 blog posts, all 4+ months old (~500 words each)
- Pricing page has FAQ UI content but no FAQPage schema
- Blog index title too long (71 chars), legal page titles/descriptions too short
- Missing: BreadcrumbList schema, Service schema, security headers
- Strong technical foundation: robots.txt, sitemap, canonicals, 5 schema types implemented

**Issues Identified:**
- [Critical] Only 1 page indexed — investigate GSC indexing, request indexing for priority pages
- [Critical] 3 crawl errors in GSC — identify and fix
- [Critical] Content volume too low — 3 blog posts cannot compete for 40+ target keywords
- [Warning] Pricing page FAQ has no FAQPage schema (5 FAQ items unschema'd)
- [Warning] Blog index title 71 chars (truncated in SERP)
- [Warning] Legal page descriptions under 120 chars
- [Warning] No BreadcrumbList schema on any page
- [Info] Missing security headers (CSP, HSTS, X-Frame-Options)
- [Info] /alt page has no metadata

**Actions Recommended:**
- [ ] Investigate and fix 3 GSC crawl errors, request indexing for all priority pages
- [ ] Add FAQPage schema to pricing page
- [ ] Optimize title/description lengths (blog index, legal pages, about)
- [ ] Publish 2+ blog posts per month targeting evening planning cluster keywords
- [ ] Add BreadcrumbList schema to blog and inner pages
- [ ] Verify H1 tags on pricing and about pages

**Metrics Snapshot:**
- Organic sessions: 37 (GA, 30 days)
- Organic users: 34
- GSC impressions: 47 (28 days)
- GSC clicks: 0
- Avg position: 13.9
- Indexed pages: 1
- Keywords in top 10: 0
- Domain rating: Unknown (no backlink data)

**Checklist Progress:** 37% complete (+2% since initialization)

---

### 2026-03-15
**Category:** Foundation
**Change:** SEO scope initialized with full keyword research and competitive analysis
**Rationale:** Establish SEO foundation for long-term organic growth strategy
**Files Affected:** `docs/seo/` (5 documents created)
**Expected Impact:** Framework for all future SEO work; identified "evening planning" as uncontested niche
**Actual Impact:** TBD

### 2026-02-28
**Category:** Technical / On-Page
**Change:** Added OG tags and canonicals to legal pages, fixed SoftwareApplication schema, added BlogPosting JSON-LD schema
**Rationale:** SEO compliance improvements (DEV-378, DEV-379, DEV-380)
**Files Affected:** `src/lib/seo/structured-data.ts`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/security/page.tsx`, `src/app/blog/[slug]/page.tsx`
**Expected Impact:** Improved schema accuracy, blog post rich results eligibility
**Actual Impact:** TBD

---

## Milestones

| Date | Milestone | Metrics Before | Metrics After |
|------|-----------|----------------|---------------|
| 2026-03-21 | SEO Epic Sprint (DEV-528) | Checklist 37%, 3 blog posts, partial on-page | Checklist 50%, 5 blog posts, on-page optimized |
| 2026-03-15 | SEO Scope Initialized | N/A | Baseline established |
| 2026-02-28 | Schema & metadata improvements | Partial coverage | Full schema coverage for existing pages |
