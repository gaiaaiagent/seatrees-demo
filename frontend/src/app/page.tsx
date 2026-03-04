'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Waves,
  ArrowRight,
  Globe,
  Shield,
  BookOpen,
} from 'lucide-react'

function useCountUpOnView(end: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])

  return { ref, value, inView }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

const features = [
  {
    icon: Globe,
    title: 'Portfolio Tracking',
    description:
      'Track 24 projects across 6 marine ecosystems with real-time monitoring data.',
  },
  {
    icon: Shield,
    title: 'On-Chain Verification',
    description:
      'Every credit verified on Regen Network blockchain with full attestation chains.',
  },
  {
    icon: BookOpen,
    title: 'Impact Stories',
    description:
      'Auto-generated content for your comms team, from PMU updates to explainers.',
  },
]

const stats = [
  { value: 24, label: 'Projects', suffix: '' },
  { value: 6, label: 'Ecosystems', suffix: '' },
  { value: 53200, label: 'Blocks Retired', suffix: '+' },
  { value: 159, label: 'Revenue ($K)', suffix: 'K+' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.3_0.1_200)_0%,transparent_70%)] opacity-40" />
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ type: 'spring', stiffness: 80, damping: 20 }}>
            <Waves className="h-16 w-16 text-primary" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            {['SeaTrees'].map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-3"
                variants={fadeUp}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 20,
                  delay: 0.15 + i * 0.12,
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-xl"
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.4 }}
          >
            Marine Biodiversity Intelligence
          </motion.p>

          <motion.p
            className="text-sm text-muted-foreground max-w-lg"
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.5 }}
          >
            Track marine conservation projects, verify carbon credits on-chain,
            and generate impact stories -- all powered by Regen Network.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.65 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:shadow-[0_0_24px_rgba(6,182,212,0.3)] hover:brightness-110 transition-all"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, suffix }) => (
              <StatCard key={label} value={value} label={label} suffix={suffix} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-2xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            Platform Capabilities
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                className="glass-card group relative rounded-xl p-6 transition-shadow hover:shadow-[0_0_24px_rgba(6,182,212,0.15)]"
                variants={fadeUp}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              >
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 px-6 text-center">
        <motion.div
          className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Waves className="h-4 w-4 text-primary" />
          Powered by Regen Network
        </motion.div>
      </section>
    </div>
  )
}

function StatCard({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const { ref, value: animatedValue, inView } = useCountUpOnView(value)

  return (
    <motion.div
      className="glass-card flex flex-col items-center gap-1 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
    >
      <span ref={ref} className="text-4xl font-bold text-primary">
        {inView ? animatedValue.toLocaleString() : 0}{suffix}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </motion.div>
  )
}
