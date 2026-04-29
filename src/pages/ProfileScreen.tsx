import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin, Globe, Settings2, ChevronRight,
  BookOpen, Users, BarChart2, HelpCircle, RotateCcw,
  Shield, Scale, AlertOctagon, Accessibility, Check,
  ExternalLink, Phone, Edit2, X, ChevronDown,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { ReadinessRing } from '../components/ReadinessRing'
import { InfoButtonLight } from '../components/InfoButton'
import type { Language, InteractionMode } from '../types'

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
]

const MENU_GROUPS = [
  {
    title: 'Learn',
    items: [
      { icon: '📅', label: 'Election Timeline', screen: 'timeline' as const, desc: 'Key dates & milestones' },
      { icon: '📖', label: 'Glossary', screen: 'glossary' as const, desc: 'Election terms explained' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { icon: '👨‍👩‍👧', label: 'Family Voting', screen: 'family' as const, desc: 'Help family members vote' },
      { icon: '📊', label: 'Community Stats', screen: 'community' as const, desc: 'Regional readiness data' },
      { icon: '⚡', label: '1-Min Quick Guide', screen: 'quick' as const, desc: 'Fast prep for busy voters' },
    ],
  },
  {
    title: 'Trust & Safety',
    items: [
      { icon: '🛡️', label: 'Verify News', screen: 'verify-news' as const, desc: 'Check election news' },
      { icon: '⚖️', label: 'Know Candidates', screen: 'candidates' as const, desc: 'Candidate info' },
      { icon: '🚨', label: 'Report Violation', screen: 'report-violation' as const, desc: 'Report misconduct' },
      { icon: '♿', label: 'Accessibility', screen: 'accessibility' as const, desc: 'Voting support options' },
    ],
  },
]

export function ProfileScreen() {
  const { user, updateUser, resetUser, goBack, navigate } = useStore()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(user.name || '')
  const [showStateSheet, setShowStateSheet] = useState(false)
  const [stateSearch, setStateSearch] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const filteredStates = STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase()),
  )

  const handleSaveName = () => {
    if (nameInput.trim()) updateUser({ name: nameInput.trim() })
    setEditingName(false)
  }

  const handleReset = () => {
    resetUser()
    navigate('landing')
    setShowResetConfirm(false)
  }

  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const readinessColor =
    user.readinessScore >= 75 ? '#22c55e' :
    user.readinessScore >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-6">

      {/* ── Hero Header ── */}
      <div
        className="relative px-5 pt-10 pb-8 rounded-b-3xl shadow-lg mb-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#2563eb 100%)' }}
      >
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle,white,transparent 70%)', transform: 'translate(30%,-30%)' }} />

        {/* Back + Info row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-inter font-medium">Back</span>
          </button>
          <InfoButtonLight
            text="Your profile stores your preferences locally on your device. No personal data is sent to external servers. You can reset all data at any time."
            title="Profile & Privacy"
          />
        </div>

        {/* Avatar + name + ring */}
        <div className="flex items-center gap-4">
          {/* Avatar circle */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-poppins font-bold text-xl shadow-lg border-2 border-white/20"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              {user.name ? initials : (user.voterType === 'first-time' ? '🌟' : '🗳️')}
            </div>
            {/* Edit badge */}
            <button
              onClick={() => { setNameInput(user.name || ''); setEditingName(true) }}
              aria-label="Edit name"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md"
            >
              <Edit2 className="w-2.5 h-2.5 text-slate-700" />
            </button>
          </div>

          {/* Name + info */}
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  placeholder="Your name"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl text-slate-800 text-sm font-inter border border-slate-200 focus:outline-none focus:border-indigo-400 bg-white shadow-sm"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  aria-label="Save name"
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0"
                >
                  <Check className="w-4 h-4 text-indigo-600" />
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  aria-label="Cancel editing name"
                  className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setNameInput(user.name || ''); setEditingName(true) }}
                  className="text-left group"
                >
                  <p className="text-white font-poppins font-bold text-lg leading-tight truncate group-hover:text-white/80 transition-colors">
                    {user.name || 'Add your name'}
                  </p>
                </button>
                <p className="text-white/60 text-xs font-inter mt-0.5 capitalize">
                  {user.voterType?.replace('-', ' ') || 'Voter'} · {user.state || 'India'}
                </p>
              </>
            )}
          </div>

          {/* Readiness ring */}
          <div className="flex-shrink-0">
            <ReadinessRing score={user.readinessScore} size={60} label="Readiness" />
          </div>
        </div>

        {/* Readiness status strip */}
        <div className="mt-5 flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: readinessColor }} />
          <div className="flex-1">
            <p className="text-white text-xs font-inter font-semibold">
              {user.readinessScore >= 75 ? 'Ready to Vote ✅' :
               user.readinessScore >= 40 ? 'In Progress — keep going!' :
               'Just getting started'}
            </p>
            <div className="h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${user.readinessScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ backgroundColor: readinessColor }}
              />
            </div>
          </div>
          <span className="text-white font-poppins font-bold text-sm flex-shrink-0">
            {user.readinessScore}%
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* ── Preferences Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">Preferences</p>
          </div>

          {/* Language */}
          <div className="px-5 py-3.5 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-inter text-slate-700 font-semibold">Language</span>
              </div>
              <div className="flex gap-1.5">
                {(['en', 'hi', 'or'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => updateUser({ language: lang })}
                    aria-label={`Select language: ${lang}`}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-inter font-bold border transition-all ${
                      user.language === lang
                        ? 'text-white border-transparent'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                    style={user.language === lang ? { background: 'linear-gradient(135deg,#4f46e5,#db2777)' } : {}}
                  >
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'ଓ'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* App Mode */}
          <div className="px-5 py-3.5 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-inter text-slate-700 font-semibold">App Mode</span>
              </div>
              <div className="flex gap-1.5">
                {(['chat', 'guided', 'quick'] as InteractionMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateUser({ preferredMode: mode })}
                    aria-label={`Select app mode: ${mode}`}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-inter font-bold border capitalize transition-all ${
                      user.preferredMode === mode
                        ? 'text-white border-transparent'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                    style={user.preferredMode === mode ? { background: 'linear-gradient(135deg,#4f46e5,#db2777)' } : {}}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* State / Region */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-inter text-slate-700 font-semibold">State / UT</p>
                  <p className="text-xs font-inter text-slate-400">{user.state || 'Not set'}</p>
                </div>
              </div>
              <button
                onClick={() => { setStateSearch(''); setShowStateSheet(true) }}
                aria-label={user.state ? 'Change state' : 'Set state'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-inter font-bold hover:bg-slate-100 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                {user.state ? 'Change' : 'Set'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Menu Groups ── */}
        {MENU_GROUPS.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * (gi + 1) }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-5 pt-4 pb-2">
              <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest">{group.title}</p>
            </div>
            {group.items.map((item, i) => (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                aria-label={`Go to ${item.label}`}
                className={`w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left ${
                  i < group.items.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-inter font-semibold text-slate-800 truncate">{item.label}</p>
                  <p className="text-[11px] font-inter text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </button>
            ))}
          </motion.div>
        ))}

        {/* ── Official Resources ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}
        >
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-inter font-bold text-blue-500 uppercase tracking-widest">🏛️ Official Resources</p>
          </div>
          {[
            { label: 'voters.eci.gov.in', desc: 'Register & check electoral roll', url: 'https://voters.eci.gov.in', icon: '🗳️' },
            { label: 'eci.gov.in', desc: 'Election Commission of India', url: 'https://eci.gov.in', icon: '🏛️' },
            { label: 'Helpline: 1950', desc: 'National Voter Helpline', url: 'tel:1950', icon: '📞' },
          ].map((link, i, arr) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit official resource: ${link.label}`}
              className={`flex items-center gap-3 px-5 py-3.5 hover:bg-blue-100/50 transition-colors ${i < arr.length - 1 ? 'border-b border-blue-100' : ''}`}
            >
              <span className="text-lg">{link.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-poppins font-bold text-blue-800">{link.label}</p>
                <p className="text-[11px] font-inter text-blue-500">{link.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            </a>
          ))}
        </motion.div>

        {/* ── Reset + Version ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <button
            onClick={() => setShowResetConfirm(true)}
            aria-label="Reset all progress and data"
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-rose-600 border border-rose-100 bg-rose-50 hover:bg-rose-100 transition-colors font-inter text-sm font-bold"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Progress
          </button>

          <p className="text-center text-[11px] font-inter text-slate-400 pb-2">
            VoteMate AI v2.0 · Made with ❤️ for Indian voters
          </p>
        </motion.div>
      </div>

      {/* ── State Picker Bottom Sheet ── */}
      <AnimatePresence>
        {showStateSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStateSheet(false)}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="state-dialog-title"
              className="w-full max-w-[480px] bg-white rounded-t-3xl shadow-2xl overflow-hidden"
              style={{ maxHeight: '75vh' }}
            >
              {/* Sheet header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <p id="state-dialog-title" className="font-poppins font-bold text-slate-900">Select State / UT</p>
                <button onClick={() => setShowStateSheet(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Search */}
              <div className="px-4 py-3 border-b border-slate-50">
                <input
                  type="text"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  placeholder="Search state..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-inter text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
                  autoFocus
                />
              </div>
              {/* List */}
              <div className="overflow-y-auto" style={{ maxHeight: '50vh' }}>
                {filteredStates.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      updateUser({ state: s })
                      setShowStateSheet(false)
                    }}
                    className={`w-full flex items-center justify-between px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left last:border-0 ${user.state === s ? 'bg-indigo-50' : ''}`}
                  >
                    <span className={`text-sm font-inter font-medium ${user.state === s ? 'text-indigo-700' : 'text-slate-700'}`}>{s}</span>
                    {user.state === s && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                  </button>
                ))}
                {filteredStates.length === 0 && (
                  <p className="text-center text-sm text-slate-400 font-inter py-8">No state found</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reset Confirm Dialog ── */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetConfirm(false)}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-dialog-title"
              className="w-full max-w-[320px] bg-white rounded-3xl shadow-2xl p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </div>
              <h3 id="reset-dialog-title" className="font-poppins font-bold text-slate-900 text-center text-lg mb-2">Reset All Progress?</h3>
              <p className="text-sm font-inter text-slate-500 text-center leading-relaxed mb-6">
                This will erase all your data, preferences and readiness progress. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-2xl text-sm font-poppins font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-3.5 rounded-2xl text-sm font-poppins font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
