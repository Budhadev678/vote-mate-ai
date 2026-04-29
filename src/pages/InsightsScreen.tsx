import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, TrendingUp, Activity, User, Globe, FileText, MapPin } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ReadinessRing } from '../components/ReadinessRing'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { InfoButton } from '../components/InfoButton'

// Simulated progress history
const PROGRESS_HISTORY = [
  { day: 'Mon', score: 0 },
  { day: 'Tue', score: 10 },
  { day: 'Wed', score: 25 },
  { day: 'Thu', score: 40 },
  { day: 'Fri', score: 55 },
  { day: 'Sat', score: 65 },
  { day: 'Today', score: 0 }, // will be replaced with real score
]

export function InsightsScreen() {
  const { goBack, user, recommendations, navigate } = useStore()

  const history = PROGRESS_HISTORY.map((d, i) =>
    i === PROGRESS_HISTORY.length - 1 ? { ...d, score: user.readinessScore } : d,
  )

  const pendingSteps = ['registration', 'verification', 'documents', 'voting'].filter(
    (s) => !user.stepsCompleted.includes(s as never),
  )

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      {/* Header */}
      <div className="px-5 pt-10 pb-7 rounded-b-3xl shadow-lg mb-6 relative" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)' }}>
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-inter font-medium">Back</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-white">Readiness Analysis</h1>
            <p className="text-white/70 text-xs font-inter mt-1">Your official voting preparation metrics</p>
          </div>
          <InfoButton
            text="Your Readiness Score is calculated from 4 key milestones: Voter Registration, Detail Verification, ID Document check, and Polling Booth location. Complete all steps to reach 100%."
            title="Readiness Score"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overall status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-6">
            <ReadinessRing score={user.readinessScore} size={100} label="Readiness" />
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">Completion</p>
                <p className="text-xl font-poppins font-semibold text-slate-900">
                  {user.stepsCompleted.length}/4 Steps
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">Type</p>
                  <p className="text-sm font-inter font-semibold text-slate-700 capitalize">
                    {user.voterType?.replace('-', ' ') || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">State</p>
                  <p className="text-sm font-inter font-semibold text-slate-700">
                    {user.state || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">
              Weekly Progress Trend
            </p>
          </div>
          <div className="h-[120px]" style={{ minHeight: 120 }}>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={history} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fontFamily: 'Inter', fill: '#94A3B8', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    fontSize: 12,
                    fontFamily: 'Inter',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0F172A"
                  strokeWidth={3}
                  dot={{ fill: '#0F172A', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#0F172A', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Lightbulb className="w-4 h-4 text-slate-400" />
              <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">
                Priority Recommendations
              </p>
            </div>
            {recommendations.slice(0, 3).map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl flex-shrink-0 border border-slate-100">
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-inter text-slate-800 leading-relaxed font-medium">{rec.message}</p>
                  <button
                    onClick={() => navigate(rec.action as never)}
                    className="mt-3 text-xs font-poppins font-bold text-slate-900 flex items-center gap-1 hover:underline"
                  >
                    {rec.actionLabel} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pending steps */}
        {pendingSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">
                Action Required
              </p>
            </div>
            <div className="space-y-3">
              {pendingSteps.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <p className="text-sm font-inter text-slate-200 capitalize font-medium">
                    {step.replace('-', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* System parameters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-6">
            System Profiles
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: User, label: 'Mode', value: user.preferredMode || 'Chat' },
              { icon: Globe, label: 'Language', value: user.language === 'hi' ? 'Hindi' : 'English' },
              { icon: FileText, label: 'Docs', value: user.hasValidDocument ? 'Verified' : 'Missing' },
              { icon: MapPin, label: 'Booth', value: user.locationAvailable ? 'Located' : 'Pending' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <item.icon className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                </div>
                <p className="text-sm font-poppins font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)
