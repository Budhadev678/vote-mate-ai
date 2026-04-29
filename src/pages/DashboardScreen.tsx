import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, MapPin, FileText, MessageCircle, Zap, HelpCircle, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ProgressBar } from '../components/ProgressBar'
import { ReadinessRing } from '../components/ReadinessRing'
import { AlertBanner } from '../components/AlertBanner'
import { QUICK_CARDS } from '../components/KnowledgeCard'
import { KnowledgeCard } from '../components/KnowledgeCard'
import { InfoButton } from '../components/InfoButton'

const JOURNEY_STEPS = [
  { id: 'registration', label: 'Register' },
  { id: 'verification', label: 'Verify' },
  { id: 'documents', label: 'Docs Ready' },
  { id: 'voting', label: 'Vote Day' },
]

export function DashboardScreen() {
  const { user, navigate, setConfusionMode, getContext } = useStore()
  const ctx = getContext()

  // ── Next Action Engine ──────────────────────────────────────────
  const getNextAction = () => {
    if (ctx.isVotingDay) return { label: 'Go Vote Now! 🗳️', screen: 'polling' as const, color: 'red' }
    if (!user.stepsCompleted.includes('registration'))
      return { label: 'Register for Voter ID', screen: 'guided' as const, color: 'blue' }
    if (!user.stepsCompleted.includes('verification'))
      return { label: 'Verify Your Details', screen: 'guided' as const, color: 'blue' }
    if (!user.hasValidDocument)
      return { label: 'Prepare Valid ID Document', screen: 'documents' as const, color: 'amber' }
    if (!user.locationAvailable)
      return { label: 'Find Your Polling Booth', screen: 'polling' as const, color: 'green' }
    return { label: 'You\'re Ready to Vote! ✅', screen: 'crowd' as const, color: 'green' }
  }

  const nextAction = getNextAction()

  const nextActionColors: Record<string, string> = {
    blue: 'from-blue-700 to-blue-500',
    green: 'from-green-600 to-green-400',
    amber: 'from-amber-600 to-amber-400',
    red: 'from-red-600 to-red-500',
  }

  const voterLabel = user.voterType === 'first-time' ? 'First-Time Voter' : 'Voter'

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Alerts */}
      <AlertBanner />

      {/* Header */}
      <div className="px-5 pt-8 pb-6 bg-white border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-xs font-inter mb-1">Welcome</p>
            <h1 className="text-2xl font-poppins font-semibold text-slate-900 leading-tight">
              {user.name || voterLabel}
            </h1>
            {user.state && (
              <div className="flex items-center gap-1 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-600 text-sm font-inter">{user.state}</span>
              </div>
            )}
          </div>

          <div className="relative">
            {/* Sync check: v2 */}
            <ReadinessRing score={user.readinessScore} size={64} label="Readiness" />
            <div className="absolute -top-1 -right-1">
              <InfoButton text="Your Readiness Score is calculated based on Registration, Verification, ID check, and finding your Booth. Keep completing steps to hit 100%!" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-slate-500 text-xs font-inter mb-3 font-medium uppercase tracking-wider">Your Progress</p>
          <ProgressBar
            steps={JOURNEY_STEPS}
            current={user.currentStep}
            completed={user.stepsCompleted}
          />
        </div>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {/* 🔥 Next Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-inter mb-1 font-medium uppercase tracking-wider">Next Step</p>
              <p className="text-slate-900 font-poppins font-medium text-base">
                {nextAction.label}
              </p>
            </div>
            <button
              onClick={() => navigate(nextAction.screen)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-poppins font-medium transition-colors flex-shrink-0 flex items-center gap-1 active:scale-95"
            >
              Continue
            </button>
          </div>
        </motion.div>

        {/* Quick Access Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
        >
          <p className="text-xs font-inter font-medium text-slate-500 uppercase tracking-wider mb-4">
            Quick Tools
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: MessageCircle, label: 'Ask AI', screen: 'chat' as const },
              { icon: FileText, label: 'Guided', screen: 'guided' as const },
              { icon: Zap, label: 'Quick', screen: 'quick' as const },
              { icon: MapPin, label: 'Booth', screen: 'polling' as const },
              { icon: CheckCircle2, label: 'Docs', screen: 'documents' as const },
              { icon: AlertCircle, label: 'Candidates', screen: 'candidates' as const },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.screen}
                  onClick={() => navigate(item.screen)}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                  <Icon className="w-5 h-5 text-slate-700" />
                  <span className="text-xs font-inter font-medium text-slate-600">{item.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Knowledge Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs font-inter font-medium text-slate-500 uppercase tracking-wider mb-3">
            Learn More
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {QUICK_CARDS.map((card) => (
              <div key={card.title} className="flex-shrink-0">
                <KnowledgeCard card={card} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Confusion Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            setConfusionMode(true)
            navigate('chat')
          }}
          className="w-full py-4 rounded-xl bg-white border border-slate-300 flex items-center justify-center gap-2 text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <HelpCircle className="w-5 h-5 text-slate-500" />
          <span className="font-poppins font-medium text-sm">Need help? Ask AI</span>
        </motion.button>

        {/* Voting Day prediction CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate('crowd')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
            🔮
          </div>
          <div className="flex-1">
            <p className="text-sm font-poppins font-medium text-slate-900">Crowd Prediction</p>
            <p className="text-xs font-inter text-slate-500">Best time to vote with short queues</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </motion.div>

        {/* Community insight teaser */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate('community')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
            📊
          </div>
          <div className="flex-1">
            <p className="text-sm font-poppins font-medium text-slate-900">Community Progress</p>
            <p className="text-xs font-inter text-slate-500">See how your area is preparing</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </motion.div>
      </div>
    </div>
  )
}
