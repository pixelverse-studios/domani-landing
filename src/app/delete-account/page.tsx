import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Delete Your Account | Domani',
  description: 'Learn how to delete your Domani account and what happens to your data. Google Play and App Store compliant account deletion process.',
}

const steps = [
  {
    number: '1',
    title: 'Open the Domani app',
    description: 'Launch Domani on your iPhone or Android device and make sure you\'re signed in to the account you want to delete.',
  },
  {
    number: '2',
    title: 'Go to Settings',
    description: 'Tap the gear icon in the top-right corner of the main screen to open Settings.',
  },
  {
    number: '3',
    title: 'Find the Danger Zone',
    description: 'Scroll down to the bottom of the Settings screen until you see the "Danger Zone" section.',
  },
  {
    number: '4',
    title: 'Tap "Delete Account"',
    description: 'Tap the red "Delete Account" button. You\'ll be asked to confirm your decision.',
  },
  {
    number: '5',
    title: 'Confirm deletion',
    description: 'Read the warning message carefully, then confirm to initiate the deletion process.',
  },
]

const deletedData = [
  'Your user profile and account information',
  'All tasks, plans, and daily schedules',
  'Custom categories you created',
  'Progress history and completion streaks',
  'Notification preferences and settings',
  'Any linked OAuth tokens (Apple/Google sign-in)',
]

const retainedData = [
  'Anonymized, aggregated analytics (cannot identify you)',
  'Billing records as required by law (managed by App Store/Play Store)',
]

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24 dark:from-dark-gradient-from dark:via-dark-gradient-via/40 dark:to-dark-gradient-to">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Account Management</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Delete Your Domani Account</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We&apos;re sorry to see you go. Follow the steps below to delete your account and all associated data.
          </p>
        </div>

        {/* How to Delete Section */}
        <section className="mt-12 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg dark:border-white/10 dark:bg-dark-card/80">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">How to delete your account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Account deletion is handled directly within the Domani app for your security.
          </p>
          <div className="mt-6 space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 30-Day Grace Period */}
        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/80 p-8 shadow-lg dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">30-Day Grace Period</h2>
              <p className="mt-2 text-amber-800 dark:text-amber-200">
                After you request deletion, your account enters a 30-day grace period. During this time:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-800 dark:text-amber-200">
                <li>Your account is immediately deactivated and you&apos;ll be signed out</li>
                <li>You won&apos;t be able to log in or access your data</li>
                <li>If you change your mind, contact us within 30 days to restore your account</li>
                <li>After 30 days, all data is permanently and irreversibly deleted</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What Gets Deleted */}
        <section className="mt-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg dark:border-white/10 dark:bg-dark-card/80">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">What gets deleted</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The following data will be permanently removed from our systems:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            {deletedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* What We Retain */}
        <section className="mt-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg dark:border-white/10 dark:bg-dark-card/80">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">What we retain</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            For legal and operational reasons, we may retain:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            {retainedData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            None of this retained data can be used to identify you or your account.
          </p>
        </section>

        {/* Can't Access Your Account */}
        <section className="mt-8 rounded-3xl bg-gradient-to-r from-primary-600 to-evening-600 p-8 text-white shadow-xl">
          <h2 className="text-xl font-semibold">Can&apos;t access your account?</h2>
          <p className="mt-2 text-white/90">
            If you&apos;re locked out of your account or can&apos;t complete the in-app deletion process, we can help.
            Email us at{' '}
            <a href="mailto:support@domani-app.com" className="font-medium underline">
              support@domani-app.com
            </a>{' '}
            with the email address associated with your Domani account, and we&apos;ll process your deletion request manually.
          </p>
          <p className="mt-4 text-sm text-white/70">
            For security, we may ask you to verify your identity before processing the request.
          </p>
        </section>

        {/* Footer Links */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary-600 dark:hover:text-primary-300">
            Terms of Service
          </Link>
          <Link href="/security" className="hover:text-primary-600 dark:hover:text-primary-300">
            Security Practices
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          Last updated: December 2025 · Questions?{' '}
          <a href="mailto:support@domani-app.com" className="underline hover:text-primary-600 dark:hover:text-primary-300">
            support@domani-app.com
          </a>
        </p>
      </div>
    </main>
  )
}
