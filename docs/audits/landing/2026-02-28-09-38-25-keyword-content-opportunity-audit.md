# Audit Log - Landing Page - 2026-02-28 09:38:25

## Prompt Summary
Comprehensive keyword and content opportunity audit for the Domani landing page. Evaluate current keyword strategy, analyze existing blog content, identify keyword gaps, propose a content calendar, and assess competitor positioning.

## Actions Taken
1. Read `src/lib/seo/keywords.ts` - current keyword strategy
2. Read `src/lib/seo/metadata.ts` - metadata usage per page
3. Read `src/lib/seo/structured-data.ts` - schema.org configuration
4. Read `src/app/blog/page.tsx` - blog index with featured clusters
5. Read `src/app/blog/[slug]/page.tsx` - dynamic blog post page
6. Read `src/lib/blog/posts.ts` - blog post registry (3 posts)
7. Read all 3 MDX blog posts in `content/blog/`
8. Read `src/app/layout.tsx` - root layout metadata
9. Read `src/app/faq/page.tsx` - FAQ page keywords
10. Reviewed all page routes for keyword coverage

## Files Reviewed
- `src/lib/seo/keywords.ts` - keyword strategy configuration
- `src/lib/seo/metadata.ts` - page-level metadata
- `src/lib/seo/structured-data.ts` - JSON-LD schemas
- `src/lib/blog/posts.ts` - blog post definitions
- `content/blog/evening-planning-routine.mdx` - blog post 1
- `content/blog/decision-fatigue-app.mdx` - blog post 2
- `content/blog/sunsama-alternative.mdx` - blog post 3
- `src/app/blog/page.tsx` - blog index
- `src/app/blog/[slug]/page.tsx` - blog post template
- `src/app/page.tsx` - homepage
- `src/app/layout.tsx` - root layout
- `src/app/faq/page.tsx` - FAQ page

---

# KEYWORD & CONTENT OPPORTUNITY AUDIT

## 1. Current Keyword Strategy Assessment

### What exists today

**keywords.ts** defines 7 keyword categories:

| Category | Count | Examples |
|----------|-------|---------|
| Brand | 3 | domani, domani app, plan tomorrow tonight |
| Primary | 6 | daily planner app, time blocking app, morning routine app, evening planning app, productivity app, task management app |
| Secondary | 8 | decision fatigue app, ivy lee method app, most important task app, daily planning routine, evening routine app, morning productivity app, focus app, habit tracking app |
| Long-tail | 8 | how to plan your day the night before, reduce morning decision fatigue, best evening planning app, evening planning routine, morning anxiety productivity |
| Problem-aware | 6 | morning decision fatigue, overwhelmed every morning, cant focus in morning, morning brain fog, reactive morning routine, chaotic morning |
| Solution-aware | 5 | evening planning benefits, plan night before, nighttime planning, evening task planning, prepare for tomorrow |
| Methodology | 5 | ivy lee method, MIT method, most important task, time blocking method, evening planning method |
| Comparison | 5 | sunsama alternative, cheap sunsama alternative, structured app alternative, todoist alternative, better than todoist |

**Page-level targeting:**

| Page | Keywords Targeted |
|------|-------------------|
| Homepage | Brand + top 3 primary + top 2 solution-aware |
| Pricing | domani pricing, daily planner app free, cheap productivity app, sunsama alternative cheaper, affordable task management |
| About | domani story, evening planning psychology, productivity app founders, why evening planning works |
| FAQ | how does evening planning work, morning routine tips, reduce decision fatigue, ivy lee method tutorial |
| Blog index | evening planning, decision fatigue, sunsama alternatives (title only) |

**Root layout meta keywords** (applied globally): daily planner app, evening planning app, morning routine app, task management, productivity app, time blocking app, decision fatigue, plan tomorrow tonight

### What exists in blog content

Only **3 blog posts** exist:

1. **evening-planning-routine** - targets: evening planning routine, plan tomorrow tonight, calm mornings
2. **decision-fatigue-app** - targets: decision fatigue app, most important task, productivity psychology
3. **sunsama-alternative** - targets: sunsama alternative, evening planning app, daily planner app

All published January 2025. No new content in over a year.

