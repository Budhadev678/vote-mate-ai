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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Alerts */}
      <AlertBanner />

      {/* Header */}
      <div
        className="px-5 pt-8 pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2D5BE3 100%)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-blue-200 text-xs font-inter mb-1">👋 Welcome back</p>
            <h1 className="text-xl font-poppins font-bold text-white leading-tight">
              {user.name || voterLabel}
            </h1>
            {user.state && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-blue-300" />
                <span className="text-blue-200 text-xs font-inter">{user.state}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <ReadinessRing score={user.readinessScore} size={80} label="Readiness" />
            <div className="absolute -top-2 -right-2">
              <InfoButton text="Your Readiness Score is calculated based on Registration, Verification, ID check, and finding your Booth. Keep completing steps to hit 100%!" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 bg-white/10 rounded-2xl p-4 relative z-10">
          <p className="text-blue-100 text-xs font-inter mb-3 font-medium">📊 Your Journey</p>
          <ProgressBar
            steps={JOURNEY_STEPS}
            current={user.currentStep}
            completed={user.stepsCompleted}
          />
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* 🔥 Next Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-r ${nextActionColors[nextAction.color]} rounded-2xl p-5 shadow-xl`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-inter mb-1 font-medium">🔥 Next Action</p>
              <p className="text-white font-poppins font-bold text-base leading-tight">
                {nextAction.label}
              </p>
            </div>
            <button
              onClick={() => navigate(nextAction.screen)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-poppins font-semibold transition-colors flex-shrink-0 flex items-center gap-1"
            >
              Start <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Quick Access Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide mb-3">
            ⚡ Quick Access
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: MessageCircle, label: 'Ask AI', screen: 'chat' as const, color: 'bg-blue-50 text-blue-700' },
              { icon: FileText, label: 'Guided', screen: 'guided' as const, color: 'bg-green-50 text-green-700' },
              { icon: Zap, label: '1-Min', screen: 'quick' as const, color: 'bg-amber-50 text-amber-700' },
              { icon: MapPin, label: 'Booth', screen: 'polling' as const, color: 'bg-purple-50 text-purple-700' },
              { icon: CheckCircle2, label: 'Docs', screen: 'documents' as const, color: 'bg-teal-50 text-teal-700' },
              { icon: AlertCircle, label: 'Candidates', screen: 'candidates' as const, color: 'bg-indigo-50 text-indigo-700' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.screen}
                  onClick={() => navigate(item.screen)}
                  className={`${item.color} rounded-xl p-3 flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity active:scale-95 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-inter font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Knowledge Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide mb-3">
            📚 Learn Fast
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
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
          transition={{ delay: 0.4 }}
          onClick={() => {
            setConfusionMode(true)
            navigate('chat')
          }}
          className="w-full py-4 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-600 hover:border-blue-400 hover:text-blue-700 transition-all active:scale-95"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-poppins font-medium text-sm">😕 I'm Confused — Simplify Everything</span>
        </motion.button>

        {/* Voting Day prediction CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={() => navigate('crowd')}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-colors active:scale-95"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">
            🔮
          </div>
          <div className="flex-1">
            <p className="text-sm font-poppins font-semibold text-gray-800">Crowd Prediction</p>
            <p className="text-xs font-inter text-gray-500">Best time to vote with short queues</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>

        {/* Community insight teaser */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('community')}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform"
        >
          <span className="text-2xl">📊</span>
          <div className="flex-1">
            <p className="text-sm font-poppins font-semibold text-purple-800">Community Progress</p>
            <p className="text-xs font-inter text-purple-600">See how your area is preparing</p>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-400" />
        </motion.div>
      </div>
    </div>
  )
}
