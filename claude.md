# Domani Landing Page - Development Guide for Claude Code

## Project Overview
Domani's landing page is a high-converting marketing site that showcases the evening planning productivity concept. Built with Next.js 14, it focuses on emotional storytelling, social proof, and clear value proposition to drive conversions to free tier signups.

## Audit Trail Requirements
**IMPORTANT: Create an audit file after EVERY prompt**

After completing any task or answering any prompt, create an audit file with the following:

### File Naming Convention:
```
audits/landing/YYYY-MM-DD-HH-MM-SS-[brief-description].md
```
Example: `audits/landing/2025-01-15-14-30-45-hero-section.md`

### Audit File Template:
```markdown
# Audit Log - Landing Page - [Date Time]

## Prompt Summary
[Summarize what the user asked for]

## Actions Taken
1. [List each action performed]
2. [Include files created/modified]
3. [Note any decisions made]

## Files Changed
- `apps/landing/path/to/file1.tsx` - [Brief description of changes]
- `apps/landing/path/to/file2.ts` - [Brief description of changes]

## Components/Features Affected
- [Component/Feature name]
- [Related dependencies]

## Testing Considerations
- [What should be tested]
- [Potential edge cases]
- [Device/browser testing needs]

## Performance Impact
- [Bundle size changes]
- [Loading time considerations]
- [SEO implications]

## Next Steps
- [Suggested follow-up tasks]
- [A/B testing opportunities]

## Notes
[Any additional context, warnings, or important information]

## Timestamp
Created: YYYY-MM-DD HH:MM:SS
Page Section: [hero/features/pricing/etc]
```

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Animations
- **CMS**: Local MDX for blog (future: Contentful)
- **Analytics**: PostHog + Google Analytics
- **Forms**: React Hook Form + Zod
- **Database**: Supabase (waitlist + early access)
- **Email**: Resend (transactional) + ConvertKit (marketing)
- **Hosting**: Vercel
- **Animations**: Framer Motion + CSS
- **Icons**: Lucide React
- **SEO**: Next.js Metadata API

## Project Structure
```
apps/landing/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── pricing/page.tsx      # Pricing page
│   │   │   ├── about/page.tsx        # About/story page
│   │   │   ├── blog/                 # Blog section
│   │   │   └── legal/                # Privacy, terms
│   │   ├── api/
│   │   │   ├── waitlist/             # Waitlist endpoints
│   │   │   ├── early-access/         # Early access
│   │   │   └── newsletter/           # Newsletter signup
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── metadata.ts
│   ├── components/
│   │   ├── sections/                 # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Problem.tsx
│   │   │   ├── Solution.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   ├── ui/                       # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── AnimatedSection.tsx
│   │   ├── forms/                    # Form components
│   │   │   ├── WaitlistForm.tsx
│   │   │   ├── NewsletterForm.tsx
│   │   │   └── EarlyAccessForm.tsx
│   │   └── navigation/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── animations/               # Animation configs
│   │   ├── analytics/                # Tracking events
│   │   ├── api/                      # API helpers
│   │   └── utils/                    # Utilities
│   ├── content/                      # MDX content
│   │   ├── blog/
│   │   └── testimonials/
│   └── public/
│       ├── images/
│       ├── animations/               # Lottie/Rive files
│       └── og/                       # Open Graph images
├── audits/landing/                   # Landing-specific audits
└── tests/
```

## Core Messaging & Copy

### Value Proposition
```typescript
const CORE_MESSAGE = {
  headline: "Plan Tomorrow Tonight, Wake Up Ready to Execute",
  subheadline: "The evening planning app that transforms overwhelming mornings into focused execution",
  
  problem: "You wake up stressed, scrambling to figure out what's important",
  solution: "Plan when calm, execute when it counts",
  
  benefits: [
    "Start each day with crystal clarity",
    "Reduce morning decision fatigue",
    "Focus on what truly matters",
    "Build momentum from minute one"
  ]
};
```

