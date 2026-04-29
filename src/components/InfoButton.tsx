import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'

export function InfoButton({ text }: { text: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block z-50">
      <button
        onClick={() => setShow(true)}
        className="w-7 h-7 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-200 flex items-center justify-center text-blue-600 transition-all active:scale-95 shadow-sm"
      >
        <Info className="w-4 h-4" />
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
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full bg-gray-50"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <p className="font-poppins font-semibold text-sm text-blue-700">Guidance</p>
              </div>
              <p className="text-xs font-inter leading-relaxed text-gray-600">
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
