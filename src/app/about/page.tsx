import { Metadata } from 'next'
import { aboutMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { AboutContent, type AboutValue } from '@/components/about/AboutContent'
// import { TestimonialsSection } from '@/components/testimonials/TestimonialsSection'

export const metadata: Metadata = aboutMetadata

export default function AboutPage() {
  const values: AboutValue[] = [
    {
      icon: 'heart',
      title: 'Evening Over Morning',
      description:
        "We believe planning when you're calm creates better decisions than planning when you're rushed.",
    },
    {
      icon: 'target',
      title: 'Focus on What Matters',
      description:
        "The 3-6 task rule isn't arbitrary—it's based on cognitive science about sustainable productivity.",
    },
    {
      icon: 'zap',
      title: 'Opinionated & Simple',
      description:
        "We make decisions so you don't have to. Evening planning works, and we built the perfect app for it.",
    },
    {
      icon: 'wallet',
      title: 'Simple, Fair Pricing',
      description:
        '14-day free trial with full access, then one simple lifetime price. No subscriptions, no hidden fees—pay once, own it forever.',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24">
        <AboutContent values={values} />
        {/* <TestimonialsSection
          background="transparent"
          heading="Early adopters betting on calm mornings"
          subtitle="Operators across design, product, and revenue share how Domani keeps their teams focused."
        /> */}
      </main>
    </>
  )
}
