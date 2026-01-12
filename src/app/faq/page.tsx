import { Metadata } from 'next'
import { faqMetadata } from '@/lib/seo/metadata'
import { StructuredData } from '@/components/seo/StructuredData'
import Header from '@/components/Header'
import { FAQContent } from '@/components/faq/FAQContent'
import {
  PRICING_CONFIG,
  getCurrentPriceDisplay,
  getGeneralPriceDisplay,
  hasActiveDiscount,
} from '@/lib/config/pricing'

export const metadata: Metadata = faqMetadata

export default function FAQPage() {
  const trialDays = PRICING_CONFIG.trial.durationDays
  const currentPrice = getCurrentPriceDisplay()
  const fullPrice = getGeneralPriceDisplay()
  const showDiscount = hasActiveDiscount()

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
            'Domani is built around evening planning psychology, not just task management. We proactively nudge you to plan the night before with smart reminders, helping you build a sustainable habit. Unlike cluttered task managers with overwhelming features, we keep things intentionally minimal—Plan Lock prevents morning overthinking, and our clean design means zero anxiety from feature overload. Plan when calm, execute with clarity.',
        },
        {
          question: 'Do I need to pay to use Domani?',
          answer: `You can try Domani completely free for ${trialDays} days with full access to all features. After your trial, you can unlock lifetime access with a one-time payment of ${showDiscount ? `${currentPrice} (normally ${fullPrice})` : currentPrice}. No subscriptions, no recurring fees.`,
        },
      ],
    },
    {
      category: 'Features & Functionality',
      questions: [
        {
          question: 'How does Domani help me build a planning habit?',
          answer:
            'Domani proactively reminds you to plan each evening with smart, customizable notifications. Instead of leaving habit formation entirely up to you, we gently nudge you at the right time. Combined with our streak tracking and the satisfaction of waking up with a clear plan, most users find the evening planning habit sticks within the first week.',
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
          question: 'How much does Domani cost?',
          answer: `Domani offers a ${trialDays}-day free trial with full access to all features. After that, you can unlock lifetime access for ${showDiscount ? `${currentPrice} (normally ${fullPrice})` : currentPrice}. This is a one-time payment—no subscriptions, no recurring fees, and all future updates are included.`,
        },
        {
          question: 'How is Domani cheaper than Sunsama?',
          answer: `Sunsama costs $20/month ($240/year). Domani is a one-time payment of ${showDiscount ? `${currentPrice} (normally ${fullPrice})` : currentPrice}—you'll save money in the first year alone and never pay again. We keep costs low by focusing on one thing (evening planning) instead of trying to be an all-in-one tool.`,
        },
        {
          question: `What happens after my ${trialDays}-day trial?`,
          answer: `After your trial ends, you can purchase lifetime access to continue using Domani. It's a simple one-time payment with no subscriptions. No credit card is required to start your trial.`,
        },
        {
          question: 'Can I get a refund?',
          answer:
            'Refunds are handled through the App Store (Apple) or Google Play according to their refund policies. Since we offer a generous free trial, we encourage you to fully evaluate Domani before purchasing.',
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
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
        <FAQContent faqs={faqs} />
      </main>
    </>
  )
}
