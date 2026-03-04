'use client'

import { Users, Heart, Sprout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Project } from '@/types'

interface CommunityImpactProps {
  project: Project
}

const PARTNER_INFO: Record<string, { fullName: string; description: string }> = {
  COBEC: {
    fullName: 'Community Based Environmental Conservation',
    description:
      'COBEC works with the Marereni community in Kilifi County, Kenya, to restore degraded mangrove ecosystems while providing sustainable livelihoods. Community members are trained in mangrove propagation, planting, and monitoring, ensuring local ownership of the restoration process.',
  },
}

export function CommunityImpact({ project }: CommunityImpactProps) {
  const info = PARTNER_INFO[project.partner] ?? {
    fullName: project.partner,
    description: `${project.partner} is the local implementation partner for this project, working directly with communities to ensure successful restoration and long-term stewardship.`,
  }

  return (
    <Card className="border-emerald-500/20">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
          Community Partnership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xl font-semibold">{project.partner}</p>
          <p className="text-sm text-muted-foreground">{info.fullName}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="glass-card rounded-lg p-3 flex items-start gap-3">
            <div className="size-8 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Heart className="size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">50%+ Revenue</p>
              <p className="text-xs text-muted-foreground">Directed to local community</p>
            </div>
          </div>
          <div className="glass-card rounded-lg p-3 flex items-start gap-3">
            <div className="size-8 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Users className="size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Local Stewardship</p>
              <p className="text-xs text-muted-foreground">Community-led monitoring</p>
            </div>
          </div>
          <div className="glass-card rounded-lg p-3 flex items-start gap-3">
            <div className="size-8 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sprout className="size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Livelihood Support</p>
              <p className="text-xs text-muted-foreground">Training & employment</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
      </CardContent>
    </Card>
  )
}
