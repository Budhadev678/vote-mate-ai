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

const HIDE_ON: Screen[] = ['landing', 'onboarding']

export function BottomNav() {
  const { currentScreen, navigate } = useStore()

  if (HIDE_ON.includes(currentScreen)) return null

  return (
    <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-40 glass border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.screen
          const Icon = item.icon
          return (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : ''}`} />
              <span
                className={`text-[10px] font-medium font-inter ${
                  active ? 'text-blue-700' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-blue-600" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
