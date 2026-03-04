'use client'
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          <div className="text-center">
            <p className="text-sm font-medium">Something went wrong loading this section.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 text-xs underline"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
