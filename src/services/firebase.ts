/**
 * @file firebase.ts
 * @description Google Firebase integration for VoteMate AI.
 * Provides Firebase Analytics for engagement tracking and
 * Firestore for anonymized civic interaction logging.
 *
 * Google Services integrated:
 * - Firebase Analytics (user behaviour analytics)
 * - Firebase Firestore (anonymized query logging)
 * - Firebase App (core SDK)
 *
 * All data collected is ANONYMIZED — no personal info stored.
 * Fails silently if credentials are not configured.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp, type Firestore } from 'firebase/firestore'
import { getAnalytics, logEvent, isSupported, type Analytics } from 'firebase/analytics'
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions'

// ─── Detect if real Firebase config is provided ───────────────────
const FIREBASE_API_KEY  = import.meta.env.VITE_FIREBASE_API_KEY  ?? ''
const FIREBASE_APP_ID   = import.meta.env.VITE_FIREBASE_APP_ID   ?? ''
const FIREBASE_PROJECT  = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? ''

/** True only if real Firebase credentials are present */
const FIREBASE_ENABLED  = !!FIREBASE_API_KEY && !!FIREBASE_APP_ID && !!FIREBASE_PROJECT
  && !FIREBASE_API_KEY.startsWith('demo-')

const firebaseConfig = {
  apiKey:            FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? `${FIREBASE_PROJECT}.firebaseapp.com`,
  projectId:         FIREBASE_PROJECT,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? `${FIREBASE_PROJECT}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     ?? '',
}

// ─── Lazy singletons ──────────────────────────────────────────────
let _app:       FirebaseApp  | null = null
let _db:        Firestore    | null = null
let _analytics: Analytics    | null = null

function getApp(): FirebaseApp | null {
  if (!FIREBASE_ENABLED) return null
  try {
    if (_app) return _app
    _app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig)
    return _app
  } catch {
    return null
  }
}

async function getDb(): Promise<Firestore | null> {
  const app = getApp()
  if (!app) return null
  try {
    if (!_db) _db = getFirestore(app)
    return _db
  } catch {
    return null
  }
}

let _functions: Functions | null = null
function getFunctionsInstance(): Functions | null {
  const app = getApp()
  if (!app) return null
  try {
    if (!_functions) _functions = getFunctions(app)
    return _functions
  } catch {
    return null
  }
}

async function getAnalyticsInstance(): Promise<Analytics | null> {
  const app = getApp()
  if (!app) return null
  try {
    const supported = await isSupported()
    if (!supported) return null
    if (!_analytics) _analytics = getAnalytics(app)
    return _analytics
  } catch {
    return null
  }
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Logs a screen view event to Firebase Analytics.
 * @param screenName - The screen identifier (e.g. 'Dashboard', 'Chat')
 */
export async function logScreenView(screenName: string): Promise<void> {
  const analytics = await getAnalyticsInstance()
  if (!analytics) return
  try {
    logEvent(analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenName,
    })
  } catch {
    // Silently ignore — analytics is non-critical
  }
}

/**
 * Logs a custom user action to Firebase Analytics.
 * @param event - Event name (snake_case)
 * @param params - Optional event parameters (no PII)
 */
export async function logUserAction(
  event: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  const analytics = await getAnalyticsInstance()
  if (!analytics) return
  try {
    logEvent(analytics, event, params)
  } catch {
    // Silently ignore
  }
}

/**
 * Logs an anonymized chat query topic to Firestore.
 * @param topic - The detected topic (e.g. 'registration', 'booth')
 * @param language - User language code ('en', 'hi', 'or')
 * @param confusionMode - Whether user enabled simplified mode
 */
export async function logChatQuery(
  topic: string,
  language: string,
  confusionMode: boolean,
): Promise<void> {
  const db = await getDb()
  if (!db) return
  try {
    await addDoc(collection(db, 'chat_queries'), {
      topic,
      language,
      confusionMode,
      timestamp: serverTimestamp(),
      // NOTE: No user ID, IP, or personal data is stored
    })
  } catch {
    // Silently ignore — Firestore logging is non-critical
  }
}

/**
 * Logs an anonymized booth search to Firestore.
 * @param state - The state the user searched booths in
 */
export async function logBoothSearch(state: string): Promise<void> {
  const db = await getDb()
  if (!db) return
  try {
    await addDoc(collection(db, 'booth_searches'), {
      state,
      timestamp: serverTimestamp(),
    })
  } catch {
    // Silently ignore
  }
}

/**
 * Calls the secure Google Cloud Function for backend insights
 */
export async function fetchRegionalInsights(stateName: string) {
  const functions = getFunctionsInstance()
  if (!functions) return null
  
  try {
    const getInsights = httpsCallable(functions, 'getRegionalInsights')
    const result = await getInsights({ state: stateName })
    return result.data
  } catch {
    console.warn('Cloud function fallback active')
    return null
  }
}
