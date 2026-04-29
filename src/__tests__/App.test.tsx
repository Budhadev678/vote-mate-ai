import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock the window.matchMedia since JSDOM doesn't support it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App Root Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    
    // We should expect some basic application elements to exist
    // By default, it either renders the onboarding screen or dashboard
    // depending on the initial Zustand store state.
    expect(document.body).toBeInTheDocument()
  })
})
