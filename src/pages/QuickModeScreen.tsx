import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'

const ESSENTIAL_STEPS = [
  { icon: '📋', step: 'Check your name on Electoral Roll', link: 'voters.eci.gov.in', time: '2 min' },
  { icon: '🧾', step: 'Keep valid photo ID ready', sub: 'Voter ID or Aadhaar', time: '1 min' },
  { icon: '📍', step: 'Know your polling booth location', sub: 'Check voter slip or eci.gov.in', time: '1 min' },
  { icon: '🗳️', step: 'Go to booth by 8–10 AM', sub: 'Avoid 12–2 PM rush', time: 'Day of' },
]

const CRITICAL_RULES = [
  'Do NOT carry mobile phones inside voting booth',
  'Silence period 48 hrs before polling — no campaigning',
  'Do NOT accept money or gifts from candidates',
  'Your vote is secret — no one can force you',
]

export function QuickModeScreen() {
  const { navigate, goBack } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <button onClick={goBack} className="absolute left-5 top-8 text-white/80">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-4xl mb-2">⚡</div>
        <h1 className="text-2xl font-poppins font-bold text-white">1-Minute Guide</h1>
        <p className="text-amber-100 text-sm font-inter mt-1">Everything you need — in 60 seconds</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Essential steps */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
              Essential Steps
            </span>
          </div>
          <div className="space-y-3">
            {ESSENTIAL_STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-inter font-medium text-gray-800">{item.step}</p>
                  {item.sub && <p className="text-xs text-gray-500 font-inter">{item.sub}</p>}
                  {item.link && (
                    <p className="text-xs text-blue-600 font-inter">🔗 {item.link}</p>
                  )}
                </div>
                <span className="text-xs font-inter text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Critical rules */}
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <p className="text-xs font-poppins font-semibold text-red-600 uppercase tracking-wide mb-3">
            ⚠️ Critical Rules
          </p>
          <div className="space-y-2">
            {CRITICAL_RULES.map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-red-500 text-sm mt-0.5 flex-shrink-0">✗</span>
                <p className="text-xs font-inter text-red-800">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency helpline */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
          <div className="text-2xl">📞</div>
          <div>
            <p className="text-sm font-poppins font-semibold text-blue-800">
              Election Helpline
            </p>
            <p className="text-lg font-poppins font-bold text-blue-700">1950</p>
            <p className="text-xs font-inter text-blue-600">Toll-free | Available during election</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('chat')}
            className="w-full py-3 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 shadow-md"
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}
          >
            💬 Ask AI for more details
          </button>
          <button
            onClick={() => navigate('guided')}
            className="w-full py-3 rounded-xl border-2 border-green-500 text-green-700 text-sm font-poppins font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors"
          >
            🧭 Take Full Guided Journey <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Got it */}
        <button
          onClick={() => navigate('dashboard')}
          className="w-full py-3 rounded-xl bg-amber-100 text-amber-800 text-sm font-poppins font-semibold flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Got it 👍 — Back to Dashboard
        </button>
      </div>
    </div>
  )
}
