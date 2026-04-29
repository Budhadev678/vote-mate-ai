import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { validateEnvironment } from './utils/sanitize.ts'
import { initPerformanceMonitoring, initRemoteConfig } from './services/googleServices.ts'

// Validate environment variables on startup
validateEnvironment()

/**
 * Initialize Google Firebase services on app boot:
 * - Firebase Performance Monitoring (web vitals, network traces)
 * - Firebase Remote Config (feature flags, dynamic election dates)
 *
 * Both services degrade gracefully if credentials are absent.
 */
initPerformanceMonitoring()
initRemoteConfig().catch(console.debug)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('[VoteMate] Root element #root not found in DOM.')
}

/**
 * Dynamically updates the document `lang` attribute based on the
 * user's language preference stored in Zustand. This is critical for
 * screen readers and search engines to correctly interpret the page language.
 *
 * @param lang - Language code ('en', 'hi', 'or')
 */
function updateDocumentLang(lang: string): void {
  const langMap: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    or: 'or-IN',
  }
  document.documentElement.lang = langMap[lang] ?? 'en-IN'
  document.documentElement.setAttribute('xml:lang', langMap[lang] ?? 'en-IN')
}

// Set initial language from persisted store
try {
  const stored = localStorage.getItem('votemate-store')
  if (stored) {
    const parsed = JSON.parse(stored)
    const lang = parsed?.state?.user?.language ?? 'en'
    updateDocumentLang(lang)
  }
} catch {
  // Ignore parse errors — default to English
}

// Export for use in store subscription
export { updateDocumentLang }

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
