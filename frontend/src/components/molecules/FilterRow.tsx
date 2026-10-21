import { UNIVERSITIES, LAB_TYPES, PROGRAMS } from '@/data/filters'
import type { Domain } from '@/types'

/** Presentational only — these filters are not wired to the result list yet. */
export function FilterRow({ domain }: { domain: Domain }) {
  const secondLabel = domain === 'labs' ? 'All Types' : 'All Programs'
  const secondOptions = domain === 'labs' ? LAB_TYPES : PROGRAMS

  const selectClass =
    'h-11 w-full cursor-pointer rounded-xl bg-white px-4 text-sm text-ink shadow-sm outline-none sm:w-52'

  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      <select className={selectClass} aria-label="Filter by university" defaultValue="">
        <option value="">All Universities</option>
        {UNIVERSITIES.map(name => (
          <option key={name}>{name}</option>
        ))}
      </select>
      <select className={selectClass} aria-label={`Filter by ${domain === 'labs' ? 'type' : 'program'}`} defaultValue="">
        <option value="">{secondLabel}</option>
        {secondOptions.map(name => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </div>
  )
}
