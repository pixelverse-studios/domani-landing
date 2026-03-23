import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'
import { getCompetitor, getAllCompetitorSlugs, DOMANI_PRICING } from '@/lib/compare/competitors'
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
      <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white pb-24 pt-28">
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
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600">
              Honest comparison
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Domani vs {comp.name}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              {comp.tagline}
            </p>
          </div>

          {/* Side-by-side overview */}
          <section className="mx-auto mt-14 max-w-4xl">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Competitor card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-500">
                    {comp.name[0]}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{comp.name}</h2>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-500">{comp.description}</p>
                <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700">{comp.pricing}</p>
                  <p className="mt-0.5 text-[12px] text-gray-400">{comp.pricingDetail}</p>
                </div>
              </div>

              {/* Domani card */}
              <div className="rounded-2xl border border-primary-200/60 bg-gradient-to-br from-primary-50/50 to-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-lg font-bold text-primary-700">
                    D
                  </div>
                  <h2 className="text-lg font-bold text-primary-700">Domani</h2>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                  The evening planning app that helps you plan tomorrow tonight when you&apos;re calm,
                  so you wake up ready to go. Simple, focused, and built for your daily routine.
                </p>
                <div className="mt-4 rounded-xl bg-primary-100/40 px-4 py-3">
                  <p className="text-sm font-semibold text-primary-700">{DOMANI_PRICING.display}</p>
                  <p className="mt-0.5 text-[12px] text-primary-500">{DOMANI_PRICING.detail}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="mx-auto mt-14 max-w-4xl">
            <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Feature comparison
            </h2>
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-4">
              <ComparisonTable features={comp.features} competitorName={comp.name} />
            </div>
          </section>

          {/* Why Domani callout */}
          <section className="mx-auto mt-14 max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-8 text-white md:p-10">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
                  The difference
                </p>
                <h2 className="mt-2 text-2xl font-bold">Why Choose Domani?</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/80">
                  {comp.domaniAdvantage}
                </p>
              </div>
            </div>
          </section>

          {/* Strengths & Weaknesses */}
          <section className="mx-auto mt-14 max-w-4xl">
            <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Honest take
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Where {comp.name} shines
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {comp.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-gray-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Where it falls short for daily planning
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {comp.weaknesses.map((w) => (
                    <li key={w} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-gray-600">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto mt-14 max-w-4xl">
            <h2 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
              Common questions
            </h2>
            <div className="space-y-3">
              {comp.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-gray-100 bg-white">
                  <summary className="cursor-pointer select-none px-6 py-4 text-[14px] font-semibold text-gray-900 transition-colors hover:text-primary-700">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-[13px] leading-relaxed text-gray-500">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <section className="mx-auto mt-12 flex max-w-4xl items-center justify-between">
            <Link
              href="/compare"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition hover:text-primary-600"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              All comparisons
            </Link>
            {comp.blogSlug && (
              <Link
                href={`/blog/${comp.blogSlug}`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
              >
                Read the full blog post
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </section>

          {/* CTA */}
          <section className="mx-auto mt-14 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to try a different approach?
            </h2>
            <p className="mt-3 text-lg text-gray-500">
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