---

## 2. Keyword Gap Analysis

### CRITICAL GAP: Audience-Specific Keywords (Completely Missing)

The current strategy targets generic productivity/planner terms. There is ZERO audience segmentation. The CLAUDE.md states the target is "anyone 18+ with a busy schedule" but the keywords only speak to vague "professionals."

**Missing audience keywords (high opportunity, low competition):**

| Keyword | Monthly Search Est. | Competition | Notes |
|---------|-------------------|-------------|-------|
| planner app for teachers | Medium | Low | Teachers are heavy planner users; seasonal spikes Aug/Jan |
| planner app for nurses | Medium | Low | Shift workers need next-day planning badly |
| planner app for busy parents | Medium | Low | Emotionally resonant, underserved niche |
| planner app for students | High | Medium | Massive volume, back-to-school spikes |
| planner for shift workers | Low-Med | Very Low | Almost no competition, perfect Domani fit |
| planner app for freelancers | Medium | Low | Self-employed people lack structure |
| planner app for ADHD | High | Medium | Huge unmet need, growing search volume |
| daily planner for moms | Medium | Low | Highly specific, high intent |
| planner app for college students | Medium | Low | Subset of student search |
| planner for remote workers | Medium | Medium | Post-COVID persistent demand |

### GAP: Emotional/Problem-Aware Keywords (Partially Covered, Major Expansion Needed)

Currently only 6 problem-aware keywords exist, all morning-focused. The emotional search space is much wider.

**Missing problem keywords:**

| Keyword | Category | Notes |
|---------|----------|-------|
| morning anxiety before work | Emotional | People search this; leads to evening planning solution |
| sunday scaries | Emotional/Cultural | Massive search volume, seasonal but persistent |
| overwhelmed with tasks | Problem | Generic but huge volume |
| can't sleep thinking about tomorrow | Problem | Direct path to evening planning |
| too many things to do | Problem | Very common search, informational |
| feeling behind at work | Problem | Professional audience crossover |
| procrastination help | Problem | Enormous search volume |
| how to stop overthinking tasks | Problem | Maps directly to Plan Lock feature |
| always running late in the morning | Problem | Lifestyle pain point |
| stressed about work tomorrow | Problem | Nighttime searcher = perfect Domani user |
| dread going to work | Emotional | Adjacent but high volume |
| how to be less reactive at work | Problem | Professional audience |
| how to stop doom scrolling at night | Problem | Evening behavior, great content angle |

### GAP: Solution-Aware Keywords (Weak Coverage)

Current solution-aware list is thin (5 terms). People actively searching for solutions need more entry points.

**Missing solution keywords:**

| Keyword | Notes |
|---------|-------|
| evening routine for productivity | How-to intent, blog-friendly |
| nightly planning habit | Direct match to Domani's core loop |
| plan your week on sunday | Weekly planning variant |
| how to start your day with focus | Morning outcome, evening cause |
| nighttime routine for adults | Broader lifestyle term with planning subset |
| wind down routine that helps productivity | Lifestyle + productivity crossover |
| how to prepare for a productive day | Very high search volume informational |
| how to plan your day effectively | Evergreen, competitive but necessary |
| best way to organize daily tasks | Generic but important for authority |

### GAP: Product/Commercial Keywords (Underdeveloped)

Current comparison keywords only target Sunsama, Todoist, and Structured. Major competitors are missing.

**Missing comparison/commercial keywords:**

| Keyword | Priority | Notes |
|---------|----------|-------|
| ticktick alternative | High | Major competitor, no content |
| notion daily planner alternative | High | Many use Notion as planner, frustrated |
| obsidian daily planner alternative | Medium | Growing segment |
| things 3 alternative | Medium | Apple ecosystem overlap |
| any.do alternative | Medium | Similar simplicity positioning |
| morning routine app alternative | Medium | Category-level comparison |
| fabulous app alternative | Medium | Morning routine app, different angle |
| routinery alternative | Low-Med | Smaller competitor |
| sunsama vs todoist | High | People search "[x] vs [y]" patterns |
| sunsama vs notion | High | Same pattern |
| best daily planner app 2026 | High | Year-qualified commercial intent |
| best simple task app | Medium | Simplicity is Domani's advantage |
| best app to plan your day | High | Very high intent |
| free daily planner app | High | Domani has a free tier |
| one time purchase planner app | Medium | Unique Domani advantage (lifetime pricing) |
| planner app no subscription | Medium | Anti-subscription sentiment is growing |

