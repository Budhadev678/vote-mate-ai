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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-white" />
          <div>
            <h1 className="text-xl font-poppins font-bold text-white">Trust Shield</h1>
            <p className="text-red-100 text-sm font-inter">Verify election information</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Disclaimer */}
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-inter text-amber-800">
            This tool detects credibility signals. Always verify important news from{' '}
            <strong>eci.gov.in</strong> or trusted news sources. We remain politically neutral.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-poppins font-semibold text-gray-700 mb-2">
            Paste message or news to verify:
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste any election-related message, WhatsApp forward, or news headline here..."
            className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm font-inter text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none h-28"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="mt-3 w-full py-3 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)' }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>

        {/* Quick samples */}
        <div>
          <p className="text-xs font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Try a sample:
          </p>
          <div className="space-y-1.5">
            {SAMPLE_NEWS.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="w-full text-left px-3 py-2 rounded-xl bg-white border border-gray-100 text-xs font-inter text-gray-600 hover:border-red-300 hover:text-red-700 transition-colors shadow-sm line-clamp-1"
              >
                📋 {s}
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
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`rounded-2xl border-2 ${cfg.bg} ${cfg.border} p-4 space-y-3`}
            >
              {/* Verdict */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cfg.icon}</span>
                <div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-poppins font-bold ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <p className={`text-xs font-inter mt-1 ${cfg.color}`}>
                    Confidence: {result.confidence}%
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="w-12 h-12 relative">
                    <svg viewBox="0 0 40 40" className="-rotate-90 w-full h-full">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                      <motion.circle
                        cx="20" cy="20" r="16" fill="none"
                        stroke={result.verdict === 'likely-true' ? '#22C55E' : result.verdict === 'suspicious' ? '#F59E0B' : result.verdict === 'likely-fake' ? '#EF4444' : '#9CA3AF'}
                        strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={100.5}
                        initial={{ strokeDashoffset: 100.5 }}
                        animate={{ strokeDashoffset: 100.5 - (result.confidence / 100) * 100.5 }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-poppins font-bold">
                      {result.confidence}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <p className="text-xs font-poppins font-semibold text-gray-600 mb-2">
                  🧐 Why this verdict:
                </p>
                <ul className="space-y-1.5">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-inter text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestion */}
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-xs font-poppins font-semibold text-gray-600 mb-1">💡 What to do:</p>
                <p className="text-xs font-inter text-gray-700">{result.suggestion}</p>
              </div>

              {/* Official source link */}
              <a
                href="https://eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-inter text-blue-600 underline"
              >
                <ExternalLink className="w-3 h-3" />
                Verify at official eci.gov.in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
