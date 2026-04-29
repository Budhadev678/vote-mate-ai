import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Users, AlertCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { InfoButtonLight } from '../components/InfoButton'

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
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      {/* Header */}
      <div className="px-5 pt-10 pb-6 bg-white border-b border-slate-100 shadow-sm">
        <button onClick={goBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-inter font-medium">Back</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-poppins font-bold text-slate-900">Community Insights</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 text-[11px] font-inter font-semibold">{COMMUNITY_STATS.totalUsers.toLocaleString()} active voters tracked</span>
            </div>
          </div>
          <InfoButtonLight
            text="Community data is anonymized and aggregated from voters in your region. No personal information is shared or stored. Data helps identify common preparation gaps."
            title="About This Data"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overall readiness pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-6">
            Readiness Index
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
            <div className="space-y-3 flex-1">
              {PIE_DATA.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs font-inter text-slate-600 flex-1 font-medium">{d.name}</span>
                  <span className="text-sm font-poppins font-semibold text-slate-900">
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
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-6">
            Step Completion Rate
          </p>
          <div className="space-y-3">
            {AREA_DATA.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-inter font-semibold text-slate-700">{item.label}</span>
                  <span className="text-xs font-poppins font-bold text-slate-900">
                    {item.percent}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#0f172a' }}
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
          className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg flex gap-4 relative overflow-hidden"
        >
          <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">Area Priority</p>
            <p className="text-sm font-poppins font-medium">{COMMUNITY_STATS.topIssue}</p>
            <p className="text-xs font-inter text-slate-400 mt-2 leading-relaxed">
              Most voters in your region currently face this challenge. Ensure your documentation is verified early.
            </p>
          </div>
        </motion.div>

        {/* Trending insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">
              AI Trends
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: '📈', text: 'Preparation improved by 12% in your region this week' },
              { icon: '🗓️', text: 'Peak voting intent identified between 8–10 AM' },
              { icon: '📄', text: 'Document verification gap noted among first-time voters' },
              { icon: '📍', text: 'High booth-finding success reported in your neighborhood' },
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0 last:pb-0">
                <span className="text-lg">{insight.icon}</span>
                <p className="text-xs font-inter text-slate-700 leading-relaxed font-medium">{insight.text}</p>
              </div>
            ))}
          </div>
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
