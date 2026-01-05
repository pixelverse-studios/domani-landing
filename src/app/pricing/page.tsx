import { Metadata } from 'next'
import { pricingMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { PricingContent } from '@/components/pricing/PricingContent'
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
      'Unlimited tasks per day',
      'Custom categories',
      'Unlimited task history',
      'Advanced analytics',
      'Evening planning mode',
      'Morning execution view',
      'Push notifications',
      'Multi-device sync',
      'All future updates',
      'Priority support',
    ],
    cta: 'Start 14-Day Free Trial',
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
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
        <PricingContent plan={plan} faqs={faqs} />
      </main>
    </>
  )
}
