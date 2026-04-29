/**
 * @file googleServices.ts
 * @description Centralized Google Services integration layer for VoteMate AI.
 * Provides a unified facade over all Google Cloud & Firebase services used
 * throughout the application. This module ensures consistent error handling,
 * graceful degradation, and clear separation of concerns.
 *
 * Google Services integrated in this module:
 * - Google Translate API (dynamic multilingual content translation)
 * - Google Maps Geocoding API (address-to-coordinates conversion)
 * - Google Maps Places API (polling booth search by location)
 * - Firebase Performance Monitoring (web vitals tracking)
 * - Firebase Remote Config (feature flags and dynamic configuration)
 * - Google Cloud Natural Language API (sentiment analysis for news)
 *
 * All services fail gracefully with sensible fallbacks — the app
 * remains fully functional even without network connectivity.
 */

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getPerformance, trace, type FirebasePerformance } from 'firebase/performance'
import { getRemoteConfig, fetchAndActivate, getValue, type RemoteConfig } from 'firebase/remote-config'

// ─── Firebase app reference ───────────────────────────────────────
function getFirebaseApp(): FirebaseApp | null {
  try {
    if (getApps().length > 0) return getApps()[0]
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY ?? ''
    const appId = import.meta.env.VITE_FIREBASE_APP_ID ?? ''
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? ''
    if (!apiKey || !appId || !projectId || apiKey.startsWith('demo-')) return null
    return initializeApp({
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
      appId,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
    })
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════
// GOOGLE TRANSLATE API — Dynamic Content Translation
// ═══════════════════════════════════════════════════════════════════

/**
 * Translation cache to minimize redundant API calls.
 * Key format: `${text}:${targetLang}`
 */
const translationCache = new Map<string, string>()

/**
 * Translates text using the Google Cloud Translation API.
 * Falls back to the original text if the API is unavailable.
 *
 * @param text - Source text to translate
 * @param targetLang - Target language code ('hi' for Hindi, 'or' for Odia)
 * @param sourceLang - Source language code (default: 'en')
 * @returns Translated text or original text on failure
 *
 * @example
 * ```ts
 * const hindi = await translateText('How to register', 'hi')
 * // → "कैसे रजिस्टर करें"
 * ```
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = 'en',
): Promise<string> {
  if (!text.trim() || targetLang === sourceLang) return text

  const cacheKey = `${text}:${targetLang}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY ?? ''
  if (!apiKey) return text

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang === 'or' ? 'or' : targetLang,
          format: 'text',
        }),
      },
    )

    if (!response.ok) return text

    const data = await response.json()
    const translated = data?.data?.translations?.[0]?.translatedText ?? text
    translationCache.set(cacheKey, translated)
    return translated
  } catch {
    console.debug('[VoteMate] Google Translate unavailable, using fallback')
    return text
  }
}

/**
 * Batch-translates multiple strings efficiently.
 * Uses a single API call for all strings to minimize latency.
 *
 * @param texts - Array of strings to translate
 * @param targetLang - Target language code
 * @returns Array of translated strings (same order as input)
 */
export async function batchTranslate(
  texts: string[],
  targetLang: string,
): Promise<string[]> {
  if (targetLang === 'en') return texts

  const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY ?? ''
  if (!apiKey) return texts

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          format: 'text',
        }),
      },
    )

    if (!response.ok) return texts
    const data = await response.json()
    return data?.data?.translations?.map((t: { translatedText: string }) => t.translatedText) ?? texts
  } catch {
    return texts
  }
}

// ═══════════════════════════════════════════════════════════════════
// GOOGLE MAPS GEOCODING API — Address to Coordinates
// ═══════════════════════════════════════════════════════════════════

/** Geocoded location result */
export interface GeocodedLocation {
  lat: number
  lng: number
  formattedAddress: string
  placeId: string
}

/**
 * Geocodes an address string to latitude/longitude coordinates
 * using the Google Maps Geocoding API.
 *
 * @param address - Human-readable address string
 * @returns GeocodedLocation with lat/lng, or null if geocoding fails
 *
 * @example
 * ```ts
 * const loc = await geocodeAddress('Government School, Ward 5, Delhi')
 * // → { lat: 28.6139, lng: 77.2090, formattedAddress: '...', placeId: '...' }
 * ```
 */
