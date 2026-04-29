import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore'

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
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const { currentScreen, setOffline } = useStore()

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
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-0 sm:p-4 md:p-8">
      <div className="w-full max-w-md bg-white h-[100dvh] sm:h-[90vh] sm:rounded-[2.5rem] flex flex-col relative shadow-2xl border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
      {/* Offline banner */}
      <OfflineBanner />

      {/* Main screen */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <PageTransition screenKey={currentScreen}>{renderScreen()}</PageTransition>
      </main>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Floating AI button */}
        <FloatingBot />
      </div>
    </div>
  )
}

// ── Offline banner component ───────────────────────────────────────
function OfflineBanner() {
  const isOffline = useStore((s) => s.isOffline)
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="bg-slate-900 text-white text-[10px] font-inter font-bold uppercase tracking-[0.2em] py-2.5 px-4 flex items-center justify-center gap-3 border-b border-slate-800"
        >
          <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
          <span>Offline Mode — Features Limited</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
