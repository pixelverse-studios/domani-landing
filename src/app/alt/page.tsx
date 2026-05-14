'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import DynamicCTA from '@/components/DynamicCTA'
import { Crown, Lock, RefreshCw, Moon, Sun, Target, ChevronDown, Sparkles, Star, Check, Zap } from 'lucide-react'

// ============================================================================
// ALTERNATE HOMEPAGE — "THE NIGHT SHIFT"
// A cinematic, dark, scroll-driven experience
// ============================================================================

// --- STAR FIELD CANVAS ---
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let stars: { x: number; y: number; r: number; speed: number; opacity: number; twinkleSpeed: number; twinklePhase: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }))
    }

    let time = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 1

      for (const star of stars) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 191, 176, ${star.opacity * twinkle})`
        ctx.fill()

        // Subtle glow on larger stars
        if (star.r > 1) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(167, 191, 176, ${star.opacity * twinkle * 0.08})`
          ctx.fill()
        }

        star.y -= star.speed
        if (star.y < -5) {
          star.y = canvas.height + 5
          star.x = Math.random() * canvas.width
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

// --- ANIMATED TEXT REVEAL ---
function TextReveal({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const words = children.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotateX: -80 }}
            animate={isInView ? { y: '0%', rotateX: 0 } : { y: '110%', rotateX: -80 }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}

// --- HORIZONTAL SCROLL SECTION ---
function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])
  const smoothX = useSpring(x, { stiffness: 50, damping: 20 })

  const steps = [
    {
      time: '8:00 PM',
      icon: <Moon className="w-8 h-8" />,
      title: 'The Evening Ritual',
      description: "Your day winds down. You open Domani. It's calm. It's quiet. The perfect moment to think clearly about tomorrow.",
      accent: 'from-indigo-500 to-violet-600',
      glow: 'shadow-indigo-500/20',
    },
    {
      time: '8:05 PM',
      icon: <Crown className="w-8 h-8" />,
      title: 'Choose Your MIT',
      description: 'One Most Important Task. The thing that, if you do nothing else tomorrow, moves the needle. Choose it now while your mind is clear.',
      accent: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-500/20',
    },
    {
      time: '8:10 PM',
      icon: <Target className="w-8 h-8" />,
      title: 'Stack Your Day',
      description: "Add 2-5 supporting tasks. Drag to prioritize. The 3-6 Rule keeps you honest — you can't do everything, so do what matters.",
      accent: 'from-emerald-400 to-teal-500',
      glow: 'shadow-emerald-500/20',
    },
    {
      time: '8:15 PM',
      icon: <Lock className="w-8 h-8" />,
      title: 'Lock Your Plan',
      description: "Hit the lock. Your plan is sealed. No more second-guessing, no late-night anxiety spirals. Tomorrow is handled.",
      accent: 'from-rose-400 to-pink-500',
      glow: 'shadow-rose-500/20',
    },
    {
      time: '6:30 AM',
      icon: <Sun className="w-8 h-8" />,
      title: 'Wake Up Ready',
      description: "Your alarm goes off. But today is different. You don't check email first. You don't scroll. You open Domani and execute.",
      accent: 'from-sky-400 to-blue-500',
      glow: 'shadow-sky-500/20',
    },
  ]

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-[#0d1410] to-[#0a0f0d]" />

        <div className="relative z-10 w-full px-8 md:px-16">
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-emerald-400/60">
              The 15-Minute Ritual
            </span>
          </motion.div>

          <motion.div className="flex gap-8 md:gap-12" style={{ x: smoothX }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative flex-shrink-0 w-[85vw] md:w-[40vw] lg:w-[32vw]"
              >
                <div className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10 backdrop-blur-sm hover:bg-white/[0.04] transition-all duration-500 hover:border-white/[0.12] shadow-2xl ${step.glow}`}>
                  {/* Step number */}
                  <div className="absolute -top-4 -left-2 font-mono text-[80px] md:text-[100px] font-black leading-none text-white/[0.03] select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Time badge */}
                  <div className="mb-6 flex items-center gap-3">
                    <span className="font-mono text-xs tracking-wider text-white/40">{step.time}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  {/* Icon */}
                  <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${step.accent} p-3 text-white shadow-lg`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-white/50">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// --- BENTO FEATURE GRID ---
function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      title: 'The 3-6 Rule',
      description: 'Neuroscience says you can hold 3-6 items in working memory. We designed around that limit.',
      icon: <Zap className="w-6 h-6" />,
      span: 'md:col-span-2',
      accent: 'from-amber-400/20 to-orange-500/20',
      borderAccent: 'hover:border-amber-500/30',
      stat: '73%',
      statLabel: 'completion rate',
    },
    {
      title: 'Smart Rollover',
      description: "Unfinished tasks don't disappear. They roll forward intelligently.",
      icon: <RefreshCw className="w-6 h-6" />,
      span: 'md:col-span-1',
      accent: 'from-violet-400/20 to-purple-500/20',
      borderAccent: 'hover:border-violet-500/30',
    },
    {
      title: 'Morning Momentum',
      description: 'Wake up to a clear, locked plan. No decisions needed. Just start.',
      icon: <Sun className="w-6 h-6" />,
      span: 'md:col-span-1',
      accent: 'from-sky-400/20 to-blue-500/20',
      borderAccent: 'hover:border-sky-500/30',
    },
    {
      title: 'Plan Lock',
      description: "Seal your plan at night. No more 2 AM anxiety about what you're forgetting.",
      icon: <Lock className="w-6 h-6" />,
      span: 'md:col-span-1',
      accent: 'from-rose-400/20 to-pink-500/20',
      borderAccent: 'hover:border-rose-500/30',
    },
    {
      title: 'Evening Reflection',
      description: 'A gentle prompt to review your day and set intentions. Takes 5 minutes. Changes everything.',
      icon: <Moon className="w-6 h-6" />,
      span: 'md:col-span-1',
      accent: 'from-emerald-400/20 to-teal-500/20',
      borderAccent: 'hover:border-emerald-500/30',
    },
  ]

  return (
    <section className="relative py-32 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-[#0f1613] to-[#0a0f0d]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/60 block mb-4">
            Built Different
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight max-w-3xl">
            Features that respect{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
              how your brain works
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className={`group relative ${feature.span}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className={`relative h-full rounded-2xl border border-white/[0.06] bg-gradient-to-br ${feature.accent} p-7 md:p-8 backdrop-blur-sm transition-all duration-500 ${feature.borderAccent} hover:bg-white/[0.03]`}>
                {/* Icon */}
                <div className="mb-5 inline-flex rounded-lg bg-white/[0.06] p-2.5 text-white/70 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>

                {/* Stat (if exists) */}
                {feature.stat && (
                  <div className="absolute top-8 right-8 text-right">
                    <div className="text-4xl md:text-5xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                      {feature.stat}
                    </div>
                    <div className="text-xs text-white/30 font-mono tracking-wider">
                      {feature.statLabel}
                    </div>
                  </div>
                )}

                <h3 className="mb-2 text-xl md:text-2xl font-bold text-white/85 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-white/40 group-hover:text-white/55 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- LARGE TESTIMONIAL ---
function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote: "I used to dread mornings. Now I wake up and just... start. That's the magic of having your plan already locked in.",
      author: 'Real users, real results',
      role: 'Join thousands who plan their tomorrow tonight',
    },
    {
      quote: "The 3-6 Rule changed everything for me. I stopped overloading my days and started actually finishing what I planned.",
      author: 'Science-backed productivity',
      role: 'Designed around how your brain actually works',
    },
    {
      quote: "Plan Lock is genius. No more lying awake rethinking my to-do list. I lock it, I sleep, I wake up ready.",
      author: 'Evening calm, morning clarity',
      role: 'The planning method that reduces anxiety',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="relative py-32 md:py-44 overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0f0d]" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          {/* Big quote */}
          <div className="mb-6 text-8xl md:text-[10rem] font-serif text-white/[0.04] leading-none select-none">
            &ldquo;
          </div>

          <div className="relative min-h-[200px] md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-2xl md:text-4xl lg:text-5xl font-light text-white/80 leading-snug tracking-tight italic mb-10">
                  {testimonials[activeIndex].quote}
                </p>
                <div>
                  <p className="text-base md:text-lg font-semibold text-white/60">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-sm text-white/30 font-mono tracking-wider">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="mt-12 flex justify-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex ? 'w-8 bg-emerald-400/60' : 'w-1.5 bg-white/20 hover:bg-white/30'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// --- PRICING SECTION ---
function PricingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Everything you need to start planning your evenings',
      features: ['3 tasks per day', 'Evening planning mode', 'Morning execution view', '7-day history'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Premium',
      price: '$4.99',
      period: '/month',
      description: 'For those serious about owning their mornings',
      features: ['Unlimited tasks', 'Custom categories', 'Multi-device sync', 'Advanced analytics', 'Priority support'],
      cta: 'Start 7-Day Trial',
      popular: true,
    },
    {
      name: 'Lifetime',
      price: '$99',
      period: 'one-time',
      description: 'Pay once. Plan forever. No strings.',
      features: ['All Premium features', 'Forever access', 'Future updates included', 'Early feature access'],
      cta: 'Buy Once',
      popular: false,
    },
  ]

  return (
    <section className="relative py-32 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-[#0d1410] to-[#0a0f0d]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/60 block mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight">
            Start free.{' '}
            <span className="text-white/30">Upgrade when ready.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-1 text-xs font-semibold text-[#0a0f0d] tracking-wider uppercase">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className={`group relative h-full rounded-2xl border p-8 transition-all duration-500 ${
                plan.popular
                  ? 'border-emerald-500/30 bg-emerald-500/[0.05] hover:border-emerald-400/50'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              }`}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white/70 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white/90">{plan.price}</span>
                    <span className="text-sm text-white/30 font-mono">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/40">{plan.description}</p>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/50">
                      <Check className="w-4 h-4 text-emerald-400/60 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full rounded-xl py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-[#0a0f0d] hover:shadow-lg hover:shadow-emerald-500/20'
                    : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white/90'
                }`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- AURORA CTA ---
function AuroraCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-[#0a0f0d]" />
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)' }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-1/4 left-1/2 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)' }}
          animate={{
            x: [0, 60, -60, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-2"
            animate={{ boxShadow: ['0 0 20px rgba(52,211,153,0)', '0 0 20px rgba(52,211,153,0.15)', '0 0 20px rgba(52,211,153,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Star className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300/80">Now Live</span>
          </motion.div>

          <h2 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold text-white/90 tracking-tight leading-[0.95]">
            <TextReveal>Tonight is where</TextReveal>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              <TextReveal delay={0.4}>tomorrow begins</TextReveal>
            </span>
          </h2>

          <p className="mb-12 text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
            Join thousands who&apos;ve transformed their mornings by planning the night before.
            It takes 15 minutes. It changes everything.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <DynamicCTA
              analyticsLocation="alt-aurora-cta"
              size="large"
              showSubtext={false}
            />
          </div>

          <p className="mt-6 text-xs text-white/20 font-mono tracking-wider">
            14-day free trial &middot; iOS and Android available now
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// --- FLOATING NAV ---
function FloatingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 50)
      setVisible(currentScrollY < lastScrollY.current || currentScrollY < 100)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0f0d]/80 backdrop-blur-xl border-b border-white/[0.04]' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link href="/alt" className="font-serif text-2xl md:text-3xl font-bold text-white/90 tracking-tight hover:text-white transition-colors">
          Domani
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-white/40 hover:text-white/80 transition-colors">How it Works</a>
          <a href="#features" className="text-sm text-white/40 hover:text-white/80 transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-white/40 hover:text-white/80 transition-colors">Pricing</a>
          <Link href="/about" className="text-sm text-white/40 hover:text-white/80 transition-colors">About</Link>
        </div>

        <DynamicCTA
          analyticsLocation="alt-nav"
          size="default"
          showSubtext={false}
          className="hidden sm:block"
        />
      </div>
    </motion.nav>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function AltHomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 100])

  return (
    <div className="relative bg-[#0a0f0d] text-white min-h-screen selection:bg-emerald-500/30 selection:text-white">
      <StarField />
      <FloatingNav />

      {/* ---- HERO ---- */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 pt-20"
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.04] blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-mono tracking-widest text-white/40 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live on iOS
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.92] tracking-tighter mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TextReveal delay={0.5}>Plan tomorrow</TextReveal>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              <TextReveal delay={0.8}>tonight</TextReveal>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-white/35 max-w-2xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            The evening planning app that transforms chaotic mornings into
            focused execution. 15 minutes tonight. Every morning handled.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col items-center gap-4"
          >
            <DynamicCTA
              analyticsLocation="alt-hero"
              size="large"
              showSubtext={false}
            />
            <p className="text-xs text-white/20 font-mono tracking-wider">
              14-day free trial &middot; iOS and Android available now
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white/20" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ---- THE PROBLEM ---- */}
      <section className="relative py-32 md:py-44">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-[#100a0a] to-[#0a0f0d]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
            {/* Left — the problem */}
            <div>
              <motion.span
                className="font-mono text-xs uppercase tracking-[0.3em] text-red-400/50 block mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                The Problem
              </motion.span>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 tracking-tight leading-[0.95] mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Your mornings are{' '}
                <span className="text-red-400/70">broken</span>
              </motion.h2>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {[
                  'You wake up already behind',
                  'Your inbox decides your priorities',
                  'Decision fatigue hits before coffee',
                  'The important stuff gets pushed to "later"',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400/40 group-hover:bg-red-400/70 transition-colors flex-shrink-0" />
                    <p className="text-lg text-white/40 group-hover:text-white/60 transition-colors">{item}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — the solution */}
            <div>
              <motion.span
                className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-400/50 block mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                The Solution
              </motion.span>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 tracking-tight leading-[0.95] mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Plan when{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  calm
                </span>
              </motion.h2>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {[
                  'Your evening mind sees the big picture',
                  'Plan when reflective, execute when fresh',
                  'Wake up to a locked plan — no decisions',
                  'Start your MIT immediately',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400/40 group-hover:bg-emerald-400/70 transition-colors flex-shrink-0" />
                    <p className="text-lg text-white/40 group-hover:text-white/60 transition-colors">{item}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- HOW IT WORKS (Horizontal Scroll) ---- */}
      <div id="how-it-works">
        <HorizontalScroll />
      </div>

      {/* ---- FEATURES (Bento Grid) ---- */}
      <div id="features">
        <BentoGrid />
      </div>

      {/* ---- TESTIMONIAL ---- */}
      <TestimonialSection />

      {/* ---- PRICING ---- */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* ---- FINAL CTA (Aurora) ---- */}
      <AuroraCTA />

      {/* ---- FOOTER ---- */}
      <footer className="relative border-t border-white/[0.04] bg-[#080c0a]">
        <div className="mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <Link href="/alt" className="font-serif text-2xl font-bold text-white/80 tracking-tight hover:text-white transition-colors">
                Domani
              </Link>
              <p className="mt-2 text-sm text-white/25">
                Plan tomorrow tonight. Wake up ready.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 md:gap-8 text-sm text-white/30">
              <Link href="/about" className="hover:text-white/60 transition-colors">About</Link>
              <Link href="/blog" className="hover:text-white/60 transition-colors">Blog</Link>
              <Link href="/pricing" className="hover:text-white/60 transition-colors">Pricing</Link>
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/15 font-mono tracking-wider">
              &copy; {new Date().getFullYear()} Domani &middot; PixelVerse Studios
            </p>
            <p className="text-xs text-white/10 font-mono tracking-wider">
              Built for people who respect their mornings
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
