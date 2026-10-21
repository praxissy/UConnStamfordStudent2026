import { SearchIcon, SparkleIcon } from '@/components/atoms/icons'
import type { SearchMode } from '@/types'

export function SearchModeToggle({ mode, onChange }: {
  mode: SearchMode
  onChange: (mode: SearchMode) => void
}) {
  const base =
    'flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all'
  const off = 'text-white/50 hover:text-white/80'

  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="grid w-full max-w-md grid-cols-2 rounded-full bg-navy-mid p-1">
        <button
          onClick={() => onChange('standard')}
          className={`${base} ${mode === 'standard' ? 'bg-white text-navy shadow-sm' : off}`}
        >
          <SearchIcon className="h-3.5 w-3.5" />
          Standard Search
        </button>
        <button
          onClick={() => onChange('ai')}
          className={`${base} ${mode === 'ai' ? 'bg-gold text-white shadow-sm' : off}`}
        >
          <SparkleIcon className="h-3.5 w-3.5" />
          AI Search
        </button>
      </div>
    </div>
  )
}
