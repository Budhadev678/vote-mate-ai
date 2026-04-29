// ─── Screens / Pages ─────────────────────────────────────────────
export type Screen =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'chat'
  | 'guided'
  | 'quick'
  | 'timeline'
  | 'glossary'
  | 'polling'
  | 'verify-news'
  | 'documents'
  | 'crowd'
  | 'family'
  | 'community'
  | 'insights'
  | 'profile'
  | 'auth'
  | 'report-violation'
  | 'candidates'
  | 'accessibility'

// ─── User Profile ─────────────────────────────────────────────────
export type VoterType = 'first-time' | 'experienced' | null
export type Language = 'en' | 'hi' | 'or'
export type InteractionMode = 'chat' | 'guided' | 'quick'

export interface UserProfile {
  name: string
  state: string
  voterType: VoterType
  language: Language
  preferredMode: InteractionMode
  onboardingComplete: boolean
  readinessScore: number
  currentStep: 'registration' | 'verification' | 'documents' | 'voting'
  stepsCompleted: StepId[]
  hasValidDocument: boolean
  locationAvailable: boolean
  lastActiveTime: number
  createdAt: number
  isAuthenticated: boolean
  phoneNumber: string
}

// ─── Candidates ───────────────────────────────────────────────────
export interface Candidate {
  id: string
  name: string
  party: string
  partySymbol: string
  education: string
  assets: string
  criminalCases: number
  age: number
}

// ─── Violations (cVIGIL mock) ─────────────────────────────────────
export interface Violation {
  id: string
  type: string
  status: 'pending' | 'resolved'
  date: string
  location: string
}

// ─── Accessibility ────────────────────────────────────────────────
export interface AccessibilityRequest {
  id: string
  type: 'wheelchair' | 'volunteer' | 'transport'
  status: 'requested' | 'confirmed'
  date: string
}

// ─── Steps / Guided Flow ─────────────────────────────────────────
export type StepId = 'registration' | 'verification' | 'documents' | 'voting'

export interface GuidedStep {
  id: StepId
  title: string
  description: string
  icon: string
  tasks: string[]
  tip: string
}

// ─── Chat ─────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isLoading?: boolean
  nextAction?: string
  cards?: KnowledgeCard[]
}

// ─── Knowledge Cards ──────────────────────────────────────────────
export interface KnowledgeCard {
  icon: string
  title: string
  items: string[]
  color: 'blue' | 'green' | 'amber' | 'purple'
}

// ─── Family Members ───────────────────────────────────────────────
export type MemberStatus = 'ready' | 'partial' | 'not-ready'

export interface FamilyMember {
  id: string
  name: string
  ageGroup: 'youth' | 'adult' | 'senior'
  readinessScore: number
  status: MemberStatus
  missingStep?: string
}

// ─── Recommendations / Nudges ─────────────────────────────────────
export interface Recommendation {
  id: string
  message: string
  action: string
  actionLabel: string
  priority: 'high' | 'medium' | 'low'
  icon: string
  color: 'yellow' | 'blue' | 'red' | 'green'
}

// ─── Context / Decision Engine ────────────────────────────────────
export interface AppContext {
  name: string
  userType: VoterType
  state: string
  language: Language
  currentStep: StepId
  hasValidDocument: boolean
  locationAvailable: boolean
  currentDate: Date
  isVotingDay: boolean
  readinessScore: number
  daysToVoting: number
}

// ─── Community Stats ──────────────────────────────────────────────
export interface CommunityStats {
  totalUsers: number
  readyPercent: number
  partialPercent: number
  notReadyPercent: number
  topIssue: string
  areaName: string
}

// ─── News Verification ────────────────────────────────────────────
export type NewsVerdict = 'likely-fake' | 'suspicious' | 'likely-true' | 'uncertain'

export interface NewsAnalysis {
  verdict: NewsVerdict
  confidence: number
  reasons: string[]
  suggestion: string
}

// ─── Crowd Prediction ─────────────────────────────────────────────
export type CrowdLevel = 'low' | 'medium' | 'high'

export interface CrowdData {
  hour: number
  label: string
  level: CrowdLevel
  waitMinutes: number
}

// ─── Onboarding ───────────────────────────────────────────────────
export interface OnboardingStep {
  question: string
  type: 'choice' | 'dropdown' | 'text'
  field: keyof UserProfile
  options?: { label: string; value: string }[]
}

// ─── Alert ────────────────────────────────────────────────────────
export type AlertType = 'urgent' | 'warning' | 'info'

export interface AppAlert {
  id: string
  type: AlertType
  message: string
  actionLabel?: string
  actionScreen?: Screen
  dismissible: boolean
}

// ─── Polling Booth ────────────────────────────────────────────────
export interface PollingBooth {
  name: string
  address: string
  distance: string
  eta: string
  boothNumber: string
}