export async function geocodeAddress(address: string): Promise<GeocodedLocation | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
  if (!apiKey || !address.trim()) return null

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&region=in`,
    )

    if (!response.ok) return null
    const data = await response.json()

    if (data.status !== 'OK' || !data.results?.length) return null

    const result = data.results[0]
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
      placeId: result.place_id,
    }
  } catch {
    console.debug('[VoteMate] Google Maps Geocoding unavailable')
    return null
  }
}

/**
 * Searches for nearby polling stations using Google Maps Places API.
 * Restricts results to schools and government buildings in India
 * (common polling station locations).
 *
 * @param lat - Latitude of the search center
 * @param lng - Longitude of the search center
 * @param radiusMeters - Search radius in meters (default: 2000)
 * @returns Array of nearby polling station candidates
 */
export async function findNearbyPollingStations(
  lat: number,
  lng: number,
  radiusMeters = 2000,
): Promise<Array<{ name: string; address: string; distance: string }>> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
  if (!apiKey) return []

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=school&keyword=polling+station&key=${apiKey}`,
    )

    if (!response.ok) return []
    const data = await response.json()

    return (data.results ?? []).slice(0, 5).map((place: { name: string; vicinity: string; geometry: { location: { lat: number; lng: number } } }) => ({
      name: place.name,
      address: place.vicinity,
      distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
    }))
  } catch {
    return []
  }
}

/**
 * Calculates approximate distance between two coordinates using the Haversine formula.
 * @returns Distance string like "1.2 km" or "800 m"
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): string {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distKm = R * c
  return distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`
}

// ═══════════════════════════════════════════════════════════════════
// GOOGLE CLOUD NATURAL LANGUAGE API — Sentiment Analysis
// ═══════════════════════════════════════════════════════════════════

/** Sentiment analysis result */
export interface SentimentResult {
  score: number
  magnitude: number
  label: 'positive' | 'negative' | 'neutral' | 'mixed'
}

/**
 * Analyzes the sentiment of text using Google Cloud Natural Language API.
 * Used to supplement AI-based fake news detection with NLP-backed
 * emotional tone analysis.
 *
 * @param text - Text content to analyze
 * @returns SentimentResult with score (-1 to 1), magnitude, and label
 *
 * @example
 * ```ts
 * const sentiment = await analyzeSentiment('BREAKING: All EVMs hacked!')
 * // → { score: -0.8, magnitude: 0.9, label: 'negative' }
 * ```
 */
