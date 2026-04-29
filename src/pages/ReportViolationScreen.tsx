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
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-semibold text-slate-900">Report Violation</h1>
        <p className="text-slate-500 text-xs font-inter mt-1.5 font-medium">
          Official Model Code of Conduct reporting (cVIGIL)
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {status === 'success' ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
              <CheckCircle2 className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-xl font-poppins font-semibold text-slate-900">Report Submitted</h2>
            <p className="text-sm font-inter text-slate-500 mt-3 leading-relaxed">Your report has been securely transmitted to the Election Commission. Thank you for maintaining democratic integrity.</p>
            <button onClick={goBack} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-poppins font-semibold active:scale-[0.98] transition-all">Back to Dashboard</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="flex gap-4 relative z-10">
                <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-poppins font-medium">Anonymous Vigilance</p>
                  <p className="text-xs font-inter text-slate-400 mt-1 leading-relaxed">Report bribes, liquor, or illegal campaigning. Your identity is fully protected by the ECI encryption standards.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-6">
              <div>
                <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">Evidence Upload</label>
                <button className="w-full h-36 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-all group">
                  <Camera className="w-6 h-6 mb-3 group-hover:text-slate-600 transition-colors" />
                  <span className="text-sm font-inter font-medium group-hover:text-slate-600">Add Photo or Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">Violation Category</label>
                  <select className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-inter bg-white focus:outline-none focus:border-slate-400 shadow-sm transition-all">
                    <option>Money/Bribery Distribution</option>
                    <option>Liquor Distribution</option>
                    <option>Freebies/Gifts</option>
                    <option>Hate Speech</option>
                    <option>Campaigning after deadline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">Location Status</label>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-inter text-slate-600 font-medium">Automatic (Accuracy: 15m)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">Incident Details</label>
                <textarea 
                  placeholder="Provide specific details of the incident..." 
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-inter bg-white h-28 resize-none focus:outline-none focus:border-slate-400 shadow-sm transition-all" 
                />
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={status === 'reporting'} 
                className="w-full py-4 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 active:scale-[0.98] transition-all shadow-md shadow-slate-200"
              >
                {status === 'reporting' ? 'Submitting encrypted report...' : 'Submit Anonymous Report'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
