import { testimonials } from '@/data/testimonials'
import { cn } from '@/lib/utils'

interface TestimonialsSectionProps {
  className?: string
  heading?: string
  subtitle?: string
  background?: 'gradient' | 'transparent'
}

export function TestimonialsSection({
  className,
  heading = 'People who plan at night, win their mornings',
  subtitle = 'Evening-first operators, founders, and leads share how Domani removed morning decision fatigue.',
  background = 'gradient',
}: TestimonialsSectionProps) {
  const rootBackground =
    background === 'gradient'
      ? 'bg-gradient-to-b from-white via-primary-50/30 to-primary-50/5'
      : 'bg-transparent'

  return (
    <section
      className={cn(
        'relative overflow-hidden py-20',
        rootBackground,
        className
      )}
    >
      {background === 'gradient' && (
        <div className="absolute inset-0 -z-10 opacity-40 blur-3xl">
          <div className="absolute left-20 top-10 h-56 w-56 rounded-full bg-primary-200" />
          <div className="absolute right-16 bottom-0 h-64 w-64 rounded-full bg-primary-300" />
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Real users</p>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col justify-between rounded-3xl border border-white/60 bg-white/90 p-6 text-left shadow-lg shadow-primary-500/10 backdrop-blur"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`h-4 w-4 ${index + 1 <= Math.round(testimonial.rating) ? 'text-amber-500' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-gray-500">{testimonial.rating.toFixed(1)}/5</span>
                </div>
                <blockquote className="mt-4 text-base text-gray-700">{testimonial.quote}</blockquote>
              </div>
              <figcaption className="mt-6">
                <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.role} · {testimonial.company}
                </p>
                <p className="text-xs text-gray-400">{testimonial.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
