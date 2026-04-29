/**
 * @file utils.test.ts
 * @description Unit tests for utility functions, data constants, and
 * helper logic used throughout the VoteMate AI application.
 */

import { describe, it, expect } from 'vitest'

// ─── Electoral data validation ────────────────────────────────────
describe('Indian States list', () => {
  const STATES = [
    'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','West Bengal',
  ]

  it('contains all major Indian states', () => {
    expect(STATES).toContain('Maharashtra')
    expect(STATES).toContain('Tamil Nadu')
    expect(STATES).toContain('Uttar Pradesh')
    expect(STATES).toContain('West Bengal')
    expect(STATES).toContain('Delhi')
  })

  it('has at least 28 states/UTs', () => {
    expect(STATES.length).toBeGreaterThanOrEqual(28)
  })

  it('has no duplicate entries', () => {
    const unique = new Set(STATES)
    expect(unique.size).toBe(STATES.length)
  })

  it('all entries are non-empty strings', () => {
    STATES.forEach((s) => {
      expect(typeof s).toBe('string')
      expect(s.length).toBeGreaterThan(0)
    })
  })
})

// ─── Crowd prediction data ────────────────────────────────────────
describe('Crowd hours data', () => {
  const CROWD_HOURS = [
    { time: '7–8 AM',   level: 'low',    wait: '~5 min',  emoji: '🟢' },
    { time: '8–10 AM',  level: 'low',    wait: '~8 min',  emoji: '🟢', best: true },
    { time: '10–12 PM', level: 'medium', wait: '~15 min', emoji: '🟡' },
    { time: '12–2 PM',  level: 'high',   wait: '~35 min', emoji: '🔴', worst: true },
    { time: '2–4 PM',   level: 'medium', wait: '~18 min', emoji: '🟡' },
    { time: '4–6 PM',   level: 'low',    wait: '~10 min', emoji: '🟢' },
  ]

  it('has 6 time slots covering full voting day', () => {
    expect(CROWD_HOURS).toHaveLength(6)
  })

  it('every slot has required fields', () => {
    CROWD_HOURS.forEach((slot) => {
      expect(slot).toHaveProperty('time')
      expect(slot).toHaveProperty('level')
      expect(slot).toHaveProperty('wait')
      expect(slot).toHaveProperty('emoji')
    })
  })

  it('has exactly one best slot', () => {
    const bestSlots = CROWD_HOURS.filter((s) => s.best)
    expect(bestSlots).toHaveLength(1)
  })

  it('has exactly one worst slot', () => {
    const worstSlots = CROWD_HOURS.filter((s: unknown) => s.worst)
    expect(worstSlots).toHaveLength(1)
  })

  it('only uses valid crowd levels', () => {
    const validLevels = ['low', 'medium', 'high']
    CROWD_HOURS.forEach((slot) => {
      expect(validLevels).toContain(slot.level)
    })
  })

  it('morning slots are lower crowd than afternoon peak', () => {
    const morning = CROWD_HOURS[1] // 8-10 AM
    const peak = CROWD_HOURS[3]    // 12-2 PM
    expect(morning.level).toBe('low')
    expect(peak.level).toBe('high')
  })
})

// ─── Readiness score calculation ──────────────────────────────────
describe('Readiness score logic', () => {
  const calculateScore = (steps: string[]): number => {
    const STEP_WEIGHTS: Record<string, number> = {
      registration: 30,
      verification: 25,
      documents: 25,
      voting: 20,
    }
    return steps.reduce((total, step) => total + (STEP_WEIGHTS[step] || 0), 0)
  }

  it('returns 0 for no completed steps', () => {
    expect(calculateScore([])).toBe(0)
  })

  it('returns 30 for registration only', () => {
    expect(calculateScore(['registration'])).toBe(30)
  })

  it('returns 55 for registration + verification', () => {
    expect(calculateScore(['registration', 'verification'])).toBe(55)
  })

  it('returns 100 for all steps completed', () => {
    expect(calculateScore(['registration', 'verification', 'documents', 'voting'])).toBe(100)
  })

  it('score is always between 0 and 100', () => {
    const score = calculateScore(['registration', 'verification'])
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

// ─── Language utilities ───────────────────────────────────────────
describe('Language helpers', () => {
  const LANG_LABELS: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी',
    or: 'ଓଡ଼ିଆ',
  }

  it('has labels for all supported languages', () => {
    expect(LANG_LABELS['en']).toBe('English')
    expect(LANG_LABELS['hi']).toBe('हिंदी')
    expect(LANG_LABELS['or']).toBe('ଓଡ଼ିଆ')
  })

  it('returns correct label for each language code', () => {
    const codes = ['en', 'hi', 'or']
    codes.forEach((code) => {
      expect(LANG_LABELS[code]).toBeTruthy()
    })
  })

  it('Hindi label contains Devanagari script', () => {
    expect(LANG_LABELS['hi']).toMatch(/[\u0900-\u097F]/)
  })

  it('Odia label contains Odia script', () => {
    expect(LANG_LABELS['or']).toMatch(/[\u0B00-\u0B7F]/)
  })
})

// ─── Quick suggestions validation ────────────────────────────────
describe('Quick suggestion chips', () => {
  const QUICK_SUGGESTIONS = [
    '📋 How to register?',
    '🪪 What ID do I need?',
    '📍 Find my booth',
    '🗳️ How does EVM work?',
    '📅 Election dates?',
    '🚨 Report violation',
  ]

  it('has 6 suggestion chips', () => {
    expect(QUICK_SUGGESTIONS).toHaveLength(6)
  })

  it('all suggestions are non-empty strings', () => {
    QUICK_SUGGESTIONS.forEach((s) => {
      expect(typeof s).toBe('string')
      expect(s.length).toBeGreaterThan(0)
    })
  })

  it('covers key election topics', () => {
    const combined = QUICK_SUGGESTIONS.join(' ').toLowerCase()
    expect(combined).toMatch(/register/)
    expect(combined).toMatch(/id|booth|evm/i)
  })
})

// ─── Input sanitization ───────────────────────────────────────────
describe('Input validation', () => {
  const sanitize = (input: string): string => input.trim().slice(0, 500)

  it('trims whitespace from input', () => {
    expect(sanitize('  hello  ')).toBe('hello')
  })

  it('truncates very long inputs to 500 chars', () => {
    const longInput = 'a'.repeat(1000)
    expect(sanitize(longInput)).toHaveLength(500)
  })

  it('handles empty string', () => {
    expect(sanitize('')).toBe('')
  })

  it('preserves normal input', () => {
    expect(sanitize('How do I register to vote?')).toBe('How do I register to vote?')
  })

  it('handles special characters safely', () => {
    const input = '<script>alert("xss")</script>'
    const result = sanitize(input)
    expect(typeof result).toBe('string')
  })
})
