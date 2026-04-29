import { motion } from 'framer-motion'
import { ArrowLeft, GraduationCap, Briefcase, AlertOctagon } from 'lucide-react'
import { useStore } from '../store/useStore'

const MOCK_CANDIDATES = [
  { id: '1', name: 'Rajesh Kumar', party: 'Development Party', symbol: '🚲', edu: 'B.A. Political Science', assets: '₹2.4 Cr', cases: 0, age: 45 },
  { id: '2', name: 'Sunita Sharma', party: 'Progressive Alliance', symbol: '🌻', edu: 'M.B.A.', assets: '₹5.1 Cr', cases: 1, age: 38 },
  { id: '3', name: 'Amit Patel', party: 'National Front', symbol: '🐘', edu: '12th Pass', assets: '₹12.5 Cr', cases: 3, age: 52 },
]

export function CandidatesScreen() {
  const { goBack } = useStore()
  
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-semibold text-slate-900">Know Your Candidates</h1>
        <p className="text-slate-500 text-xs font-inter mt-1.5 font-medium">
          Verified profiles based on official ECI affidavits
        </p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {MOCK_CANDIDATES.map((c, i) => (
          <motion.div 
            key={c.id} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-2xl border border-slate-100">
                  {c.symbol}
                </div>
                <div>
                  <h2 className="text-base font-poppins font-semibold text-slate-900">{c.name}</h2>
                  <p className="text-xs font-inter text-slate-500 font-medium">{c.party} · Age {c.age}</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <GraduationCap className="w-3.5 h-3.5"/> Education
                </p>
                <p className="text-sm font-inter text-slate-800 font-semibold">{c.edu}</p>
              </div>
              <div>
                <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Briefcase className="w-3.5 h-3.5"/> Assets
                </p>
                <p className="text-sm font-inter text-slate-800 font-semibold">{c.assets}</p>
              </div>
              <div className="col-span-2 bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <AlertOctagon className="w-3.5 h-3.5"/> Criminal Cases
                </p>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${c.cases === 0 ? 'bg-white text-emerald-600 border border-emerald-100 shadow-sm' : 'bg-white text-rose-600 border border-rose-100 shadow-sm'}`}>
                  {c.cases === 0 ? 'Clean Record' : `${c.cases} Pending`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
