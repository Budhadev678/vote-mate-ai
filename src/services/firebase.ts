/**
 * @file firebase.ts
 * @description Google Firebase integration for VoteMate AI.
 * Provides Firestore for analytics/session logging and
 * Firebase Analytics for user engagement tracking.
 *
 * Google Services used:
 * - Firebase Firestore (cloud data storage)
 * - Firebase Analytics (user behaviour analytics)
 * - Firebase App (core SDK)
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics'

// ─── Firebase configuration ───────────────────────────────────────
// Using environment variables for security; falls back to demo config for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'votemate-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'votemate-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'votemate-ai.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-VOTEMATE',
}

// ─── Initialize Firebase ──────────────────────────────────────────
let app: ReturnType<typeof initializeApp> | null = null
let db: ReturnType<typeof getFirestore> | null = null

function getFirebaseApp() {
  if (!app) {
    app = initializeApp(firebaseConfig)
  }
  return app
}

function getDb() {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}

// ─── Analytics: log screen views ─────────────────────────────────
/**
 * Logs a screen view event to Firebase Analytics.
 * Uses feature detection to avoid errors in unsupported environments.
 *
 * @param screenName - The name of the screen being viewed
 */
export async function logScreenView(screenName: string): Promise<void> {
  try {
    const supported = await isSupported()
    if (!supported) return
    const analytics = getAnalytics(getFirebaseApp())
    logEvent(analytics, 'screen_view', {
      firebase_screen: screenName,
      firebase_screen_class: screenName,
    })
  } catch (err) {
    // Silent fail — analytics should never break the app
    console.debug('[Firebase] Analytics not available:', err)
  }
}

/**
 * Logs a custom user action event to Firebase Analytics.
 *
 * @param eventName - The name of the action event
 * @param params - Optional parameters for the event
 */
export async function logUserAction(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    const supported = await isSupported()
    if (!supported) return
    const analytics = getAnalytics(getFirebaseApp())
    logEvent(analytics, eventName, params)
  } catch (err) {
    console.debug('[Firebase] Event log failed:', err)
  }
}

// ─── Firestore: session logging ───────────────────────────────────
/**
 * Logs a chat query to Firestore for anonymized analytics.
 * No personal data is stored — only topic categories and timestamps.
 *
 * @param topic - Detected topic category of the query (e.g. 'registration', 'booth')
 * @param language - Language used by the voter
 * @param isConfusionMode - Whether simple mode was active
 */
export async function logChatQuery(
  topic: string,
  language: string,
  isConfusionMode: boolean,
): Promise<void> {
  try {
    const firestore = getDb()
    await addDoc(collection(firestore, 'chat_analytics'), {
      topic,
      language,
      isConfusionMode,
      timestamp: serverTimestamp(),
      appVersion: '2.0',
    })
  } catch (err) {
    // Firestore may not be configured — fail silently
    console.debug('[Firebase] Firestore write failed:', err)
  }
}

/**
 * Logs a booth search event for geographic analytics.
 *
 * @param searchType - 'pincode' | 'location' | 'name'
 */
export async function logBoothSearch(searchType: 'pincode' | 'location' | 'name'): Promise<void> {
  try {
    const firestore = getDb()
    await addDoc(collection(firestore, 'booth_searches'), {
      searchType,
      timestamp: serverTimestamp(),
      appVersion: '2.0',
    })
    await logUserAction('booth_search', { search_type: searchType })
  } catch (err) {
    console.debug('[Firebase] Booth search log failed:', err)
  }
}

export { getDb, getFirebaseApp }
