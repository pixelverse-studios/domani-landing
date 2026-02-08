'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQEntry {
  question: string
  answer: string
}

interface FAQCategory {
  category: string
  questions: FAQEntry[]
}

interface FAQAccordionProps {
  faqs: FAQCategory[]
}

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

function FAQItem({ question, answer }: FAQEntry) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400:ring-purple-500"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold pr-8">{question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out flex-shrink-0',
            isOpen && 'rotate-180 text-purple-500'
          )}
        />
      </button>
      <div
        className={cn(
          'px-6 overflow-hidden transition-all duration-300 ease-in-out text-gray-600',
          isOpen ? 'max-h-[480px] opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
        )}
      >
        <p className="leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {faqs.map((category) => (
        <motion.div
          key={category.category}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={categoryVariants}
        >
          <motion.h2
            variants={categoryVariants}
            className="text-2xl font-bold mb-6 text-purple-600"
          >
            {category.category}
          </motion.h2>
          <div className="space-y-4">
            {category.questions.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
