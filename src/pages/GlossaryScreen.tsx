import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { glossary } from '../data/glossary'
import type { GlossaryTerm } from '../data/glossary'

const TAG_COLORS = {
  process: 'bg-blue-100 text-blue-700',
  legal: 'bg-red-100 text-red-700',
  body: 'bg-green-100 text-green-700',
}

const TAG_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'process', label: '⚙️ Process' },
  { value: 'legal', label: '⚖️ Legal' },
  { value: 'body', label: '🏛️ Bodies' },
]

export function GlossaryScreen() {
  const { goBack } = useStore()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = glossary.filter((term) => {
    const matchText =
      term.term.toLowerCase().includes(query.toLowerCase()) ||
      term.def.toLowerCase().includes(query.toLowerCase())
    const matchTag = activeFilter === 'all' || term.tag === activeFilter
    return matchText && matchTag
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div
        className="px-5 pt-8 pb-5"
        style={{ background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)' }}
      >
        <button onClick={goBack} className="text-white/80 mb-3 flex items-center gap-1 text-sm font-inter">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-poppins font-bold text-white">📖 Election Glossary</h1>
        <p className="text-teal-100 text-sm font-inter mt-1">
          {glossary.length} key terms explained simply
        </p>

        {/* Search bar */}
        <div className="mt-4 bg-white rounded-2xl flex items-center gap-2 px-3 py-2.5">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search terms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm font-inter text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {TAG_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-inter font-medium flex-shrink-0 transition-all ${
              activeFilter === f.value
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Terms list */}
      <div className="px-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-inter text-sm">No terms found for "{query}"</p>
          </div>
        ) : (
          filtered.map((term, i) => (
            <motion.div
              key={term.term}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === term.term ? null : term.term)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-poppins font-semibold text-gray-800">
                      {term.term}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-inter ${
                        TAG_COLORS[term.tag as keyof typeof TAG_COLORS]
                      }`}
                    >
                      {term.tagLabel}
                    </span>
                  </div>
                  {expanded !== term.term && (
                    <p className="text-xs font-inter text-gray-500 mt-1 line-clamp-1">
                      {term.def}
                    </p>
                  )}
                </div>
                <span className={`text-gray-400 transition-transform ${expanded === term.term ? 'rotate-90' : ''}`}>
                  ›
                </span>
              </button>

              <AnimatePresence>
                {expanded === term.term && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm font-inter text-gray-700 leading-relaxed border-t border-gray-100 pt-2">
                      {term.def}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
