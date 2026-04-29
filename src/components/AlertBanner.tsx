import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { AppAlert } from '../types'

function AlertItem({ alert }: { alert: AppAlert }) {
  const { dismissAlert, navigate } = useStore()

  const styles = {
    urgent: 'bg-red-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-600 text-white',
  }
  const Icon = alert.type === 'urgent' ? Zap : alert.type === 'warning' ? AlertTriangle : Info

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${styles[alert.type]} flex items-center gap-3 px-4 py-2.5 text-sm font-inter overflow-hidden`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{alert.message}</span>
      {alert.actionLabel && alert.actionScreen && (
        <button
          onClick={() => navigate(alert.actionScreen!)}
          className="bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
        >
          {alert.actionLabel}
        </button>
      )}
      {alert.dismissible && (
        <button
          onClick={() => dismissAlert(alert.id)}
          className="hover:bg-white/20 p-0.5 rounded transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  )
}

export function AlertBanner() {
  const alerts = useStore((s) => s.alerts)

  return (
    <AnimatePresence>
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </AnimatePresence>
  )
}
