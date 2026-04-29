import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'
import { useAnalytics } from './hooks/useAnalytics'

// ── Screens ────────────────────────────────────────────────────────
import { LandingScreen } from './pages/LandingScreen'
import { OnboardingScreen } from './pages/OnboardingScreen'
import { DashboardScreen } from './pages/DashboardScreen'
import { ChatScreen } from './pages/ChatScreen'
import { GuidedScreen } from './pages/GuidedScreen'
import { QuickModeScreen } from './pages/QuickModeScreen'
import { TimelineScreen } from './pages/TimelineScreen'
import { GlossaryScreen } from './pages/GlossaryScreen'
import { PollingBoothScreen } from './pages/PollingBoothScreen'
import { VerifyNewsScreen } from './pages/VerifyNewsScreen'
import { DocumentCheckerScreen } from './pages/DocumentCheckerScreen'
import { CrowdPredictionScreen } from './pages/CrowdPredictionScreen'
import { FamilyScreen } from './pages/FamilyScreen'
import { CommunityScreen } from './pages/CommunityScreen'
import { InsightsScreen } from './pages/InsightsScreen'
import { ProfileScreen } from './pages/ProfileScreen'
import { AuthScreen } from './pages/AuthScreen'
import { ReportViolationScreen } from './pages/ReportViolationScreen'
import { CandidatesScreen } from './pages/CandidatesScreen'
import { AccessibilityScreen } from './pages/AccessibilityScreen'

// ── Layout components ──────────────────────────────────────────────
import { BottomNav } from './components/BottomNav'
import { FloatingBot } from './components/FloatingBot'

// ── Transition wrapper ─────────────────────────────────────────────
function PageTransition({ children, screenKey }: { children: React.ReactNode; screenKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex-1 flex flex-col min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const { currentScreen, setOffline } = useStore()
  const { trackScreen } = useAnalytics()
  const mainRef = useRef<HTMLElement>(null)

  // ── Track screen views for Google Analytics + Firebase ──────────
  useEffect(() => {
    trackScreen(currentScreen)
  }, [currentScreen, trackScreen])

  // ── Scroll to top on screen change ─────────────────────────────
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [currentScreen])

  // ── Sync Browser History for Hardware Back Button ────────────────
  useEffect(() => {
    const currentHash = `#${currentScreen}`
    if (window.location.hash !== currentHash) {
      window.history.pushState(null, '', currentHash)
    }
  }, [currentScreen])

  useEffect(() => {
    const handlePopState = () => {
      const hashScreen = window.location.hash.replace('#', '')
      if (hashScreen && hashScreen !== useStore.getState().currentScreen) {
        useStore.setState((s) => {
          const newHistory = [...s.screenHistory]
          newHistory.pop()
          return { currentScreen: hashScreen as any, screenHistory: newHistory }
        })
      }
    }
    
    if (!window.location.hash) {
       window.history.replaceState(null, '', `#${currentScreen}`)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // ── Offline detection ──────────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setOffline(!navigator.onLine)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOffline])

  // ── Auth Protection ──────────────────────────────────────────────
  const { user, navigate } = useStore()
  useEffect(() => {
    const publicScreens = ['landing', 'auth']
    if (!user.isAuthenticated && !publicScreens.includes(currentScreen)) {
      navigate('auth')
    }
  }, [user.isAuthenticated, currentScreen, navigate])

  // ── Render current screen ─────────────────────────────────────
  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen />
      case 'onboarding':
        return <OnboardingScreen />
      case 'dashboard':
        return <DashboardScreen />
      case 'chat':
        return <ChatScreen />
      case 'guided':
        return <GuidedScreen />
      case 'quick':
        return <QuickModeScreen />
      case 'timeline':
        return <TimelineScreen />
      case 'glossary':
        return <GlossaryScreen />
      case 'polling':
        return <PollingBoothScreen />
      case 'verify-news':
        return <VerifyNewsScreen />
      case 'documents':
        return <DocumentCheckerScreen />
      case 'crowd':
        return <CrowdPredictionScreen />
      case 'family':
        return <FamilyScreen />
      case 'community':
        return <CommunityScreen />
      case 'insights':
        return <InsightsScreen />
      case 'profile':
        return <ProfileScreen />
      case 'auth':
        return <AuthScreen />
      case 'report-violation':
        return <ReportViolationScreen />
      case 'candidates':
        return <CandidatesScreen />
      case 'accessibility':
        return <AccessibilityScreen />
      default:
        return <LandingScreen />
    }
  }

  return (
    <div className="w-full max-w-[480px] mx-auto h-[100dvh] bg-slate-50 flex flex-col relative shadow-2xl sm:border-x sm:border-slate-200 overflow-hidden">
      {/* Offline banner */}
      <OfflineBanner />

      {/* Main screen — min-h-0 is critical so flex children can shrink */}
      <main
        id="main-content"
        ref={mainRef}
        role="main"
        aria-label="VoteMate AI main content"
        className="flex-1 min-h-0 flex flex-col w-full relative overflow-hidden"
      >
        <PageTransition screenKey={currentScreen}>{renderScreen()}</PageTransition>
      </main>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Floating AI button */}
      <FloatingBot />
    </div>
  )
}

// ── Offline banner component ───────────────────────────────────────
function OfflineBanner() {
  const isOffline = useStore((s) => s.isOffline)
  const [dismissed, setDismissed] = useState(false)

  // Reset dismissed state when coming back online
  useEffect(() => {
    if (!isOffline) setDismissed(false)
  }, [isOffline])

  if (!isOffline || dismissed) return null

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200"
      >
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
          <span className="text-3xl">🚫</span>
        </div>
        <h3 className="text-xl font-poppins font-semibold text-slate-900 mb-2">
          No Internet
        </h3>
        <p className="text-sm font-inter text-slate-500 mb-8 leading-relaxed">
          You are currently offline. Some features like live chat or crowd prediction may not work, but you can still access downloaded guides and your readiness profile.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-poppins font-medium transition-colors"
          >
            Retry Connection
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-poppins font-medium transition-colors"
          >
            Continue Offline
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default App
