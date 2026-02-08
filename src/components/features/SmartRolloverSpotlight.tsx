'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { IterationCcw } from 'lucide-react';
import { SectionDivider } from '@/components/ui/SectionDivider';

export function SmartRolloverSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const prefersReducedMotion = useReducedMotion();

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [40, -40]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip bg-gradient-to-b from-white via-primary-50/30 to-white px-4 py-24  sm:px-6 lg:px-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: translateY }}
          className="absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 opacity-20 blur-3xl "
        />
        <motion.div
          style={{ y: translateY }}
          className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 opacity-20 blur-3xl "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16"
        >
          {/* Icon/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 opacity-20 blur-2xl" />

              {/* Main icon container */}
              <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 sm:h-40 sm:w-40">
                <IterationCcw className="h-16 w-16 text-white sm:h-20 sm:w-20" />
              </div>

              {/* Coming Soon badge with pulse */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute -bottom-3 -right-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-primary-600 shadow-lg "
                >
                  Coming Soon
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600 "
            >
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-primary-700 ">
                Coming Soon
              </span>
              <span className="mx-2">•</span>
              Smart Task Rollover
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-3xl font-bold text-gray-900  sm:text-4xl lg:text-5xl"
            >
              Yesterday&apos;s Unfinished Business,{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                Today&apos;s Conscious Choice.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 text-lg text-gray-600 "
            >
              Didn&apos;t finish everything yesterday? No problem. When you open Domani the next
              morning, you&apos;ll see your incomplete tasks and choose which ones to carry forward.
              No automatic task pile-ups, no guilt-inducing backlogs — just a simple prompt that
              lets you intentionally decide what still matters today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-gray-500  lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                You stay in control
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                No task debt
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Intentional planning
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />
                Graceful abandonment
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-px">
        <SectionDivider variant="tilt" className="text-white " />
      </div>
    </section>
  );
}
