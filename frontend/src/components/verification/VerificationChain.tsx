'use client'

import { motion } from 'framer-motion'
import { FileCheck, ShieldCheck, BadgeCheck, Globe, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Verification, VerificationGroup } from '@/types'

interface VerificationChainProps {
  groups: VerificationGroup[]
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

function ChainRow({ group }: { group: VerificationGroup }) {
  const sorted = [...group.chain].sort(
    (a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage)
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-[var(--st-text)]">{group.project_name}</p>
        <Badge variant="secondary" className="font-mono text-[10px]">
          {group.batch_denom.length > 24
            ? `${group.batch_denom.slice(0, 12)}...${group.batch_denom.slice(-8)}`
            : group.batch_denom}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-start gap-0 min-w-[600px] py-1">
          {sorted.map((step, i) => {
            const meta = STAGE_META[step.stage]
            if (!meta) return null
            const Icon = meta.icon
            const truncHash = step.attestation_hash
              ? step.attestation_hash.length > 16
                ? `${step.attestation_hash.slice(0, 8)}...${step.attestation_hash.slice(-6)}`
                : step.attestation_hash
              : '—'
            const date = new Date(step.attested_at)

            return (
              <div key={step.id ?? `${step.stage}-${i}`} className="flex items-start flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.35 }}
                  className="rounded-lg p-3 flex-1 min-w-[130px] bg-[var(--st-card)] border border-[var(--st-border)] shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-7 rounded-full bg-[var(--st-primary-pale)] flex items-center justify-center">
                      <Icon className="size-3.5 text-[var(--st-primary)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--st-text)]">{meta.label}</p>
                      <Badge variant="secondary" className="text-[9px] px-1 py-0">
                        {meta.roleLabel}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-[var(--st-text)]">{step.party_name}</p>

                  <div className="mt-2 space-y-1">
                    <div>
                      <p className="text-[9px] text-[var(--st-text-muted)] uppercase tracking-wide">
                        Attestation
                      </p>
                      <p className="font-mono text-[10px] text-[var(--st-text-muted)]" title={step.attestation_hash}>
                        {truncHash}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--st-text-muted)] uppercase tracking-wide">
                        Timestamp
                      </p>
                      <p className="text-[10px] text-[var(--st-text-muted)]">
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {i < sorted.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 + 0.2, duration: 0.25 }}
                    className="flex flex-col items-center justify-center px-1.5 pt-5 shrink-0"
                  >
                    <div className="w-4 h-px bg-[var(--st-primary)]/40" />
                    <div className="size-4 rounded-full bg-[var(--st-primary-pale)] flex items-center justify-center my-0.5">
                      <Check className="size-2.5 text-[var(--st-primary)]" />
                    </div>
                    <div className="w-4 h-px bg-[var(--st-primary)]/40" />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function VerificationChain({ groups }: VerificationChainProps) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-[var(--st-text-muted)] text-center py-8">
        No verification data available.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <ChainRow key={group.batch_denom} group={group} />
      ))}
    </div>
  )
}
