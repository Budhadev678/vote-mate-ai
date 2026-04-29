import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { AppAlert } from '../types'

function AlertItem({ alert }: { alert: AppAlert }) {
  const { dismissAlert, navigate } = useStore()

  const styles = {
    urgent: 'bg-slate-900 border-b border-slate-800 text-white',
    warning: 'bg-slate-900 border-b border-slate-800 text-white',
    info: 'bg-slate-900 border-b border-slate-800 text-white',
  }
  const Icon = alert.type === 'urgent' ? Zap : alert.type === 'warning' ? AlertTriangle : Info

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${styles[alert.type]} flex items-center gap-3 px-5 py-3.5 text-xs font-inter overflow-hidden shadow-lg`}
    >
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.type === 'urgent' ? 'bg-slate-800 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="flex-1 font-medium text-slate-100">{alert.message}</span>
      {alert.actionLabel && alert.actionScreen && (
        <button
          onClick={() => navigate(alert.actionScreen!)}
          className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex-shrink-0 border border-white/5"
        >
          {alert.actionLabel}
        </button>
      )}
      {alert.dismissible && (
        <button
          onClick={() => dismissAlert(alert.id)}
          className="hover:bg-white/10 p-1.5 rounded-lg transition-all flex-shrink-0 text-slate-500"
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
