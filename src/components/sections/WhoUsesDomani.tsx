'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap,
  Stethoscope,
  Baby,
  BookOpen,
  Palette,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Persona {
  icon: LucideIcon
  name: string
  painPoint: string
  solution: string
  accent: string
  iconBg: string
}

const personas: Persona[] = [
  {
    icon: Stethoscope,
    name: 'Healthcare Workers',
    painPoint: 'Shift changes leave no buffer to plan ahead',
    solution: 'Plan before your shift starts — wake up locked in',
    accent: 'border-rose-200/60',
    iconBg: 'bg-rose-50 text-rose-500',
  },
  {
    icon: GraduationCap,
    name: 'Teachers',
    painPoint: 'Lesson prep, grading, and personal life blur together',
    solution: 'Separate the chaos tonight so tomorrow flows',
    accent: 'border-amber-200/60',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Baby,
    name: 'Parents',
    painPoint: 'Mornings are a sprint before the day even begins',
    solution: 'Lock in school runs, meals, and your own priorities',
    accent: 'border-sky-200/60',
    iconBg: 'bg-sky-50 text-sky-500',
  },
  {
    icon: BookOpen,
    name: 'Students',
    painPoint: 'Classes, assignments, and deadlines pile up fast',
    solution: 'Pick tomorrow\u2019s focus tonight — study smarter, not harder',
    accent: 'border-violet-200/60',
    iconBg: 'bg-violet-50 text-violet-500',
  },
  {
    icon: Palette,
    name: 'Freelancers & Creators',
    painPoint: 'No structure means every morning starts from zero',
    solution: 'Give your creative day a launchpad, not a question mark',
    accent: 'border-emerald-200/60',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Briefcase,
    name: 'Busy Professionals',
    painPoint: 'Inbox and meetings hijack priorities before 9 AM',
    solution: 'Decide what matters tonight — execute tomorrow',
    accent: 'border-primary-200/60',
    iconBg: 'bg-primary-50 text-primary-600',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export function WhoUsesDomani() {
  return (
    <section className="relative overflow-clip bg-gradient-to-b from-white via-primary-50/20 to-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-600">
            Built for your schedule
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Evening Planning for{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              Every Kind of Busy
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Domani isn&apos;t just for executives with calendars full of meetings.
            It&apos;s for anyone who wakes up with more to do than they can hold in their head.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <motion.div
                key={persona.name}
                variants={cardVariants}
                className={cn(
                  'group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
                  persona.accent
                )}
              >
                <div className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
                  persona.iconBg
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-[15px] font-bold text-gray-900">
                  {persona.name}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-400">
                  {persona.painPoint}
                </p>
                <p className="mt-2 text-[13px] font-medium leading-relaxed text-gray-700">
                  {persona.solution}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
