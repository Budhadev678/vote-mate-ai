import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'

interface InfoButtonProps {
  text: string
  title?: string
  position?: 'default' | 'left'
}

export function InfoButton({ text, title = 'Information', position = 'default' }: InfoButtonProps) {
  const [show, setShow] = useState(false)

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setShow(true)}
        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 shadow-sm flex-shrink-0"
        aria-label="More information"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}>
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-poppins font-semibold text-sm text-slate-900">{title}</p>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4">
                <p className="text-[13px] font-inter leading-relaxed text-slate-600">{text}</p>
              </div>

              {/* Dismiss */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setShow(false)}
                  className="w-full py-3 rounded-xl text-sm font-poppins font-semibold text-white transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* Variant for dark (white bg) contexts */
export function InfoButtonLight({ text, title = 'Information' }: { text: string; title?: string }) {
  const [show, setShow] = useState(false)

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all active:scale-95 shadow-sm flex-shrink-0"
        aria-label="More information"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}>
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-poppins font-semibold text-sm text-slate-900">{title}</p>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="px-5 py-4">
                <p className="text-[13px] font-inter leading-relaxed text-slate-600">{text}</p>
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => setShow(false)}
                  className="w-full py-3 rounded-xl text-sm font-poppins font-semibold text-white transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