### Target Audience Personas
```typescript
interface Persona {
  name: string;
  role: string;
  painPoints: string[];
  desiredOutcome: string;
  objections: string[];
}

const PERSONAS: Persona[] = [
  {
    name: "Busy Professional",
    role: "Manager, Consultant, Executive",
    painPoints: [
      "Overwhelming morning inbox",
      "Too many priorities",
      "Reactive instead of proactive"
    ],
    desiredOutcome: "Control over their day",
    objections: ["Another app?", "Will I stick to it?"]
  },
  {
    name: "Creative Entrepreneur",
    role: "Founder, Freelancer, Creator",
    painPoints: [
      "Scattered focus",
      "Procrastination",
      "No clear priorities"
    ],
    desiredOutcome: "Consistent progress",
    objections: ["Too rigid?", "Limits creativity?"]
  }
];
```

## Component Implementation

### Hero Section
```typescript
// components/sections/Hero.tsx
interface HeroProps {
  variant?: 'default' | 'video' | 'interactive';
}

export const Hero = ({ variant = 'default' }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20" />
      
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <Badge variant="gradient" className="mb-4">
            Join 10,000+ productive professionals
          </Badge>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Plan Tomorrow Tonight
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Wake up with clarity, not chaos. The evening planning app that transforms your mornings.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="primary" className="group">
              Start Free
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo (2 min)
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="flex -space-x-4">
              {[1,2,3,4,5].map(i => (
                <Avatar key={i} className="border-2 border-white" />
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Loved by 10,000+ users
              </p>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Animated scroll indicator */}
      <ScrollIndicator />
    </section>
  );
};
```

### Problem/Solution Section
```typescript
// components/sections/Problem.tsx
export const Problem = () => {
  const problems = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Morning Brain Fog",
      description: "You waste precious mental energy deciding what to work on"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Reactive Mode",
      description: "Emails and messages hijack your priorities"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Lost Momentum",
      description: "By the time you're focused, half the morning is gone"
    }
  ];

  return (
    <Section variant="alternate">
      <div className="text-center mb-12">
        <Badge variant="destructive" className="mb-4">The Problem</Badge>
        <h2 className="text-4xl font-bold mb-4">
          Your Mornings Are Broken
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You know the feeling. The alarm goes off, and immediately you're overwhelmed.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((problem, i) => (
          <Card key={i} className="text-center p-6">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-destructive">
              {problem.icon}
            </div>
            <h3 className="font-semibold mb-2">{problem.title}</h3>
            <p className="text-muted-foreground">{problem.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
};
```

### Features Grid
```typescript
// components/sections/Features.tsx
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export const Features = () => {
  const features: Feature[] = [
    {
      icon: <Moon />,
      title: "Evening Planning Mode",
      description: "Plan when you're calm and reflective, not rushed",
      badge: "Core Feature"
    },
    {
      icon: <Star />,
      title: "MIT Focus",
      description: "Identify your Most Important Task for maximum impact",
      badge: "Productivity Boost"
    },
    {
      icon: <Lock />,
      title: "Plan Lock",
      description: "Lock your plan at night to prevent overthinking",
      badge: "Peace of Mind"
    },
    {
      icon: <Target />,
      title: "The 3-6 Rule",
      description: "Limit tasks to maintain focus and actually complete them",
      badge: "Science-Backed"
    },
    {
      icon: <Zap />,
      title: "Morning Momentum",
      description: "Wake up to a clear plan, start executing immediately",
      badge: "Time Saver"
    },
    {
      icon: <TrendingUp />,
      title: "Progress Tracking",
      description: "See your completion rates and build winning streaks",
      badge: "Motivation"
    }
  ];

  return (
    <Section>
      <SectionHeader
        badge="Features"
        title="Everything You Need to Own Your Mornings"
        subtitle="Simple by design, powerful in practice"
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </Section>
  );
};
```

### Pricing Component
```typescript
// components/sections/Pricing.tsx
interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const Pricing = () => {
  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "3 tasks per day",
        "Evening planning mode",
        "Morning execution view",
        "7-day history",
        "4 basic categories"
      ],
      cta: "Start Free"
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "/month",
      description: "For serious productivity",
      features: [
        "Everything in Free",
        "Unlimited tasks",
        "Custom categories",
        "Multi-device sync",
        "Push notifications",
        "Advanced analytics",
        "Priority support"
      ],
      cta: "Start 7-Day Trial",
      popular: true
    },
    {
      name: "Lifetime",
      price: "$99",
      description: "One-time purchase",
      features: [
        "All Premium features",
        "Forever access",
        "Future updates included",
        "Early access to new features",
        "Lifetime support"
      ],
      cta: "Buy Once, Use Forever"
    }
  ];

  return (
    <Section id="pricing" variant="subtle">
      <SectionHeader
        badge="Pricing"
        title="Start Free, Upgrade When Ready"
        subtitle="No credit card required. Cancel anytime."
      />
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier, i) => (
          <PricingCard key={i} {...tier} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          All plans include SSL encryption, GDPR compliance, and data export
        </p>
      </div>
    </Section>
  );
};
```

