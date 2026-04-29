import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from '../hooks/useAnalytics'
import { useAI } from '../hooks/useAI'
import * as firebaseServices from '../services/firebase'
import * as aiServices from '../services/aiService'

// Mock Firebase services
vi.mock('../services/firebase', () => ({
  logScreenView: vi.fn().mockResolvedValue(undefined),
  logUserAction: vi.fn().mockResolvedValue(undefined),
  logChatQuery: vi.fn().mockResolvedValue(undefined),
}))

// Mock AI service
vi.mock('../services/aiService', () => ({
  askAI: vi.fn().mockResolvedValue({ content: 'Mocked response', nextAction: 'None' }),
}))

describe('Hooks integration tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock gtag on window
    const gtagMock = vi.fn()
    vi.stubGlobal('gtag', gtagMock)
  })

  describe('useAnalytics', () => {
    it('trackScreen calls logScreenView and gtag', () => {
      const { result } = renderHook(() => useAnalytics())

      act(() => {
        result.current.trackScreen('Dashboard')
      })

      expect(firebaseServices.logScreenView).toHaveBeenCalledWith('Dashboard')
      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', expect.any(Object))
    })

    it('trackEvent calls logUserAction and gtag', () => {
      const { result } = renderHook(() => useAnalytics())

      act(() => {
        result.current.trackEvent('button_click', { button_name: 'test' })
      })

      expect(firebaseServices.logUserAction).toHaveBeenCalledWith('button_click', { button_name: 'test' })
      expect(window.gtag).toHaveBeenCalledWith('event', 'button_click', { button_name: 'test' })
    })

    it('trackSearch calls trackEvent with search formatting', () => {
      const { result } = renderHook(() => useAnalytics())

      act(() => {
        result.current.trackSearch('polling booth', 'booth')
      })

      expect(firebaseServices.logUserAction).toHaveBeenCalledWith('search', {
        search_term: 'polling booth',
        search_category: 'booth',
      })
    })

    it('trackFeature calls trackEvent with feature formatting', () => {
      const { result } = renderHook(() => useAnalytics())

      act(() => {
        result.current.trackFeature('quick_mode')
      })

      expect(firebaseServices.logUserAction).toHaveBeenCalledWith('feature_used', {
        feature_name: 'quick_mode',
      })
    })
  })

  describe('useAI', () => {
    const mockContext = {
      isVotingDay: false,
      language: 'en' as const,
      hasValidDocument: true,
      stepsCompleted: ['registration'],
    }

    it('initializes with default state', () => {
      const { result } = renderHook(() => useAI())
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.lastResponse).toBeNull()
      expect(result.current.isRateLimited).toBe(false)
    })

    it('sendMessage calls askAI and logs to firebase', async () => {
      const { result } = renderHook(() => useAI())

      let response
      await act(async () => {
        response = await result.current.sendMessage('How do I register?', mockContext, false)
      })

      expect(aiServices.askAI).toHaveBeenCalledWith('How do I register?', mockContext, false)
      expect(firebaseServices.logChatQuery).toHaveBeenCalledWith('registration', 'en', false)
      expect(response).toEqual({ content: 'Mocked response', nextAction: 'None' })
      expect(result.current.lastResponse).toEqual({ content: 'Mocked response', nextAction: 'None' })
      expect(result.current.error).toBeNull()
    })

    it('handles empty or invalid input', async () => {
      const { result } = renderHook(() => useAI())

      let response
      await act(async () => {
        response = await result.current.sendMessage('   ', mockContext, false)
      })

      expect(aiServices.askAI).not.toHaveBeenCalled()
      expect(response).toBeNull()
      expect(result.current.error).toBe('Please enter a valid question.')
    })

    it('clears error state when clearError is called', () => {
      const { result } = renderHook(() => useAI())

      // Force an error state
      act(() => {
        result.current.sendMessage('   ', mockContext, false)
      })
      expect(result.current.error).not.toBeNull()

      // Clear error
      act(() => {
        result.current.clearError()
      })
      expect(result.current.error).toBeNull()
    })
  })
})
