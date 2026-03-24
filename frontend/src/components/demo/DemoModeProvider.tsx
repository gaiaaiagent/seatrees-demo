'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface DemoModeContextValue {
  enabled: boolean
  toggle: () => void
}

const DemoModeContext = createContext<DemoModeContextValue>({
  enabled: false,
  toggle: () => {},
})

export function useDemoMode() {
  return useContext(DemoModeContext)
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  return (
    <DemoModeContext.Provider value={{ enabled, toggle: () => setEnabled((v) => !v) }}>
      {children}
      {enabled && <DemoModeBanner />}
    </DemoModeContext.Provider>
  )
}

function DemoModeBanner() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[var(--st-primary)] px-5 py-2 text-sm font-medium text-white shadow-lg flex items-center gap-2">
      <span className="size-2 rounded-full bg-white/60 animate-pulse" />
      Demo Mode — Customize for your audience
    </div>
  )
}
