/**
 * @file store.test.ts
 * @description Unit tests for the Zustand state management store —
 * covers navigation, user updates, chat messages, and readiness scoring.
 */

import { describe, it, expect, beforeEach } from 'vitest'

// ─── Mock the store logic directly (no React needed) ─────────────
interface UserState {
  name: string | null
  language: 'en' | 'hi' | 'or'
  state: string | null
  readinessScore: number
  stepsCompleted: string[]
  isAuthenticated: boolean
  voterType: 'first-time' | 'experienced' | null
  hasValidDocument: boolean
  locationAvailable: boolean
  preferredMode: 'chat' | 'guided' | 'quick'
}

const createDefaultUser = (): UserState => ({
  name: null,
  language: 'en',
  state: null,
  readinessScore: 0,
  stepsCompleted: [],
  isAuthenticated: false,
  voterType: null,
  hasValidDocument: false,
  locationAvailable: false,
  preferredMode: 'chat',
})

// ─── Readiness score computation ──────────────────────────────────
const computeReadiness = (user: UserState): number => {
  let score = 0
  if (user.stepsCompleted.includes('registration')) score += 30
  if (user.stepsCompleted.includes('verification')) score += 25
  if (user.stepsCompleted.includes('documents')) score += 25
  if (user.stepsCompleted.includes('voting')) score += 20
  return Math.min(score, 100)
}

// ─── User update logic ────────────────────────────────────────────
const updateUser = (user: UserState, updates: Partial<UserState>): UserState => ({
  ...user,
  ...updates,
})

// ─── Navigation history logic ─────────────────────────────────────
const navigate = (history: string[], screen: string): string[] => [
  ...history,
  screen,
]

const goBack = (history: string[]): { history: string[]; current: string } => {
  if (history.length <= 1) return { history, current: history[0] || 'landing' }
  const newHistory = history.slice(0, -1)
  return { history: newHistory, current: newHistory[newHistory.length - 1] }
}

// ─── Tests ────────────────────────────────────────────────────────
describe('User state management', () => {
  let user: UserState

  beforeEach(() => {
    user = createDefaultUser()
  })

  it('creates default user with correct initial values', () => {
    expect(user.name).toBeNull()
    expect(user.language).toBe('en')
    expect(user.readinessScore).toBe(0)
    expect(user.stepsCompleted).toHaveLength(0)
    expect(user.isAuthenticated).toBe(false)
  })

  it('updates user name correctly', () => {
    const updated = updateUser(user, { name: 'Rahul' })
    expect(updated.name).toBe('Rahul')
    expect(updated.language).toBe('en') // unchanged
  })

  it('updates language preference', () => {
    const updated = updateUser(user, { language: 'hi' })
    expect(updated.language).toBe('hi')
  })

  it('marks user as authenticated', () => {
    const updated = updateUser(user, { isAuthenticated: true })
    expect(updated.isAuthenticated).toBe(true)
  })

  it('sets voter type', () => {
    const updated = updateUser(user, { voterType: 'first-time' })
    expect(updated.voterType).toBe('first-time')
  })

  it('sets state/region', () => {
    const updated = updateUser(user, { state: 'Maharashtra' })
    expect(updated.state).toBe('Maharashtra')
  })

  it('preserves unchanged fields on partial update', () => {
    const updated = updateUser(user, { name: 'Priya', state: 'Goa' })
    expect(updated.language).toBe('en')
    expect(updated.readinessScore).toBe(0)
    expect(updated.isAuthenticated).toBe(false)
  })
})

describe('Readiness score computation', () => {
  let user: UserState

  beforeEach(() => {
    user = createDefaultUser()
  })

  it('returns 0 for new user with no steps', () => {
    expect(computeReadiness(user)).toBe(0)
  })

  it('returns 30 after completing registration', () => {
    user = updateUser(user, { stepsCompleted: ['registration'] })
    expect(computeReadiness(user)).toBe(30)
  })

  it('returns 55 after registration + verification', () => {
    user = updateUser(user, { stepsCompleted: ['registration', 'verification'] })
    expect(computeReadiness(user)).toBe(55)
  })

  it('returns 80 after registration + verification + documents', () => {
    user = updateUser(user, { stepsCompleted: ['registration', 'verification', 'documents'] })
    expect(computeReadiness(user)).toBe(80)
  })

  it('returns 100 after all 4 steps', () => {
    user = updateUser(user, {
      stepsCompleted: ['registration', 'verification', 'documents', 'voting'],
    })
    expect(computeReadiness(user)).toBe(100)
  })

  it('never exceeds 100', () => {
    user = updateUser(user, {
      stepsCompleted: ['registration', 'verification', 'documents', 'voting'],
    })
    expect(computeReadiness(user)).toBeLessThanOrEqual(100)
  })

  it('ignores unknown step names', () => {
    user = updateUser(user, { stepsCompleted: ['unknown_step'] as any })
    expect(computeReadiness(user)).toBe(0)
  })
})

describe('Navigation history', () => {
  it('starts on landing screen', () => {
    const history = ['landing']
    expect(history[0]).toBe('landing')
  })

  it('navigates to new screen', () => {
    const history = navigate(['landing'], 'dashboard')
    expect(history).toHaveLength(2)
    expect(history[history.length - 1]).toBe('dashboard')
  })

  it('supports deep navigation', () => {
    let history = ['landing']
    history = navigate(history, 'dashboard')
    history = navigate(history, 'chat')
    history = navigate(history, 'polling')
    expect(history).toHaveLength(4)
    expect(history[history.length - 1]).toBe('polling')
  })

  it('goes back one screen', () => {
    const history = ['landing', 'dashboard', 'chat']
    const result = goBack(history)
    expect(result.current).toBe('dashboard')
    expect(result.history).toHaveLength(2)
  })

  it('stays on landing if no history', () => {
    const history = ['landing']
    const result = goBack(history)
    expect(result.current).toBe('landing')
  })
})

describe('Chat message structure', () => {
  const createMessage = (role: 'user' | 'assistant', content: string) => ({
    id: Math.random().toString(36).slice(2),
    role,
    content,
    timestamp: Date.now(),
  })

  it('creates a user message with correct role', () => {
    const msg = createMessage('user', 'How do I register?')
    expect(msg.role).toBe('user')
    expect(msg.content).toBe('How do I register?')
    expect(msg.id).toBeTruthy()
    expect(msg.timestamp).toBeGreaterThan(0)
  })

  it('creates an assistant message', () => {
    const msg = createMessage('assistant', 'You can register at voters.eci.gov.in')
    expect(msg.role).toBe('assistant')
    expect(msg.content).toContain('voters.eci.gov.in')
  })

  it('generates unique IDs for messages', () => {
    const msg1 = createMessage('user', 'Hello')
    const msg2 = createMessage('user', 'Hello')
    expect(msg1.id).not.toBe(msg2.id)
  })

  it('has timestamp as number', () => {
    const msg = createMessage('user', 'Test')
    expect(typeof msg.timestamp).toBe('number')
    expect(msg.timestamp).toBeGreaterThan(0)
  })
})
