import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Screen,
  UserProfile,
  ChatMessage,
  FamilyMember,
  Recommendation,
  AppAlert,
  StepId,
  AppContext,
} from '../types'

// ─── Default user profile ─────────────────────────────────────────
const DEFAULT_PROFILE: UserProfile = {
  name: '',
  state: '',
  voterType: null,
  language: 'en',
  preferredMode: 'chat',
  onboardingComplete: false,
  readinessScore: 0,
  currentStep: 'registration',
  stepsCompleted: [],
  hasValidDocument: false,
  locationAvailable: false,
  lastActiveTime: Date.now(),
  createdAt: Date.now(),
  isAuthenticated: false,
  phoneNumber: '',
}

// ─── Voting day (configurable) ────────────────────────────────────
const VOTING_DATE = new Date('2026-05-20')

interface VoteMateStore {
  // ── Navigation ──────────────────────────────────────────────────
  currentScreen: Screen
  screenHistory: Screen[]
  navigate: (screen: Screen) => void
  goBack: () => void

  // ── User Profile ─────────────────────────────────────────────────
  user: UserProfile
  updateUser: (updates: Partial<UserProfile>) => void
  completeStep: (step: StepId) => void
  resetUser: () => void
  login: (phone: string) => void
  logout: () => void

  // ── Chat ─────────────────────────────────────────────────────────
  messages: ChatMessage[]
  isAiTyping: boolean
  addMessage: (msg: ChatMessage) => void
  setAiTyping: (v: boolean) => void
  clearChat: () => void

  // ── Onboarding ───────────────────────────────────────────────────
  onboardingStep: number
  setOnboardingStep: (n: number) => void
  finishOnboarding: () => void

  // ── Family ───────────────────────────────────────────────────────
  familyMembers: FamilyMember[]
  addFamilyMember: (m: FamilyMember) => void
  removeFamilyMember: (id: string) => void

  // ── Recommendations / Nudges ──────────────────────────────────────
  recommendations: Recommendation[]
  dismissRecommendation: (id: string) => void

  // ── Alerts ───────────────────────────────────────────────────────
  alerts: AppAlert[]
  dismissAlert: (id: string) => void

  // ── Computed context ──────────────────────────────────────────────
  getContext: () => AppContext

  // ── Offline ──────────────────────────────────────────────────────
  isOffline: boolean
  setOffline: (v: boolean) => void

  // ── Confusion mode ────────────────────────────────────────────────
  confusionMode: boolean
  setConfusionMode: (v: boolean) => void

  // ── UI state ──────────────────────────────────────────────────────
  showFloatingBot: boolean
  setShowFloatingBot: (v: boolean) => void
}

// ─── Helpers ──────────────────────────────────────────────────────
function calcReadiness(user: UserProfile): number {
  const checks = [
    user.stepsCompleted.includes('registration'),
    user.stepsCompleted.includes('verification'),
    user.hasValidDocument,
    user.locationAvailable,
  ]
  return Math.round((checks.filter(Boolean).length / 4) * 100)
}

function buildRecommendations(user: UserProfile): Recommendation[] {
  const recs: Recommendation[] = []
  if (!user.stepsCompleted.includes('registration')) {
    recs.push({
      id: 'reg',
      message: 'You haven\'t completed voter registration yet',
      action: 'guided',
      actionLabel: 'Register Now',
      priority: 'high',
      icon: '📋',
      color: 'red',
    })
  }
  if (!user.locationAvailable) {
    recs.push({
      id: 'booth',
      message: 'Find your polling booth before voting day',
      action: 'polling',
      actionLabel: 'Find Booth',
      priority: 'high',
      icon: '📍',
      color: 'yellow',
    })
  }
  if (!user.hasValidDocument) {
    recs.push({
      id: 'docs',
      message: 'Prepare a valid photo ID for voting day',
      action: 'documents',
      actionLabel: 'Check Documents',
      priority: 'medium',
      icon: '🧾',
      color: 'blue',
    })
  }
  recs.push({
    id: 'readiness',
    message: user.readinessScore > 80
      ? "You're almost ready to vote! Complete the last step."
      : 'Track your voting readiness score',
    action: 'dashboard',
    actionLabel: 'View Progress',
    priority: 'low',
    icon: '🎯',
    color: 'green',
  })
  return recs
}

