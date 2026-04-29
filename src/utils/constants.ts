/**
 * @file constants.ts
 * @description Application-wide constants for VoteMate AI.
 * Centralizes all magic numbers, strings, and configuration values
 * to prevent duplication and ensure consistency across the codebase.
 */

// ─── App metadata ─────────────────────────────────────────────────

/** Current application version */
export const APP_VERSION = '2.0.0'

/** Application name */
export const APP_NAME = 'VoteMate AI'

/** Official ECI portal URL */
export const ECI_URL = 'https://voters.eci.gov.in'

/** National Voter Helpline number */
export const VOTER_HELPLINE = '1950'

/** Official ECI main website */
export const ECI_MAIN_URL = 'https://eci.gov.in'

// ─── Readiness score weights ──────────────────────────────────────

/** Weight given to completing the registration step */
export const SCORE_WEIGHT_REGISTRATION = 30

/** Weight given to completing the verification step */
export const SCORE_WEIGHT_VERIFICATION = 25

/** Weight given to having a valid document confirmed */
export const SCORE_WEIGHT_DOCUMENTS = 25

/** Weight given to completing voting day preparation */
export const SCORE_WEIGHT_VOTING = 20

/** Maximum readiness score achievable */
export const MAX_READINESS_SCORE = 100

// ─── UI/UX constants ──────────────────────────────────────────────

/** Height of the bottom navigation bar in pixels */
export const BOTTOM_NAV_HEIGHT = 62

/** Maximum width of the app container for mobile web */
export const APP_MAX_WIDTH = 480

/** Duration for page transition animations in milliseconds */
export const PAGE_TRANSITION_DURATION = 200

/** Polling interval for offline status checks in milliseconds */
export const OFFLINE_CHECK_INTERVAL = 5000

/** Maximum number of chat messages to persist in storage */
export const MAX_PERSISTED_MESSAGES = 50

/** Maximum number of family members that can be added */
export const MAX_FAMILY_MEMBERS = 10

// ─── API constants ────────────────────────────────────────────────

/** Maximum tokens for AI response generation */
export const AI_MAX_TOKENS = 300

/** Simulated network latency for offline engine (ms) */
export const OFFLINE_ENGINE_DELAY = 800

/** Maximum chat messages per minute (rate limiting) */
export const CHAT_RATE_LIMIT_MAX = 10

/** Rate limit window in milliseconds (1 minute) */
export const CHAT_RATE_LIMIT_WINDOW_MS = 60_000

// ─── Indian electoral data ────────────────────────────────────────

/** Minimum voting age in India */
export const MINIMUM_VOTING_AGE = 18

/** Number of valid alternative photo IDs accepted by ECI */
export const ECI_VALID_ID_COUNT = 12

/** Polling booth opening time */
export const BOOTH_OPEN_TIME = '7:00 AM'

/** Polling booth closing time */
export const BOOTH_CLOSE_TIME = '6:00 PM'

/** Recommended best voting time window */
export const BEST_VOTING_WINDOW = '8:00 AM – 10:00 AM'

// ─── Supported languages ──────────────────────────────────────────

/** All supported language codes */
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'or'] as const

/** Display names for each supported language */
export const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  or: 'ଓଡ଼ିଆ',
}

// ─── Indian states list ───────────────────────────────────────────

/** Complete list of Indian states and Union Territories */
export const INDIAN_STATES: readonly string[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
] as const

// ─── Local storage keys ───────────────────────────────────────────

/** Zustand persist store key */
export const STORE_KEY = 'votemate-store'

/** Analytics session key */
export const ANALYTICS_SESSION_KEY = 'votemate-session'
