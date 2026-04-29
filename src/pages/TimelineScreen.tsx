import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, ChevronRight, MessageSquare } from 'lucide-react'
import { useStore } from '../store/useStore'
import { phases } from '../data/phases'

export function TimelineScreen() {
  const { goBack, navigate } = useStore()
  const [expandedPhase, setExpandedPhase] = useState<number | null>(4) // current phase

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-slate-900">Election Timeline</h1>
            <p className="text-slate-500 text-xs font-inter mt-1 font-medium">Phases and key dates for India 2024</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {phases.map((phase, idx) => {
          const isOpen = expandedPhase === idx
          const isActive = phase.status === 'active'
          const isDone = phase.status === 'done'

          return (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                isOpen ? 'border-slate-300 ring-1 ring-slate-200/50' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setExpandedPhase(isOpen ? null : idx)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border ${
                    isDone
                      ? 'bg-slate-50 border-slate-100'
                      : isActive
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 border-slate-100 grayscale opacity-50'
                  }`}
                >
                  {phase.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[15px] font-poppins font-semibold text-slate-900">
                      Phase {phase.num}
                    </span>
                    {isActive && (
                      <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-md font-inter font-bold uppercase tracking-widest animate-pulse">
                        Active
                      </span>
                    )}
                    {isDone && (
                      <span className="bg-slate-50 text-slate-400 border border-slate-100 text-[9px] px-2 py-0.5 rounded-md font-inter font-bold uppercase tracking-widest">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-inter text-slate-500 font-medium truncate">{phase.name}</p>
                  <p className="text-[10px] font-inter font-bold text-slate-400 mt-1 uppercase tracking-wider">{phase.date}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isOpen ? 'rotate-90 text-slate-900' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-50 mt-1 space-y-4">
                      <div className="space-y-3 pt-3">
                        {phase.steps.map((step, si) => (
                          <div key={si} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 flex-shrink-0" />
                            <p className="text-sm font-inter text-slate-600 leading-relaxed font-medium">{step}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Ask AI about this phase */}
                      <button
                        onClick={() => navigate('chat')}
                        className="w-full py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-inter font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-[0.98]"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        Ask AI about {phase.name}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
