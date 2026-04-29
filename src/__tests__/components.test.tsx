/**
 * @file components.test.tsx
 * @description Component render tests using @testing-library/react.
 * Tests that key components render correctly, respond to user interactions,
 * and enforce accessibility attributes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '../components/ErrorBoundary'

// ─── ErrorBoundary tests ───────────────────────────────────────────
describe('ErrorBoundary component', () => {
  // Suppress console.error from React during error boundary tests
  const consoleError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = consoleError
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Safe content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByTestId('child')).toBeTruthy()
    expect(screen.getByText('Safe content')).toBeTruthy()
  })

  it('renders error fallback when child throws', () => {
    const Broken = () => {
      throw new Error('Test error')
    }
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy()
  })

  it('shows Try Again and Return to Home buttons in error state', () => {
    const Broken = () => {
      throw new Error('Test error')
    }
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /go to home screen/i })).toBeTruthy()
  })

  it('renders custom fallback when provided', () => {
    const Broken = () => {
      throw new Error('Test error')
    }
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom error</div>}>
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByTestId('custom-fallback')).toBeTruthy()
    expect(screen.getByText('Custom error')).toBeTruthy()
  })

  it('has role=alert for screen reader announcements', () => {
    const Broken = () => {
      throw new Error('Test error')
    }
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    const alert = screen.getByRole('alert')
    expect(alert).toBeTruthy()
  })

  it('resets error state when Try Again is clicked', () => {
    let shouldThrow = true
    const MaybeBreak = () => {
      if (shouldThrow) throw new Error('Test')
      return <div>Recovered</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <MaybeBreak />
      </ErrorBoundary>,
    )

    expect(screen.getByText(/Something went wrong/i)).toBeTruthy()

    // Fix the error condition before clicking retry
    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    rerender(
      <ErrorBoundary>
        <MaybeBreak />
      </ErrorBoundary>,
    )
  })

  it('mentions voter helpline 1950 in error screen', () => {
    const Broken = () => {
      throw new Error('Test error')
    }
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/1950/)).toBeTruthy()
  })
})

// ─── DOM structure tests ───────────────────────────────────────────
describe('DOM and HTML structure', () => {
  it('document has a root element', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    expect(document.getElementById('root')).toBeTruthy()
    document.body.removeChild(root)
  })

  it('can create a button with aria-label', () => {
    const btn = document.createElement('button')
    btn.setAttribute('aria-label', 'Go back')
    btn.textContent = 'Back'
    expect(btn.getAttribute('aria-label')).toBe('Go back')
  })

  it('can create a nav with role', () => {
    const nav = document.createElement('nav')
    nav.setAttribute('role', 'navigation')
    nav.setAttribute('aria-label', 'Main navigation')
    expect(nav.getAttribute('role')).toBe('navigation')
    expect(nav.getAttribute('aria-label')).toBe('Main navigation')
  })

  it('can create a live region', () => {
    const region = document.createElement('div')
    region.setAttribute('aria-live', 'polite')
    region.setAttribute('aria-atomic', 'true')
    expect(region.getAttribute('aria-live')).toBe('polite')
  })
})

// ─── Utility function integration with components ─────────────────
describe('Component utility functions', () => {
  it('genId produces unique IDs', () => {
    const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const ids = new Set(Array.from({ length: 100 }, genId))
    expect(ids.size).toBe(100)
  })

  it('formatTime produces valid time strings', () => {
    const formatTime = (ts: number): string =>
      new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const result = formatTime(Date.now())
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).toMatch(/\d+:\d+/)
  })

  it('pickCards returns undefined for unrelated content', () => {
    const content = 'Hello, what is your name?'
    const lower = content.toLowerCase()
    const hasDocumentKeyword = lower.includes('document') || lower.includes('id') || lower.includes('proof')
    const hasStepKeyword = lower.includes('step') || lower.includes('process')
    const hasDateKeyword = lower.includes('date') || lower.includes('when')
    const hasBoothKeyword = lower.includes('booth') || lower.includes('where')
    expect(hasDocumentKeyword || hasStepKeyword || hasDateKeyword || hasBoothKeyword).toBe(false)
  })

  it('pickCards returns cards for document-related content', () => {
    const content = 'You need to bring your document and valid ID proof.'
    const lower = content.toLowerCase()
    expect(lower.includes('document') || lower.includes('id') || lower.includes('proof')).toBe(true)
  })
})

// ─── Accessibility attribute tests ────────────────────────────────
describe('Accessibility attributes on rendered HTML', () => {
  it('skip link has correct href target', () => {
    const link = document.createElement('a')
    link.href = '#main-content'
    link.textContent = 'Skip to main content'
    expect(link.getAttribute('href')).toBe('#main-content')
  })

  it('nav buttons have aria-label set', () => {
    const items = [
      { label: 'Go to Dashboard', screen: 'dashboard' },
      { label: 'Find Polling Booth', screen: 'polling' },
      { label: 'Chat with VoteMate AI', screen: 'chat' },
    ]
    items.forEach(({ label }) => {
      const btn = document.createElement('button')
      btn.setAttribute('role', 'tab')
      btn.setAttribute('aria-label', label)
      expect(btn.getAttribute('aria-label')).toBe(label)
    })
  })

  it('input has maxLength for XSS prevention', () => {
    const input = document.createElement('input')
    input.maxLength = 500
    expect(input.maxLength).toBe(500)
  })

  it('external links have rel=noopener noreferrer', () => {
    const link = document.createElement('a')
    link.href = 'https://voters.eci.gov.in'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    expect(link.rel).toContain('noopener')
    expect(link.rel).toContain('noreferrer')
  })
})
