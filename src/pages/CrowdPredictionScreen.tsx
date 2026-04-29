import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Bell } from 'lucide-react'
import { useStore } from '../store/useStore'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'

const CROWD_DATA = [
  { time: '7AM', crowd: 20, level: 'low' },
  { time: '8AM', crowd: 25, level: 'low' },
  { time: '9AM', crowd: 30, level: 'low' },
  { time: '10AM', crowd: 50, level: 'medium' },
  { time: '11AM', crowd: 65, level: 'medium' },
  { time: '12PM', crowd: 90, level: 'high' },
  { time: '1PM', crowd: 95, level: 'high' },
  { time: '2PM', crowd: 85, level: 'high' },
  { time: '3PM', crowd: 60, level: 'medium' },
  { time: '4PM', crowd: 45, level: 'medium' },
  { time: '5PM', crowd: 35, level: 'low' },
]

const BAR_COLORS = {
  low: '#cbd5e1',
  medium: '#94a3b8',
  high: '#0f172a',
}

const INSIGHTS = [
  { time: '8–10 AM', emoji: '🟢', label: 'Optimal', wait: '~8 min', tip: 'Minimal crowd, efficient processing' },
  { time: '12–2 PM', emoji: '🔴', label: 'Peak', wait: '~35 min', tip: 'High volume — expect delays' },
  { time: '4–6 PM', emoji: '🟡', label: 'Moderate', wait: '~15 min', tip: 'Steady flow — reasonable wait' },
]

export function CrowdPredictionScreen() {
  const { goBack } = useStore()
  const nowHour = new Date().getHours()

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-semibold text-slate-900">Crowd Forecast</h1>
        <p className="text-slate-500 text-xs font-inter mt-1.5 font-medium">
          AI-driven estimates for election day planning
        </p>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Recommended window card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">Recommended Window</span>
            </div>
            <p className="text-2xl font-poppins font-semibold">8:00 – 10:00 AM</p>
            <p className="text-slate-400 text-xs font-inter mt-3 leading-relaxed">
              Lowest projected volume with an estimated <span className="text-white font-bold">8 min wait time</span>.
            </p>
          </div>
          {/* Subtle decoration */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-6">
            Hourly Density Projection
          </p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CROWD_DATA} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 9, fontFamily: 'Inter', fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: 12, border: 'none', fontSize: 10, fontFamily: 'Inter', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="crowd" radius={[4, 4, 0, 0]}>
                  {CROWD_DATA.map((d, i) => (
                    <Cell
                      key={i}
                      fill={BAR_COLORS[d.level as keyof typeof BAR_COLORS]}
                      opacity={nowHour >= parseInt(d.time) && nowHour < parseInt(d.time) + 1 ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-6 mt-6 justify-center">
            {[['low', '#cbd5e1', 'Quiet'], ['medium', '#94a3b8', 'Steady'], ['high', '#0f172a', 'Busy']].map(
              ([key, color, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
              ),
            )}
          </div>
        </motion.div>

        {/* Time insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">
            Timeline Analysis
          </p>
          {INSIGHTS.map((insight) => (
            <div
              key={insight.time}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-5 group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                {insight.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-poppins font-semibold text-slate-900">
                    {insight.time}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-lg font-inter font-bold uppercase tracking-widest ${
                      insight.label === 'Optimal'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {insight.label}
                  </span>
                </div>
                <p className="text-xs font-inter text-slate-500 mt-1 font-medium">
                  {insight.wait} · {insight.tip}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Set reminder */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => alert('Voter reminder synchronized for 7:30 AM.')}
          className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-poppins font-semibold text-sm text-white bg-slate-900 shadow-lg active:scale-[0.98] transition-all"
        >
          <Bell className="w-4 h-4" />
          Schedule Arrival Reminder
        </motion.button>

        {/* Disclaimer */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-[10px] font-inter text-slate-400 text-center leading-relaxed font-medium uppercase tracking-wider">
            Predictions generated via historical regional patterns.
          </p>
        </div>
      </div>
    </div>
  )
}
