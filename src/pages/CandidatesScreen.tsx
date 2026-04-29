import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const MOCK_CANDIDATES = [
  { id: '1', name: 'Rajesh Kumar', party: 'Development Party', symbol: '🚲', edu: 'B.A. Political Science', assets: '₹2.4 Cr', cases: 0, age: 45 },
  { id: '2', name: 'Sunita Sharma', party: 'Progressive Alliance', symbol: '🌻', edu: 'M.B.A.', assets: '₹5.1 Cr', cases: 1, age: 38 },
  { id: '3', name: 'Amit Patel', party: 'National Front', symbol: '🐘', edu: '12th Pass', assets: '₹12.5 Cr', cases: 3, age: 52 },
]

export function CandidatesScreen() {
  const { goBack } = useStore()
  
  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)' }}>
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">⚖️ Know Your Candidates</h1>
        <p className="text-blue-100 text-sm font-inter mt-1">Based on official EC affidavits</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {MOCK_CANDIDATES.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl border border-gray-100">
                  {c.symbol}
                </div>
                <div>
                  <h2 className="text-base font-poppins font-bold text-gray-900">{c.name}</h2>
                  <p className="text-xs font-inter text-gray-600">{c.party} · Age {c.age}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-poppins font-semibold text-gray-500 uppercase flex items-center gap-1"><GraduationCap className="w-3 h-3"/> Education</p>
                <p className="text-sm font-inter text-gray-800 font-medium">{c.edu}</p>
              </div>
              <div>
                <p className="text-[10px] font-poppins font-semibold text-gray-500 uppercase flex items-center gap-1"><Briefcase className="w-3 h-3"/> Declared Assets</p>
                <p className="text-sm font-inter text-gray-800 font-medium">{c.assets}</p>
              </div>
              <div className="col-span-2 bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                <p className="text-[10px] font-poppins font-semibold text-gray-500 uppercase flex items-center gap-1"><AlertOctagon className="w-3 h-3"/> Criminal Cases</p>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${c.cases === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {c.cases === 0 ? 'Clean Record' : `${c.cases} Pending Cases`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
