import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ReadinessRing } from '../components/ReadinessRing'

interface Document {
  id: string
  label: string
  icon: string
  note?: string
}

const DOCS: Document[] = [
  { id: 'voter-id', label: 'Voter ID Card (EPIC)', icon: '🪪', note: 'Most preferred' },
  { id: 'aadhaar', label: 'Aadhaar Card', icon: '🆔', note: 'Widely accepted' },
  { id: 'passport', label: 'Passport', icon: '📗' },
  { id: 'driving', label: 'Driving Licence', icon: '🚗' },
  { id: 'pan', label: 'PAN Card', icon: '💳' },
  { id: 'pension', label: 'Pension Document with Photo', icon: '📋' },
  { id: 'mgnrega', label: 'MGNREGA Job Card', icon: '📜' },
]

export function DocumentCheckerScreen() {
  const { goBack, updateUser } = useStore()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleDoc = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      const hasValid = next.size > 0
      updateUser({ hasValidDocument: hasValid })
      return next
    })
  }

  const isReady = selected.size > 0
  const readinessScore = selected.size > 0 ? Math.min(100, selected.size * 40) : 0

  return (
    <div className="min-h-full bg-slate-50 pb-40">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-semibold text-slate-900">Document Checker</h1>
        <p className="text-slate-500 text-xs font-inter mt-1.5 font-medium">
          Verify your identity documents for the booth
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Status card */}
        <motion.div
          className={`rounded-2xl p-5 border shadow-sm flex items-center gap-5 ${
            isReady
              ? 'bg-white border-slate-200'
              : 'bg-white border-slate-200 opacity-80'
          }`}
          animate={isReady ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 0.4 }}
          key={String(isReady)}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isReady ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {isReady ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <p className="font-poppins font-semibold text-base text-slate-900">
              {isReady ? 'Ready to Vote' : 'Missing ID'}
            </p>
            <p className="text-xs font-inter mt-1 text-slate-500 font-medium">
              {isReady
                ? `${selected.size} verified document${selected.size > 1 ? 's' : ''}`
                : 'Select at least one valid photo ID'}
            </p>
          </div>
          {isReady && (
            <div className="flex flex-col items-center">
              <ReadinessRing score={Math.min(100, selected.size * 50)} size={48} />
              <p className="text-[9px] font-inter font-bold text-slate-400 uppercase tracking-widest mt-1">Status</p>
            </div>
          )}
        </motion.div>

        {/* Document checklist */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-5">
            Government Photo IDs
          </p>
          <div className="space-y-3">
            {DOCS.map((doc) => {
              const checked = selected.has(doc.id)
              return (
                <button
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    checked
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200'
                  }`}
                >
                  <span className="text-xl">{doc.icon}</span>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-inter font-semibold ${checked ? 'text-white' : 'text-slate-800'}`}>{doc.label}</p>
                    {doc.note && (
                      <p className={`text-xs font-inter mt-0.5 ${checked ? 'text-slate-400' : 'text-slate-500'}`}>{doc.note}</p>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                      checked ? 'bg-white border-white' : 'border-slate-300'
                    }`}
                  >
                    {checked && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="flex gap-4 relative z-10">
            <HelpCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-poppins font-medium">Important Note</p>
              <p className="text-xs font-inter text-slate-400 mt-2 leading-relaxed">
                You need at least <span className="text-white font-semibold">one</span> valid government photo ID to vote. 
                Lost your Voter ID? You can still vote using Aadhaar or a Driving Licence if your name is on the electoral roll.
              </p>
            </div>
          </div>
        </div>

        {/* Official resources */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-4">
            Digital Resources
          </p>
          <div className="space-y-4">
            {[
              'Download mVoter 2.0 app',
              'Use official DigiLocker wallet',
              'Download e-EPIC from portal',
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3 py-1 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                <p className="text-xs font-inter text-slate-700 font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
