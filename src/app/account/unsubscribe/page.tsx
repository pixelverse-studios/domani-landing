import type { Metadata } from 'next'
import Link from 'next/link'
import AccountUnsubscribeForm from '@/components/AccountUnsubscribeForm'

export const metadata: Metadata = {
  title: 'Unsubscribe from Email Notifications | Domani',
  description: 'Manage your Domani email preferences. Unsubscribe from email notifications while keeping your account active.',
}

interface PageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function AccountUnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams
  const initialEmail = params.email || ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24">
      <div className="container mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Email Preferences</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Unsubscribe</h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your email notification preferences for your Domani account.
          </p>
        </div>

        {/* Unsubscribe Form Card */}
        <section className="mt-12 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg">
          <AccountUnsubscribeForm initialEmail={initialEmail} />
        </section>

        {/* Info Section */}
        <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50/80 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            What happens when you unsubscribe?
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>You will stop receiving all email notifications from Domani.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>This includes task reminders, weekly summaries, and product updates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>Your account remains active and you can continue using the app.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>You can re-enable notifications anytime in your account settings.</span>
            </li>
          </ul>
        </section>

        {/* Alternative Options */}
        <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-900 mb-2">
            Looking for something else?
          </h2>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">-</span>
              <span>
                <strong>Delete your account?</strong>{' '}
                <Link href="/delete-account" className="underline hover:text-amber-600:text-amber-300">
                  Request account deletion
                </Link>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-1">-</span>
              <span>
                <strong>Waitlist subscriber?</strong>{' '}
                <Link href="/waitlist/unsubscribe" className="underline hover:text-amber-600:text-amber-300">
                  Unsubscribe from waitlist
                </Link>
              </span>
            </li>
          </ul>
        </section>

        {/* Footer Links */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-600:text-primary-300">
            Homepage
          </Link>
          <Link href="/privacy" className="hover:text-primary-600:text-primary-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary-600:text-primary-300">
            Terms of Service
          </Link>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Questions?{' '}
          <a href="mailto:support@domani-app.com" className="underline hover:text-primary-600:text-primary-300">
            support@domani-app.com
          </a>
        </p>
      </div>
    </main>
  )
}
