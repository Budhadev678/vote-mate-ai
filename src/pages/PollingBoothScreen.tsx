import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Navigation, Share2, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'

// ─── Mock booth data ──────────────────────────────────────────────
const MOCK_BOOTH = {
  name: 'Government Higher Secondary School',
  address: 'Ward No. 5, Near Main Market',
  boothNumber: 'B-147',
  distance: '1.2 km',
  eta: '6 min walk',
}

// ─── Crowd schedule ───────────────────────────────────────────────
const CROWD_HOURS = [
  { time: '7–8 AM', level: 'low' as const, wait: '~5 min', emoji: '🟢' },
  { time: '8–10 AM', level: 'low' as const, wait: '~8 min', emoji: '🟢', best: true },
  { time: '10–12 PM', level: 'medium' as const, wait: '~15 min', emoji: '🟡' },
  { time: '12–2 PM', level: 'high' as const, wait: '~35 min', emoji: '🔴', worst: true },
  { time: '2–4 PM', level: 'medium' as const, wait: '~18 min', emoji: '🟡' },
  { time: '4–6 PM', level: 'low' as const, wait: '~10 min', emoji: '🟢' },
]

export function PollingBoothScreen() {
  const { goBack, navigate, updateUser } = useStore()
  const [pinCode, setPinCode] = useState('')
  const [boothFound, setBoothFound] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFindBooth = () => {
    if (!pinCode.trim() && !boothFound) {
      // Auto-find with mock data
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setBoothFound(true)
        updateUser({ locationAvailable: true })
      }, 1200)
    }
  }

  const nowHour = new Date().getHours()
  const currentSlotIdx = nowHour < 8 ? 0 : nowHour < 10 ? 1 : nowHour < 12 ? 2 : nowHour < 14 ? 3 : nowHour < 16 ? 4 : 5

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">📍 Find Your Booth</h1>
        <p className="text-blue-200 text-sm font-inter mt-1">
          Locate your assigned polling station
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search / Find */}
        {!boothFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <p className="text-sm font-poppins font-semibold text-gray-700 mb-3">
              Enter PIN code to find booth
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 751001"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.slice(0, 6))}
                maxLength={6}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-inter focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleFindBooth}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-poppins font-semibold flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  '🔍 Find'
                )}
              </button>
            </div>
            <button
              onClick={handleFindBooth}
              className="mt-2 text-xs font-inter text-blue-600 underline"
            >
              Use my location instead →
            </button>
          </motion.div>
        )}

        {/* Booth info card */}
        {boothFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <span className="text-xs font-inter font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    ✓ Verified Booth
                  </span>
                </div>
                <h2 className="text-base font-poppins font-bold text-gray-800 mt-2">
                  {MOCK_BOOTH.name}
                </h2>
                <p className="text-sm font-inter text-gray-500">{MOCK_BOOTH.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Booth No.', value: MOCK_BOOTH.boothNumber },
                { label: 'Distance', value: MOCK_BOOTH.distance },
                { label: 'ETA', value: MOCK_BOOTH.eta },
              ].map((item) => (
                <div key={item.label} className="bg-blue-50 rounded-xl p-2.5 text-center">
                  <p className="text-xs font-inter text-blue-500">{item.label}</p>
                  <p className="text-sm font-poppins font-bold text-blue-800">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-xl h-36 flex items-center justify-center mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50" />
              <div className="relative text-center">
                <div className="text-4xl mb-1">🗺️</div>
                <p className="text-xs font-inter text-gray-500">Interactive map</p>
                <p className="text-xs font-inter text-gray-400">
                  (Connect Google Maps API for live map)
                </p>
              </div>
              {/* Simulated pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ y: [-4, 0, -4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-3xl"
                >
                  📍
                </motion.div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
              >
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-inter font-medium hover:bg-gray-50">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>
        )}

        {/* Best time card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">
              Crowd Prediction Today
            </span>
          </div>

          <div className="space-y-2">
            {CROWD_HOURS.map((slot, i) => {
              const isCurrent = i === currentSlotIdx
              const barW = slot.level === 'low' ? '30%' : slot.level === 'medium' ? '60%' : '90%'
              const barColor = slot.level === 'low' ? 'bg-green-400' : slot.level === 'medium' ? 'bg-amber-400' : 'bg-red-400'
              return (
                <div
                  key={slot.time}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${
                    isCurrent ? 'bg-indigo-50 border border-indigo-200' : ''
                  }`}
                >
                  <span className="text-base w-5">{slot.emoji}</span>
                  <div className="w-20 flex-shrink-0">
                    <p className="text-xs font-inter text-gray-700 font-medium">{slot.time}</p>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <motion.div
                      className={`h-2.5 rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: barW }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-xs font-inter text-gray-500 w-16 text-right">{slot.wait}</span>
                  {slot.best && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-inter">
                      Best!
                    </span>
                  )}
                  {slot.worst && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-inter">
                      Busy
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-3 bg-green-50 rounded-xl px-3 py-2 border border-green-100">
            <p className="text-xs font-inter text-green-800">
              🟢 <strong>Best time to vote:</strong> 8–10 AM — lowest crowd, ~8 min wait
            </p>
          </div>
        </motion.div>

        {/* Official sources */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-xs font-poppins font-semibold text-blue-700 mb-2">
            🏛️ Official Sources
          </p>
          <p className="text-xs font-inter text-blue-800 mb-1">
            Find booth officially at: <span className="font-semibold">voters.eci.gov.in</span>
          </p>
          <p className="text-xs font-inter text-blue-600">
            ✅ Verified from Election Commission of India
          </p>
        </div>
      </div>
    </div>
  )
}