function buildAlerts(): AppAlert[] {
  const alerts: AppAlert[] = []
  const now = new Date()
  const diff = Math.ceil((VOTING_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) {
    alerts.push({
      id: 'voting-day',
      type: 'urgent',
      message: '🗳️ Today is Voting Day! Go cast your vote.',
      actionLabel: 'Find My Booth',
      actionScreen: 'polling',
      dismissible: false,
    })
  } else if (diff === 1) {
    alerts.push({
      id: 'tomorrow',
      type: 'urgent',
      message: '⚠️ Voting is TOMORROW! Make sure you\'re fully prepared.',
      actionLabel: 'Check Readiness',
      actionScreen: 'dashboard',
      dismissible: true,
    })
  } else if (diff <= 3) {
    alerts.push({
      id: 'soon',
      type: 'warning',
      message: `🗓️ Voting Day is in ${diff} days — ${diff === 2 ? 'Final check time!' : 'Complete your preparation.'}`,
      actionLabel: 'View Checklist',
      actionScreen: 'guided',
      dismissible: true,
    })
  }
  return alerts
}

export const useStore = create<VoteMateStore>()(
  persist(
    (set, get) => ({
      // ── Navigation ────────────────────────────────────────────────
      currentScreen: 'landing',
      screenHistory: [],
      navigate: (screen) =>
        set((s) => ({ screenHistory: [...s.screenHistory, s.currentScreen], currentScreen: screen })),
      goBack: () =>
        set((s) => {
          const newHistory = [...s.screenHistory]
          const prev = newHistory.pop()
          return {
            currentScreen: prev ?? 'dashboard',
            screenHistory: newHistory,
          }
        }),

      // ── User Profile ──────────────────────────────────────────────
      user: DEFAULT_PROFILE,
      updateUser: (updates) =>
        set((s) => {
          const next = { ...s.user, ...updates, lastActiveTime: Date.now() }
          next.readinessScore = calcReadiness(next)
          // Sync document lang attribute for screen reader accessibility
          if (updates.language) {
            const langMap: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', or: 'or-IN' }
            document.documentElement.lang = langMap[updates.language] ?? 'en-IN'
          }
          return { user: next, recommendations: buildRecommendations(next) }
        }),
      completeStep: (step) =>
        set((s) => {
          if (s.user.stepsCompleted.includes(step)) return {}
          const stepsCompleted = [...s.user.stepsCompleted, step]
          const ORDER: StepId[] = ['registration', 'verification', 'documents', 'voting']
          const nextIdx = ORDER.indexOf(step) + 1
          const currentStep: StepId = nextIdx < ORDER.length ? ORDER[nextIdx] : 'voting'
          const next = { ...s.user, stepsCompleted, currentStep }
          next.readinessScore = calcReadiness(next)
          return { user: next, recommendations: buildRecommendations(next) }
        }),
      resetUser: () => set({ user: DEFAULT_PROFILE, messages: [], onboardingStep: 0 }),
      login: (phone) => set((s) => ({ user: { ...s.user, isAuthenticated: true, phoneNumber: phone } })),
      logout: () => set((s) => ({ user: { ...s.user, isAuthenticated: false, phoneNumber: '' }, currentScreen: 'auth' })),

      // ── Chat ──────────────────────────────────────────────────────
      messages: [],
      isAiTyping: false,
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      setAiTyping: (v) => set({ isAiTyping: v }),
      clearChat: () => set({ messages: [] }),

      // ── Onboarding ────────────────────────────────────────────────
      onboardingStep: 0,
      setOnboardingStep: (n) => set({ onboardingStep: n }),
      finishOnboarding: () => {
        set((s) => ({
          user: { ...s.user, onboardingComplete: true },
          alerts: buildAlerts(),
          recommendations: buildRecommendations(s.user),
        }))
        get().navigate('dashboard')
      },

      // ── Family ────────────────────────────────────────────────────
      familyMembers: [],
      addFamilyMember: (m) => set((s) => ({ familyMembers: [...s.familyMembers, m] })),
      removeFamilyMember: (id) =>
        set((s) => ({ familyMembers: s.familyMembers.filter((m) => m.id !== id) })),

      // ── Recommendations ───────────────────────────────────────────
      recommendations: [],
      dismissRecommendation: (id) =>
        set((s) => ({ recommendations: s.recommendations.filter((r) => r.id !== id) })),

      // ── Alerts ────────────────────────────────────────────────────
      alerts: buildAlerts(),
      dismissAlert: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

      // ── Context ───────────────────────────────────────────────────
      getContext: () => {
        const { user } = get()
        const now = new Date()
        const diff = Math.ceil((VOTING_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return {
          name: user.name,
          userType: user.voterType,
          state: user.state,
          language: user.language,
          currentStep: user.currentStep,
          hasValidDocument: user.hasValidDocument,
          locationAvailable: user.locationAvailable,
          currentDate: now,
          isVotingDay: diff === 0,
          readinessScore: user.readinessScore,
          daysToVoting: Math.max(0, diff),
        }
      },

      // ── Offline ───────────────────────────────────────────────────
      isOffline: false,
      setOffline: (v) => set({ isOffline: v }),

      // ── Confusion mode ────────────────────────────────────────────
      confusionMode: false,
      setConfusionMode: (v) => set({ confusionMode: v }),

      // ── UI ────────────────────────────────────────────────────────
      showFloatingBot: true,
      setShowFloatingBot: (v) => set({ showFloatingBot: v }),
    }),
    {
      name: 'votemate-store',
      partialState: (s: VoteMateStore) => ({
        user: s.user,
        messages: s.messages?.slice(-50) ?? [],
        familyMembers: s.familyMembers ?? [],
        onboardingStep: s.onboardingStep ?? 0,
      }),
    }
  ),
)
