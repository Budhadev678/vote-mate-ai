import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, TrendingUp, Activity } from 'lucide-react'
import { useStore } from '../store/useStore'
import { ReadinessRing } from '../components/ReadinessRing'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)' }}
      >
        <button
          onClick={goBack}
          className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">📊 Your Insights</h1>
        <p className="text-indigo-200 text-sm font-inter mt-1">
          AI-powered analysis of your voting readiness
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overall status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-6">
            <ReadinessRing score={user.readinessScore} size={100} label="Overall Readiness" />
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs font-inter text-gray-500">Steps Done</p>
                <p className="text-lg font-poppins font-bold text-gray-800">
                  {user.stepsCompleted.length}/4
                </p>
              </div>
              <div>
                <p className="text-xs font-inter text-gray-500">Voter Type</p>
                <p className="text-sm font-poppins font-semibold text-indigo-700 capitalize">
                  {user.voterType?.replace('-', ' ') || 'Not set'} Voter
                </p>
              </div>
              <div>
                <p className="text-xs font-inter text-gray-500">State</p>
                <p className="text-sm font-poppins font-semibold text-gray-700">
                  {user.state || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-indigo-500" />
            <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
              Readiness Progress This Week
            </p>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 9, fontFamily: 'Inter', fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                formatter={(v) => [`${v}%`]}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #E5E7EB',
                  fontSize: 11,
                  fontFamily: 'Inter',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ fill: '#6366F1', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#4338CA' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
                Smart Recommendations
              </p>
            </div>
            {recommendations.slice(0, 3).map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className={`bg-white rounded-2xl p-4 border-l-4 shadow-sm ${
                  rec.color === 'red'
                    ? 'border-l-red-500'
                    : rec.color === 'yellow'
                      ? 'border-l-amber-400'
                      : rec.color === 'blue'
                        ? 'border-l-blue-500'
                        : 'border-l-green-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{rec.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-inter text-gray-800">{rec.message}</p>
                    <button
                      onClick={() => navigate(rec.action as never)}
                      className="mt-2 text-xs font-inter font-semibold text-blue-600 flex items-center gap-1"
                    >
                      {rec.actionLabel} →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pending steps */}
        {pendingSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <p className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
                Pending Steps
              </p>
            </div>
            <div className="space-y-2">
              {pendingSteps.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2"
                >
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs font-inter text-red-700 capitalize">
                    {step.replace('-', ' ')} not completed
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preferences detected */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100"
        >
          <p className="text-sm font-poppins font-semibold text-indigo-800 mb-3">
            🧠 System Detected
          </p>
          <div className="space-y-2">
            {[
              { icon: '💬', label: 'Preferred Mode', value: user.preferredMode || 'Chat' },
              { icon: '🌐', label: 'Language', value: user.language === 'hi' ? 'Hindi' : 'English' },
              {
                icon: '📄',
                label: 'Document Status',
                value: user.hasValidDocument ? 'Ready ✅' : 'Not set ❗',
              },
              {
                icon: '📍',
                label: 'Booth Status',
                value: user.locationAvailable ? 'Found ✅' : 'Not checked ❗',
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs font-inter text-indigo-700">
                  {item.icon} {item.label}
                </span>
                <span className="text-xs font-poppins font-semibold text-indigo-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
