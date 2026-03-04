'use client'

import { motion } from 'framer-motion'
import { FileCheck, ShieldCheck, BadgeCheck, Globe, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Verification } from '@/types'

interface VerificationChainProps {
  chain: Verification[]
}

const STAGE_ORDER: Verification['stage'][] = ['submitted', 'verified', 'accepted', 'on_ledger']

const STAGE_META: Record<
  Verification['stage'],
  { label: string; icon: React.ElementType; roleLabel: string }
> = {
  submitted: { label: 'Submitted', icon: FileCheck, roleLabel: 'Field Partner' },
  verified: { label: 'Verified', icon: ShieldCheck, roleLabel: 'Verifier' },
  accepted: { label: 'Accepted', icon: BadgeCheck, roleLabel: 'Issuer' },
  on_ledger: { label: 'On-Ledger', icon: Globe, roleLabel: 'Registry' },
}

export function VerificationChain({ chain }: VerificationChainProps) {
  if (chain.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No verification data available.
      </p>
    )
  }

  // Sort chain by stage order
  const sorted = [...chain].sort(
    (a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage)
  )

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start gap-0 min-w-[700px] py-2">
        {sorted.map((step, i) => {
          const meta = STAGE_META[step.stage]
          const Icon = meta.icon
          const truncHash =
            step.attestation_hash.length > 16
              ? `${step.attestation_hash.slice(0, 8)}...${step.attestation_hash.slice(-6)}`
              : step.attestation_hash
          const date = new Date(step.attested_at)

          return (
            <div key={step.id} className="flex items-start flex-1">
              {/* Stage card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                className="glass-card rounded-lg p-4 flex-1 min-w-[150px]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{meta.label}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {meta.roleLabel}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm font-medium">{step.party_name}</p>

                <div className="mt-3 space-y-1.5">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Attestation
                    </p>
                    <p className="font-mono text-xs text-foreground/60" title={step.attestation_hash}>
                      {truncHash}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Timestamp
                    </p>
                    <p className="text-xs text-foreground/60">
                      {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Connector with checkmark */}
              {i < sorted.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 + 0.3, duration: 0.3 }}
                  className="flex flex-col items-center justify-center px-2 pt-6 shrink-0"
                >
                  <div className="w-6 h-px bg-primary/40" />
                  <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center my-1">
                    <Check className="size-3 text-primary" />
                  </div>
                  <div className="w-6 h-px bg-primary/40" />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
