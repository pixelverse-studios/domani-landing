# SEO Depth & Authority Action Plan

Created: 2025-10-07  
Time horizon: 2 weeks  
Goal: Expand Domani’s organic footprint by adding depth, intent coverage, and authority signals to the existing SEO foundation.

---

## 1. Content Depth & Intent Coverage

| Priority | Action | Owner | Target Date | Notes |
|----------|--------|-------|-------------|-------|
| P0 | Create **“Evening Planning Playbook”** long-form guide (2,000+ words) covering queries around “plan tomorrow tonight,” “evening planning routine,” and “decision fatigue.” | Content | Week 1, Day 4 | Anchor asset for internal links and downloadable lead magnet. |
| P0 | Add comparison landing modules: `Domani vs Sunsama`, `Domani vs Motion`, `Domani vs Todoist`. | Content | Week 1, Day 6 | Include feature matrix, pricing, schema FAQ snippet per section. |
| P1 | Expand FAQ answers to 150–200 words, weaving in long-tail phrases (e.g., “How do I stick to evening planning?”). | Content | Week 1, Day 7 | Update `/faq` JSON-LD once copy ships. |
| P1 | Launch **Blog** route with first two posts: “Evening Planning vs Morning Planning” and “How to Use the Ivy Lee Method with Domani.” | Content/Eng | Week 2, Day 4 | Reuse metadata utilities, add canonical tags, CTA banner. |
| P2 | Add testimonial carousel to About page with roles/industries and keyword-rich pull quotes. | Design | Week 2, Day 5 | Supports E-E-A-T and internal linking to case study. |

---

## 2. Authority & Trust Signals

| Priority | Action | Owner | Target Date | Notes |
|----------|--------|-------|-------------|-------|
| P0 | Publish beta-user case study page with before/after metrics and `Article` schema. | Product Marketing | Week 1, Day 5 | Link prominently from Homepage + Pricing. |
| P0 | Secure 5 backlinks from productivity newsletters/blogs (guest posts, founder interviews). | Founder | Week 2 | Target domains DR > 40; log outreach in CRM. |
| P1 | Submit Domani to curated directories (`Product Hunt Upcoming`, `BetaList`, `IndieHackers`). | Growth | Week 1 | Monitor referral traffic for conversions. |
| P1 | Add “As seen in” press bar after first 2 placements (placeholder logos initially). | Design | Week 2 | Improves trust + CRO. |
| P2 | Stand up partner/influencer landing page inviting coaches & consultants. | Growth | Week 2 | Capture long-tail “evening planning coach” queries. |

---

## 3. Technical & On-Page Enhancements

| Priority | Action | Owner | Target Date | Notes |
|----------|--------|-------|-------------|-------|
| P0 | Run Lighthouse + WebPageTest for all marketing pages; resolve LCP > 2.5s or CLS > 0.1. | Engineering | Week 1, Day 3 | Document fixes under `/docs/technical`. |
| P0 | Add contextual internal links (Pricing → FAQ, FAQ → Blog, About → Case Study). | Engineering | Week 1 | Use descriptive anchor text with keyword intent. |
| P1 | Implement breadcrumbs with `BreadcrumbList` schema on marketing pages and future blog posts. | Engineering | Week 2 | Improves sitelinks and crawl clarity. |
| P1 | Generate unique Open Graph images per page using OG guide. | Design | Week 2 | Boosts social share CTR. |
| P2 | Configure Google Search Console + Bing Webmaster; submit updated sitemap. | Ops | Week 1 | Capture baseline impressions before content launch. |

---

## 4. Measurement & Feedback Loops

- **Search Console dashboards:** Track impressions/clicks for core keywords weekly.
- **Analytics events:** Add scroll-depth + CTA click tracking on long-form blog posts.
- **Editorial calendar:** Maintain `/docs/planning/content-calendar.md` with status, target keyword, internal link checklist.
- **Weekly review (30 min):** Assess indexed page count, top queries, backlink outreach responses, next week priorities.

---

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Thin content fails to rank | High | Enforce minimum depth + keyword checklist before publishing. |
| Outreach fatigue / low replies | Medium | Use sequenced follow-ups and leverage personal founder channels. |
| Performance regressions with new assets | Medium | Run CI Lighthouse before deploy; lazy-load heavy media. |
| Resource bandwidth | Medium | Time-box work (content sprints, outreach blocks), batch similar tasks. |

---

## Immediate Next Steps

1. Kick off outline for Evening Planning Playbook and assign writing tasks.
2. Compile data for comparison sections (feature list, pricing, differentiators).
3. Build outreach target sheet (15–20 publications/influencers) and draft pitch template.
4. Schedule Lighthouse audit & capture current performance metrics.
5. Define blog route architecture (metadata, slug strategy, OG defaults) before publishing posts.

Delivering these items over the next two weeks will give Domani the depth, intent coverage, and authority signals needed to start meaningful organic growth.
