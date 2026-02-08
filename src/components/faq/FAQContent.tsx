'use client'

import { motion } from 'framer-motion'
import { FAQAccordion } from './FAQAccordion'

interface FAQEntry {
  question: string
  answer: string
}

interface FAQCategory {
  category: string
  questions: FAQEntry[]
}

interface FAQContentProps {
  faqs: FAQCategory[]
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

export function FAQContent({ faqs }: FAQContentProps) {
  return (
    <div className="container mx-auto px-4 pt-8 pb-16">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto text-center mb-16">
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-xl text-gray-600"
        >
          Everything you need to know about evening planning and Domani
        </motion.p>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <FAQAccordion faqs={faqs} />
      </motion.div>

      {/* CTA */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl mx-auto text-center mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </p>
          <motion.a
            href="mailto:support@domani-app.com"
            whileHover={{ scale: 1.03, boxShadow: '0 20px 45px -20px rgba(99,102,241,0.6)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Contact Support
          </motion.a>
        </div>
      </motion.div>
    </div>
  )
}