### Testimonials Carousel
```typescript
// components/sections/Testimonials.tsx
interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

export const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      image: "/testimonials/sarah.jpg",
      content: "Domani transformed my chaotic mornings into productive power hours. I've never been more focused.",
      rating: 5
    },
    // Add more testimonials
  ];

  return (
    <Section>
      <SectionHeader
        badge="Testimonials"
        title="Join Thousands of Productive Professionals"
        subtitle="Real results from real users"
      />
      
      <TestimonialCarousel testimonials={testimonials} />
      
      {/* Trust badges */}
      <div className="mt-12 flex justify-center items-center gap-8 opacity-60">
        <img src="/logos/producthunt.svg" alt="Product Hunt" className="h-8" />
        <img src="/logos/appstore.svg" alt="App Store" className="h-8" />
        <img src="/logos/googleplay.svg" alt="Google Play" className="h-8" />
      </div>
    </Section>
  );
};
```

## Animation Patterns

### Scroll Animations
```typescript
// hooks/useScrollAnimation.ts
export const useScrollAnimation = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return {
    ref,
    animate: isInView ? "visible" : "hidden",
    variants: {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut"
        }
      }
    }
  };
};
```

### Micro-interactions
```typescript
// components/ui/AnimatedButton.tsx
export const AnimatedButton = ({ children, ...props }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
```

### Page Transitions
```typescript
// components/layouts/PageTransition.tsx
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
```

## Form Handling

### Waitlist Form
```typescript
// components/forms/WaitlistForm.tsx
const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(2, "Name is required"),
  source: z.string().optional(),
  referrer: z.string().optional()
});

export const WaitlistForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(waitlistSchema)
  });

  const onSubmit = async (data: WaitlistData) => {
    setIsSubmitting(true);
    
    try {
      // Track conversion
      analytics.track('Waitlist Signup', {
        source: data.source || 'organic',
        referrer: data.referrer
      });
      
      // Submit to API
      await submitToWaitlist(data);
      
      // Show success state
      toast.success("You're on the list! Check your email.");
      
      // Trigger confetti
      confetti();
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('firstName')}
        placeholder="First name"
        error={errors.firstName?.message}
      />
      <Input
        {...register('email')}
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message}
      />
      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
      >
        Join Waitlist
      </Button>
    </form>
  );
};
```

## SEO & Metadata

### Metadata Configuration
```typescript
// app/metadata.ts
export const siteConfig = {
  name: "Domani",
  title: "Plan Tomorrow Tonight - Evening Planning App",
  description: "Transform chaotic mornings into focused execution with Domani's evening planning system.",
  url: "https://domani.app",
  ogImage: "https://domani.app/og-image.png",
  links: {
    twitter: "https://twitter.com/domaniapp",
    github: "https://github.com/domaniapp"
  }
};

export function generateMetadata(): Metadata {
  return {
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`
    },
    description: siteConfig.description,
    keywords: [
      "productivity app",
      "evening planning",
      "morning routine",
      "task management",
      "time management",
      "focus app"
    ],
    authors: [{ name: "Domani Team" }],
    creator: "Domani",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: "@domaniapp"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  };
}
```

### Structured Data
```typescript
// components/StructuredData.tsx
export const StructuredData = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Domani",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
```

## Analytics & Tracking

### Event Tracking
```typescript
// lib/analytics/events.ts
export const trackingEvents = {
  // Page views
  pageView: (page: string) => ({
    event: 'page_view',
    page
  }),
  
  // Conversions
  signupStarted: () => ({
    event: 'signup_started',
    timestamp: new Date().toISOString()
  }),
  
  signupCompleted: (method: 'email' | 'google' | 'apple') => ({
    event: 'signup_completed',
    method
  }),
  
  // Engagement
  videoPlayed: (videoId: string, duration: number) => ({
    event: 'video_played',
    video_id: videoId,
    duration
  }),
  
  pricingViewed: () => ({
    event: 'pricing_viewed'
  }),
  
  // Features
  featureClicked: (feature: string) => ({
    event: 'feature_clicked',
    feature
  })
};
```

### A/B Testing Setup
```typescript
// lib/experiments/index.ts
export const experiments = {
  heroHeadline: {
    id: 'hero-headline-v2',
    variants: {
      control: "Plan Tomorrow Tonight",
      variant_a: "Own Your Mornings",
      variant_b: "Wake Up With Purpose"
    }
  },
  
  ctaButton: {
    id: 'cta-button-text',
    variants: {
      control: "Start Free",
      variant_a: "Get Started Free",
      variant_b: "Try Domani Free"
    }
  }
};
```

## Performance Optimization

### Image Optimization
```typescript
// components/OptimizedImage.tsx
export const OptimizedImage = ({ src, alt, ...props }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      placeholder="blur"
      quality={85}
      {...props}
    />
  );
};
```

### Bundle Optimization
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'cdn.domani.app'],
    formats: ['image/avif', 'image/webp']
  },
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          name: 'framework',
          chunks: 'all',
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true
        },
        lib: {
          test(module) {
            return module.size() > 160000;
          },
          name(module) {
            const hash = crypto.createHash('sha1');
            hash.update(module.identifier());
            return hash.digest('hex').substring(0, 8);
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        }
      }
    };
    return config;
  }
};
```

