import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import { BenefitCard } from './BenefitCard'
import { benefitsData } from './benefitsData'
import { SectionDivider } from '@/components/ui/SectionDivider'

const BenefitsMotionLayer = dynamic(
  () => import('./BenefitsMotionLayer').then((mod) => mod.BenefitsMotionLayer),
  { loading: () => null }
)

interface BenefitsSectionProps {
  className?: string
}

export function BenefitsSection({ className }: BenefitsSectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-clip bg-gradient-to-b from-primary-50/10 via-white to-white px-4 pt-16 pb-24 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <p className="mb-4 font-medium uppercase tracking-[0.3em] text-primary-500">Why evening planning works</p>
        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Science-Backed Benefits
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
          Domani leverages cognitive psychology research to transform how your brain processes tasks, reducing mental fatigue while
          amplifying your natural productivity rhythms.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {benefitsData.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} className="h-full" />
        ))}
      </div>

      <div className="absolute inset-0 -z-10">
        <BenefitsMotionLayer />
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-px">
        <SectionDivider variant="curve" className="text-white" />
      </div>
    </section>
  )
}
