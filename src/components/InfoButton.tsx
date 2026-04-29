import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'

export function InfoButton({ text }: { text: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block z-50">
      <button
        onClick={() => setShow(true)}
        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all active:scale-95"
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
              className="fixed inset-0 z-40 bg-black/5"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-10 w-64 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 origin-top-right"
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
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
