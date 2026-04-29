import { motion } from 'framer-motion'
import { Check2, } from 'lucide-react'

interface Props {
  steps: { id: string; label: string }[]
  current: string
  completed: string[]
}


export function ProgressBar({ steps, current, completed }: Props) {
  return (
    <div className="w-full">
      {/* Step labels */}
      <div className="flex items-center justify-between relative">
        {/* Connector line container */}
        <div className="absolute top-5 left-[20px] right-[20px] h-[2px] bg-white/20 z-0 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: `${(completed.length / Math.max(steps.length - 1, 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {steps.map((step, i) => {
          const isDone = completed.includes(step.id)
          const isCurrent = step.id === current && !isDone


          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 z-20">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-white text-blue-600 shadow-lg shadow-black/10 border-2 border-white'
                    : isCurrent
                      ? 'bg-blue-50 border-2 border-white text-blue-600 shadow-md ring-4 ring-white/20'
                      : 'bg-white/10 border-2 border-white/20 text-white/50 backdrop-blur-md'
                }`}
              >
                {isDone ? (
                  <Check2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                ) : (
                  <span className="text-xs font-poppins font-bold opacity-70">{i + 1}</span>
                )}
              </motion.div>
              <span
                className={`text-[9px] font-inter font-bold uppercase tracking-widest text-center max-w-16 leading-tight transition-colors ${
                  isDone ? 'text-white' : isCurrent ? 'text-white drop-shadow-md' : 'text-white/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
