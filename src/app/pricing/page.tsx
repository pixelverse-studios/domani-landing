import { Metadata } from 'next'
import { pricingMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { PricingContent } from '@/components/pricing/PricingContent'
import {
  Moon,
  Smartphone,
  BarChart3,
  Target,
  Brain,
  RefreshCw,
} from 'lucide-react'
import {
  PRICING_CONFIG,
  getCurrentPriceDisplay,
  getGeneralPriceDisplay,
  getCurrentPricingLabel,
  getDiscountPercentage,
  hasActiveDiscount,
  getTrialDurationDisplay,
} from '@/lib/config/pricing'

export const metadata: Metadata = pricingMetadata

export default function PricingPage() {
  const trialDuration = getTrialDurationDisplay()
  const discountPercent = getDiscountPercentage()

  const plan = {
    name: 'Lifetime',
    currentPrice: getCurrentPriceDisplay(),
    originalPrice: hasActiveDiscount() ? getGeneralPriceDisplay() : undefined,
    discountLabel: hasActiveDiscount() ? getCurrentPricingLabel() : undefined,
    discountPercent: hasActiveDiscount() ? discountPercent : undefined,
    period: 'one-time payment',
    description: 'Pay once, own forever. All features included.',
    trialMessage: `Start with a ${trialDuration} free trial`,
    features: [
      'Evening planning mode',
      'Morning execution view',
      'Unlimited tasks',
      'Advanced analytics',
      'Multi-device sync',
      'All future updates',
    ],
    highlightFeatures: [
      {
        icon: <Moon className="w-6 h-6" />,
        title: 'Evening Planning',
        description: 'Plan your tomorrow when you\'re calm and reflective, not rushed and stressed.',
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: 'Priority Focus',
        description: 'Mark your most important task and always know what to tackle first.',
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: 'Smart Reminders',
        description: 'Proactive nudges help you build the evening planning habit effortlessly.',
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Analytics Dashboard',
        description: 'Track completion rates, build streaks, and see your productivity patterns.',
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: 'Multi-Device Sync',
        description: 'Plan on your iPad, execute on your iPhone. Everything stays in sync.',
      },
      {
        icon: <RefreshCw className="w-6 h-6" />,
        title: 'Lifetime Updates',
        description: 'All future features and improvements included. No additional payments.',
      },
    ],
  }

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Product Manager',
      quote: 'I used to wake up anxious about my day. Now I wake up with clarity and purpose. Domani changed my mornings completely.',
      rating: 5,
    },
    {
      name: 'James K.',
      role: 'Startup Founder',
      quote: 'The evening planning concept is genius. I\'m more productive before 10am than I used to be all day.',
      rating: 5,
    },
    {
      name: 'Emily R.',
      role: 'Freelance Designer',
      quote: 'Simple, focused, and actually works. I\'ve tried dozens of task apps - this one finally stuck.',
      rating: 5,
    },
  ]

  const comparison = {
    monthlyPrice: 4.99,
    monthsToPayoff: 10,
  }

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: `You get ${PRICING_CONFIG.trial.durationDays} days of full access completely free. No credit card required to start. Try every feature and see if Domani is right for you.`,
    },
    {
      question: "What happens after my trial ends?",
      answer: "After your trial, you can unlock lifetime access with a simple one-time purchase. No subscriptions, no recurring fees—just pay once and own Domani forever.",
    },
    {
      question: 'Is this really a one-time payment?',
      answer: 'Yes! Pay once and use Domani forever. No subscriptions, no recurring fees. You also get all future updates included.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards through the App Store and Google Play.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'Refunds are handled through your app store (Apple App Store or Google Play) according to their refund policies.',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <PricingContent plan={plan} faqs={faqs} testimonials={testimonials} comparison={comparison} />
      </main>
    </>
  )
}
