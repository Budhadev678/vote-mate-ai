import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, User, MapPin, Globe, Settings, ChevronRight,
  BookOpen, Users, BarChart2, HelpCircle, LogOut, Shield, Scale, AlertOctagon, Accessibility,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { ReadinessRing } from '../components/ReadinessRing'
import type { Language, InteractionMode } from '../types'

export function ProfileScreen() {
  const { user, updateUser, resetUser, goBack, navigate } = useStore()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(user.name || '')
  const [editingState, setEditingState] = useState(false)

  const STATES = [
    'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
    'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
    'Uttarakhand','West Bengal',
  ]

  const handleSaveName = () => {
    updateUser({ name: nameInput })
    setEditingName(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset all your progress and start fresh? This cannot be undone.')) {
      resetUser()
      navigate('landing')
    }
  }

  const menuItems = [
    { icon: BookOpen, label: 'Election Timeline', screen: 'timeline' as const, color: 'text-purple-600' },
    { icon: BookOpen, label: 'Election Glossary', screen: 'glossary' as const, color: 'text-teal-600' },
    { icon: Users, label: 'Family Voting', screen: 'family' as const, color: 'text-purple-600' },
    { icon: BarChart2, label: 'Community Insights', screen: 'community' as const, color: 'text-indigo-600' },
    { icon: Shield, label: 'Trust Shield', screen: 'verify-news' as const, color: 'text-red-600' },
    { icon: Scale, label: 'Know Candidates', screen: 'candidates' as const, color: 'text-blue-600' },
    { icon: AlertOctagon, label: 'Report Violation', screen: 'report-violation' as const, color: 'text-red-700' },
    { icon: Accessibility, label: 'Accessibility', screen: 'accessibility' as const, color: 'text-sky-600' },
    { icon: HelpCircle, label: '1-Min Quick Guide', screen: 'quick' as const, color: 'text-amber-600' },
  ]

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 pb-4">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 btn-gradient rounded-b-3xl shadow-lg relative mb-6">
        <button
          onClick={goBack}
          className="text-white/80 hover:text-white mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl shadow-sm">
            {user.voterType === 'first-time' ? '🌟' : '🗳️'}
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-slate-800 text-sm font-inter border border-slate-300 focus:outline-none focus:border-slate-500 bg-white"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-inter font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-left group"
              >
                <p className="text-white font-poppins font-semibold text-xl leading-tight group-hover:text-white/80 transition-colors">
                  {user.name || 'Set your name'}
                </p>
                <p className="text-white/60 text-xs font-inter mt-1 font-medium">Tap to edit name</p>
              </button>
            )}
            <p className="text-white/80 text-xs font-inter mt-2 capitalize font-medium">
              {user.voterType?.replace('-', ' ') || 'Voter'} · {user.state || 'India'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {/* Sync check: v2 */}
            <ReadinessRing score={user.readinessScore} size={56} label="Readiness" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {/* Settings card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-4">
            Preferences
          </p>

          {/* Language */}
          <div className="flex items-center gap-3 py-3 border-b border-slate-50">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-inter text-slate-700 flex-1 font-medium">Language</span>
            <div className="flex gap-2">
              {(['en', 'hi', 'or'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateUser({ language: lang })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-inter font-semibold border transition-all ${
                    user.language === lang
                      ? 'btn-gradient shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ଓଡ଼ିଆ'}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Mode */}
          <div className="flex items-center gap-3 py-3 border-b border-slate-50">
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-inter text-slate-700 flex-1 font-medium">App Mode</span>
            <div className="flex gap-2">
              {(['chat', 'guided', 'quick'] as InteractionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateUser({ preferredMode: mode })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-inter font-semibold border capitalize transition-all ${
                    user.preferredMode === mode
                      ? 'btn-gradient shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="flex flex-col gap-2 py-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-inter text-slate-700 flex-1 font-medium">Your Region</span>
              {!editingState && (
                <>
                  <span className="text-sm font-inter text-slate-600 font-medium">{user.state || 'Not set'}</span>
                  <button
                    onClick={() => setEditingState(true)}
                    className="text-xs text-slate-900 font-inter font-bold ml-3 bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200 transition-colors"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            
            {editingState && (
              <div className="mt-2 pl-7 flex flex-col gap-2">
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-inter text-slate-700 focus:outline-none focus:border-slate-400"
                  value={user.state || ''}
                  onChange={(e) => {
                    updateUser({ state: e.target.value })
                    setEditingState(false)
                  }}
                >
                  <option value="" disabled>Select your state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button 
                  onClick={() => setEditingState(false)}
                  className="text-xs text-slate-500 self-end hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <p className="text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest px-5 pt-5 mb-3">
            Resources
          </p>
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <div className={`p-2 rounded-lg bg-slate-50 ${item.color.replace('text', 'bg').replace('600', '100').replace('700', '100')}`}>
                  <Icon className={`w-4 h-4 ${item.color.replace('-600', '-700')}`} />
                </div>
                <span className="text-sm font-inter text-slate-700 flex-1 text-left font-medium">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            )
          })}
        </motion.div>

        {/* Important links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-2xl p-4 border border-blue-100"
        >
          <p className="text-xs font-poppins font-semibold text-blue-700 mb-3">
            🏛️ Official Resources
          </p>
          {[
            { label: 'voters.eci.gov.in', desc: 'Register & check electoral roll', url: 'https://voters.eci.gov.in' },
            { label: 'eci.gov.in', desc: 'Election Commission of India', url: 'https://eci.gov.in' },
            { label: 'Helpline: 1950', desc: 'National Voter Helpline', url: 'tel:1950' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 border-b border-blue-100 last:border-0"
            >
              <div className="flex-1">
                <p className="text-xs font-poppins font-semibold text-blue-700">{link.label}</p>
                <p className="text-xs font-inter text-blue-500">{link.desc}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
            </a>
          ))}
        </motion.div>

        {/* Reset */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={handleReset}
          className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-rose-600 border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors font-inter text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Reset All Progress
        </motion.button>

        {/* Version */}
        <p className="text-center text-xs font-inter text-gray-400 pb-2">
          VoteMate AI v1.0 · Made with ❤️ for Indian voters
        </p>
      </div>
    </div>
  )
}
