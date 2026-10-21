import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms'
import { EyeIcon } from '@/components/atoms/icons'
import { EmptyState, WorkCard } from '@/components/molecules'
import { WorkDetail } from '@/components/organisms'
import { workItemToPublicWork } from '@/lib/publicWork'
import { usePortfolio } from '@/state/PortfolioContext'
import type { PublicWork } from '@/types'

/** How a student's published work looks to a visitor. Renders the same
 *  WorkCard and WorkDetail the public search uses, so the preview is the real
 *  thing rather than a lookalike. */
export function PublicPreviewPage() {
  const navigate = useNavigate()
  const { workItems } = usePortfolio()
  const [selected, setSelected] = useState<PublicWork | null>(null)

  const published = workItems
    .filter(item => item.status === 'Approved')
    .map(workItemToPublicWork)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selected])

  if (selected) {
    return (
      <WorkDetail
        work={selected}
        backLabel="Back to public preview"
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <EyeIcon className="h-5 w-5 text-navy" />
            <div>
              <p className="text-sm font-semibold text-navy">Public preview</p>
              <p className="text-xs text-ink-faint">
                This is how your published portfolio appears to visitors.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <header className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="text-lg font-bold tracking-tight">Praxissy</span>
            <span className="text-xs text-white/65">Public portfolio</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              Selected work
            </p>
            <h2 className="text-2xl font-bold">Published work items</h2>
          </div>
          <span className="rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-faint">
            {published.length} published
          </span>
        </div>

        {published.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {published.map(work => (
              <WorkCard key={work.id} work={work} onOpen={() => setSelected(work)} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No public work items yet"
            body="Accepted work items will appear here."
          />
        )}

        <footer className="mt-12 border-t border-line pt-5 text-xs text-ink-faint">
          Public portfolio on Praxissy
        </footer>
      </main>
    </div>
  )
}
