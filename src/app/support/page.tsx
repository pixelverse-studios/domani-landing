import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  Database,
  HelpCircle,
  KeyRound,
  Mail,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/config/site'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'Domani Support - Help With Your Account, Purchases, and Planning Data',
  description:
    'Get help with Domani account access, billing, refunds, purchases, notifications, and task data. Contact support or find the right App Store and Google Play refund paths.',
  path: '/support',
  keywords: [
    'Domani support',
    'Domani help',
    'Domani refund',
    'Domani account support',
    'Domani billing support',
  ],
})

const supportTopics = [
  {
    title: 'Account and login',
    description: 'Trouble signing in, changing your email, recovering access, or understanding account status.',
    icon: KeyRound,
  },
  {
    title: 'Billing and purchases',
    description: 'Questions about lifetime access, trial status, duplicate charges, and store purchase receipts.',
    icon: CreditCard,
  },
  {
    title: 'Refund direction',
    description: 'Find the right Apple App Store or Google Play path for store-managed refund requests.',
    icon: ReceiptText,
  },
  {
    title: 'Notifications',
    description: 'Get help with evening planning reminders, morning prompts, and device notification settings.',
    icon: Bell,
  },
  {
    title: 'Tasks and plan data',
    description: 'Questions about task sync, missing plans, plan lock, history, exports, or deleting data.',
    icon: Database,
  },
  {
    title: 'App behavior',
    description: 'Report bugs, performance issues, app crashes, or unexpected behavior on iOS or Android.',
    icon: Smartphone,
  },
]

const quickLinks = [
  { label: 'FAQ', href: '/faq', description: 'Common questions about features, pricing, and evening planning.' },
  { label: 'Privacy Policy', href: '/privacy', description: 'How Domani collects, uses, and protects your information.' },
  { label: 'Terms of Service', href: '/terms', description: 'The terms that apply when you use Domani.' },
  { label: 'Delete Account', href: '/delete-account', description: 'How to remove your Domani account and associated data.' },
  { label: 'Security', href: '/security', description: 'Responsible disclosure and security practices.' },
]

const responseGuidance = [
  'Most support requests receive a first reply within 2 business days.',
  'Include your device type, app version, purchase platform, and the email on your Domani account.',
  'Never send passwords, full payment card numbers, or one-time login codes.',
]

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_URL}/support#contactpage`,
  name: `${SITE_NAME} Support`,
  url: `${SITE_URL}/support`,
  description: 'Customer support for Domani account, purchase, refund, notification, and planning data questions.',
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  },
}

