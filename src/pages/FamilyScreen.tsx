import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Users, HelpCircle, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { FamilyMember, MemberStatus } from '../types'

function statusConfig(status: MemberStatus) {
  return {
    ready: { label: 'Verified', color: 'bg-slate-900 text-white', border: 'border-slate-900' },
    partial: { label: 'In Progress', color: 'bg-slate-100 text-slate-500', border: 'border-slate-200' },
    'not-ready': { label: 'Action Required', color: 'bg-slate-50 text-slate-400', border: 'border-slate-100' },
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
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-slate-900">Family Readiness</h1>
            <p className="text-slate-500 text-xs font-inter mt-1 font-medium">Manage and track your family's voting status</p>
          </div>
        </div>
        
        {familyMembers.length > 0 && (
          <div className="mt-6 flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
            <div className="flex -space-x-2">
              {familyMembers.slice(0, 3).map((m, i) => (
                <div key={m.id} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs shadow-sm">
                  {m.ageGroup === 'youth' ? '👦' : m.ageGroup === 'senior' ? '👴' : '👤'}
                </div>
              ))}
              {familyMembers.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  +{familyMembers.length - 3}
                </div>
              )}
            </div>
            <p className="text-xs font-inter text-slate-600 font-semibold">
              {readyCount} of {familyMembers.length} members verified
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Empty state */}
        {familyMembers.length === 0 && !showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-poppins font-semibold text-slate-900">No members added</p>
            <p className="text-xs font-inter text-slate-400 mt-1 px-10 leading-relaxed">
              Add your family members to ensure everyone is registered and ready for election day.
            </p>
          </motion.div>
        )}

        {/* Family member cards */}
        <AnimatePresence mode="popLayout">
          {familyMembers.map((member, i) => {
            const cfg = statusConfig(member.status)
            return (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                  member.status === 'ready' ? 'border-slate-900 ring-1 ring-slate-900/5' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                    member.status === 'ready' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100'
                  }`}>
                    {member.ageGroup === 'youth' ? '👦' : member.ageGroup === 'senior' ? '👴' : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[15px] font-poppins font-semibold text-slate-900 truncate">{member.name}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-lg font-inter font-bold uppercase tracking-widest border ${cfg.color} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="h-full bg-slate-900"
                          initial={{ width: 0 }}
                          animate={{ width: `${member.readinessScore}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[10px] font-poppins font-bold text-slate-400">{member.readinessScore}%</span>
                    </div>

                    {member.missingStep && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <p className="text-[11px] font-inter text-slate-500 font-medium leading-none">
                          Missing: <span className="text-slate-900 font-bold">{member.missingStep}</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {member.status !== 'ready' && (
                      <button
                        onClick={() => navigate('guided')}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border border-slate-900 shadow-xl p-6 overflow-hidden"
            >
              <p className="text-sm font-poppins font-bold text-slate-900 mb-4">New Family Member</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-inter focus:outline-none focus:border-slate-900 transition-all bg-slate-50 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-inter font-bold text-slate-400 uppercase tracking-widest mb-2">Voter Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['youth', 'adult', 'senior'] as const).map((ag) => (
                      <button
                        key={ag}
                        onClick={() => setForm((f) => ({ ...f, ageGroup: ag }))}
                        className={`py-3 rounded-xl text-xs font-inter font-bold border transition-all ${
                          form.ageGroup === ag
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {ag === 'youth' ? 'Youth' : ag === 'adult' ? 'Adult' : 'Senior'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-4 rounded-xl text-white text-sm font-poppins font-semibold bg-slate-900 shadow-lg active:scale-[0.98] transition-all"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-4 rounded-xl border border-slate-200 text-slate-500 text-sm font-inter font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-5 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 text-slate-400 font-poppins font-semibold text-sm hover:border-slate-400 hover:text-slate-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Family Member
          </button>
        )}

        {/* Community insight link */}
        <button
          onClick={() => navigate('community')}
          className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-inter font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
        >
          View Community Progress
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
