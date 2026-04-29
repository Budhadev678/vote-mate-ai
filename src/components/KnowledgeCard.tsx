import { motion } from 'framer-motion'
import type { KnowledgeCard as KCard } from '../types'

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    title: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    title: 'text-green-700',
    dot: 'bg-green-400',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    title: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    title: 'text-purple-700',
    dot: 'bg-purple-400',
  },
}

export function KnowledgeCard({ card }: { card: KCard }) {
  const c = COLOR_MAP[card.color]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${c.bg} ${c.border} border rounded-2xl p-4 min-w-[200px]`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{card.icon}</span>
        <span className={`text-sm font-semibold font-poppins ${c.title}`}>{card.title}</span>
      </div>
      <ul className="space-y-1.5">
        {card.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs font-inter text-gray-700">
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1 flex-shrink-0`} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ─── Static quick-access cards used across the app ────────────────
export const QUICK_CARDS: KCard[] = [
  {
    icon: '📄',
    title: 'Required Documents',
    color: 'blue',
    items: ['Voter ID / EPIC card', 'Aadhaar card', 'Passport', 'Driving Licence', 'PAN card'],
  },
  {
    icon: '🗳️',
    title: 'Voting Steps',
    color: 'green',
    items: [
      'Arrive at booth with ID',
      'Name verified on roll',
      'Ink mark on finger',
      'EVM activated',
      'Cast your vote',
    ],
  },
  {
    icon: '⏰',
    title: 'Important Dates',
    color: 'amber',
    items: [
      'Polling: May 20, 2026',
      'Booths open: 7 AM',
      'Booths close: 6 PM',
      'Results: May 23, 2026',
    ],
  },
  {
    icon: '📍',
    title: 'Booth Info',
    color: 'purple',
    items: [
      'Find at voters.eci.gov.in',
      'Check voter slip',
      'Assigned by locality',
      'Can\'t change booth',
    ],
  },
]
