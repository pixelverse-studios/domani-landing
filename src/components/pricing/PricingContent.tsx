'use client'

import { type ReactNode, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Check,
  Sparkles,
  Shield,
  RefreshCw,
  Zap,
  Star,
  ChevronDown,
  Lock,
  Quote,
} from 'lucide-react'
import DynamicCTA from '@/components/DynamicCTA'
import SocialProof from '@/components/SocialProof'

// =============================================================================
// Types
// =============================================================================

interface PricingPlan {
  name: string
  currentPrice: string
  originalPrice?: string
  discountLabel?: string
  discountPercent?: number
  period: string
  description: string
  trialMessage: string
  features: string[]
  highlightFeatures: {
    icon: ReactNode
    title: string
    description: string
  }[]
}

interface PricingFaq {
  question: string
  answer: string
}

interface Testimonial {
  name: string
  role: string
  quote: string
  rating: number
}

interface SubscriptionComparison {
  monthlyPrice: number
  monthsToPayoff: number
}

interface PricingContentProps {
  plan: PricingPlan
  faqs: PricingFaq[]
  testimonials: Testimonial[]
  comparison: SubscriptionComparison
}

// =============================================================================
// Animation Variants
// =============================================================================

const smoothEase = [0.25, 0.1, 0.25, 1] as const

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: smoothEase },
  },
}

// =============================================================================
// Utility Components
// =============================================================================

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: smoothEase,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function GlassCard({
  children,
  className = '',
  hover = true,
  highlight = false,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  highlight?: boolean
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/70[0.04]
        backdrop-blur-xl
        border ${highlight ? 'border-primary-300' : 'border-white/50[0.08]'}
        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
       [0_8px_32px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:shadow-[0_20px_48px_rgba(99,102,241,0.12)]:shadow-[0_20px_48px_rgba(99,102,241,0.15)]' : ''}
        ${hover ? 'hover:border-primary-200/50:border-primary-500/20' : ''}
        transition-shadow duration-300
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent[0.02] pointer-events-none" />
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 pointer-events-none" />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function FAQItem({ question, answer }: PricingFaq) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <GlassCard hover={false} className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
          >
            <div className="px-6 pb-5 text-gray-600">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function PricingContent({ plan, faqs, testimonials, comparison }: PricingContentProps) {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  const yearlySubscriptionCost = comparison.monthlyPrice * 12
  const savingsAfterYear = yearlySubscriptionCost - parseFloat(plan.currentPrice.replace(/[^0-9.]/g, ''))

  return (
    <div className="relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/80 via-white to-primary-100/50[#0A0A0F][#0F0F18][#0A0A0F]" />
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-300/30 to-transparent blur-[100px] animate-blob" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary-300/25 to-transparent blur-[80px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-primary-300/20 to-transparent blur-[90px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 pt-4 pb-24">
        {/* Hero Section - Side by Side Layout */}
        <motion.div
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Value Proposition */}
            <motion.div variants={fadeInUp} className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 text-primary-700 text-sm font-medium backdrop-blur-sm border border-primary-200/50 mb-6">
                <Sparkles className="w-4 h-4" />
                {plan.discountLabel || 'Lifetime Access'}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Own Your Mornings,
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 via-primary-600 to-primary-600 bg-clip-text text-transparent">
                  Forever
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                One payment. Lifetime access. No subscriptions, no recurring fees.
              </p>

              {/* Quick Benefits */}
              <div className="space-y-3 mb-8">
                {[
                  'Plan tomorrow tonight, wake up ready',
                  'Smart reminders build lasting habits',
                  'Track progress with beautiful analytics',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex justify-center lg:justify-start">
                <SocialProof />
              </div>
            </motion.div>

            {/* Right Side - Compact Pricing Card */}
            <motion.div variants={scaleIn}>
              <GlassCard hover={false} highlight className="p-6 sm:p-8">
                {/* Discount Badge */}
                {plan.discountPercent && plan.discountPercent > 0 && (
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25">
                      <Sparkles className="w-3.5 h-3.5" />
                      {plan.discountPercent}% Off
                    </span>
                  </div>
                )}

                {/* Price Display */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {plan.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">{plan.originalPrice}</span>
                    )}
                    <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {plan.currentPrice}
                    </span>
                  </div>
                  <p className="text-gray-500">{plan.period}</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {plan.features.slice(0, 6).map((feature) => (
                    <div key={feature} className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Trial Banner */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold text-sm">{plan.trialMessage}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mb-4">
                  <DynamicCTA showSubtext={false} analyticsLocation="pricing-card" size="large" />
                </div>

                {/* Trust Signals */}
                <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Secure</span>
                  </div>
                  <span>•</span>
                  <span>App Store Refunds</span>
                  <span>•</span>
                  <span>GDPR</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Subscription Comparison */}
        <AnimatedSection className="max-w-3xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Lifetime Makes Sense
            </h2>
            <p className="text-gray-600 text-lg">
              See how quickly the lifetime deal pays for itself
            </p>
          </div>

          <GlassCard hover={false} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* If Subscription */}
              <div className="text-center p-6 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  If we offered monthly
                </p>
                <p className="text-3xl font-bold text-gray-400 mb-1">
                  ${comparison.monthlyPrice.toFixed(2)}/mo
                </p>
                <p className="text-gray-500">
                  = ${yearlySubscriptionCost.toFixed(2)}/year
                </p>
              </div>

              {/* Lifetime */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
                <p className="text-sm font-medium text-primary-600 mb-2">
                  Lifetime Deal
                </p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  {plan.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">{plan.originalPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-primary-700">
                    {plan.currentPrice}
                  </span>
                </div>
                <p className="text-primary-600">one-time, forever</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-50 border border-green-200">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">
                  Pays for itself in just {comparison.monthsToPayoff} months!
                </span>
              </div>
              <p className="mt-3 text-gray-500">
                After that, it&apos;s free forever. Save ${savingsAfterYear.toFixed(2)}+ in the first year alone.
              </p>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Features Grid */}
        <AnimatedSection className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-lg">
              All features included, no upsells, no premium tiers
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {plan.highlightFeatures.map((feature, index) => (
              <motion.div key={feature.title} variants={scaleIn}>
                <GlassCard className="p-6 h-full">
                  <div className="flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4">
                      <div className="text-primary-600">{feature.icon}</div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <AnimatedSection className="max-w-5xl mx-auto mb-24">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Loved by Planners
              </h2>
              <p className="text-gray-600 text-lg">
                Join thousands who&apos;ve transformed their mornings
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="flex flex-col h-full">
                      <Quote className="w-8 h-8 text-primary-300 mb-4" />
                      <p className="text-gray-700 mb-4 flex-grow italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="mt-auto">
                        <StarRating rating={testimonial.rating} />
                        <p className="font-semibold text-gray-900 mt-2">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* FAQ Section */}
        <AnimatedSection className="max-w-3xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </AnimatedSection>

        {/* Final CTA */}
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-600/20 to-primary-500/20 blur-3xl rounded-full scale-150 -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent">
                Ready to Own Your Mornings?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                Start your free trial today. No credit card required.
              </p>
              <DynamicCTA size="large" analyticsLocation="pricing-footer" />

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>App Store Refunds</span>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white[#0A0A0F] to-transparent pointer-events-none" />
    </div>
  )
}
