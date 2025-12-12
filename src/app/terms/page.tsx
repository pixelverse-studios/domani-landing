import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Domani',
  description: 'Review the rules for using Domani’s evening planning platform, subscriptions, and content.',
}

const sections = [
  {
    title: '1. Acceptance of terms',
    body:
      'By creating an account or joining the waitlist you agree to these terms and our Privacy Policy. If you are using Domani on behalf of a company, you confirm you have authority to bind that company.',
  },
  {
    title: '2. Eligibility & accounts',
    body:
      'You must be at least 16 years old to use Domani. Accounts are created exclusively through Sign in with Apple or Sign in with Google (OAuth). We do not support email/password registration. Keep your device secure and tell us immediately if you suspect unauthorised access to your account.',
  },
  {
    title: '3. Permitted use',
    body:
      "Use Domani to plan your work and personal tasks. Don't reverse engineer, resell access, upload malware, or use the service for unlawful activity. We reserve the right to suspend accounts that violate these rules.",
  },
  {
    title: '4. Free & Premium tiers',
    body:
      'The free tier allows up to 3 tasks per day with basic features. Premium unlocks unlimited tasks, additional categories, and advanced features. Upgrade to Premium or Lifetime through the Apple App Store or Google Play Store. Subscription management and billing are handled entirely through your app store account.',
  },
  {
    title: '5. Subscriptions & billing',
    body:
      "Premium subscriptions are billed through the Apple App Store or Google Play Store, not directly by PixelVerse Studios. Free trials convert automatically unless cancelled before the trial ends via your app store settings. Lifetime purchases are non-refundable except where required by law or your app store's refund policy. For billing issues, please contact Apple or Google support.",
  },
  {
    title: '6. Plan locking',
    body:
      'Domani includes a plan locking feature that prevents editing your daily plan once locked. Locked plans cannot be modified until the next planning period. This feature is designed to encourage commitment and reduce overthinking.',
  },
  {
    title: '7. Data we collect',
    body:
      'We collect: account information (email, name) from your OAuth provider; task data (titles, descriptions, categories, completion status); device metadata when you submit feedback; and notification preferences. See our Privacy Policy for full details on data handling.',
  },
  {
    title: '8. Cancellation & deletion',
    body:
      'You can cancel subscriptions through the Apple App Store or Google Play Store at any time; access continues through the end of the paid period. Delete your account in app settings to remove stored data. Task history is retained for 30 days after deletion to allow recovery, then permanently removed.',
  },
  {
    title: '9. Intellectual property',
    body:
      'The Domani brand, product copy, and software are owned by PixelVerse Studios. You retain ownership of the tasks and content you create while using the product.',
  },
  {
    title: '10. Disclaimer & liability',
    body:
      'Domani is provided "as is." We do our best to keep the service available but disclaim warranties of uninterrupted access. To the maximum extent allowed by law, PixelVerse Studios is not liable for indirect or consequential damages.',
  },
  {
    title: '11. Governing law',
    body:
      'These terms are governed by the laws of the United States and the State of California. Disputes will be handled in California courts.',
  },
  {
    title: '12. Changes',
    body:
      'We may update these terms as the product evolves. Material changes will be announced via email or in-app notification at least 7 days before they take effect.',
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24 dark:from-dark-gradient-from dark:via-dark-gradient-via/40 dark:to-dark-gradient-to">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Terms</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Domani Terms of Service</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            The short version: plan responsibly, keep your account secure, and let us know if something feels off.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-white/60 bg-white/90 p-7 shadow-md dark:border-white/10 dark:bg-dark-card/80">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
              <p className="mt-3 text-gray-700 dark:text-gray-300">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-400">
          Latest update: December 2025. Questions? Email <a href="mailto:support@domani-app.com" className="underline">support@domani-app.com</a>.
        </p>
      </div>
    </main>
  )
}
