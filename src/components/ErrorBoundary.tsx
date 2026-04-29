/**
 * @file ErrorBoundary.tsx
 * @description React Error Boundary for VoteMate AI.
 * Catches unhandled React errors and renders a friendly fallback UI
 * instead of a blank screen, ensuring the app degrades gracefully.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  /** Optional fallback UI to render instead of the default error screen */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the error, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    // Log error details for debugging (production would send to error tracking)
    console.error('[VoteMate ErrorBoundary] Caught error:', error, errorInfo)
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  private handleGoHome = (): void => {
    this.handleReset()
    // Clear persisted store state and reload
    try {
      localStorage.removeItem('votemate-store')
    } catch {
      // localStorage may not be available
    }
    window.location.href = '/'
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-6 text-center"
        >
          {/* Error icon */}
          <div className="w-20 h-20 rounded-3xl bg-rose-100 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-rose-500" aria-hidden="true" />
          </div>

          <h1 className="text-xl font-poppins font-bold text-slate-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm font-inter text-slate-500 leading-relaxed mb-8 max-w-[280px]">
            VoteMate AI encountered an unexpected error. Your data is safe.
            Please try again or return to the home screen.
          </p>

          {/* Error details (only in development) */}
          {import.meta.env.DEV && this.state.error && (
            <details className="mb-6 w-full max-w-sm text-left">
              <summary className="text-xs font-inter text-slate-400 cursor-pointer mb-2">
                Technical details
              </summary>
              <pre className="text-xs bg-slate-100 p-3 rounded-xl overflow-auto text-rose-700 leading-relaxed">
                {this.state.error.message}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-poppins font-bold text-white transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}
              aria-label="Try again"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-poppins font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Go to home screen"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Return to Home
            </button>
          </div>

          {/* Helpline reference */}
          <p className="text-xs font-inter text-slate-400 mt-8">
            Need help? Call the voter helpline:{' '}
            <a
              href="tel:1950"
              className="text-indigo-600 font-semibold"
              aria-label="Call voter helpline 1950"
            >
              1950
            </a>
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
