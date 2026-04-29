/**
 * @file constants.test.ts
 * @description Unit tests for application constants — validates all
 * electoral data, configuration values, and linguistic correctness
 * of constants used throughout VoteMate AI.
 */

import { describe, it, expect } from 'vitest'
import {
  APP_VERSION,
  APP_NAME,
  ECI_URL,
  VOTER_HELPLINE,
  SCORE_WEIGHT_REGISTRATION,
  SCORE_WEIGHT_VERIFICATION,
  SCORE_WEIGHT_DOCUMENTS,
  SCORE_WEIGHT_VOTING,
  MAX_READINESS_SCORE,
  BOTTOM_NAV_HEIGHT,
  APP_MAX_WIDTH,
  MAX_PERSISTED_MESSAGES,
  AI_MAX_TOKENS,
  MINIMUM_VOTING_AGE,
  ECI_VALID_ID_COUNT,
  BOOTH_OPEN_TIME,
  BOOTH_CLOSE_TIME,
  BEST_VOTING_WINDOW,
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  INDIAN_STATES,
  STORE_KEY,
  CHAT_RATE_LIMIT_MAX,
  CHAT_RATE_LIMIT_WINDOW_MS,
} from '../utils/constants'

// ─── App metadata ─────────────────────────────────────────────────
describe('App metadata constants', () => {
  it('has correct app name', () => {
    expect(APP_NAME).toBe('VoteMate AI')
  })

  it('has a valid semantic version', () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('ECI URL is a valid HTTPS URL', () => {
    expect(ECI_URL).toMatch(/^https:\/\//)
    expect(ECI_URL).toContain('eci.gov.in')
  })

  it('Voter helpline is 1950', () => {
    expect(VOTER_HELPLINE).toBe('1950')
  })

  it('store key is non-empty string', () => {
    expect(typeof STORE_KEY).toBe('string')
    expect(STORE_KEY.length).toBeGreaterThan(0)
  })
})

// ─── Readiness score weights ──────────────────────────────────────
describe('Readiness score weight constants', () => {
  it('individual weights are positive numbers', () => {
    expect(SCORE_WEIGHT_REGISTRATION).toBeGreaterThan(0)
    expect(SCORE_WEIGHT_VERIFICATION).toBeGreaterThan(0)
    expect(SCORE_WEIGHT_DOCUMENTS).toBeGreaterThan(0)
    expect(SCORE_WEIGHT_VOTING).toBeGreaterThan(0)
  })

  it('all weights sum to exactly MAX_READINESS_SCORE (100)', () => {
    const total =
      SCORE_WEIGHT_REGISTRATION +
      SCORE_WEIGHT_VERIFICATION +
      SCORE_WEIGHT_DOCUMENTS +
      SCORE_WEIGHT_VOTING
    expect(total).toBe(MAX_READINESS_SCORE)
    expect(total).toBe(100)
  })

  it('MAX_READINESS_SCORE is 100', () => {
    expect(MAX_READINESS_SCORE).toBe(100)
  })

  it('registration has highest or equal weight', () => {
    expect(SCORE_WEIGHT_REGISTRATION).toBeGreaterThanOrEqual(SCORE_WEIGHT_VOTING)
  })
})

// ─── UI constants ─────────────────────────────────────────────────
describe('UI constants', () => {
  it('bottom nav height is positive', () => {
    expect(BOTTOM_NAV_HEIGHT).toBeGreaterThan(0)
    expect(BOTTOM_NAV_HEIGHT).toBeLessThan(100) // Sane max height
  })

  it('app max width is 480px (mobile web)', () => {
    expect(APP_MAX_WIDTH).toBe(480)
  })

  it('max persisted messages is a reasonable number', () => {
    expect(MAX_PERSISTED_MESSAGES).toBeGreaterThan(0)
    expect(MAX_PERSISTED_MESSAGES).toBeLessThanOrEqual(200)
  })

  it('AI max tokens is within API limits', () => {
    expect(AI_MAX_TOKENS).toBeGreaterThan(0)
    expect(AI_MAX_TOKENS).toBeLessThanOrEqual(4096)
  })
})

// ─── Electoral data constants ─────────────────────────────────────
describe('Electoral data constants', () => {
  it('minimum voting age is 18', () => {
    expect(MINIMUM_VOTING_AGE).toBe(18)
  })

  it('ECI valid ID count is at least 11', () => {
    expect(ECI_VALID_ID_COUNT).toBeGreaterThanOrEqual(11)
  })

  it('booth times are non-empty strings', () => {
    expect(typeof BOOTH_OPEN_TIME).toBe('string')
    expect(BOOTH_OPEN_TIME.length).toBeGreaterThan(0)
    expect(typeof BOOTH_CLOSE_TIME).toBe('string')
    expect(BOOTH_CLOSE_TIME.length).toBeGreaterThan(0)
  })

  it('best voting window contains AM', () => {
    expect(BEST_VOTING_WINDOW).toContain('AM')
  })

  it('booth opens at 7 AM', () => {
    expect(BOOTH_OPEN_TIME).toContain('7')
  })
})

// ─── Language constants ───────────────────────────────────────────
describe('Language constants', () => {
  it('supported languages includes en, hi, or', () => {
    expect(SUPPORTED_LANGUAGES).toContain('en')
    expect(SUPPORTED_LANGUAGES).toContain('hi')
    expect(SUPPORTED_LANGUAGES).toContain('or')
  })

  it('has 3 supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(3)
  })

  it('language labels exist for all supported languages', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      expect(LANGUAGE_LABELS[lang]).toBeTruthy()
      expect(typeof LANGUAGE_LABELS[lang]).toBe('string')
    })
  })

  it('English label is "English"', () => {
    expect(LANGUAGE_LABELS['en']).toBe('English')
  })

  it('Hindi label contains Devanagari characters', () => {
    expect(LANGUAGE_LABELS['hi']).toMatch(/[\u0900-\u097F]/)
  })

  it('Odia label contains Odia script', () => {
    expect(LANGUAGE_LABELS['or']).toMatch(/[\u0B00-\u0B7F]/)
  })
})

