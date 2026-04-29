import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'

export function InfoButton({ text }: { text: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block z-50">
      <button
        onClick={() => setShow(true)}
        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 transition-all active:scale-95 shadow-sm"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[300px] bg-white text-gray-800 rounded-3xl shadow-2xl border border-gray-200 p-5 relative"
              >
                <button
                  onClick={() => setShow(false)}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="font-poppins font-semibold text-sm text-slate-900">Information</p>
                </div>
                <p className="text-xs font-inter leading-relaxed text-slate-600 font-medium">
                  {text}
                </p>
            </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
