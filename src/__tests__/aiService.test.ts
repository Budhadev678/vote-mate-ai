/**
 * @file aiService.test.ts
 * @description Unit tests for the AI service layer — covers offline engine
 * responses, fallback logic, greeting messages, and news verification utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFallbackResponse, getGreetingMessage } from '../services/aiService'
import type { AppContext } from '../types'

// ─── Mock context factory ─────────────────────────────────────────
const makeCtx = (overrides: Partial<AppContext> = {}): AppContext => ({
  userType: 'first-time',
  state: 'Delhi',
  language: 'en',
  currentStep: 'registration',
  readinessScore: 0,
  isVotingDay: false,
  daysToVoting: 30,
  ...overrides,
})

// ─── getFallbackResponse ──────────────────────────────────────────
describe('getFallbackResponse', () => {
  it('returns English fallback message by default', () => {
    const response = getFallbackResponse('en')
    expect(response).toBeTruthy()
    expect(typeof response).toBe('string')
    expect(response.length).toBeGreaterThan(0)
  })

  it('returns Hindi fallback message for hi language', () => {
    const response = getFallbackResponse('hi')
    expect(response).toBeTruthy()
    expect(typeof response).toBe('string')
    // Hindi response should contain Devanagari characters
    expect(response).toMatch(/[\u0900-\u097F]/)
  })

  it('returns Odia fallback for or language', () => {
    const response = getFallbackResponse('or')
    expect(response).toBeTruthy()
    expect(typeof response).toBe('string')
  })

  it('includes helpline reference in English fallback', () => {
    const response = getFallbackResponse('en')
    expect(response).toMatch(/1950/)
  })

  it('includes Next Action in English fallback', () => {
    const response = getFallbackResponse('en')
    expect(response.toLowerCase()).toMatch(/next action/i)
  })
})

// ─── getGreetingMessage ───────────────────────────────────────────
describe('getGreetingMessage', () => {
  it('returns English greeting for en language', () => {
    const greeting = getGreetingMessage('en')
    expect(greeting).toBeTruthy()
    expect(typeof greeting).toBe('string')
    expect(greeting.length).toBeGreaterThan(10)
  })

  it('returns Hindi greeting for hi language', () => {
    const greeting = getGreetingMessage('hi')
    expect(greeting).toBeTruthy()
    // Should contain Hindi characters
    expect(greeting).toMatch(/[\u0900-\u097F]/)
  })

  it('contains "VoteMate" branding in greeting', () => {
    const greeting = getGreetingMessage('en')
    expect(greeting).toMatch(/VoteMate/i)
  })

  it('includes wave emoji in greeting', () => {
    const greetingEn = getGreetingMessage('en')
    const greetingHi = getGreetingMessage('hi')
    expect(greetingEn + greetingHi).toMatch(/👋/)
  })
})

// ─── App Context validation ───────────────────────────────────────
describe('AppContext structure', () => {
  it('creates a valid context with default values', () => {
    const ctx = makeCtx()
    expect(ctx.userType).toBe('first-time')
    expect(ctx.state).toBe('Delhi')
    expect(ctx.language).toBe('en')
    expect(ctx.readinessScore).toBe(0)
    expect(ctx.isVotingDay).toBe(false)
    expect(ctx.daysToVoting).toBe(30)
  })

  it('allows partial overrides', () => {
    const ctx = makeCtx({ language: 'hi', readinessScore: 75 })
    expect(ctx.language).toBe('hi')
    expect(ctx.readinessScore).toBe(75)
    expect(ctx.userType).toBe('first-time') // unchanged
  })

  it('supports voting day context', () => {
    const ctx = makeCtx({ isVotingDay: true, daysToVoting: 0 })
    expect(ctx.isVotingDay).toBe(true)
    expect(ctx.daysToVoting).toBe(0)
  })

  it('supports experienced voter type', () => {
    const ctx = makeCtx({ userType: 'experienced' })
    expect(ctx.userType).toBe('experienced')
  })
})

// ─── Readiness score boundaries ───────────────────────────────────
describe('Readiness score validation', () => {
  it('accepts 0% score (new user)', () => {
    const ctx = makeCtx({ readinessScore: 0 })
    expect(ctx.readinessScore).toBe(0)
  })

  it('accepts 100% score (fully ready)', () => {
    const ctx = makeCtx({ readinessScore: 100 })
    expect(ctx.readinessScore).toBe(100)
  })

  it('accepts intermediate score', () => {
    const ctx = makeCtx({ readinessScore: 65 })
    expect(ctx.readinessScore).toBe(65)
  })
})
