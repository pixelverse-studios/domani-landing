import type { Metadata } from 'next'
import Link from 'next/link'
import { createPageMetadata } from '@/lib/seo/metadata'
import { CONTACT_EMAIL } from '@/lib/config/site'

export const metadata: Metadata = createPageMetadata({
  title: 'Privacy Policy - How Domani Protects Your Data',
  description: 'Learn how Domani collects, uses, and protects your personal data across web, iOS, and Android. We value transparency and keep your planning data private.',
  path: '/privacy',
})

const sections = [
  {
    title: 'What we collect',
    items: [
      'Account basics: name, email, and authentication details so we can create and secure your workspace.',
      'Product and marketing analytics: page views, button clicks, waitlist signups, app store clicks, campaign parameters, referrer details, device/browser information, and performance signals.',
      'Payment info: processed securely through the App Store or Google Play when you purchase lifetime access.',
      `Support context: messages sent to ${CONTACT_EMAIL} or in-app chat so we can resolve issues.`,
    ],
  },
  {
    title: 'How we use your data',
    items: [
      'Provide and personalize the Domani planning experience.',
      'Send transactional emails (plan reminders, account notices, support updates, and billing notices).',
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
      'Analytics and advertising measurement: Google Analytics, SiteBehaviour, Meta, Reddit, Google Ads, and app-store attribution providers may receive limited event, campaign, device, and referrer data so we can measure marketing performance.',
    ],
  },
  {
    title: 'Your controls',
    items: [
      `Export or delete your account anytime from settings or by emailing ${CONTACT_EMAIL}.`,
      'Opt out of marketing messages directly in each email footer.',
      'Use browser privacy controls or ad-platform settings to limit cookies, identifiers, and personalized advertising.',
      'Marketing analytics is not loaded on admin, dashboard, authentication, or OAuth redirect pages.',
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
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Privacy</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Your data stays yours</h1>
          <p className="mt-4 text-lg text-gray-600">
            Domani only collects the information we genuinely need to run evening planning, keep your account secure,
            and ship better features. No selling lists, no surprise sharing.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-gray-700">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white shadow-xl">
          <h3 className="text-xl font-semibold">Need to talk to a human?</h3>
          <p className="mt-2 text-sm text-white/80">
            Email <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a> or{' '}
            <Link href="/security" className="underline">learn about our security practices</Link>. We respond to privacy requests within 3 business days.
          </p>
        </div>
      </div>
    </main>
  )
}
