import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, MapPin, Send, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export function ReportViolationScreen() {
  const { goBack } = useStore()
  const [status, setStatus] = useState<'idle' | 'reporting' | 'success'>('idle')

  const handleSubmit = () => {
    setStatus('reporting')
    setTimeout(() => {
      setStatus('success')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)' }}>
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">📸 Report Violation</h1>
        <p className="text-red-100 text-sm font-inter mt-1">cVIGIL Mock Integration</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {status === 'success' ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 rounded-2xl p-6 text-center border border-green-200">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-poppins font-bold text-green-800">Violation Reported!</h2>
            <p className="text-sm font-inter text-green-600 mt-2">Your report has been securely sent to the Election Commission. Thank you for your vigilance.</p>
            <button onClick={goBack} className="mt-6 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-poppins font-semibold">Done</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-poppins font-semibold text-amber-800">Model Code of Conduct</p>
                <p className="text-xs font-inter text-amber-700 mt-1">Report bribes, liquor distribution, or campaigning during silence period. Your identity is hidden.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-poppins font-semibold text-gray-600 uppercase mb-2">Upload Evidence</label>
                <button className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                  <Camera className="w-6 h-6 mb-2" />
                  <span className="text-sm font-inter">Take Photo or Video</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-gray-600 uppercase mb-2">Violation Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-inter bg-gray-50">
                  <option>Money/Bribery Distribution</option>
                  <option>Liquor Distribution</option>
                  <option>Freebies/Gifts</option>
                  <option>Hate Speech</option>
                  <option>Campaigning after deadline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-gray-600 uppercase mb-2">Location</label>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-inter text-gray-700">Auto-detecting location... (Accuracy: 15m)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-poppins font-semibold text-gray-600 uppercase mb-2">Description</label>
                <textarea placeholder="Describe what you witnessed..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-inter bg-gray-50 h-24 resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={status === 'reporting'} className="w-full py-3.5 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50">
                {status === 'reporting' ? 'Submitting secure report...' : <><Send className="w-4 h-4" /> Submit Report Anonymously</>}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
