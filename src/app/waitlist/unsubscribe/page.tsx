import type { Metadata } from 'next'
import Link from 'next/link'
import UnsubscribeForm from '@/components/UnsubscribeForm'

export const metadata: Metadata = {
  title: 'Unsubscribe from Waitlist | Domani',
  description: 'Unsubscribe from the Domani waitlist. You can rejoin anytime if you change your mind.',
}

interface PageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams
  const initialEmail = params.email || ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24">
      <div className="container mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Waitlist</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Unsubscribe</h1>
          <p className="mt-4 text-lg text-gray-600">
            We&apos;re sorry to see you go. Enter your email below to unsubscribe from the Domani waitlist.
          </p>
        </div>

        {/* Unsubscribe Form Card */}
        <section className="mt-12 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg">
          <UnsubscribeForm initialEmail={initialEmail} />
        </section>

        {/* Info Section */}
        <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50/80 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            What happens when you unsubscribe?
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>You will be removed from our waitlist and won&apos;t receive launch updates.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>Any early access priority or referral bonuses will be reset.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">-</span>
              <span>You can rejoin the waitlist anytime from our homepage.</span>
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