### GAP: Method/Psychology Keywords (Good Start, Needs Expansion)

Ivy Lee and MIT are covered. Several high-value methods are missing.

**Missing methodology keywords:**

| Keyword | Notes |
|---------|-------|
| eat the frog method | Very popular productivity concept, no content |
| zeigarnik effect planning | Psychology angle, authority-building |
| 1-3-5 rule productivity | Task limiting method, maps to Domani's guardrails |
| time blocking for beginners | High volume how-to |
| pomodoro method daily planning | Can pair with Domani |
| eisenhower matrix app | Prioritization method, adjacent |
| getting things done app | GTD is a huge keyword cluster |
| two minute rule productivity | David Allen method, informational |
| eat the frog app | Product-aware variant |
| deep work planning | Cal Newport audience crossover |
| maker schedule manager schedule | Paul Graham concept, resonates with target audience |

### GAP: Seasonal/Trending Keywords (Completely Missing)

No seasonal keyword strategy exists. These are predictable traffic spikes.

| Keyword | Peak Season | Notes |
|---------|-------------|-------|
| new year productivity goals | Dec-Jan | Massive spike, annual |
| back to school planner app | Jul-Aug | Student audience |
| new year planning app | Dec-Jan | Commercial intent |
| how to be more productive in 2026 | Dec-Jan | Year-specific, easy to rank |
| spring cleaning your schedule | Mar-Apr | Lifestyle angle |
| summer productivity tips | May-Jun | Seasonal content |
| monday motivation planning | Weekly recurring | Social media crossover |
| how to plan after vacation | Recurring | Return-to-work planning |

---

## 3. Content Calendar: 20 Blog Post Topics

### TIER 1: Publish First (Weeks 1-4) - Low Competition, High Impact

| # | Title | Target Keyword | Intent | Difficulty | Why First |
|---|-------|---------------|--------|------------|-----------|
| 1 | **Why Planning at Night Is Better Than Planning in the Morning** | why planning at night is better | Informational | Low | Core thesis, no existing content defends this claim with depth |
| 2 | **Planner App for Teachers: How Evening Planning Saves Your Mornings** | planner app for teachers | Commercial | Low | First audience-specific page, teachers are heavy planners |
| 3 | **How to Stop Feeling Overwhelmed Every Morning** | overwhelmed every morning | Problem-aware | Low | High emotional search volume, maps to Domani solution |
| 4 | **TickTick Alternative: Why Evening-First Planning Beats Feature Overload** | ticktick alternative | Commercial | Medium | Major competitor gap, no existing content |
| 5 | **The Eat the Frog Method: How to Use It With Evening Planning** | eat the frog method | Informational | Low-Med | High search volume method keyword, pairs with Domani |

### TIER 2: Publish Next (Weeks 5-8) - Audience Expansion + Authority

| # | Title | Target Keyword | Intent | Difficulty | Why |
|---|-------|---------------|--------|------------|-----|
| 6 | **Planner App for Busy Parents: Plan Tonight, Win Tomorrow** | planner app for busy parents | Commercial | Low | Underserved audience, emotional resonance |
| 7 | **Can't Sleep Thinking About Tomorrow? Try This 10-Minute Evening Ritual** | can't sleep thinking about tomorrow | Problem-aware | Low | Nighttime searchers are the exact Domani audience |
| 8 | **Best Daily Planner App 2026: A No-BS Comparison** | best daily planner app 2026 | Commercial | Medium | Year-qualified, high intent, needed for authority |
| 9 | **Planner App for Nurses and Shift Workers: Plan Around Any Schedule** | planner app for nurses | Commercial | Low | Unique angle, very low competition |
| 10 | **How to Plan Your Day the Night Before (Step-by-Step Guide)** | how to plan your day the night before | Informational | Medium | Already in keywords.ts but no dedicated content |

### TIER 3: Publish Weeks 9-12 - Methodology + Depth

