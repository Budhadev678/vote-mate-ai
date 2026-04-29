import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, ArrowLeft, RotateCcw, ChevronRight, Zap, MicOff, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import { askAI, getFallbackResponse } from '../services/aiService'
import { TypingIndicator } from '../components/TypingIndicator'
import { KnowledgeCard, QUICK_CARDS } from '../components/KnowledgeCard'
import type { ChatMessage, KnowledgeCard as KCard } from '../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const QUICK_SUGGESTIONS = [
  '📋 How to register?',
  '🪪 What ID do I need?',
  '📍 Find my booth',
  '🗳️ How does EVM work?',
  '📅 Election dates?',
  '🚨 Report violation',
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
  const [copied, setCopied] = useState<string | null>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isInitialMount = useRef(true)

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: isInitialMount.current ? 'auto' : 'smooth',
      })
      isInitialMount.current = false
    }
  }, [messages, isAiTyping])

  // Greet on open
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: genId(),
        role: 'assistant',
        content: user.language === 'hi'
          ? `नमस्ते${user.name ? ` ${user.name}` : ''}! 👋 मैं VoteMate AI हूँ। चुनाव से जुड़ा कोई भी सवाल पूछें।`
          : `Hi${user.name ? `, ${user.name}` : ''}! 👋 I'm **VoteMate AI** — your official election companion.\n\n${confusionMode ? "I'll keep my answers short and simple." : "Ask me anything about voting, registration, booths, or election rules."}`,
        timestamp: Date.now(),
      }
      addMessage(greeting)
    }
  }, [])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: ChatMessage = { id: genId(), role: 'user', content: trimmed, timestamp: Date.now() }
    addMessage(userMsg)
    setInput('')
    setAiTyping(true)
    try {
      const ctx = getContext()
      const { content, nextAction } = await askAI(trimmed, ctx, confusionMode)
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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 1500)
    })
  }

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    /* CRITICAL: flex-1 min-h-0 ensures this fills available space in the flex chain */
    <div className="flex-1 min-h-0 flex flex-col bg-slate-50">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={goBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-sm border border-slate-200"
          style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}>
          🤖
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-slate-900 font-poppins font-semibold text-sm">VoteMate AI</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isAiTyping ? (
              <span className="text-blue-500 text-[10px] font-inter font-medium animate-pulse">Thinking…</span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-400 text-[10px] font-inter font-medium uppercase tracking-wider">Online • Powered by Gemini</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setConfusionMode(!confusionMode)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-inter font-semibold transition-all border ${
              confusionMode
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {confusionMode ? '✓ Simple' : 'Simplify'}
          </button>
          <button
            onClick={clearChat}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Messages — flex-1 min-h-0 + overflow-y-auto = the magic combo ── */}
      <div
        ref={messagesRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot avatar */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 text-sm shadow-sm border border-slate-200"
                  style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}>
                  🤖
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[82%] min-w-0 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Bubble */}
                <div
                  className={`w-full px-3.5 py-2.5 rounded-2xl relative ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-sm shadow-md'
                      : 'bg-white border border-slate-200 rounded-bl-sm text-slate-800 shadow-sm'
                  }`}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg,#4f46e5,#db2777)' } : {}}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        strong: ({ children }) => <strong className="font-semibold text-indigo-800">{children}</strong>,
                        p: ({ children }) => <p className="mb-1.5 last:mb-0 text-[13px] font-inter leading-relaxed text-slate-800">{children}</p>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5 text-[13px] font-inter text-slate-800">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5 text-[13px] font-inter text-slate-800">{children}</ul>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        code: ({ children }) => <code className="bg-slate-100 px-1 py-0.5 rounded text-[12px] font-mono text-indigo-700">{children}</code>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-[13px] font-inter leading-relaxed">{msg.content}</p>
                  )}
                </div>

                {/* Next action hint */}
                {msg.role === 'assistant' && msg.nextAction && !msg.nextAction.toLowerCase().includes('ask') && (
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-800 text-[11px] px-3 py-1.5 rounded-xl font-inter w-full shadow-sm">
                    <ChevronRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span><span className="font-bold">Next: </span>{msg.nextAction}</span>
                  </div>
                )}

                {/* Knowledge cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 w-full scrollbar-hide">
                    {msg.cards.map((card) => (
                      <div key={card.title} className="flex-shrink-0 w-56">
                        <KnowledgeCard card={card} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Timestamp + copy action */}
                <div className={`flex items-center gap-2 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-slate-400 font-inter">{formatTime(msg.timestamp)}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {copied === msg.id
                        ? <span className="text-[10px] font-inter text-emerald-500">Copied!</span>
                        : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {/* User avatar */}
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 bg-slate-200 text-sm border border-slate-300">
                  {user.name ? user.name[0].toUpperCase() : '👤'}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isAiTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2 justify-start"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 text-sm shadow-sm border border-slate-200"
              style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5)' }}>
              🤖
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div className="h-1" />
      </div>

      {/* ── Bottom input panel ── */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-3 pt-3 pb-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {/* Quick suggestions (only on fresh chat) */}
        {messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 scrollbar-hide -mx-1 px-1">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ''))}
                className="whitespace-nowrap bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-inter font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 flex-shrink-0 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Quick mode banner */}
        <button
          onClick={() => navigate('quick')}
          className="w-full mb-2.5 flex items-center justify-center gap-2 py-2 rounded-xl text-amber-700 text-[11px] font-inter font-semibold hover:bg-amber-100 transition-colors border border-amber-200"
          style={{ background: 'rgba(254,243,199,0.6)' }}
        >
          <Zap className="w-3.5 h-3.5" />
          Only have 1 minute? Switch to Quick Mode
        </button>

        {/* Input row */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
          <button
            onClick={handleVoice}
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder={isListening ? 'Listening…' : 'Ask VoteMate AI…'}
            className="flex-1 bg-transparent text-[13px] font-inter text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isAiTyping}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 active:scale-[0.95]"
            style={{ background: !input.trim() || isAiTyping ? '#cbd5e1' : 'linear-gradient(135deg,#4f46e5,#db2777)' }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
