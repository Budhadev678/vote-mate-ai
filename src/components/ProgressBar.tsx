import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Lock } from 'lucide-react'

interface Props {
  steps: { id: string; label: string }[]
  current: string
  completed: string[]
}

const STEP_COLORS = ['#0f172a', '#0f172a', '#0f172a', '#0f172a']

export function ProgressBar({ steps, current, completed }: Props) {
  return (
    <div className="w-full">
      {/* Step labels */}
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute top-5 left-6 right-6 h-[1px] bg-slate-200 z-0" />
        <motion.div
          className="absolute top-5 left-6 h-[1px] bg-slate-900 z-10"
          initial={{ width: '0%' }}
          animate={{
            width: `${(completed.length / Math.max(steps.length - 1, 1)) * 100}%`,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {steps.map((step, i) => {
          const isDone = completed.includes(step.id)
          const isCurrent = step.id === current && !isDone
          const isLocked = !isDone && !isCurrent

          return (
            <div key={step.id} className="flex flex-col items-center gap-1 z-20">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200'
                    : isCurrent
                      ? 'bg-white border-slate-900 text-slate-900 ring-4 ring-slate-50 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-slate-900 rounded-full" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </motion.div>
              <span
                className={`text-[9px] font-inter font-bold uppercase tracking-widest text-center max-w-16 leading-tight mt-1 transition-colors ${
                  isDone ? 'text-slate-900' : isCurrent ? 'text-slate-900' : 'text-slate-400'
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
