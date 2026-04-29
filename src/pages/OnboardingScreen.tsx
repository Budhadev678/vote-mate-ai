import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { useStore } from '../store/useStore'

import { InfoButton } from '../components/InfoButton'

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
    key: 'language',
    aiMessage: 'Please select your preferred language 🌍',
    type: 'choice',
  },
  {
    key: 'registered',
    aiMessage: 'Are you already registered to vote? 📋',
    type: 'choice',
  },
  {
    key: 'hasDocument',
    aiMessage: 'Do you have a valid photo ID (like Aadhaar)? 🧾',
    type: 'choice',
  },
]

export function OnboardingScreen() {
  const { onboardingStep, setOnboardingStep, updateUser, finishOnboarding } = useStore()
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [stateInput, setStateInput] = useState('')
  const [filteredStates, setFilteredStates] = useState<string[]>([])

  const step = STEPS[onboardingStep]
  const totalSteps = STEPS.length

  const handleSelect = (key: string, value: string) => {
    const newSelections = { ...selections, [key]: value }
    setSelections(newSelections)

    // Update store
    if (key === 'language') updateUser({ language: value as 'en' | 'hi' | 'or' })
    if (key === 'registered' && value === 'yes') {
      useStore.getState().completeStep('registration')
    }
    if (key === 'hasDocument' && value === 'yes') {
      updateUser({ hasValidDocument: true })
    }

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
    <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 px-6 py-10 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => onboardingStep > 0 && setOnboardingStep(onboardingStep - 1)}
          className={`text-sm font-inter font-medium text-slate-500 hover:text-slate-900 transition-colors ${onboardingStep === 0 ? 'invisible' : ''}`}
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-inter text-slate-400 font-medium">
            Step {onboardingStep + 1} of {totalSteps}
          </span>
          <InfoButton text="We need these details to personalize your experience. Your data never leaves your device and is only used to compute your readiness score locally!" />
        </div>
      </div>

      {/* Step progress dots */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-700 ${
              i <= onboardingStep ? 'bg-slate-900' : 'bg-slate-200'
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
          className="space-y-8 flex-1"
        >
          {/* AI bubble */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
              🤖
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 max-w-xs shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
              <p className="text-sm font-inter text-slate-700 font-medium leading-relaxed">{step.aiMessage}</p>
            </div>
          </div>

          {step.key === 'language' && (
            <div className="flex flex-col gap-3 mt-2 pl-13">
              {[
                { label: 'English', value: 'en', emoji: '🔤' },
                { label: 'हिंदी (Hindi)', value: 'hi', emoji: 'अ' },
                { label: 'ଓଡ଼ିଆ (Odia)', value: 'or', emoji: 'ଓ' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect('language', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    selections['language'] === opt.value
                      ? 'btn-gradient text-white shadow-lg border-transparent'
                      : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-sm font-poppins font-medium">{opt.label}</span>
                  {selections['language'] === opt.value && <Check className="w-4 h-4 text-white ml-auto" />}
                </button>
              ))}
            </div>
          )}

          {step.key === 'registered' && (
            <div className="flex flex-col gap-3 mt-2 pl-13">
              {[
                { label: 'Yes', value: 'yes', emoji: '✅' },
                { label: 'No', value: 'no', emoji: '❌' },
                { label: 'Not Sure', value: 'not-sure', emoji: '🤔' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect('registered', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    selections['registered'] === opt.value
                      ? 'btn-gradient text-white shadow-lg border-transparent'
                      : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-sm font-poppins font-medium">{opt.label}</span>
                  {selections['registered'] === opt.value && <Check className="w-4 h-4 text-white ml-auto" />}
                </button>
              ))}
            </div>
          )}

          {step.key === 'hasDocument' && (
            <div className="flex flex-col gap-3 mt-2 pl-13">
              {[
                { label: 'Yes', value: 'yes', emoji: '✅' },
                { label: 'No', value: 'no', emoji: '❌' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect('hasDocument', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    selections['hasDocument'] === opt.value
                      ? 'btn-gradient text-white shadow-lg border-transparent'
                      : 'bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="text-sm font-poppins font-medium">{opt.label}</span>
                  {selections['hasDocument'] === opt.value && <Check className="w-4 h-4 text-white ml-auto" />}
                </button>
              ))}
            </div>
          )}

          {/* State dropdown */}
          {step.type === 'dropdown' && (
            <div className="space-y-4 pl-13">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search state..."
                  value={stateInput}
                  onChange={(e) => handleStateFilter(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-inter focus:outline-none focus:border-slate-400 shadow-sm transition-all"
                />
              </div>
              {filteredStates.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                  {filteredStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => {
                        setStateInput(state)
                        setFilteredStates([])
                        handleSelect('state', state)
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-inter text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                    >
                      {state}
                      {selections['state'] === state && <Check className="w-4 h-4 text-slate-900" />}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Popular states quick select */}
              {!stateInput && (
                <div className="space-y-2">
                  <p className="text-[10px] font-inter font-semibold text-slate-400 uppercase tracking-widest">Popular States</p>
                  <div className="flex flex-wrap gap-2">
                    {['Maharashtra', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Tamil Nadu'].map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => handleSelect('state', s)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-inter font-medium text-slate-600 hover:border-slate-400 transition-colors shadow-sm"
                        >
                          {s}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode selection */}
          {step.type === 'mode' && (
            <div className="space-y-3 pl-13">
              {[
                {
                  value: 'chat',
                  icon: '💬',
                  title: 'Assistant Chat',
                  desc: 'Ask questions naturally',
                },
                {
                  value: 'guided',
                  icon: '🧭',
                  title: 'Guided Path',
                  desc: 'Step-by-step procedure',
                },
                {
                  value: 'quick',
                  icon: '⚡',
                  title: 'Quick Access',
                  desc: 'Essentials only, fast',
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect('preferredMode', opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    selections['preferredMode'] === opt.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="text-left flex-1">
                    <div className={`text-sm font-poppins font-medium ${selections['preferredMode'] === opt.value ? 'text-white' : 'text-slate-900'}`}>
                      {opt.title}
                    </div>
                    <div className={`text-xs font-inter ${selections['preferredMode'] === opt.value ? 'text-slate-300' : 'text-slate-500'}`}>
                      {opt.desc}
                    </div>
                  </div>
                  {selections['preferredMode'] === opt.value && (
                    <Check className="w-5 h-5 text-white" />
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

