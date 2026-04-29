import { motion } from 'framer-motion'

interface Props {
  score: number // 0-100
  size?: number
  label?: string
}

export function ReadinessRing({ score, size = 100, label }: Props) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : score >= 25 ? '#6366F1' : '#EF4444'

  const emoji = score >= 75 ? '✅' : score >= 50 ? '⚡' : score >= 25 ? '📝' : '❗'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={8}
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{emoji}</span>
          <motion.span
            className="text-lg font-poppins font-bold leading-none"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-inter text-gray-500 text-center">{label}</span>
      )}
    </div>
  )
}
