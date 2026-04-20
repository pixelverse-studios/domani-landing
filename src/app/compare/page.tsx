import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import { competitors } from '@/lib/compare/competitors'
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

interface GridFeature {
  label: string
  domani: boolean | string
  sunsama: boolean | string
  todoist: boolean | string
  ticktick: boolean | string
  notion: boolean | string
}

const gridFeatures: GridFeature[] = [
  {
    label: 'Evening-first planning',
    domani: true,
    sunsama: false,
    todoist: false,
    ticktick: false,
    notion: false,
  },
  {
    label: 'Reminder shortcuts',
    domani: true,
    sunsama: true,
    todoist: true,
    ticktick: true,
    notion: false,
  },
  {
    label: 'Task rollover',
    domani: true,
    sunsama: false,
    todoist: false,
    ticktick: false,
    notion: false,
  },
  {
    label: 'Task limit guardrails',
    domani: true,
    sunsama: false,
    todoist: false,
    ticktick: false,
    notion: false,
  },
  {
    label: 'Custom categories',
    domani: true,
    sunsama: false,
    todoist: true,
    ticktick: true,
    notion: true,
  },
  {
    label: 'Calendar integration',
    domani: false,
    sunsama: true,
    todoist: true,
    ticktick: true,
    notion: true,
  },
  {
    label: 'Team features',
    domani: false,
    sunsama: true,
    todoist: true,
    ticktick: false,
    notion: true,
  },
  {
    label: 'Pricing',
    domani: '$34.99 lifetime',
    sunsama: '$240/yr',
    todoist: '$5-8/mo',
    ticktick: '$35.99/yr',
    notion: '$10-18/mo',
  },
]

function CellValue({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) {
    return <Check className={`mx-auto h-5 w-5 ${highlight ? 'text-primary-600' : 'text-gray-400'}`} />
  }
  if (value === false) {
    return <X className="mx-auto h-4 w-4 text-gray-200" />
  }
  return (
    <span className={`text-xs font-medium ${highlight ? 'text-primary-700' : 'text-gray-500'}`}>
      {value}
    </span>
  )
}

export default function ComparePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-white pb-24 pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Compare' }]} />

          {/* Hero */}
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
              One table, four competitors. See what makes evening-first planning different — then
              dive into the full comparison for the app you are evaluating.
            </p>
          </div>

          {/* Summary Comparison Grid */}
          <section className="mx-auto mt-14 max-w-5xl">
            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-primary-100">
                    <th className="sticky left-0 z-10 bg-white py-4 pl-5 pr-3 text-left font-medium text-gray-400">
                      Feature
                    </th>
                    <th className="px-3 py-4 text-center">
                      <span className="font-bold text-primary-700">Domani</span>
                    </th>
                    {competitors.map((c) => (
                      <th key={c.slug} className="px-3 py-4 text-center font-semibold text-gray-600">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gridFeatures.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i < gridFeatures.length - 1 ? 'border-b border-gray-50' : ''}
                    >
                      <td className="sticky left-0 z-10 bg-white py-3.5 pl-5 pr-3 font-medium text-gray-700">
                        {row.label}
                      </td>
                      <td className="bg-primary-50/30 px-3 py-3.5 text-center">
                        <CellValue value={row.domani} highlight />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <CellValue value={row.sunsama} />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <CellValue value={row.todoist} />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <CellValue value={row.ticktick} />
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <CellValue value={row.notion} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">
              Scroll horizontally on mobile to see all columns
            </p>
          </section>

          {/* Deep-dive cards */}
          <section className="mx-auto mt-16 max-w-5xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
              Dive Deeper
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {competitors.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                >
                  <h3 className="font-bold text-gray-900 transition-colors group-hover:text-primary-700">
                    vs {comp.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-400">
                    {comp.tagline}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary-600 transition-all group-hover:gap-2">
                    Full comparison
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to try evening-first planning?
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Start free with 3 intentional tasks per day. Upgrade when you want more flexibility.
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
