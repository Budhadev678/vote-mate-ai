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
    <div className="fixed bottom-24 right-4 sm:right-[calc(50%-13rem)] z-50 flex flex-col items-end gap-2">
      {/* Information 'i' button */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="bg-white text-gray-800 text-xs p-3 rounded-2xl shadow-xl border border-gray-200 mb-2 max-w-[200px]"
          >
            <p className="font-poppins font-semibold mb-1">💡 Pro Tip</p>
            <p className="font-inter">This AI assistant is context-aware. It knows your state, readiness score, and voter type!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowInfo(!showInfo)}
          className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-blue-600 font-bold font-poppins"
        >
          i
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('chat')}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          }}
          title="Ask AI"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-400" />
          <Bot className="w-6 h-6 text-white relative z-10" />
        </motion.button>
      </div>
    </div>
  )
}
