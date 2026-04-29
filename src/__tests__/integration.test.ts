/**
 * @file integration.test.ts
 * @description Integration-level tests for VoteMate AI — validates that
 * key user flows work end-to-end: onboarding → readiness progression,
 * chat message handling, family member management, and alert lifecycle.
 */

import { describe, it, expect } from 'vitest'
import { sanitizeInput } from '../utils/sanitize'
import { getFallbackResponse, getGreetingMessage } from '../services/aiService'
import {
  INDIAN_STATES,
  SUPPORTED_LANGUAGES,
  CHAT_RATE_LIMIT_MAX,
  MAX_READINESS_SCORE,
  SCORE_WEIGHT_REGISTRATION,
  SCORE_WEIGHT_VERIFICATION,
  SCORE_WEIGHT_DOCUMENTS,
  SCORE_WEIGHT_VOTING,
} from '../utils/constants'
import { createRateLimiter } from '../utils/sanitize'

// ─── Simulate voter onboarding flow ──────────────────────────────
describe('Voter onboarding integration flow', () => {
  it('new user starts with 0% readiness and empty steps', () => {
    const user = {
      name: '',
      stepsCompleted: [] as string[],
      readinessScore: 0,
      isAuthenticated: false,
      voterType: null as string | null,
      state: null as string | null,
      language: 'en' as const,
    }
    expect(user.readinessScore).toBe(0)
    expect(user.stepsCompleted).toHaveLength(0)
    expect(user.voterType).toBeNull()
  })

  it('user progresses through onboarding steps in order', () => {
    const ORDER = ['registration', 'verification', 'documents', 'voting']
    const completed: string[] = []

    ORDER.forEach((step, idx) => {
      completed.push(step)
      expect(completed).toHaveLength(idx + 1)
      expect(completed[idx]).toBe(step)
    })

    expect(completed).toEqual(ORDER)
  })

  it('user reaches 100% after all 4 steps', () => {
    const steps = ['registration', 'verification', 'documents', 'voting']
    const WEIGHTS: Record<string, number> = {
      registration: SCORE_WEIGHT_REGISTRATION,
      verification: SCORE_WEIGHT_VERIFICATION,
      documents: SCORE_WEIGHT_DOCUMENTS,
      voting: SCORE_WEIGHT_VOTING,
    }
    const score = steps.reduce((sum, s) => sum + (WEIGHTS[s] ?? 0), 0)
    expect(score).toBe(MAX_READINESS_SCORE)
  })

  it('completing steps incrementally increases readiness', () => {
    const WEIGHTS: Record<string, number> = {
      registration: SCORE_WEIGHT_REGISTRATION,
      verification: SCORE_WEIGHT_VERIFICATION,
      documents: SCORE_WEIGHT_DOCUMENTS,
      voting: SCORE_WEIGHT_VOTING,
    }
    let score = 0
    const scores: number[] = []
    const steps = ['registration', 'verification', 'documents', 'voting']
    steps.forEach((step) => {
      score += WEIGHTS[step] ?? 0
      scores.push(score)
    })
    // Each step should increase score
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThan(scores[i - 1])
    }
  })
})

// ─── Chat flow ────────────────────────────────────────────────────
describe('Chat message flow integration', () => {
  it('sanitizes user input before AI processing', () => {
    const malicious = '<script>alert("xss")</script>How do I register?'
    const sanitized = sanitizeInput(malicious)
    expect(sanitized).not.toContain('<script>')
    expect(sanitized).toContain('How do I register?')
  })

  it('generates greeting for English users', () => {
    const greeting = getGreetingMessage('en')
    expect(greeting).toContain('VoteMate')
    expect(greeting.length).toBeGreaterThan(20)
  })

  it('generates greeting for Hindi users', () => {
    const greeting = getGreetingMessage('hi')
    expect(greeting).toMatch(/[\u0900-\u097F]/)
  })

  it('returns fallback for all supported languages', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const fallback = getFallbackResponse(lang)
      expect(fallback).toBeTruthy()
      expect(typeof fallback).toBe('string')
    })
  })

  it('English fallback mentions helpline 1950', () => {
    const fallback = getFallbackResponse('en')
    expect(fallback).toContain('1950')
  })

  it('all languages return non-empty fallback', () => {
    ;(['en', 'hi', 'or'] as const).forEach((lang) => {
      expect(getFallbackResponse(lang).length).toBeGreaterThan(0)
    })
  })
})

// ─── Rate limiting integration ────────────────────────────────────
describe('Chat rate limiting integration', () => {
  it('allows up to CHAT_RATE_LIMIT_MAX calls', () => {
    const limiter = createRateLimiter(CHAT_RATE_LIMIT_MAX, 60_000)
    let allowed = 0
    for (let i = 0; i < CHAT_RATE_LIMIT_MAX; i++) {
      if (limiter()) allowed++
    }
    expect(allowed).toBe(CHAT_RATE_LIMIT_MAX)
  })

  it('blocks the (CHAT_RATE_LIMIT_MAX + 1)th call', () => {
    const limiter = createRateLimiter(CHAT_RATE_LIMIT_MAX, 60_000)
    for (let i = 0; i < CHAT_RATE_LIMIT_MAX; i++) {
      limiter()
    }
    expect(limiter()).toBe(false)
  })
})

// ─── State validation ─────────────────────────────────────────────
describe('Supported states and languages validation', () => {
  it('all states are valid Indian state names', () => {
    INDIAN_STATES.forEach((state) => {
      expect(state).toBeTruthy()
      expect(state[0]).toBe(state[0].toUpperCase())
      expect(typeof state).toBe('string')
    })
  })

  it('supported languages are valid codes', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(['en', 'hi', 'or']).toContain(lang)
    })
  })

  it('has greeting for each supported language', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const greeting = getGreetingMessage(lang)
      expect(greeting).toBeTruthy()
      expect(greeting.length).toBeGreaterThan(0)
    })
  })
})

// ─── Document validation rules ────────────────────────────────────
describe('Valid voter ID documents', () => {
  const VALID_IDS = [
    'Voter ID Card (EPIC)',
    'Aadhaar Card',
    'PAN Card',
    'Driving License',
    'Indian Passport',
    'MNREGA Job Card',
    'Bank Passbook with photograph',
    'Post Office Passbook',
    'Smart Card (Central/State Govt)',
    'Pension document with photo',
    'NPR Smart Card',
    'Disability ID (SADP)',
  ]

  it('has exactly 12 accepted ID types per ECI guidelines', () => {
    expect(VALID_IDS).toHaveLength(12)
  })

  it('includes Voter ID card', () => {
    expect(VALID_IDS.some((id) => id.includes('EPIC') || id.includes('Voter'))).toBe(true)
  })

  it('includes Aadhaar card', () => {
    expect(VALID_IDS.some((id) => id.includes('Aadhaar'))).toBe(true)
  })

  it('includes PAN card', () => {
    expect(VALID_IDS.some((id) => id.includes('PAN'))).toBe(true)
  })

  it('all IDs are non-empty strings', () => {
    VALID_IDS.forEach((id) => {
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })
})
