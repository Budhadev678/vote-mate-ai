import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ChevronRight, Zap, AlertTriangle, Phone, MessageSquare } from 'lucide-react'
import { useStore } from '../store/useStore'

const ESSENTIAL_STEPS = [
  { icon: '📋', step: 'Check Electoral Roll', sub: 'Confirm your name is listed', link: 'voters.eci.gov.in', time: '2 min' },
  { icon: '🧾', step: 'Verify Photo ID', sub: 'Voter ID or Aadhaar ready', time: '1 min' },
  { icon: '📍', step: 'Locate Booth', sub: 'Know your station address', time: '1 min' },
  { icon: '🗳️', step: 'Optimal Voting Window', sub: 'Target 8 AM – 10 AM', time: 'Day of' },
]

const CRITICAL_RULES = [
  'No mobile phones inside the booth',
  'Silence period 48 hrs before polling',
  'Do not accept any inducements',
  'Your vote is 100% confidential',
]

export function QuickModeScreen() {
  const { navigate, goBack } = useStore()

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-slate-900">Quick Guide</h1>
            <p className="text-slate-500 text-xs font-inter mt-1 font-medium">Essential information for busy voters</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Essential steps */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-6">
            Essential Preparation
          </p>
          <div className="space-y-4">
            {ESSENTIAL_STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-inter font-semibold text-slate-900">{item.step}</p>
                  <p className="text-xs text-slate-500 font-inter font-medium truncate">{item.sub}</p>
                  {item.link && (
                    <p className="text-[10px] text-slate-400 font-inter mt-1 font-bold uppercase tracking-wider">{item.link}</p>
                  )}
                </div>
                <span className="text-[10px] font-inter font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg flex-shrink-0">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Critical rules */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="flex gap-4 relative z-10">
            <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">Model Code Rules</p>
              <div className="space-y-2.5">
                {CRITICAL_RULES.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-slate-500 text-sm font-bold">!</span>
                    <p className="text-xs font-inter text-slate-300 font-medium leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency helpline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 border border-slate-100">
            <Phone className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">
              Election Commission Helpline
            </p>
            <p className="text-xl font-poppins font-bold text-slate-900 tracking-tight">1950</p>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-poppins font-bold active:scale-95 transition-all">Call</button>
        </div>

        {/* CTAs */}
        <div className="pt-4 space-y-3">
          <button
            onClick={() => navigate('chat')}
            className="w-full py-4 rounded-xl bg-slate-900 text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Ask AI for details
          </button>
          <button
            onClick={() => navigate('guided')}
            className="w-full py-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-poppins font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            Take Full Guided Journey <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Got it */}
        <button
          onClick={() => navigate('dashboard')}
          className="w-full py-4 rounded-xl bg-slate-100 text-slate-600 text-sm font-poppins font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Got it — Back to Dashboard
        </button>
      </div>
    </div>
  )
}
