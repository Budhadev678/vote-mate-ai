import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, ArrowLeft, HelpCircle, Zap, RotateCcw, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { askAI, getFallbackResponse } from '../services/aiService'
import { TypingIndicator } from '../components/TypingIndicator'
import { KnowledgeCard, QUICK_CARDS } from '../components/KnowledgeCard'
import type { ChatMessage, KnowledgeCard as KCard } from '../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { InfoButton } from '../components/InfoButton'

// ─── Quick suggestion chips ────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  'How to register to vote?',
  'What ID do I need?',
  'How to find my booth?',
  'How does EVM work?',
  'What is VVPAT?',
  'What happens on polling day?',
]

function genId() {
  return Math.random().toString(36).slice(2)
}

// ─── Pick relevant knowledge cards for a response ─────────────────
function pickCards(content: string): KCard[] | undefined {
  const lower = content.toLowerCase()
  const cards: KCard[] = []
  if (lower.includes('document') || lower.includes('id') || lower.includes('proof'))
    cards.push(QUICK_CARDS[0])
  if (lower.includes('step') || lower.includes('process') || lower.includes('how to vote'))
    cards.push(QUICK_CARDS[1])
  if (lower.includes('date') || lower.includes('when') || lower.includes('time'))
    cards.push(QUICK_CARDS[2])
  if (lower.includes('booth') || lower.includes('where') || lower.includes('location'))
    cards.push(QUICK_CARDS[3])
  return cards.length > 0 ? cards.slice(0, 2) : undefined
}

export function ChatScreen() {
  const { messages, addMessage, isAiTyping, setAiTyping, clearChat, navigate, goBack,
    confusionMode, setConfusionMode, getContext, user } = useStore()
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(messages.length === 0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiTyping])

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: user.language === 'hi'
          ? `नमस्ते! 👋 मैं VoteMate AI हूँ। ${user.voterType === 'first-time' ? 'पहली बार मतदान करना थोड़ा भ्रमित करने वाला हो सकता है — मैं यहाँ मदद करने के लिए हूँ!' : 'मैं आपकी चुनाव संबंधी किसी भी सवाल में मदद कर सकता हूँ!'}\n\n**Next Action:** कोई भी सवाल पूछें!`
          : `Hi${user.name ? `, ${user.name}` : ''}! 👋 I'm VoteMate AI — your personal election companion.\n\n${confusionMode ? "No worries — I'll keep things **super simple** for you! 😊\n\n" : ''}${user.voterType === 'first-time' ? 'Voting for the first time can feel overwhelming — I\'m here to make it easy!' : 'Great to see you! Ask me anything about voting in India.'}\n\n**Next Action:** Pick a topic below or type your question!`,
        timestamp: Date.now(),
        nextAction: 'Ask a question or pick a suggestion below',
      }
      addMessage(greeting)
    }
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    setShowSuggestions(false)

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setAiTyping(true)

    try {
      const ctx = getContext()
      const { content, nextAction } = await askAI(text, ctx, confusionMode)
      const cards = pickCards(content)

      const aiMsg: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content,
        timestamp: Date.now(),
        nextAction,
        cards,
      }
      addMessage(aiMsg)
    } catch {
      addMessage({
        id: genId(),
        role: 'assistant',
        content: getFallbackResponse(user.language),
        timestamp: Date.now(),
        nextAction: 'Try again or rephrase your question',
      })
    } finally {
      setAiTyping(false)
    }
  }

  // ── Voice input ──────────────────────────────────────────────────
  const handleVoice = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = user.language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      sendMessage(transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.start()
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50 h-full overflow-hidden absolute inset-0">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shadow-sm relative"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2D5BE3 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
          🤖
        </div>
        <div className="flex-1 flex items-center gap-2">
          <div>
            <p className="text-white font-poppins font-bold text-sm">VoteMate AI</p>
            <p className="text-blue-200 text-xs font-inter">
              {isAiTyping ? 'Thinking...' : 'Always here to help'}
            </p>
          </div>
          <InfoButton text="Speak or type to me! I'm fully context-aware and know your state and voting status. Use the 'Simplify' button if answers are too complex." />
        </div>
        <div className="flex gap-2">
          {/* Confusion mode toggle */}
          <button
            onClick={() => setConfusionMode(!confusionMode)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-inter font-medium transition-colors ${
              confusionMode ? 'bg-amber-400 text-amber-900' : 'bg-white/20 text-white'
            }`}
            title="Confusion mode — simpler answers"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {confusionMode ? 'Simple' : 'Simplify?'}
          </button>
          <button
            onClick={clearChat}
            className="text-white/60 hover:text-white transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-2.5 px-2 py-1 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm font-inter leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'ai-bubble rounded-tl-sm'
                      : 'user-bubble rounded-tr-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        strong: ({ children }) => (
                          <strong className="font-semibold text-blue-800">{children}</strong>
                        ),
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5">{children}</ul>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>

                {/* Next Action badge */}
                {msg.role === 'assistant' && msg.nextAction && !msg.nextAction.includes('Ask') && (
                  <div className="flex items-center gap-1.5 bg-blue-700 text-white text-xs px-3 py-1.5 rounded-xl font-inter">
                    <ChevronRight className="w-3 h-3" />
                    <span><span className="font-semibold">Next: </span>{msg.nextAction}</span>
                  </div>
                )}

                {/* Knowledge cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {msg.cards.map((card) => (
                      <div key={card.title} className="flex-shrink-0">
                        <KnowledgeCard card={card} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAiTyping && <TypingIndicator />}

        {/* Suggestion chips */}
        {showSuggestions && messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-2 py-4 space-y-2"
          >
            <p className="text-xs font-inter text-gray-400 text-center">
              💡 Quick questions to get started:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="bg-white border border-blue-200 text-blue-700 text-xs font-inter px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 1-Min Quick Mode shortcut */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => navigate('quick')}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-inter font-medium hover:bg-amber-100 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          I only have 1 minute ⏱️ — show me essentials
        </button>
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2 safe-bottom">
        <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder={
              user.language === 'hi'
                ? 'यहाँ पूछें...'
                : confusionMode
                  ? 'Ask in simple words...'
                  : 'Ask anything about voting...'
            }
            className="flex-1 bg-transparent text-sm font-inter text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* Voice button */}
        <button
          onClick={handleVoice}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {isListening ? (
            <div className="flex gap-0.5 items-end h-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="voice-bar" style={{ height: `${4 + Math.random() * 16}px` }} />
              ))}
            </div>
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Send button */}
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isAiTyping}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)' }}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
