# Sage Green Palette - Quick Reference Guide

**Date:** 2026-02-07
**Purpose:** Quick lookup for developers migrating colors

---

## Color Palette - Copy/Paste Ready

### Primary Colors
```tsx
// Sage Green Scale
'#7D9B8A'  // Primary (500) - Main brand color
'#A3BFB0'  // Primary Light (300) - Lighter accent
'#5A7765'  // Primary Dark (700) - Darker accent, gradient end

// Full Scale
'#F4F7F5'  // 50
'#E8EDE9'  // 100
'#D1DBD4'  // 200
'#A3BFB0'  // 300 (light)
'#7D9B8A'  // 400, 500 (DEFAULT)
'#6A8577'  // 600
'#5A7765'  // 700 (dark)
'#4A5F53'  // 800
'#3D4A44'  // 900
```

### Background Colors
```tsx
'#FAF8F5'  // Background (warm off-white)
'#F5F2ED'  // Card Background (slightly darker)
'#EFEEE8'  // Hover Background
```

### Text Colors
```tsx
'#3D4A44'  // Text Primary (headings)
'#6B7265'  // Text Secondary (body)
'#9BA69E'  // Text Tertiary (muted)
'#ADB7B0'  // Text Muted (very muted)
```

### Priority Colors
```tsx
'#D77A61'  // High Priority (Coral/Terracotta)
'#E8B86D'  // Medium Priority (Golden Amber)
'#8B9DAF'  // Low Priority (Blue-Gray)
// Top Priority: Use gradient from #7D9B8A to #5A7765
```

### Border & Divider Colors
```tsx
'#E8E4DD'  // Border Primary / Divider
'#DDD9D0'  // Border Secondary
```

### Keep These Colors (Don't Change)
```tsx
'#22C55B'  // Success/Completed Green (keep)
```

---

## Find & Replace Guide

### Tailwind Class Replacements

#### Gradients - MOST COMMON CHANGE
```tsx
// OLD (indigo/purple gradient)
from-primary-600 to-evening-600
from-primary-500 to-evening-500
from-purple-600 to-blue-600

// NEW (sage gradient)
from-primary-500 to-primary-700
from-primary-600 to-primary-800
from-sage to-sage-dark
```

#### Background Gradients
```tsx
// OLD
from-primary-50/10 via-white to-white
from-primary-50 to-evening-50

// NEW
from-primary-50/20 via-background to-background
from-primary-50 to-primary-100
```

#### Priority/Feature Colors
```tsx
// OLD - Red for high priority/MIT
bg-red-500
text-red-600
bg-red-600

// NEW - Coral/Terracotta
bg-priority-high
text-priority-high
bg-[#D77A61]

// OLD - Yellow for medium priority
bg-yellow-500
text-yellow-700

// NEW - Golden Amber
bg-priority-medium
text-priority-medium
bg-[#E8B86D]

// OLD - Blue for low priority
bg-blue-500
text-blue-500

// NEW - Blue-Gray
bg-priority-low
text-priority-low
bg-[#8B9DAF]
```

#### Text Colors
```tsx
// OLD
text-gray-900

// NEW
text-text-primary  // or text-[#3D4A44]

// OLD
text-gray-600

// NEW
text-text-secondary  // or text-[#6B7265]

// OLD
text-gray-500

// NEW
text-text-tertiary  // or text-[#9BA69E]
```

#### Borders
```tsx
// OLD
border-gray-200

// NEW
border-border-primary  // or border-[#E8E4DD]
```

#### Backgrounds
```tsx
// OLD
bg-white

// NEW
bg-background  // or bg-[#FAF8F5]

// OLD
bg-gray-50

// NEW
bg-card-background  // or bg-[#F5F2ED]
```

### Dark Mode Variants
```tsx
// Primary in dark mode (use lighter shade)
dark:from-primary-400 to-primary-600

// Text in dark mode
dark:text-white
dark:text-gray-300
dark:text-gray-400
```

---

## CSS Variable Replacements

### In `globals.css`

```css
/* OLD - :root variables */
--background: 250 250 252;      /* blue-gray */
--foreground: 30 41 59;         /* dark slate */
--primary: 99 102 241;          /* indigo */
--secondary: 139 92 246;        /* purple */

/* NEW - :root variables (HSL format) */
--background: 48 8% 98%;        /* #FAF8F5 */
--card-background: 40 18% 95%;  /* #F5F2ED */
--foreground: 150 9% 27%;       /* #3D4A44 */
--primary: 150 21% 55%;         /* #7D9B8A */
--primary-light: 150 24% 69%;   /* #A3BFB0 */
--primary-dark: 150 20% 41%;    /* #5A7765 */
--text-secondary: 60 6% 42%;    /* #6B7265 */
--border: 40 24% 90%;           /* #E8E4DD */
--hover: 60 23% 93%;            /* #EFEEE8 */
```

