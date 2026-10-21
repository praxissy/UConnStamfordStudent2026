import { StatusIcon } from '@/components/atoms'
import { CommentCard } from '@/components/molecules'
import { REVIEWER } from '@/data/workItems'
import type { WorkItem, WorkItemStatus } from '@/types'

const STATUS_INFO: Record<WorkItemStatus, { label: string; color: string; bg: string }> = {
  Draft: { label: 'Draft', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
  'Under Review': { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  'Changes Requested': { label: 'Changes Requested', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  Approved: { label: 'Approved', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
}

function statusDescription(item: WorkItem): string {
  switch (item.status) {
    case 'Draft':
      return 'This work item is saved locally and has not been submitted for review.'
    case 'Under Review':
      return 'Your submission is being reviewed by the assigned lab manager. You will be notified when feedback is available.'
    case 'Changes Requested': {
      const count = item.comments.length
      return `Your reviewer has left ${count} comment${count !== 1 ? 's' : ''}. Address all open issues and resubmit.`
    }
    case 'Approved':
      return 'This work item has been approved and is visible on your public Praxissy profile. Approved work items cannot currently be edited.'
  }
}

function Panel({ title, trailing, children }: {
  title: string
  trailing?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</div>
        {trailing}
      </div>
      {children}
    </div>
  )
}

export function ReviewSidebar({ item, form, readOnly, resolvedMap, onToggleResolved }: {
  item: WorkItem
  form: WorkItem
  readOnly: boolean
  resolvedMap: Record<string, boolean>
  onToggleResolved: (commentId: string) => void
}) {
  const info = STATUS_INFO[form.status]
  const unresolved = item.comments.filter(comment => !resolvedMap[comment.id]).length

  const checklist = [
    { label: 'Work item title filled', done: form.title.length > 3 },
    { label: 'Category selected', done: form.category !== '' },
    { label: 'Description provided', done: form.description.length >= 100 },
    { label: 'Skills listed', done: form.skills.length > 0 },
    { label: 'University unit provided', done: form.university.length > 2 },
    { label: 'Timeframe specified', done: form.dateRange.length > 2 },
  ]
  const completion = Math.round((checklist.filter(entry => entry.done).length / checklist.length) * 100)

  const activity = [
    { action: 'Changes requested by reviewer', date: 'Sep 14, 2026', color: 'bg-red-400' },
    { action: 'Submitted for approval', date: 'Sep 10, 2026', color: 'bg-gold' },
    { action: 'Draft created', date: 'Sep 8, 2026', color: 'bg-slate-400' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-xl border p-4 ${info.bg}`}>
        <div className="flex items-start gap-3">
          <StatusIcon status={form.status} />
          <div>
            <div className={`text-sm font-semibold ${info.color}`}>{info.label}</div>
            <div className={`mt-0.5 text-xs leading-relaxed opacity-80 ${info.color}`}>
              {statusDescription(form)}
            </div>
          </div>
        </div>
        {form.status === 'Changes Requested' && unresolved > 0 && (
          <div className="mt-3 border-t border-red-200 pt-3 text-xs font-medium text-red-700">
            {unresolved} unresolved issue{unresolved !== 1 ? 's' : ''} — address all before resubmitting
          </div>
        )}
      </div>

      <Panel title="Assigned Reviewer">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
            {REVIEWER.avatar}
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">{REVIEWER.name}</div>
            <div className="text-xs text-ink-faint">{REVIEWER.role}</div>
          </div>
        </div>
        <div className="mt-3 border-t border-surface-muted pt-3 text-xs text-ink-ghost">
          Review usually completed within 5 business days after submission.
        </div>
      </Panel>

      <Panel
        title="Submission Checklist"
        trailing={
          <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-navy">
            {completion}% complete
          </span>
        }
      >
        <div className="flex flex-col gap-2">
          {checklist.map(entry => (
            <div key={entry.label} className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border
                  ${entry.done ? 'border-emerald-500 bg-emerald-500' : 'border-line'}`}
              >
                {entry.done && (
                  <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 5l2 2 4-4" />
                  </svg>
                )}
              </span>
              <span className={`text-xs ${entry.done ? 'text-ink-muted' : 'text-ink-ghost'}`}>{entry.label}</span>
            </div>
          ))}
        </div>
      </Panel>

      {item.comments.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-surface-muted px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Reviewer Feedback</div>
            <span className="text-xs text-ink-ghost">
              {item.comments.length} comment{item.comments.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-surface-muted">
            {item.comments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                resolved={resolvedMap[comment.id] ?? comment.resolved}
                disabled={readOnly}
                onToggle={() => onToggleResolved(comment.id)}
              />
            ))}
          </div>
        </div>
      )}

      <Panel title="Activity">
        <div className="flex flex-col gap-3">
          {activity.map(event => (
            <div key={event.action} className="flex items-start gap-2.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${event.color}`} />
              <div>
                <div className="text-xs text-ink">{event.action}</div>
                <div className="mt-0.5 text-xs text-ink-ghost">{event.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
