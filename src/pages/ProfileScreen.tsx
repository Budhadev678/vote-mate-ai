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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
        <button
          onClick={goBack}
          className="text-white/80 mb-4 flex items-center gap-1 text-sm font-inter"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-lg">
            {user.voterType === 'first-time' ? '🌟' : '🗳️'}
          </div>
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-lg text-gray-800 text-sm font-inter focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="text-xs bg-white/30 text-white px-2 py-1 rounded-lg font-inter"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-left"
              >
                <p className="text-white font-poppins font-bold text-lg leading-tight">
                  {user.name || 'Set your name'}
                </p>
                <p className="text-blue-200 text-xs font-inter">Tap to edit</p>
              </button>
            )}
            <p className="text-blue-200 text-xs font-inter mt-1 capitalize">
              {user.voterType?.replace('-', ' ') || 'Voter'} · {user.state || 'India'}
            </p>
          </div>
          <ReadinessRing score={user.readinessScore} size={64} />
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Settings card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs font-poppins font-semibold text-gray-400 uppercase tracking-wide mb-3">
            ⚙️ Preferences
          </p>

          {/* Language */}
          <div className="flex items-center gap-3 py-2.5 border-b border-gray-50">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-inter text-gray-700 flex-1">Language</span>
            <div className="flex gap-1">
              {(['en', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateUser({ language: lang })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-inter font-medium border transition-colors ${
                    user.language === lang
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'हिंदी'}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Mode */}
          <div className="flex items-center gap-3 py-2.5 border-b border-gray-50">
            <Settings className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-inter text-gray-700 flex-1">Mode</span>
            <div className="flex gap-1">
              {(['chat', 'guided', 'quick'] as InteractionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateUser({ preferredMode: mode })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-inter font-medium border capitalize transition-colors ${
                    user.preferredMode === mode
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="flex items-center gap-3 py-2.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-inter text-gray-700 flex-1">State</span>
            <span className="text-sm font-inter text-gray-500">{user.state || 'Not set'}</span>
            <button
              onClick={() => navigate('onboarding')}
              className="text-xs text-blue-600 font-inter ml-2"
            >
              Change →
            </button>
          </div>
        </motion.div>

        {/* Menu items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <p className="text-xs font-poppins font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4 mb-2">
            🔗 Quick Links
          </p>
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  i < menuItems.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-inter text-gray-700 flex-1 text-left">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
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
          transition={{ delay: 0.3 }}
          onClick={handleReset}
          className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors font-inter text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Reset All Progress & Restart
        </motion.button>

        {/* Version */}
        <p className="text-center text-xs font-inter text-gray-400 pb-2">
          VoteMate AI v1.0 · Made with ❤️ for Indian voters
        </p>
      </div>
    </div>
  )
}