| # | Title | Target Keyword | Intent | Difficulty | Why |
|---|-------|---------------|--------|------------|-----|
| 11 | **The Zeigarnik Effect: Why Unfinished Tasks Keep You Up at Night** | zeigarnik effect planning | Informational | Low | Science-backed authority content, unique angle |
| 12 | **Planner App for Students: Evening Planning for Better Grades** | planner app for students | Commercial | Medium | High volume, back-to-school evergreen |
| 13 | **Sunday Scaries? Here's How Evening Planning Makes Mondays Bearable** | sunday scaries productivity | Problem-aware | Low-Med | Cultural keyword, very shareable |
| 14 | **Notion Daily Planner Alternative: When You Need Less, Not More** | notion daily planner alternative | Commercial | Medium | Notion frustration is a real funnel |
| 15 | **Time Blocking for Beginners: How to Start Tonight** | time blocking for beginners | Informational | Medium | High volume how-to, already in keyword list but no content |

### TIER 4: Publish Weeks 13-16 - Long-tail + Seasonal

| # | Title | Target Keyword | Intent | Difficulty | Why |
|---|-------|---------------|--------|------------|-----|
| 16 | **Planner App for Freelancers: Structure Your Day Without a Boss** | planner app for freelancers | Commercial | Low | Self-employed audience, distinct pain points |
| 17 | **How to Stop Overthinking Your To-Do List** | how to stop overthinking tasks | Problem-aware | Low | Maps directly to Plan Lock feature |
| 18 | **No-Subscription Planner App: Why Domani Charges Once** | planner app no subscription | Commercial | Low | Unique pricing advantage, growing anti-subscription sentiment |
| 19 | **The 1-3-5 Rule for Daily Planning: Pick Less, Finish More** | 1-3-5 rule productivity | Informational | Low | Method content, maps to Domani's task guardrails |
| 20 | **Deep Work Starts the Night Before: An Evening Planning Framework** | deep work planning | Informational | Medium | Cal Newport audience crossover, high-value readers |

---

## 4. Competitor Content Counter-Programming

### What competitors blog about (and how Domani should respond)

**Sunsama** blogs about:
- Daily planning rituals, work-life balance, intentional productivity
- **Domani counter:** "Sunsama expects you to plan at 9am when you're already behind. Here's what happens when you plan at 9pm instead."

**Todoist** blogs about:
- GTD, project management, integrations, advanced features
- **Domani counter:** "You don't need 47 features. You need 3 tasks and a locked plan." Position against complexity.

**TickTick** blogs about:
- Habit tracking, Pomodoro, calendar integration, feature tutorials
- **Domani counter:** "Feature bloat causes the same decision fatigue you're trying to solve." Simplicity as the product.

**Notion/Obsidian** content:
- Templates, workflows, customization, building systems
- **Domani counter:** "You spent 3 hours building a productivity system in Notion. You could have planned tomorrow in 5 minutes." Anti-setup-time angle.

**Morning routine apps (Fabulous, Routinery):**
- Morning habits, wake-up routines, habit stacking
- **Domani counter:** "Morning routines fail because you're designing them at the worst possible time." Evening-first reframe.

### Domani's Unique Content Angles (No Competitor Can Claim)

1. **Evening-first philosophy** - No major competitor owns this positioning. Every blog post should reinforce "plan at night, execute in the morning."

2. **Anti-subscription pricing** - Lifetime purchase is a genuine differentiator. Content about "planner app no subscription" and "one time purchase planner" has almost no competition.

3. **Plan Lock as a concept** - No competitor has this feature. "Lock your plan" is a content category Domani can own entirely.

4. **Science of nighttime cognition** - Zeigarnik effect, reduced cognitive load in the evening, sleep quality and planning. This builds authority that competitors cannot replicate because their products are not designed around it.

5. **Simplicity as a feature** - Against Notion's infinite customization, Todoist's project hierarchies, and TickTick's feature sprawl, Domani can own "the planner that does less on purpose."

---

## 5. Structural Recommendations for keywords.ts

### Add these new keyword categories to `SEO_KEYWORDS`:

