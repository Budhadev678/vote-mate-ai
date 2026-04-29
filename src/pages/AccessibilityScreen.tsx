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
    <div className="min-h-screen bg-slate-50 pb-40">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-semibold text-slate-900">Accessibility Support</h1>
        <p className="text-slate-500 text-xs font-inter mt-1.5 font-medium">
          Official assistance services for voting day
        </p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {requested ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <CheckCircle2 className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-slate-900">Support Requested</h2>
            <p className="text-sm font-inter text-slate-500 mt-3 leading-relaxed">
              A volunteer and wheelchair will be prioritized for you at your assigned polling station.
            </p>
            <button onClick={goBack} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-poppins font-semibold active:scale-[0.98] transition-all">Back to Dashboard</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <p className="text-xs font-inter text-slate-300 leading-relaxed">
                The Election Commission ensures voting is accessible to everyone. Request specialized 
                assistance early to ensure resources are ready.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                { id: 'wheelchair', icon: Accessibility, label: 'Wheelchair Support', desc: 'At the polling station' },
                { id: 'transport', icon: Car, label: 'Official Transport', desc: 'Free for PwD & Seniors' },
                { id: 'volunteer', icon: HeartHandshake, label: 'Booth Assistant', desc: 'Guidance and physical support' },
              ].map((opt) => (
                <button key={opt.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 active:bg-slate-50 transition-all text-left flex items-center gap-5 group shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                    <opt.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-slate-900">{opt.label}</h3>
                    <p className="text-xs font-inter text-slate-500 font-medium">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={handleRequest} className="w-full py-4 rounded-xl text-white text-sm font-poppins font-semibold bg-slate-900 shadow-md active:scale-[0.98] transition-all">
              Confirm Request
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
