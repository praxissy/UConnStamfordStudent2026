import { useEffect } from 'react'
import { StatusBadge } from '@/components/atoms'
import { CloseIcon } from '@/components/atoms/icons'
import type { WorkItem } from '@/types'

export function WorkItemDetailsModal({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const links = [
    { label: 'GitHub Repository', href: item.links.github },
    { label: 'Website', href: item.links.website },
    { label: 'Documentation', href: item.links.docs },
  ].filter(link => link.href && /^https?:\/\//i.test(link.href))

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/55 p-4"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="work-item-details-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              <span className="text-xs text-ink-faint">{item.category}</span>
            </div>
            <h2 id="work-item-details-title" className="text-lg font-semibold text-ink sm:text-xl">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close work item details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-muted hover:text-navy"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {item.image && (
          <div className="h-48 overflow-hidden bg-surface-muted sm:h-56">
            <img src={item.image.src} alt={item.image.alt} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <dl className="grid grid-cols-1 gap-4 rounded-xl bg-surface-soft p-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-ink-ghost">Timeframe</dt>
              <dd className="mt-1 text-sm text-ink">{item.dateRange}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-ghost">Associated lab / university</dt>
              <dd className="mt-1 text-sm text-ink">{item.university}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-ink-ghost">Associated project</dt>
              <dd className="mt-1 text-sm text-ink">{item.parentProject}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-ink">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-ink">Skills &amp; Technologies</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.skills.map(skill => (
                <span key={skill} className="rounded-md border border-line px-2.5 py-1 text-xs font-medium text-ink-muted">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {links.length > 0 && (
            <div className="mt-5 border-t border-line pt-4">
              <h3 className="text-sm font-semibold text-ink">Links</h3>
              <div className="mt-2 flex flex-wrap gap-4">
                {links.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-gold hover:underline"
                  >
                    {link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
