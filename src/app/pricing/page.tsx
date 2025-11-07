import { Metadata } from 'next'
import { pricingMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { PricingContent } from '@/components/pricing/PricingContent'
import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection'

export const metadata: Metadata = pricingMetadata

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with evening planning',
      features: [
        '3 tasks per day',
        'Evening planning mode',
        'Morning execution view',
        '7-day history',
        '4 basic categories',
        'Mobile app access',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$3.99',
      period: '/month',
      description: 'For serious productivity enthusiasts',
      features: [
        'Everything in Free',
        'Unlimited tasks',
        'Custom categories',
        'Multi-device sync',
        'Push notifications',
        'Advanced analytics',
        'Priority support',
        'Early access to new features',
      ],
      cta: 'Start 7-Day Trial',
      popular: true,
    },
    {
      name: 'Lifetime',
      price: '$99',
      period: 'one-time',
      description: 'Pay once, use forever',
      features: [
        'All Premium features',
        'Lifetime access',
        'All future updates included',
        'Early access to beta features',
        'Lifetime support',
        'Support indie development',
      ],
      cta: 'Buy Once, Use Forever',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Can I switch plans later?',
      answer:
        "Yes! You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
    },
    {
      question: 'Is there a free trial for Premium?',
      answer: 'Yes! Premium includes a 7-day free trial. No credit card required to start.',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
        <PricingContent plans={plans} faqs={faqs} />
        <TestimonialsSection
          background="transparent"
          heading="Proof it’s worth the upgrade"
          subtitle="Operators across product, revenue, and design teams rely on Domani’s evening planning ritual every night."
        />
      </main>
    </>
  )
}
