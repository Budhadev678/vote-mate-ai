import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { VoterType, InteractionMode } from '../types'

// ─── Indian states list ───────────────────────────────────────────
const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal',
]

interface OnboardingStep {
  key: string
  aiMessage: string
  type: 'choice' | 'dropdown' | 'mode'
}

const STEPS: OnboardingStep[] = [
  {
    key: 'voterType',
    aiMessage: 'Are you voting for the first time? 🗳️',
    type: 'choice',
  },
  {
    key: 'state',
    aiMessage: 'Which state are you from? 📍',
    type: 'dropdown',
  },
  {
    key: 'preferredMode',
    aiMessage: 'How do you prefer to get help? 🧠',
    type: 'mode',
  },
]

export function OnboardingScreen() {
  const { onboardingStep, setOnboardingStep, updateUser, finishOnboarding, user } = useStore()
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [stateInput, setStateInput] = useState('')
  const [filteredStates, setFilteredStates] = useState<string[]>([])

  const step = STEPS[onboardingStep]
  const totalSteps = STEPS.length

  const handleSelect = (key: string, value: string) => {
    const newSelections = { ...selections, [key]: value }
    setSelections(newSelections)

    // Update store
    if (key === 'voterType') updateUser({ voterType: value as VoterType })
    if (key === 'state') updateUser({ state: value })
    if (key === 'preferredMode') updateUser({ preferredMode: value as InteractionMode })

    // Advance step after short delay
    setTimeout(() => {
      if (onboardingStep < totalSteps - 1) {
        setOnboardingStep(onboardingStep + 1)
      } else {
        finishOnboarding()
      }
    }, 500)
  }

  const handleStateFilter = (val: string) => {
    setStateInput(val)
    setFilteredStates(
      val.length > 0 ? STATES.filter((s) => s.toLowerCase().includes(val.toLowerCase())) : [],
    )
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onboardingStep > 0 && setOnboardingStep(onboardingStep - 1)}
          className={`text-sm font-inter text-gray-400 ${onboardingStep === 0 ? 'invisible' : ''}`}
        >
          ← Back
        </button>
        <span className="text-sm font-inter text-gray-500">
          Step {onboardingStep + 1} of {totalSteps}
        </span>
      </div>

      {/* Step progress dots */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= onboardingStep ? 'bg-blue-700' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* AI Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={onboardingStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 flex-1"
        >
          {/* AI bubble */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl flex-shrink-0 shadow-lg">
              🤖
            </div>
            <div className="ai-bubble rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
              <p className="text-sm font-inter text-gray-800">{step.aiMessage}</p>
            </div>
          </div>

          {/* Voter type choice */}
          {step.type === 'choice' && (
            <div className="flex gap-3 mt-4 pl-13">
              {[
                { label: '✋ Yes, first time!', value: 'first-time', color: 'blue' },
                { label: '🔁 No, voted before', value: 'experienced', color: 'green' },
              ].map((opt) => (
                <ChoiceButton
                  key={opt.value}
                  label={opt.label}
                  selected={selections['voterType'] === opt.value}
                  onClick={() => handleSelect('voterType', opt.value)}
                  color={opt.color}
                />
              ))}
            </div>
          )}

          {/* State dropdown */}
          {step.type === 'dropdown' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search your state..."
                value={stateInput}
                onChange={(e) => handleStateFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-inter focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
              />
              {filteredStates.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                  {filteredStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => {
                        setStateInput(state)
                        setFilteredStates([])
                        handleSelect('state', state)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-inter text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between"
                    >
                      {state}
                      {selections['state'] === state && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
              {selections['state'] && (
                <div className="flex items-center gap-2 text-sm font-inter text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Selected: {selections['state']}</span>
                </div>
              )}
              {/* Popular states quick select */}
              {!stateInput && (
                <div className="flex flex-wrap gap-2">
                  {['Maharashtra', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Tamil Nadu'].map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => handleSelect('state', s)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-inter text-gray-600 hover:border-blue-400 hover:text-blue-700 transition-colors shadow-sm"
                      >
                        {s}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode selection */}
          {step.type === 'mode' && (
            <div className="space-y-3">
              {[
                {
                  value: 'chat',
                  icon: '💬',
                  title: 'Chat Mode',
                  desc: 'Ask me anything naturally',
                  color: 'blue',
                },
                {
                  value: 'guided',
                  icon: '🧭',
                  title: 'Guided Mode',
                  desc: 'Step-by-step structured flow',
                  color: 'green',
                },
                {
                  value: 'quick',
                  icon: '⚡',
                  title: 'Quick Mode',
                  desc: 'Essentials only, fast & simple',
                  color: 'amber',
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect('preferredMode', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white transition-all active:scale-98 ${
                    selections['preferredMode'] === opt.value
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-poppins font-semibold text-gray-800">
                      {opt.title}
                    </div>
                    <div className="text-xs font-inter text-gray-500">{opt.desc}</div>
                  </div>
                  {selections['preferredMode'] === opt.value && (
                    <Check className="w-5 h-5 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next hint */}
      <p className="text-center text-xs font-inter text-gray-400 mt-6">
        {onboardingStep < totalSteps - 1
          ? 'Tap an option to continue →'
          : 'Almost done! Choose your style to begin.'}
      </p>
    </div>
  )
}

function ChoiceButton({
  label,
  selected,
  onClick,
  color,
}: {
  label: string
  selected: boolean
  onClick: () => void
  color: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`flex-1 py-3 px-3 rounded-2xl border-2 text-sm font-poppins font-semibold transition-all ${
        selected
          ? color === 'blue'
            ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
            : 'bg-green-500 border-green-500 text-white shadow-lg'
          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
      }`}
    >
      {label}
    </motion.button>
  )
}