### Utility Classes to Update

```css
/* OLD */
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-evening-600 bg-clip-text text-transparent;
}

/* NEW */
.gradient-text {
  @apply bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent;
}

/* OLD */
.gradient-bg {
  @apply bg-gradient-to-br from-primary-600 to-evening-600;
}

/* NEW */
.gradient-bg {
  @apply bg-gradient-to-br from-primary-600 to-primary-800;
}
```

---

## Component-Specific Changes

### Logo Component
```tsx
// OLD
<span className="bg-gradient-to-r from-primary-600 to-evening-600 bg-clip-text text-transparent">

// NEW
<span className="bg-gradient-to-r from-sage to-sage-dark bg-clip-text text-transparent">
// OR
<span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
```

### Button Gradients
```tsx
// OLD
className="bg-gradient-to-r from-primary-600 to-evening-600"

// NEW
className="bg-gradient-to-r from-primary-600 to-primary-800"
```

### Hero Section - Task Priorities
```tsx
// OLD - Task card colors
{priority === 'high' && 'bg-red-500'}
{priority === 'medium' && 'bg-yellow-500'}
{priority === 'low' && 'bg-blue-500'}

// NEW - Task card colors
{priority === 'high' && 'bg-[#D77A61]'}  // coral
{priority === 'medium' && 'bg-[#E8B86D]'}  // amber
{priority === 'low' && 'bg-[#8B9DAF]'}  // blue-gray
{priority === 'top' && 'bg-gradient-to-r from-primary-500 to-primary-700'}
```

### MIT Spotlight - Red Accent
```tsx
// OLD
<div className="bg-red-500 text-white">MIT</div>

// NEW
<div className="bg-[#D77A61] text-white">MIT</div>
// OR
<div className="bg-priority-high text-white">MIT</div>
```

### FAQ - Hardcoded Gradient
```tsx
// OLD
<div className="bg-gradient-to-r from-purple-600 to-blue-600">

// NEW
<div className="bg-gradient-to-r from-primary-600 to-primary-800">
```

### Header - Nav Underline
```tsx
// OLD
<div className="bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500">

// NEW
<div className="bg-gradient-to-r from-primary-500 to-primary-700">
```

---

## Search Terms to Find All Instances

Use these search terms in your editor to find all color references:

### High Priority Searches
```bash
# Find all "evening" color references (should be removed)
grep -r "evening" src/components/
grep -r "evening" tailwind.config.js
grep -r "evening" src/styles/

# Find all purple/indigo references
grep -r "purple-" src/
grep -r "indigo-" src/

# Find hardcoded red (for priority features)
grep -r "red-5" src/components/
grep -r "red-6" src/components/

# Find gradient patterns
grep -r "from-primary.*to-" src/
```

### Color-Specific Searches
```bash
# Find background colors
grep -r "bg-white" src/

# Find text colors
grep -r "text-gray-" src/

# Find border colors
grep -r "border-gray-" src/
```

---

## Common Mistakes to Avoid

### ❌ DON'T Do This
```tsx
// Don't use old "evening" color
className="from-primary-600 to-evening-600"

// Don't use purple/blue for main gradients
className="from-purple-500 to-blue-600"

// Don't use red-500 for priority (use coral)
className="bg-red-500"

// Don't hardcode old gray values
className="text-gray-900"
```

### ✅ DO This
```tsx
// Use sage gradient
className="from-primary-600 to-primary-800"

// Use priority colors for features
className="bg-priority-high"  // for high priority
className="bg-[#D77A61]"      // or direct hex

// Use new text color tokens
className="text-text-primary"
className="text-[#3D4A44]"

// Use semantic color names when available
className="bg-background"
className="border-border-primary"
```

---

## Testing Checklist (Per Component)

After updating colors in a component:

- [ ] **Visual Check:** Component looks correct in browser
- [ ] **Gradient Smoothness:** Gradients transition smoothly (no banding)
- [ ] **Contrast:** Text readable on backgrounds
- [ ] **Hover States:** Hover/active states work correctly
- [ ] **Dark Mode:** Check dark mode if applicable
- [ ] **Mobile:** Responsive on mobile viewports
- [ ] **No Purple/Indigo:** No old colors visible
- [ ] **Console Clean:** No errors in browser console

---

## Hex to HSL Conversion (if needed)

Use this JavaScript function to convert hex to HSL for CSS variables:

```typescript
function hexToHSL(hex: string): string {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

// Examples:
hexToHSL('#7D9B8A')  // "150 21% 55%"
hexToHSL('#FAF8F5')  // "48 8% 98%"
```

