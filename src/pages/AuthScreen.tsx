import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Lock, Phone } from 'lucide-react'
import { useStore } from '../store/useStore'

export function AuthScreen() {
  const { login, navigate, user } = useStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = () => {
    if (phone.length < 10) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
    }, 1000)
  }

  const handleVerifyOtp = () => {
    if (otp.length < 4) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login(phone)
      navigate(user.onboardingComplete ? 'dashboard' : 'onboarding')
    }, 1200)
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col px-6 py-12 items-center justify-center relative overflow-hidden">
      <motion.div
        className="max-w-sm w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 bg-white mb-5"
          >
            🔐
          </div>
          <h1 className="text-2xl font-poppins font-semibold text-slate-900">Secure Access</h1>
          <p className="text-sm font-inter text-slate-500 mt-1.5">Sign in to VoteMate AI securely</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Mobile Number
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus-within:border-slate-400 transition-all">
                    <span className="text-slate-400 font-inter text-sm mr-3 border-r border-slate-200 pr-3 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 bg-transparent text-sm font-inter text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={phone.length < 10 || loading}
                  className="w-full py-4 rounded-xl text-white font-poppins font-medium text-sm flex items-center justify-center gap-2 transition-all bg-slate-900 disabled:opacity-30 active:scale-[0.98]"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Send Code <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Verification Code
                  </label>
                  <p className="text-xs font-inter text-slate-500 mb-4">
                    Sent to +91 {phone}
                  </p>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus-within:border-slate-400 transition-all">
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="w-full text-center bg-transparent text-2xl font-poppins font-bold text-slate-900 tracking-[0.3em] placeholder-slate-300 focus:outline-none"
                      style={{ paddingLeft: '0.3em' }} // Counteracts the tracking for perfect centering
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 4 || loading}
                  className="w-full py-4 rounded-xl text-white font-poppins font-medium text-sm flex items-center justify-center gap-2 transition-all bg-slate-900 disabled:opacity-30 active:scale-[0.98]"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Verify and Login
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-center text-xs font-inter font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Change phone number
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs font-inter text-gray-400 mt-6">
          🔒 Secured with end-to-end encryption.<br />We will never spam you.
        </p>
      </motion.div>
    </div>
  )
}