## Testing Strategy

### Component Testing
```typescript
// __tests__/components/Hero.test.tsx
describe('Hero Section', () => {
  it('renders main headline', () => {
    render(<Hero />);
    expect(screen.getByText(/Plan Tomorrow Tonight/i)).toBeInTheDocument();
  });
  
  it('tracks CTA click', async () => {
    const trackSpy = jest.spyOn(analytics, 'track');
    render(<Hero />);
    
    const ctaButton = screen.getByRole('button', { name: /Start Free/i });
    await userEvent.click(ctaButton);
    
    expect(trackSpy).toHaveBeenCalledWith('CTA Clicked', {
      location: 'hero',
      variant: 'primary'
    });
  });
});
```

### Conversion Testing
```typescript
// __tests__/conversion/waitlist.test.tsx
describe('Waitlist Flow', () => {
  it('completes waitlist signup', async () => {
    render(<WaitlistForm />);
    
    await userEvent.type(screen.getByPlaceholderText(/First name/i), 'John');
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /Join Waitlist/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/You're on the list/i)).toBeInTheDocument();
    });
  });
});
```

## Deployment Checklist

### Pre-launch
- [ ] All tracking events implemented
- [ ] SEO metadata configured
- [ ] Open Graph images created
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Analytics connected
- [ ] Forms tested
- [ ] Mobile responsive
- [ ] Performance audit (Lighthouse 90+)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Legal pages (Privacy, Terms)
- [ ] Cookie consent
- [ ] Error pages (404, 500)
- [ ] Loading states
- [ ] SSL certificate

### Post-launch
- [ ] Monitor Core Web Vitals
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] A/B test variations
- [ ] Monitor conversion funnel
- [ ] Gather user feedback
- [ ] Iterate on messaging

## Core Principles

1. **Conversion First**: Every element should drive toward signup
2. **Story-Driven**: Lead with problem/solution narrative
3. **Social Proof**: Testimonials, numbers, badges throughout
4. **Speed Matters**: Sub-2 second load times
5. **Mobile Optimized**: 60%+ traffic is mobile
6. **SEO Foundation**: Organic traffic is sustainable growth
7. **Test Everything**: Data drives decisions
8. **Accessibility**: WCAG 2.1 AA compliance minimum
9. **Progressive Enhancement**: Core functionality works without JS
10. **Audit Everything**: Document all changes for history

## Resources & References
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [PostHog Analytics](https://posthog.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Web.dev Performance](https://web.dev/measure)
- [Schema.org](https://schema.org)

## Key Metrics to Track
- **Conversion Rate**: Visitors → Signups
- **Bounce Rate**: Keep under 40%
- **Time on Page**: Target 2+ minutes
- **Page Speed**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **SEO Rankings**: Track core keywords
- **Social Shares**: Viral coefficient
- **A/B Test Results**: Statistical significance

## Landing Page Mantras
- "Every pixel drives conversion"
- "Load fast, convert faster"
- "Story sells, features tell"
- "Mobile-first, always"
- "Test, iterate, improve"
- "Document with audit trails"