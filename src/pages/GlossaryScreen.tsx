import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, X, ChevronRight, BookOpen } from 'lucide-react'
import { useStore } from '../store/useStore'
import { glossary } from '../data/glossary'

const TAG_COLORS = {
  process: 'bg-slate-100 text-slate-700',
  legal: 'bg-slate-100 text-slate-700',
  body: 'bg-slate-100 text-slate-700',
}

const TAG_FILTERS = [
  { value: 'all', label: 'All Terms' },
  { value: 'process', label: 'Process' },
  { value: 'legal', label: 'Legal' },
  { value: 'body', label: 'Bodies' },
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
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* Header */}
      <div className="px-5 pt-8 pb-8 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={goBack} className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-1.5 text-sm font-inter transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-poppins font-semibold text-slate-900">Election Glossary</h1>
            <p className="text-slate-500 text-xs font-inter mt-1 font-medium">Official terminology explained simply</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-6 bg-slate-100 rounded-2xl flex items-center gap-2 px-4 py-3.5 border border-slate-200/50">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm font-inter text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {TAG_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-inter font-semibold flex-shrink-0 transition-all border ${
              activeFilter === f.value
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Terms list */}
      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-poppins font-semibold text-slate-900">No results found</p>
            <p className="text-xs font-inter text-slate-400 mt-1">Try a different term or filter</p>
          </div>
        ) : (
          filtered.map((term, i) => (
            <motion.div
              key={term.term}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`bg-white rounded-2xl shadow-sm border transition-all ${
                expanded === term.term ? 'border-slate-300 ring-1 ring-slate-200/50' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setExpanded(expanded === term.term ? null : term.term)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[15px] font-poppins font-semibold text-slate-900">
                      {term.term}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-lg font-inter font-bold uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100"
                    >
                      {term.tagLabel}
                    </span>
                  </div>
                  {expanded !== term.term && (
                    <p className="text-xs font-inter text-slate-500 line-clamp-1 font-medium">
                      {term.def}
                    </p>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${expanded === term.term ? 'rotate-90 text-slate-900' : ''}`} />
              </button>

              <AnimatePresence>
                {expanded === term.term && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-50 mt-1">
                      <p className="text-sm font-inter text-slate-600 leading-relaxed font-medium">
                        {term.def}
                      </p>
                    </div>
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
