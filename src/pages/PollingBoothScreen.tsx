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
    <div className="min-h-full bg-mesh pb-32">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 btn-gradient rounded-b-3xl shadow-lg mb-6 relative">
        <button onClick={goBack} className="text-white/80 hover:text-white mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-semibold text-white">Find Your Booth</h1>
        <p className="text-white/80 text-xs font-inter mt-1.5 font-medium">
          Locate your assigned official polling station
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search / Find */}
        {!boothFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
          >
            <p className="text-sm font-inter font-semibold text-slate-800 mb-4">
              Enter Pincode
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 751001"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.slice(0, 6))}
                maxLength={6}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-inter focus:outline-none focus:border-slate-400 shadow-sm transition-all"
              />
              <button
                onClick={handleFindBooth}
                disabled={loading}
                className="btn-gradient px-6 py-3 rounded-xl text-white text-sm font-poppins font-semibold shadow-md disabled:opacity-50 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Find'
                )}
              </button>
            </div>
            <button
              onClick={handleFindBooth}
              className="mt-4 text-xs font-inter font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Or use current location →
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
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-inter font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-widest">
                    Official Station
                  </span>
                </div>
                <h2 className="text-base font-poppins font-semibold text-slate-900 mt-3">
                  {MOCK_BOOTH.name}
                </h2>
                <p className="text-sm font-inter text-slate-500 leading-relaxed">{MOCK_BOOTH.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Booth', value: MOCK_BOOTH.boothNumber },
                { label: 'Distance', value: MOCK_BOOTH.distance },
                { label: 'Wait', value: MOCK_BOOTH.eta },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-poppins font-semibold text-slate-900">{item.value}</p>
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
            <div className="flex gap-3">
              <button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="btn-gradient flex-1 py-3.5 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
              >
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
              <button className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-inter font-semibold hover:bg-slate-50 transition-colors">
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
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">
              Crowd Forecast
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
                  <span className="text-base w-5 hidden sm:block">{slot.emoji}</span>
                  <div className="w-16 sm:w-20 flex-shrink-0">
                    <p className="text-xs font-inter text-gray-700 font-medium">{slot.time}</p>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 relative flex items-center">
                    <motion.div
                      className={`h-2.5 rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: barW }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                    />
                    {(slot.best || slot.worst) && (
                      <span className={`absolute -top-1.5 right-0 text-[8px] px-1.5 py-0.5 rounded-full font-inter font-bold shadow-sm ${slot.best ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {slot.best ? 'Best' : 'Busy'}
                      </span>
                    )}
                  </div>
                  <div className="w-14 flex-shrink-0 text-right">
                    <span className="text-[10px] font-inter text-slate-500 font-semibold">{slot.wait}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <p className="text-xs font-inter text-slate-700 leading-relaxed">
              <span className="font-bold">Recommended:</span> 8–10 AM is the optimal window with minimal wait times.
            </p>
          </div>
        </motion.div>

        {/* Official sources */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-3">
            ECI Verification
          </p>
          <p className="text-sm font-poppins font-medium mb-1">
            voters.eci.gov.in
          </p>
          <p className="text-xs font-inter text-slate-400 leading-relaxed">
            Data verified from the Election Commission of India. Always carry a valid ID.
          </p>
        </div>
      </div>
    </div>
  )
}
