import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Accessibility, Car, HeartHandshake, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export function AccessibilityScreen() {
  const { goBack } = useStore()
  const [requested, setRequested] = useState(false)

  const handleRequest = () => {
    setRequested(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' }}>
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">♿ Accessibility Support</h1>
        <p className="text-sky-100 text-sm font-inter mt-1">Special assistance for voting day</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {requested ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-sky-50 rounded-2xl p-6 text-center border border-sky-200">
            <CheckCircle2 className="w-16 h-16 text-sky-500 mx-auto mb-4" />
            <h2 className="text-lg font-poppins font-bold text-sky-800">Support Requested!</h2>
            <p className="text-sm font-inter text-sky-600 mt-2">A volunteer and wheelchair will be assigned to you at the polling booth.</p>
            <button onClick={goBack} className="mt-6 px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-poppins font-semibold">Back to Dashboard</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <p className="text-sm font-inter text-gray-600 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              The Election Commission ensures voting is accessible to everyone. Request assistance in advance so our volunteers can be ready for you.
            </p>

            <div className="grid gap-3">
              {[
                { id: 'wheelchair', icon: Accessibility, label: 'Book a Wheelchair', desc: 'At the polling station' },
                { id: 'transport', icon: Car, label: 'Pick-up / Drop-off', desc: 'Free transport for PwD & Seniors' },
                { id: 'volunteer', icon: HeartHandshake, label: 'Volunteer Assistance', desc: 'Guidance and physical support' },
              ].map((opt) => (
                <button key={opt.id} className="bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-sky-300 active:bg-sky-50 transition-all text-left flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                    <opt.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-bold text-gray-800">{opt.label}</h3>
                    <p className="text-xs font-inter text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={handleRequest} className="w-full py-4 rounded-xl text-white font-poppins font-semibold bg-sky-600 shadow-md active:scale-95 transition-all">
              Confirm Request
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
