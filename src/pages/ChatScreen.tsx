import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, ArrowLeft, RotateCcw, ChevronRight, Zap, Sparkles } from 'lucide-react'
import { useStore } from '../store/useStore'
import { askAI, getFallbackResponse } from '../services/aiService'
import { TypingIndicator } from '../components/TypingIndicator'
import { KnowledgeCard, QUICK_CARDS } from '../components/KnowledgeCard'
import type { ChatMessage, KnowledgeCard as KCard } from '../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const isInitialMount = useRef(true)

  // Auto-scroll to bottom
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ 
        behavior: isInitialMount.current ? 'auto' : 'smooth' 
      })
      isInitialMount.current = false
    }
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
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Sticky Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm px-4 pt-3 pb-3 flex items-center gap-3 z-20">
        <button onClick={goBack} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-base border border-slate-300 shadow-sm flex-shrink-0">
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 font-poppins font-semibold text-sm truncate">VoteMate AI</p>
          <div className="flex items-center gap-1">
            {isAiTyping ? (
              <span className="text-blue-500 text-[10px] font-inter font-medium">Thinking...</span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                <span className="text-slate-400 text-[10px] font-inter uppercase tracking-wider font-medium">Online</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setConfusionMode(!confusionMode)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-inter font-medium transition-all border ${
              confusionMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {confusionMode ? '✓ Simple' : 'Simplify'}
          </button>
          <button onClick={clearChat} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm bg-slate-800 mb-0.5 shadow-sm">
                  🤖
                </div>
              )}
              
              <div className={`flex flex-col gap-1.5 max-w-[82%] min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`w-full px-3.5 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-sm shadow-md'
                      : 'bg-white border border-slate-200 rounded-bl-sm text-slate-800 shadow-sm'
                  }`}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #4F46E5, #DB2777)' } : {}}
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
                  <div className="flex items-start gap-1.5 bg-blue-50 text-blue-800 text-[11px] px-3 py-2 rounded-xl font-inter flex-wrap shadow-sm border border-blue-100">
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

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 font-inter px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm bg-slate-200 mb-0.5">
                  👤
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isAiTyping && (
          <div className="flex items-end gap-2 w-full justify-start">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm bg-slate-800 mb-0.5 shadow-sm">🤖</div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={endRef} className="h-2" />
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-3 pt-3 pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-20">
        {/* Quick suggestions */}
        {showSuggestions && messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="whitespace-nowrap bg-slate-50 border border-slate-200 text-slate-700 text-xs font-inter font-medium px-3 py-2 rounded-full hover:bg-slate-100 hover:border-slate-300 shadow-sm flex-shrink-0 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Quick mode shortcut */}
        <button
          onClick={() => navigate('quick')}
          className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 text-amber-700 text-[11px] font-inter font-semibold hover:bg-amber-50 transition-colors"
          style={{ background: 'rgba(254, 243, 199, 0.5)' }}
        >
          <Zap className="w-3.5 h-3.5" />
          Only have 1 minute? Switch to Quick Mode
        </button>

        {/* Input field */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-2 py-2 border border-slate-200 shadow-inner">
          <button
            onClick={handleVoice}
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              isListening ? 'bg-rose-500 text-white animate-pulse shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask VoteMate AI..."
            className="flex-1 bg-transparent text-[13px] font-inter text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isAiTyping}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm disabled:opacity-30 disabled:shadow-none active:scale-[0.95]"
            style={{ background: !input.trim() || isAiTyping ? '#94a3b8' : 'linear-gradient(135deg, #4F46E5, #DB2777)' }}
          >
            <Send className="w-3.5 h-3.5 text-white ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