```typescript
// Audience-specific keywords (NEW - completely missing)
audienceSpecific: [
  'planner app for teachers',
  'planner app for nurses',
  'planner app for busy parents',
  'planner app for students',
  'planner app for freelancers',
  'planner for shift workers',
  'planner app for ADHD',
  'daily planner for moms',
  'planner for remote workers',
],

// Emotional/deeper problem keywords (NEW - expand existing)
emotionalProblem: [
  'morning anxiety before work',
  'sunday scaries',
  'cant sleep thinking about tomorrow',
  'too many things to do',
  'stressed about work tomorrow',
  'how to stop overthinking tasks',
  'always running late in the morning',
  'feeling behind at work',
],

// Expanded comparison keywords (NEW competitors)
comparisonExpanded: [
  'ticktick alternative',
  'notion daily planner alternative',
  'things 3 alternative',
  'any do alternative',
  'fabulous app alternative',
  'sunsama vs todoist',
  'best daily planner app 2026',
  'planner app no subscription',
  'one time purchase planner app',
  'free daily planner app',
],

// Expanded methodology keywords
methodologyExpanded: [
  'eat the frog method',
  'zeigarnik effect',
  '1 3 5 rule productivity',
  'time blocking for beginners',
  'deep work planning',
  'getting things done app',
],
```

### Add blog-level page keywords:

```typescript
blog: {
  index: [
    'evening planning blog',
    'productivity tips',
    'daily planning guides',
    'morning routine tips',
  ],
  // Per-post keywords should be defined in the post metadata
},
```

---

## 6. Quick Wins (Do This Week)

1. **The blog has had no new content since January 2025.** Publishing even one post per week will dramatically improve organic visibility. Start with Topic #1 (Why Planning at Night Is Better).

2. **Add audience-specific keywords to the homepage meta** - even before writing audience blog posts, adding "planner app for teachers, nurses, parents, students" to the homepage keyword list costs nothing and broadens crawl signals.

3. **Create a /blog/[audience] landing page pattern** - e.g., `/blog/planner-for-teachers` - these become evergreen landing pages that rank for audience-specific commercial keywords.

4. **Update the existing Sunsama post** to include 2026-relevant pricing comparisons and freshen the `publishedAt` date. Google rewards freshness for comparison queries.

5. **Add FAQ schema to blog posts** - each blog post could have an FAQ section at the bottom with structured data, capturing People Also Ask boxes in Google.

---

## Components/Features Affected
- `src/lib/seo/keywords.ts` - needs new keyword categories
- `src/lib/blog/posts.ts` - needs 15-20 new blog post entries
- `content/blog/` - needs new MDX files
- `src/app/blog/page.tsx` - may need new featured clusters
- `src/app/layout.tsx` - root keywords could be expanded

## Testing Considerations
- Verify new blog posts render correctly with MDX
- Check meta tags with browser dev tools after keyword updates
- Validate structured data with Google Rich Results Test
- Test blog post OG images for social sharing

## Performance Impact
- No bundle size changes from keyword/metadata updates
- Blog posts are statically generated, minimal performance cost
- More pages = larger sitemap = better crawl budget usage

## Next Steps
1. Update `keywords.ts` with new categories from this audit
2. Write and publish Topic #1 within 1 week
3. Publish 1 blog post per week minimum, following the priority tiers above
4. Create audience-specific landing page template
5. Refresh existing 3 blog posts with updated dates and expanded content
6. Set up Google Search Console tracking for new target keywords
7. Build internal linking strategy: every blog post links to 2 other blog posts + homepage CTA

## Notes
- The blog has been dormant for 13+ months. Any publishing cadence is better than none.
- Audience-specific keywords are the single biggest gap. Competitors are not targeting "planner for teachers" or "planner for nurses" either, so there is a first-mover advantage.
- The anti-subscription/lifetime pricing angle is genuinely unique and should be leveraged in at least 2-3 dedicated blog posts.
- Consider creating a "vs" page template (e.g., /compare/sunsama, /compare/todoist, /compare/ticktick) as standalone landing pages separate from blog posts. These rank extremely well for commercial comparison queries.

## Timestamp
Created: 2026-02-28 09:38:25
Page Section: SEO / Blog / Keywords (cross-cutting)
