'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface PricingPlan {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

interface PricingFaq {
  question: string
  answer: string
}

interface PricingContentProps {
  plans: PricingPlan[]
  faqs: PricingFaq[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

export function PricingContent({ plans, faqs }: PricingContentProps) {
  return (
    <div className="container mx-auto px-4 pt-8 pb-16">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center mb-16">
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
        >
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Start Free, Upgrade When Ready
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          No credit card required. Cancel anytime. 80% cheaper than Sunsama.
        </motion.p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 ${
              plan.popular ? 'ring-2 ring-purple-500 md:scale-105' : ''
            }`}
          >
            {plan.popular && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
              >
                Most Popular
              </motion.div>
            )}

            <motion.div variants={fadeInUp} className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-500 dark:text-gray-400"> {plan.period}</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
            </motion.div>

            <motion.ul variants={staggerContainer} className="space-y-3 mb-4 md:mb-6">
              {plan.features.map((feature) => (
                <motion.li
                  key={feature}
                  variants={fadeInUp}
                  className="flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA temporarily hidden */}
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.section initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <motion.div
              key={faq.question}
              variants={fadeInUp}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
            >
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trust Signals */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mt-16 text-gray-500 dark:text-gray-400"
      >
        <p className="text-sm">
          All plans include SSL encryption, GDPR compliance, and data export
        </p>
      </motion.div>
    </div>
  )
}
