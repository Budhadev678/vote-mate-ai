/**
 * @file BottomNav.tsx
 * @description Accessible bottom navigation bar for VoteMate AI.
 * Implements ARIA roles, labels, keyboard navigation, and
 * animated active state indicator using Framer Motion.
 */

import { Home, MessageCircle, BarChart2, User, MapPin } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Screen } from '../types'
import { motion } from 'framer-motion'

interface NavItem {
  icon: React.FC<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  screen: Screen
  description: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home,          label: 'Home',     screen: 'dashboard', description: 'Go to Dashboard'        },
  { icon: MapPin,        label: 'Booth',    screen: 'polling',   description: 'Find Polling Booth'      },
  { icon: MessageCircle, label: 'AI',       screen: 'chat',      description: 'Chat with VoteMate AI'   },
  { icon: BarChart2,     label: 'Insights', screen: 'insights',  description: 'View Readiness Insights' },
  { icon: User,          label: 'Profile',  screen: 'profile',   description: 'View Your Profile'       },
]

const HIDE_ON: Screen[] = ['landing', 'onboarding', 'auth']

export function BottomNav() {
  const { currentScreen, navigate } = useStore()

  if (HIDE_ON.includes(currentScreen)) return null

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="flex-shrink-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        role="tablist"
        aria-label="App sections"
        className="flex items-center justify-around px-2 h-[62px]"
      >
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.screen
          const Icon = item.icon
          return (
            <button
              key={item.screen}
              role="tab"
              aria-selected={active}
              aria-label={item.description}
              aria-current={active ? 'page' : undefined}
              id={`nav-${item.screen}`}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset rounded-lg"
            >
              {/* Active indicator bar */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg,#4f46e5,#db2777)' }}
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                  aria-hidden="true"
                />
              )}
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                <Icon
                  aria-hidden={true}
                  className={`w-5 h-5 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                />
              </div>
              <span
                className={`text-[9px] font-inter font-bold uppercase tracking-wider transition-colors leading-none ${
                  active ? 'text-indigo-600' : 'text-slate-400'
                }`}
                aria-hidden="true"
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
