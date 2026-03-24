'use client'

import { useDemoMode } from './DemoModeProvider'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export function DemoModePanel() {
  const { enabled, toggle } = useDemoMode()

  return (
    <Button
      variant={enabled ? 'default' : 'outline'}
      size="sm"
      onClick={toggle}
      data-tour="demo-toggle"
      className="gap-1.5 text-xs"
    >
      {enabled ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
      {enabled ? 'Exit Demo' : 'Demo Mode'}
    </Button>
  )
}
