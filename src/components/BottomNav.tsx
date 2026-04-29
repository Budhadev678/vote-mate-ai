import { Home, MessageCircle, BarChart2, User, MapPin } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Screen } from '../types'

interface NavItem {
  icon: React.FC<{ className?: string }>
  label: string
  screen: Screen
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: 'Home', screen: 'dashboard' },
  { icon: MapPin, label: 'Booth', screen: 'polling' },
  { icon: MessageCircle, label: 'AI', screen: 'chat' },
  { icon: BarChart2, label: 'Insights', screen: 'insights' },
  { icon: User, label: 'Profile', screen: 'profile' },
]

const HIDE_ON: Screen[] = ['landing', 'onboarding', 'chat']

export function BottomNav() {
  const { currentScreen, navigate } = useStore()

  if (HIDE_ON.includes(currentScreen)) return null

  return (
    <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-40 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.screen
          const Icon = item.icon
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center gap-1.5 px-3 py-1.5 transition-all group"
            >
              <div className={`p-1 rounded-lg transition-all ${active ? 'bg-slate-100' : 'group-hover:bg-slate-50'}`}>
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
              </div>
              <span
                className={`text-[9px] font-inter font-bold uppercase tracking-wider transition-colors ${
                  active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                }`}
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