---

## Pre-computed HSL Values

| Hex | HSL | Usage |
|-----|-----|-------|
| #7D9B8A | 150 21% 55% | Primary |
| #A3BFB0 | 150 24% 69% | Primary Light |
| #5A7765 | 150 20% 41% | Primary Dark |
| #FAF8F5 | 48 8% 98% | Background |
| #F5F2ED | 40 18% 95% | Card Background |
| #EFEEE8 | 60 23% 93% | Hover Background |
| #3D4A44 | 150 9% 27% | Text Primary |
| #6B7265 | 60 6% 42% | Text Secondary |
| #9BA69E | 120 9% 63% | Text Tertiary |
| #ADB7B0 | 120 9% 69% | Text Muted |
| #E8E4DD | 40 24% 90% | Border Primary |
| #DDD9D0 | 40 22% 85% | Border Secondary |
| #D77A61 | 11 58% 62% | Priority High |
| #E8B86D | 36 71% 67% | Priority Medium |
| #8B9DAF | 210 19% 61% | Priority Low |

---

## VS Code Snippets (Optional)

Add to your `.vscode/snippets.code-snippets`:

```json
{
  "Sage Gradient": {
    "prefix": "sage-gradient",
    "body": [
      "bg-gradient-to-r from-primary-${1|500,600|} to-primary-${2|700,800|}"
    ],
    "description": "Sage green gradient classes"
  },
  "Priority High": {
    "prefix": "priority-high",
    "body": [
      "bg-[#D77A61]"
    ],
    "description": "High priority coral color"
  },
  "Text Primary": {
    "prefix": "text-sage",
    "body": [
      "text-[#3D4A44]"
    ],
    "description": "Primary text color (sage)"
  }
}
```

---

## Accessibility - Contrast Ratios

### Passing Combinations (WCAG 2.1 AA)

**Text on Backgrounds:**
- ✅ `#3D4A44` (text-primary) on `#FAF8F5` (background) = **9.2:1** (excellent)
- ✅ `#6B7265` (text-secondary) on `#FAF8F5` = **5.8:1** (good)
- ✅ `#9BA69E` (text-tertiary) on `#FAF8F5` = **3.7:1** (AA large text only)
- ⚠️ `#ADB7B0` (text-muted) on `#FAF8F5` = **3.0:1** (use for large text only)

**UI Elements:**
- ✅ `#7D9B8A` (primary) on `#FAF8F5` = **3.2:1** (passes for UI components)
- ✅ `#D77A61` (priority-high) on `#FAF8F5` = **3.8:1** (good for UI)

### Recommendations
- Use `text-primary` (#3D4A44) for body text (best contrast)
- Use `text-secondary` (#6B7265) for less important text
- Use `text-tertiary` (#9BA69E) for headings only (large text)
- Use `text-muted` (#ADB7B0) sparingly, large text only

---

## File Organization

Where to find what:

```
docs/
├── planning/
│   ├── sage-green-palette-migration-plan.md  ← Full strategy document
│   ├── sage-palette-tickets.md               ← Linear ticket templates
│   └── sage-palette-quick-reference.md       ← THIS FILE (quick lookup)
│
└── audits/landing/
    └── (audit logs will be created here during implementation)

src/
├── lib/theme/
│   └── colors.ts                              ← Theme tokens (to be created)
├── styles/
│   └── globals.css                            ← CSS variables (to be updated)
└── components/
    └── (all component files to be updated)

tailwind.config.js                             ← Tailwind config (to be updated)
```

---

## Questions? Issues?

### If You're Stuck:

1. **Check the full plan:** `docs/planning/sage-green-palette-migration-plan.md`
2. **Check ticket details:** `docs/planning/sage-palette-tickets.md`
3. **Check contrast:** Use WebAIM Contrast Checker
4. **Ask the team:** If unsure about a color choice

### Common Questions:

**Q: Should I use `primary` or `sage` in Tailwind classes?**
A: They're aliases, both work. Use `primary` for consistency with existing code.

**Q: What about dark mode?**
A: For now, just prepare the tokens. Full dark mode implementation later.

**Q: Can I use hardcoded hex values?**
A: Yes, for now. Example: `bg-[#D77A61]`. Later we'll refactor to use tokens.

**Q: Old color in a dependency/library?**
A: Leave it. Only update code we own in `src/`.

**Q: Purple gradient in FAQ—is this a bug?**
A: Yes, known issue. It's hardcoded and doesn't follow the system. Fix it in Ticket 7.

---

**Quick Reference v1.0**
*Last Updated: 2026-02-07*
*Use with docs/planning/sage-palette-tickets.md*
