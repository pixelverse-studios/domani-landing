import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, ArrowRight } from 'lucide-react'
import { competitors, getCompetitor, getAllCompetitorSlugs, DOMANI_PRICING } from '@/lib/compare/competitors'
import { ComparisonTable } from '@/components/compare/ComparisonTable'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SITE_URL } from '@/lib/config/site'
import { createFAQPageSchema, stringifyJsonLd } from '@/lib/seo/structured-data'
import Header from '@/components/Header'
import DynamicCTA from '@/components/DynamicCTA'

interface ComparePageProps {
  params: Promise<{ competitor: string }>
}

export function generateStaticParams() {
  return getAllCompetitorSlugs().map((slug) => ({ competitor: slug }))
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { competitor: slug } = await params
  const comp = getCompetitor(slug)
  if (!comp) return {}

  const title = `${comp.name} Alternative - Domani vs ${comp.name} Comparison`
  const description = `Compare Domani and ${comp.name} side by side. See features, pricing, and philosophy differences. ${comp.tagline}`

  return {
    title,
    description,
    keywords: [`${comp.slug} alternative`, `${comp.name} alternative`, `domani vs ${comp.slug}`, `${comp.name} vs domani`, 'evening planning app', 'daily planner app'],
    alternates: { canonical: `${SITE_URL}/compare/${comp.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/compare/${comp.slug}`,
      type: 'website',
    },
  }
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { competitor: slug } = await params
  const comp = getCompetitor(slug)
  if (!comp) notFound()

  const faqSchema = createFAQPageSchema(comp.faqs)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-white pb-24 pt-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqSchema) }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Compare', href: '/compare' },
            { label: `vs ${comp.name}` },
          ]} />

          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-600">
              Comparison
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              {comp.name} Alternative:{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Domani vs {comp.name}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              {comp.tagline}
            </p>
          </div>

          {/* Overview */}
          <section className="mx-auto mt-16 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">{comp.name}</h2>
                <p className="mt-2 text-sm text-gray-500">{comp.description}</p>
                <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700">{comp.pricing}</p>
                  <p className="text-xs text-gray-400">{comp.pricingDetail}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-primary-700">Domani</h2>
                <p className="mt-2 text-sm text-gray-600">
                  The evening planning app that helps you plan tomorrow tonight when you&apos;re calm,
                  so you wake up ready to go. Simple, focused, and built for your daily routine.
                </p>
                <div className="mt-4 rounded-lg bg-primary-100/50 px-4 py-3">
                  <p className="text-sm font-semibold text-primary-700">{DOMANI_PRICING.display}</p>
                  <p className="text-xs text-primary-500">{DOMANI_PRICING.detail}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="mx-auto mt-16 max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">Feature Comparison</h2>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <ComparisonTable features={comp.features} competitorName={comp.name} />
            </div>
          </section>

          {/* Key Advantage */}
          <section className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-white shadow-lg md:p-10">
              <h2 className="text-2xl font-bold">Why Choose Domani?</h2>
              <p className="mt-3 text-lg text-white/80">{comp.domaniAdvantage}</p>
            </div>
          </section>

          {/* Strengths & Weaknesses */}
          <section className="mx-auto mt-16 max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Honest Take: {comp.name} Strengths & Weaknesses
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-gray-900">
                  Where {comp.name} shines
                </h3>
                <ul className="space-y-2">
                  {comp.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-gray-900">
                  Where {comp.name} falls short for daily planning
                </h3>
                <ul className="space-y-2">
                  {comp.weaknesses.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-center text-amber-500">!</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto mt-16 max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {comp.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Blog link */}
          {comp.blogSlug && (
            <section className="mx-auto mt-12 max-w-4xl text-center">
              <Link
                href={`/blog/${comp.blogSlug}`}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
              >
                Read our in-depth {comp.name} comparison blog post
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </section>
          )}

          {/* CTA */}
          <section className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to try a different approach?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Plan tomorrow tonight. Wake up ready. Free during public beta.
            </p>
            <div className="mt-8">
              <DynamicCTA size="large" analyticsLocation={`compare-${comp.slug}`} />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
