import { motion } from 'framer-motion'
import { Zap, ArrowRight, Shield, CheckCircle, MapPin, Brain } from 'lucide-react'
import { useStore } from '../store/useStore'

const FEATURES = [
  { icon: Shield, label: 'Secure & Private', color: 'bg-blue-50 text-blue-600' },
  { icon: CheckCircle, label: 'Verified Info', color: 'bg-emerald-50 text-emerald-600' },
  { icon: MapPin, label: 'Booth Locator', color: 'bg-orange-50 text-orange-600' },
  { icon: Brain, label: 'AI Assistant', color: 'bg-purple-50 text-purple-600' },
]

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
    <div className="min-h-full flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

      {/* Header Bar */}
      <div className="w-full px-5 pt-12 pb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-base">
            🇮🇳
          </div>
          <span className="text-white font-poppins font-semibold text-sm tracking-wide">VoteMate AI</span>
        </div>
        {/* Language Switcher */}
        <div className="flex items-center gap-1">
          {(['en', 'hi', 'or'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => updateUser({ language: lang })}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-inter font-medium transition-all ${
                user.language === lang
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'ଓ'}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col justify-center px-5 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-7"
        >
          {/* Brand badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-xs font-inter font-medium">Powered by Gemini AI</span>
            </div>
          </div>

          {/* Main heading */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              🗳️
            </div>
            <h1 className="text-4xl font-poppins font-bold text-white leading-tight tracking-tight">
              Your Smartest<br />
              <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Voting Companion
              </span>
            </h1>
            <p className="text-white/70 text-sm font-inter leading-relaxed max-w-xs mx-auto">
              Navigate Indian elections with confidence. Get verified guidance, find your booth, and vote with clarity.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${f.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-white/85 text-xs font-inter font-medium">{f.label}</span>
                </motion.div>
              )
            })}
          </div>

          {/* AI Greeting Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg flex-shrink-0">
                🤖
              </div>
              <div>
                <p className="text-white/90 text-xs font-inter font-semibold mb-0.5">VoteMate AI says:</p>
                <p className="text-white/70 text-xs font-inter leading-relaxed">
                  "I'm here to provide accurate, unbiased guidance for Indian elections. Ask me anything — I'll keep it simple."
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-1">
            <motion.button
              onClick={handleStart}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-poppins font-semibold text-base text-white flex items-center justify-center gap-2 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              Start My Journey
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => navigate('chat')}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl font-inter font-medium text-sm text-white/80 flex items-center justify-center gap-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Quick AI Help
            </motion.button>

            {user.onboardingComplete && (
              <motion.button
                onClick={() => navigate('dashboard')}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-2xl font-inter text-sm text-white/50 flex items-center justify-center gap-1.5 transition-all hover:text-white/70"
              >
                Resume Progress →
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-10 text-center relative z-10">
        <p className="text-white/30 text-[10px] font-inter">
          🔒 Data verified by Election Commission of India
        </p>
      </div>
    </div>
  )
}
