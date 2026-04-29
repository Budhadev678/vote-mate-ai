import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Lock, Phone } from 'lucide-react'
import { useStore } from '../store/useStore'

export function AuthScreen() {
  const { login } = useStore()
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
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col px-6 py-12 items-center justify-center relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-32 -translate-x-32" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-50 translate-y-32 translate-x-32" />

      <motion.div
        className="max-w-sm w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 60%, #22C55E 100%)' }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🔐
          </motion.div>
          <h1 className="text-2xl font-poppins font-bold text-gray-900">Welcome to VoteMate</h1>
          <p className="text-sm font-inter text-gray-500 mt-2">Sign in to securely track your readiness</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
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
                  <label className="block text-xs font-poppins font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-gray-500 font-inter text-sm mr-2 border-r border-gray-300 pr-2">
                      +91
                    </span>
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 bg-transparent text-sm font-inter text-gray-800 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={phone.length < 10 || loading}
                  className="w-full py-3.5 rounded-2xl text-white font-poppins font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-4 h-4" />
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
                  <label className="block text-xs font-poppins font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Enter Verification Code
                  </label>
                  <p className="text-xs font-inter text-gray-500 mb-3">
                    We sent a 4-digit code to +91 {phone}
                  </p>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                    <Lock className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="flex-1 tracking-[1em] text-center bg-transparent text-lg font-poppins font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 4 || loading}
                  className="w-full py-3.5 rounded-2xl text-white font-poppins font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #22C55E 100%)' }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Verify & Secure Login
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-center text-xs font-inter text-gray-500 underline"
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
