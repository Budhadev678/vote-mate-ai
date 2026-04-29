import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Zap, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { InfoButton } from '../components/InfoButton'

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
      <div className="absolute top-4 right-4 z-50">
        <InfoButton text="VoteMate AI is your secure and private election companion. We guide you through registration, verified news, and finding your booth." />
      </div>

      <motion.div
        className="max-w-sm w-full text-center space-y-10 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Logo / Brand */}
        <div className="space-y-4">
          <div
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-sm border border-slate-100 bg-white"
          >
            🇮🇳
          </div>
          <div>
            <h1 className="text-3xl font-poppins font-bold text-slate-900 tracking-tight">VoteMate AI</h1>
            <p className="text-sm font-inter text-slate-500 mt-2">Secure & Verified Election Guide</p>
          </div>
        </div>

        {/* AI Greeting */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
              🤖
            </div>
            <div className="space-y-1">
              <p className="text-sm font-inter text-slate-700 leading-relaxed font-medium">
                Hello. I am VoteMate AI.
              </p>
              <p className="text-sm font-inter text-slate-600 leading-relaxed">
                I'm here to provide accurate, safe, and unbiased guidance for the Indian elections.
              </p>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {['🔒 Secure', '✓ Verified Info', '📍 Booth Locator', '🧠 AI Assistant'].map(
            (pill) => (
              <span
                key={pill}
                className="bg-white text-xs font-inter font-medium text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
              >
                {pill}
              </span>
            ),
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleStart}
            className="btn-gradient w-full py-4 rounded-xl font-poppins font-semibold text-base flex items-center justify-center gap-2 shadow-xl"
          >
            Start My Journey
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('chat')}
            className="w-full py-4 rounded-xl border border-slate-300 text-slate-700 font-poppins font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-[0.98] bg-white"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Quick AI Help
          </button>

          {user.onboardingComplete && (
            <button
              onClick={() => navigate('dashboard')}
              className="w-full py-3 rounded-xl text-slate-500 font-inter text-sm flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
            >
              Resume Progress
            </button>
          )}
        </div>

        {/* Language toggle */}
        <div className="flex items-center justify-center gap-2 text-xs font-inter text-slate-500 pt-4">
          <span>Language / भाषा:</span>
          {(['en', 'hi', 'or'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => updateUser({ language: lang })}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                user.language === lang
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ଓଡ଼ିଆ'}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
