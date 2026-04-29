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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #22C55E 100%)' }}
      >
        <button
          onClick={goBack}
          className="text-white/80 mb-4 flex items-center gap-1 text-sm font-inter"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">🧭 Guided Journey</h1>
        <p className="text-green-100 text-sm font-inter mt-1">Complete each step to be fully ready</p>
        <div className="mt-3 bg-white/20 rounded-xl px-3 py-2 inline-flex items-center gap-2">
          <span className="text-white font-poppins font-bold">{user.readinessScore}%</span>
          <span className="text-green-100 text-xs font-inter">ready</span>
          <div className="w-20 h-1.5 bg-white/30 rounded-full ml-1">
            <motion.div
              className="h-1.5 bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${user.readinessScore}%` }}
              transition={{ duration: 0.8 }}
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
              className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-colors ${
                isDone
                  ? 'border-green-200'
                  : isCurrent
                    ? 'border-blue-300'
                    : isLocked
                      ? 'border-gray-100 opacity-60'
                      : 'border-gray-200'
              }`}
            >
              {/* Step header */}
              <button
                onClick={() => !isLocked && setExpanded(isOpen ? null : step.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
                disabled={isLocked}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    isDone
                      ? 'bg-green-100'
                      : isCurrent
                        ? 'bg-blue-100 ring-2 ring-blue-300'
                        : 'bg-gray-100'
                  }`}
                >
                  {isDone ? '✅' : isLocked ? '🔒' : step.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-poppins font-semibold text-gray-800">
                      Step {idx + 1}: {step.title}
                    </span>
                    {isDone && (
                      <span className="badge-ready text-xs px-2 py-0.5 rounded-full font-inter">
                        Done ✓
                      </span>
                    )}
                    {isCurrent && !isDone && (
                      <span className="badge-partial text-xs px-2 py-0.5 rounded-full font-inter">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-inter text-gray-500 mt-0.5">{step.description}</p>
                </div>

                {!isLocked ? (
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  />
                ) : (
                  <Lock className="w-4 h-4 text-gray-300" />
                )}
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                      {/* Tasks */}
                      <div className="space-y-2">
                        {step.tasks.map((task, ti) => (
                          <div
                            key={ti}
                            className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <CheckCircle2
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                isDone ? 'text-green-500' : 'text-gray-300'
                              }`}
                            />
                            <div>
                              <p className="text-xs font-inter font-medium text-gray-800">
                                {task.label}
                              </p>
                              <p className="text-xs font-inter text-gray-500">{task.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tip */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        <p className="text-xs font-inter text-amber-800">{step.tip}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!isDone && (
                          <button
                            onClick={() => handleComplete(step.id)}
                            disabled={completingStep === step.id}
                            className="flex-1 py-2.5 rounded-xl text-white text-sm font-poppins font-semibold transition-all flex items-center justify-center gap-2"
                            style={{
                              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                            }}
                          >
                            {completingStep === step.id ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                />
                                Marking...
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
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-blue-200 text-blue-700 text-sm font-inter font-medium hover:bg-blue-50 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
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