export default function SupportPage() {
  const supportSubject = encodeURIComponent('Domani support request')
  const supportBody = encodeURIComponent(
    [
      'Hi Domani Support,',
      '',
      'I need help with:',
      '',
      'Domani account email:',
      'Device and OS:',
      'App version:',
      'Purchase platform: App Store / Google Play / Not sure',
      '',
      'What happened:',
    ].join('\n')
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c') }}
      />
      <main className="min-h-screen bg-[#faf8f5] pt-24 text-[#314038] [@media(prefers-color-scheme:dark)]:bg-[#111713] [@media(prefers-color-scheme:dark)]:text-[#edf3ee]">
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Support' }]} />

          <section className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.7fr)] lg:items-end lg:py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300">
                Domani Support
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.02] tracking-tight text-[#26352e] sm:text-5xl lg:text-6xl [@media(prefers-color-scheme:dark)]:text-white">
                Help with your account, purchases, and planning data.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#647267] [@media(prefers-color-scheme:dark)]:text-[#b8c6bc]">
                Use this page when you need a human, a policy link, or the correct store-managed refund path.
                We can help with Domani app behavior, account access, notifications, and task data questions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${supportSubject}&body=${supportBody}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(90,119,101,0.9)] transition hover:-translate-y-0.5 hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/25 active:translate-y-0"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Email support
                </a>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8d2c8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#314038] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:translate-y-0 [@media(prefers-color-scheme:dark)]:border-white/10 [@media(prefers-color-scheme:dark)]:bg-white/5 [@media(prefers-color-scheme:dark)]:text-[#edf3ee] [@media(prefers-color-scheme:dark)]:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  Check FAQ
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-46px_rgba(49,64,56,0.8)] [@media(prefers-color-scheme:dark)]:border-white/10 [@media(prefers-color-scheme:dark)]:bg-white/[0.06] [@media(prefers-color-scheme:dark)]:shadow-none">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 text-primary-800 [@media(prefers-color-scheme:dark)]:bg-primary-300/15 [@media(prefers-color-scheme:dark)]:text-primary-200">
                  <MessageSquareText className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                    What to expect
                  </h2>
                  <p className="text-sm text-[#6f7d73] [@media(prefers-color-scheme:dark)]:text-[#a8b6ac]">
                    Clear context helps us solve the issue faster.
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-4">
                {responseGuidance.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#536258] [@media(prefers-color-scheme:dark)]:text-[#c4d0c7]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section aria-labelledby="support-topics" className="py-10">
            <div className="flex max-w-3xl flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300">
                Support Topics
              </p>
              <h2 id="support-topics" className="text-3xl font-bold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                Tell us where you are stuck.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {supportTopics.map((topic) => {
                const Icon = topic.icon
                return (
                  <article
                    key={topic.title}
                    className="rounded-2xl border border-[#e5dfd5] bg-white/65 p-5 shadow-[0_16px_40px_-32px_rgba(49,64,56,0.75)] [@media(prefers-color-scheme:dark)]:border-white/10 [@media(prefers-color-scheme:dark)]:bg-white/[0.045]"
                  >
                    <Icon className="h-5 w-5 text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300" aria-hidden />
                    <h3 className="mt-4 text-lg font-semibold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#66746a] [@media(prefers-color-scheme:dark)]:text-[#adbbb1]">
                      {topic.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="grid gap-6 py-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] bg-[#314038] p-7 text-white shadow-[0_24px_70px_-48px_rgba(49,64,56,0.9)] [@media(prefers-color-scheme:dark)]:bg-[#dce8df] [@media(prefers-color-scheme:dark)]:text-[#172119]">
              <ShieldCheck className="h-6 w-6 text-primary-200 [@media(prefers-color-scheme:dark)]:text-primary-700" aria-hidden />
              <h2 className="mt-5 text-2xl font-bold">Refunds are handled by the store where you purchased.</h2>
              <p className="mt-4 text-sm leading-6 text-white/75 [@media(prefers-color-scheme:dark)]:text-[#46554b]">
                Domani can help investigate purchase access issues, but Apple and Google manage refund eligibility
                and payment reversals for app store purchases.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="https://support.apple.com/en-us/118223"
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-[#e5dfd5] bg-white/70 p-6 transition hover:-translate-y-0.5 hover:border-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 [@media(prefers-color-scheme:dark)]:border-white/10 [@media(prefers-color-scheme:dark)]:bg-white/[0.045]"
              >
                <p className="text-sm font-semibold text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300">Apple App Store</p>
                <h3 className="mt-3 text-xl font-semibold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                  Request through Apple Support
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#66746a] [@media(prefers-color-scheme:dark)]:text-[#adbbb1]">
                  Apple directs users to sign in at reportaproblem.apple.com and choose Request a refund for eligible purchases.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 group-hover:gap-3 [@media(prefers-color-scheme:dark)]:text-primary-300">
                  Open Apple guidance <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </a>

              <a
                href="https://support.google.com/googleplay/answer/15574897?hl=en"
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-[#e5dfd5] bg-white/70 p-6 transition hover:-translate-y-0.5 hover:border-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 [@media(prefers-color-scheme:dark)]:border-white/10 [@media(prefers-color-scheme:dark)]:bg-white/[0.045]"
              >
                <p className="text-sm font-semibold text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300">Google Play</p>
                <h3 className="mt-3 text-xl font-semibold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                  Request through Google Play
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#66746a] [@media(prefers-color-scheme:dark)]:text-[#adbbb1]">
                  Google Play provides its refund request flow and notes that refund decisions can take up to 4 days.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 group-hover:gap-3 [@media(prefers-color-scheme:dark)]:text-primary-300">
                  Open Google guidance <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </a>
            </div>
          </section>

          <section className="grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-700 [@media(prefers-color-scheme:dark)]:text-primary-300">
                Helpful Links
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                Start with the policy or guide closest to your issue.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#66746a] [@media(prefers-color-scheme:dark)]:text-[#adbbb1]">
                These pages are public and crawlable, so you can use them for review, privacy, account removal,
                and general help references.
              </p>
            </div>

            <div className="divide-y divide-[#e5dfd5] rounded-[2rem] border border-[#e5dfd5] bg-white/70 [@media(prefers-color-scheme:dark)]:divide-white/10 [@media(prefers-color-scheme:dark)]:border-white/10 [@media(prefers-color-scheme:dark)]:bg-white/[0.045]">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between gap-5 p-5 transition hover:bg-white/70 [@media(prefers-color-scheme:dark)]:hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="block font-semibold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[#66746a] [@media(prefers-color-scheme:dark)]:text-[#adbbb1]">
                      {link.description}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary-700 transition group-hover:translate-x-1 [@media(prefers-color-scheme:dark)]:text-primary-300" aria-hidden />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-primary-200/80 bg-primary-50 p-6 sm:p-8 [@media(prefers-color-scheme:dark)]:border-primary-300/20 [@media(prefers-color-scheme:dark)]:bg-primary-300/10">
            <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-800 [@media(prefers-color-scheme:dark)]:bg-white/10 [@media(prefers-color-scheme:dark)]:text-primary-200">
                <HelpCircle className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#26352e] [@media(prefers-color-scheme:dark)]:text-white">
                  Still need help?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5f6d63] [@media(prefers-color-scheme:dark)]:text-[#bdc9c0]">
                  Email <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-4">{CONTACT_EMAIL}</a>.
                  Include screenshots when they help explain the issue.
                </p>
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${supportSubject}&body=${supportBody}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/25"
              >
                Contact Domani
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
