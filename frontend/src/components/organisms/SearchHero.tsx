import { Button } from '@/components/atoms'
import { PaperclipIcon, ArrowUpIcon, SparkleIcon } from '@/components/atoms/icons'
import { DomainSwitcher, FilterRow, SearchBar, SearchModeToggle } from '@/components/molecules'
import type { Domain, SearchMode } from '@/types'

interface SearchHeroProps {
  domain: Domain
  loggedIn: boolean
  mode: SearchMode
  query: string
  aiQuery: string
  suggestions: string[]
  title: string
  subtitle: string
  searchPlaceholder: string
  aiPlaceholder: string
  onDomainSwitch: (domain: Domain) => void
  onModeChange: (mode: SearchMode) => void
  onQueryChange: (value: string) => void
  onAiQueryChange: (value: string) => void
  onSearch: () => void
}

export function SearchHero(props: SearchHeroProps) {
  const {
    domain, loggedIn, mode, query, aiQuery, suggestions, title, subtitle,
    searchPlaceholder, aiPlaceholder,
    onDomainSwitch, onModeChange, onQueryChange, onAiQueryChange, onSearch,
  } = props

  return (
    <section className="bg-navy px-6 pb-10 pt-14">
      <div className="mx-auto max-w-3xl text-center">
        <DomainSwitcher domain={domain} locked={!loggedIn} onSwitch={onDomainSwitch} />

        <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mb-8 text-base text-white/50">{subtitle}</p>

        <SearchModeToggle mode={mode} onChange={onModeChange} />

        {mode === 'standard' ? (
          <div className="space-y-3">
            <SearchBar
              value={query}
              placeholder={searchPlaceholder}
              onChange={onQueryChange}
              onSubmit={onSearch}
            />
            <FilterRow domain={domain} />
            <Button variant="gold" onClick={onSearch} className="w-full rounded-xl sm:w-52">
              Search
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl bg-white p-4 text-left shadow-sm">
              <textarea
                value={aiQuery}
                onChange={event => onAiQueryChange(event.target.value)}
                placeholder={aiPlaceholder}
                aria-label={aiPlaceholder}
                rows={3}
                className="w-full resize-none text-sm text-ink placeholder-ink-ghost outline-none"
              />
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-surface-muted pt-3">
                <button className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-line-input px-3 text-xs text-ink-faint transition-colors hover:bg-surface-muted">
                  <PaperclipIcon className="h-3 w-3" />
                  Attach files
                </button>
                <button
                  onClick={onSearch}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-gold px-4 text-xs font-semibold text-white transition-colors hover:bg-gold-dark"
                >
                  <ArrowUpIcon className="h-3 w-3" />
                  Ask AI
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-full bg-navy-mid px-3 py-1.5 text-xs text-white/50">
                <SparkleIcon className="h-2.5 w-2.5 text-gold" />
                3 Free AI Searches remaining
              </span>
            </div>

            <p className="text-xs text-white/30">↓ Click below for search ideas</p>
            <div className="mt-1 flex flex-wrap justify-center gap-2">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    onAiQueryChange(suggestion)
                    onSearch()
                  }}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
