/**
 * @file useAI.ts
 * @description Custom React hook for interacting with the VoteMate AI engine.
 * Manages AI request state, error handling, rate limiting, and integrates
 * with Firebase Analytics to track query patterns.
 */

import { useState, useCallback, useRef } from 'react'
import { askAI } from '../services/aiService'
import { logChatQuery } from '../services/firebase'
import { createRateLimiter, sanitizeInput } from '../utils/sanitize'
import { CHAT_RATE_LIMIT_MAX, CHAT_RATE_LIMIT_WINDOW_MS } from '../utils/constants'
import type { AppContext } from '../types'

interface AIState {
  isLoading: boolean
  error: string | null
  lastResponse: { content: string; nextAction: string } | null
}

interface AIHook extends AIState {
  /** Send a message to the AI and get a response */
  sendMessage: (
    message: string,
    context: AppContext,
    confusionMode?: boolean,
  ) => Promise<{ content: string; nextAction: string } | null>
  /** Clear the current error state */
  clearError: () => void
  /** Whether the rate limit has been exceeded */
  isRateLimited: boolean
}

/**
 * Custom hook for VoteMate AI interactions.
 * Features:
 * - Input sanitization before sending to AI
 * - Rate limiting (max 10 messages/minute)
 * - Error handling with user-friendly messages
 * - Firebase Analytics tracking for query topics
 * - Loading state management
 *
 * Usage:
 * ```tsx
 * const { sendMessage, isLoading, error } = useAI()
 * const result = await sendMessage(userInput, context)
 * ```
 */
export function useAI(): AIHook {
  const [state, setState] = useState<AIState>({
    isLoading: false,
    error: null,
    lastResponse: null,
  })
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Rate limiter: max 10 calls per minute
  const rateLimiter = useRef(
    createRateLimiter(CHAT_RATE_LIMIT_MAX, CHAT_RATE_LIMIT_WINDOW_MS),
  ).current

  const sendMessage = useCallback(
    async (
      message: string,
      context: AppContext,
      confusionMode = false,
    ): Promise<{ content: string; nextAction: string } | null> => {
      // Sanitize input
      const sanitized = sanitizeInput(message)
      if (!sanitized) {
        setState((s) => ({ ...s, error: 'Please enter a valid question.' }))
        return null
      }

      // Check rate limit
      if (!rateLimiter()) {
        setIsRateLimited(true)
        setState((s) => ({
          ...s,
          error: 'You are sending messages too quickly. Please wait a moment.',
        }))
        setTimeout(() => setIsRateLimited(false), 10_000)
        return null
      }

      setState({ isLoading: true, error: null, lastResponse: null })

      try {
        const response = await askAI(sanitized, context, confusionMode)

        // Detect topic for analytics (no personal data logged)
        const lower = sanitized.toLowerCase()
        const topic =
          lower.includes('register') ? 'registration' :
          lower.includes('booth') || lower.includes('where') ? 'booth' :
          lower.includes('document') || lower.includes('id') ? 'documents' :
          lower.includes('evm') || lower.includes('machine') ? 'evm' :
          lower.includes('fake') || lower.includes('news') ? 'news' : 'general'

        // Log anonymized query topic to Firebase
        logChatQuery(topic, context.language ?? 'en', confusionMode).catch(console.debug)

        setState({ isLoading: false, error: null, lastResponse: response })
        return response
      } catch (err) {
        const errorMessage =
          err instanceof Error && import.meta.env.DEV
            ? `AI Error: ${err.message}`
            : 'Unable to get a response right now. The offline guide is still available.'

        setState({ isLoading: false, error: errorMessage, lastResponse: null })
        return null
      }
    },
    [rateLimiter],
  )

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
    setIsRateLimited(false)
  }, [])

  return {
    ...state,
    isRateLimited,
    sendMessage,
    clearError,
  }
}
