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
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#EF4444',
}

const INSIGHTS = [
  { time: '8–10 AM', emoji: '🟢', label: 'Best Time', wait: '~8 min', tip: 'Low crowd, comfortable voting' },
  { time: '12–2 PM', emoji: '🔴', label: 'Avoid', wait: '~35 min', tip: 'Peak hours — long queues' },
  { time: '4–6 PM', emoji: '🟡', label: 'Good Option', wait: '~15 min', tip: 'Moderate crowd — good backup' },
]

export function CrowdPredictionScreen() {
  const { goBack } = useStore()
  const nowHour = new Date().getHours()

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">🔮 Crowd Prediction</h1>
        <p className="text-purple-200 text-sm font-inter mt-1">
          AI-estimated crowd levels for voting day
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Best time card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-inter font-semibold opacity-90">BEST TIME TO VOTE</span>
          </div>
          <p className="text-2xl font-poppins font-bold">8:00 – 10:00 AM</p>
          <p className="text-green-100 text-sm font-inter mt-1">
            Low crowd · ~8 min wait · Comfortable experience
          </p>
        </motion.div>

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide mb-4">
            📊 Crowd Level Through The Day
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={CROWD_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fontFamily: 'Inter', fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [`${v}% busy`]}
                contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12, fontFamily: 'Inter' }}
              />
              <Bar dataKey="crowd" radius={[4, 4, 0, 0]}>
                {CROWD_DATA.map((d, i) => (
                  <Cell
                    key={i}
                    fill={BAR_COLORS[d.level as keyof typeof BAR_COLORS]}
                    opacity={
                      nowHour >= parseInt(d.time) && nowHour < parseInt(d.time) + 1 ? 1 : 0.75
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2 justify-center">
            {[['low', '#22C55E', 'Low'], ['medium', '#F59E0B', 'Medium'], ['high', '#EF4444', 'High']].map(
              ([key, color, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-inter text-gray-500">{label}</span>
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
          className="space-y-2"
        >
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
            ⏱️ Time Insights
          </p>
          {INSIGHTS.map((insight) => (
            <div
              key={insight.time}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <span className="text-2xl">{insight.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-poppins font-semibold text-gray-800">
                    {insight.time}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${
                      insight.label === 'Best Time'
                        ? 'bg-green-100 text-green-700'
                        : insight.label === 'Avoid'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {insight.label}
                  </span>
                </div>
                <p className="text-xs font-inter text-gray-500 mt-0.5">
                  Wait: {insight.wait} · {insight.tip}
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
          onClick={() => alert('Reminder set for 7:30 AM on voting day!')}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-poppins font-semibold text-sm text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)' }}
        >
          <Bell className="w-4 h-4" />
          Set Reminder for 7:30 AM
        </motion.button>

        {/* Disclaimer */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <p className="text-xs font-inter text-gray-500 text-center">
            🤖 AI predictions based on historical patterns. Actual crowd may vary.
          </p>
        </div>
      </div>
    </div>
  )
}
