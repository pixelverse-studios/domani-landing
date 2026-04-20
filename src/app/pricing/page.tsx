import { Metadata } from 'next'
import { pricingMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { PricingContent } from '@/components/pricing/PricingContent'
import { StructuredData } from '@/components/seo/StructuredData'
import {
  Moon,
  Smartphone,
  BarChart3,
  Target,
  Brain,
  RefreshCw,
} from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  getCurrentPriceDisplay,
  getGeneralPriceDisplay,
  getCurrentPricingLabel,
  getDiscountPercentage,
  hasActiveDiscount,
} from '@/lib/config/pricing'

export const metadata: Metadata = pricingMetadata

export default function PricingPage() {
  const discountPercent = getDiscountPercentage()
  const priceDisplay = hasActiveDiscount()
    ? `${getCurrentPriceDisplay()} (normally ${getGeneralPriceDisplay()})`
    : getCurrentPriceDisplay()

  const freeTier = {
    name: 'Free',
    price: '$0',
    period: 'to start',
    description:
      'A deliberately small daily plan for people who want clarity, not list sprawl.',
    features: [
      '3 intentional tasks per day',
      'Evening planning mode',
      'Morning execution view',
      '7-day history',
    ],
    footnote: 'Three tasks is a focusing tool, not a teaser limit.',
  }

  const paidPlan = {
    name: 'Lifetime',
    currentPrice: getCurrentPriceDisplay(),
    originalPrice: hasActiveDiscount() ? getGeneralPriceDisplay() : undefined,
    discountLabel: hasActiveDiscount() ? getCurrentPricingLabel() : undefined,
    discountPercent: hasActiveDiscount() ? discountPercent : undefined,
    period: 'one-time payment',
    description:
      'Expanded flexibility for deeper planning habits, with no recurring subscription.',
    features: [
      'Unlimited tasks',
      'Custom categories',
      'Unlimited history',
      'Multi-device sync',
      'Advanced analytics',
      'All future updates',
    ],
    highlightFeatures: [
      {
        icon: <Moon className="w-6 h-6" />,
        title: 'Evening Planning',
        description:
          'Keep the same calm nightly planning ritual, with more room for complex days and layered priorities.',
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: 'More Flexible Task Capacity',
        description:
          'Go beyond the focused free tier when your work, family, or project load needs more than three tasks.',
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: 'Deeper Planning History',
        description:
          'Look back on patterns, revisit past plans, and understand what helps your evenings feel lighter.',
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Analytics Dashboard',
        description:
          'Track completion trends and planning consistency without turning the app into a noisy productivity scoreboard.',
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: 'Multi-Device Sync',
        description:
          'Plan on the device that fits your evening, then wake up to the same clear view everywhere.',
      },
      {
        icon: <RefreshCw className="w-6 h-6" />,
        title: 'Lifetime Updates',
        description:
          'Pay once and keep the expanded experience as Domani evolves, without recurring subscription pressure.',
      },
    ],
  }

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Product Manager',
      quote:
        'The free tier was enough to prove the habit. Once it clicked, paying for more flexibility felt natural, not forced.',
      rating: 5,
    },
    {
      name: 'James K.',
      role: 'Startup Founder',
      quote:
        'What sold me was the philosophy: fewer tasks, better decisions, calmer mornings. The upgrade just gave me more room to use it fully.',
      rating: 5,
    },
    {
      name: 'Emily R.',
      role: 'Freelance Designer',
      quote:
        'It never felt like I was being pushed out of free. It felt like the app respected my focus first, then offered more when I needed it.',
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: 'Why does the free tier stop at 3 tasks per day?',
      answer:
        'Because Domani is designed to help you prioritize, not build a longer list. Three tasks is enough to choose what matters, commit to it at night, and wake up with a plan you can actually follow through on.',
    },
    {
      question: 'Is the free tier actually useful, or just a teaser?',
      answer:
        'It is meant to be genuinely useful. If your best days come from one meaningful priority and a couple of supporting tasks, the free tier may be all you need. It is intentionally small so the product stays clarity-first.',
    },
    {
      question: 'What changes when I upgrade?',
      answer:
        'Paid access gives you more flexibility, not a different philosophy. You keep the same evening-planning flow, but unlock more task capacity, deeper history, categories, analytics, sync, and long-term room to grow.',
    },
    {
      question: 'How should I decide whether to stay free or upgrade?',
      answer:
        'Stay free if three intentional tasks per day keeps you focused and consistent. Upgrade when your routine needs more room, more history, or more customization, not because the free tier is trying to frustrate you.',
    },
    {
      question: 'What does Lifetime access cost?',
      answer: `Lifetime access is currently ${priceDisplay}. It is a one-time purchase with no recurring subscription, and it includes future updates to the paid experience.`,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards through the App Store and Google Play.',
    },
    {
      question: 'Can I get a refund?',
      answer:
        'Refunds are handled through your app store (Apple App Store or Google Play) according to their refund policies.',
    },
  ]

  return (
    <>
      <StructuredData type="faq" faqs={faqs} />
      <Header />
      <main className="min-h-screen pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Pricing' }]} />
        </div>
        <PricingContent
          freeTier={freeTier}
          paidPlan={paidPlan}
          faqs={faqs}
          testimonials={testimonials}
        />
      </main>
    </>
  )
}
