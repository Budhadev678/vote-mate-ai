/**
 * @file sanitize.ts
 * @description Security utilities for input validation and sanitization.
 * Provides XSS prevention, input length limiting, and safe data handling
 * for all user-provided content in VoteMate AI.
 */

/** Maximum characters allowed in a chat message */
export const MAX_INPUT_LENGTH = 500

/** Maximum characters allowed in a name field */
export const MAX_NAME_LENGTH = 100

/** Maximum characters allowed in a news verification field */
export const MAX_NEWS_LENGTH = 1000

/**
 * Sanitizes a user text input by:
 * 1. Trimming leading/trailing whitespace
 * 2. Removing potential script injection patterns
 * 3. Limiting to maximum safe length
 *
 * @param input - Raw user input string
 * @param maxLength - Maximum characters to allow (default: MAX_INPUT_LENGTH)
 * @returns Sanitized string safe for processing
 */
export function sanitizeInput(input: string, maxLength = MAX_INPUT_LENGTH): string {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .slice(0, maxLength)
}

/**
 * Sanitizes a name input — allows letters, spaces, dots, hyphens.
 * Rejects names that are purely numeric or contain suspicious patterns.
 *
 * @param name - Raw name input
 * @returns Sanitized name or empty string if invalid
 */
export function sanitizeName(name: string): string {
  if (typeof name !== 'string') return ''
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH)
  // Allow Unicode letters + combining marks (for Indian names with matras), spaces, dots, hyphens
  return trimmed.replace(/[^\p{L}\p{M}\s.\-']/gu, '')
}

/**
 * Validates an Indian mobile phone number.
 * Indian mobile numbers: 10 digits, starting with 6-9.
 *
 * @param phone - Phone number string (with or without country code)
 * @returns true if valid Indian mobile number
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+]/g, '')
  // Accept 10-digit numbers starting with 6-9, or with 91 prefix
  return /^(?:91)?[6-9]\d{9}$/.test(cleaned)
}

/**
 * Validates that a URL is safe (HTTP/HTTPS only, no javascript: or data: schemes).
 *
 * @param url - URL string to validate
 * @returns true if the URL is safe to use
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['https:', 'http:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Masks a phone number for display privacy.
 * Example: "9876543210" → "98****3210"
 *
 * @param phone - Phone number to mask
 * @returns Masked phone number string
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '****'
  return phone.slice(0, 2) + '****' + phone.slice(-4)
}

/**
 * Rate limiter factory — prevents abuse of expensive operations (e.g., API calls).
 * Returns a function that returns true if the action is allowed, false if rate-limited.
 *
 * @param maxCalls - Maximum number of calls allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Rate-limited function checker
 */
export function createRateLimiter(maxCalls: number, windowMs: number) {
  const calls: number[] = []
  return (): boolean => {
    const now = Date.now()
    // Remove calls outside the window
    while (calls.length > 0 && now - calls[0] > windowMs) {
      calls.shift()
    }
    if (calls.length >= maxCalls) return false
    calls.push(now)
    return true
  }
}

/**
 * Validates environment variables required for secure operation.
 * Logs warnings (not errors) in development when keys are missing.
 */
export function validateEnvironment(): void {
  const requiredVars = [
    'VITE_GEMINI_API_KEY',
  ]
  const missingVars = requiredVars.filter(
    (key) => !import.meta.env[key],
  )
  if (missingVars.length > 0) {
    console.warn(
      `[VoteMate] Missing env vars: ${missingVars.join(', ')}. ` +
      'The offline engine will be used as fallback. Add VITE_GEMINI_API_KEY to Vercel env settings for live AI.',
    )
  }
}
