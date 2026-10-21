import { StatusBadge } from '@/components/atoms'
import { EyeIcon } from '@/components/atoms/icons'
import type { WorkItem } from '@/types'

/** The dashboard's own card — a student managing their work, not the public
 *  view. The public one is WorkCard. */
export function WorkItemCard({ item, onView, onEdit }: {
  item: WorkItem
  onView: () => void
  onEdit: () => void
}) {
  const openIssues = item.comments.filter(comment => !comment.resolved).length

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5 transition-all hover:border-line-strong hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-ink">{item.title}</h3>
          <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-ink-faint">{item.category}</span>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-ink-faint">{item.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {item.skills.slice(0, 4).map(skill => (
          <span key={skill} className="rounded-md border border-line px-2 py-0.5 text-xs font-medium text-ink-muted">
            {skill}
          </span>
        ))}
        {item.skills.length > 4 && (
          <span className="rounded-md border border-line px-2 py-0.5 text-xs text-ink-ghost">
            +{item.skills.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-surface-muted pt-1">
        <div className="text-xs text-ink-ghost">{item.dateRange}</div>
        <div className="flex items-center gap-2">
          {item.status === 'Changes Requested' && openIssues > 0 && (
            <span className="text-xs font-medium text-red-500">
              {openIssues} open issue{openIssues !== 1 ? 's' : ''}
            </span>
          )}
          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface-muted hover:text-navy"
          >
            <EyeIcon className="h-3.5 w-3.5" />
            View
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gold hover:bg-surface-muted hover:text-gold-deep"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
