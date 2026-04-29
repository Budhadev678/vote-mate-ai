import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot } from 'lucide-react'
import { useStore } from '../store/useStore'

export function FloatingBot() {
  const { navigate, showFloatingBot, currentScreen } = useStore()
  const [showInfo, setShowInfo] = useState(false)

  const hiddenScreens = ['landing', 'onboarding', 'chat']
  if (!showFloatingBot || hiddenScreens.includes(currentScreen)) return null

  return (
    <div className="fixed bottom-24 right-4 sm:right-auto sm:ml-[400px] z-50 flex flex-col items-end gap-2">
      {/* Information 'i' button */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="bg-slate-900 text-white text-xs p-4 rounded-2xl shadow-2xl border border-slate-800 mb-2 max-w-[220px] relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center">
                <Bot className="w-3 h-3 text-slate-400" />
              </div>
              <p className="font-poppins font-semibold text-slate-200">AI Assistance</p>
            </div>
            <p className="font-inter text-slate-400 leading-relaxed">This context-aware agent provides personalized guidance based on your current readiness score.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(!showInfo)}
          className="w-12 h-12 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 font-bold font-poppins transition-colors hover:border-slate-400"
        >
          i
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('chat')}
          className="w-14 h-14 rounded-xl shadow-xl flex items-center justify-center relative bg-slate-900 active:scale-[0.98] transition-all"
          title="Ask AI"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-xl animate-ping opacity-10 bg-slate-400" />
          <Bot className="w-6 h-6 text-white relative z-10" />
        </motion.button>
      </div>
    </div>
  )
}
