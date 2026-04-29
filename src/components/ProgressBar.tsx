import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Lock } from 'lucide-react'

interface Props {
  steps: { id: string; label: string }[]
  current: string
  completed: string[]
}

const STEP_COLORS = ['#1E3A8A', '#3B82F6', '#22C55E', '#10B981']

export function ProgressBar({ steps, current, completed }: Props) {
  return (
    <div className="w-full">
      {/* Step labels */}
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200 z-0" />
        <motion.div
          className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-blue-700 via-blue-500 to-green-500 z-10"
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
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                  isDone
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                      ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
                style={isDone ? { background: STEP_COLORS[i] } : undefined}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : isCurrent ? (
                  <Circle className="w-4 h-4 fill-blue-600 text-blue-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </motion.div>
              <span
                className={`text-xs font-medium font-inter text-center max-w-16 leading-tight ${
                  isDone ? 'text-green-600' : isCurrent ? 'text-blue-700' : 'text-gray-400'
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
