import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Zap, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'

export function LandingScreen() {
  const { navigate, user, updateUser } = useStore()

  const handleStart = () => {
    if (user.onboardingComplete) {
      navigate('dashboard')
    } else {
      navigate('onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50 translate-y-32 -translate-x-32" />

      <motion.div
        className="max-w-sm w-full text-center space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo / Brand */}
        <div className="space-y-3">
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 60%, #22C55E 100%)' }}
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🗳️
          </motion.div>
          <div>
            <h1 className="text-3xl font-poppins font-bold text-gradient">VoteMate AI</h1>
            <p className="text-sm font-inter text-gray-500 mt-1">Your Personal Election Companion</p>
          </div>
        </div>

        {/* AI Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg flex-shrink-0">
              🤖
            </div>
            <div className="space-y-2">
              <p className="text-sm font-inter text-gray-800 leading-relaxed">
                Hi 👋 I'm VoteMate AI — here to guide you through India's election process step by step.
              </p>
              <motion.div
                className="flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {['🧠 AI Guided', '📊 Progress Tracker', '📍 Booth Finder', '🛡️ Fact Checker'].map(
            (pill) => (
              <span
                key={pill}
                className="bg-white text-xs font-inter font-medium text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
              >
                {pill}
              </span>
            ),
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl text-white font-poppins font-semibold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}
          >
            <Rocket className="w-5 h-5" />
            Start My Journey
          </button>

          <button
            onClick={() => navigate('chat')}
            className="w-full py-3.5 rounded-2xl border-2 border-blue-700 text-blue-700 font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Quick Help
          </button>

          {user.onboardingComplete && (
            <button
              onClick={() => navigate('dashboard')}
              className="w-full py-3 rounded-2xl text-gray-600 font-inter text-sm flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Resume My Progress
            </button>
          )}
        </motion.div>

        {/* Language toggle */}
        <div className="flex items-center justify-center gap-2 text-xs font-inter text-gray-500">
          <span>Language:</span>
          {(['en', 'hi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => updateUser({ language: lang })}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                user.language === lang
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {lang === 'en' ? 'English' : 'हिंदी'}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
