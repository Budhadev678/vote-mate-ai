import { motion } from 'framer-motion'

interface Props {
  label?: string
}

export function TypingIndicator({ label = 'VoteMate AI is thinking...' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 px-4 py-2"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-sm">
        🤖
      </div>
      <div className="ai-bubble rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="text-xs text-blue-500 ml-1 font-inter">{label}</span>
      </div>
    </motion.div>
  )
}
