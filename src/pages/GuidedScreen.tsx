import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Lock, ChevronRight, MessageCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { StepId } from '../types'

interface GuidedStepDef {
  id: StepId
  title: string
  icon: string
  description: string
  tasks: { label: string; detail: string }[]
  tip: string
  link?: string
}

const GUIDED_STEPS: GuidedStepDef[] = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📋',
    description: 'Get yourself registered as a voter — this is the foundation.',
    tasks: [
      { label: 'Visit voters.eci.gov.in', detail: 'Open the official Election Commission website' },
      { label: 'Fill Form 6', detail: 'For first-time registration or new constituency' },
      { label: 'Upload documents', detail: 'Aadhaar, photo, address proof' },
      { label: 'Track application status', detail: 'Use reference number to track online' },
    ],
    tip: '💡 Tip: Registration must be done at least 30 days before election date.',
    link: 'https://voters.eci.gov.in',
  },
  {
    id: 'verification',
    title: 'Verify Your Details',
    icon: '✅',
    description: 'Make sure your name and details are correct on the electoral roll.',
    tasks: [
      { label: 'Search electoral roll', detail: 'Visit electoralsearch.eci.gov.in' },
      { label: 'Check name spelling', detail: 'Verify your name matches your ID' },
      { label: 'Confirm address', detail: 'Ensure address matches your constituency' },
      { label: 'Note your EPIC number', detail: 'Save it for quick future access' },
    ],
    tip: '💡 Tip: Your EPIC (Voter ID) number starts with letters followed by 7 digits.',
    link: 'https://electoralsearch.eci.gov.in',
  },
  {
    id: 'documents',
    title: 'Prepare Documents',
    icon: '🧾',
    description: 'Get your valid photo ID ready for polling day.',
    tasks: [
      { label: 'Voter ID card (EPIC)', detail: 'Primary document — always accepted' },
      { label: 'OR carry Aadhaar card', detail: 'Valid alternative to Voter ID' },
      { label: 'Keep digital copy', detail: 'Download mVoter or DigiLocker app' },
      { label: 'Check expiry dates', detail: 'Ensure documents are valid' },
    ],
    tip: '💡 Tip: Aadhaar card is accepted as valid ID at booths even without Voter ID.',
  },
  {
    id: 'voting',
    title: 'Voting Day',
    icon: '🗳️',
    description: 'Everything you need to do on the big day.',
    tasks: [
      { label: 'Arrive at booth by 8 AM', detail: 'Avoid afternoon rush (12–2 PM high crowd)' },
      { label: 'Carry valid photo ID', detail: 'Any government-issued photo ID' },
      { label: 'Join the queue calmly', detail: 'Separate queues for men and women' },
      { label: 'Cast vote & verify VVPAT', detail: 'Check the 7-second VVPAT display' },
    ],
    tip: "💡 Tip: Don't forget — you CAN vote even if you lost your Voter ID card!",
  },
]

export function GuidedScreen() {
  const { user, navigate, goBack, completeStep } = useStore()
  const [expanded, setExpanded] = useState<StepId | null>(user.currentStep || 'registration')
  const [completingStep, setCompletingStep] = useState<StepId | null>(null)

  const handleComplete = (stepId: StepId) => {
    setCompletingStep(stepId)
    setTimeout(() => {
      completeStep(stepId)
      setCompletingStep(null)
      const order: StepId[] = ['registration', 'verification', 'documents', 'voting']
      const next = order[order.indexOf(stepId) + 1]
      if (next) setExpanded(next)
    }, 800)
  }

  return (
    <div className="min-h-full bg-slate-50 pb-40">
      {/* Header */}
      <div className="px-5 pt-8 pb-6 bg-white border-b border-slate-200">
        <button
          onClick={goBack}
          className="text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1.5 text-sm font-inter transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-poppins font-semibold text-slate-900">🧭 Guided Journey</h1>
        <p className="text-slate-500 text-sm font-inter mt-1.5">Complete each step to be fully ready</p>
        
        <div className="mt-4 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 flex items-center gap-3">
          <span className="text-slate-900 font-poppins font-semibold">{user.readinessScore}%</span>
          <span className="text-slate-500 text-xs font-inter uppercase tracking-wider">ready</span>
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-slate-900"
              initial={{ width: 0 }}
              animate={{ width: `${user.readinessScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 py-4 space-y-3">
        {GUIDED_STEPS.map((step, idx) => {
          const isDone = user.stepsCompleted.includes(step.id)
          const isCurrent = user.currentStep === step.id && !isDone
          const isLocked =
            !isDone &&
            !isCurrent &&
            idx > 0 &&
            !user.stepsCompleted.includes(GUIDED_STEPS[idx - 1].id)
          const isOpen = expanded === step.id && !isLocked

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
                isDone
                  ? 'border-emerald-200'
                  : isCurrent
                    ? 'border-slate-300 shadow-md ring-1 ring-slate-200/50'
                    : isLocked
                      ? 'border-slate-100 opacity-60'
                      : 'border-slate-200'
              }`}
            >
              {/* Step header */}
              <button
                onClick={() => !isLocked && setExpanded(isOpen ? null : step.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                disabled={isLocked}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : isCurrent
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : isLocked ? '🔒' : step.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-poppins font-medium ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                      Step {idx + 1}: {step.title}
                    </span>
                    {isDone && (
                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-md font-inter font-medium uppercase tracking-wider">
                        Done
                      </span>
                    )}
                    {isCurrent && !isDone && (
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-0.5 rounded-md font-inter font-medium uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-inter text-slate-500 mt-1">{step.description}</p>
                </div>

                {!isLocked ? (
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                ) : (
                  <Lock className="w-4 h-4 text-slate-300" />
                )}
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
                      {/* Tasks */}
                      <div className="space-y-2">
                        {step.tasks.map((task, ti) => (
                          <div
                            key={ti}
                            className="flex items-start gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                isDone ? 'text-emerald-500' : 'text-slate-300'
                              }`}
                            />
                            <div>
                              <p className="text-xs font-inter font-medium text-slate-800">
                                {task.label}
                              </p>
                              <p className="text-xs font-inter text-slate-500 mt-0.5">{task.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tip */}
                      <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 flex items-start gap-2">
                        <span className="text-amber-500 text-sm mt-0.5">💡</span>
                        <p className="text-xs font-inter text-amber-800 font-medium leading-relaxed">{step.tip.replace('💡 Tip: ', '')}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        {!isDone && (
                          <button
                            onClick={() => handleComplete(step.id)}
                            disabled={completingStep === step.id}
                            className="flex-1 py-3 rounded-lg text-white text-sm font-poppins font-medium transition-all flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70"
                          >
                            {completingStep === step.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Mark Complete
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => navigate('chat')}
                          className="flex items-center gap-1.5 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-inter font-medium hover:bg-slate-50 transition-colors active:scale-[0.98]"
                        >
                          <MessageCircle className="w-4 h-4 text-slate-400" />
                          Ask AI
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
