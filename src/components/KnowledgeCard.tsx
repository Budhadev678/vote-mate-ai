import { motion } from 'framer-motion'
import type { KnowledgeCard as KCard } from '../types'

const COLOR_MAP = {
  blue: {
    bg: 'bg-white',
    border: 'border-slate-200',
    title: 'text-slate-900',
    dot: 'bg-blue-600',
  },
  green: {
    bg: 'bg-white',
    border: 'border-slate-200',
    title: 'text-slate-900',
    dot: 'bg-emerald-600',
  },
  amber: {
    bg: 'bg-white',
    border: 'border-slate-200',
    title: 'text-slate-900',
    dot: 'bg-amber-500',
  },
  purple: {
    bg: 'bg-white',
    border: 'border-slate-200',
    title: 'text-slate-900',
    dot: 'bg-slate-900',
  },
}

export function KnowledgeCard({ card }: { card: KCard }) {
  const c = COLOR_MAP[card.color]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${c.bg} ${c.border} border rounded-2xl p-5 min-w-[240px] shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg border border-slate-100">
          {card.icon}
        </div>
        <span className={`text-sm font-semibold font-poppins ${c.title}`}>{card.title}</span>
      </div>
      <ul className="space-y-3">
        {card.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-xs font-inter text-slate-600 font-medium leading-relaxed">
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 flex-shrink-0 opacity-40`} />
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
