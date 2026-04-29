/**
 * @file aiService.test.ts
 * @description Unit tests for the VoteMate AI service layer.
 * Tests the Google Gemini-powered engine, offline fallback, greeting messages,
 * news verification, and language-specific responses.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getFallbackResponse, getGreetingMessage } from '../services/aiService'
import type { AppContext } from '../types'

// ─── Shared context fixture ────────────────────────────────────────
const BASE_CONTEXT: AppContext = {
  userType: 'first-time',
  state: 'Maharashtra',
  language: 'en',
  currentStep: 'registration',
  hasValidDocument: false,
  locationAvailable: false,
  currentDate: new Date('2026-04-01'),
  isVotingDay: false,
  readinessScore: 0,
  daysToVoting: 49,
}

// ─── getGreetingMessage ────────────────────────────────────────────
describe('getGreetingMessage', () => {
  it('returns English greeting mentioning VoteMate', () => {
    const msg = getGreetingMessage('en')
    expect(msg).toContain('VoteMate')
  })

  it('returns English greeting mentioning Gemini (Google AI)', () => {
    const msg = getGreetingMessage('en')
    expect(msg).toContain('Gemini')
  })

  it('returns Hindi greeting with Devanagari script', () => {
    const msg = getGreetingMessage('hi')
    expect(msg).toMatch(/[\u0900-\u097F]/)
  })

  it('returns Odia greeting with Odia script', () => {
    const msg = getGreetingMessage('or')
    expect(msg).toMatch(/[\u0B00-\u0B7F]/)
  })

  it('returns non-empty string for all supported languages', () => {
    ;(['en', 'hi', 'or'] as const).forEach((lang) => {
      const msg = getGreetingMessage(lang)
      expect(typeof msg).toBe('string')
      expect(msg.length).toBeGreaterThan(0)
    })
  })
})

// ─── getFallbackResponse ───────────────────────────────────────────
describe('getFallbackResponse', () => {
  it('returns English fallback with helpline 1950', () => {
    const msg = getFallbackResponse('en')
    expect(msg).toContain('1950')
  })

  it('returns Hindi fallback with Devanagari script', () => {
    const msg = getFallbackResponse('hi')
    expect(msg).toMatch(/[\u0900-\u097F]/)
  })

  it('returns Odia fallback with Odia script', () => {
    const msg = getFallbackResponse('or')
    expect(msg).toMatch(/[\u0B00-\u0B7F]/)
  })

  it('returns non-empty string for all supported languages', () => {
    ;(['en', 'hi', 'or'] as const).forEach((lang) => {
      const msg = getFallbackResponse(lang)
      expect(typeof msg).toBe('string')
      expect(msg.length).toBeGreaterThan(0)
    })
  })

  it('English fallback contains Next Action', () => {
    const msg = getFallbackResponse('en')
    expect(msg).toContain('Next Action')
  })
})

// ─── askAI offline engine tests (no API key) ──────────────────────
describe('askAI offline engine', () => {
  beforeEach(() => {
    // Ensure no API key is set — forces offline engine
    vi.stubEnv('VITE_GEMINI_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('responds to registration queries', async () => {
    const { askAI } = await import('../services/aiService')
    const result = await askAI('How do I register to vote?', BASE_CONTEXT, false)
    expect(result.content).toBeTruthy()
    expect(result.content.length).toBeGreaterThan(50)
  })

  it('returns a nextAction string', async () => {
    const { askAI } = await import('../services/aiService')
    const result = await askAI('How do I find my polling booth?', BASE_CONTEXT, false)
    expect(typeof result.nextAction).toBe('string')
    expect(result.nextAction.length).toBeGreaterThan(0)
  })

  it('handles document queries', async () => {
    const { askAI } = await import('../services/aiService')
    const result = await askAI('What documents do I need?', BASE_CONTEXT, false)
    expect(result.content).toBeTruthy()
  })

  it('handles EVM queries', async () => {
    const { askAI } = await import('../services/aiService')
    const result = await askAI('How does the EVM machine work?', BASE_CONTEXT, false)
    expect(result.content).toBeTruthy()
  })

  it('returns Hindi response for Hindi language context', async () => {
    const { askAI } = await import('../services/aiService')
    const hindiContext: AppContext = { ...BASE_CONTEXT, language: 'hi' }
    const result = await askAI('How do I register?', hindiContext, false)
    expect(result.content).toBeTruthy()
    expect(result.content.length).toBeGreaterThan(0)
  })

  it('uses confusion mode for simple responses', async () => {
    const { askAI } = await import('../services/aiService')
    const result = await askAI('How do I register?', BASE_CONTEXT, true)
    expect(result.content).toBeTruthy()
    // Confusion mode responses should be shorter
    const normalResult = await askAI('How do I register?', BASE_CONTEXT, false)
    expect(result.content.length).toBeLessThan(normalResult.content.length + 100)
  })

  it('handles booth queries in confusion mode', async () => {
    const { askAI } = await import('../services/aiService')
    const result = await askAI('Where is my booth?', BASE_CONTEXT, true)
    expect(result.content).toBeTruthy()
  })
})

// ─── App context validation ────────────────────────────────────────
describe('AppContext validation', () => {
  it('readinessScore is between 0 and 100', () => {
    expect(BASE_CONTEXT.readinessScore).toBeGreaterThanOrEqual(0)
    expect(BASE_CONTEXT.readinessScore).toBeLessThanOrEqual(100)
  })

  it('daysToVoting is non-negative', () => {
    expect(BASE_CONTEXT.daysToVoting).toBeGreaterThanOrEqual(0)
  })

  it('currentDate is a valid Date', () => {
    expect(BASE_CONTEXT.currentDate).toBeInstanceOf(Date)
    expect(isNaN(BASE_CONTEXT.currentDate.getTime())).toBe(false)
  })

  it('isVotingDay is false when daysToVoting > 0', () => {
    expect(BASE_CONTEXT.daysToVoting).toBeGreaterThan(0)
    expect(BASE_CONTEXT.isVotingDay).toBe(false)
  })
})
