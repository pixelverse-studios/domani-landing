import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { competitors, DOMANI_PRICING } from '@/lib/compare/competitors'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import Header from '@/components/Header'
import DynamicCTA from '@/components/DynamicCTA'

export const metadata: Metadata = {
  title: 'Compare Domani to Popular Planning Apps | Domani',
  description:
    'See how Domani compares to Sunsama, Todoist, TickTick, and Notion. Feature comparisons, pricing breakdowns, and honest takes on who each app is best for.',
  keywords: [
    'best daily planner app 2026',
    'planner app alternatives',
    'sunsama alternative',
    'todoist alternative',
    'ticktick alternative',
    'notion planner alternative',
    'evening planning app comparison',
  ],
}

export default function ComparePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-white pb-24 pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Compare' }]} />

          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-600">
              Honest comparisons
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              See How Domani{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Stacks Up
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              We believe in transparency. Every comparison includes what the other app does well,
              where it falls short for daily planning, and why evening-first planning is different.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
            {competitors.map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-700">
                  Domani vs {comp.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {comp.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    <span className="font-medium text-primary-600">{DOMANI_PRICING.display.split('(')[0].trim()}</span>
                    {' vs '}
                    <span className="text-gray-500">{comp.pricing}</span>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-all group-hover:gap-2">
                  Compare features
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>

          <section className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to try evening-first planning?
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Free during public beta. No credit card required.
            </p>
            <div className="mt-8">
              <DynamicCTA size="large" analyticsLocation="compare-index" />
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
