import { Metadata } from 'next'
import { aboutMetadata } from '@/lib/seo/metadata'
import Header from '@/components/Header'
import { AboutContent, type AboutValue } from '@/components/about/AboutContent'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
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
        "We proactively nudge you to plan each evening, building a sustainable habit instead of leaving it all up to you.",
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
        'Start free with 3 intentional tasks per day, then upgrade for more flexibility and support when you want it.',
    },
    {
      icon: 'shield',
      title: 'Privacy First',
      description:
        'Your plans and tasks stay on your device. No data mining, no ads, no selling your information. Your productivity is yours alone.',
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'About' }]} />
        </div>
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
