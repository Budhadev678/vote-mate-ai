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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">🧾 Document Checker</h1>
        <p className="text-teal-100 text-sm font-inter mt-1">
          Check what valid ID you have for voting
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Status card */}
        <motion.div
          className={`rounded-2xl p-4 border-2 flex items-center gap-4 ${
            isReady
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.4 }}
          key={String(isReady)}
        >
          <div>
            {isReady ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <XCircle className="w-10 h-10 text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-poppins font-bold text-base ${isReady ? 'text-green-700' : 'text-red-700'}`}>
              {isReady ? '✅ Document Ready!' : '❗ No Document Selected'}
            </p>
            <p className={`text-xs font-inter mt-0.5 ${isReady ? 'text-green-600' : 'text-red-600'}`}>
              {isReady
                ? `${selected.size} valid ID${selected.size > 1 ? 's' : ''} selected — you're good to vote!`
                : 'Select at least ONE valid photo ID below'}
            </p>
          </div>
          {isReady && <ReadinessRing score={Math.min(100, selected.size * 50)} size={64} />}
        </motion.div>

        {/* Document checklist */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Select documents you have:
          </p>
          <div className="space-y-2">
            {DOCS.map((doc) => {
              const checked = selected.has(doc.id)
              return (
                <motion.button
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                    checked
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-teal-300'
                  }`}
                >
                  <span className="text-xl">{doc.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-inter font-medium text-gray-800">{doc.label}</p>
                    {doc.note && (
                      <p className="text-xs font-inter text-gray-500">{doc.note}</p>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
          <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-poppins font-semibold text-amber-800">Important Note</p>
            <p className="text-xs font-inter text-amber-700 mt-1">
              You need at least <strong>ONE</strong> valid government photo ID to vote.
              Aadhaar card is accepted at most booths even without Voter ID.
            </p>
            <p className="text-xs font-inter text-amber-600 mt-1.5">
              Lost your Voter ID? You can still vote with Aadhaar + check your name on electoral roll.
            </p>
          </div>
        </div>

        {/* Download hint */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm font-poppins font-semibold text-blue-700 mb-2">
            📱 Digital ID Options
          </p>
          <ul className="space-y-1.5">
            {[
              'Download mVoter 2.0 app — get digital Voter ID',
              'Use DigiLocker — official digital document wallet',
              'Download e-EPIC from voters.eci.gov.in',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-inter text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
