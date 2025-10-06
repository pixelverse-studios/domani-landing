import { Metadata } from 'next'
import { pricingMetadata } from '@/lib/seo/metadata'
import { Check } from 'lucide-react'

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
      price: '$4.99',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Start Free, Upgrade When Ready
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            No credit card required. Cancel anytime. 80% cheaper than Sunsama.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {' '}
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">Can I switch plans later?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can upgrade or downgrade at any time. Changes take effect at the
                start of your next billing cycle.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and Apple Pay.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-2">Is there a free trial for Premium?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Premium includes a 7-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-16 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            All plans include SSL encryption, GDPR compliance, and data export
          </p>
        </div>
      </div>
    </div>
  )
}
