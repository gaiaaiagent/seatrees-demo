'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageTransition } from '@/components/shared/PageTransition'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LiveQueryPanel } from '@/components/verification/LiveQueryPanel'
import { BatchTimeline } from '@/components/verification/BatchTimeline'
import { RetirementWaterfall } from '@/components/verification/RetirementWaterfall'
import { VerificationChain } from '@/components/verification/VerificationChain'
import type { Credit, VerificationGroup } from '@/types'

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-xl border bg-muted ${className ?? ''}`} />
  )
}

function ConnectingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground mb-4" />
      <p className="text-sm font-medium">Connecting to data service...</p>
      <p className="text-xs mt-1">Please wait while we load verification data</p>
    </div>
  )
}

export default function VerificationPage() {
  const [credits, setCredits] = useState<Credit[] | null>(null)
  const [verifications, setVerifications] = useState<VerificationGroup[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api<Credit[]>('/api/credits'),
      api<VerificationGroup[]>('/api/verifications'),
    ])
      .then(([creditData, verificationData]) => {
        setCredits(creditData)
        setVerifications(verificationData)
      })
      .catch((e) => setError(e?.message ?? 'Failed to load data'))
  }, [])

  // Compute totals from credits
  const totalIssued = credits?.reduce((sum, c) => sum + c.total_issued, 0) ?? 0
  const totalRetired = credits?.reduce((sum, c) => sum + c.total_retired, 0) ?? 0
  const totalTradeable = credits?.reduce((sum, c) => sum + c.total_tradeable, 0) ?? 0

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">On-Chain Verification</h1>
          <p className="text-muted-foreground mt-1">Live queries to the Regen Network blockchain</p>
        </div>
        <ConnectingState />
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-2xl font-semibold">On-Chain Verification</h1>
          <p className="text-muted-foreground mt-1">
            Live queries to the Regen Network blockchain
          </p>
        </div>

        {/* Hero: Live Query Panel */}
        <ErrorBoundary>
          <LiveQueryPanel />
        </ErrorBoundary>

        {/* Batch Timeline + Retirement Waterfall */}
        {credits === null ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkeletonBlock className="min-h-[250px]" />
            <SkeletonBlock className="min-h-[250px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    Credit Batches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BatchTimeline batches={credits} />
                </CardContent>
              </Card>
            </ErrorBoundary>

            <ErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    Retirement Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RetirementWaterfall
                    totalIssued={totalIssued}
                    totalRetired={totalRetired}
                    totalTradeable={totalTradeable}
                  />
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>
        )}

        {/* Verification Chain */}
        {verifications === null ? (
          <SkeletonBlock className="min-h-[200px]" />
        ) : (
          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Verification Chain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VerificationChain groups={verifications} />
              </CardContent>
            </Card>
          </ErrorBoundary>
        )}
      </div>
    </PageTransition>
  )
}