// ─── Indian states ────────────────────────────────────────────────
describe('Indian states list', () => {
  it('has at least 28 entries', () => {
    expect(INDIAN_STATES.length).toBeGreaterThanOrEqual(28)
  })

  it('contains all major states', () => {
    expect(INDIAN_STATES).toContain('Maharashtra')
    expect(INDIAN_STATES).toContain('Uttar Pradesh')
    expect(INDIAN_STATES).toContain('Tamil Nadu')
    expect(INDIAN_STATES).toContain('Delhi')
    expect(INDIAN_STATES).toContain('West Bengal')
    expect(INDIAN_STATES).toContain('Karnataka')
    expect(INDIAN_STATES).toContain('Gujarat')
  })

  it('has no duplicate entries', () => {
    const unique = new Set(INDIAN_STATES)
    expect(unique.size).toBe(INDIAN_STATES.length)
  })

  it('all entries are non-empty strings', () => {
    INDIAN_STATES.forEach((state) => {
      expect(typeof state).toBe('string')
      expect(state.length).toBeGreaterThan(0)
    })
  })

  it('all entries are properly capitalized', () => {
    INDIAN_STATES.forEach((state) => {
      expect(state[0]).toBe(state[0].toUpperCase())
    })
  })
})

// ─── Rate limiting constants ───────────────────────────────────────
describe('Rate limiting constants', () => {
  it('chat rate limit max is positive', () => {
    expect(CHAT_RATE_LIMIT_MAX).toBeGreaterThan(0)
  })

  it('chat rate limit window is at least 1 second', () => {
    expect(CHAT_RATE_LIMIT_WINDOW_MS).toBeGreaterThanOrEqual(1000)
  })

  it('rate limit window is 1 minute', () => {
    expect(CHAT_RATE_LIMIT_WINDOW_MS).toBe(60_000)
  })
})
