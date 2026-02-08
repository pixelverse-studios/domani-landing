import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Security Practices | Domani',
  description: 'See how Domani safeguards customer data with encryption, monitoring, and incident response.',
}

const practices = [
  {
    title: 'Infrastructure & hosting',
    description:
      'Domani is hosted on Vercel and Supabase, both running in SOC 2 Type II audited data centres with redundant power, networking, and physical security.',
  },
  {
    title: 'Encryption',
    description:
      'All traffic is forced over HTTPS/TLS 1.2+. Data at rest (tasks, notes, account info) is encrypted using AES-256. Secrets are stored in managed key stores, never in git.',
  },
  {
    title: 'Authentication & access',
    description:
      'Password hashing uses bcrypt, and admin access requires hardware-backed MFA. Production data access is limited to a handful of engineers for support purposes only.',
  },
  {
    title: 'Monitoring & alerting',
    description:
      'We log authentication attempts, configuration changes, and unusual API spikes. Pager alerts fire for availability regressions or suspicious behaviour.',
  },
  {
    title: 'Backups & resilience',
    description:
      'Automated database backups run daily with 30-day retention. Disaster recovery procedures are rehearsed quarterly to ensure we can restore service quickly.',
  },
  {
    title: 'Incident response',
    description:
      'If we detect a breach, customers are notified via email within 72 hours with remediation steps. We’ll share a full timeline and preventative actions.',
  },
  {
    title: 'Responsible disclosure',
    description:
      'Security researchers can report vulnerabilities to security@domani.app. We review submissions within 48 hours and coordinate fixes with the reporter.',
  },
]

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-primary-50/5 py-24">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Security</p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">How we protect your data</h1>
          <p className="mt-4 text-lg text-gray-600">
            Planning tomorrow requires trust. Here’s how we keep your tasks, habits, and notes safe.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {practices.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
              <p className="mt-3 text-gray-700">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-evening-600 to-primary-600 p-6 text-white shadow-xl">
          <h3 className="text-xl font-semibold">Need a security review or DPA?</h3>
          <p className="mt-2 text-sm text-white/80">
            Email <a href="mailto:security@domani.app" className="underline">security@domani.app</a> for vendor questionnaires, penetration-test results,
            or to request a data processing agreement. You can also view our <Link href="/privacy" className="underline">privacy policy</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}
