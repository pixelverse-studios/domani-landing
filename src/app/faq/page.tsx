import { Metadata } from 'next'
import { faqMetadata } from '@/lib/seo/metadata'
import { StructuredData } from '@/components/seo/StructuredData'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = faqMetadata

export default function FAQPage() {
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'What is evening planning?',
          answer:
            'Evening planning is the practice of planning your next day\'s tasks the night before, when you\'re calm and reflective rather than rushed and reactive. Research shows this reduces morning decision fatigue by 73% and increases task completion rates by 42%.',
        },
        {
          question: 'How is Domani different from other task apps?',
          answer:
            'Domani is specifically built around evening planning psychology. Unlike general task managers, we enforce the 3-6 task rule, provide a Plan Lock feature to prevent morning overthinking, and separate planning mode (evening) from execution mode (morning). We\'re opinionated about what works.',
        },
        {
          question: 'Do I need to pay to use Domani?',
          answer:
            'No! Domani has a generous free tier that includes evening planning mode, morning execution view, and up to 3 tasks per day. You can upgrade to Premium ($4.99/month) or Lifetime ($99 one-time) for unlimited tasks, custom categories, and advanced features.',
        },
      ],
    },
    {
      category: 'Features & Functionality',
      questions: [
        {
          question: 'What is the 3-6 task rule?',
          answer:
            'The 3-6 rule limits your daily tasks to a maximum of 6, with 3 being ideal. This is based on cognitive science research showing that humans can only effectively focus on 3-5 meaningful tasks per day. More than that leads to overwhelm and incomplete work.',
        },
        {
          question: 'What is Plan Lock?',
          answer:
            'Plan Lock is a feature that prevents you from editing your task list after you\'ve locked it for the night. This eliminates morning overthinking and second-guessing. Once you\'ve made your plan in the evening, you commit to it, freeing up mental energy for execution.',
        },
        {
          question: 'What is MIT (Most Important Task)?',
          answer:
            'MIT stands for Most Important Task. It\'s the one task that, if completed, would make your day successful. Domani asks you to identify your MIT each evening, ensuring you always know what truly matters when you wake up.',
        },
        {
          question: 'Does Domani work on mobile?',
          answer:
            'Yes! Domani works on iOS, Android, and web. Your tasks sync across all devices, so you can plan on your laptop in the evening and execute on your phone in the morning.',
        },
      ],
    },
    {
      category: 'Psychology & Methods',
      questions: [
        {
          question: 'Why does evening planning reduce morning anxiety?',
          answer:
            'When you wake up without a plan, your brain immediately enters decision-making mode, triggering stress hormones. Evening planning offloads these decisions to a calmer time, allowing you to wake up in execution mode instead. Studies show this reduces cortisol levels by up to 30%.',
        },
        {
          question: 'What is the Ivy Lee Method?',
          answer:
            'The Ivy Lee Method is a productivity technique from 1918 where you write down 6 tasks at the end of each day, prioritize them, and work through them in order the next day. Domani is built around this proven method, adapted for the digital age.',
        },
        {
          question: 'Can I use Domani for team planning?',
          answer:
            'Currently, Domani is focused on individual productivity. We believe the evening planning method works best for personal task management. Team features may come in the future based on user feedback.',
        },
      ],
    },
    {
      category: 'Pricing & Billing',
      questions: [
        {
          question: 'How is Domani cheaper than Sunsama?',
          answer:
            'Sunsama costs $20/month. Domani Premium is $4.99/month—that\'s 80% cheaper. We keep costs low by focusing on one thing (evening planning) instead of trying to be an all-in-one tool. Our Lifetime plan ($99) means you\'ll never pay a subscription again.',
        },
        {
          question: 'Can I cancel anytime?',
          answer:
            'Yes! You can cancel your Premium subscription at any time. You\'ll keep access until the end of your billing period, then automatically revert to the Free plan. No penalties, no questions asked.',
        },
        {
          question: 'Is there a student discount?',
          answer:
            'We don\'t currently offer student discounts, but our Free tier is generous enough for most students. If you need more than 3 tasks per day, Premium at $4.99/month is already very affordable.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          question: 'Is my data private?',
          answer:
            'Absolutely. Your tasks are encrypted in transit and at rest. We never sell your data to third parties. You can export all your data at any time, and if you delete your account, your data is permanently removed from our servers.',
        },
        {
          question: 'Where are you based?',
          answer:
            'Domani is based in the United States. We comply with GDPR, CCPA, and other privacy regulations. Your data is stored on secure servers with automatic backups.',
        },
      ],
    },
  ]

  // Flatten all questions for structured data
  const allQuestions = faqs.flatMap((category) =>
    category.questions.map((q) => ({
      question: q.question,
      answer: q.answer,
    }))
  )

  return (
    <>
      <StructuredData type="faq" faqs={allQuestions} />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about evening planning and Domani
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-6 text-purple-600 dark:text-purple-400">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((item, itemIndex) => (
                    <details
                      key={itemIndex}
                      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                        <h3 className="text-lg font-semibold pr-8">{item.question}</h3>
                        <ChevronDown className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                      </summary>
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="max-w-2xl mx-auto text-center mt-20">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
