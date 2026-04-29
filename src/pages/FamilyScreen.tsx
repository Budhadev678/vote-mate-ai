import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, MessageCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { FamilyMember, MemberStatus } from '../types'

function statusConfig(status: MemberStatus) {
  return {
    ready: { label: 'Ready ✅', bg: 'bg-green-50', border: 'border-green-200', badge: 'badge-ready' },
    partial: { label: 'Partial ⚠️', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'badge-partial' },
    'not-ready': { label: 'Not Ready ❗', bg: 'bg-red-50', border: 'border-red-200', badge: 'badge-notready' },
  }[status]
}

function calcStatus(score: number): MemberStatus {
  if (score >= 75) return 'ready'
  if (score >= 40) return 'partial'
  return 'not-ready'
}

export function FamilyScreen() {
  const { goBack, familyMembers, addFamilyMember, removeFamilyMember, navigate } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', ageGroup: 'adult' as 'youth' | 'adult' | 'senior' })

  const handleAdd = () => {
    if (!form.name.trim()) return
    const score = Math.floor(Math.random() * 80) // simulated
    const member: FamilyMember = {
      id: Math.random().toString(36).slice(2),
      name: form.name,
      ageGroup: form.ageGroup,
      readinessScore: score,
      status: calcStatus(score),
      missingStep: score < 75 ? (score < 40 ? 'Registration' : 'Documents') : undefined,
    }
    addFamilyMember(member)
    setForm({ name: '', ageGroup: 'adult' })
    setShowForm(false)
  }

  const readyCount = familyMembers.filter((m) => m.status === 'ready').length

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">👨‍👩‍👧 Family Voting</h1>
        <p className="text-purple-200 text-sm font-inter mt-1">
          Track readiness for your family members
        </p>
        {familyMembers.length > 0 && (
          <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 inline-flex items-center gap-2">
            <span className="text-white font-poppins font-bold">{readyCount}/{familyMembers.length}</span>
            <span className="text-purple-100 text-xs font-inter">members ready</span>
          </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Empty state */}
        {familyMembers.length === 0 && !showForm && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👨‍👩‍👧</div>
            <p className="font-poppins font-semibold text-gray-700">No family members yet</p>
            <p className="text-sm font-inter text-gray-500 mt-1">
              Add family members to track their voting readiness
            </p>
          </div>
        )}

        {/* Family member cards */}
        <AnimatePresence>
          {familyMembers.map((member, i) => {
            const cfg = statusConfig(member.status)
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-white rounded-2xl border-2 ${cfg.border} p-4 shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                    {member.ageGroup === 'youth' ? '👦' : member.ageGroup === 'senior' ? '👴' : '👤'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-poppins font-semibold text-gray-800">{member.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-inter ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <motion.div
                          className="h-1.5 rounded-full"
                          style={{
                            background: member.status === 'ready' ? '#22C55E' : member.status === 'partial' ? '#F59E0B' : '#EF4444',
                            width: `${member.readinessScore}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${member.readinessScore}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <span className="text-xs font-inter text-gray-500">{member.readinessScore}%</span>
                    </div>
                    {member.missingStep && (
                      <p className="text-xs font-inter text-red-500 mt-1">
                        Needs: {member.missingStep}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {member.status !== 'ready' && (
                      <button
                        onClick={() => navigate('guided')}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-inter font-medium"
                      >
                        Help
                      </button>
                    )}
                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      className="text-xs bg-red-50 text-red-500 p-1 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add member form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl border-2 border-purple-200 p-4 shadow-sm overflow-hidden"
            >
              <p className="text-sm font-poppins font-semibold text-gray-700 mb-3">Add Family Member</p>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-inter mb-3 focus:outline-none focus:border-purple-400"
              />
              <div className="flex gap-2 mb-4">
                {(['youth', 'adult', 'senior'] as const).map((ag) => (
                  <button
                    key={ag}
                    onClick={() => setForm((f) => ({ ...f, ageGroup: ag }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-inter font-medium border-2 transition-all ${
                      form.ageGroup === ag
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {ag === 'youth' ? '👦 Youth' : ag === 'adult' ? '👤 Adult' : '👴 Senior'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-poppins font-semibold"
                  style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
                >
                  Add Member
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-inter"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-purple-300 flex items-center justify-center gap-2 text-purple-600 font-poppins font-semibold text-sm hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Family Member
          </button>
        )}

        {/* Community link */}
        <button
          onClick={() => navigate('community')}
          className="w-full py-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 text-sm font-inter font-medium flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          View Community Progress →
        </button>
      </div>
    </div>
  )
}
