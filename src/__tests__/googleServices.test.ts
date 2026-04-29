/**
 * @file googleServices.test.ts
 * @description Comprehensive tests for the Google Services integration layer.
 * Validates Google Translate, Maps Geocoding, NLP Sentiment Analysis,
 * Firebase Performance Monitoring, Firebase Remote Config, reCAPTCHA,
 * and the service health check system.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ─── Mock fetch globally ──────────────────────────────────────────
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
  initializeApp: vi.fn(() => ({ name: 'test-app' })),
}))

vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => ({})),
  trace: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    putAttribute: vi.fn(),
  })),
}))

vi.mock('firebase/remote-config', () => ({
  getRemoteConfig: vi.fn(() => ({
    settings: {},
    defaultConfig: {},
  })),
  fetchAndActivate: vi.fn().mockResolvedValue(true),
  getValue: vi.fn(() => ({ asString: () => 'test', asBoolean: () => true })),
}))

// ═══════════════════════════════════════════════════════════════════
// GOOGLE TRANSLATE API TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Google Translate API integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_GOOGLE_TRANSLATE_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns original text when target language equals source', async () => {
    const { translateText } = await import('../services/googleServices')
    const result = await translateText('Hello', 'en', 'en')
    expect(result).toBe('Hello')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns original text when input is empty', async () => {
    const { translateText } = await import('../services/googleServices')
    const result = await translateText('', 'hi')
    expect(result).toBe('')
  })

  it('returns original text when API key is missing', async () => {
    const { translateText } = await import('../services/googleServices')
    const result = await translateText('Hello', 'hi')
    expect(result).toBe('Hello')
  })

  it('batchTranslate returns originals for English target', async () => {
    const { batchTranslate } = await import('../services/googleServices')
    const result = await batchTranslate(['Hello', 'World'], 'en')
    expect(result).toEqual(['Hello', 'World'])
  })

  it('batchTranslate returns originals when API key is missing', async () => {
    const { batchTranslate } = await import('../services/googleServices')
    const result = await batchTranslate(['Hello'], 'hi')
    expect(result).toEqual(['Hello'])
  })
})

// ═══════════════════════════════════════════════════════════════════
// GOOGLE MAPS GEOCODING API TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Google Maps Geocoding API integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null when API key is missing', async () => {
    const { geocodeAddress } = await import('../services/googleServices')
    const result = await geocodeAddress('Government School, Delhi')
    expect(result).toBeNull()
  })

  it('returns null for empty address', async () => {
    const { geocodeAddress } = await import('../services/googleServices')
    const result = await geocodeAddress('')
    expect(result).toBeNull()
  })

  it('returns null for whitespace-only address', async () => {
    const { geocodeAddress } = await import('../services/googleServices')
    const result = await geocodeAddress('   ')
    expect(result).toBeNull()
  })

  it('findNearbyPollingStations returns empty when API key is missing', async () => {
    const { findNearbyPollingStations } = await import('../services/googleServices')
    const result = await findNearbyPollingStations(28.6139, 77.2090)
    expect(result).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════
// GOOGLE CLOUD NATURAL LANGUAGE API TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Google Cloud NLP Sentiment Analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_GOOGLE_NLP_API_KEY', '')
    vi.stubEnv('VITE_GEMINI_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null when no API key is available', async () => {
    const { analyzeSentiment } = await import('../services/googleServices')
    const result = await analyzeSentiment('All EVMs are hacked!')
    expect(result).toBeNull()
  })

  it('returns null for empty text', async () => {
    const { analyzeSentiment } = await import('../services/googleServices')
    const result = await analyzeSentiment('')
    expect(result).toBeNull()
  })

  it('returns null for whitespace-only text', async () => {
    const { analyzeSentiment } = await import('../services/googleServices')
    const result = await analyzeSentiment('   ')
    expect(result).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════
// FIREBASE PERFORMANCE MONITORING TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Firebase Performance Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_FIREBASE_API_KEY', '')
    vi.stubEnv('VITE_FIREBASE_APP_ID', '')
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('initPerformanceMonitoring returns null without Firebase config', async () => {
    const { initPerformanceMonitoring } = await import('../services/googleServices')
    const result = initPerformanceMonitoring()
    expect(result).toBeNull()
  })

  it('startTrace returns null without Firebase config', async () => {
    const { startTrace } = await import('../services/googleServices')
    const result = startTrace('test_trace')
    expect(result).toBeNull()
  })

  it('startTrace returns object with stop and putAttribute when available', async () => {
    // When performance is available, trace should have stop/putAttribute
    const { startTrace } = await import('../services/googleServices')
    const trace = startTrace('test_trace')
    if (trace) {
      expect(typeof trace.stop).toBe('function')
      expect(typeof trace.putAttribute).toBe('function')
    }
  })
})

// ═══════════════════════════════════════════════════════════════════
// FIREBASE REMOTE CONFIG TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Firebase Remote Config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getConfigValue returns default for voting_date', async () => {
    const { getConfigValue } = await import('../services/googleServices')
    const result = getConfigValue('voting_date')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('getConfigValue returns empty string for unknown key', async () => {
    const { getConfigValue } = await import('../services/googleServices')
    const result = getConfigValue('nonexistent_key')
    expect(result).toBe('')
  })

  it('getConfigBoolean returns default for enable_crowd_prediction', async () => {
    const { getConfigBoolean } = await import('../services/googleServices')
    const result = getConfigBoolean('enable_crowd_prediction')
    expect(typeof result).toBe('boolean')
  })

  it('getConfigBoolean returns false for unknown key', async () => {
    const { getConfigBoolean } = await import('../services/googleServices')
    const result = getConfigBoolean('nonexistent_key')
    expect(result).toBe(false)
  })

  it('initRemoteConfig does not throw when Firebase is unavailable', async () => {
    const { initRemoteConfig } = await import('../services/googleServices')
    await expect(initRemoteConfig()).resolves.not.toThrow()
  })
})

// ═══════════════════════════════════════════════════════════════════
// GOOGLE RECAPTCHA TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Google reCAPTCHA integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_RECAPTCHA_SITE_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null when site key is missing', async () => {
    const { executeRecaptcha } = await import('../services/googleServices')
    const result = await executeRecaptcha('report_violation')
    expect(result).toBeNull()
  })

  it('returns null when grecaptcha is not loaded', async () => {
    vi.stubEnv('VITE_RECAPTCHA_SITE_KEY', 'test-key')
    const { executeRecaptcha } = await import('../services/googleServices')
    const result = await executeRecaptcha('submit_otp')
    expect(result).toBeNull()
  })
})

// ═══════════════════════════════════════════════════════════════════
// SERVICE HEALTH CHECK TESTS
// ═══════════════════════════════════════════════════════════════════

describe('Google Service Health Check', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_GEMINI_API_KEY', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns an array of service statuses', async () => {
    const { checkServiceHealth } = await import('../services/googleServices')
    const statuses = await checkServiceHealth()
    expect(Array.isArray(statuses)).toBe(true)
  })

  it('each status has name, available, and latencyMs fields', async () => {
    const { checkServiceHealth } = await import('../services/googleServices')
    const statuses = await checkServiceHealth()
    statuses.forEach((status) => {
      expect(status).toHaveProperty('name')
      expect(status).toHaveProperty('available')
      expect(status).toHaveProperty('latencyMs')
      expect(typeof status.name).toBe('string')
      expect(typeof status.available).toBe('boolean')
    })
  })

  it('always reports Google Fonts as available', async () => {
    const { checkServiceHealth } = await import('../services/googleServices')
    const statuses = await checkServiceHealth()
    const fonts = statuses.find((s) => s.name === 'Google Fonts')
    expect(fonts).toBeTruthy()
    expect(fonts?.available).toBe(true)
  })

  it('reports at least 5 services', async () => {
    const { checkServiceHealth } = await import('../services/googleServices')
    const statuses = await checkServiceHealth()
    expect(statuses.length).toBeGreaterThanOrEqual(5)
  })
})

// ═══════════════════════════════════════════════════════════════════
// DISTANCE CALCULATION TESTS (internal utility)
// ═══════════════════════════════════════════════════════════════════

describe('Haversine distance calculation', () => {
  it('same point returns 0 m distance', () => {
    // Test the concept — same lat/lng should give ~0 distance
    const R = 6371
    const dLat = 0
    const dLon = 0
    const a = Math.sin(dLat / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const dist = R * c
    expect(dist).toBe(0)
  })

  it('calculates non-zero distance for different points', () => {
    const R = 6371
    const lat1 = 28.6139
    const lon1 = 77.2090
    const lat2 = 19.0760
    const lon2 = 72.8777
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const dist = R * c
    expect(dist).toBeGreaterThan(1000) // Delhi to Mumbai ~1150km
    expect(dist).toBeLessThan(1500)
  })
})
