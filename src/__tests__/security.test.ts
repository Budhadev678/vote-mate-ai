/**
 * @file security.test.ts
 * @description Unit tests for security utilities — input sanitization,
 * validation, rate limiting, and phone masking in VoteMate AI.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  sanitizeInput,
  sanitizeName,
  isValidIndianPhone,
  isSafeUrl,
  maskPhone,
  createRateLimiter,
  MAX_INPUT_LENGTH,
  MAX_NAME_LENGTH,
} from '../utils/sanitize'

// ─── sanitizeInput ────────────────────────────────────────────────
describe('sanitizeInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('')
  })

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })

  it('limits input to MAX_INPUT_LENGTH characters', () => {
    const long = 'a'.repeat(MAX_INPUT_LENGTH + 100)
    expect(sanitizeInput(long)).toHaveLength(MAX_INPUT_LENGTH)
  })

  it('removes script tags', () => {
    const input = '<script>alert("xss")</script>How do I vote?'
    const result = sanitizeInput(input)
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('</script>')
  })

  it('removes javascript: protocol', () => {
    const input = 'javascript:alert(1) How do I register?'
    const result = sanitizeInput(input)
    expect(result).not.toContain('javascript:')
  })

  it('removes inline event handlers', () => {
    const input = 'onclick=alert(1) voter question'
    const result = sanitizeInput(input)
    expect(result).not.toMatch(/on\w+=/)
  })

  it('preserves normal text unchanged (modulo trim)', () => {
    const input = 'How do I register to vote in Maharashtra?'
    expect(sanitizeInput(input)).toBe(input)
  })

  it('handles non-string input gracefully', () => {
    expect(sanitizeInput(null as unknown as string)).toBe('')
    expect(sanitizeInput(undefined as unknown as string)).toBe('')
    expect(sanitizeInput(123 as unknown as string)).toBe('')
  })

  it('respects custom maxLength parameter', () => {
    const result = sanitizeInput('hello world', 5)
    expect(result).toHaveLength(5)
    expect(result).toBe('hello')
  })
})

// ─── sanitizeName ─────────────────────────────────────────────────
describe('sanitizeName', () => {
  it('allows regular English names', () => {
    expect(sanitizeName('Rahul Kumar')).toBe('Rahul Kumar')
  })

  it('allows names with dots and hyphens', () => {
    expect(sanitizeName('A.P.J. Abdul Kalam')).toBe('A.P.J. Abdul Kalam')
    expect(sanitizeName('Mary-Jane Watson')).toBe('Mary-Jane Watson')
  })

  it('allows Indian language names', () => {
    expect(sanitizeName('राहुल गांधी')).toBe('राहुल गांधी')
    expect(sanitizeName('ਸੁਖਵਿੰਦਰ')).toBe('ਸੁਖਵਿੰਦਰ')
  })

  it('removes special characters from name', () => {
    const result = sanitizeName('John<script>Doe')
    expect(result).not.toContain('<script>')
  })

  it('limits to MAX_NAME_LENGTH', () => {
    const long = 'a'.repeat(MAX_NAME_LENGTH + 50)
    expect(sanitizeName(long).length).toBeLessThanOrEqual(MAX_NAME_LENGTH)
  })

  it('handles empty string', () => {
    expect(sanitizeName('')).toBe('')
  })

  it('handles non-string input', () => {
    expect(sanitizeName(null as unknown as string)).toBe('')
  })
})

// ─── isValidIndianPhone ───────────────────────────────────────────
describe('isValidIndianPhone', () => {
  it('accepts valid 10-digit Indian mobile numbers', () => {
    expect(isValidIndianPhone('9876543210')).toBe(true)
    expect(isValidIndianPhone('8765432109')).toBe(true)
    expect(isValidIndianPhone('7654321098')).toBe(true)
    expect(isValidIndianPhone('6543210987')).toBe(true)
  })

  it('accepts numbers with +91 prefix', () => {
    expect(isValidIndianPhone('+919876543210')).toBe(true)
    expect(isValidIndianPhone('919876543210')).toBe(true)
  })

  it('accepts numbers with spaces and hyphens', () => {
    expect(isValidIndianPhone('98765 43210')).toBe(true)
    expect(isValidIndianPhone('98765-43210')).toBe(true)
  })

  it('rejects numbers starting with 0-5', () => {
    expect(isValidIndianPhone('5876543210')).toBe(false)
    expect(isValidIndianPhone('0876543210')).toBe(false)
    expect(isValidIndianPhone('1234567890')).toBe(false)
  })

  it('rejects numbers with wrong length', () => {
    expect(isValidIndianPhone('98765')).toBe(false)
    expect(isValidIndianPhone('98765432100000')).toBe(false)
  })

  it('rejects non-numeric strings', () => {
    expect(isValidIndianPhone('abcdefghij')).toBe(false)
    expect(isValidIndianPhone('')).toBe(false)
  })
})

// ─── isSafeUrl ────────────────────────────────────────────────────
describe('isSafeUrl', () => {
  it('accepts https URLs', () => {
    expect(isSafeUrl('https://voters.eci.gov.in')).toBe(true)
    expect(isSafeUrl('https://eci.gov.in')).toBe(true)
  })

  it('accepts http URLs', () => {
    expect(isSafeUrl('http://example.com')).toBe(true)
  })

  it('rejects javascript: scheme', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data: scheme', () => {
    expect(isSafeUrl('data:text/html,<h1>test</h1>')).toBe(false)
  })

  it('rejects malformed URLs', () => {
    expect(isSafeUrl('not-a-url')).toBe(false)
    expect(isSafeUrl('')).toBe(false)
  })
})

// ─── maskPhone ────────────────────────────────────────────────────
describe('maskPhone', () => {
  it('masks middle digits of phone number', () => {
    expect(maskPhone('9876543210')).toBe('98****3210')
  })

  it('shows first 2 and last 4 digits', () => {
    const masked = maskPhone('9876543210')
    expect(masked.startsWith('98')).toBe(true)
    expect(masked.endsWith('3210')).toBe(true)
    expect(masked).toContain('****')
  })

  it('handles short phone numbers', () => {
    expect(maskPhone('123')).toBe('****')
  })

  it('handles empty string', () => {
    expect(maskPhone('')).toBe('****')
  })
})

// ─── createRateLimiter ────────────────────────────────────────────
describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('allows calls within the limit', () => {
    const limiter = createRateLimiter(3, 1000)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(true)
  })

  it('blocks calls exceeding the limit', () => {
    const limiter = createRateLimiter(2, 1000)
    limiter()
    limiter()
    expect(limiter()).toBe(false)
  })

  it('resets after the time window', () => {
    const limiter = createRateLimiter(2, 1000)
    limiter()
    limiter()
    // Fast-forward time by 1001ms
    vi.advanceTimersByTime(1001)
    expect(limiter()).toBe(true)
  })

  it('allows single call with limit of 1', () => {
    const limiter = createRateLimiter(1, 1000)
    expect(limiter()).toBe(true)
    expect(limiter()).toBe(false)
  })
})
