import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Domani',
  description: 'Learn how Domani collects, uses, and protects your data across the web and mobile experience.',
}

const sections = [
  {
    title: 'What we collect',
    items: [
      'Account basics: name, email, and authentication details so we can create and secure your workspace.',
      'Product analytics: button clicks, feature usage, and device information to improve the experience.',
      'Payment info: processed securely by Stripe when you upgrade to Premium or Lifetime plans.',
      'Support context: messages sent to support@domani.app or in-app chat so we can resolve issues.',
    ],
  },
  {
    title: 'How we use your data',
    items: [
      'Provide and personalize the Domani planning experience.',
      'Send transactional emails (plan reminders, waitlist confirmations, billing notices).',
      'Monitor performance, detect abuse, and keep the platform reliable.',
      'Share anonymized usage metrics to understand which features help the most.',
    ],
  },
  {
    title: 'Who we share it with',
    items: [
      'Infrastructure: Supabase (authentication + database) and Vercel (hosting).',
      'Payments: Stripe handles billing details; we never store card numbers.',
      'Email + messaging: Resend and Customer.io deliver onboarding tips and support replies.',
      'Analytics: Google Analytics and privacy-first product analytics for aggregated insights.',
    ],
  },
  {
    title: 'Your controls',
    items: [
      'Export or delete your account anytime from settings or by emailing support@domani.app.',
      'Opt out of marketing messages directly in each email footer.',
      'Update consent for analytics/tracking via the SiteBehaviour banner in the footer.',
      'Residents covered by GDPR or CCPA can request access, correction, or erasure at any time.',
    ],
  },
  {
    title: 'Data retention & security',
    items: [
      'Task data lives on encrypted databases hosted in SOC 2 compliant data centers.',
      'Backups are stored for 30 days to recover from accidental deletions or outages.',
      'We retain billing records only as long as accounting regulations require.',
      'When you delete an account, associated data is purged from active systems within 30 days.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24 dark:from-dark-gradient-from dark:via-dark-gradient-via/40 dark:to-dark-gradient-to">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Privacy</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Your data stays yours</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Domani only collects the information we genuinely need to run evening planning, keep your account secure,
            and ship better features. No selling lists, no surprise sharing.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg dark:border-white/10 dark:bg-dark-card/80">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-gray-700 dark:text-gray-300">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-primary-600 to-evening-600 p-6 text-white shadow-xl">
          <h3 className="text-xl font-semibold">Need to talk to a human?</h3>
          <p className="mt-2 text-sm text-white/80">
            Email <a href="mailto:info@pixelversestudios.io" className="underline">info@pixelversestudios.io</a> or{' '}
            <Link href="/security" className="underline">learn about our security practices</Link>. We respond to privacy requests within 3 business days.
          </p>
        </div>
      </div>
    </main>
  )
}