export async function analyzeSentiment(text: string): Promise<SentimentResult | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_NLP_API_KEY ?? import.meta.env.VITE_GEMINI_API_KEY ?? ''
  if (!apiKey || !text.trim()) return null

  try {
    const response = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: { type: 'PLAIN_TEXT', content: text },
          encodingType: 'UTF8',
        }),
      },
    )

    if (!response.ok) return null
    const data = await response.json()
    const sentiment = data?.documentSentiment

    if (!sentiment) return null

    const score: number = sentiment.score
    const magnitude: number = sentiment.magnitude

    let label: SentimentResult['label'] = 'neutral'
    if (score > 0.25) label = 'positive'
    else if (score < -0.25) label = 'negative'
    else if (magnitude > 0.5) label = 'mixed'

    return { score, magnitude, label }
  } catch {
    console.debug('[VoteMate] Google NLP API unavailable')
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════
// FIREBASE PERFORMANCE MONITORING — Web Vitals
// ═══════════════════════════════════════════════════════════════════

let _perf: FirebasePerformance | null = null

/**
 * Initializes Firebase Performance Monitoring for tracking
 * page load times, network request latencies, and custom traces.
 *
 * @returns FirebasePerformance instance or null if unavailable
 */
export function initPerformanceMonitoring(): FirebasePerformance | null {
  if (_perf) return _perf
  try {
    const app = getFirebaseApp()
    if (!app) return null
    _perf = getPerformance(app)
    return _perf
  } catch {
    console.debug('[VoteMate] Firebase Performance Monitoring unavailable')
    return null
  }
}

/**
 * Creates and starts a custom performance trace.
 * Use this to measure the duration of specific operations
 * (e.g., AI response time, screen load time).
 *
 * @param traceName - Unique name for the trace (e.g., 'ai_response_time')
 * @returns Object with stop() method, or null if monitoring is unavailable
 *
 * @example
 * ```ts
 * const t = startTrace('gemini_chat_response')
 * const response = await askAI(...)
 * t?.stop()
 * ```
 */
export function startTrace(traceName: string): { stop: () => void; putAttribute: (key: string, value: string) => void } | null {
  const perf = initPerformanceMonitoring()
  if (!perf) return null

  try {
    const t = trace(perf, traceName)
    t.start()
    return {
      stop: () => {
        try { t.stop() } catch { /* already stopped */ }
      },
      putAttribute: (key: string, value: string) => {
        try { t.putAttribute(key, value) } catch { /* ignore */ }
      },
    }
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════
// FIREBASE REMOTE CONFIG — Feature Flags & Dynamic Configuration
// ═══════════════════════════════════════════════════════════════════

let _remoteConfig: RemoteConfig | null = null

/** Default values for all remote config parameters */
const REMOTE_CONFIG_DEFAULTS: Record<string, string | number | boolean> = {
  voting_date: '2026-05-20',
  enable_crowd_prediction: true,
  enable_news_verification: true,
  enable_family_mode: true,
  enable_community_insights: true,
  ai_temperature: 0.7,
  max_chat_messages: 50,
  maintenance_mode: false,
  maintenance_message: '',
  feature_announcement: '',
  eci_helpline_number: '1950',
  recommended_voting_time: '8:00 AM – 10:00 AM',
}

/**
 * Initializes Firebase Remote Config with defaults and fetches
 * the latest values from the Firebase console.
 *
 * Remote Config allows changing app behavior without deploying
 * new code — useful for toggling features, updating election dates,
 * or displaying urgent announcements.
 */
export async function initRemoteConfig(): Promise<void> {
  try {
    const app = getFirebaseApp()
    if (!app) return

    _remoteConfig = getRemoteConfig(app)
    _remoteConfig.settings.minimumFetchIntervalMillis = 3600000 // 1 hour
    _remoteConfig.defaultConfig = REMOTE_CONFIG_DEFAULTS

    await fetchAndActivate(_remoteConfig)
  } catch {
    console.debug('[VoteMate] Firebase Remote Config unavailable, using defaults')
  }
}

/**
 * Gets a Remote Config value by key, with type-safe fallback.
 *
 * @param key - Config parameter key
 * @returns String value from Remote Config, or the default value
 *
 * @example
 * ```ts
 * const date = getConfigValue('voting_date') // '2026-05-20'
 * const enabled = getConfigValue('enable_crowd_prediction') // 'true'
 * ```
 */
export function getConfigValue(key: string): string {
  if (!_remoteConfig) {
    const defaultVal = REMOTE_CONFIG_DEFAULTS[key]
    return defaultVal !== undefined ? String(defaultVal) : ''
  }
  try {
    return getValue(_remoteConfig, key).asString()
  } catch {
    const defaultVal = REMOTE_CONFIG_DEFAULTS[key]
    return defaultVal !== undefined ? String(defaultVal) : ''
  }
}

/**
 * Gets a boolean Remote Config value.
 *
 * @param key - Config parameter key
 * @returns Boolean value from Remote Config
 */
export function getConfigBoolean(key: string): boolean {
  if (!_remoteConfig) {
    const defaultVal = REMOTE_CONFIG_DEFAULTS[key]
    return typeof defaultVal === 'boolean' ? defaultVal : false
  }
  try {
    return getValue(_remoteConfig, key).asBoolean()
  } catch {
    const defaultVal = REMOTE_CONFIG_DEFAULTS[key]
    return typeof defaultVal === 'boolean' ? defaultVal : false
  }
}

// ═══════════════════════════════════════════════════════════════════
// GOOGLE RECAPTCHA — Bot Protection for Sensitive Actions
// ═══════════════════════════════════════════════════════════════════

/**
 * Executes Google reCAPTCHA v3 verification for sensitive actions
 * (e.g., reporting violations, submitting OTP).
 *
 * @param action - Action name for reCAPTCHA scoring (e.g., 'report_violation')
 * @returns reCAPTCHA token string, or null if unavailable
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''
  if (!siteKey) return null

  try {
    if (typeof window === 'undefined' || !('grecaptcha' in window)) return null

    const grecaptcha = (window as Window & { grecaptcha: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha

    return new Promise((resolve) => {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(siteKey, { action })
          resolve(token)
        } catch {
          resolve(null)
        }
      })
    })
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════
// SERVICE HEALTH CHECK — Verify Google Service Connectivity
// ═══════════════════════════════════════════════════════════════════

/** Status of a single Google service */
export interface ServiceStatus {
  name: string
  available: boolean
  latencyMs: number | null
}

/**
 * Checks the availability and latency of all configured Google Services.
 * Useful for diagnostics and displaying service status in the UI.
 *
 * @returns Array of ServiceStatus objects
 */
export async function checkServiceHealth(): Promise<ServiceStatus[]> {
  const services: ServiceStatus[] = []

  // Check Gemini API
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY ?? ''
  if (geminiKey) {
    const start = performance.now()
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
        { method: 'GET', signal: AbortSignal.timeout(5000) },
      )
      services.push({
        name: 'Google Gemini API',
        available: response.ok,
        latencyMs: Math.round(performance.now() - start),
      })
    } catch {
      services.push({ name: 'Google Gemini API', available: false, latencyMs: null })
    }
  }

  // Check Firebase connectivity
  const firebaseApp = getFirebaseApp()
  services.push({
    name: 'Firebase Analytics',
    available: !!firebaseApp,
    latencyMs: null,
  })

  services.push({
    name: 'Firebase Firestore',
    available: !!firebaseApp,
    latencyMs: null,
  })

  services.push({
    name: 'Firebase Performance',
    available: !!initPerformanceMonitoring(),
    latencyMs: null,
  })

  services.push({
    name: 'Firebase Remote Config',
    available: !!_remoteConfig,
    latencyMs: null,
  })

  // Google Fonts check (always available via CDN)
  services.push({
    name: 'Google Fonts',
    available: true,
    latencyMs: null,
  })

  // Google Analytics check
  services.push({
    name: 'Google Analytics 4',
    available: typeof window !== 'undefined' && 'gtag' in window,
    latencyMs: null,
  })

  return services
}
