import { WorkCard } from '@/components/molecules'
import type { Domain, PublicWork, ResultTab } from '@/types'

interface ResultsSectionProps {
  domain: Domain
  hasSearched: boolean
  tab: ResultTab
  labs: PublicWork[]
  students: PublicWork[]
  projects: PublicWork[]
  onTabChange: (tab: ResultTab) => void
  onOpen: (work: PublicWork) => void
}

function Grid({ items, emptyLabel, onOpen }: {
  items: PublicWork[]
  emptyLabel: string
  onOpen: (work: PublicWork) => void
}) {
  if (items.length === 0) {
    return <p className="py-16 text-center text-ink-ghost">{emptyLabel}</p>
  }
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map(work => (
        <WorkCard key={work.id} work={work} onOpen={() => onOpen(work)} />
      ))}
    </div>
  )
}

export function ResultsSection(props: ResultsSectionProps) {
  const { domain, hasSearched, tab, labs, students, projects, onTabChange, onOpen } = props

  const tabClass = (active: boolean) =>
    `w-full rounded-lg px-5 py-2 text-sm font-medium transition-all
     ${active ? 'bg-navy text-white' : 'text-ink-faint hover:text-ink'}`

  return (
    <section className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {domain === 'labs' ? (
          <>
            <h2 className="mb-2 text-2xl font-bold text-ink">
              {hasSearched
                ? `${labs.length} lab${labs.length !== 1 ? 's' : ''} found`
                : 'Featured University Labs'}
            </h2>
            {!hasSearched && (
              <p className="mb-8 text-sm text-ink-faint">
                Top-rated labs available for industry collaboration
              </p>
            )}
            <div className="mt-6">
              <Grid items={labs} emptyLabel="No labs match your search." onOpen={onOpen} />
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 grid w-full grid-cols-2 rounded-xl bg-white p-1 shadow-sm sm:w-96">
              <button onClick={() => onTabChange('students')} className={tabClass(tab === 'students')}>
                Students ({students.length})
              </button>
              <button onClick={() => onTabChange('projects')} className={tabClass(tab === 'projects')}>
                Projects ({projects.length})
              </button>
            </div>

            {tab === 'students' ? (
              <Grid items={students} emptyLabel="No students match your search." onOpen={onOpen} />
            ) : (
              <Grid items={projects} emptyLabel="No projects match your search." onOpen={onOpen} />
            )}
          </>
        )}
      </div>
    </section>
  )
}
