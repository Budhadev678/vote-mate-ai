import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Navigation, Share2, Clock, Search, Locate } from 'lucide-react'
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
  const { goBack, updateUser } = useStore()
  const [pinCode, setPinCode] = useState('')
  const [boothFound, setBoothFound] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFindBooth = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setBoothFound(true)
      updateUser({ locationAvailable: true })
    }, 1200)
  }

  const nowHour = new Date().getHours()
  const currentSlotIdx = nowHour < 8 ? 0 : nowHour < 10 ? 1 : nowHour < 12 ? 2 : nowHour < 14 ? 3 : nowHour < 16 ? 4 : 5

  return (
    <div className="min-h-full bg-slate-50 flex flex-col pb-28">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden rounded-b-3xl shadow-lg mb-1" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
        <div className="relative px-5 pt-10 pb-7">
          <button onClick={goBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-inter font-medium">Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-white">Find Your Booth</h1>
              <p className="text-white/70 text-xs font-inter mt-1">Locate your assigned polling station</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl">
              📍
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Search Card */}
        {!boothFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
          >
            <p className="text-xs font-inter font-bold text-slate-500 uppercase tracking-widest mb-4">Search by Pincode</p>
            
            {/* Input row */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="number"
                  placeholder="Enter 6-digit pincode"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.slice(0, 6))}
                  maxLength={6}
                  className="flex-1 bg-transparent text-sm font-inter text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleFindBooth}
                disabled={loading}
                className="px-5 py-3 rounded-xl text-white text-sm font-poppins font-semibold shadow-md disabled:opacity-60 active:scale-[0.97] transition-all flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #2563eb)' }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : 'Find'}
              </button>
            </div>

            {/* Use Location Button */}
            <button
              onClick={handleFindBooth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 text-blue-700 text-sm font-inter font-semibold transition-all hover:bg-blue-50 disabled:opacity-60"
              style={{ background: 'rgba(239, 246, 255, 0.7)' }}
            >
              <Locate className="w-4 h-4" />
              Use My Current Location
            </button>
          </motion.div>
        )}

        {/* Booth Info Card */}
        {boothFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200"
          >
            {/* Official badge strip */}
            <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'linear-gradient(90deg, #dcfce7, #f0fdf4)' }}>
              <span className="text-green-700 text-xs">✓</span>
              <span className="text-green-800 text-[11px] font-inter font-bold uppercase tracking-widest">Officially Verified Station</span>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <h2 className="text-base font-poppins font-bold text-slate-900 mb-1">{MOCK_BOOTH.name}</h2>
                <p className="text-sm font-inter text-slate-500">{MOCK_BOOTH.address}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  { label: 'Booth No.', value: MOCK_BOOTH.boothNumber, icon: '🏷️' },
                  { label: 'Distance', value: MOCK_BOOTH.distance, icon: '📏' },
                  { label: 'Walk Time', value: MOCK_BOOTH.eta, icon: '⏱️' },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <p className="text-base mb-1">{item.icon}</p>
                    <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-poppins font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl h-36 flex items-center justify-center mb-4 overflow-hidden relative border border-slate-100">
                <div className="text-center relative z-10">
                  <div className="text-3xl mb-1">🗺️</div>
                  <p className="text-xs font-inter text-slate-500">Interactive map preview</p>
                </div>
                <motion.div
                  animate={{ y: [-4, 0, -4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"
                >
                  📍
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                  className="flex-1 py-3.5 rounded-xl text-white text-sm font-poppins font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #2563eb)' }}
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
                <button className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm font-inter font-semibold hover:bg-slate-100 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Crowd Forecast Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-inter font-bold text-slate-500 uppercase tracking-widest">Crowd Forecast</span>
          </div>

          <div className="space-y-2">
            {CROWD_HOURS.map((slot, i) => {
              const isCurrent = i === currentSlotIdx
              const barW = slot.level === 'low' ? '30%' : slot.level === 'medium' ? '60%' : '90%'
              const barColor = slot.level === 'low' ? '#22c55e' : slot.level === 'medium' ? '#f59e0b' : '#ef4444'
              return (
                <div
                  key={slot.time}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isCurrent ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm w-5 text-center flex-shrink-0">{slot.emoji}</span>
                  <div className="w-16 flex-shrink-0">
                    <p className="text-xs font-inter text-slate-700 font-semibold">{slot.time}</p>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 relative overflow-visible">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: barW }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                    />
                    {(slot.best || slot.worst) && (
                      <span className={`absolute -top-5 right-0 text-[9px] px-1.5 py-0.5 rounded-full font-inter font-bold ${slot.best ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {slot.best ? '✓ Best' : '✗ Busy'}
                      </span>
                    )}
                  </div>
                  <div className="w-14 flex-shrink-0 text-right">
                    <span className="text-[10px] font-inter text-slate-500 font-bold">{slot.wait}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 bg-green-50 rounded-xl px-4 py-3 border border-green-100">
            <p className="text-xs font-inter text-green-800 leading-relaxed">
              <span className="font-bold">💡 Tip:</span> 8–10 AM is the optimal window with minimal wait times.
            </p>
          </div>
        </motion.div>

        {/* ECI Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-2">ECI Verification</p>
          <p className="text-sm font-poppins font-semibold text-white mb-1">voters.eci.gov.in</p>
          <p className="text-xs font-inter text-slate-400 leading-relaxed">
            Data verified from the Election Commission of India. Always carry a valid photo ID.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
