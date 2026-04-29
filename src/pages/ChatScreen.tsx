import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, ArrowLeft, RotateCcw, ChevronRight, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import { askAI, getFallbackResponse } from '../services/aiService'
import { TypingIndicator } from '../components/TypingIndicator'
import { KnowledgeCard, QUICK_CARDS } from '../components/KnowledgeCard'
import type { ChatMessage, KnowledgeCard as KCard } from '../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { InfoButton } from '../components/InfoButton'

const QUICK_SUGGESTIONS = [
  'How to register?',
  'What ID do I need?',
  'Find my booth',
  'How does EVM work?',
]

function genId() {
  return Math.random().toString(36).slice(2)
}

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
  const endRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiTyping])

  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: user.language === 'hi'
          ? `नमस्ते! 👋 मैं VoteMate AI हूँ। मैं आपकी चुनाव संबंधी किसी भी सवाल में मदद कर सकता हूँ!`
          : `Hi${user.name ? `, ${user.name}` : ''}! 👋 I'm VoteMate AI. ${confusionMode ? "I'll keep things simple!" : "Ask me anything about voting in India."}`,
        timestamp: Date.now(),
        nextAction: 'Ask a question below',
      }
      addMessage(greeting)
    }
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    setShowSuggestions(false)
    const userMsg: ChatMessage = { id: genId(), role: 'user', content: text, timestamp: Date.now() }
    addMessage(userMsg)
    setInput('')
    setAiTyping(true)
    try {
      const ctx = getContext()
      const { content, nextAction } = await askAI(text, ctx, confusionMode)
      addMessage({ id: genId(), role: 'assistant', content, timestamp: Date.now(), nextAction, cards: pickCards(content) })
    } catch {
      addMessage({ id: genId(), role: 'assistant', content: getFallbackResponse(user.language), timestamp: Date.now() })
    } finally {
      setAiTyping(false)
    }
  }

  const handleVoice = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return alert('Voice input not supported in this browser.')
    const recognition = new SpeechRecognition()
    recognition.lang = user.language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e: any) => {
      const t = e.results[0][0].transcript
      setInput(t)
      sendMessage(t)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.start()
  }

  return (
    <div className="flex flex-col w-full min-h-full bg-slate-50 pb-[180px]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg border border-slate-200 shadow-sm">🤖</div>
        <div className="flex-1">
          <p className="text-slate-900 font-poppins font-semibold text-sm">VoteMate AI</p>
          <p className="text-slate-500 text-[10px] font-inter uppercase tracking-wider font-medium">
            {isAiTyping ? 'Thinking...' : 'Official Assistant'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InfoButton text="I can help with registration, polling booths, and election procedures." />
          <button
            onClick={() => setConfusionMode(!confusionMode)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-inter font-medium transition-all border ${
              confusionMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {confusionMode ? 'Simple' : 'Simplify?'}
          </button>
          <button onClick={clearChat} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex flex-col px-3 py-6 space-y-5">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] border bg-slate-900 border-slate-900 mb-1 shadow-sm">🤖</div>
              )}
              
              <div className={`flex flex-col gap-1 max-w-[85%] min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`w-full p-3.5 relative overflow-hidden ${
                    msg.role === 'user'
                      ? 'btn-gradient rounded-2xl rounded-br-sm shadow-md text-white'
                      : 'bg-white border border-slate-200 rounded-2xl rounded-bl-sm text-slate-800 shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        strong: ({ children }) => <strong className="font-semibold text-blue-800">{children}</strong>,
                        p: ({ children }) => <p className="mb-1.5 last:mb-0 text-[13px] font-inter leading-relaxed">{children}</p>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1 text-[13px]">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1 text-[13px]">{children}</ul>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-[13px] font-inter leading-relaxed">{msg.content}</p>
                  )}
                </div>

                {/* Assistant Next Action */}
                {msg.role === 'assistant' && msg.nextAction && !msg.nextAction.includes('Ask') && (
                  <div className="flex items-start gap-1.5 bg-blue-50 text-blue-800 text-[11px] px-3 py-2 rounded-xl font-inter flex-wrap shadow-sm border border-blue-100 mt-1">
                    <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span className="flex-1"><span className="font-semibold text-blue-900">Next: </span>{msg.nextAction}</span>
                  </div>
                )}

                {/* Knowledge Cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 w-full pt-1 scrollbar-hide">
                    {msg.cards.map((card) => (
                      <div key={card.title} className="flex-shrink-0 w-60">
                        <KnowledgeCard card={card} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isAiTyping && (
          <div className="flex items-end gap-2 w-full justify-start">
             <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] border bg-slate-900 border-slate-900 mb-1 shadow-sm">🤖</div>
             <TypingIndicator />
          </div>
        )}

        <div ref={endRef} className="h-4" />
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="fixed bottom-[66px] sm:bottom-[68px] z-30 left-1/2 -translate-x-1/2 w-full max-w-[480px]">
        <div className="bg-slate-50/90 backdrop-blur-md pt-2 pb-safe-offset-3 px-3 border-t border-slate-200/50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          {/* Quick suggestions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide px-1">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="whitespace-nowrap bg-white border border-slate-200 text-slate-700 text-xs font-inter font-medium px-3 py-1.5 rounded-full hover:border-slate-300 shadow-sm flex-shrink-0 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Quick mode shortcut */}
          <button
            onClick={() => navigate('quick')}
            className="w-full mb-3 flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-700 text-[11px] font-inter font-medium hover:bg-amber-100 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            Only have 1 minute? Switch to Quick Mode
          </button>

          {/* Input field */}
          <div className="flex items-center gap-2 bg-white rounded-full px-1.5 py-1.5 shadow-md border border-slate-200/60 mb-2">
            <button
              onClick={handleVoice}
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isListening ? 'bg-rose-500 text-white animate-pulse shadow-md' : 'text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask VoteMate AI..."
              className="flex-1 bg-transparent text-[13px] font-inter text-slate-800 placeholder-slate-400 focus:outline-none px-2"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isAiTyping}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all bg-slate-900 shadow-md disabled:opacity-30 disabled:shadow-none active:scale-[0.95]"
            >
              <Send className="w-3.5 h-3.5 text-white ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
