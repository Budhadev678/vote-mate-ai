import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, HelpCircle, ExternalLink } from 'lucide-react'
import { useStore } from '../store/useStore'
import { verifyNews } from '../services/aiService'
import type { NewsVerdict, NewsAnalysis } from '../types'

const VERDICT_CONFIG = {
  'likely-fake': {
    icon: '🚨',
    label: 'Likely Fake',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-600 text-white',
  },
  suspicious: {
    icon: '⚠️',
    label: 'Suspicious',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-500 text-white',
  },
  'likely-true': {
    icon: '✅',
    label: 'Likely True',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-600 text-white',
  },
  uncertain: {
    icon: '❓',
    label: 'Uncertain',
    color: 'text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badge: 'bg-gray-500 text-white',
  },
}

const SAMPLE_NEWS = [
  'EVM machines can be hacked remotely to change votes',
  'Voting date changed to next week due to weather',
  'New law: You must bring Aadhaar card to vote, voter ID not valid',
  'Elections Commission announces extended voting hours till 8 PM',
]

export function VerifyNewsScreen() {
  const { goBack, user } = useStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NewsAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const analysis = await verifyNews(input, user.language)
      setResult(analysis as NewsAnalysis)
    } catch {
      setError('Unable to analyze. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cfg = result ? VERDICT_CONFIG[result.verdict] : null

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-slate-900">Trust Shield</h1>
            <p className="text-slate-500 text-xs font-inter mt-1 font-medium">Verify election information veracity</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Disclaimer */}
        {/* Disclaimer */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg flex gap-3 relative overflow-hidden">
          <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <p className="text-xs font-inter text-slate-300 leading-relaxed">
            This tool analyzes credibility markers. Always cross-verify with official 
            Election Commission resources at <span className="text-white font-semibold">eci.gov.in</span>.
          </p>
        </div>

        {/* Input */}
        {/* Input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm font-inter font-semibold text-slate-800 mb-4">
            Analyze News or Messages
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste news headline or WhatsApp forward..."
            className="w-full px-4 py-4 rounded-xl border border-slate-200 text-sm font-inter text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-sm transition-all resize-none h-32"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="mt-4 w-full py-4 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 bg-slate-900 disabled:opacity-30 active:scale-[0.98] transition-all shadow-md shadow-slate-200"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Analyze Veracity
              </>
            )}
          </button>
        </div>

        {/* Quick samples */}
        <div>
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">
            Common Rumors
          </p>
          <div className="space-y-2">
            {SAMPLE_NEWS.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs font-inter text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm line-clamp-1"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
            <p className="text-sm font-inter text-red-700">{error}</p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && cfg && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xl"
            >
              {/* Verdict */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${cfg.bg} border ${cfg.border}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">Verdict</p>
                  <h3 className={`text-lg font-poppins font-semibold ${cfg.color}`}>{cfg.label}</h3>
                </div>
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 40 40" className="-rotate-90 w-full h-full">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                    <motion.circle
                      cx="20" cy="20" r="18" fill="none"
                      stroke="currentColor"
                      className={cfg.color}
                      strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={113}
                      initial={{ strokeDashoffset: 113 }}
                      animate={{ strokeDashoffset: 113 - (result.confidence / 100) * 113 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-poppins font-bold text-slate-900">
                    {result.confidence}%
                  </span>
                </div>
              </div>

              {/* Reasons */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">Analysis Rationale</p>
                <ul className="space-y-2.5">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs font-inter text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestion */}
              <div className="border-t border-slate-100 pt-5">
                <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-2">Recommendation</p>
                <p className="text-sm font-inter text-slate-700 leading-relaxed font-medium">{result.suggestion}</p>
              </div>

              {/* Official source link */}
              <a
                href="https://eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-900 text-xs font-inter font-bold border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Cross-verify on eci.gov.in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
