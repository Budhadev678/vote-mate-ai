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
    <div className="min-h-full bg-mesh pb-32">
      {/* Alerts */}
      <AlertBanner />

      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden rounded-b-3xl shadow-lg mb-6" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
        <div className="relative px-5 pt-10 pb-6">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-white/60 text-xs font-inter">Welcome back 👋</span>
              </div>
              <h1 className="text-2xl font-poppins font-bold text-white leading-tight truncate">
                {user.name || voterLabel}
              </h1>
              {user.state && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-white/60" />
                  <span className="text-white/70 text-xs font-inter">{user.state}</span>
                </div>
              )}
            </div>

            <div className="relative flex-shrink-0 ml-3">
              <ReadinessRing score={user.readinessScore} size={64} label="Readiness" />
              <div className="absolute -top-1 -right-1">
                <InfoButton text="Your Readiness Score is calculated based on Registration, Verification, ID check, and finding your Booth. Keep completing steps to hit 100%!" />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-4 border-t border-white/15">
            <p className="text-white/60 text-[10px] font-inter mb-2 font-bold uppercase tracking-widest">Your Journey</p>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
              <ProgressBar
                steps={JOURNEY_STEPS}
                current={user.currentStep}
                completed={user.stepsCompleted}
              />
            </div>
          </div>
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
              className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-poppins font-medium transition-colors flex-shrink-0 flex items-center gap-1 active:scale-95 shadow-md"
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

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="text-amber-600 text-lg">🔔</span>
              </div>
              <p className="text-sm font-poppins font-medium text-slate-900">Notifications</p>
            </div>
            {useStore.getState().alerts.length > 0 && (
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {useStore.getState().alerts.length} new
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            {useStore.getState().alerts.length === 0 ? (
              <p className="text-xs text-slate-500 font-inter py-2 text-center bg-slate-50 rounded-lg">You're all caught up!</p>
            ) : (
              useStore.getState().alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-sm mt-0.5">{alert.type === 'urgent' ? '⚡' : alert.type === 'warning' ? '📍' : '📊'}</div>
                  <p className="text-xs font-inter text-slate-700 leading-snug flex-1">{alert.message}</p>
                </div>
              ))
            )}
          </div>
          {useStore.getState().alerts.length > 0 && (
             <button 
               onClick={() => {
                 const store = useStore.getState();
                 store.alerts.forEach(a => store.dismissAlert(a.id));
               }}
               className="w-full mt-3 py-2 text-xs font-inter font-medium text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 rounded-lg"
             >
               Clear All
             </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
