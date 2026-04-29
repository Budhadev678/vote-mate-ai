import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COMMUNITY_STATS = {
  totalUsers: 1284,
  readyPercent: 72,
  partialPercent: 19,
  notReadyPercent: 9,
  topIssue: 'Missing valid ID document',
  areaName: 'Your State',
}

const PIE_DATA = [
  { name: 'Ready', value: 72, color: '#22C55E' },
  { name: 'Partial', value: 19, color: '#F59E0B' },
  { name: 'Not Ready', value: 9, color: '#EF4444' },
]

const AREA_DATA = [
  { label: 'Registration', percent: 88, color: '#22C55E' },
  { label: 'Verification', percent: 76, color: '#3B82F6' },
  { label: 'Documents', percent: 64, color: '#F59E0B' },
  { label: 'Booth Found', percent: 55, color: '#8B5CF6' },
]

export function CommunityScreen() {
  const { goBack } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">📊 Community Insights</h1>
        <p className="text-purple-200 text-sm font-inter mt-1">
          How your community is preparing to vote
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Users className="w-4 h-4 text-purple-300" />
          <span className="text-purple-100 text-sm font-inter">
            {COMMUNITY_STATS.totalUsers.toLocaleString()} users tracked
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overall readiness pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Overall Readiness
          </p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx={55}
                  cy={55}
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PIE_DATA.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 flex-1">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs font-inter text-gray-700 flex-1">{d.name}</span>
                  <span className="text-sm font-poppins font-bold" style={{ color: d.color }}>
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Step completion rates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide mb-4">
            📈 Step Completion
          </p>
          <div className="space-y-3">
            {AREA_DATA.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-inter font-medium text-gray-700">{item.label}</span>
                  <span className="text-xs font-poppins font-bold" style={{ color: item.color }}>
                    {item.percent}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top issue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-poppins font-semibold text-amber-800">Biggest Barrier</p>
            <p className="text-sm font-inter text-amber-700 mt-0.5">{COMMUNITY_STATS.topIssue}</p>
            <p className="text-xs font-inter text-amber-600 mt-1">
              Most users in your area struggle with this step
            </p>
          </div>
        </motion.div>

        {/* Trending insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
              AI Insights
            </p>
          </div>
          {[
            { icon: '📈', text: 'Readiness improved 12% this week in your area' },
            { icon: '🗓️', text: 'Most users plan to vote between 8–10 AM' },
            { icon: '📄', text: '36% users haven\'t checked their documents yet' },
            { icon: '📍', text: '45% users haven\'t located their polling booth' },
          ].map((insight, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
              <span className="text-base">{insight.icon}</span>
              <p className="text-xs font-inter text-gray-700">{insight.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Data source note */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <p className="text-xs font-inter text-gray-400 text-center">
            🔒 Data is anonymized and aggregated. No personal information shared.
          </p>
        </div>
      </div>
    </div>
  )
}
