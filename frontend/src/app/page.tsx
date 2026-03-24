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
  PlayCircle,
  Sun,
  Moon,
  Database,
  Map,
  Sparkles,
  LinkIcon,
  Cpu,
  Rocket,
} from 'lucide-react'
import { useTheme } from '@/components/shared/ThemeProvider'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
  const { theme, toggle: toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-[var(--st-bg)] text-[var(--st-text)] overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--st-primary)]/5 via-transparent to-transparent" />
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 z-20 flex size-9 items-center justify-center rounded-lg border border-[var(--st-border)] bg-[var(--st-card)] text-[var(--st-text-muted)] shadow-sm transition-colors hover:text-[var(--st-text)]"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} transition={{ type: 'spring', stiffness: 80, damping: 20 }}>
            <div className="flex size-20 items-center justify-center rounded-2xl bg-[var(--st-primary)] shadow-lg">
              <Waves className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--st-text)]">
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
            className="text-lg text-[var(--st-text-muted)] max-w-xl"
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.4 }}
          >
            Marine Biodiversity Intelligence
          </motion.p>

          <motion.p
            className="text-sm text-[var(--st-text-muted)] max-w-lg"
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.5 }}
          >
            Track marine conservation projects, verify carbon credits on-chain,
            and generate impact stories — all powered by Regen Network.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
            variants={fadeUp}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.65 }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--st-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:brightness-110 transition-all"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              onClick={() => {
                // Clear tour flag so it auto-starts
                localStorage.removeItem('seatrees-tour-completed')
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--st-border)] bg-[var(--st-card)] px-6 py-3 text-sm font-semibold text-[var(--st-primary)] shadow-sm hover:shadow-md transition-all"
            >
              <PlayCircle className="h-4 w-4" />
              Start Tour
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, suffix }) => (
              <StatCard key={label} value={value} label={label} suffix={suffix} />
            ))}
          </div>
        </div>
      </section>

      {/* Intro Tabs */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList variant="line" className="mx-auto mb-10 justify-center">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="how">How It Works</TabsTrigger>
                <TabsTrigger value="tech">Tech Stack</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <p className="text-center text-sm text-[var(--st-text-muted)] max-w-2xl mx-auto mb-10">
                  SeaTrees brings marine conservation data, blockchain verification, and impact storytelling into one intelligence platform.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {features.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="group relative rounded-xl bg-[var(--st-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--st-border)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                    >
                      <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--st-primary-pale)] mb-4">
                        <Icon className="h-5 w-5 text-[var(--st-primary)]" />
                      </div>
                      <h3 className="font-semibold mb-2 text-[var(--st-text)]">{title}</h3>
                      <p className="text-sm text-[var(--st-text-muted)]">{description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="how">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      step: 1,
                      icon: Database,
                      title: 'Data Collection',
                      description: 'Real-time monitoring from 24 sites across 6 marine ecosystems — mangroves, kelp, coral, seagrass, watersheds, and shellfish reefs.',
                    },
                    {
                      step: 2,
                      icon: LinkIcon,
                      title: 'On-Chain Verification',
                      description: 'Biodiversity credits issued and retired on Regen Network, with full attestation chains and batch-level traceability.',
                    },
                    {
                      step: 3,
                      icon: Cpu,
                      title: 'Intelligence Dashboard',
                      description: 'Real-time portfolio insights, market analytics, and AI-generated impact stories — all in one platform.',
                    },
                  ].map(({ step, icon: Icon, title, description }) => (
                    <div
                      key={step}
                      className="relative rounded-xl bg-[var(--st-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--st-border)]"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[var(--st-primary)] text-sm font-bold text-white">
                          {step}
                        </span>
                        <Icon className="h-5 w-5 text-[var(--st-primary)]" />
                      </div>
                      <h3 className="font-semibold mb-2 text-[var(--st-text)]">{title}</h3>
                      <p className="text-sm text-[var(--st-text-muted)]">{description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tech">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { name: 'Regen Network', icon: Globe },
                    { name: 'Next.js', icon: Rocket },
                    { name: 'PostgreSQL', icon: Database },
                    { name: 'MapLibre', icon: Map },
                    { name: 'Framer Motion', icon: Sparkles },
                    { name: 'Vercel', icon: ArrowRight },
                  ].map(({ name, icon: Icon }) => (
                    <div
                      key={name}
                      className="flex flex-col items-center gap-2 rounded-xl bg-[var(--st-card)] p-4 shadow-[var(--shadow-card)] border border-[var(--st-border)]"
                    >
                      <Icon className="h-6 w-6 text-[var(--st-primary)]" />
                      <span className="text-xs font-medium text-[var(--st-text)]">{name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 px-6 text-center">
        <motion.div
          className="flex items-center justify-center gap-2 text-xs text-[var(--st-text-muted)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Waves className="h-4 w-4 text-[var(--st-primary)]" />
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
      className="flex flex-col items-center gap-1 rounded-xl bg-[var(--st-card)] p-6 shadow-[var(--shadow-card)] border border-[var(--st-border)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
    >
      <span ref={ref} className="text-4xl font-bold text-[var(--st-primary)]">
        {inView ? animatedValue.toLocaleString() : 0}{suffix}
      </span>
      <span className="text-sm text-[var(--st-text-muted)]">{label}</span>
    </motion.div>
  )
}
