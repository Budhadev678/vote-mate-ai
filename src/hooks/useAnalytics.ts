/**
 * @file useAnalytics.ts
 * @description Custom React hook for Google Analytics + Firebase Analytics
 * integration in VoteMate AI. Provides a unified interface for tracking
 * screen views, user actions, and events across both analytics platforms.
 */

import { useCallback } from 'react'
import { logScreenView, logUserAction } from '../services/firebase'

interface AnalyticsHook {
  /** Track a page/screen view */
  trackScreen: (screenName: string) => void
  /** Track a user action event */
  trackEvent: (event: string, params?: Record<string, string | number | boolean>) => void
  /** Track a search action */
  trackSearch: (query: string, category: string) => void
  /** Track a feature usage */
  trackFeature: (feature: string) => void
}

/**
 * Custom hook providing Google Analytics + Firebase Analytics tracking.
 *
 * Usage:
 * ```tsx
 * const { trackScreen, trackEvent } = useAnalytics()
 * useEffect(() => { trackScreen('Dashboard') }, [])
 * ```
 */
export function useAnalytics(): AnalyticsHook {
  const trackScreen = useCallback((screenName: string): void => {
    // Firebase Analytics screen view
    logScreenView(screenName).catch(console.debug)

    // Google Analytics 4 (gtag) page view
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as Window & { gtag: (...args: unknown[]) => void }).gtag(
        'event',
        'page_view',
        {
          page_title: screenName,
          page_location: window.location.href,
        },
      )
    }
  }, [])

  const trackEvent = useCallback(
    (event: string, params?: Record<string, string | number | boolean>): void => {
      logUserAction(event, params).catch(console.debug)

      if (typeof window !== 'undefined' && 'gtag' in window) {
        ;(window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', event, params)
      }
    },
    [],
  )

  const trackSearch = useCallback((query: string, category: string): void => {
    trackEvent('search', {
      search_term: query.slice(0, 100),
      search_category: category,
    })
  }, [trackEvent])

  const trackFeature = useCallback((feature: string): void => {
    trackEvent('feature_used', { feature_name: feature })
  }, [trackEvent])

  return { trackScreen, trackEvent, trackSearch, trackFeature }
}
