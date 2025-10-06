import { Metadata } from 'next'
import { aboutMetadata } from '@/lib/seo/metadata'
import { Heart, Target, Users, Zap } from 'lucide-react'

export const metadata: Metadata = aboutMetadata

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Evening Over Morning',
      description:
        "We believe planning when you're calm creates better decisions than planning when you're rushed.",
    },
    {
      icon: Target,
      title: 'Focus on What Matters',
      description:
        "The 3-6 task rule isn't arbitrary—it's based on cognitive science about sustainable productivity.",
    },
    {
      icon: Users,
      title: 'Built for Humans',
      description:
        'No gamification, no streaks, no guilt. Just a tool that respects your natural rhythms.',
    },
    {
      icon: Zap,
      title: 'Opinionated & Simple',
      description:
        "We make decisions so you don't have to. Evening planning works, and we built the perfect app for it.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            The Science of Evening Planning
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            We built Domani because we were tired of waking up stressed, scrambling to figure
            out what mattered. There had to be a better way.
          </p>
        </div>

        {/* The Problem */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">The Morning Problem</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Research shows that decision fatigue peaks in the morning. Your brain is
              bombarded with choices: What should I work on first? What&apos;s actually important?
              Should I respond to this email or start that project?
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              By the time you&apos;ve made these decisions, you&apos;ve already burned through precious
              mental energy. The best hours of your day—gone, spent on planning instead of
              doing.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Studies show that planning the night before reduces morning decision fatigue by
              73% and increases task completion rates by 42%.
            </p>
          </div>
        </div>

        {/* The Solution */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">The Evening Solution</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Evening planning flips the script. At the end of your day, you&apos;re reflective,
              not reactive. You can see what worked, what didn&apos;t, and what truly matters for
              tomorrow.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Domani is built around this simple insight: <strong>Plan when you&apos;re calm,
              execute when you&apos;re focused.</strong>
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our &ldquo;Plan Lock&rdquo; feature prevents you from changing your plan after you&apos;ve set
              it. No morning overthinking. No second-guessing. Just wake up and execute.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Believe</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* The Team */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">Built by People Who Get It</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              We&apos;re not a massive productivity company trying to do everything. We&apos;re a small
              team obsessed with solving one problem extremely well: chaotic mornings.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Every feature in Domani exists because we needed it ourselves. The evening
              planning mode? We use it every night. The 3-6 task limit? Based on years of
              trial and error.
            </p>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              This isn&apos;t just an app. It&apos;s how we run our lives.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Own Your Mornings?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who plan tomorrow tonight.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-shadow">
            Start Free Today
          </button>
        </div>
      </div>
    </div>
  )
}
