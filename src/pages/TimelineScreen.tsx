import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Filter } from 'lucide-react'
import { useStore } from '../store/useStore'
import { phases } from '../data/phases'

export function TimelineScreen() {
  const { goBack, navigate } = useStore()
  const [expandedPhase, setExpandedPhase] = useState<number | null>(4) // current phase

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">📅 Election Timeline</h1>
        <p className="text-purple-200 text-sm font-inter mt-1">
          All 6 phases of India's election process
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {phases.map((phase, idx) => {
          const isOpen = expandedPhase === idx
          const statusStyle =
            phase.status === 'done'
              ? 'border-green-200 bg-green-50'
              : phase.status === 'active'
                ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200'
                : 'border-gray-200 bg-white'

          return (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`rounded-2xl border-2 shadow-sm overflow-hidden transition-colors ${statusStyle}`}
            >
              <button
                onClick={() => setExpandedPhase(isOpen ? null : idx)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {/* Phase number + status */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    phase.status === 'done'
                      ? 'bg-green-200'
                      : phase.status === 'active'
                        ? 'bg-blue-200'
                        : 'bg-gray-200'
                  }`}
                >
                  {phase.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-poppins font-semibold text-gray-800">
                      Phase {phase.num}: {phase.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${
                        phase.status === 'done'
                          ? 'bg-green-200 text-green-700'
                          : phase.status === 'active'
                            ? 'bg-blue-200 text-blue-700'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {phase.status === 'done' ? '✓ Done' : phase.status === 'active' ? '⚡ Active' : '⏳ Upcoming'}
                    </span>
                  </div>
                  <p className="text-xs font-inter text-gray-500 mt-0.5">{phase.date}</p>
                </div>
                <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                  ›
                </span>
              </button>

              {/* Expanded steps */}
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="overflow-hidden border-t border-gray-200"
                >
                  <div className="px-4 pb-4 pt-3 space-y-3">
                    <div className="space-y-2">
                      {phase.steps.map((step, si) => (
                        <div key={si} className="flex items-start gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-poppins font-bold mt-0.5 ${
                              phase.status === 'done'
                                ? 'bg-green-500 text-white'
                                : phase.status === 'active'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {si + 1}
                          </div>
                          <p className="text-xs font-inter text-gray-700 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                    {/* Ask AI about this phase */}
                    <button
                      onClick={() => navigate('chat')}
                      className="w-full py-2 rounded-xl bg-white border border-blue-200 text-blue-700 text-xs font-inter font-medium flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors"
                    >
                      🤖 Ask AI: "{phase.question}"
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
