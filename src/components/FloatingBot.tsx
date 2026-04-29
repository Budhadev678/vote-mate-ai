import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Info } from 'lucide-react'
import { useStore } from '../store/useStore'

export function FloatingBot() {
  const { navigate, showFloatingBot, currentScreen } = useStore()
  const [showInfo, setShowInfo] = useState(false)

  const hiddenScreens = ['landing', 'onboarding', 'chat', 'auth']
  if (!showFloatingBot || hiddenScreens.includes(currentScreen)) return null

  return (
    /* Positioned inside the app container's right side, above the bottom nav (62px) */
    <div className="absolute bottom-[74px] right-3 z-40 flex flex-col items-end gap-2">
      {/* Info tooltip popup */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            className="w-[220px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 mb-1"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-indigo-400" />
                </div>
                <p className="font-poppins font-semibold text-[12px] text-white">AI Assistant</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-inter text-[11px] text-slate-400 leading-relaxed">
              Tap the bot icon to ask VoteMate AI anything about elections, booths, registration, or voting procedures.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button row: info (i) + bot */}
      <div className="flex items-center gap-2">
        {/* Info 'i' button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setShowInfo(!showInfo)}
          className={`w-8 h-8 rounded-full shadow-md border flex items-center justify-center text-[12px] font-bold font-inter transition-all ${
            showInfo
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          i
        </motion.button>

        {/* Bot button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('chat')}
          className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center relative active:scale-[0.97] transition-all"
          style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}
          title="Ask VoteMate AI"
        >
          <span className="absolute inset-0 rounded-2xl animate-ping opacity-10 bg-indigo-400" />
          <Bot className="w-6 h-6 text-white relative z-10" />
        </motion.button>
      </div>
    </div>
  )
}
